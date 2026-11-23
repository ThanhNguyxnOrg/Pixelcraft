#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';

function help() {
  return `Usage: node style-inventory.mjs <url-or-html-file> [options]

Measure rendered style and implementation signals in a browser. Playwright is
used only when already installed in the target dependency context; otherwise
installation guidance is printed and no browser is launched.

Options:
  --out FILE             Write JSON report to FILE instead of stdout
  --breakpoints LIST     Width x height list (default: 390x900,1440x900)
  --project DIR          Dependency resolution root (default: current directory)
  --root DIR             Static server root for local targets (default: target directory)
  --executable-path FILE Use a specific Chromium/Chrome executable
  --timeout MS           Navigation timeout in milliseconds (default: 30000)
  --wait-until EVENT     Navigation lifecycle event: load or domcontentloaded (default: load)
  --wait-for SELECTOR    Wait for a selector after page load
  --wait-ms MS           Post-load settle time in milliseconds (default: 2000)
  --compact              Emit compact JSON
  --help                 Show this help

The output is heuristic evidence, not an accessibility or quality certification.
Cross-origin CSS may be unreadable, canvas/WebGL painting can hide text and color,
network transfer reflects the browser session/cache state, and geometry estimates
cannot judge semantic intent. Inspect screenshots/tasks alongside this report.

Install Playwright in the target project when measurement is desired, for example:
  npm install --save-dev playwright
  npx playwright install chromium
`;
}

function optionValue(args, index, name) {
  const value = args[index + 1];
  if (value === undefined) throw new Error(`${name} requires a value`);
  return value;
}

function parse(args) {
  const options = { out: null, breakpoints: '390x900,1440x900', project: process.cwd(), root: null, timeout: 30000, waitUntil: 'load', waitFor: null, waitMs: 2000, compact: false, executablePath: null, help: false };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--compact') options.compact = true;
    else if (arg === '--out') {
      options.out = optionValue(args, index, '--out');
      index += 1;
    } else if (arg.startsWith('--out=')) options.out = arg.slice(6);
    else if (arg === '--breakpoints') {
      options.breakpoints = optionValue(args, index, '--breakpoints');
      index += 1;
    } else if (arg.startsWith('--breakpoints=')) options.breakpoints = arg.slice(14);
    else if (arg === '--project') {
      options.project = optionValue(args, index, '--project');
      index += 1;
    } else if (arg.startsWith('--project=')) options.project = arg.slice(10);
    else if (arg === '--root') {
      options.root = optionValue(args, index, '--root');
      index += 1;
    } else if (arg.startsWith('--root=')) options.root = arg.slice(7);
    else if (arg === '--executable-path') {
      options.executablePath = optionValue(args, index, '--executable-path');
      index += 1;
    } else if (arg.startsWith('--executable-path=')) options.executablePath = arg.slice(18);
    else if (arg === '--timeout') {
      options.timeout = Number(optionValue(args, index, '--timeout'));
      index += 1;
    } else if (arg.startsWith('--timeout=')) options.timeout = Number(arg.slice(10));
    else if (arg === '--wait-until') {
      options.waitUntil = optionValue(args, index, '--wait-until');
      index += 1;
    } else if (arg.startsWith('--wait-until=')) options.waitUntil = arg.slice(13);
    else if (arg === '--wait-for') {
      options.waitFor = optionValue(args, index, '--wait-for');
      index += 1;
    } else if (arg.startsWith('--wait-for=')) options.waitFor = arg.slice(11);
    else if (arg === '--wait-ms') {
      options.waitMs = Number(optionValue(args, index, '--wait-ms'));
      index += 1;
    } else if (arg.startsWith('--wait-ms=')) options.waitMs = Number(arg.slice(10));
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else positional.push(arg);
  }
  if (!Number.isFinite(options.timeout) || options.timeout <= 0) throw new Error('--timeout must be a positive number');
  if (!Number.isFinite(options.waitMs) || options.waitMs < 0) throw new Error('--wait-ms must be a non-negative number');
  if (options.waitUntil !== 'load' && options.waitUntil !== 'domcontentloaded') throw new Error(`--wait-until must be 'load' or 'domcontentloaded', got '${options.waitUntil}'`);
  return { positional, options };
}

function parseBreakpoints(value) {
  return value.split(',').map((part) => {
    const match = /^(\d{3,5})x(\d{3,5})$/.exec(part.trim());
    if (!match) throw new Error(`invalid breakpoint '${part}'; expected WIDTHxHEIGHT`);
    return { width: Number(match[1]), height: Number(match[2]) };
  });
}

async function loadChromium(project) {
  try {
    const projectRequire = createRequire(path.join(path.resolve(project), 'pixelcraft-style-require.cjs'));
    return projectRequire('playwright').chromium;
  } catch {
    try {
      return (await import('playwright')).chromium;
    } catch {
      return null;
    }
  }
}

const mimeTypes = new Map(Object.entries({
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
}));

async function createStaticTarget(input, options) {
  if (/^https?:\/\//i.test(input)) return { url: input, local: false, async close() {} };
  const resolved = path.resolve(input);
  if (!fs.existsSync(resolved)) throw new Error(`target is neither an http(s) URL nor an existing HTML file: ${input}`);
  const stat = fs.statSync(resolved);
  const targetFile = stat.isDirectory() ? path.join(resolved, 'index.html') : resolved;
  if (!fs.existsSync(targetFile) || !fs.statSync(targetFile).isFile()) throw new Error(`target is not a readable HTML file: ${input}`);
  const fallbackRoot = stat.isDirectory() ? resolved : path.dirname(resolved);
  const configuredRoot = path.resolve(options.root || fallbackRoot);
  if (!fs.existsSync(configuredRoot) || !fs.statSync(configuredRoot).isDirectory()) throw new Error(`static server root is not a directory: ${configuredRoot}`);
  const lexicalRoot = configuredRoot;
  const root = fs.realpathSync(configuredRoot);
  const rootPrefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  const lexicalTarget = path.relative(lexicalRoot, resolved);
  if (lexicalTarget.startsWith('..') || path.isAbsolute(lexicalTarget)) throw new Error(`local target is outside the static server root: target=${resolved}; root=${lexicalRoot}`);
  const realTarget = fs.realpathSync(targetFile);
  const realRelativeTarget = path.relative(root, realTarget);
  if (realRelativeTarget.startsWith('..') || path.isAbsolute(realRelativeTarget)) throw new Error(`local target resolves outside the static server root: target=${realTarget}; root=${root}`);
  const encodedTarget = lexicalTarget.split(path.sep).filter(Boolean).map(encodeURIComponent).join('/');
  let initialPath = encodedTarget ? `/${encodedTarget}` : '/';
  if (stat.isDirectory() && !initialPath.endsWith('/')) initialPath += '/';
  const server = http.createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    } catch {
      response.writeHead(400).end('bad request');
      return;
    }
    if (pathname.endsWith('/')) pathname += 'index.html';
    if (pathname.split('/').some((part) => part.startsWith('.'))) {
      response.writeHead(404).end('not found');
      return;
    }
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(rootPrefix)) {
      response.writeHead(403).end('forbidden');
      return;
    }
    let fileStat;
    let realFile;
    try {
      realFile = fs.realpathSync(file);
      fileStat = fs.statSync(realFile);
    } catch {
      response.writeHead(404).end('not found');
      return;
    }
    if (realFile !== root && !realFile.startsWith(rootPrefix)) {
      response.writeHead(403).end('forbidden');
      return;
    }
    if (!fileStat.isFile()) {
      response.writeHead(404).end('not found');
      return;
    }
    response.writeHead(200, {
      'content-type': mimeTypes.get(path.extname(file).toLowerCase()) || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(realFile).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}${initialPath}`,
    local: true,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

function emptyNetworkPhase() {
  return { requests: 0, transferBytes: 0, jsBytes: 0 };
}

function observeNetwork(session, mainFrameId = null) {
  let loadEventSeen = false;
  const active = new Map();
  const network = {
    status: 0,
    requests: 0,
    failedRequests: 0,
    pendingRequests: 0,
    redirects: 0,
    transferBytes: 0,
    jsBytes: 0,
    initial: emptyNetworkPhase(),
    deferred: emptyNetworkPhase(),
    resourceTypes: {},
  };

  function resourceBucket(type) {
    const key = (type || 'Other').toLowerCase();
    if (!network.resourceTypes[key]) network.resourceTypes[key] = { requests: 0, transferBytes: 0 };
    return network.resourceTypes[key];
  }

  function addBytes(type, phase, bytes) {
    if (!bytes) return;
    const bucket = network[phase];
    network.transferBytes += bytes;
    bucket.transferBytes += bytes;
    resourceBucket(type).transferBytes += bytes;
    if ((type || '').toLowerCase() === 'script') {
      network.jsBytes += bytes;
      bucket.jsBytes += bytes;
    }
  }

  session.on('Page.loadEventFired', () => {
    loadEventSeen = true;
  });
  session.on('Network.requestWillBeSent', (event) => {
    const existing = active.get(event.requestId);
    const redirectBytes = event.redirectResponse ? (event.redirectResponse.encodedDataLength || 0) : 0;
    if (event.redirectResponse) network.redirects += 1;
    if (existing) {
      if (redirectBytes) addBytes(existing.type, existing.phase, redirectBytes);
      return;
    }
    const type = event.type || 'Other';
    const phase = loadEventSeen ? 'deferred' : 'initial';
    active.set(event.requestId, { type, phase });
    network.requests += 1;
    network[phase].requests += 1;
    resourceBucket(type).requests += 1;
    if (redirectBytes) addBytes(type, phase, redirectBytes);
  });
  session.on('Network.responseReceived', (event) => {
    if (event.type === 'Document' && (!mainFrameId || event.frameId === mainFrameId)) {
      network.status = event.response.status;
    }
  });
  session.on('Network.loadingFinished', (event) => {
    const record = active.get(event.requestId);
    const type = record?.type || 'Other';
    const phase = record?.phase || (loadEventSeen ? 'deferred' : 'initial');
    addBytes(type, phase, event.encodedDataLength || 0);
    active.delete(event.requestId);
  });
  session.on('Network.loadingFailed', (event) => {
    const record = active.get(event.requestId);
    const type = record?.type || 'Other';
    const phase = record?.phase || (loadEventSeen ? 'deferred' : 'initial');
    network.failedRequests += 1;
    addBytes(type, phase, event.encodedDataLength || 0);
    active.delete(event.requestId);
  });

  return {
    network,
    snapshot() {
      network.pendingRequests = active.size;
      return network;
    },
  };
}

const extract = String.raw`(() => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const navigation = performance.getEntriesByType('navigation')[0] || {};
  const state = window.__pixelcraftInventory || { lcp: null, cls: 0 };

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function round(value, digits = 2) {
    if (!Number.isFinite(value)) return null;
    const scale = 10 ** digits;
    return Math.round(value * scale) / scale;
  }

  function parseSerializedColor(value) {
    if (typeof value !== 'string') return null;
    const text = value.trim().toLowerCase();
    if (!text) return null;
    if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const hex = /^#([0-9a-f]{3,8})$/.exec(text);
    if (hex) {
      const digits = hex[1];
      const expand = (part) => Number.parseInt(part.length === 1 ? part + part : part, 16);
      if (digits.length === 3 || digits.length === 4) {
        return { r: expand(digits[0]), g: expand(digits[1]), b: expand(digits[2]), a: digits.length === 4 ? expand(digits[3]) / 255 : 1 };
      }
      if (digits.length === 6 || digits.length === 8) {
        return { r: expand(digits.slice(0, 2)), g: expand(digits.slice(2, 4)), b: expand(digits.slice(4, 6)), a: digits.length === 8 ? expand(digits.slice(6, 8)) / 255 : 1 };
      }
      return null;
    }
    const functional = /^rgba?\((.*)\)$/.exec(text);
    if (!functional) return null;
    const body = functional[1].trim();
    const channel = (part) => {
      const number = Number.parseFloat(part);
      if (!Number.isFinite(number)) return null;
      return clamp(part.trim().endsWith('%') ? number * 2.55 : number, 0, 255);
    };
    const alphaValue = (part) => {
      if (part === undefined || part === '') return 1;
      const number = Number.parseFloat(part);
      if (!Number.isFinite(number)) return null;
      return clamp(part.trim().endsWith('%') ? number / 100 : number, 0, 1);
    };
    let parts;
    let alpha;
    if (body.includes(',')) {
      parts = body.split(',').map((part) => part.trim()).slice(0, 3);
      alpha = alphaValue(body.split(',')[3]);
    } else {
      const pieces = body.split('/').map((part) => part.trim());
      parts = pieces[0].split(/\s+/).filter(Boolean).slice(0, 3);
      alpha = alphaValue(pieces[1]);
    }
    if (parts.length !== 3 || alpha === null) return null;
    const channels = parts.map(channel);
    if (channels.some((part) => part === null)) return null;
    return { r: channels[0], g: channels[1], b: channels[2], a: alpha };
  }

  function parseColor(value) {
    const direct = parseSerializedColor(value);
    if (direct) return direct;
    if (!value) return null;
    try {
      if (!parseColor.context) parseColor.context = document.createElement('canvas').getContext('2d');
      const context = parseColor.context;
      if (!context) return null;
      for (const sentinel of ['#010203', '#040506']) {
        context.fillStyle = sentinel;
        const before = context.fillStyle;
        context.fillStyle = value;
        if (context.fillStyle !== before) return parseSerializedColor(context.fillStyle);
      }
    } catch {}
    return null;
  }

  function luminance(color) {
    const convert = (channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * convert(color.r) + 0.7152 * convert(color.g) + 0.0722 * convert(color.b);
  }

  function contrastRatio(first, second) {
    const one = luminance(first);
    const two = luminance(second);
    return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
  }

  function alphaBlend(source, destination) {
    const alpha = source.a + destination.a * (1 - source.a);
    if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (source.r * source.a + destination.r * destination.a * (1 - source.a)) / alpha,
      g: (source.g * source.a + destination.g * destination.a * (1 - source.a)) / alpha,
      b: (source.b * source.a + destination.b * destination.a * (1 - source.a)) / alpha,
      a: alpha,
    };
  }

  function colorKey(color) {
    if (!color) return null;
    const quantize = (channel) => clamp(Math.round(channel / 8) * 8, 0, 255);
    return [quantize(color.r), quantize(color.g), quantize(color.b)].join(',');
  }

  function hexColor(key) {
    const parts = key.split(',').map(Number);
    return '#' + parts.map((part) => clamp(part, 0, 255).toString(16).padStart(2, '0')).join('');
  }

  function addArea(map, key, area) {
    if (!key || !Number.isFinite(area) || area <= 0) return;
    map.set(key, (map.get(key) || 0) + area);
  }

  function isZeroClip(style) {
    return /^rect\(\s*0(?:px)?\s*,\s*0(?:px)?\s*,\s*0(?:px)?\s*,\s*0(?:px)?\s*\)$/i.test(style.clip || '')
      || /^inset\(\s*(?:50%|100%)\s*\)$/i.test((style.clipPath || '').trim());
  }

  function establishesFixedContainingBlock(style) {
    return (style.transform && style.transform !== 'none')
      || (style.filter && style.filter !== 'none')
      || (style.perspective && style.perspective !== 'none')
      || /paint|layout|strict|content/.test(style.contain || '')
      || /transform|filter|perspective/.test(style.willChange || '');
  }

  function clippedRect(element) {
    const rect = element.getBoundingClientRect();
    let left = Math.max(0, rect.left);
    let top = Math.max(0, rect.top);
    let right = Math.min(viewportWidth, rect.right);
    let bottom = Math.min(viewportHeight, rect.bottom);
    const ownStyle = styleOf(element);
    if (isZeroClip(ownStyle)) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, elementWidth: rect.width, elementHeight: rect.height, area: 0 };
    }
    let positioned = ownStyle.position;
    let node = element.parentElement;
    while (node && node.nodeType === 1 && node !== document.documentElement && right > left && bottom > top) {
      const ancStyle = styleOf(node);
      const fixedCB = establishesFixedContainingBlock(ancStyle);
      if (positioned === 'fixed') {
        if (!fixedCB) {
          node = node.parentElement;
          continue;
        }
        positioned = ancStyle.position;
      } else if (positioned === 'absolute') {
        if (ancStyle.position === 'static' && !fixedCB) {
          node = node.parentElement;
          continue;
        }
        positioned = ancStyle.position;
      } else {
        positioned = ancStyle.position;
      }
      if (isZeroClip(ancStyle)) {
        left = 0;
        top = 0;
        right = 0;
        bottom = 0;
        break;
      }
      const clipsX = /^(hidden|clip|scroll|auto)$/.test(ancStyle.overflowX);
      const clipsY = /^(hidden|clip|scroll|auto)$/.test(ancStyle.overflowY);
      if (clipsX || clipsY) {
        const ancRect = node.getBoundingClientRect();
        if (clipsX) {
          left = Math.max(left, ancRect.left);
          right = Math.min(right, ancRect.right);
        }
        if (clipsY) {
          top = Math.max(top, ancRect.top);
          bottom = Math.min(bottom, ancRect.bottom);
        }
      }
      node = node.parentElement;
    }
    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);
    return { left, top, right, bottom, width, height, elementWidth: rect.width, elementHeight: rect.height, area: width * height };
  }

  function hasDirectText(element) {
    for (const node of element.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim()) return true;
    }
    return false;
  }

  function splitCssList(value) {
    const parts = [];
    let current = '';
    let quote = '';
    let depth = 0;
    let escaped = false;
    for (const char of value) {
      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }
      if (char === '\\') {
        current += char;
        escaped = true;
        continue;
      }
      if (quote) {
        current += char;
        if (char === quote) quote = '';
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        current += char;
        continue;
      }
      if (char === '(') depth += 1;
      if (char === ')') depth = Math.max(0, depth - 1);
      if (char === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    return parts.filter(Boolean);
  }

  function splitWhitespaceOutsideParens(value) {
    const parts = [];
    let current = '';
    let depth = 0;
    for (const char of value.trim()) {
      if (char === '(') depth += 1;
      if (char === ')') depth = Math.max(0, depth - 1);
      if (/\s/.test(char) && depth === 0) {
        if (current) parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  function cleanFontName(value) {
    let name = value.trim().replace(/\s+/g, ' ');
    if (name.length >= 2) {
      const first = name[0];
      const last = name[name.length - 1];
      if ((first === '"' && last === '"') || (first === "'" && last === "'")) name = name.slice(1, -1);
    }
    return name.toLowerCase();
  }

  const genericFamilies = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong']);
  const fontStackCache = new Map();

  function analyzeFontStack(stack) {
    if (fontStackCache.has(stack)) return fontStackCache.get(stack);
    const names = splitCssList(stack).map(cleanFontName).filter(Boolean);
    const primaryIndex = names.length ? 0 : -1;
    const result = {
      names,
      primary: primaryIndex >= 0 ? names[primaryIndex] : null,
      fallbacks: primaryIndex >= 0 ? names.slice(primaryIndex + 1) : [],
      declared: [...new Set(names.filter((name) => !genericFamilies.has(name)))],
    };
    fontStackCache.set(stack, result);
    return result;
  }

  function median(values) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[middle];
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function unionArea(rects) {
    if (!rects.length) return 0;
    const xs = [...new Set(rects.flatMap((rect) => [rect.left, rect.right]))].sort((a, b) => a - b);
    let area = 0;
    for (let index = 0; index < xs.length - 1; index += 1) {
      const x0 = xs[index];
      const x1 = xs[index + 1];
      if (x1 <= x0) continue;
      const intervals = [];
      for (const rect of rects) {
        if (rect.left < x1 && rect.right > x0) intervals.push([rect.top, rect.bottom]);
      }
      if (!intervals.length) continue;
      intervals.sort((a, b) => a[0] - b[0]);
      let covered = 0;
      let start = null;
      let end = null;
      for (const interval of intervals) {
        if (start === null || interval[0] > end) {
          if (start !== null) covered += end - start;
          start = interval[0];
          end = interval[1];
        } else {
          end = Math.max(end, interval[1]);
        }
      }
      if (start !== null) covered += end - start;
      area += (x1 - x0) * covered;
    }
    return area;
  }

  const scanLimit = 6000;
  const roots = [document.documentElement];
  if (document.body) roots.push(document.body, ...document.body.querySelectorAll('*'));
  const visible = [];
  const styleCache = new WeakMap();
  function styleOf(element) {
    let style = styleCache.get(element);
    if (!style) {
      style = getComputedStyle(element);
      styleCache.set(element, style);
    }
    return style;
  }

  function hasTransparentAncestor(element) {
    let node = element;
    while (node && node.nodeType === 1) {
      if (Number.parseFloat(styleOf(node).opacity) <= 0) return true;
      node = node.parentElement;
    }
    return false;
  }

  for (const element of roots.slice(0, scanLimit)) {
    const style = styleOf(element);
    const rect = clippedRect(element);
    if (rect.area <= 0.5) continue;
    if (style.visibility === 'hidden' || style.visibility === 'collapse') continue;
    if (hasTransparentAncestor(element)) continue;
    visible.push({ element, style, rect, area: rect.area });
  }

  const fontFaces = new Map();
  const fontAreas = new Map();
  const declaredNames = new Set();
  const fallbackNames = new Set();
  const fontSizes = new Map();
  const lineHeights = new Map();
  const inkColors = new Map();
  const backgroundColors = new Map();
  const displayLetterSpacing = new Set();
  const grids = [];
  const contentWidths = [];
  const leaf = [];
  const textLeaf = [];
  const cursorValues = new Set();
  let animationCount = 0;
  let transitionCount = 0;

  function positiveDuration(value) {
    return value.split(',').some((part) => Number.parseFloat(part) > 0);
  }

  for (const item of visible) {
    const { element, style, rect, area } = item;
    const directText = hasDirectText(element);
    const mediaOrControl = /^(IMG|VIDEO|CANVAS|SVG|PICTURE|IFRAME|AUDIO|INPUT|TEXTAREA|SELECT|BUTTON|OBJECT|EMBED)$/.test(element.tagName);
    const background = parseColor(style.backgroundColor);
    if (background && background.a > 0.05) addArea(backgroundColors, colorKey(background), area * clamp(background.a, 0, 1));
    if (style.cursor) cursorValues.add(style.cursor);

    if (style.display.includes('grid') && rect.width > viewportWidth * 0.3 && style.gridTemplateColumns !== 'none') {
      grids.push({
        columns: splitWhitespaceOutsideParens(style.gridTemplateColumns).length,
        template: style.gridTemplateColumns.slice(0, 120),
        gap: style.columnGap,
        width: Math.round(rect.width),
      });
    }

    const animationNamed = style.animationName.split(',').some((name) => name.trim() !== 'none');
    if (animationNamed && positiveDuration(style.animationDuration)) animationCount += 1;
    const transitionNamed = style.transitionProperty.split(',').some((name) => name.trim() !== 'none');
    if (transitionNamed && positiveDuration(style.transitionDuration)) transitionCount += 1;

    if (!directText && !mediaOrControl) continue;
    leaf.push(item);

    if (!directText) continue;
    contentWidths.push(rect.elementWidth);
    textLeaf.push(item);
    const font = analyzeFontStack(style.fontFamily);
    for (const name of font.declared) declaredNames.add(name);
    for (const name of font.fallbacks) fallbackNames.add(name);
    if (font.primary) {
      addArea(fontAreas, font.primary, area);
      const faceKey = JSON.stringify([font.primary, style.fontWeight, style.fontStyle]);
      addArea(fontFaces, faceKey, area);
    }
    const size = Number.parseFloat(style.fontSize);
    if (Number.isFinite(size)) addArea(fontSizes, String(round(size, 1)), area);
    addArea(lineHeights, style.lineHeight, area);
    const ink = parseColor(style.color);
    if (ink && ink.a > 0.05) addArea(inkColors, colorKey(ink), area * clamp(ink.a, 0, 1));
    if (size >= 28 || /^H[12]$/.test(element.tagName)) displayLetterSpacing.add(style.letterSpacing);
  }

  const documentFontFaces = [];
  let fontFaceCount = 0;
  try {
    if (document.fonts && typeof document.fonts.forEach === 'function') {
      document.fonts.forEach((face) => {
        fontFaceCount += 1;
        if (documentFontFaces.length < 24) {
          documentFontFaces.push({ family: String(face.family).replace(/^["']|["']$/g, '').toLowerCase(), weight: String(face.weight), style: face.style, status: face.status });
        }
      });
    }
  } catch {}

  const sizeValues = [...fontSizes.keys()].map(Number).filter((value) => Number.isFinite(value) && value >= 8);
  const maxSize = sizeValues.length ? Math.max(...sizeValues) : null;
  const minSize = sizeValues.length ? Math.min(...sizeValues) : null;
  const typeRatio = maxSize !== null && minSize ? round(maxSize / minSize, 2) : null;

  const backgroundEntries = [...backgroundColors.entries()].sort((a, b) => b[1] - a[1]);
  const inkEntries = [...inkColors.entries()].sort((a, b) => b[1] - a[1]);
  const distinctColors = new Set([...backgroundColors.keys(), ...inkColors.keys()]);
  const dominantKey = backgroundEntries[0]?.[0] || '255,255,255';
  const dominantParts = dominantKey.split(',').map(Number);
  const dominantColor = {
    r: Number.isFinite(dominantParts[0]) ? dominantParts[0] : 255,
    g: Number.isFinite(dominantParts[1]) ? dominantParts[1] : 255,
    b: Number.isFinite(dominantParts[2]) ? dominantParts[2] : 255,
    a: 1,
  };

  const geometryLeaf = leaf.slice(0, 1000);
  const occupiedArea = unionArea(geometryLeaf.map((item) => item.rect));
  let weightedCenter = 0;
  let totalLeafArea = 0;
  for (const item of geometryLeaf) {
    weightedCenter += item.area * (item.rect.left + item.rect.width / 2);
    totalLeafArea += item.area;
  }
  const centroid = totalLeafArea ? weightedCenter / totalLeafArea : viewportWidth / 2;

  let overlapCount = 0;
  const overlapLimit = Math.min(geometryLeaf.length, 180);
  for (let first = 0; first < overlapLimit; first += 1) {
    for (let second = first + 1; second < overlapLimit; second += 1) {
      const a = geometryLeaf[first];
      const b = geometryLeaf[second];
      if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
      const width = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
      const height = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      if (width > 8 && height > 8 && width * height > Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height) * 0.28) overlapCount += 1;
    }
  }

  let cssText = '';
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (cssText.length >= 250000) break;
        cssText += rule.cssText + '\n';
      }
    } catch {}
  }
  const inlineStyles = [...document.querySelectorAll('[style]')].slice(0, 1000).map((element) => element.getAttribute('style') || '').join('\n');
  const cssLower = (cssText + '\n' + inlineStyles).toLowerCase();

  const scriptUrls = [];
  let inlineScripts = '';
  for (const script of document.scripts) {
    if (script.src) scriptUrls.push(script.src);
    const inline = script.textContent || '';
    if (inline && inlineScripts.length < 250000) inlineScripts += inline.slice(0, 10000) + '\n';
  }
  const scriptHaystack = (scriptUrls.join('\n') + '\n' + inlineScripts).toLowerCase();

  const libraries = {
    gsap: Boolean(window.gsap) || /\bgsap\b/.test(scriptHaystack),
    scrollTrigger: Boolean(window.ScrollTrigger) || /\bscrolltrigger\b/.test(scriptHaystack),
    lenis: Boolean(window.Lenis) || /\blenis\b/.test(scriptHaystack),
    locomotive: Boolean(window.LocomotiveScroll) || /\blocomotive(?:-scroll)?\b/.test(scriptHaystack),
    three: Boolean(window.THREE) || /\bthree(?:\.min|\.module)?\.js\b|@react-three/.test(scriptHaystack),
    barba: Boolean(window.barba) || /\bbarba\b/.test(scriptHaystack),
    swup: Boolean(window.Swup) || /\bswup\b/.test(scriptHaystack),
    framerMotion: /framer-motion|motionone|motion\.one/.test(scriptHaystack),
    rive: Boolean(window.rive) || /\brive(?:\.min)?\.js\b|@rive-app\//.test(scriptHaystack),
    lottie: Boolean(window.lottie) || /\blottie(?:\.min)?\.js\b|\blottie-web\b/.test(scriptHaystack),
  };
  const browserTechniques = {
    cssScrollTimeline: /scroll-timeline|animation-timeline|view-timeline/.test(cssLower),
    viewTransitions: /view-transition|startviewtransition\s*\(/.test(cssLower + '\n' + scriptHaystack),
  };

  const bodyStyle = document.body ? styleOf(document.body) : null;
  const rootStyle = styleOf(document.documentElement);
  const hiddenBodyOverflow = Boolean(
    (bodyStyle && /hidden|clip/.test(bodyStyle.overflow + ' ' + bodyStyle.overflowX + ' ' + bodyStyle.overflowY))
    || /hidden|clip/.test(rootStyle.overflow + ' ' + rootStyle.overflowX + ' ' + rootStyle.overflowY),
  );
  const wheelOrTouchHandlerHint = /addeventlistener\(\s*['"](?:wheel|mousewheel|touchmove)|\bon(?:wheel|mousewheel|touchmove)\s*=/.test(scriptHaystack) || Boolean(document.querySelector('[onwheel],[onmousewheel],[ontouchmove]'));
  const sectionIdList = [...document.querySelectorAll('section[id]')].map((element) => element.id);
  const sectionIds = new Set(sectionIdList);
  let directHashLinks = 0;
  for (const anchor of document.querySelectorAll('a[href^="#"]')) {
    const href = anchor.getAttribute('href') || '';
    if (href.length > 1 && sectionIds.has(href.slice(1))) directHashLinks += 1;
  }

  const standardCursorKeywords = new Set(['auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out']);
  const cursorList = [...cursorValues].filter(Boolean).slice(0, 20);
  const customImageCursors = cursorList.filter((value) => value.includes('url('));

  function effectiveContrastColors(element, foregroundColor) {
    const chain = [];
    let node = element;
    while (node && node.nodeType === 1) {
      chain.push(node);
      node = node.parentElement;
    }
    let bg = { r: 0, g: 0, b: 0, a: 0 };
    let fg = foregroundColor;
    for (const current of chain) {
      const style = styleOf(current);
      const layerBg = parseColor(style.backgroundColor) || { r: 0, g: 0, b: 0, a: 0 };
      const parsedOpacity = Number.parseFloat(style.opacity);
      const opacity = Number.isFinite(parsedOpacity) ? clamp(parsedOpacity, 0, 1) : 1;
      const innerBg = layerBg.a > 0 ? alphaBlend(bg, layerBg) : bg;
      const innerFg = layerBg.a > 0 ? alphaBlend(fg, layerBg) : fg;
      bg = opacity < 1 ? { ...innerBg, a: innerBg.a * opacity } : innerBg;
      fg = opacity < 1 ? { ...innerFg, a: innerFg.a * opacity } : innerFg;
    }
    const canvas = { r: 255, g: 255, b: 255, a: 1 };
    return {
      background: alphaBlend(bg, canvas),
      foreground: alphaBlend(fg, canvas),
    };
  }

  let contrastChecked = 0;
  let contrastFailures = 0;
  let contrastUnparsed = 0;
  const contrastRatios = [];
  for (const item of textLeaf.slice(0, 1000)) {
    const foregroundColor = parseColor(item.style.color);
    if (!foregroundColor) {
      contrastUnparsed += 1;
      continue;
    }
    const { background, foreground } = effectiveContrastColors(item.element, foregroundColor);
    const ratio = contrastRatio(foreground, background);
    if (!Number.isFinite(ratio)) continue;
    contrastChecked += 1;
    contrastRatios.push(ratio);
    const fontSize = Number.parseFloat(item.style.fontSize) || 16;
    const fontWeight = Number.parseInt(item.style.fontWeight, 10) || 400;
    const largeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const required = largeText ? 3 : 4.5;
    if (ratio + 0.05 < required) contrastFailures += 1;
  }

  function isAccessibilityExposed(element) {
    let node = element;
    while (node && node.nodeType === 1) {
      if (node.hasAttribute('hidden') || node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('inert')) return false;
      const st = styleOf(node);
      if (st.display === 'none') return false;
      node = node.parentElement;
    }
    const ownStyle = styleOf(element);
    if (ownStyle.visibility === 'hidden' || ownStyle.visibility === 'collapse') return false;
    return true;
  }

  const landmarkRoles = { MAIN: 'main', NAV: 'navigation', HEADER: 'banner', FOOTER: 'contentinfo', ASIDE: 'complementary' };
  const validLandmarkRoles = new Set(['main', 'navigation', 'banner', 'contentinfo', 'complementary']);
  const sectioningSelector = 'article, aside, main, nav, section, [role="article"], [role="complementary"], [role="main"], [role="navigation"], [role="region"]';
  const landmarks = {};
  for (const element of document.querySelectorAll('main,nav,header,footer,aside,[role]')) {
    if (!isAccessibilityExposed(element)) continue;
    const roleAttr = (element.getAttribute('role') || '').trim().toLowerCase();
    let role = null;
    if (roleAttr) {
      const firstToken = roleAttr.split(/\s+/)[0];
      if (validLandmarkRoles.has(firstToken)) role = firstToken;
    } else {
      const implicit = landmarkRoles[element.tagName] || null;
      if (implicit === 'banner' || implicit === 'contentinfo') {
        if (!element.parentElement?.closest(sectioningSelector)) role = implicit;
      } else {
        role = implicit;
      }
    }
    if (role) landmarks[role] = (landmarks[role] || 0) + 1;
  }

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = styleOf(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.visibility !== 'collapse';
  });
  let headingJumps = 0;
  let previousHeading = 0;
  for (const heading of headings) {
    const level = Number(heading.tagName[1]);
    if (previousHeading && level > previousHeading + 1) headingJumps += 1;
    previousHeading = level;
  }

  const images = [...document.images];
  const fontDisplay = [];
  const fontDisplayPattern = /font-display\s*:\s*([a-z]+)/g;
  let displayMatch;
  while ((displayMatch = fontDisplayPattern.exec(cssLower)) && fontDisplay.length < 8) {
    if (!fontDisplay.includes(displayMatch[1])) fontDisplay.push(displayMatch[1]);
  }

  const maxContentWidth = Math.round(Math.max(0, ...contentWidths.filter((width) => width > 100)));
  const sortedFontAreas = [...fontAreas.entries()].sort((a, b) => b[1] - a[1]);

  return {
    title: document.title,
    textLength: (document.body ? document.body.innerText : '').trim().length,
    url: location.href,
    viewport: { width: viewportWidth, height: viewportHeight },
    fonts: {
      count: sortedFontAreas.length,
      families: sortedFontAreas.slice(0, 12).map(([name]) => name),
      faceCount: fontFaces.size,
      entries: [...fontFaces.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([key, area]) => {
        const parts = JSON.parse(key);
        return { family: parts[0], weight: parts[1], style: parts[2], area: Math.round(area) };
      }),
      declaredCount: declaredNames.size,
      declaredFamilies: [...declaredNames].slice(0, 16),
      fallbackFamilies: [...fallbackNames].slice(0, 8),
      fontFaces: documentFontFaces,
    },
    type: {
      distinctSizes: fontSizes.size,
      sizes: [...fontSizes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18).map(([size, area]) => ({ size: Number(size), area: Math.round(area) })),
      lineHeights: [...lineHeights.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([value, area]) => ({ value, area: Math.round(area) })),
      ratio: typeRatio,
      displayLetterSpacing: [...displayLetterSpacing].slice(0, 12),
    },
    color: {
      dominant: hexColor(dominantKey),
      mode: luminance(dominantColor) > 0.5 ? 'light' : 'dark',
      distinct: distinctColors.size,
      backgrounds: backgroundEntries.slice(0, 10).map(([color, area]) => ({ color: hexColor(color), area: Math.round(area) })),
      inks: inkEntries.slice(0, 8).map(([color, area]) => ({ color: hexColor(color), area: Math.round(area) })),
    },
    layout: {
      sections: document.querySelectorAll('section').length,
      grids: grids.slice(0, 10),
      gridCount: grids.length,
      maxContentWidth,
      whitespaceRatio: round(1 - clamp(occupiedArea / (viewportWidth * viewportHeight), 0, 1), 3),
      asymmetry: round(Math.abs(centroid - viewportWidth / 2) / (viewportWidth / 2), 3),
      overlapCount,
      scrollHeight: document.documentElement.scrollHeight,
    },
    motion: {
      libraries,
      browserTechniques,
      animatedCount: animationCount,
      transitionCount,
      canvases: document.querySelectorAll('canvas').length,
      reducedMotionCSS: /prefers-reduced-motion/.test(cssLower),
      scroll: {
        manipulationLikely: libraries.lenis || libraries.locomotive || hiddenBodyOverflow || wheelOrTouchHandlerHint,
        hiddenBodyOverflow,
        wheelOrTouchHandlerHint,
        directHashLinks,
        sectionsWithIds: sectionIdList.length,
      },
    },
    cursor: {
      values: cursorList,
      imageCursors: customImageCursors,
      hidden: cursorList.includes('none'),
      nonStandardKeywords: cursorList.filter((value) => !standardCursorKeywords.has(value) && !value.includes('url(')),
    },
    accessibility: {
      landmarks,
      headingCount: headings.length,
      headingJumps,
      contrastChecked,
      contrastFailures,
      contrastUnparsed,
      contrastMedian: round(median(contrastRatios), 2),
      contrastMinimum: contrastRatios.length ? round(Math.min(...contrastRatios), 2) : null,
      images: images.length,
      missingAlt: images.filter((image) => !image.hasAttribute('alt')).length,
      focusVisibleCSS: /:focus-visible|focus-visible/.test(cssLower),
    },
    fontLoading: {
      preloadFonts: document.querySelectorAll('link[rel=preload][as=font]').length,
      fontDisplay,
      fontFaceCount,
      fontSetStatus: document.fonts ? document.fonts.status : 'unsupported',
    },
    timing: {
      domContentLoaded: round(navigation.domContentLoadedEventEnd || 0, 1),
      load: round(navigation.loadEventEnd || 0, 1),
    },
    lcp: typeof state.lcp === 'number' ? round(state.lcp, 1) : null,
    cls: round(state.cls || 0, 4),
  };
})()`;

const initObserver = String.raw`(() => {
  const state = { lcp: null, cls: 0 };
  let hasSession = false;
  let sessionValue = 0;
  let sessionFirst = 0;
  let sessionLast = 0;
  window.__pixelcraftInventory = state;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) state.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        const start = entry.startTime;
        if (hasSession && start - sessionLast < 1000 && start - sessionFirst < 5000) {
          sessionValue += entry.value;
          sessionLast = start;
        } else {
          hasSession = true;
          sessionValue = entry.value;
          sessionFirst = start;
          sessionLast = start;
        }
        if (sessionValue > state.cls) state.cls = sessionValue;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}
})();`;

async function measurePage(page, target, viewport, options) {
  await page.setViewportSize(viewport);
  await page.addInitScript(initObserver);
  const session = await page.context().newCDPSession(page);
  await session.send('Page.enable');
  await session.send('Network.enable');
  const { frameTree } = await session.send('Page.getFrameTree');
  const mainFrameId = frameTree?.frame?.id || null;
  const tracker = observeNetwork(session, mainFrameId);
  const response = await page.goto(target, { waitUntil: options.waitUntil, timeout: options.timeout });
  if (options.waitFor) await page.waitForSelector(options.waitFor, { timeout: options.timeout });
  if (options.waitMs > 0) await page.waitForTimeout(options.waitMs);
  if (options.waitMs > 0) {
    await Promise.race([
      page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve())).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, Math.min(1000, options.waitMs))),
    ]);
  }
  const measured = await page.evaluate(extract);
  const network = tracker.snapshot();
  if (response && network.status === 0) network.status = response.status();
  return { width: viewport.width, height: viewport.height, ...measured, network };
}

async function main() {
  const { positional, options } = parse(process.argv.slice(2));
  if (options.help) {
    console.log(help());
    return;
  }
  const input = positional[0];
  if (!input) throw new Error('missing URL or HTML file; run with --help');
  if (positional.length > 1) throw new Error(`unexpected extra argument: ${positional[1]}`);
  const breakpoints = parseBreakpoints(options.breakpoints);
  const chromium = await loadChromium(options.project);
  if (!chromium) {
    console.error('Playwright is not installed in this dependency context. Install it explicitly in the target project, for example: npm install --save-dev playwright && npx playwright install chromium');
    process.exitCode = 2;
    return;
  }
  const target = await createStaticTarget(input, options);
  let browser;
  const report = {
    schemaVersion: 1,
    target: input,
    generatedAt: new Date().toISOString(),
    heuristic: true,
    units: { timing: 'milliseconds', transfer: 'bytes', geometry: 'CSS pixels', area: 'square CSS pixels', whitespaceRatio: '0-1 estimate', cls: 'unitless' },
    measurement: {
      cache: 'fresh browser context per viewport; HTTP cache left enabled',
      throttling: 'none',
      emulation: 'headless Chromium viewport emulation',
      payloadPhase: 'initial means request initiated before the document load event; deferred means after it',
    },
    limitations: [
      'cross-origin stylesheets may be unreadable',
      'canvas/WebGL-painted content is invisible to DOM text extraction',
      'font inventory reflects computed family stacks and font-face metadata rather than per-glyph fallback resolution',
      'palette weights are computed-style approximations rather than a pixel histogram; images, gradients, shadows, and blend modes can dominate the real pixels',
      'network transfer uses browser-reported encoded body bytes; redirects, headers, pending requests, and cache state can affect totals',
      'whitespace, overlap, and asymmetry are geometric estimates rather than quality scores',
      'contrast sampling does not account for background images, gradients, filters, or occluding overlays',
      'basic accessibility extraction is not a keyboard, screen-reader, or task-completion audit',
      'measurements reflect the initial viewport after the configured settle time rather than scrolled or interaction-dependent states',
      'motion-library detection uses globals and script metadata; bundlers can hide libraries and ordinary prose is not evidence',
    ],
    viewports: [],
  };
  try {
    browser = await chromium.launch({ headless: true, ...(options.executablePath ? { executablePath: options.executablePath } : {}) });
    for (const viewport of breakpoints) {
      const page = await browser.newPage({ viewport });
      try {
        report.viewports.push(await measurePage(page, target.url, viewport, options));
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await target.close();
  }
  const json = options.compact ? JSON.stringify(report) : JSON.stringify(report, null, 2);
  if (options.out) {
    const out = path.resolve(options.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, `${json}\n`);
    console.log(`wrote ${path.relative(process.cwd(), out) || out}`);
  } else {
    console.log(json);
  }
}

main().catch((error) => {
  console.error(`style-inventory: ${error.message || error}`);
  process.exit(1);
});
