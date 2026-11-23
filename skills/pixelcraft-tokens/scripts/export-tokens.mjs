#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const formats = ['css', 'tailwind', 'swift', 'kotlin', 'dart', 'python', 'qt', 'textual'];

function help() {
  return `Usage: node export-tokens.mjs <tokens.json> --format <${formats.join('|')}|all> [--mode NAME] [--out-dir DIR]

Zero-dependency exporter for the common DTCG 2025.10 subset used by Pixelcraft.
Without --out-dir, generated text is written to stdout. Advanced DTCG features
such as advanced tool-specific extensions should be handled by a dedicated compiler.
Pixelcraft token-level mode overrides use $extensions.pixelcraft.modes.`;
}

function camel(parts) {
  return parts.map((p, i) => {
    const clean = p.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
    return i === 0 ? clean : clean.charAt(0).toUpperCase() + clean.slice(1);
  }).join('');
}
const kebab = (parts) => parts.join('-').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

function flatten(node, parts = [], inheritedType = '', out = []) {
  const type = node.$type || inheritedType;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || typeof value !== 'object' || value === null || Array.isArray(value)) continue;
    const next = [...parts, key];
    if (Object.hasOwn(value, '$value')) out.push({ path: next, type: value.$type || type, token: value });
    else flatten(value, next, type, out);
  }
  return out;
}

function gamma(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}
function oklchToRgb(L, C, H) {
  const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541729 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  ].map((v) => Math.max(0, Math.min(1, v)));
}
function rgbHex(rgb, alpha = 1) {
  const vals = [...rgb, alpha].map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'));
  return `#${vals.slice(0, 3).join('')}${alpha < 1 ? vals[3] : ''}`;
}
function alphaByte(alpha) {
  return Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');
}
function argbHex(color) {
  return `${alphaByte(color.alpha ?? 1)}${color.hex.slice(1, 7)}`;
}
function fmtNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}
function durationMs(value) {
  const amount = Number(value.value);
  if (value.unit === 'ms') return amount;
  if (value.unit === 's') return amount * 1000;
  throw new Error(`unsupported duration unit '${value.unit}'`);
}

function colorParts(value) {
  if (typeof value === 'string') return { hex: value, css: value, rgb: null, alpha: 1 };
  const space = value.colorSpace;
  const alpha = value.alpha ?? 1;
  if (space === 'srgb') {
    const rgb = value.components.map(Number);
    return { rgb, alpha, hex: rgbHex(rgb, alpha), css: rgbHex(rgb, alpha) };
  }
  if (space === 'oklch') {
    const [L, C] = value.components.map(Number);
    const rawHue = value.components[2];
    const H = rawHue === 'none' ? 0 : Number(rawHue);
    const rgb = oklchToRgb(L, C, H);
    return { rgb, alpha, hex: rgbHex(rgb, alpha), css: `oklch(${L} ${C} ${H}${alpha < 1 ? ` / ${alpha}` : ''})` };
  }
  throw new Error(`unsupported colorSpace '${space}'`);
}

function scalar(token, type) {
  const v = token.$value;
  if (type === 'color') return colorParts(v);
  if (typeof v === 'object' && v !== null && 'value' in v && 'unit' in v) return `${v.value}${v.unit}`;
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function applyMode(token, mode) {
  if (!mode) return token;
  const replacement = token.token.$extensions?.pixelcraft?.modes?.[mode];
  if (replacement === undefined) return token;
  const value = replacement && typeof replacement === 'object' && Object.hasOwn(replacement, '$value') ? replacement.$value : replacement;
  return { ...token, token: { ...token.token, $value: value } };
}

function createResolver(tokens) {
  const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));
  const resolving = new Set();
  return function resolve(t) {
    const v = t.token.$value;
    if (typeof v !== 'string' || !/^\{[^}]+\}$/.test(v)) return t;
    const key = v.slice(1, -1);
    if (resolving.has(key)) throw new Error(`reference cycle at ${key}`);
    const target = byPath.get(key);
    if (!target) throw new Error(`unresolved token reference {${key}}`);
    resolving.add(key);
    const resolved = resolve(target);
    resolving.delete(key);
    return { ...t, type: t.type || resolved.type, token: { ...t.token, $value: resolved.token.$value } };
  };
}

function collect(file, mode) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const flattened = flatten(data);
  const modes = new Set();
  for (const token of flattened) {
    for (const name of Object.keys(token.token.$extensions?.pixelcraft?.modes || {})) modes.add(name);
  }
  if (mode && !modes.has(mode)) throw new Error(`unknown --mode ${mode}`);
  const resolveBase = createResolver(flattened);
  const baseTokens = flattened.map((token) => resolveBase(token));
  const tokens = flattened.map((token, index) => {
    const typed = token.type ? token : { ...token, type: baseTokens[index].type };
    return applyMode(typed, mode);
  });
  const resolveTokens = createResolver(tokens);
  return tokens.map((token) => resolveTokens(token));
}

function entries(tokens) {
  const list = tokens.map((t) => ({ ...t, name: camel(t.path), varName: kebab(t.path), value: scalar(t.token, t.type) }));
  const seen = new Map();
  for (const t of list) {
    for (const [kind, identifier] of [['identifier', t.name], ['variable', t.varName]]) {
      const key = `${kind}:${identifier}`;
      const previous = seen.get(key);
      const current = t.path.join('.');
      if (previous) throw new Error(`token collision: '${previous}' and '${current}' both map to ${kind} '${identifier}'`);
      seen.set(key, current);
    }
  }
  return list;
}

function render(format, list) {
  const colors = list.filter((t) => t.type === 'color');
  if (format === 'css' || format === 'tailwind') {
    const body = list.map((t) => `  --${t.varName}: ${typeof t.value === 'object' ? t.value.css : t.value};`).join('\n');
    return format === 'css' ? `:root {\n${body}\n}\n` : `@theme {\n${body}\n}\n`;
  }
  if (format === 'swift') {
    const lines = list.map((t) => {
      if (t.type === 'color') {
        const [r, g, b] = t.value.rgb || [0, 0, 0];
        return `  public static let ${t.name} = Color(red: ${r.toFixed(4)}, green: ${g.toFixed(4)}, blue: ${b.toFixed(4)}, opacity: ${t.value.alpha ?? 1})`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        const ms = durationMs(t.token.$value);
        return `  public static let ${t.name}: TimeInterval = ${fmtNumber(ms / 1000)} // seconds`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) return `  public static let ${t.name}: Double = ${t.token.$value.value} // ${t.token.$value.unit}`;
      return `  public static let ${t.name} = ${JSON.stringify(String(t.value))}`;
    });
    return `import Foundation\nimport SwiftUI\n\npublic enum PixelcraftTokens {\n${lines.join('\n')}\n}\n`;
  }
  if (format === 'kotlin') {
    const hasDuration = list.some((t) => t.type === 'duration');
    const lines = list.map((t) => {
      if (t.type === 'color') return `val ${t.name} = Color(0x${argbHex(t.value)})`;
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `val ${t.name} = ${fmtNumber(durationMs(t.token.$value))}.milliseconds`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const unit = t.path.join('.').includes('font.size') ? 'sp' : 'dp';
        return `val ${t.name} = ${t.token.$value.value}.${unit}`;
      }
      return `val ${t.name} = ${JSON.stringify(String(t.value))}`;
    });
    const durationImport = hasDuration ? 'import kotlin.time.Duration.Companion.milliseconds\n' : '';
    return `import androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.dp\nimport androidx.compose.ui.unit.sp\n${durationImport}\n${lines.join('\n')}\n`;
  }
  if (format === 'dart') {
    const lines = list.map((t) => {
      if (t.type === 'color') return `static const Color ${t.name} = Color(0x${argbHex(t.value)});`;
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        const ms = durationMs(t.token.$value);
        const constructor = Number.isInteger(ms) ? `Duration(milliseconds: ${fmtNumber(ms)})` : `Duration(microseconds: ${Math.round(ms * 1000)})`;
        return `static const Duration ${t.name} = ${constructor};`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) return `static const double ${t.name} = ${t.token.$value.value}; // ${t.token.$value.unit}`;
      return `static const String ${t.name} = ${JSON.stringify(String(t.value))};`;
    });
    return `import 'dart:ui';\n\nclass PixelcraftTokens {\n  ${lines.join('\n  ')}\n}\n`;
  }
  if (format === 'python') {
    const obj = {};
    for (const t of list) obj[t.varName] = t.type === 'color' ? t.value.hex : String(t.value);
    return `PIXELCRAFT_TOKENS = ${JSON.stringify(obj, null, 2)}\n`;
  }
  if (format === 'qt') {
    const lines = list.map((t) => `@${t.varName}: ${t.type === 'color' ? t.value.hex : t.value};`);
    return `/* QSS has no runtime variables. Treat this file as preprocessor input. */\n${lines.join('\n')}\n`;
  }
  if (format === 'textual') {
    return list.map((t) => `$${t.varName}: ${t.type === 'color' ? t.value.hex : t.value};`).join('\n') + '\n';
  }
  throw new Error(`unknown format ${format}`);
}

try {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) { console.log(help()); process.exit(0); }
  const input = args.find((a) => !a.startsWith('-'));
  if (!input) throw new Error('missing tokens.json input');
  const valueOptions = ['--format', '--mode', '--out-dir'];
  const knownOptions = new Set([...valueOptions, '--help', '-h']);
  const getOpt = (name) => {
    const i = args.indexOf(name);
    if (i >= 0) {
      const value = args[i + 1];
      return value !== undefined && !knownOptions.has(value) ? value : '';
    }
    const inline = args.find((a) => a.startsWith(`${name}=`));
    return inline?.slice(name.length + 1);
  };
  for (const name of valueOptions) {
    const specified = args.includes(name) || args.some((a) => a.startsWith(`${name}=`));
    if (specified && !getOpt(name)) throw new Error(`${name} requires a value`);
  }
  const format = getOpt('--format') || 'all';
  if (![...formats, 'all'].includes(format)) throw new Error(`unknown --format ${format}`);
  const selected = format === 'all' ? formats : [format];
  const mode = getOpt('--mode');
  const list = entries(collect(input, mode));
  const outDir = getOpt('--out-dir');
  if (outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    for (const f of selected) {
      const extensions = { css: 'css', tailwind: 'tailwind.css', swift: 'swift', kotlin: 'kt', dart: 'dart', python: 'py', qt: 'qt', textual: 'textual' };
      const file = path.join(outDir, `tokens${mode ? `.${mode}` : ''}.${extensions[f]}`);
      fs.writeFileSync(file, render(f, list));
      console.log(`wrote ${file}`);
    }
  } else {
    for (const f of selected) console.log(`/* ${f}${mode ? ` mode=${mode}` : ''} */\n${render(f, list)}`);
  }
} catch (error) {
  console.error(`export-tokens: ${error.message}`);
  process.exit(1);
}
