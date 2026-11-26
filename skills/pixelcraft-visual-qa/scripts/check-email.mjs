#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const GMAIL_CLIP_BYTES = 102 * 1024;

function help() {
  return `Usage: node check-email.mjs <email.html> [--plaintext FILE] [--headers FILE] [--json]

Static cross-client HTML email verification script. Checks Gmail 102 KB clip limit,
Outlook Word-engine unsafe CSS (flex, grid, position: fixed, CSS custom properties),
<img> missing alt, image-only links/CTAs with empty alt="", under-padded preheader spacers,
layout <table> missing role="presentation", missing <title> / lang, optional plaintext
companion parity, and optional RFC 8058 One-Click List-Unsubscribe headers.

Options:
  --plaintext FILE   Verify companion plaintext email exists, is non-empty, and has parity
  --headers FILE     Verify promotional bulk headers (List-Unsubscribe + RFC 8058 One-Click POST)
  --json             Print machine-readable JSON output
  --help             Show this help`;
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function stripNonMsoComments(html) {
  return html.replace(/<!--(?!\s*\[if\b)[\s\S]*?-->/gi, (m) => m.replace(/[^\r\n]/g, ' '));
}

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\r\n]/g, ' '));
}

const ENTITY_MAP = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
};

function visibleText(html) {
  const lower = html.toLowerCase();
  let out = '';
  let i = 0;
  let skipRawTag = '';

  while (i < html.length) {
    if (skipRawTag) {
      const closeNeedle = `</${skipRawTag}`;
      const closeIdx = lower.indexOf(closeNeedle, i);
      if (closeIdx === -1) break;
      const closeEnd = html.indexOf('>', closeIdx + closeNeedle.length);
      if (closeEnd === -1) break;
      i = closeEnd + 1;
      skipRawTag = '';
      out += ' ';
      continue;
    }

    if (html.startsWith('<!--', i)) {
      const endComment = html.indexOf('-->', i + 4);
      i = endComment === -1 ? html.length : endComment + 3;
      out += ' ';
      continue;
    }

    if (html[i] === '<') {
      const tagEnd = html.indexOf('>', i + 1);
      if (tagEnd === -1) break;
      const tagBody = lower.slice(i + 1, tagEnd).trim();
      if (/^style(?:\s|\/|$)/.test(tagBody) && !tagBody.endsWith('/')) {
        skipRawTag = 'style';
      } else if (/^script(?:\s|\/|$)/.test(tagBody) && !tagBody.endsWith('/')) {
        skipRawTag = 'script';
      }
      i = tagEnd + 1;
      out += ' ';
      continue;
    }

    out += html[i];
    i += 1;
  }

  return out
    .replace(/&(nbsp|amp|lt|gt|quot|#39);/gi, (_, key) => ENTITY_MAP[key.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCli(args) {
  const out = { help: false, json: false, plaintext: '', headers: '', input: '' };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--json') out.json = true;
    else if (arg === '--plaintext') {
      if (!args[i + 1]) throw new Error('--plaintext requires a file path');
      out.plaintext = args[++i];
    } else if (arg.startsWith('--plaintext=')) out.plaintext = arg.slice('--plaintext='.length);
    else if (arg === '--headers') {
      if (!args[i + 1]) throw new Error('--headers requires a file path');
      out.headers = args[++i];
    } else if (arg.startsWith('--headers=')) out.headers = arg.slice('--headers='.length);
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else if (!out.input) out.input = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return out;
}

function inspectHeaders(rawHeaders) {
  const issues = [];
  const trimmed = (rawHeaders || '').trim();
  let listUnsub = '';
  let listUnsubPost = '';
  if (trimmed.startsWith('{')) {
    const obj = JSON.parse(trimmed);
    for (const [k, v] of Object.entries(obj)) {
      const lower = k.toLowerCase();
      if (lower === 'list-unsubscribe') listUnsub = String(v || '');
      else if (lower === 'list-unsubscribe-post') listUnsubPost = String(v || '');
    }
  } else {
    const unfolded = trimmed.replace(/\r?\n[ \t]+/g, ' ');
    for (const line of unfolded.split(/\r?\n/)) {
      const m = /^([A-Za-z0-9-]+)\s*:\s*(.*)$/.exec(line);
      if (!m) continue;
      const lower = m[1].toLowerCase();
      if (lower === 'list-unsubscribe') listUnsub = m[2].trim();
      else if (lower === 'list-unsubscribe-post') listUnsubPost = m[2].trim();
    }
  }
  if (!/https:\/\/[^\s>]+/i.test(listUnsub)) {
    issues.push({
      rule: 'missing-list-unsubscribe',
      severity: 'P1',
      line: 1,
      message: 'Bulk/promotional headers lack a List-Unsubscribe header containing an https:// endpoint.',
      fix: 'Add List-Unsubscribe: <https://example.com/unsubscribe?...> alongside optional mailto: fallback.',
    });
  }
  if (!/\bList-Unsubscribe\s*=\s*One-Click\b/i.test(listUnsubPost)) {
    issues.push({
      rule: 'missing-one-click-unsubscribe',
      severity: 'P1',
      line: 1,
      message: 'Missing RFC 8058 List-Unsubscribe-Post: List-Unsubscribe=One-Click header required by Gmail, Yahoo, and Outlook.com bulk sender rules.',
      fix: 'Emit List-Unsubscribe-Post: List-Unsubscribe=One-Click and process unsubscribes within 48 hours without login walls.',
    });
  }
  return issues;
}

function inspectEmail(html, plaintextContent, plaintextProvided, headersContent = '', headersProvided = false) {
  const findings = [];
  const add = (rule, severity, line, message, fix) => {
    findings.push({ rule, severity, line, message, fix });
  };

  const byteSize = Buffer.byteLength(html, 'utf8');
  if (byteSize > GMAIL_CLIP_BYTES) {
    add('gmail-clip-risk', 'P1', 1,
      `HTML byte size is ${byteSize} bytes (${(byteSize / 1024).toFixed(1)} KB), exceeding Gmail's 102 KB (${GMAIL_CLIP_BYTES} bytes) clipping threshold.`,
      'Trim verbose inline markup, remove unused CSS rules, and shorten repeated attributes to stay under 102 KB.');
  }

  const cleaned = stripNonMsoComments(html);

  if (!/<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(cleaned)) {
    add('missing-lang', 'P1', 1, 'Missing lang attribute on <html> element.',
      'Add lang="en" (or the message language code) to the root <html> element for screen readers.');
  }
  if (!/<title\b[^>]*>[\s\S]*?\S[\s\S]*?<\/title\s*>/i.test(cleaned)) {
    add('missing-title', 'P2', 1, 'Missing non-empty <title> element.',
      'Include a concise <title> matching the email subject for accessibility and browser-view tabs.');
  }

  // Outlook-unsafe CSS in <style> blocks and inline style attributes
  const unsafeCssRules = [
    { pattern: /\bdisplay\s*:\s*(?:inline-)?flex\b/gi, name: 'display: flex' },
    { pattern: /\bdisplay\s*:\s*(?:inline-)?grid\b/gi, name: 'display: grid' },
    { pattern: /\bposition\s*:\s*fixed\b/gi, name: 'position: fixed' },
    { pattern: /\bvar\(\s*--[a-zA-Z0-9_-]+/g, name: 'CSS custom property var(--...)' },
  ];

  const cssChunks = [];
  const styleTagRe = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
  let m;
  while ((m = styleTagRe.exec(cleaned))) {
    const bodyStart = m.index + m[0].indexOf('>') + 1;
    const styleBytes = Buffer.byteLength(m[1], 'utf8');
    if (styleBytes > 16 * 1024) {
      add('style-block-too-large', 'P1', lineOf(html, m.index),
        `<style> block is ${styleBytes} bytes (${(styleBytes / 1024).toFixed(1)} KB), exceeding the 16 KB safe ceiling before Gmail strips the entire stylesheet.`,
        'Inline core layout/typography styles and keep embedded <style> media-query overrides compact (<= 8-16 KB).');
    }
    const strippedStyle = stripCssComments(m[1]);
    const modernMatch = /@(?:layer|property)\b/i.exec(strippedStyle);
    if (modernMatch) {
      add('gmail-unsafe-modern-css', 'P1', lineOf(html, bodyStart + modernMatch.index),
        `Unsupported modern at-rule '${modernMatch[0]}' inside <style>; Gmail's CSS parser drops the entire <style> block on unsupported syntax.`,
        'Compile away @layer, @property, and CSS nesting into flat CSS2/media-query rules before sending.');
    }
    cssChunks.push({ text: strippedStyle, offset: bodyStart });
  }
  const inlineStyleRe = /\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((m = inlineStyleRe.exec(cleaned))) {
    const val = m[1] ?? m[2] ?? '';
    const offset = m.index + m[0].indexOf(val);
    cssChunks.push({ text: stripCssComments(val), offset });
  }

  const seenCss = new Set();
  for (const chunk of cssChunks) {
    for (const rule of unsafeCssRules) {
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(chunk.text))) {
        const line = lineOf(html, chunk.offset + match.index);
        const key = `${rule.name}:${line}`;
        if (seenCss.has(key)) continue;
        seenCss.add(key);
        add('outlook-unsafe-css', 'P1', line,
          `Outlook-unsafe CSS detected: ${rule.name} (${match[0].trim()}).`,
          'Use table-based layout and resolved hex colors instead of flex/grid/fixed/var(--) for Outlook Word engine compatibility.');
      }
    }
  }

  // Unreplaced personalization merge tags in visible body (e.g. {{name}}, <%= user %>)
  const visible = visibleText(html);
  const mergeMatch = /\{\{\s*[a-zA-Z_][a-zA-Z0-9_.-]*\s*\}\}|<%=\s*[^%]+\s*%>/.exec(visible);
  if (mergeMatch) {
    const rawIdx = cleaned.indexOf(mergeMatch[0]);
    add('unfilled-merge-tag', 'P1', rawIdx >= 0 ? lineOf(html, rawIdx) : 1,
      `Unresolved personalization placeholder '${mergeMatch[0]}' detected in rendered email copy.`,
      'Render merge tags with safe fallback defaults (e.g. "Hello there" when first_name is missing) before inspecting final output.');
  }

  // <img> missing alt
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(cleaned))) {
    if (!/\balt\s*=/i.test(m[0])) {
      add('img-missing-alt', 'P0', lineOf(html, m.index),
        `<img> missing alt attribute: ${m[0].slice(0, 100)}`,
        'Add meaningful alt text or alt="" for purely decorative images so blocked-image clients degrade cleanly.');
    }
  }

  // Image-only <a> link/CTA with empty alt="" and no accessible label
  const anchorRe = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  while ((m = anchorRe.exec(cleaned))) {
    const aAttrs = m[1] || '';
    const aInner = m[2] || '';
    if (/\baria-label(?:ledby)?\s*=\s*["'][^"']+["']/i.test(aAttrs)) continue;
    if (!/<img\b/i.test(aInner)) continue;
    const textOnly = visibleText(aInner);
    if (textOnly.length > 0) continue;
    const imgs = [...aInner.matchAll(/<img\b[^>]*>/gi)].map((x) => x[0]);
    const hasNonEmptyAlt = imgs.some((tag) => {
      const altMatch = /\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
      return Boolean(altMatch && (altMatch[1] ?? altMatch[2] ?? '').trim());
    });
    const allHaveAltAttr = imgs.every((tag) => /\balt\s*=/i.test(tag));
    if (allHaveAltAttr && !hasNonEmptyAlt) {
      add('image-only-link-empty-alt', 'P0', lineOf(html, m.index),
        'Image-only <a> link/CTA uses empty alt="" with no text or aria-label, leaving blocked-image clients and screen readers with an unlabeled link.',
        'Replace image-only buttons with a bulletproof HTML/VML text CTA, or provide descriptive alt text on the linked <img>.');
    }
  }

  // Under-padded hidden preheader spacer (e.g., 3-5 repeats instead of 50+ repeats)
  const spacerTokens = cleaned.match(/(?:&#847;|&#x0*34f;|&zwnj;|&#8204;|\u034f|\u200c)/gi) || [];
  if (spacerTokens.length > 0 && spacerTokens.length < 20) {
    const firstSpacerIdx = cleaned.search(/(?:&#847;|&#x0*34f;|&zwnj;|&#8204;|\u034f|\u200c)/i);
    add('short-preheader-spacer', 'P2', lineOf(html, Math.max(0, firstSpacerIdx)),
      `Hidden preheader spacer contains only ${spacerTokens.length} zero-width token(s); inbox previews (~120-140 chars) may still leak body chrome like "View in browser".`,
      'Repeat the &#847;&zwnj;&nbsp; spacer sequence at least 50-90 times after preheader copy.');
  }

  // Layout <table> missing role="presentation" (exclude semantic data tables containing <th> or <caption>)
  const tableRe = /<table\b([^>]*)>/gi;
  while ((m = tableRe.exec(cleaned))) {
    const attrs = m[1] || '';
    if (/\brole\s*=\s*["']\s*(?:presentation|none)\s*["']/i.test(attrs)) continue;
    const closeIdx = cleaned.indexOf('</table>', m.index);
    const slice = closeIdx > m.index ? cleaned.slice(m.index, closeIdx) : cleaned.slice(m.index, m.index + 500);
    if (/<th\b|<caption\b|\baria-label(?:ledby)?\s*=/i.test(slice)) continue;
    add('layout-table-missing-role', 'P1', lineOf(html, m.index),
      'Layout <table> is missing role="presentation" (or role="none").',
      'Add role="presentation" to layout tables so screen readers do not announce grid coordinates.');
  }

  // Optional plaintext companion check
  let plaintextStatus = 'not-checked';
  if (plaintextProvided) {
    const trimmed = (plaintextContent || '').trim();
    if (!trimmed) {
      plaintextStatus = 'fail';
      add('plaintext-empty', 'P0', 1, 'Plaintext companion file is empty.',
        'Provide a complete multipart/alternative text/plain version with key copy and URLs.');
    } else {
      const htmlText = visibleText(html);
      const htmlUrls = [...new Set((cleaned.match(/https?:\/\/[^\s"'<>]+/gi) || []))];
      const textHasUrl = /https?:\/\/\S+/i.test(trimmed);
      if (htmlText.length >= 40 && trimmed.length < Math.min(20, htmlText.length * 0.15)) {
        plaintextStatus = 'fail';
        add('plaintext-parity-gap', 'P1', 1,
          `Plaintext companion (${trimmed.length} chars) is disproportionately sparse compared to HTML body (${htmlText.length} chars).`,
          'Ensure the plaintext alternative carries the full message, key details, and actionable links.');
      } else if (htmlUrls.length > 0 && !textHasUrl) {
        plaintextStatus = 'fail';
        add('plaintext-parity-gap', 'P1', 1,
          `HTML contains ${htmlUrls.length} URL(s) but plaintext companion contains no URLs.`,
          'Include explicit destination URLs in the plaintext alternative.');
      } else {
        plaintextStatus = 'pass';
      }
    }
  }

  // Optional RFC 8058 One-Click List-Unsubscribe header check
  let headersStatus = 'not-checked';
  if (headersProvided) {
    const headerIssues = inspectHeaders(headersContent);
    for (const issue of headerIssues) {
      add(issue.rule, issue.severity, issue.line, issue.message, issue.fix);
    }
    headersStatus = headerIssues.length === 0 ? 'pass' : 'fail';
  }

  return {
    byteSize,
    limitBytes: GMAIL_CLIP_BYTES,
    withinGmailLimit: byteSize <= GMAIL_CLIP_BYTES,
    plaintextStatus,
    headersStatus,
    findings,
  };
}

function main() {
  const cli = parseCli(process.argv.slice(2));
  if (cli.help) {
    console.log(help());
    return;
  }
  if (!cli.input) throw new Error('provide an HTML email file; see --help');
  const htmlPath = path.resolve(cli.input);
  if (!fs.existsSync(htmlPath)) throw new Error(`email file not found: ${cli.input}`);
  const html = fs.readFileSync(htmlPath, 'utf8');

  let plaintextContent = '';
  if (cli.plaintext) {
    const ptPath = path.resolve(cli.plaintext);
    if (!fs.existsSync(ptPath)) throw new Error(`plaintext file not found: ${cli.plaintext}`);
    plaintextContent = fs.readFileSync(ptPath, 'utf8');
  }

  let headersContent = '';
  if (cli.headers) {
    const hdrPath = path.resolve(cli.headers);
    if (!fs.existsSync(hdrPath)) throw new Error(`headers file not found: ${cli.headers}`);
    headersContent = fs.readFileSync(hdrPath, 'utf8');
  }

  const result = inspectEmail(html, plaintextContent, Boolean(cli.plaintext), headersContent, Boolean(cli.headers));
  const report = {
    file: cli.input,
    label: 'static',
    note: 'Static HTML/CSS email analysis; actual rendering across Gmail, Outlook, and Apple Mail dark mode still requires rendered client testing.',
    ...result,
    pass: result.findings.length === 0,
  };

  if (cli.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`check-email [${report.label}]: ${report.pass ? 'PASS' : 'FAIL'} (${report.byteSize}/${report.limitBytes} bytes, plaintext: ${report.plaintextStatus}, headers: ${report.headersStatus})`);
    for (const f of report.findings) {
      console.log(`  ${f.severity} line ${f.line} ${f.rule} — ${f.message}\n    fix: ${f.fix}`);
    }
    console.log(`note: ${report.note}`);
  }
  if (!report.pass) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`check-email: ${error.message}`);
  process.exit(1);
}
