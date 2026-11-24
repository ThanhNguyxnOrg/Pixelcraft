#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function help() {
  return `Usage: node check-contrast.mjs <tokens.json> [--mode NAME] [--pairs FILE] [--json]

Compute exact WCAG 2.2 relative-luminance contrast ratios and APCA Lc (SAPC 0.0.98G-4g)
for DTCG color token pairs. Supports DTCG color objects (srgb, oklch, oklab, display-p3, hsl)
as well as hex, rgb(), rgba(), hsl(), and oklch() strings.

Options:
  --mode NAME    Apply mode overrides from $extensions.pixelcraft.modes
  --pairs FILE   JSON array (or { pairs: [...] }) of { foreground, background, role?, name? }
                 Role may be "text" (4.5:1), "ui" (3.0:1), or "large" (3.0:1).
                 When omitted, auto-detects surface/background vs ink/action pairs.
  --json         Print machine-readable JSON output
  --help         Show this help`;
}

function gamma(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}
function linearize(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
function oklabToRgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541729 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ].map(clamp01);
}
function oklchToRgb(L, C, H) {
  const rad = (H * Math.PI) / 180;
  return oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad));
}
function displayP3ToRgb(r, g, b) {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  return [
    gamma(1.2249401763 * lr - 0.2249401763 * lg),
    gamma(-0.0420569547 * lr + 1.0420569547 * lg),
    gamma(-0.0196375546 * lr - 0.0786360456 * lg + 1.0982736002 * lb),
  ].map(clamp01);
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
  return [r + m, g + m, b + m].map(clamp01);
}
function rgbToHex(rgb, alpha = 1) {
  const hex = rgb.map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0')).join('');
  if (alpha < 1) {
    return `#${hex}${Math.round(clamp01(alpha) * 255).toString(16).padStart(2, '0')}`;
  }
  return `#${hex}`;
}

function parseAlpha(token) {
  if (token === undefined || token === null || token === '') return 1;
  const trimmed = String(token).trim();
  if (trimmed.endsWith('%')) return clamp01(Number.parseFloat(trimmed) / 100);
  return clamp01(Number.parseFloat(trimmed));
}

function parseAngleDeg(token) {
  const trimmed = String(token).trim().toLowerCase();
  if (trimmed === 'none') return 0;
  if (trimmed.endsWith('turn')) return Number.parseFloat(trimmed) * 360;
  if (trimmed.endsWith('rad')) return (Number.parseFloat(trimmed) * 180) / Math.PI;
  if (trimmed.endsWith('grad')) return Number.parseFloat(trimmed) * 0.9;
  return Number.parseFloat(trimmed);
}

function parseColorString(raw) {
  const str = String(raw).trim();
  const hexM = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(str);
  if (hexM) {
    let hex = hexM[1].toLowerCase();
    if (hex.length === 3 || hex.length === 4) hex = hex.split('').map((c) => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { rgb: [r, g, b], alpha, hex: rgbToHex([r, g, b], alpha) };
  }
  const rgbM = /^rgba?\(\s*([^)]+)\s*\)$/i.exec(str);
  if (rgbM) {
    const inner = rgbM[1].trim();
    let channels;
    let alpha = 1;
    if (inner.includes('/')) {
      const [lhs, rhs] = inner.split('/');
      channels = lhs.trim().split(/[\s,]+/).filter(Boolean);
      alpha = parseAlpha(rhs);
    } else {
      const parts = inner.split(/[\s,]+/).filter(Boolean);
      channels = parts.slice(0, 3);
      if (parts[3] !== undefined) alpha = parseAlpha(parts[3]);
    }
    if (channels.length !== 3) throw new Error(`invalid rgb() color: ${str}`);
    const rgb = channels.map((ch) => {
      if (ch.endsWith('%')) return clamp01(Number.parseFloat(ch) / 100);
      return clamp01(Number.parseFloat(ch) / 255);
    });
    return { rgb, alpha, hex: rgbToHex(rgb, alpha) };
  }
  const oklchM = /^oklch\(\s*([^)]+)\s*\)$/i.exec(str);
  if (oklchM) {
    const [lhs, rhs] = oklchM[1].split('/');
    const parts = lhs.trim().split(/\s+/).filter(Boolean);
    if (parts.length !== 3) throw new Error(`invalid oklch() color: ${str}`);
    const L = parts[0].endsWith('%') ? Number.parseFloat(parts[0]) / 100 : Number.parseFloat(parts[0]);
    const C = parts[1].endsWith('%') ? (Number.parseFloat(parts[1]) / 100) * 0.4 : Number.parseFloat(parts[1]);
    const H = parseAngleDeg(parts[2]);
    const alpha = rhs !== undefined ? parseAlpha(rhs) : 1;
    const rgb = oklchToRgb(L, C, H);
    return { rgb, alpha, hex: rgbToHex(rgb, alpha) };
  }
  const hslM = /^hsla?\(\s*([^)]+)\s*\)$/i.exec(str);
  if (hslM) {
    const [lhs, rhs] = hslM[1].split('/');
    const parts = lhs.trim().split(/[\s,]+/).filter(Boolean);
    if (parts.length < 3) throw new Error(`invalid hsl() color: ${str}`);
    const H = parseAngleDeg(parts[0]);
    const S = Number.parseFloat(parts[1]);
    const L = Number.parseFloat(parts[2]);
    const alpha = rhs !== undefined ? parseAlpha(rhs) : (parts[3] !== undefined ? parseAlpha(parts[3]) : 1);
    const rgb = hslToRgb(H, S, L);
    return { rgb, alpha, hex: rgbToHex(rgb, alpha) };
  }
  throw new Error(`unsupported color value '${str}'; use #hex, rgb(), oklch(), hsl(), or a DTCG color object`);
}

function parseColorValue(value) {
  if (typeof value === 'string') return parseColorString(value);
  if (!value || typeof value !== 'object') throw new Error(`invalid color token value: ${JSON.stringify(value)}`);
  const alpha = value.alpha ?? 1;
  if (typeof value.hex === 'string') {
    const fallback = parseColorString(value.hex);
    return { rgb: fallback.rgb, alpha, hex: rgbToHex(fallback.rgb, alpha) };
  }
  const nums = (value.components || []).map((c) => (c === 'none' ? 0 : Number(c)));
  let rgb;
  if (value.colorSpace === 'srgb') rgb = nums.map(clamp01);
  else if (value.colorSpace === 'oklch') rgb = oklchToRgb(nums[0], nums[1], nums[2]);
  else if (value.colorSpace === 'oklab') rgb = oklabToRgb(nums[0], nums[1], nums[2]);
  else if (value.colorSpace === 'display-p3') rgb = displayP3ToRgb(nums[0], nums[1], nums[2]);
  else if (value.colorSpace === 'hsl') rgb = hslToRgb(nums[0], nums[1], nums[2]);
  else throw new Error(`unsupported DTCG colorSpace '${value.colorSpace}'`);
  return { rgb, alpha, hex: rgbToHex(rgb, alpha) };
}

function compositeOver(fg, bg) {
  const a = fg.alpha ?? 1;
  if (a >= 1) return fg.rgb;
  return [
    fg.rgb[0] * a + bg.rgb[0] * (1 - a),
    fg.rgb[1] * a + bg.rgb[1] * (1 - a),
    fg.rgb[2] * a + bg.rgb[2] * (1 - a),
  ];
}

function wcagLuminance([r, g, b]) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function wcagContrast(fgRgb, bgRgb) {
  const l1 = wcagLuminance(fgRgb);
  const l2 = wcagLuminance(bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// APCA-W3 / SAPC 0.0.98G-4g formula
export function apcaContrast(txtRgb, bgRgb) {
  const mainTRC = 2.4;
  const sRco = 0.2126729;
  const sGco = 0.7151522;
  const sBco = 0.0721750;
  const normBG = 0.56;
  const normTXT = 0.57;
  const revTXT = 0.62;
  const revBG = 0.65;
  const blkThrs = 0.022;
  const blkClmp = 1.414;
  const scaleBoW = 1.14;
  const scaleWoB = 1.14;
  const loBoWoffset = 0.027;
  const loWoBoffset = 0.027;
  const loClip = 0.1;
  const deltaYmin = 0.0005;

  let txtY = sRco * (txtRgb[0] ** mainTRC) + sGco * (txtRgb[1] ** mainTRC) + sBco * (txtRgb[2] ** mainTRC);
  let bgY = sRco * (bgRgb[0] ** mainTRC) + sGco * (bgRgb[1] ** mainTRC) + sBco * (bgRgb[2] ** mainTRC);

  txtY = txtY > blkThrs ? txtY : txtY + (blkThrs - txtY) ** blkClmp;
  bgY = bgY > blkThrs ? bgY : bgY + (blkThrs - bgY) ** blkClmp;

  if (Math.abs(bgY - txtY) < deltaYmin) return 0;

  let outputContrast = 0;
  if (bgY > txtY) {
    const sapc = (bgY ** normBG - txtY ** normTXT) * scaleBoW;
    outputContrast = sapc < loClip ? 0 : sapc - loBoWoffset;
  } else {
    const sapc = (bgY ** revBG - txtY ** revTXT) * scaleWoB;
    outputContrast = sapc > -loClip ? 0 : sapc + loWoBoffset;
  }
  return Number((outputContrast * 100).toFixed(1));
}

function flattenTokens(node, parts = [], inheritedType = '', out = []) {
  const type = node.$type || inheritedType;
  if (parts.length > 0 && Object.hasOwn(node, '$root') && typeof node.$root === 'object' && node.$root !== null
      && Object.hasOwn(node.$root, '$value')) {
    out.push({ path: parts, type: node.$root.$type || type, token: node.$root, isRoot: true });
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || typeof value !== 'object' || value === null || Array.isArray(value)) continue;
    const next = [...parts, key];
    if (Object.hasOwn(value, '$value')) out.push({ path: next, type: value.$type || type, token: value });
    else flattenTokens(value, next, type, out);
  }
  return out;
}

function loadColorTokens(file, mode) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const flattened = flattenTokens(data);
  const availableModes = new Set();
  for (const t of flattened) {
    for (const m of Object.keys(t.token.$extensions?.pixelcraft?.modes || {})) availableModes.add(m);
  }
  if (mode && !availableModes.has(mode)) throw new Error(`unknown --mode '${mode}'`);

  const byPath = new Map();
  for (const t of flattened) {
    const key = t.path.join('.');
    byPath.set(key, t);
    if (t.isRoot) byPath.set(`${key}.$root`, t);
  }

  const applyMode = (t) => {
    if (!mode) return t;
    const rep = t.token.$extensions?.pixelcraft?.modes?.[mode];
    if (rep === undefined) return t;
    const val = rep && typeof rep === 'object' && Object.hasOwn(rep, '$value') ? rep.$value : rep;
    return { ...t, token: { ...t.token, $value: val } };
  };

  const modeTokens = flattened.map(applyMode);
  const modeByPath = new Map();
  for (const t of modeTokens) {
    const key = t.path.join('.');
    modeByPath.set(key, t);
    if (t.isRoot) modeByPath.set(`${key}.$root`, t);
  }

  const resolving = new Set();
  function resolve(t) {
    const raw = t.token.$value;
    if (typeof raw === 'string' && /^\{[^}]+\}$/.test(raw)) {
      const ref = raw.slice(1, -1);
      if (resolving.has(ref)) throw new Error(`reference cycle at {${ref}}`);
      const target = modeByPath.get(ref);
      if (!target) throw new Error(`unresolved token reference {${ref}}`);
      resolving.add(ref);
      const resolved = resolve(target);
      resolving.delete(ref);
      return { value: resolved.value, type: t.type || resolved.type };
    }
    return { value: raw, type: t.type };
  }

  const colors = new Map();
  for (const t of modeTokens) {
    const key = t.path.join('.');
    const baseResolved = resolve(t);
    if (baseResolved.type !== 'color') continue;
    colors.set(key, parseColorValue(baseResolved.value));
  }
  return colors;
}

function autoDetectPairs(colors) {
  const keys = [...colors.keys()];
  const semanticKeys = keys.filter((k) => /^semantic\./i.test(k));
  const pool = semanticKeys.length >= 2 ? semanticKeys : keys;

  const isBg = (k) => /(?:^|\.)(?:background|bg|surface|canvas|base|panel|card)(?:\.|$)/i.test(k);
  const isText = (k) => /(?:^|\.)(?:foreground|fg|ink|text|body|heading|muted|on-surface|on-background)(?:\.|$)/i.test(k);
  const isUi = (k) => /(?:^|\.)(?:action|brand|accent|primary|secondary|link|error|danger|warning|success|focus|border)(?:\.|$)/i.test(k);

  const bgs = pool.filter(isBg);
  const texts = pool.filter((k) => isText(k) && !isBg(k));
  const uis = pool.filter((k) => isUi(k) && !isBg(k) && !isText(k));

  const pairs = [];
  const seen = new Set();
  const pushPair = (fg, bg, role) => {
    if (fg === bg) return;
    const id = `${fg}|${bg}|${role}`;
    if (seen.has(id)) return;
    seen.add(id);
    pairs.push({ name: `${fg} on ${bg}`, foreground: fg, background: bg, role });
  };

  for (const bg of bgs) {
    for (const fg of texts) pushPair(fg, bg, 'text');
    for (const ui of uis) pushPair(ui, bg, 'ui');
  }
  return pairs;
}

function parseCli(args) {
  const out = { help: false, json: false, mode: '', pairsFile: '', input: '' };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--json') out.json = true;
    else if (arg === '--mode') {
      if (!args[i + 1]) throw new Error('--mode requires a value');
      out.mode = args[++i];
    } else if (arg.startsWith('--mode=')) out.mode = arg.slice('--mode='.length);
    else if (arg === '--pairs') {
      if (!args[i + 1]) throw new Error('--pairs requires a value');
      out.pairsFile = args[++i];
    } else if (arg.startsWith('--pairs=')) out.pairsFile = arg.slice('--pairs='.length);
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else if (!out.input) out.input = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return out;
}

function main() {
  const cli = parseCli(process.argv.slice(2));
  if (cli.help) {
    console.log(help());
    return;
  }
  if (!cli.input) throw new Error('provide a DTCG tokens JSON file; see --help');
  const colors = loadColorTokens(path.resolve(cli.input), cli.mode);

  let pairs;
  if (cli.pairsFile) {
    const raw = JSON.parse(fs.readFileSync(path.resolve(cli.pairsFile), 'utf8'));
    pairs = Array.isArray(raw) ? raw : raw?.pairs;
    if (!Array.isArray(pairs) || pairs.length === 0) throw new Error('--pairs file must contain a non-empty array of color pairs');
  } else {
    pairs = autoDetectPairs(colors);
  }

  if (pairs.length === 0) {
    throw new Error('no contrast pairs detected; pass --pairs <file> or define surface/background and ink/foreground/action color tokens');
  }

  const resolveRef = (ref) => {
    if (colors.has(ref)) return colors.get(ref);
    return parseColorString(ref);
  };

  const results = pairs.map((pair) => {
    const role = pair.role || 'text';
    if (!['text', 'ui', 'large'].includes(role)) throw new Error(`invalid role '${role}'; expected text, ui, or large`);
    const fg = resolveRef(pair.foreground);
    const bg = resolveRef(pair.background);
    const effectiveFg = compositeOver(fg, bg);
    const ratio = Number(wcagContrast(effectiveFg, bg.rgb).toFixed(2));
    const apcaLc = apcaContrast(effectiveFg, bg.rgb);
    const threshold = role === 'text' ? 4.5 : 3.0;
    const pass = ratio >= threshold;
    return {
      name: pair.name || `${pair.foreground} on ${pair.background}`,
      foreground: pair.foreground,
      background: pair.background,
      foregroundHex: fg.hex,
      backgroundHex: bg.hex,
      role,
      threshold,
      wcagRatio: ratio,
      apcaLc,
      apcaAdvisoryPass: Math.abs(apcaLc) >= (role === 'text' ? 60 : 45),
      pass,
    };
  });

  const failures = results.filter((r) => !r.pass);
  const report = {
    file: cli.input,
    mode: cli.mode || 'default',
    label: 'static',
    note: 'Static token contrast math (WCAG 2.2 + APCA 0.0.98G-4g); live anti-aliasing, transparency stacking, and images still require rendered inspection.',
    totalPairs: results.length,
    failedPairs: failures.length,
    pass: failures.length === 0,
    results,
  };

  if (cli.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`check-contrast [${report.label}] (${report.mode}): ${results.length - failures.length}/${results.length} pairs pass`);
    for (const r of results) {
      const status = r.pass ? 'PASS' : 'FAIL';
      console.log(`  ${status} [${r.role} >= ${r.threshold}:1] ${r.name} (${r.foregroundHex} on ${r.backgroundHex}) -> WCAG ${r.wcagRatio}:1, APCA Lc ${r.apcaLc}`);
    }
    console.log(`note: ${report.note}`);
  }
  if (!report.pass) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`check-contrast: ${error.message}`);
    process.exit(1);
  }
}
