#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const formats = [
  'css', 'tailwind', 'swift', 'kotlin', 'dart', 'python', 'qt', 'textual',
  'ts', 'scss', 'xaml', 'android-xml', 'rust',
  'go-lipgloss', 'godot', 'unity-uss', 'slint', 'gtk4', 'typst',
];

const extensions = {
  css: 'css',
  tailwind: 'tailwind.css',
  swift: 'swift',
  kotlin: 'kt',
  dart: 'dart',
  python: 'py',
  qt: 'qt',
  textual: 'textual',
  ts: 'ts',
  scss: 'scss',
  xaml: 'xaml',
  'android-xml': 'xml',
  rust: 'rs',
  'go-lipgloss': 'go',
  godot: 'gd',
  'unity-uss': 'uss',
  slint: 'slint',
  gtk4: 'css',
  typst: 'typ',
};

function outputFileName(format, mode) {
  const modePart = mode ? `.${mode}` : '';
  if (format === 'gtk4') return `tokens${modePart}-gtk4.css`;
  return `tokens${modePart}.${extensions[format]}`;
}

const genericFontFamilies = new Set([
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
  'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong',
]);

function help() {
  return `Usage: node export-tokens.mjs <tokens.json> --format <${formats.join('|')}|all> [--mode NAME] [--selector SEL] [--preserve-references] [--out-dir DIR]

Zero-dependency exporter for the common DTCG 2025.10 subset used by Pixelcraft
(including $root group base tokens and non-fatal $deprecated warnings to stderr).
Without --out-dir, generated text is written to stdout. Advanced DTCG features
such as advanced tool-specific extensions should be handled by a dedicated compiler.
Pixelcraft token-level mode overrides use $extensions.pixelcraft.modes.

Options:
  --format NAME          Output format (${formats.join(', ')}, or all; default: all)
  --mode NAME            Apply mode overrides from $extensions.pixelcraft.modes
  --selector SEL         CSS selector wrapper for --format css (default: :root)
  --preserve-references  Emit var(--...) / $... aliases for direct token references in CSS/Tailwind/SCSS/USS
  --out-dir DIR          Write generated files to DIR instead of stdout
  --help                 Show this help`;
}

function camel(parts) {
  return parts.map((p, i) => {
    const clean = p.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
    return i === 0 ? clean : clean.charAt(0).toUpperCase() + clean.slice(1);
  }).join('');
}
const kebab = (parts) => parts.join('-').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
const pascal = (name) => name.charAt(0).toUpperCase() + name.slice(1);
const snake = (varName) => varName.replace(/-/g, '_');
const rustConst = (varName) => {
  const upper = varName.replace(/-/g, '_').toUpperCase();
  return /^\d/.test(upper) ? `_${upper}` : upper;
};
const xmlEscape = (text) => String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function flatten(node, parts = [], inheritedType = '', out = [], inheritedDeprecated = false) {
  const type = node.$type || inheritedType;
  const groupDeprecated = node.$deprecated !== undefined ? node.$deprecated : inheritedDeprecated;
  if (parts.length > 0 && Object.hasOwn(node, '$root') && typeof node.$root === 'object' && node.$root !== null
      && !Array.isArray(node.$root) && Object.hasOwn(node.$root, '$value')) {
    const rootDeprecated = node.$root.$deprecated !== undefined ? node.$root.$deprecated : groupDeprecated;
    out.push({ path: parts, type: node.$root.$type || type, token: node.$root, isRoot: true, deprecated: rootDeprecated });
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || typeof value !== 'object' || value === null || Array.isArray(value)) continue;
    const next = [...parts, key];
    if (Object.hasOwn(value, '$value')) {
      const tokDeprecated = value.$deprecated !== undefined ? value.$deprecated : groupDeprecated;
      out.push({ path: next, type: value.$type || type, token: value, deprecated: tokDeprecated });
    } else {
      flatten(value, next, type, out, groupDeprecated);
    }
  }
  return out;
}

function gamma(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}
function linearize(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function oklabToRgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541729 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ].map((v) => Math.max(0, Math.min(1, v)));
}
function oklchToRgb(L, C, H) {
  const a = C * Math.cos(H * Math.PI / 180);
  const b = C * Math.sin(H * Math.PI / 180);
  return oklabToRgb(L, a, b);
}
function displayP3ToRgb(r, g, b) {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  return [
    gamma(1.2249401763 * lr - 0.2249401763 * lg),
    gamma(-0.0420569547 * lr + 1.0420569547 * lg),
    gamma(-0.0196375546 * lr - 0.0786360456 * lg + 1.0982736002 * lb),
  ].map((v) => Math.max(0, Math.min(1, v)));
}
function hslToRgb(H, S, L) {
  const h = ((H % 360) + 360) % 360;
  const s = Math.max(0, Math.min(100, S)) / 100;
  const l = Math.max(0, Math.min(100, L)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m].map((v) => Math.max(0, Math.min(1, v)));
}
function rgbHex(rgb, alpha = 1) {
  const vals = [...rgb, alpha].map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'));
  return `#${vals.slice(0, 3).join('')}${alpha < 1 ? vals[3] : ''}`;
}
function alphaByte(alpha) {
  return Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');
}
function parseHexString(str) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(str.trim());
  if (!m) return null;
  let hex = m[1].toLowerCase();
  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map((ch) => ch + ch).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return { rgb: [r, g, b], alpha, hex: `#${hex.slice(0, 6)}${hex.length === 8 ? hex.slice(6, 8) : ''}`, css: str.trim() };
}
function requireTypedColor(token, format) {
  if (!token.value.rgb) {
    throw new Error(
      `color token '${token.path.join('.')}' uses non-hex string '${token.value.css}' which cannot be exported to ${format}; use #rrggbb/#rrggbbaa hex or a DTCG color object`
    );
  }
  return token.value;
}
function argbHex(color) {
  return `${alphaByte(color.alpha ?? 1)}${color.hex.slice(1, 7)}`;
}
function fmtNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}
function fmtFloat(value) {
  const formatted = fmtNumber(value);
  return formatted.includes('.') ? formatted : `${formatted}.0`;
}
function durationMs(value) {
  const amount = Number(value.value);
  if (value.unit === 'ms') return amount;
  if (value.unit === 's') return amount * 1000;
  throw new Error(`unsupported duration unit '${value.unit}'`);
}
function isFontSizePath(parts) {
  return /(?:^|\.)(?:font\.size|text\.size|typography)(?:\.|$)/i.test(parts.join('.'));
}
function nativeDimension(dim) {
  const amount = Number(dim.value);
  if (dim.unit === 'rem') {
    return { value: amount * 16, comment: `${amount}rem @ 16px base`, converted: true };
  }
  return { value: amount, comment: dim.unit, converted: false };
}

function componentNumber(value) {
  return value === 'none' ? 0 : Number(value);
}

function colorParts(value) {
  if (typeof value === 'string') {
    const parsed = parseHexString(value);
    if (parsed) return parsed;
    return { hex: value, css: value, rgb: null, alpha: 1 };
  }
  const space = value.colorSpace;
  const alpha = value.alpha ?? 1;
  const explicitFallback = typeof value.hex === 'string' ? parseHexString(value.hex) : null;
  const resolveRgb = (computed) => {
    if (explicitFallback) {
      return {
        rgb: explicitFallback.rgb,
        hex: rgbHex(explicitFallback.rgb, value.alpha !== undefined ? alpha : explicitFallback.alpha),
      };
    }
    return { rgb: computed, hex: rgbHex(computed, alpha) };
  };
  if (space === 'srgb') {
    const rgb = value.components.map(componentNumber);
    const out = resolveRgb(rgb);
    return { ...out, alpha, css: out.hex };
  }
  if (space === 'oklch') {
    const [L, C, H] = value.components.map(componentNumber);
    const out = resolveRgb(oklchToRgb(L, C, H));
    return { ...out, alpha, css: `oklch(${L} ${C} ${H}${alpha < 1 ? ` / ${alpha}` : ''})` };
  }
  if (space === 'oklab') {
    const [L, a, b] = value.components.map(componentNumber);
    const out = resolveRgb(oklabToRgb(L, a, b));
    return { ...out, alpha, css: `oklab(${L} ${a} ${b}${alpha < 1 ? ` / ${alpha}` : ''})` };
  }
  if (space === 'display-p3') {
    const [r, g, b] = value.components.map(componentNumber);
    const out = resolveRgb(displayP3ToRgb(r, g, b));
    return { ...out, alpha, css: `color(display-p3 ${r} ${g} ${b}${alpha < 1 ? ` / ${alpha}` : ''})` };
  }
  if (space === 'hsl') {
    const [H, S, L] = value.components.map(componentNumber);
    const out = resolveRgb(hslToRgb(H, S, L));
    return { ...out, alpha, css: `hsl(${H} ${S}% ${L}%${alpha < 1 ? ` / ${alpha}` : ''})` };
  }
  throw new Error(`unsupported colorSpace '${space}'`);
}

function formatFontFamilyItem(item) {
  const trimmed = String(item).trim().replace(/^['"]|['"]$/g, '').trim();
  if (!trimmed) return '';
  if (genericFontFamilies.has(trimmed.toLowerCase()) || /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(trimmed)) {
    return trimmed;
  }
  return `"${trimmed.replace(/"/g, '\\"')}"`;
}

function formatFontFamily(v) {
  const list = Array.isArray(v) ? v : [v];
  return list.map(formatFontFamilyItem).filter(Boolean).join(', ');
}

function formatDimOrScalar(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'object' && 'value' in v && 'unit' in v) return `${v.value}${v.unit}`;
  return String(v);
}

function formatShadowLayer(layer) {
  const parts = [];
  if (layer.inset) parts.push('inset');
  parts.push(formatDimOrScalar(layer.offsetX ?? { value: 0, unit: 'px' }));
  parts.push(formatDimOrScalar(layer.offsetY ?? { value: 0, unit: 'px' }));
  if (layer.blur !== undefined) parts.push(formatDimOrScalar(layer.blur));
  if (layer.spread !== undefined) parts.push(formatDimOrScalar(layer.spread));
  if (layer.color !== undefined) parts.push(colorParts(layer.color).css);
  return parts.join(' ');
}

function formatCubicBezier(v) {
  return Array.isArray(v) && v.length === 4 ? `cubic-bezier(${v.join(', ')})` : String(v);
}

function formatComposite(type, v) {
  if (type === 'shadow') {
    const layers = Array.isArray(v) ? v : [v];
    return layers.map(formatShadowLayer).join(', ');
  }
  if (type === 'border') {
    const width = formatDimOrScalar(v.width ?? { value: 1, unit: 'px' });
    const style = typeof v.style === 'string' ? v.style : (v.style?.dashArray ? 'dashed' : 'solid');
    const color = v.color !== undefined ? colorParts(v.color).css : 'currentColor';
    return `${width} ${style} ${color}`;
  }
  if (type === 'transition') {
    const parts = [];
    if (v.duration !== undefined) parts.push(formatDimOrScalar(v.duration));
    if (v.timingFunction !== undefined) parts.push(formatCubicBezier(v.timingFunction));
    if (v.delay !== undefined) parts.push(formatDimOrScalar(v.delay));
    return parts.join(' ');
  }
  if (type === 'gradient' && Array.isArray(v)) {
    const stops = v.map((stop) => {
      const col = colorParts(stop.color).css;
      const pct = stop.position !== undefined ? ` ${fmtNumber(Number(stop.position) * 100)}%` : '';
      return `${col}${pct}`;
    });
    return `linear-gradient(${stops.join(', ')})`;
  }
  if (type === 'typography') {
    const parts = [];
    if (v.fontStyle) parts.push(String(v.fontStyle));
    if (v.fontWeight !== undefined) parts.push(String(v.fontWeight));
    const size = formatDimOrScalar(v.fontSize);
    const lh = v.lineHeight !== undefined ? `/${formatDimOrScalar(v.lineHeight)}` : '';
    if (size) parts.push(`${size}${lh}`);
    if (v.fontFamily !== undefined) parts.push(formatFontFamily(v.fontFamily));
    return parts.join(' ');
  }
  return null;
}

function scalar(token, type) {
  const v = token.$value;
  if (type === 'color') return colorParts(v);
  if (type === 'cubicBezier') return formatCubicBezier(v);
  if (type === 'fontFamily') return formatFontFamily(v);
  const composite = typeof v === 'object' && v !== null ? formatComposite(type, v) : null;
  if (composite !== null) return composite;
  if (typeof v === 'object' && v !== null && 'value' in v && 'unit' in v) return `${v.value}${v.unit}`;
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object' && v !== null) return JSON.stringify(v);
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
  const byPath = new Map();
  for (const t of tokens) {
    const key = t.path.join('.');
    byPath.set(key, t);
    if (t.isRoot) byPath.set(`${key}.$root`, t);
  }
  const resolving = new Set();

  function resolveValue(val) {
    if (typeof val === 'string' && /^\{[^}]+\}$/.test(val)) {
      const key = val.slice(1, -1);
      if (resolving.has(key)) throw new Error(`reference cycle at ${key}`);
      const target = byPath.get(key);
      if (!target) throw new Error(`unresolved token reference {${key}}`);
      resolving.add(key);
      const resolved = resolve(target);
      resolving.delete(key);
      return { value: resolved.token.$value, type: resolved.type };
    }
    if (Array.isArray(val)) {
      return { value: val.map((item) => resolveValue(item).value), type: '' };
    }
    if (val && typeof val === 'object') {
      const next = {};
      for (const [k, v] of Object.entries(val)) next[k] = resolveValue(v).value;
      return { value: next, type: '' };
    }
    return { value: val, type: '' };
  }

  function resolve(t) {
    const raw = t.token.$value;
    const directRef = typeof raw === 'string' && /^\{[^}]+\}$/.test(raw) ? raw.slice(1, -1) : null;
    const resolved = resolveValue(raw);
    return {
      ...t,
      type: t.type || resolved.type,
      refKey: directRef,
      token: { ...t.token, $value: resolved.value },
    };
  }
  return resolve;
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

function tailwindNamespaceName(token) {
  const name = token.varName;
  if (token.type === 'color') {
    if (name.startsWith('color-')) return name;
    return `color-${name.replace(/(^|-)color-/, '$1')}`;
  }
  if (token.type === 'fontFamily') {
    if (name.startsWith('font-family-')) return `font-${name.slice('font-family-'.length)}`;
    if (name.startsWith('font-')) return name;
    return `font-${name}`;
  }
  if (token.type === 'cubicBezier') {
    if (name.startsWith('ease-')) return name;
    return `ease-${name.replace(/^(?:motion-)?(?:easing|ease)-/, '')}`;
  }
  if (token.type === 'shadow') {
    if (name.startsWith('shadow-')) return name;
    return `shadow-${name}`;
  }
  if (token.type === 'dimension') {
    if (name.startsWith('spacing-')) return name;
    if (name.startsWith('space-')) return `spacing-${name.slice('space-'.length)}`;
    if (/(^|-)space-/.test(name)) return `spacing-${name.replace(/(^|-)space-/, '$1')}`;
    if (name.startsWith('radius-')) return name;
    if (/(^|-)radius(?:-|$)/.test(name)) {
      const stripped = name.replace(/(^|-)radius(?:-|$)/, '$1').replace(/-$/, '');
      return stripped ? `radius-${stripped}` : name;
    }
    if (name.startsWith('font-size-')) return `text-${name.slice('font-size-'.length)}`;
    if (name.startsWith('text-')) return name;
  }
  return name;
}

function entries(tokens) {
  const list = tokens.map((t) => ({
    ...t,
    pathKey: t.path.join('.'),
    name: camel(t.path),
    varName: kebab(t.path),
    value: scalar(t.token, t.type),
  }));
  const seen = new Map();
  for (const t of list) {
    for (const [kind, identifier] of [['identifier', t.name], ['variable', t.varName]]) {
      const key = `${kind}:${identifier}`;
      const previous = seen.get(key);
      if (previous) throw new Error(`token collision: '${previous}' and '${t.pathKey}' both map to ${kind} '${identifier}'`);
      seen.set(key, t.pathKey);
    }
  }
  const twUsed = new Set();
  for (const t of list) {
    let candidate = tailwindNamespaceName(t);
    if (twUsed.has(candidate)) candidate = t.varName;
    twUsed.add(candidate);
    t.twVarName = candidate;
  }
  return list;
}

function render(format, list, options = {}) {
  const selector = options.selector || ':root';
  const preserveReferences = Boolean(options.preserveReferences);
  const byPathKey = new Map(list.map((t) => [t.pathKey, t]));
  const lookupRef = (refKey) => {
    if (!preserveReferences || !refKey) return null;
    return byPathKey.get(refKey) || byPathKey.get(refKey.replace(/\.\$root$/, '')) || null;
  };

  if (format === 'css' || format === 'tailwind') {
    const body = list.map((t) => {
      const target = lookupRef(t.refKey);
      const varName = format === 'tailwind' ? t.twVarName : t.varName;
      const val = target
        ? `var(--${format === 'tailwind' ? target.twVarName : target.varName})`
        : (typeof t.value === 'object' ? t.value.css : t.value);
      return `  --${varName}: ${val};`;
    }).join('\n');
    return format === 'css' ? `${selector} {\n${body}\n}\n` : `@theme {\n${body}\n}\n`;
  }
  if (format === 'scss') {
    return `${list.map((t) => {
      const target = lookupRef(t.refKey);
      const val = target ? `$${target.varName}` : (typeof t.value === 'object' ? t.value.css : t.value);
      return `$${t.varName}: ${val};`;
    }).join('\n')}\n`;
  }
  if (format === 'ts') {
    const lines = list.map((t) => {
      const val = typeof t.value === 'object' ? t.value.css : String(t.value);
      return `  ${t.name}: ${JSON.stringify(val)},`;
    });
    return `export const pixelcraftTokens = {\n${lines.join('\n')}\n} as const;\n\nexport type PixelcraftTokenName = keyof typeof pixelcraftTokens;\nexport type PixelcraftTokenValue = (typeof pixelcraftTokens)[PixelcraftTokenName];\n`;
  }
  if (format === 'swift') {
    const lines = list.map((t) => {
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'swift');
        const [r, g, b] = col.rgb;
        return `  public static let ${t.name} = Color(red: ${r.toFixed(4)}, green: ${g.toFixed(4)}, blue: ${b.toFixed(4)}, opacity: ${fmtNumber(col.alpha ?? 1)})`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        const ms = durationMs(t.token.$value);
        return `  public static let ${t.name}: TimeInterval = ${fmtNumber(ms / 1000)} // seconds`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `  public static let ${t.name}: CGFloat = ${fmtNumber(dim.value)} // ${dim.comment}`;
      }
      return `  public static let ${t.name} = ${JSON.stringify(String(t.value))}`;
    });
    return `import Foundation\nimport SwiftUI\n\npublic enum PixelcraftTokens {\n${lines.join('\n')}\n}\n`;
  }
  if (format === 'kotlin') {
    const hasDuration = list.some((t) => t.type === 'duration');
    const lines = list.map((t) => {
      if (t.type === 'color') return `val ${t.name} = Color(0x${argbHex(requireTypedColor(t, 'kotlin'))})`;
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `val ${t.name} = ${fmtNumber(durationMs(t.token.$value))}.milliseconds`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const unit = isFontSizePath(t.path) ? 'sp' : 'dp';
        const dim = nativeDimension(t.token.$value);
        return `val ${t.name} = ${fmtNumber(dim.value)}.${unit}${dim.converted ? ` // ${dim.comment}` : ''}`;
      }
      return `val ${t.name} = ${JSON.stringify(String(t.value))}`;
    });
    const durationImport = hasDuration ? 'import kotlin.time.Duration.Companion.milliseconds\n' : '';
    return `import androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.dp\nimport androidx.compose.ui.unit.sp\n${durationImport}\n${lines.join('\n')}\n`;
  }
  if (format === 'dart') {
    const lines = list.map((t) => {
      if (t.type === 'color') return `static const Color ${t.name} = Color(0x${argbHex(requireTypedColor(t, 'dart'))});`;
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        const ms = durationMs(t.token.$value);
        const constructor = Number.isInteger(ms) ? `Duration(milliseconds: ${fmtNumber(ms)})` : `Duration(microseconds: ${Math.round(ms * 1000)})`;
        return `static const Duration ${t.name} = ${constructor};`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `static const double ${t.name} = ${fmtNumber(dim.value)}; // ${dim.comment}`;
      }
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
    return `${list.map((t) => `$${t.varName}: ${t.type === 'color' ? t.value.hex : t.value};`).join('\n')}\n`;
  }
  if (format === 'xaml') {
    const lines = list.map((t) => {
      const key = xmlEscape(pascal(t.name));
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'xaml');
        return `  <Color x:Key="${key}">#${argbHex(col).toUpperCase()}</Color>`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `  <x:Int32 x:Key="${key}">${Math.round(durationMs(t.token.$value))}</x:Int32><!-- ms -->`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `  <x:Double x:Key="${key}">${fmtNumber(dim.value)}</x:Double><!-- ${xmlEscape(dim.comment)} -->`;
      }
      return `  <x:String x:Key="${key}">${xmlEscape(String(t.value))}</x:String>`;
    });
    return `<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">\n${lines.join('\n')}\n</ResourceDictionary>\n`;
  }
  if (format === 'android-xml') {
    const lines = list.map((t) => {
      const key = xmlEscape(snake(t.varName));
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'android-xml');
        return `  <color name="${key}">#${argbHex(col).toUpperCase()}</color>`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `  <integer name="${key}">${Math.round(durationMs(t.token.$value))}</integer>`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const unit = isFontSizePath(t.path) ? 'sp' : 'dp';
        const dim = nativeDimension(t.token.$value);
        const note = dim.converted ? ` <!-- ${xmlEscape(dim.comment)} -->` : '';
        return `  <dimen name="${key}">${fmtNumber(dim.value)}${unit}</dimen>${note}`;
      }
      return `  <string name="${key}">${xmlEscape(String(t.value))}</string>`;
    });
    return `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${lines.join('\n')}\n</resources>\n`;
  }
  if (format === 'rust') {
    const lines = list.map((t) => {
      const id = rustConst(t.varName);
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'rust');
        const [r, g, b] = col.rgb.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255));
        const a = Math.round(Math.max(0, Math.min(1, col.alpha ?? 1)) * 255);
        return `pub const ${id}: [u8; 4] = [${r}, ${g}, ${b}, ${a}]; // ${col.hex}`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `pub const ${id}: u64 = ${Math.round(durationMs(t.token.$value))}; // ms`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `pub const ${id}: f32 = ${fmtFloat(dim.value)}; // ${dim.comment}`;
      }
      return `pub const ${id}: &str = ${JSON.stringify(String(t.value))};`;
    });
    return `// Generated by Pixelcraft export-tokens.mjs\n${lines.join('\n')}\n`;
  }
  if (format === 'go-lipgloss') {
    const hasColors = list.some((t) => t.type === 'color');
    const lines = list.map((t) => {
      const base = pascal(t.name);
      const id = /^\d/.test(base) ? `Token${base}` : base;
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'go-lipgloss');
        return `\t${id} = lipgloss.Color(${JSON.stringify(col.hex)})`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `\t${id} = ${Math.round(durationMs(t.token.$value))} // ms`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `\t${id} = ${fmtNumber(dim.value)} // ${dim.comment}`;
      }
      return `\t${id} = ${JSON.stringify(String(t.value))}`;
    });
    const imp = hasColors ? '\nimport "github.com/charmbracelet/lipgloss"\n' : '';
    return `// Code generated by Pixelcraft export-tokens.mjs. DO NOT EDIT.\npackage tokens\n${imp}\nconst (\n${lines.join('\n')}\n)\n`;
  }
  if (format === 'godot') {
    const lines = list.map((t) => {
      const id = rustConst(t.varName);
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'godot');
        return `const ${id}: Color = Color.html(${JSON.stringify(col.hex)})`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `const ${id}: float = ${fmtFloat(durationMs(t.token.$value) / 1000)} # seconds`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `const ${id}: float = ${fmtFloat(dim.value)} # ${dim.comment}`;
      }
      if (typeof t.token.$value === 'number') {
        return `const ${id}: float = ${fmtFloat(t.token.$value)}`;
      }
      return `const ${id}: String = ${JSON.stringify(String(t.value))}`;
    });
    return `# Generated by Pixelcraft export-tokens.mjs\nclass_name DesignTokens\n\n${lines.join('\n')}\n`;
  }
  if (format === 'unity-uss') {
    const body = list.map((t) => {
      const target = lookupRef(t.refKey);
      if (target) return `  --${t.varName}: var(--${target.varName});`;
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'unity-uss');
        return `  --${t.varName}: ${col.hex};`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {}) && t.token.$value.unit === 'rem') {
        const dim = nativeDimension(t.token.$value);
        return `  --${t.varName}: ${fmtNumber(dim.value)}px; /* ${dim.comment} */`;
      }
      return `  --${t.varName}: ${typeof t.value === 'object' ? t.value.css : t.value};`;
    }).join('\n');
    return `/* Generated by Pixelcraft export-tokens.mjs (Unity UI Toolkit USS) */\n:root {\n${body}\n}\n`;
  }
  if (format === 'slint') {
    const lines = list.map((t) => {
      const id = /^\d/.test(t.varName) ? `_${t.varName}` : t.varName;
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'slint');
        return `    out property <color> ${id}: ${col.hex};`;
      }
      if (t.type === 'duration' && typeof t.token.$value === 'object') {
        return `    out property <duration> ${id}: ${Math.round(durationMs(t.token.$value))}ms;`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {})) {
        const dim = nativeDimension(t.token.$value);
        return `    out property <length> ${id}: ${fmtNumber(dim.value)}px;${dim.converted ? ` // ${dim.comment}` : ''}`;
      }
      if (typeof t.token.$value === 'number') {
        return `    out property <float> ${id}: ${fmtNumber(t.token.$value)};`;
      }
      return `    out property <string> ${id}: ${JSON.stringify(String(t.value))};`;
    });
    return `// Generated by Pixelcraft export-tokens.mjs\nexport global DesignTokens {\n${lines.join('\n')}\n}\n`;
  }
  if (format === 'gtk4') {
    const colorLines = [];
    const propLines = [];
    for (const t of list) {
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'gtk4');
        const key = snake(t.varName);
        if ((col.alpha ?? 1) < 1) {
          const [r, g, b] = col.rgb.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255));
          colorLines.push(`@define-color ${key} rgba(${r}, ${g}, ${b}, ${fmtNumber(col.alpha)});`);
        } else {
          colorLines.push(`@define-color ${key} ${col.hex};`);
        }
      } else {
        propLines.push(`  --${t.varName}: ${t.value};`);
      }
    }
    const sections = ['/* Generated by Pixelcraft export-tokens.mjs (GTK4 CSS) */'];
    if (colorLines.length) sections.push(colorLines.join('\n'));
    if (propLines.length) sections.push(`:root {\n${propLines.join('\n')}\n}`);
    return `${sections.join('\n\n')}\n`;
  }
  if (format === 'typst') {
    const typstUnits = new Set(['pt', 'mm', 'cm', 'in', 'em']);
    const lines = list.map((t) => {
      const key = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(t.varName) ? t.varName : JSON.stringify(t.varName);
      if (t.type === 'color') {
        const col = requireTypedColor(t, 'typst');
        return `  ${key}: rgb(${JSON.stringify(col.hex)}),`;
      }
      if (typeof t.token.$value === 'object' && 'value' in (t.token.$value || {}) && t.type !== 'duration') {
        const amount = Number(t.token.$value.value);
        const unit = t.token.$value.unit;
        if (typstUnits.has(unit)) return `  ${key}: ${fmtNumber(amount)}${unit},`;
        if (unit === 'rem') return `  ${key}: ${fmtNumber(amount)}em, // ${amount}rem`;
        if (unit === 'px') return `  ${key}: ${fmtNumber(amount * 0.75)}pt, // ${amount}px @ 96dpi`;
        const dim = nativeDimension(t.token.$value);
        return `  ${key}: ${fmtNumber(dim.value)}pt, // ${dim.comment}`;
      }
      if (typeof t.token.$value === 'number') {
        return `  ${key}: ${fmtNumber(t.token.$value)},`;
      }
      return `  ${key}: ${JSON.stringify(String(t.value))},`;
    });
    return `// Generated by Pixelcraft export-tokens.mjs\n#let tokens = (\n${lines.join('\n')}\n)\n`;
  }
  throw new Error(`unknown format ${format}`);
}

function parseCli(args) {
  const valueOptions = new Set(['--format', '--mode', '--out-dir', '--selector']);
  const flagOptions = new Set(['--help', '-h', '--preserve-references']);
  const isKnownOption = (token) => valueOptions.has(token) || flagOptions.has(token)
    || [...valueOptions].some((opt) => token.startsWith(`${opt}=`));

  const parsed = {
    help: false,
    input: null,
    format: 'all',
    mode: '',
    outDir: '',
    selector: ':root',
    preserveReferences: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }
    if (arg === '--preserve-references') {
      parsed.preserveReferences = true;
      continue;
    }
    let matchedOpt = null;
    let value = null;
    if (valueOptions.has(arg)) {
      matchedOpt = arg;
      const next = args[i + 1];
      if (next === undefined || next === '' || isKnownOption(next)) {
        throw new Error(`${arg} requires a value`);
      }
      value = next;
      i += 1;
    } else {
      for (const opt of valueOptions) {
        if (arg.startsWith(`${opt}=`)) {
          matchedOpt = opt;
          value = arg.slice(opt.length + 1);
          if (!value) throw new Error(`${opt} requires a value`);
          break;
        }
      }
    }
    if (matchedOpt) {
      if (matchedOpt === '--format') parsed.format = value;
      else if (matchedOpt === '--mode') parsed.mode = value;
      else if (matchedOpt === '--out-dir') parsed.outDir = value;
      else if (matchedOpt === '--selector') parsed.selector = value;
      continue;
    }
    if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    if (parsed.input) throw new Error(`unexpected extra argument: ${arg}`);
    parsed.input = arg;
  }
  return parsed;
}

try {
  const cli = parseCli(process.argv.slice(2));
  if (cli.help) {
    console.log(help());
    process.exit(0);
  }
  if (!cli.input) throw new Error('missing tokens.json input');
  if (![...formats, 'all'].includes(cli.format)) throw new Error(`unknown --format ${cli.format}`);
  const selected = cli.format === 'all' ? formats : [cli.format];
  const list = entries(collect(cli.input, cli.mode));
  for (const t of list) {
    if (t.deprecated) {
      const detail = typeof t.deprecated === 'string' && t.deprecated.trim() ? ` (${t.deprecated.trim()})` : '';
      console.error(`export-tokens: warning: deprecated token '${t.pathKey}'${detail}`);
    }
  }
  const renderOpts = { selector: cli.selector, preserveReferences: cli.preserveReferences };
  if (cli.outDir) {
    fs.mkdirSync(cli.outDir, { recursive: true });
    for (const f of selected) {
      const file = path.join(cli.outDir, outputFileName(f, cli.mode));
      fs.writeFileSync(file, render(f, list, renderOpts));
      console.log(`wrote ${file}`);
    }
  } else {
    for (const f of selected) console.log(`/* ${f}${cli.mode ? ` mode=${cli.mode}` : ''} */\n${render(f, list, renderOpts)}`);
  }
} catch (error) {
  console.error(`export-tokens: ${error.message}`);
  process.exit(1);
}
