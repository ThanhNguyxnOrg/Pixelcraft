#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const exts = new Set([
  '.css', '.scss', '.pcss', '.less', '.html', '.jsx', '.tsx', '.vue', '.svelte', '.astro', '.mdx',
  '.razor', '.heex', '.php', '.erb', '.templ', '.mjml', '.qml', '.xaml', '.uss', '.uxml',
  '.dart', '.swift', '.kt', '.py', '.rs', '.slint', '.go', '.qss', '.tcss', '.js', '.ts',
  '.gd', '.tscn', '.tres', '.typ', '.tex', '.cs', '.axaml', '.cpp', '.hpp', '.h', '.c',
  '.lua', '.java', '.fxml', '.rb', '.ex', '.exs', '.zig', '.ets', '.blp', '.r', '.jl',
  '.elm', '.cljs', '.fs', '.scala', '.twig',
]);
const cssExts = new Set(['.css', '.scss', '.pcss', '.less', '.qss', '.tcss', '.uss']);
const markupExts = new Set(['.html', '.vue', '.svelte', '.astro']);
const skip = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.astro', '.output', 'target', '.venv', '__pycache__',
  'Pods', '.dart_tool', '.gradle', 'out', '.turbo', 'vendor',
]);
const skillHosts = new Set([
  '.claude', '.agents', '.cursor', '.gemini', '.github', '.copilot',
  '.opencode', '.windsurf', '.kiro', '.cline', '.roo', '.factory',
]);
const disclaimer = 'A zero score means only that these known fingerprints were not detected; zero findings is not evidence of good design.';
const brandRules = new Set(['default-font-only', 'purple-blue-gradient', 'rounded-2xl-repetition',
  'uniform-shadow', 'centered-hero-two-ctas', 'gradient-text-treatment', 'rounded-accent-rail']);

function help() {
  return `Usage: node slop-scan.mjs <file-or-directory> [--json] [--waivers FILE] [--fail-on p0|p1|p2|any]\n\nScan source files for recurring AI-slop fingerprints and floor defects.\nOutput includes file:line, severity, score contribution, and a suggested fix.\nWhen --fail-on is passed, exits 1 if any active finding meets or exceeds that severity.\n${disclaimer}`;
}
function partsOf(file) { return file.split(/[\\/]/); }
function isInstalledPixelcraftSkill(file) {
  const parts = partsOf(file);
  return parts.some((part, i) => skillHosts.has(part) && parts[i + 1] === 'skills' && parts[i + 2]?.startsWith('pixelcraft'));
}
function isInsidePixelcraftSkill(file) {
  const parts = partsOf(file);
  return parts.some((part, i) => part === 'skills' && parts[i + 1]?.startsWith('pixelcraft'));
}
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (isInstalledPixelcraftSkill(file)) continue;
    if ((entry.name === 'fixtures' || entry.name === 'examples') && isInsidePixelcraftSkill(file)) continue;
    if (entry.isDirectory()) walk(file, out);
    else if (exts.has(path.extname(entry.name))) out.push(file);
  }
  return out;
}
function lineOf(text, index) { return text.slice(0, index).split(/\r?\n/).length; }

function maskCssComments(text) {
  const chars = text.split('');
  let quote = '';
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '/' && text[i + 1] === '*') {
      chars[i] = chars[i + 1] = ' ';
      i += 2;
      for (; i < text.length; i += 1) {
        if (text[i] === '*' && text[i + 1] === '/') {
          chars[i] = chars[i + 1] = ' ';
          i += 1;
          break;
        }
        if (text[i] !== '\n' && text[i] !== '\r') chars[i] = ' ';
      }
    }
  }
  return chars.join('');
}

function blankRange(chars, start, end) {
  for (let i = start; i <= end && i < chars.length; i += 1) {
    if (chars[i] !== '\n' && chars[i] !== '\r') chars[i] = ' ';
  }
}

function findBraceEnd(text, open) {
  let depth = 1, quote = '';
  for (let i = open + 1; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function extractNestedBlocks(body) {
  const declarationChars = body.split('');
  const nested = [];
  let chunkStart = 0, depth = 0, quote = '';
  for (let i = 0; i < body.length; i += 1) {
    const c = body[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth += 1;
    else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) chunkStart = i + 1;
    else if (c === '{' && depth === 0) {
      const end = findBraceEnd(body, i);
      if (end < 0) break;
      const rawPrelude = body.slice(chunkStart, i);
      const prelude = rawPrelude.trim();
      if (prelude) {
        nested.push({
          prelude,
          body: body.slice(i + 1, end),
          selectorIndex: chunkStart + rawPrelude.length - rawPrelude.trimStart().length,
          bodyIndex: i + 1
        });
      }
      blankRange(declarationChars, chunkStart, end);
      chunkStart = end + 1;
      i = end;
    }
  }
  return { declarationText: declarationChars.join(''), nested };
}

function skipComment(text, i) {
  const end = text.indexOf('*/', i + 2);
  return end < 0 ? text.length : end + 2;
}

function styleSegments(text) {
  const lower = text.toLowerCase();
  const out = [];
  let pos = 0;
  while (pos < text.length) {
    const open = lower.indexOf('<style', pos);
    if (open < 0) break;
    const tagEnd = lower.indexOf('>', open);
    if (tagEnd < 0) break;
    const close = lower.indexOf('</style', tagEnd + 1);
    if (close < 0) break;
    out.push({ text: text.slice(tagEnd + 1, close), offset: tagEnd + 1 });
    pos = close + 8;
  }
  return out;
}

function cssSegments(file, text) {
  const ext = path.extname(file);
  if (cssExts.has(ext)) return [{ text, offset: 0 }];
  if (markupExts.has(ext)) return styleSegments(text);
  return [];
}

function splitSelectorList(selector) {
  const out = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i < selector.length; i += 1) {
    const c = selector[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth += 1;
    else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
    else if (c === ',' && depth === 0) {
      out.push(selector.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(selector.slice(start).trim());
  return out.filter(Boolean);
}

function stripNotContents(selector) {
  let out = '';
  for (let i = 0; i < selector.length; i += 1) {
    if (selector.slice(i, i + 5).toLowerCase() === ':not(') {
      let depth = 1, quote = '';
      i += 5;
      for (; i < selector.length && depth; i += 1) {
        const c = selector[i];
        if (quote) {
          if (c === '\\') i += 1;
          else if (c === quote) quote = '';
        } else if (c === '"' || c === "'") quote = c;
        else if (c === '(') depth += 1;
        else if (c === ')') depth -= 1;
      }
      i -= 1;
    } else out += selector[i];
  }
  return out;
}

function selectorFocusState(selector) {
  const stripped = stripNotContents(selector);
  return {
    positive: /:focus-visible(?![-_a-z0-9])/i.test(stripped) || /:focus(?![-_a-z0-9])/i.test(stripped),
    excludesFocusVisible: /:not\(\s*:focus-visible\s*\)/i.test(selector)
  };
}

function selectorContexts(selectorText, inherited) {
  const contexts = [];
  const parents = inherited.length ? inherited : [{ positive: false, excludesFocusVisible: false }];
  for (const parent of parents) {
    for (const selector of splitSelectorList(selectorText)) {
      const own = selectorFocusState(selector);
      const sameElement = selector.includes('&');
      const positive = own.positive || (sameElement && parent.positive);
      const excludesFocusVisible = own.excludesFocusVisible || (sameElement && parent.excludesFocusVisible);
      contexts.push({ positive, excludesFocusVisible, relevant: positive && !excludesFocusVisible });
    }
  }
  return contexts;
}

function declarations(body) {
  const out = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i <= body.length; i += 1) {
    const c = body[i] || ';';
    if (c === '/' && body[i + 1] === '*') { i = skipComment(body, i) - 1; continue; }
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth += 1;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) {
      const raw = body.slice(start, i);
      const colon = raw.indexOf(':');
      if (colon > 0) out.push({ prop: raw.slice(0, colon).trim().toLowerCase(), value: raw.slice(colon + 1).trim().toLowerCase(), offset: start + colon + 1 });
      start = i + 1;
    }
  }
  return out;
}

const visibleOutlineStyles = new Set(['auto', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']);
const invisibleOutlineStyles = new Set(['none', 'hidden']);
const visibleBorderStyles = new Set(['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']);
const textDecorationLines = new Set(['underline', 'overline', 'line-through', 'blink', 'spelling-error', 'grammar-error']);
const cssColorKeywords = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent currentcolor canvas canvastext linktext visitedtext activetext buttonface buttontext buttonborder field fieldtext highlight highlighttext selecteditem selecteditemtext mark marktext graytext accentcolor accentcolortext').split(' '));

function cleanValue(value) {
  return value.replace(/\s*!important\s*$/, '').trim();
}

function splitValueTokens(value) {
  const out = [];
  let start = 0, depth = 0, quote = '';
  const push = (end) => {
    const token = value.slice(start, end).trim();
    if (token) out.push(token);
  };
  for (let i = 0; i < value.length; i += 1) {
    const c = value[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth += 1;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (/\s/.test(c) && depth === 0) {
      push(i);
      start = i + 1;
    }
  }
  push(value.length);
  return out;
}

function isZeroWidth(token) {
  return /^-?0(?:\.0+)?(?:[a-z%]+)?$/.test(token);
}

function isNonzeroNumericWidth(token) {
  const match = /^(-?(?:\d+|\d*\.\d+))(?:[a-z%]+)?$/.exec(token);
  return match !== null && Number(match[1]) !== 0;
}

function isVisibleWidth(token) {
  return token === 'thin' || token === 'medium' || token === 'thick' || isNonzeroNumericWidth(token);
}

function isColorToken(token) {
  return token.startsWith('#') || cssColorKeywords.has(token)
    || /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark|contrast-color)\(/.test(token);
}

function outlineTokenKind(token) {
  if (invisibleOutlineStyles.has(token)) return 'invisible-style';
  if (visibleOutlineStyles.has(token)) return 'visible-style';
  if (isZeroWidth(token)) return 'zero-width';
  if (isVisibleWidth(token)) return 'width';
  if (isColorToken(token)) return 'color';
  return 'unknown';
}

function hasUnresolvedTokens(value) {
  return splitValueTokens(cleanValue(value)).some((token) => outlineTokenKind(token) === 'unknown');
}

function parseOutlineShorthand(value) {
  const parsed = { style: 'none', width: 'medium', removes: false, unknown: false };
  for (const token of splitValueTokens(cleanValue(value))) {
    const kind = outlineTokenKind(token);
    if (kind === 'unknown') parsed.unknown = true;
    else if (kind === 'invisible-style') {
      parsed.style = token;
      parsed.removes = true;
    } else if (kind === 'visible-style') parsed.style = token;
    else if (kind === 'zero-width') {
      parsed.width = token;
      parsed.removes = true;
    } else if (kind === 'width') parsed.width = token;
  }
  if (parsed.unknown) parsed.removes = false;
  return parsed;
}

function analyzeOutline(decls) {
  let style = 'none', width = 'medium', removal = null;
  let styleUnknown = false, widthUnknown = false;
  for (const decl of decls) {
    const value = cleanValue(decl.value);
    if (decl.prop === 'outline') {
      const parsed = parseOutlineShorthand(value);
      if (parsed.unknown) {
        styleUnknown = true;
        widthUnknown = true;
        style = 'none';
        width = 'medium';
      } else {
        style = parsed.style;
        width = parsed.width;
        styleUnknown = false;
        widthUnknown = false;
      }
      if (parsed.removes && !removal) removal = decl;
    } else if (decl.prop === 'outline-style') {
      style = value;
      styleUnknown = hasUnresolvedTokens(value);
      if (!styleUnknown && invisibleOutlineStyles.has(value) && !removal) removal = decl;
    } else if (decl.prop === 'outline-width') {
      width = value;
      widthUnknown = hasUnresolvedTokens(value);
      if (!widthUnknown && isZeroWidth(value) && !removal) removal = decl;
    }
  }
  const styleHides = !styleUnknown && invisibleOutlineStyles.has(style);
  const widthHides = !widthUnknown && isZeroWidth(width);
  const visible = !styleHides && !widthHides
    && (styleUnknown || widthUnknown || (visibleOutlineStyles.has(style) && isVisibleWidth(width)));
  return { removal, visible };
}

function borderShorthandProp(prop) {
  return prop === 'border' || /^border-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?$/.test(prop);
}

function borderColorProp(prop) {
  return prop === 'border-color' || /^border-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?-color$/.test(prop);
}

function visibleBorder(value) {
  let styled = false, zero = false, invisible = false;
  for (const token of splitValueTokens(cleanValue(value))) {
    if (isZeroWidth(token)) zero = true;
    else if (visibleBorderStyles.has(token)) styled = true;
    else if (token === 'none' || token === 'hidden') invisible = true;
  }
  return styled && !zero && !invisible;
}

function visibleTextDecoration(value) {
  return splitValueTokens(cleanValue(value)).some((token) => textDecorationLines.has(token));
}

function isTransparentColorToken(token) {
  if (token === 'transparent') return true;
  const hex4 = /^#[0-9a-f]{3}([0-9a-f])$/.exec(token);
  if (hex4 && hex4[1] === '0') return true;
  const hex8 = /^#[0-9a-f]{6}([0-9a-f]{2})$/.exec(token);
  if (hex8 && hex8[1] === '00') return true;
  const alphaComma = /^(?:rgba|hsla)\([^)]*,\s*([0-9.]+%?)\s*\)$/.exec(token);
  if (alphaComma && Number.parseFloat(alphaComma[1]) === 0) return true;
  const alphaSlash = /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^)]*\/\s*([0-9.]+%?)\s*\)$/.exec(token);
  if (alphaSlash && Number.parseFloat(alphaSlash[1]) === 0) return true;
  return false;
}

function visibleBoxShadow(value) {
  const clean = cleanValue(value);
  if (!clean || clean === 'none') return false;
  return splitSelectorList(clean).some((layer) => {
    const tokens = splitValueTokens(layer);
    if (!tokens.length || tokens.includes('none')) return false;
    let hasUnknown = false;
    let hasNonzeroLength = false;
    let lengthCount = 0;
    let hasTransparentColor = false;
    for (const token of tokens) {
      if (token === 'inset') continue;
      if (isZeroWidth(token)) {
        lengthCount += 1;
      } else if (isNonzeroNumericWidth(token)) {
        lengthCount += 1;
        hasNonzeroLength = true;
      } else if (isColorToken(token)) {
        if (isTransparentColorToken(token)) hasTransparentColor = true;
      } else {
        hasUnknown = true;
      }
    }
    if (hasTransparentColor) return false;
    if (hasUnknown) return true;
    return lengthCount > 0 && hasNonzeroLength;
  });
}

function visibleReplacement(decls, outline) {
  if (outline.visible) return true;
  let visibleBorderStyle = false, positiveBorderWidth = false;
  for (const { prop, value } of decls) {
    const tokens = splitValueTokens(cleanValue(value));
    if (prop === 'border-style' && tokens.some((token) => visibleBorderStyles.has(token))) visibleBorderStyle = true;
    if (prop === 'border-width' && tokens.some((token) => isVisibleWidth(token))) positiveBorderWidth = true;
  }
  if (visibleBorderStyle && positiveBorderWidth) return true;
  return decls.some(({ prop, value }) => {
    const clean = cleanValue(value);
    if (prop === 'box-shadow') return visibleBoxShadow(clean);
    if (borderShorthandProp(prop)) return visibleBorder(clean);
    if (borderColorProp(prop)) return clean !== 'none' && clean !== 'transparent';
    if (prop === 'text-decoration' || prop === 'text-decoration-line') return visibleTextDecoration(clean);
    return false;
  });
}

function scanRuleList(text, baseOffset, sourceText, visit, inherited) {
  let i = 0;
  while (i < text.length) {
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (i >= text.length) break;
    const start = i;
    let quote = '', depth = 0, terminator = '';
    for (; i < text.length; i += 1) {
      const c = text[i];
      if (quote) {
        if (c === '\\') i += 1;
        else if (c === quote) quote = '';
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '(' || c === '[') depth += 1;
      else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
      else if ((c === '{' || c === ';') && depth === 0) {
        terminator = c;
        break;
      }
    }
    if (terminator === ';') {
      i += 1;
      continue;
    }
    if (terminator !== '{') break;
    const rawPrelude = text.slice(start, i);
    const end = findBraceEnd(text, i);
    if (end < 0) break;
    scanRule({
      prelude: rawPrelude.trim(),
      body: text.slice(i + 1, end),
      selectorIndex: baseOffset + start + rawPrelude.length - rawPrelude.trimStart().length,
      bodyIndex: baseOffset + i + 1
    }, sourceText, visit, inherited);
    i = end + 1;
  }
}

function scanRule(rule, sourceText, visit, inherited) {
  const parts = extractNestedBlocks(rule.body);
  let childInherited = inherited;
  if (rule.prelude && !rule.prelude.startsWith('@')) {
    const contexts = selectorContexts(rule.prelude, inherited);
    visit(rule.prelude, declarations(parts.declarationText), {
      selectorIndex: rule.selectorIndex,
      bodyIndex: rule.bodyIndex,
      sourceText
    }, contexts);
    childInherited = contexts;
  }
  for (const nested of parts.nested) {
    scanRule({
      prelude: nested.prelude,
      body: nested.body,
      selectorIndex: rule.bodyIndex + nested.selectorIndex,
      bodyIndex: rule.bodyIndex + nested.bodyIndex
    }, sourceText, visit, childInherited);
  }
}

function scanRules(segment, baseOffset, sourceText, visit) {
  scanRuleList(segment.text, baseOffset, sourceText, visit, [{ positive: false, excludesFocusVisible: false }]);
}

const aiDefaultFonts = new Set(['inter', 'roboto', 'geist', 'arial']);
const defaultOnlyFontStack = new Set(['inter', 'roboto', 'geist', 'arial', 'sans-serif', 'system-ui']);
const slashCommentExts = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.scss', '.less', '.pcss', '.dart', '.swift', '.kt', '.rs', '.slint', '.go', '.qml', '.php',
  '.cs', '.cpp', '.hpp', '.h', '.c', '.java', '.zig', '.ets', '.blp', '.fs', '.scala', '.typ',
]);
const hashCommentExts = new Set(['.py', '.rb', '.gd', '.r', '.jl', '.ex', '.exs']);
const dashCommentExts = new Set(['.lua', '.elm']);
const semiCommentExts = new Set(['.cljs']);
const doubleQuoteOnlyExts = new Set(['.cljs', '.elm', '.rs', '.fs', '.jl']);
const twOutlineRemoveRe = /^(?:[a-z0-9-[\]()]+:)*focus(?:-visible)?:!?outline-(?:none|0)$/i;
const twFocusReplaceRe = /^(?:[a-z0-9-[\]()]+:)*focus(?:-visible)?:!?(?:ring(?!-(?:0(?=$|\/|-)|offset(?:$|-)|transparent(?=$|\/)))(?:$|-[a-z0-9[\]#%./()-]+)|outline(?:$|-(?!none$|0$|offset(?:$|-)|transparent$)[a-z0-9[\]#%./()-]+)|border(?:$|-(?!0$|none$|transparent$)[a-z0-9[\]#%./()-]+)|shadow(?:$|-(?!none$)[a-z0-9[\]#%./()-]+)|underline)$/i;
const twTransitionAllRe = /^(?:[a-z0-9-[\]()]+:)*!?transition-all$/i;
const twAnimateUtilityRe = /^(?:[a-z0-9-[\]()]+:)*!?animate-(?:bounce|pulse|ping|spin)$/i;

function isDefaultFontOnly(value) {
  const cleaned = cleanValue(value).replace(/;.*$/, '').trim();
  if (!cleaned) return false;
  const families = splitSelectorList(cleaned)
    .map((f) => f.trim().replace(/^['"]|['"]$/g, '').trim().toLowerCase())
    .filter(Boolean);
  if (!families.length) return false;
  return families.some((f) => aiDefaultFonts.has(f)) && families.every((f) => defaultOnlyFontStack.has(f));
}

function maskSourceComments(text, ext) {
  const chars = text.split('');
  const allowSlash = slashCommentExts.has(ext);
  const allowHash = hashCommentExts.has(ext);
  const allowDash = dashCommentExts.has(ext);
  const allowSemi = semiCommentExts.has(ext);
  const allowHtml = !cssExts.has(ext);
  const allowBlockSlash = cssExts.has(ext) || allowSlash || markupExts.has(ext)
    || ['.mdx', '.razor', '.heex', '.erb', '.templ', '.mjml', '.twig'].includes(ext);
  for (let i = 0; i < text.length; i += 1) {
    if (allowBlockSlash && text[i] === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end < 0 ? text.length - 1 : end + 1;
      blankRange(chars, i, stop);
      i = stop;
    } else if (allowHtml && text.slice(i, i + 4) === '<!--') {
      const end = text.indexOf('-->', i + 4);
      const stop = end < 0 ? text.length - 1 : end + 2;
      blankRange(chars, i, stop);
      i = stop;
    }
  }
  if (!allowSlash && !allowHash && !allowDash && !allowSemi) return chars.join('');
  const doubleOnly = doubleQuoteOnlyExts.has(ext);
  const outLines = chars.join('').split('\n').map((line) => {
    let quote = '';
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];
      if (quote) {
        if (c === '\\') i += 1;
        else if (c === quote) quote = '';
      } else if (c === '"' || (!doubleOnly && (c === "'" || c === '`'))) {
        quote = c;
      } else if (allowSlash && c === '/' && line[i + 1] === '/' && (i === 0 || line[i - 1] !== ':')) {
        return line.slice(0, i) + ' '.repeat(line.length - i);
      } else if (allowHash && c === '#' && !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F_])/.test(line.slice(i))) {
        return line.slice(0, i) + ' '.repeat(line.length - i);
      } else if (allowDash && c === '-' && line[i + 1] === '-') {
        return line.slice(0, i) + ' '.repeat(line.length - i);
      } else if (allowSemi && c === ';') {
        return line.slice(0, i) + ' '.repeat(line.length - i);
      }
    }
    return line;
  });
  return outLines.join('\n');
}

function findTagEnd(text, start) {
  let quote = '', braceDepth = 0;
  for (let i = start; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'" || c === '`') {
      quote = c;
    } else if (c === '{') {
      braceDepth += 1;
    } else if (c === '}' && braceDepth > 0) {
      braceDepth -= 1;
    } else if (c === '>' && braceDepth === 0) {
      return i;
    }
  }
  return -1;
}

function extractStringChunks(expr, baseOffset) {
  const chunks = [];
  for (let i = 0; i < expr.length; i += 1) {
    const c = expr[i];
    if (c === '"' || c === "'") {
      const start = i + 1;
      i += 1;
      for (; i < expr.length; i += 1) {
        if (expr[i] === '\\') i += 1;
        else if (expr[i] === c) break;
      }
      chunks.push({ text: expr.slice(start, i), offset: baseOffset + start });
    } else if (c === '`') {
      let segStart = i + 1;
      i += 1;
      for (; i < expr.length; i += 1) {
        if (expr[i] === '\\') { i += 1; continue; }
        if (expr[i] === '`') {
          chunks.push({ text: expr.slice(segStart, i), offset: baseOffset + segStart });
          break;
        }
        if (expr[i] === '$' && expr[i + 1] === '{') {
          chunks.push({ text: expr.slice(segStart, i), offset: baseOffset + segStart });
          const end = findBraceEnd(expr, i + 1);
          if (end < 0) break;
          chunks.push(...extractStringChunks(expr.slice(i + 2, end), baseOffset + i + 2));
          i = end;
          segStart = end + 1;
        }
      }
    }
  }
  return chunks;
}

function tokenizeClassChunks(chunks) {
  const tokens = [];
  for (const chunk of chunks) {
    const re = /\S+/g;
    let m;
    while ((m = re.exec(chunk.text))) {
      tokens.push({ value: m[0], offset: chunk.offset + m.index });
    }
  }
  return tokens;
}

function extractClassBlocks(text) {
  const blocks = [];
  const re = /\b(?:class|className)\s*=\s*/g;
  let m;
  while ((m = re.exec(text))) {
    const pos = m.index + m[0].length;
    const ch = text[pos];
    if (ch === '"' || ch === "'") {
      let end = pos + 1;
      for (; end < text.length; end += 1) {
        if (text[end] === '\\') end += 1;
        else if (text[end] === ch) break;
      }
      if (end < text.length) {
        const content = text.slice(pos + 1, end);
        blocks.push({ tokens: tokenizeClassChunks([{ text: content, offset: pos + 1 }]), offset: pos + 1, end });
        re.lastIndex = end + 1;
      }
    } else if (ch === '{') {
      const end = findBraceEnd(text, pos);
      if (end > pos) {
        const expr = text.slice(pos + 1, end);
        blocks.push({ tokens: tokenizeClassChunks(extractStringChunks(expr, pos + 1)), offset: pos + 1, end });
        re.lastIndex = end + 1;
      }
    }
  }
  return blocks;
}

function extractInlineStyleBlocks(text) {
  const htmlStyles = [];
  const jsxStyles = [];
  const re = /\bstyle\s*=\s*/g;
  let m;
  while ((m = re.exec(text))) {
    const pos = m.index + m[0].length;
    const ch = text[pos];
    if (ch === '"' || ch === "'") {
      let end = pos + 1;
      for (; end < text.length; end += 1) {
        if (text[end] === '\\') end += 1;
        else if (text[end] === ch) break;
      }
      if (end < text.length) {
        htmlStyles.push({ body: text.slice(pos + 1, end), offset: pos + 1, attrStart: m.index });
        re.lastIndex = end + 1;
      }
    } else if (ch === '{' && text.slice(pos + 1).trimStart().startsWith('{')) {
      const outerEnd = findBraceEnd(text, pos);
      if (outerEnd > pos) {
        const innerOpen = text.indexOf('{', pos + 1);
        const innerEnd = findBraceEnd(text, innerOpen);
        if (innerEnd > innerOpen && innerEnd < outerEnd) {
          jsxStyles.push({ body: text.slice(innerOpen + 1, innerEnd), offset: innerOpen + 1, attrStart: m.index });
        }
        re.lastIndex = outerEnd + 1;
      }
    }
  }
  return { htmlStyles, jsxStyles };
}

function enclosingTagHasFocusClass(text, attrStart) {
  let open = attrStart;
  while (open > 0 && text[open] !== '<') open -= 1;
  if (text[open] !== '<') return false;
  const end = findTagEnd(text, open + 1);
  if (end < attrStart) return false;
  const tagText = text.slice(open, end + 1);
  return extractClassBlocks(tagText).some((block) => block.tokens.some((tok) => twFocusReplaceRe.test(tok.value)));
}

function jsxStyleDecls(body) {
  const out = [];
  const propMap = {
    outline: 'outline',
    outlinestyle: 'outline-style',
    outlinewidth: 'outline-width',
    boxshadow: 'box-shadow',
    border: 'border',
    bordercolor: 'border-color',
    borderstyle: 'border-style',
    borderwidth: 'border-width',
    textdecoration: 'text-decoration',
    textdecorationline: 'text-decoration-line',
    transition: 'transition',
    background: 'background',
    backgroundimage: 'background-image',
    backgroundclip: 'background-clip',
    webkitbackgroundclip: '-webkit-background-clip',
    color: 'color',
    webkittextfillcolor: '-webkit-text-fill-color',
  };
  const re = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(?:"([^"]*)"|'([^']*)'|(-?\d+(?:\.\d+)?))/g;
  let m;
  while ((m = re.exec(body))) {
    const mapped = propMap[m[1].toLowerCase()];
    if (!mapped) continue;
    const rawVal = m[2] ?? m[3] ?? m[4] ?? '';
    out.push({ prop: mapped, value: rawVal.trim().toLowerCase(), offset: m.index });
  }
  return out;
}

function scanPlaceholderLabels(text, add) {
  const labeledIds = new Set();
  const labelSpans = [];
  const labelStack = [];
  const inputs = [];
  const tagRe = /<(\/?)(label|input|textarea)(?=[\s/>])/gi;
  let m;
  while ((m = tagRe.exec(text))) {
    const isClose = m[1] === '/';
    const name = m[2].toLowerCase();
    const end = findTagEnd(text, m.index + m[0].length);
    if (end < 0) continue;
    const raw = text.slice(m.index, end + 1);
    if (name === 'label') {
      if (isClose) {
        const openStart = labelStack.pop();
        if (openStart !== undefined) labelSpans.push([openStart, end]);
      } else {
        const forMatch = /\b(?:for|htmlFor)\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*["']([^"']+)["']\s*\})/i.exec(raw);
        if (forMatch) labeledIds.add(forMatch[1] || forMatch[2] || forMatch[3]);
        if (!/\/\s*>$/.test(raw)) labelStack.push(m.index);
      }
    } else if (!isClose) {
      inputs.push({ start: m.index, end, raw });
    }
    tagRe.lastIndex = end + 1;
  }
  for (const tag of inputs) {
    if (!/\bplaceholder\s*=/i.test(tag.raw)) continue;
    if (/\btype\s*=\s*(?:["']hidden["']|\{\s*["']hidden["']\s*\})/i.test(tag.raw)) continue;
    if (/\baria-label(?:ledby)?\s*=/i.test(tag.raw)) continue;
    const idMatch = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*["']([^"']+)["']\s*\})/i.exec(tag.raw);
    const id = idMatch ? (idMatch[1] || idMatch[2] || idMatch[3]) : null;
    if (id && labeledIds.has(id)) continue;
    if (labelSpans.some(([s, e]) => tag.start > s && tag.end < e)) continue;
    add('placeholder-as-label', 'P1', 4, lineOf(text, tag.start), tag.raw.replace(/\s+/g, ' '),
      'Use a persistent programmatic label; placeholder is only a hint.');
  }
}

function hasGenericCopy(line) {
  if (/lorem ipsum/i.test(line)) return true;
  const re = /(?<![a-zA-Z0-9_$.-])(?:get started|seamless|unlock|revolutionize|elevate|supercharge|cutting-edge|next-gen|effortless|empower|streamline|all-in-one|reimagine|unleash|ai-powered|game-changing|built for modern teams|delve)(?![a-zA-Z0-9_-])/gi;
  let m;
  while ((m = re.exec(line))) {
    const before = line.slice(0, m.index);
    const after = line.slice(m.index + m[0].length);
    if (/\b(?:const|let|var|function|class|def|fn|func|import|export|from|type|interface|struct|enum)\s+$/.test(before)) continue;
    if (/^\s*=(?!=)|^\(/.test(after)) continue;
    return true;
  }
  return false;
}

function scanEmptyHandlers(masked, text, add) {
  const emptyFnRe = /\bon[A-Z][a-zA-Z0-9]*\s*=\s*\{\s*(?:(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*(?:\{\s*\}|undefined|null)|function\s*\([^)]*\)\s*\{\s*\})\s*\}/g;
  let m;
  while ((m = emptyFnRe.exec(masked))) {
    add('empty-event-handler', 'P1', 4, lineOf(text, m.index), m[0].replace(/\s+/g, ' '),
      'Implement real handler logic or disable/remove the stub control.');
  }
  const preventOnlyRe = /\bon[A-Z][a-zA-Z0-9]*\s*=\s*\{\s*(?:(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>|function\s*\([^)]*\))\s*\{\s*(?:return\s+)?[a-zA-Z_$][a-zA-Z0-9_$]*\.preventDefault\(\s*\)\s*;?\s*\}\s*\}/g;
  while ((m = preventOnlyRe.exec(masked))) {
    add('empty-event-handler', 'P1', 4, lineOf(text, m.index), m[0].replace(/\s+/g, ' '),
      'Complete the submit/event handler instead of calling only preventDefault().');
  }
  const anchorRe = /<a(?=[\s/>])/gi;
  while ((m = anchorRe.exec(masked))) {
    const end = findTagEnd(masked, m.index + m[0].length);
    if (end < 0) continue;
    const raw = masked.slice(m.index, end + 1);
    anchorRe.lastIndex = end + 1;
    if (!/\bhref\s*=\s*(?:["']\s*#\s*["']|\{\s*["']\s*#\s*["']\s*\})/i.test(raw)) continue;
    if (/\brole\s*=/i.test(raw)) continue;
    if (/\b(?:onClick|onclick|@click|v-on:click|on:click|x-on:click|hx-get|hx-post|hx-put|hx-delete|hx-patch|phx-click|wire:click)\s*=/i.test(raw)) continue;
    add('empty-event-handler', 'P1', 4, lineOf(text, m.index), raw.replace(/\s+/g, ' '),
      'Replace dead href="#" links with a real destination or a <button type="button"> handler.');
  }
}

function scanTodoStubs(lines, ext, add) {
  const slashOrHtmlTodoRe = /(?:(?:^|[^:])\/\/|\/\*|<!--)\s*(?:TODO|FIXME)\b/i;
  const slashOrHtmlEllipsisRe = /(?:(?:^|[^:])\/\/|\/\*|<!--)\s*\.\.\.\s*(?:rest\s+of|more\b|remaining|add\s+more|implement|placeholder|omitted|other\b|similar\b|etc\b)/i;
  const isHash = hashCommentExts.has(ext);
  const isDash = dashCommentExts.has(ext);
  const isSemi = semiCommentExts.has(ext);
  const hashTodoRe = /(?:^|\s)#\s*(?:TODO|FIXME)\b/i;
  const hashEllipsisRe = /(?:^|\s)#\s*\.\.\.\s*(?:rest\s+of|more\b|remaining|add\s+more|implement|placeholder|omitted|other\b|similar\b|etc\b)/i;
  const dashTodoRe = /--\s*(?:TODO|FIXME)\b/i;
  const dashEllipsisRe = /--\s*\.\.\.\s*(?:rest\s+of|more\b|remaining|add\s+more|implement|placeholder|omitted|other\b|similar\b|etc\b)/i;
  const semiTodoRe = /;\s*(?:TODO|FIXME)\b/i;
  const semiEllipsisRe = /;\s*\.\.\.\s*(?:rest\s+of|more\b|remaining|add\s+more|implement|placeholder|omitted|other\b|similar\b|etc\b)/i;

  lines.forEach((line, i) => {
    const matched = slashOrHtmlTodoRe.test(line)
      || slashOrHtmlEllipsisRe.test(line)
      || (isHash && (hashTodoRe.test(line) || hashEllipsisRe.test(line)))
      || (isDash && (dashTodoRe.test(line) || dashEllipsisRe.test(line)))
      || (isSemi && (semiTodoRe.test(line) || semiEllipsisRe.test(line)));
    if (matched) {
      add('todo-stub-in-ui', 'P1', 4, i + 1, line,
        'Finish the implementation or remove unfinished TODO/FIXME/ellipsis stub comments before shipping.');
    }
  });
}

function scanFile(file, root) {
  const text = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file);
  const masked = maskSourceComments(text, ext);
  const lines = text.split(/\r?\n/);
  const maskedLines = masked.split(/\r?\n/);
  const findings = [];
  const seenRules = new Set();
  const add = (rule, severity, weight, line, match, fix) => {
    const key = `${rule}:${line}`;
    if (seenRules.has(key)) return;
    seenRules.add(key);
    findings.push({ rule, severity, weight, file: path.relative(root, file), line, match: match.trim().slice(0, 160), fix });
  };

  // Pre-comment-mask anti-laziness check for unfinished TODO/FIXME/ellipsis stubs.
  scanTodoStubs(lines, ext, add);

  // Focus scan is heuristic; live keyboard testing remains authoritative.
  let cssMotionMatch = null;
  for (const segment of cssSegments(file, text)) {
    const maskedSegment = { text: maskCssComments(segment.text), offset: segment.offset };
    if (!cssMotionMatch) {
      const m = /@keyframes\b|(?<![a-zA-Z0-9_-])(?:animation(?:-name)?|transition(?:-property)?)\s*:\s*(?!none\b)/i.exec(maskedSegment.text);
      if (m) cssMotionMatch = { index: segment.offset + m.index, text: m[0].replace(/:\s*$/, '') };
    }
    scanRules(maskedSegment, segment.offset, maskedSegment.text, (selectorText, decls, location, contexts) => {
      const lastFirst = [...decls].reverse();
      const declaration = (property) => lastFirst.find((decl) => property.test(decl.prop));
      const clip = declaration(/^(?:-webkit-)?background-clip$/);
      const background = declaration(/^background(?:-image)?$/);
      const color = declaration(/^(?:color|-webkit-text-fill-color)$/);
      if (clip && cleanValue(clip.value) === 'text' && background && /gradient\(/i.test(background.value)
          && color && cleanValue(color.value) === 'transparent') {
        add('gradient-text-treatment','P3',1,lineOf(text,location.bodyIndex + clip.offset),selectorText,
          'Check that decorative gradient text fits the direction and remains legible.');
      }
      const rail = declaration(/^border-(?:left|right|inline-start|inline-end)$/);
      const radius = declaration(/^border-radius$/);
      const railTokens = rail ? splitValueTokens(cleanValue(rail.value)) : [];
      if (radius && /^\d*\.?\d+(?:px|em|rem|%)(?:\s|$)/.test(cleanValue(radius.value))
          && Number.parseFloat(radius.value) > 0 && rail && visibleBorder(rail.value)
          && railTokens.some((token) => /^\d+(?:\.\d+)?px$/.test(token) && Number.parseFloat(token) >= 4)
          && /\.(?:\w+-)?(?:card|tile|panel)\b/i.test(selectorText)) {
        add('rounded-accent-rail','P3',1,lineOf(text,location.bodyIndex + rail.offset),selectorText,
          'Check whether the thick edge communicates a status or is repeated decoration.');
      }
      const outline = analyzeOutline(decls);
      if (!outline.removal || visibleReplacement(decls, outline)) return;
      for (const context of contexts) {
        if (!context.relevant) continue;
        add('outline-removed','P0',5,lineOf(text,location.bodyIndex + outline.removal.offset),`${outline.removal.prop}: ${outline.removal.value}`,'Restore a visible keyboard focus indicator.');
      }
    });
  }

  let twMotionMatch = null;
  if (!cssExts.has(ext)) {
    for (const block of extractClassBlocks(masked)) {
      const removal = block.tokens.find((tok) => twOutlineRemoveRe.test(tok.value));
      if (removal && !block.tokens.some((tok) => twFocusReplaceRe.test(tok.value))) {
        add('outline-removed', 'P0', 5, lineOf(text, removal.offset), removal.value, 'Restore a visible keyboard focus indicator.');
      }
      for (const tok of block.tokens) {
        if (twTransitionAllRe.test(tok.value)) {
          add('transition-all', 'P2', 2, lineOf(text, tok.offset), tok.value, 'Animate only intentional properties with semantic durations/easing.');
        }
        if (!twMotionMatch && twAnimateUtilityRe.test(tok.value)) {
          twMotionMatch = { index: tok.offset, text: tok.value };
        }
      }
      const clipTok = block.tokens.find((tok) => /^(?:[a-z0-9-[\]()]+:)*bg-clip-text$/i.test(tok.value));
      const transparentTok = block.tokens.find((tok) => /^(?:[a-z0-9-[\]()]+:)*text-transparent$/i.test(tok.value));
      const gradTok = block.tokens.find((tok) => /^(?:[a-z0-9-[\]()]+:)*bg-(?:gradient|linear)-to-/i.test(tok.value));
      if (clipTok && transparentTok && gradTok) {
        add('gradient-text-treatment', 'P3', 1, lineOf(text, clipTok.offset), `${gradTok.value} ${clipTok.value} ${transparentTok.value}`,
          'Check that decorative gradient text fits the direction and remains legible.');
      }
    }

    const { htmlStyles, jsxStyles } = extractInlineStyleBlocks(masked);
    const inspectInlineDecls = (decls, baseOffset, attrStart) => {
      const lastFirst = [...decls].reverse();
      const declaration = (property) => lastFirst.find((decl) => property.test(decl.prop));
      const clip = declaration(/^(?:-webkit-)?background-clip$/);
      const background = declaration(/^background(?:-image)?$/);
      const color = declaration(/^(?:color|-webkit-text-fill-color)$/);
      if (clip && cleanValue(clip.value) === 'text' && background && /gradient\(/i.test(background.value)
          && color && cleanValue(color.value) === 'transparent') {
        add('gradient-text-treatment', 'P3', 1, lineOf(text, baseOffset + clip.offset), 'inline style gradient text',
          'Check that decorative gradient text fits the direction and remains legible.');
      }
      const trans = declaration(/^transition$/);
      if (trans && /^all\b/.test(cleanValue(trans.value))) {
        add('transition-all', 'P2', 2, lineOf(text, baseOffset + trans.offset), `transition: ${trans.value}`,
          'Animate only intentional properties with semantic durations/easing.');
      }
      const outline = analyzeOutline(decls);
      if (outline.removal && !visibleReplacement(decls, outline) && !enclosingTagHasFocusClass(masked, attrStart)) {
        add('outline-removed', 'P0', 5, lineOf(text, baseOffset + outline.removal.offset),
          `${outline.removal.prop}: ${outline.removal.value}`, 'Restore a visible keyboard focus indicator.');
      }
    };
    for (const styleBlock of htmlStyles) {
      inspectInlineDecls(declarations(styleBlock.body), styleBlock.offset, styleBlock.attrStart);
    }
    for (const styleBlock of jsxStyles) {
      inspectInlineDecls(jsxStyleDecls(styleBlock.body), styleBlock.offset, styleBlock.attrStart);
    }

    scanPlaceholderLabels(masked, add);
    scanEmptyHandlers(masked, text, add);
  }

  const hasThrottledRepaint = ext === '.rs' && /\brequest_repaint_after\b/.test(masked);

  lines.forEach((line, i) => {
    const n = i + 1;
    const maskedLine = maskedLines[i] ?? line;
    const fontMatch = /font-family\s*:\s*([^;}\n]+)/i.exec(maskedLine) || /fontFamily\s*:\s*['"]([^'"]+)['"]/.exec(maskedLine);
    if (fontMatch && isDefaultFontOnly(fontMatch[1])) add('default-font-only','P2',2,n,line,'Choose type by voice/platform and provide deliberate fallbacks.');
    if (/transition\s*:\s*['"]?all\b/.test(maskedLine)) add('transition-all','P2',2,n,line,'Animate only intentional properties with semantic durations/easing.');
    if (/(user-scalable\s*=\s*["']?no|maximum-scale\s*=\s*["']?1(?:\.0)?\b)/i.test(maskedLine)) add('zoom-disabled','P0',5,n,line,'Do not disable pinch zoom or text scaling.');
    if (/\btabindex\s*=\s*(?:["']\s*[1-9]\d*\s*["']|\{\s*[1-9]\d*\s*\})/i.test(maskedLine)) add('positive-tabindex','P1',3,n,line,'Use natural DOM order or tabindex="0" / "-1" instead of positive tabindex values.');
    if (/\p{Extended_Pictographic}/u.test(maskedLine) && /icon|button|nav|<span/i.test(maskedLine)) add('emoji-as-icon','P2',2,n,line,'Use a coherent icon system or text instead of structural emoji.');
    if (!cssExts.has(ext) && hasGenericCopy(maskedLine)) add('generic-copy','P2',2,n,line,'Replace template copy with concrete user/domain language.');
    if (/rounded-2xl/.test(maskedLine)) add('rounded-2xl-repetition','P3',1,n,line,'Use semantic radius variation rather than uniform rounded-2xl.');
    if (/shadow-(lg|xl|2xl)/.test(maskedLine)) add('uniform-shadow','P3',1,n,line,'Use elevation/shadow only where material semantics require it.');
    if (/\bdocument\.execCommand\s*\(/.test(maskedLine)) {
      add('lazy-diy-antipattern', 'P2', 2, n, line, 'Replace deprecated document.execCommand() with a maintained rich-text editor or explicit selection/clipboard API.');
    }
    if (ext === '.py' && /\b(?:import\s+tkinter\b|from\s+tkinter\s+import\b)/.test(maskedLine)) {
      add('lazy-diy-antipattern', 'P2', 2, n, line, 'Avoid defaulting to Tkinter for polished desktop UI; prefer PySide6/Qt, GTK4, or a modern native toolkit unless Tkinter is an explicit constraint.');
    }
    if (ext === '.kt' && /\bfontSize\s*=\s*\d+(?:\.\d+)?\.dp\b/.test(maskedLine)) {
      add('compose-dp-font-size', 'P1', 4, n, line, 'Use .sp instead of .dp for Compose fontSize so Android system font scaling applies.');
    }
    if (ext === '.dart' && /\b(?:TextScaler\.noScaling|textScaleFactor\s*:\s*1(?:\.0)?)\b/.test(maskedLine)) {
      add('flutter-text-scaling-locked', 'P0', 5, n, line, 'Do not lock Flutter text scaling; preserve MediaQuery textScaler for accessibility.');
    }
    if (ext === '.rs' && !hasThrottledRepaint && /\.request_repaint\s*\(\s*\)/.test(maskedLine)) {
      add('egui-unconditional-repaint', 'P2', 2, n, line, 'Use request_repaint_after(...) or event-driven updates instead of unconditional request_repaint() to avoid pegging CPU/GPU.');
    }
  });

  const rounded = (masked.match(/rounded-2xl/g) || []).length;
  if (rounded < 3) for (const f of findings.filter((f) => f.rule === 'rounded-2xl-repetition')) f.drop = true;
  const shadows = (masked.match(/shadow-(lg|xl|2xl)/g) || []).length;
  if (shadows < 3) for (const f of findings.filter((f) => f.rule === 'uniform-shadow')) f.drop = true;

  if (/gradient/i.test(masked) && /(purple|violet|indigo|blue|#[0-9a-f]{3,8})/i.test(masked) && /(purple|violet|indigo)/i.test(masked) && /(blue|cyan)/i.test(masked)) add('purple-blue-gradient','P2',2,lineOf(text,/gradient/i.exec(masked)?.index || 0),'gradient definition','Use a color posture derived from subject/material rather than the default AI gradient.');
  const paste = /paste[\s\S]{0,160}preventDefault|preventDefault[\s\S]{0,160}paste/i.exec(masked);
  if (paste) add('paste-blocked','P0',5,lineOf(text,paste.index),paste[0],'Never block paste; it harms password managers, accessibility, and recovery.');
  let motion = cssMotionMatch || twMotionMatch;
  if (!motion && !cssExts.has(ext)) {
    const inlineMotion = /@keyframes\b|(?<![a-zA-Z0-9_-])(?:animation(?:-name)?|transition(?:-property)?)\s*:\s*(?!none\b|['"]none['"]|string\b|boolean\b|number\b)/i.exec(masked);
    if (inlineMotion) motion = { index: inlineMotion.index, text: inlineMotion[0].replace(/:\s*$/, '') };
  }
  if (!motion && !cssExts.has(ext)) {
    const jsMotion = /\bgsap\.(?:to|from|fromTo)\s*\(|\bwhileInView\s*=|<motion\.[a-zA-Z0-9_]+/.exec(masked);
    if (jsMotion) motion = { index: jsMotion.index, text: jsMotion[0] };
  }
  if (!motion && ext === '.swift') {
    const swiftMotion = /\.animation\s*\(|\bwithAnimation\b/.exec(masked);
    if (swiftMotion) motion = { index: swiftMotion.index, text: swiftMotion[0] };
  }
  if (!motion && ext === '.kt') {
    const ktMotion = /\banimate(?:Float|Color|Dp)AsState\s*\(/.exec(masked);
    if (ktMotion) motion = { index: ktMotion.index, text: ktMotion[0] };
  }
  if (!motion && ext === '.dart') {
    const dartMotion = /\bAnimationController\s*\(/.exec(masked);
    if (dartMotion) motion = { index: dartMotion.index, text: dartMotion[0] };
  }
  if (motion && !/prefers-reduced-motion|reduceMotion|accessibilityReduceMotion|motion-reduce:|useReducedMotion|disableAnimations|ANIMATOR_DURATION_SCALE/i.test(masked)) {
    add('missing-reduced-motion','P1',4,lineOf(text,motion.index),motion.text,'Provide a reduced-motion path when animation or transitions exist.');
  }
  const colorLiterals = [
    ...masked.matchAll(/#[0-9a-fA-F]{3,8}\b|\bColor\(\s*0x[0-9a-fA-F]{6,8}\s*\)|\bColor32::from_rgb(?:a_(?:unmultiplied|premultiplied))?\s*\(|\bColor\.FromA?Rgb\s*\(/g),
  ];
  const tokenRefs = (
    masked.match(/var\(|token|theme\.|Theme\.of\b|MaterialTheme\.colorScheme|Color\(\s*["']|Color\.accentColor\b|semantic/gi) || []
  ).length;
  if (colorLiterals.length >= 6 && colorLiterals.length > tokenRefs * 2) {
    add('hardcoded-color-literals', 'P2', 2, lineOf(text, colorLiterals[0].index), `${colorLiterals.length} hardcoded color literals`, 'Move recurring colors into semantic tokens and verify contrast roles.');
  }
  const heroIndex = masked.search(/hero|text-center|items-center|justify-center|mx-auto/i);
  const ctaCount = (masked.match(/<button|<a\b|get started|learn more/gi) || []).length;
  if (heroIndex >= 0 && ctaCount >= 2 && /(hero|text-center)/i.test(masked)) add('centered-hero-two-ctas','P3',1,lineOf(text,heroIndex),'centered hero with repeated calls to action','Question the centered hero/two-CTA template; choose composition from the user decision.');
  return findings.filter((f) => !f.drop);
}

function applyWaivers(findings, file) {
  const items = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(items)) throw new Error('waivers must be an array of {rule, file, line, reason}');
  const byFinding = new Map();
  for (const item of items) {
    if (!item || !brandRules.has(item.rule) || typeof item.file !== 'string' || !item.file.trim()
        || !Number.isInteger(item.line) || item.line < 1 || typeof item.reason !== 'string' || !item.reason.trim()) {
      throw new Error('waivers require an advisory brand rule, exact file and line, and a nonempty reason');
    }
    const key = JSON.stringify([item.rule, item.file.replace(/\\/g, '/'), item.line]);
    if (byFinding.has(key)) throw new Error(`duplicate waiver: ${key}`);
    byFinding.set(key, item);
  }
  const waived = [];
  const active = findings.filter((finding) => {
    const key = JSON.stringify([finding.rule, finding.file.replace(/\\/g, '/'), finding.line]);
    const item = byFinding.get(key);
    if (!item) return true;
    waived.push({ ...finding, label: 'waived', reason: item.reason.trim() });
    byFinding.delete(key);
    return false;
  });
  return { active, waived, unusedWaivers: Array.from(byFinding.values()) };
}

const severityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
const failOnThreshold = { p0: 0, p1: 1, p2: 2, any: 3 };

try {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) { console.log(help()); process.exit(0); }
  const json = args.includes('--json');
  let dir, waivers, failOn;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json') continue;
    if (argument === '--waivers' && !waivers && args[index + 1] && !args[index + 1].startsWith('-')) waivers = args[++index];
    else if (argument === '--fail-on' && !failOn && args[index + 1] && !args[index + 1].startsWith('-')) failOn = args[++index].toLowerCase();
    else if (argument.startsWith('--fail-on=') && !failOn) failOn = argument.slice('--fail-on='.length).toLowerCase();
    else if (!dir && !argument.startsWith('-')) dir = argument;
    else throw new Error(`unexpected argument: ${argument}`);
  }
  if (failOn !== undefined && !Object.hasOwn(failOnThreshold, failOn)) {
    throw new Error(`invalid --fail-on value '${failOn}'; expected one of p0, p1, p2, any`);
  }
  if (!dir || !fs.existsSync(dir)) throw new Error('provide an existing file or directory to scan');
  const input = path.resolve(dir);
  const stat = fs.statSync(input);
  const root = stat.isDirectory() ? input : path.dirname(input);
  const files = stat.isDirectory() ? walk(input) : [input];
  const detected = files.flatMap((file) => scanFile(file, root));
  const { active: findings, ...waiverReport } = waivers ? applyWaivers(detected, waivers) : { active: detected };
  const score = findings.reduce((sum, f) => sum + f.weight, 0);
  const output = { score, disclaimer, findings, ...waiverReport };
  if (json) console.log(JSON.stringify(output, null, 2));
  else {
    console.log(`slop-scan score: ${score}`);
    for (const f of findings) console.log(`${f.severity} ${f.file}:${f.line} ${f.rule} (+${f.weight}) — ${f.match}\n  fix: ${f.fix}`);
    for (const f of waiverReport.waived ?? []) console.log(`waived ${f.file}:${f.line} ${f.rule} — ${f.reason}`);
    for (const f of waiverReport.unusedWaivers ?? []) console.log(`unused waiver ${f.file}:${f.line} ${f.rule}`);
    console.log(`disclaimer: ${disclaimer}`);
  }
  if (failOn !== undefined) {
    const threshold = failOnThreshold[failOn];
    if (findings.some((f) => (severityRank[f.severity] ?? 3) <= threshold)) {
      process.exitCode = 1;
    }
  }
} catch (error) {
  console.error(`slop-scan: ${error.message}`);
  process.exit(1);
}
