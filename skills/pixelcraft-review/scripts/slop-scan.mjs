#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const exts = new Set(['.css','.scss','.html','.jsx','.tsx','.vue','.svelte','.dart','.swift','.kt','.py','.qss','.tcss','.js','.ts']);
const cssExts = new Set(['.css','.scss','.qss','.tcss']);
const markupExts = new Set(['.html','.vue','.svelte']);
const skip = new Set(['node_modules','.git','dist','build','coverage']);
const skillHosts = new Set(['.claude','.agents','.cursor','.gemini','.github','.copilot']);
const disclaimer = 'A zero score means only that these known fingerprints were not detected; zero findings is not evidence of good design.';

function help() {
  return `Usage: node slop-scan.mjs <directory> [--json]\n\nScan source files for recurring AI-slop fingerprints. Output includes file:line,\nseverity, score contribution, and a suggested fix. ${disclaimer}`;
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
const cssColorKeywords = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent currentcolor').split(' '));

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
  return token.startsWith('#') || cssColorKeywords.has(token) || /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/.test(token);
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
    } else if (decl.prop === 'outline-width') {
      width = value;
      widthUnknown = hasUnresolvedTokens(value);
    }
  }
  return { removal, visible: styleUnknown || widthUnknown || (visibleOutlineStyles.has(style) && isVisibleWidth(width)) };
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
    if (prop === 'box-shadow') return clean !== 'none';
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

function scanFile(file, root) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const findings = [];
  const seenRules = new Set();
  const add = (rule, severity, weight, line, match, fix) => {
    const key = `${rule}:${line}`;
    if (seenRules.has(key)) return;
    seenRules.add(key);
    findings.push({ rule, severity, weight, file: path.relative(root, file), line, match: match.trim().slice(0, 160), fix });
  };

  // Focus scan is heuristic; live keyboard testing remains authoritative.
  for (const segment of cssSegments(file, text)) {
    const maskedSegment = { text: maskCssComments(segment.text), offset: segment.offset };
    scanRules(maskedSegment, segment.offset, maskedSegment.text, (selectorText, decls, location, contexts) => {
      const outline = analyzeOutline(decls);
      if (!outline.removal || visibleReplacement(decls, outline)) return;
      for (const context of contexts) {
        if (!context.relevant) continue;
        add('outline-removed','P0',5,lineOf(text,location.bodyIndex + outline.removal.offset),`outline: ${outline.removal.value}`,'Restore a visible keyboard focus indicator.');
      }
    });
  }

  lines.forEach((line, i) => {
    const n = i + 1;
    if (/font-family\s*:\s*['"]?(Inter|Roboto|Geist|Arial)['"]?\s*;?/i.test(line)) add('default-font-only','P2',2,n,line,'Choose type by voice/platform and provide deliberate fallbacks.');
    if (/transition\s*:\s*all\b/.test(line)) add('transition-all','P2',2,n,line,'Animate only intentional properties with semantic durations/easing.');
    if (/<(input|textarea)\b[^>]*placeholder=/i.test(line) && !/aria-label|aria-labelledby/i.test(line)) add('placeholder-as-label','P1',4,n,line,'Use a persistent programmatic label; placeholder is only a hint.');
    if (/(user-scalable\s*=\s*["']?no|maximum-scale\s*=\s*["']?1(?:\.0)?\b)/i.test(line)) add('zoom-disabled','P0',5,n,line,'Do not disable pinch zoom or text scaling.');
    if (/\p{Extended_Pictographic}/u.test(line) && /icon|button|nav|<span/i.test(line)) add('emoji-as-icon','P2',2,n,line,'Use a coherent icon system or text instead of structural emoji.');
    if (/\b(get started|seamless|unlock|revolutionize|elevate)\b/i.test(line) || /lorem ipsum/i.test(line)) add('generic-copy','P2',2,n,line,'Replace template copy with concrete user/domain language.');
    if (/rounded-2xl/.test(line)) add('rounded-2xl-repetition','P3',1,n,line,'Use semantic radius variation rather than uniform rounded-2xl.', true);
    if (/shadow-(lg|xl|2xl)/.test(line)) add('uniform-shadow','P3',1,n,line,'Use elevation/shadow only where material semantics require it.', true);
  });

  const rounded = (text.match(/rounded-2xl/g) || []).length;
  if (rounded < 3) for (const f of findings.filter((f) => f.rule === 'rounded-2xl-repetition')) f.drop = true;
  const shadows = (text.match(/shadow-(lg|xl|2xl)/g) || []).length;
  if (shadows < 3) for (const f of findings.filter((f) => f.rule === 'uniform-shadow')) f.drop = true;

  if (/gradient/i.test(text) && /(purple|violet|indigo|blue|#[0-9a-f]{3,8})/i.test(text) && /(purple|violet|indigo)/i.test(text) && /(blue|cyan)/i.test(text)) add('purple-blue-gradient','P2',2,lineOf(text,/gradient/i.exec(text)?.index || 0),'gradient definition','Use a color posture derived from subject/material rather than the default AI gradient.');
  const paste = /paste[\s\S]{0,160}preventDefault|preventDefault[\s\S]{0,160}paste/i.exec(text);
  if (paste) add('paste-blocked','P0',5,lineOf(text,paste.index),paste[0],'Never block paste; it harms password managers, accessibility, and recovery.');
  const motion = /@keyframes|\banimation\b|\btransition\b/.exec(text);
  if (motion && !/prefers-reduced-motion|reduceMotion|accessibilityReduceMotion/i.test(text)) add('missing-reduced-motion','P1',4,lineOf(text,motion.index),motion[0],'Provide a reduced-motion path when animation or transitions exist.');
  const hexes = [...text.matchAll(/#[0-9a-fA-F]{3,8}\b/g)];
  const tokenRefs = (text.match(/var\(|token|theme\.|Color\.|semantic/gi) || []).length;
  if (hexes.length >= 6 && hexes.length > tokenRefs * 2) add('hardcoded-color-literals','P2',2,lineOf(text,hexes[0].index),`${hexes.length} hardcoded color literals`,'Move recurring colors into semantic tokens and verify contrast roles.');
  const heroIndex = text.search(/hero|text-center|items-center|justify-center|mx-auto/i);
  const ctaCount = (text.match(/<button|<a\b|get started|learn more/gi) || []).length;
  if (heroIndex >= 0 && ctaCount >= 2 && /(hero|text-center)/i.test(text)) add('centered-hero-two-ctas','P3',1,lineOf(text,heroIndex),'centered hero with repeated calls to action','Question the centered hero/two-CTA template; choose composition from the user decision.');
  return findings.filter((f) => !f.drop);
}

try {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) { console.log(help()); process.exit(0); }
  const json = args.includes('--json');
  const dir = args.find((a) => !a.startsWith('-'));
  if (!dir || !fs.existsSync(dir)) throw new Error('provide an existing file or directory to scan');
  const input = path.resolve(dir);
  const stat = fs.statSync(input);
  const root = stat.isDirectory() ? input : path.dirname(input);
  const files = stat.isDirectory() ? walk(input) : [input];
  const findings = files.flatMap((file) => scanFile(file, root));
  const score = findings.reduce((sum, f) => sum + f.weight, 0);
  const output = { score, disclaimer, findings };
  if (json) console.log(JSON.stringify(output, null, 2));
  else {
    console.log(`slop-scan score: ${score}`);
    for (const f of findings) console.log(`${f.severity} ${f.file}:${f.line} ${f.rule} (+${f.weight}) — ${f.match}\n  fix: ${f.fix}`);
    console.log(`disclaimer: ${disclaimer}`);
  }
} catch (error) {
  console.error(`slop-scan: ${error.message}`);
  process.exit(1);
}
