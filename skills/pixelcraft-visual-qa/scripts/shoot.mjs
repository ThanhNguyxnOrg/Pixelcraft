#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

function help() {
  return `Usage: node shoot.mjs <url-file-or-directory> [options]

Capture optional dependency-free browser visual QA evidence. Playwright is used
only when already installed; otherwise install guidance is printed and nothing
is captured.

Options:
  --out DIR              Artifact directory (default: visual-qa)
  --breakpoints LIST     Width x height list (default: 390x844,768x1024,1440x900)
  --project DIR          Dependency resolution root (default: current directory)
  --root DIR             Static server root for local targets (default: the
                         file/directory itself; exposes everything beneath it)
  --executable-path FILE Use a specific Chromium/Chrome executable
  --timeout MS           Navigation timeout in milliseconds (default: 30000)
  --wait-for SELECTOR    Wait for a selector after page load
  --wait-ms MS           Maximum post-load selector/network/font settle time
                         (default: 5000)
  --forced-colors MODE   Emulate forced-colors media feature: none or active
  --locale TAG           Emulate browser locale (e.g. de-DE, ar-EG, ja-JP)
  --allow-http-error     Capture HTTP 4xx/5xx pages without failing the run
  --keyboard             Probe the first eight real Tab stops on a safe fixture
                         (including WCAG 2.4.11 focus-not-obscured checks)
  --light-only           Skip dark-mode captures
  --no-reduced-motion    Skip reduced-motion captures
  --help                 Show this help

Outputs PNG captures plus report.json. Audits are heuristic leads for human
inspection: overflow, clipping, low contrast, broken images, hidden essential
content, text occlusion, target size (<24x24 CSS px), and optional keyboard
focus. They are not proof of accessibility or visual quality.

Install Playwright in the target project when capture is desired, for example:
  npm install --save-dev playwright
  npx playwright install chromium
`;
}

function optionValue(args, index, name) {
  const value = args[index + 1];
  if (value === undefined || value === '') throw new Error(`${name} requires a value`);
  return value;
}

function inlineValue(arg, prefix, name) {
  const value = arg.slice(prefix.length);
  if (value === '') throw new Error(`${name} requires a value`);
  return value;
}

function parse(args) {
  const options = {
    out: 'visual-qa',
    breakpoints: '390x844,768x1024,1440x900',
    timeout: 30000,
    waitFor: null,
    waitMs: 5000,
    allowHttpError: false,
    project: process.cwd(),
    root: null,
    executablePath: null,
    forcedColors: null,
    locale: null,
    lightOnly: false,
    reducedMotion: true,
    keyboard: false,
    help: false,
  };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--light-only') options.lightOnly = true;
    else if (arg === '--no-reduced-motion') options.reducedMotion = false;
    else if (arg === '--allow-http-error') options.allowHttpError = true;
    else if (arg === '--keyboard') options.keyboard = true;
    else if (arg === '--out') { options.out = optionValue(args, index, '--out'); index += 1; }
    else if (arg.startsWith('--out=')) options.out = inlineValue(arg, '--out=', '--out');
    else if (arg === '--breakpoints') { options.breakpoints = optionValue(args, index, '--breakpoints'); index += 1; }
    else if (arg.startsWith('--breakpoints=')) options.breakpoints = inlineValue(arg, '--breakpoints=', '--breakpoints');
    else if (arg === '--project') { options.project = optionValue(args, index, '--project'); index += 1; }
    else if (arg.startsWith('--project=')) options.project = inlineValue(arg, '--project=', '--project');
    else if (arg === '--root') { options.root = optionValue(args, index, '--root'); index += 1; }
    else if (arg.startsWith('--root=')) options.root = inlineValue(arg, '--root=', '--root');
    else if (arg === '--executable-path') { options.executablePath = optionValue(args, index, '--executable-path'); index += 1; }
    else if (arg.startsWith('--executable-path=')) options.executablePath = inlineValue(arg, '--executable-path=', '--executable-path');
    else if (arg === '--forced-colors') { options.forcedColors = optionValue(args, index, '--forced-colors'); index += 1; }
    else if (arg.startsWith('--forced-colors=')) options.forcedColors = inlineValue(arg, '--forced-colors=', '--forced-colors');
    else if (arg === '--locale') { options.locale = optionValue(args, index, '--locale'); index += 1; }
    else if (arg.startsWith('--locale=')) options.locale = inlineValue(arg, '--locale=', '--locale');
    else if (arg === '--timeout') { options.timeout = Number(optionValue(args, index, '--timeout')); index += 1; }
    else if (arg.startsWith('--timeout=')) options.timeout = Number(inlineValue(arg, '--timeout=', '--timeout'));
    else if (arg === '--wait-for') { options.waitFor = optionValue(args, index, '--wait-for'); index += 1; }
    else if (arg.startsWith('--wait-for=')) options.waitFor = inlineValue(arg, '--wait-for=', '--wait-for');
    else if (arg === '--wait-ms') { options.waitMs = Number(optionValue(args, index, '--wait-ms')); index += 1; }
    else if (arg.startsWith('--wait-ms=')) options.waitMs = Number(inlineValue(arg, '--wait-ms=', '--wait-ms'));
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else positional.push(arg);
  }
  if (!Number.isFinite(options.timeout) || options.timeout <= 0) throw new Error('--timeout must be a positive number');
  if (!Number.isFinite(options.waitMs) || options.waitMs < 0) throw new Error('--wait-ms must be a non-negative number');
  if (options.forcedColors !== null && options.forcedColors !== 'none' && options.forcedColors !== 'active') {
    throw new Error(`--forced-colors must be 'none' or 'active', got '${options.forcedColors}'`);
  }
  return { positional, options };
}

function parseBreakpoints(value) {
  return value.split(',').map((part) => {
    const match = /^(\d{3,5})x(\d{3,5})$/.exec(part.trim());
    if (!match) throw new Error(`invalid breakpoint '${part}'; expected WIDTHxHEIGHT`);
    return { width: Number(match[1]), height: Number(match[2]) };
  });
}

const mimeTypes = new Map(Object.entries({
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.wasm': 'application/wasm',
}));

async function createStaticTarget(target, options) {
  if (/^https?:\/\//i.test(target)) return { url: target, local: false, async close() {} };
  const resolved = path.resolve(target);
  if (!fs.existsSync(resolved)) throw new Error(`target is neither an http(s) URL nor an existing file/directory: ${target}`);
  const stat = fs.statSync(resolved);
  const fallbackRoot = stat.isDirectory() ? resolved : path.dirname(resolved);
  const configuredRoot = path.resolve(options.root || fallbackRoot);
  if (!fs.existsSync(configuredRoot) || !fs.statSync(configuredRoot).isDirectory()) throw new Error(`static server root is not a directory: ${configuredRoot}`);
  const lexicalRoot = configuredRoot;
  const root = fs.realpathSync(configuredRoot);
  const rootPrefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  const lexicalTarget = path.relative(lexicalRoot, resolved);
  if (lexicalTarget.startsWith('..') || path.isAbsolute(lexicalTarget)) throw new Error(`local target is outside the static server root: target=${resolved}; root=${lexicalRoot}`);
  const realTarget = fs.realpathSync(resolved);
  const realRelativeTarget = path.relative(root, realTarget);
  if (realRelativeTarget.startsWith('..') || path.isAbsolute(realRelativeTarget)) throw new Error(`local target resolves outside the static server root: target=${realTarget}; root=${root}`);
  const encodedTarget = lexicalTarget.split(path.sep).map(encodeURIComponent).join('/');
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
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
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
    response.writeHead(200, { 'content-type': mimeTypes.get(path.extname(file).toLowerCase()) || 'application/octet-stream', 'cache-control': 'no-store' });
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

const auditSource = `(auditOptions = {}) => {
  const findings = [];
  const vw = document.documentElement.clientWidth;
  const add = (type, severity, message, element) => {
    if (findings.length < 200) findings.push({ type, severity, message, element: element ? describe(element) : undefined });
  };
  const describe = (element) => {
    const id = element.id ? '#' + element.id : '';
    const cls = typeof element.className === 'string' && element.className.trim() ? '.' + element.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
    return (element.tagName || 'element').toLowerCase() + id + cls;
  };
  if (document.documentElement.scrollWidth > vw + 1) add('horizontal-overflow', 'high', 'document scrollWidth exceeds viewport: ' + document.documentElement.scrollWidth + ' > ' + vw);
  const elements = Array.from(document.querySelectorAll('body *')).slice(0, 5000);
  const colorContext = document.createElement('canvas').getContext('2d');
  const parseSerializedColor = (value) => {
    const text = (value || '').trim().toLowerCase();
    if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const hex = /^#([0-9a-f]{6}|[0-9a-f]{8})$/.exec(text);
    if (hex) {
      const digits = hex[1];
      return { r: parseInt(digits.slice(0, 2), 16), g: parseInt(digits.slice(2, 4), 16), b: parseInt(digits.slice(4, 6), 16), a: digits.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1 };
    }
    const rgb = /^rgba?\\(([^)]+)\\)$/.exec(text);
    if (!rgb) return null;
    const parts = rgb[1].split(',').map((part) => Number.parseFloat(part));
    if (parts.length < 3 || parts.slice(0, 3).some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 && !Number.isNaN(parts[3]) ? parts[3] : 1 };
  };
  const parseColor = (value) => {
    if (!value) return null;
    let serialized = null;
    for (const sentinel of ['#010203', '#040506']) {
      colorContext.fillStyle = sentinel;
      const before = colorContext.fillStyle;
      colorContext.fillStyle = value;
      if (colorContext.fillStyle !== before) {
        serialized = colorContext.fillStyle;
        break;
      }
    }
    return serialized ? parseSerializedColor(serialized) : null;
  };
  const luminance = (color) => {
    const convert = (channel) => {
      const c = channel / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * convert(color.r) + 0.7152 * convert(color.g) + 0.0722 * convert(color.b);
  };
  const contrast = (a, b) => {
    const la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const alphaBlend = (source, destination) => {
    const alpha = source.a + destination.a * (1 - source.a);
    if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (source.r * source.a + destination.r * destination.a * (1 - source.a)) / alpha,
      g: (source.g * source.a + destination.g * destination.a * (1 - source.a)) / alpha,
      b: (source.b * source.a + destination.b * destination.a * (1 - source.a)) / alpha,
      a: alpha,
    };
  };
  const canvasBackdrop = auditOptions.colorScheme === 'dark'
    ? { r: 18, g: 18, b: 18, a: 1 }
    : { r: 255, g: 255, b: 255, a: 1 };
  const effectiveContrastColors = (element, foregroundColor) => {
    const chain = [];
    let node = element;
    while (node && node.nodeType === 1) {
      chain.push(node);
      node = node.parentElement;
    }
    let bg = { r: 0, g: 0, b: 0, a: 0 };
    let fg = foregroundColor;
    let unparsedLogged = false;
    for (const current of chain) {
      const nodeStyle = getComputedStyle(current);
      const parsedBg = parseColor(nodeStyle.backgroundColor);
      if (!parsedBg && !unparsedLogged) {
        add('unchecked-contrast', 'medium', 'background color could not be parsed while compositing: ' + nodeStyle.backgroundColor, element);
        unparsedLogged = true;
      }
      const layerBg = parsedBg || { r: 0, g: 0, b: 0, a: 0 };
      const parsedOpacity = Number.parseFloat(nodeStyle.opacity);
      const opacity = Number.isFinite(parsedOpacity) ? Math.max(0, Math.min(1, parsedOpacity)) : 1;
      const innerBg = layerBg.a > 0 ? alphaBlend(bg, layerBg) : bg;
      const innerFg = layerBg.a > 0 ? alphaBlend(fg, layerBg) : fg;
      bg = opacity < 1 ? { ...innerBg, a: innerBg.a * opacity } : innerBg;
      fg = opacity < 1 ? { ...innerFg, a: innerFg.a * opacity } : innerFg;
    }
    return {
      background: alphaBlend(bg, canvasBackdrop),
      foreground: alphaBlend(fg, canvasBackdrop),
    };
  };
  const documentBounds = {
    right: Math.max(document.documentElement.scrollWidth, vw),
    bottom: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
  };
  const clippedByAncestor = (parent, rect) => {
    let node = parent;
    while (node && node.nodeType === 1) {
      const nodeStyle = getComputedStyle(node);
      if (nodeStyle.display !== 'contents') {
        const clip = node.getBoundingClientRect();
        const clippedHorizontally = /hidden|clip/.test(nodeStyle.overflowX) && (rect.right <= clip.left || rect.left >= clip.right);
        const clippedVertically = /hidden|clip/.test(nodeStyle.overflowY) && (rect.bottom <= clip.top || rect.top >= clip.bottom);
        if (clippedHorizontally || clippedVertically) return true;
      }
      node = node.parentElement;
    }
    return false;
  };
  const insideHorizontalScroller = (element) => {
    let node = element.parentElement;
    while (node && node.nodeType === 1 && node !== document.documentElement && node !== document.body) {
      const nodeStyle = getComputedStyle(node);
      if (/^(?:auto|scroll)$/.test(nodeStyle.overflowX)) {
        const scrollerRect = node.getBoundingClientRect();
        if (scrollerRect.left >= -2 && scrollerRect.right <= vw + 2) return true;
      }
      node = node.parentElement;
    }
    return false;
  };
  const renderedTextRects = (node) => {
    const parent = node.parentElement;
    if (!parent) return [];
    if (typeof parent.checkVisibility === 'function') {
      if (!parent.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return [];
    } else {
      let ancestor = parent;
      while (ancestor && ancestor.nodeType === 1) {
        const ancestorStyle = getComputedStyle(ancestor);
        if (ancestorStyle.display === 'none' || ancestorStyle.visibility === 'hidden' || ancestorStyle.visibility === 'collapse' || Number.parseFloat(ancestorStyle.opacity) === 0) return [];
        ancestor = ancestor.parentElement;
      }
    }
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
    if (range.detach) range.detach();
    return rects.filter((rect) => {
      const documentRect = { left: rect.left + window.scrollX, right: rect.right + window.scrollX, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
      const withinDocument = documentRect.right > 0 && documentRect.bottom > 0 && documentRect.left < documentBounds.right && documentRect.top < documentBounds.bottom;
      return withinDocument && !clippedByAncestor(parent, rect);
    });
  };
  const isModalBackdrop = (overlay, owner, style) => {
    if (style.position !== 'fixed' || !overlay.parentElement) return false;
    const bounds = overlay.getBoundingClientRect();
    if (bounds.left > 0 || bounds.top > 0 || bounds.right < vw || bounds.bottom < innerHeight) return false;
    return Array.from(overlay.parentElement.children).some((dialog) => {
      if (dialog === overlay || !dialog.matches('[aria-modal="true"]') || dialog.contains(owner)
          || dialog.closest('[hidden], [aria-hidden="true"], [inert]')
          || !dialog.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
      const rect = dialog.getBoundingClientRect();
      const left = Math.max(0, rect.left), right = Math.min(vw, rect.right);
      const top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
      if (left >= right || top >= bottom) return false;
      const stack = document.elementsFromPoint((left + right) / 2, (top + bottom) / 2);
      const dialogIndex = stack.findIndex((hit) => dialog.contains(hit));
      return dialogIndex !== -1 && stack.indexOf(overlay) > dialogIndex;
    });
  };
  const coveringElement = (owner, rect) => {
    if (rect.left < 0 || rect.right > vw || rect.top < 0 || rect.bottom > innerHeight
        || rect.width < 8 || rect.height < 8) return null;
    const y = rect.top + rect.height / 2;
    const hits = [0.25, 0.5, 0.75].map((frac) => document.elementFromPoint(rect.left + rect.width * frac, y));
    const cover = hits[0];
    if (!cover || !hits.every((hit) => hit === cover) || cover.contains(owner) || owner.contains(cover)) return null;
    const modal = cover.closest('dialog:modal, [aria-modal="true"]');
    if (modal && !modal.contains(owner)) return null;
    let current = cover;
    while (current && !current.contains(owner)) {
      const style = getComputedStyle(current);
      if (Number.parseFloat(style.opacity) !== 1) return null;
      if ((parseColor(style.backgroundColor)?.a ?? 0) >= 0.99) {
        for (let ancestor = current.parentElement; ancestor; ancestor = ancestor.parentElement) {
          if (Number.parseFloat(getComputedStyle(ancestor).opacity) !== 1) return null;
        }
        return isModalBackdrop(current, owner, style) ? null : current;
      }
      current = current.parentElement;
    }
    return null;
  };
  const closedDisclosures = Array.from(document.querySelectorAll('details:not([open])'));
  const inClosedPopover = (element) => {
    try {
      return Boolean(element.closest('[popover]:not(:popover-open)'));
    } catch {
      return false;
    }
  };
  const intentionallyHidden = (element) => element.closest('[hidden], [aria-hidden="true"], [inert], dialog:not([open])')
    || inClosedPopover(element)
    || closedDisclosures.some((details) =>
      details.contains(element) && !Array.from(details.children).find((child) => child.tagName === 'SUMMARY')?.contains(element));
  const interactiveSelector = 'button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="menuitem"]';
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const essential = element.matches('main, h1, [data-pixelcraft-essential]');
    if (essential && !intentionallyHidden(element)
        && element.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) === false
        && style.display !== 'contents') {
      add('content-hidden-at-rest', 'medium', 'landmark, heading or marked essential content was not visible after settling', element);
    }
    if (element.tagName === 'IMG' && (element.currentSrc || element.getAttribute('src')?.trim() || element.getAttribute('srcset')?.trim())
        && element.complete && element.naturalWidth === 0 && !intentionallyHidden(element) && rect.width > 0 && rect.height > 0
        && element.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) !== false) {
      add('broken-image', 'high', 'visible image finished loading with no intrinsic width', element);
    }
    if (rect.width > 2 && rect.height > 2 && style.visibility !== 'hidden' && style.display !== 'none') {
      if ((rect.left < -2 || rect.right > vw + 2) && !insideHorizontalScroller(element)) {
        add('outside-viewport', 'medium', 'rendered box extends outside horizontal viewport: ' + JSON.stringify({ left: Math.round(rect.left), right: Math.round(rect.right), viewport: vw }), element);
      }
      const clippedX = element.scrollWidth > element.clientWidth + 2 && /hidden|clip/.test(style.overflowX);
      const clippedY = element.scrollHeight > element.clientHeight + 2 && /hidden|clip/.test(style.overflowY);
      if ((clippedX || clippedY) && element.textContent.trim()) add('clipped-text', 'medium', 'text content may be clipped by hidden overflow', element);
      if (element.matches(interactiveSelector) && !intentionallyHidden(element)
          && element.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) !== false) {
        const inlineProseLink = element.tagName === 'A' && style.display === 'inline' && Boolean(element.closest('p, li, dd, dt, blockquote, td, th'));
        if (!inlineProseLink && (rect.width < 24 || rect.height < 24)) {
          add('small-touch-target', 'low', 'interactive target is ' + Math.round(rect.width) + 'x' + Math.round(rect.height) + ' CSS px (< 24x24 WCAG 2.5.8 heuristic)', element);
        }
      }
    }
    const textRects = Array.from(element.childNodes).flatMap((node) => node.nodeType === 3 && node.textContent.trim() ? renderedTextRects(node) : []);
    if (textRects.length) {
      const cover = textRects.slice(0, 8).map((line) => coveringElement(element, line)).find(Boolean);
      if (cover) add('text-occlusion', 'medium', 'visible text range is covered at three sample points by ' + describe(cover), element);
      const fg = parseColor(style.color);
      if (fg) {
        const { foreground, background } = effectiveContrastColors(element, fg);
        const ratio = contrast(foreground, background);
        const size = Number.parseFloat(style.fontSize) || 16;
        const weight = Number.parseInt(style.fontWeight, 10) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const required = large ? 3 : 4.5;
        if (ratio + 0.05 < required) add('low-contrast-text', 'high', 'approximate contrast ' + ratio.toFixed(2) + ':1 below ' + required + ':1', element);
      } else {
        add('unchecked-contrast', 'medium', 'text color could not be parsed by the browser canvas normalization path: ' + style.color, element);
      }
    }
  }
  return { viewportWidth: vw, documentWidth: document.documentElement.scrollWidth, findings };
}`;

async function auditKeyboard(page) {
  const initial = await page.evaluateHandle(() => {
    const properties = ['outlineColor', 'outlineStyle', 'outlineWidth', 'outlineOffset', 'boxShadow',
      'borderColor', 'borderWidth', 'backgroundColor', 'color', 'textDecorationLine', 'textDecorationColor',
      'opacity', 'visibility', 'content', 'transform'];
    const signature = (element) => {
      const styles = [getComputedStyle(element), getComputedStyle(element, '::before'), getComputedStyle(element, '::after')];
      return styles.map((style) => properties.map((key) => style[key]).join('|')).join(':');
    };
    const baseline = new WeakMap();
    for (const element of document.querySelectorAll('html, body, body *')) baseline.set(element, signature(element));
    return { baseline, signature };
  });
  const stops = [];
  const findings = [];
  try {
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press('Tab');
      const stop = await page.evaluate(({ baseline, signature }) => {
        const element = document.activeElement;
        if (!element || element === document.body || element === document.documentElement) return null;
        const name = element.localName + (element.id ? '#' + element.id : '');
        const fixedOrStickyOwner = (node) => {
          let cur = node;
          while (cur && cur.nodeType === 1 && cur !== document.documentElement && cur !== document.body) {
            const st = getComputedStyle(cur);
            if (st.position === 'fixed' || st.position === 'sticky') return cur;
            cur = cur.parentElement;
          }
          return null;
        };
        const checkObscured = () => {
          const rect = element.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return null;
          const points = [
            [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
            [rect.left + Math.min(rect.width * 0.25, rect.width - 1), rect.top + Math.min(rect.height * 0.25, rect.height - 1)],
            [rect.left + Math.max(rect.width * 0.75, 1), rect.top + Math.max(rect.height * 0.75, 1)],
          ].filter(([x, y]) => x >= 0 && x < innerWidth && y >= 0 && y < innerHeight);
          if (!points.length) return null;
          let overlay = null;
          let coveredCount = 0;
          for (const [x, y] of points) {
            const hit = document.elementFromPoint(x, y);
            if (!hit || hit === element || element.contains(hit) || hit.contains(element)) continue;
            const pinned = fixedOrStickyOwner(hit);
            if (pinned && !pinned.contains(element)) {
              coveredCount += 1;
              overlay = pinned;
            }
          }
          if (!overlay || coveredCount === 0) return null;
          const id = overlay.id ? '#' + overlay.id : '';
          const cls = typeof overlay.className === 'string' && overlay.className.trim()
            ? '.' + overlay.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';
          return { by: (overlay.tagName || 'element').toLowerCase() + id + cls, fully: coveredCount === points.length };
        };
        const obscured = checkObscured();
        if (!baseline.has(element) || element.shadowRoot || element.matches('iframe, :read-write')) {
          return { element: name, indicator: 'not-checked', obscured };
        }
        for (let node = element; node; node = node.parentElement) {
          if (!baseline.has(node)) return { element: name, indicator: 'not-checked', obscured };
          if (signature(node) !== baseline.get(node)) return { element: name, indicator: 'style-change', obscured };
        }
        const style = getComputedStyle(element);
        return {
          element: name,
          indicator: style.outlineStyle === 'none' || parseFloat(style.outlineWidth) === 0 ? 'not-detected' : 'not-checked',
          obscured,
        };
      }, initial);
      if (!stop) break;
      stops.push({ element: stop.element, indicator: stop.indicator });
      if (stop.indicator === 'not-detected') {
        findings.push({
          type: 'keyboard-focus-not-detected',
          severity: 'medium',
          element: stop.element,
          message: 'Tab reached this element but no focus style change was detected; inspect the focused state manually',
        });
      }
      if (stop.obscured) {
        findings.push({
          type: 'focus-obscured',
          severity: stop.obscured.fully ? 'high' : 'medium',
          element: stop.element,
          message: `focused element is ${stop.obscured.fully ? 'fully' : 'partially'} obscured by fixed/sticky overlay ${stop.obscured.by} (WCAG 2.4.11)`,
        });
      }
    }
  } finally {
    await initial.dispose();
  }
  return { stops, findings };
}

function trackDataRequests(page) {
  let pending = 0;
  const isDataRequest = (request) => ['fetch', 'xhr'].includes(request.resourceType());
  page.on('request', (request) => {
    if (isDataRequest(request)) pending += 1;
  });
  const finish = (request) => {
    if (isDataRequest(request) && pending > 0) pending -= 1;
  };
  page.on('requestfinished', finish);
  page.on('requestfailed', finish);
  return () => pending;
}

async function settlePage(page, options, pendingRequests, allowMissingSelector = false) {
  const deadline = Date.now() + options.waitMs;
  const remaining = () => Math.max(0, deadline - Date.now());
  let waitForTimedOut = false;
  if (options.waitFor) {
    try {
      await page.waitForSelector(options.waitFor, { timeout: Math.max(1, remaining()) });
    } catch (error) {
      if (error?.name !== 'TimeoutError') throw error;
      if (!allowMissingSelector) throw new Error(`--wait-for selector did not appear within ${options.waitMs}ms: ${options.waitFor}`);
      waitForTimedOut = true;
    }
  }
  while (pendingRequests() > 0 && remaining() > 0) await page.waitForTimeout(Math.min(100, remaining()));
  const fontBudget = Math.min(1000, remaining());
  if (fontBudget > 0) {
    await Promise.race([
      page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve())).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, fontBudget)),
    ]);
  }
  const paintSettle = Math.min(300, remaining());
  if (paintSettle > 0) await page.waitForTimeout(paintSettle);
  return { waitForTimedOut };
}

async function main() {
  const { positional, options } = parse(process.argv.slice(2));
  if (options.help) {
    console.log(help());
    return;
  }
  const target = positional[0];
  if (!target) throw new Error('missing URL or file; run with --help');
  const breakpoints = parseBreakpoints(options.breakpoints);

  let chromium;
  try {
    const projectRequire = createRequire(path.join(path.resolve(options.project), 'pixelcraft-shoot-require.cjs'));
    ({ chromium } = projectRequire('playwright'));
  } catch {
    try {
      ({ chromium } = await import('playwright'));
    } catch {
      console.error('Playwright is not installed in this dependency context. Install it explicitly in the target project, for example: npm install --save-dev playwright && npx playwright install chromium');
      process.exitCode = 2;
      return;
    }
  }

  const out = path.resolve(options.out);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(options.executablePath ? { executablePath: options.executablePath } : {}) });
  const staticTarget = await createStaticTarget(target, options);
  const report = {
    target,
    generatedAt: new Date().toISOString(),
    captures: [],
    heuristic: true,
    ...(options.forcedColors ? { forcedColors: options.forcedColors } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
  };
  let sawHttpError = false;
  try {
    for (const viewport of breakpoints) {
      for (const colorScheme of options.lightOnly ? ['light'] : ['light', 'dark']) {
        for (const reducedMotion of options.reducedMotion ? ['no-preference', 'reduce'] : ['no-preference']) {
          const page = await browser.newPage({
            viewport,
            colorScheme,
            reducedMotion,
            ...(options.forcedColors ? { forcedColors: options.forcedColors } : {}),
            ...(options.locale ? { locale: options.locale } : {}),
          });
          const pendingRequests = trackDataRequests(page);
          const response = await page.goto(staticTarget.url, { waitUntil: 'load', timeout: options.timeout });
          const status = response ? response.status() : null;
          if (status !== null && status >= 400) sawHttpError = true;
          const settle = await settlePage(page, options, pendingRequests, status !== null && status >= 400);
          const name = `${viewport.width}x${viewport.height}-${colorScheme}-${reducedMotion === 'reduce' ? 'reduced-motion' : 'motion'}.png`;
          const file = path.join(out, name);
          await page.screenshot({ path: file, fullPage: true });
          const audit = await page.evaluate(`(${auditSource})(${JSON.stringify({ colorScheme })})`);
          if (options.keyboard) {
            const keyboard = await auditKeyboard(page);
            audit.keyboard = keyboard.stops;
            audit.findings.push(...keyboard.findings);
          }
          report.captures.push({ file: name, viewport, colorScheme, reducedMotion: reducedMotion === 'reduce', status, ...(settle.waitForTimedOut ? { waitFor: options.waitFor, waitForTimedOut: true } : {}), ...audit });
          console.log(`captured: ${name}; findings=${audit.findings.length}`);
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
    await staticTarget.close();
  }
  fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`report: ${path.join(out, 'report.json')}`);
  if (sawHttpError && !options.allowHttpError) {
    console.error('capture target returned HTTP 4xx/5xx; use --allow-http-error only when intentionally capturing error-page designs');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`shoot: ${error.message}`);
  process.exit(1);
});
