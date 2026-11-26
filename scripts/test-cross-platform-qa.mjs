#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-cross-platform-qa.mjs\n\nTests check-contrast.mjs, check-email.mjs, check-tui.mjs, and check-pdf.mjs.');
  process.exit(0);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaScripts = path.join(root, 'skills/pixelcraft-visual-qa/scripts');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-cross-qa-'));

function runScript(name, args) {
  return spawnSync(process.execPath, [path.join(qaScripts, name), ...args], { encoding: 'utf8' });
}

try {
  // 1. --help contract on all 4 scripts
  for (const script of ['check-contrast.mjs', 'check-email.mjs', 'check-tui.mjs', 'check-pdf.mjs']) {
    const res = runScript(script, ['--help']);
    assert.equal(res.status, 0, `${script} --help failed: ${res.stderr}`);
    assert.match(res.stdout, /Usage:/i, `${script} --help missing Usage text`);
  }
  console.log('ok 1 - all 4 cross-platform QA scripts implement --help');

  // 2. check-contrast.mjs: auto-detect on bundled tokens.example.json & modes, passing/failing pairs, hex/rgb/oklch, APCA Lc
  const exampleTokens = path.join(root, 'skills/pixelcraft-tokens/assets/tokens.example.json');
  const exRes = runScript('check-contrast.mjs', [exampleTokens, '--json']);
  assert.equal(exRes.status, 0, exRes.stderr || exRes.stdout);
  const exJson = JSON.parse(exRes.stdout);
  assert.equal(exJson.label, 'static');
  assert.equal(exJson.pass, true);
  assert.ok(exJson.totalPairs >= 2, 'should auto-detect semantic foreground/action pairs');

  const modesTokens = path.join(root, 'skills/pixelcraft-tokens/assets/tokens.modes.example.json');
  const darkRes = runScript('check-contrast.mjs', [modesTokens, '--mode', 'dark', '--json']);
  assert.equal(darkRes.status, 0, darkRes.stderr || darkRes.stdout);
  const darkJson = JSON.parse(darkRes.stdout);
  assert.equal(darkJson.mode, 'dark');
  assert.equal(darkJson.pass, true);
  assert.ok(darkJson.results.some((r) => r.apcaLc < -70), 'dark mode light-on-dark should produce negative APCA Lc');

  const customTokens = path.join(tmp, 'contrast-tokens.json');
  fs.writeFileSync(customTokens, JSON.stringify({
    color: {
      $type: 'color',
      bg: { $value: '#ffffff' },
      ink: { $value: 'rgb(0, 0, 0)' },
      oklchGood: { $value: 'oklch(0.35 0.12 250)' },
      lowContrast: { $value: '#aaaaaa' },
      uiBorder: { $value: '#767676' },
    },
  }, null, 2));
  const customPairs = path.join(tmp, 'pairs.json');
  fs.writeFileSync(customPairs, JSON.stringify([
    { foreground: 'color.ink', background: 'color.bg', role: 'text', name: 'Black on white' },
    { foreground: 'color.oklchGood', background: 'color.bg', role: 'text', name: 'OKLCH on white' },
    { foreground: 'color.uiBorder', background: 'color.bg', role: 'ui', name: 'UI border' },
  ]));
  const customPass = runScript('check-contrast.mjs', [customTokens, '--pairs', customPairs, '--json']);
  assert.equal(customPass.status, 0, customPass.stderr || customPass.stdout);
  const customJson = JSON.parse(customPass.stdout);
  assert.equal(customJson.results[0].wcagRatio, 21);
  assert.ok(customJson.results[0].apcaLc >= 105 && customJson.results[0].apcaLc <= 107, `unexpected APCA Lc for black-on-white: ${customJson.results[0].apcaLc}`);
  assert.equal(customJson.results[1].pass, true);
  assert.equal(customJson.results[2].pass, true);

  const failPairs = path.join(tmp, 'fail-pairs.json');
  fs.writeFileSync(failPairs, JSON.stringify([
    { foreground: 'color.lowContrast', background: 'color.bg', role: 'text' },
  ]));
  const customFail = runScript('check-contrast.mjs', [customTokens, '--pairs', failPairs, '--json']);
  assert.equal(customFail.status, 1, 'low contrast text pair (< 4.5:1) must fail');
  const failJson = JSON.parse(customFail.stdout);
  assert.equal(failJson.pass, false);
  assert.equal(failJson.failedPairs, 1);
  console.log('ok 2 - check-contrast.mjs computes exact WCAG 2.2 + APCA Lc for hex/rgb/oklch/DTCG tokens and modes');

  // 3. check-email.mjs: clean HTML + plaintext passes; Outlook CSS, Gmail >102KB, missing alt/role/lang/title, empty plaintext fail
  const goodEmail = path.join(tmp, 'good-email.html');
  const goodText = path.join(tmp, 'good-email.txt');
  fs.writeFileSync(goodEmail, `<!doctype html>
<html lang="en">
<head><title>Invoice #4821</title></head>
<body>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0">
    <tr><td><img src="https://example.com/logo.png" alt="Northwind Billing" width="120" height="32"></td></tr>
    <tr><td>Invoice #4821 for USD 42.00 is ready. View details at <a href="https://example.com/inv/4821">billing portal</a>.</td></tr>
  </table>
</body>
</html>
`);
  fs.writeFileSync(goodText, 'Invoice #4821 for USD 42.00 is ready.\nView details: https://example.com/inv/4821\n');
  const emailPass = runScript('check-email.mjs', [goodEmail, '--plaintext', goodText, '--json']);
  assert.equal(emailPass.status, 0, emailPass.stderr || emailPass.stdout);
  const emailPassJson = JSON.parse(emailPass.stdout);
  assert.equal(emailPassJson.pass, true);
  assert.equal(emailPassJson.label, 'static');
  assert.equal(emailPassJson.plaintextStatus, 'pass');

  const badEmail = path.join(tmp, 'bad-email.html');
  const emptyText = path.join(tmp, 'empty-email.txt');
  fs.writeFileSync(badEmail, `<html><head><style>.wrap { display: flex; color: var(--brand); } .grid { display: grid; position: fixed; }</style></head>
<body><table><tr><td><img src="x.png"></td></tr></table>${' '.repeat(105 * 1024)}</body></html>`);
  fs.writeFileSync(emptyText, '   \n');
  const emailFail = runScript('check-email.mjs', [badEmail, '--plaintext', emptyText, '--json']);
  assert.equal(emailFail.status, 1, 'bad email must fail');
  const emailFailJson = JSON.parse(emailFail.stdout);
  const emailRules = new Set(emailFailJson.findings.map((f) => f.rule));
  for (const expected of ['gmail-clip-risk', 'missing-lang', 'missing-title', 'outlook-unsafe-css', 'img-missing-alt', 'layout-table-missing-role', 'plaintext-empty']) {
    assert.ok(emailRules.has(expected), `missing email finding '${expected}': ${[...emailRules]}`);
  }

  // Email Studio-Grade checks: image-only link empty alt, short preheader spacer, and --headers RFC 8058 One-Click
  const promoEmail = path.join(tmp, 'promo-email.html');
  const badHeaders = path.join(tmp, 'bad-headers.eml');
  const goodHeaders = path.join(tmp, 'good-headers.eml');
  fs.writeFileSync(promoEmail, `<!doctype html>
<html lang="en">
<head>
  <title>Spring Release</title>
  <style>@layer base { .btn { color: #111111; } } ${'/*p*/'.repeat(3500)}</style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;">Preview copy &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
  <table role="presentation" width="600">
    <tr><td>Xin chao {{customer_name}}, <a href="https://example.com/buy"><img src="https://example.com/cta.png" alt=""></a></td></tr>
  </table>
</body>
</html>`);
  fs.writeFileSync(badHeaders, 'Subject: Spring Release\nList-Unsubscribe: <mailto:unsub@example.com>\n');
  const promoFail = runScript('check-email.mjs', [promoEmail, '--headers', badHeaders, '--json']);
  assert.equal(promoFail.status, 1, 'image-only CTA + short preheader + @layer + >16KB style + merge tag + missing RFC 8058 headers must fail');
  const promoRules = new Set(JSON.parse(promoFail.stdout).findings.map((f) => f.rule));
  for (const expected of ['image-only-link-empty-alt', 'short-preheader-spacer', 'style-block-too-large', 'gmail-unsafe-modern-css', 'unfilled-merge-tag', 'missing-list-unsubscribe', 'missing-one-click-unsubscribe']) {
    assert.ok(promoRules.has(expected), `missing promo email finding '${expected}': ${[...promoRules]}`);
  }

  fs.writeFileSync(goodHeaders, 'List-Unsubscribe: <https://example.com/unsub?id=1>, <mailto:unsub@example.com>\nList-Unsubscribe-Post: List-Unsubscribe=One-Click\n');
  const headerPass = runScript('check-email.mjs', [goodEmail, '--plaintext', goodText, '--headers', goodHeaders, '--json']);
  assert.equal(headerPass.status, 0, headerPass.stderr || headerPass.stdout);
  assert.equal(JSON.parse(headerPass.stdout).headersStatus, 'pass');
  console.log('ok 3 - check-email.mjs catches Gmail 102KB/>16KB style/@layer, Outlook CSS, image-only CTAs, merge tags, RFC 8058 headers, and plaintext gaps');

  // 4. check-tui.mjs: clean capture & live NO_COLOR command pass; ZWJ/VS16/NFD grapheme width exact; ANSI/overflow/6-step teardown fail
  const goodTui = path.join(tmp, 'good-tui.txt');
  // Family ZWJ emoji (2 cols) + Warning VS16 (2 cols) + NFD Vietnamese "Tiếng Việt" (10 cols) + CJK "日本" (4 cols)
  const graphemeLine = '👨‍👩‍👧‍👦 ⚠️ Tie\u0302\u0301ng Vie\u0323\u0302t 日本';
  fs.writeFileSync(goodTui, `STATUS   SERVICE    LATENCY\n${graphemeLine}\n`);
  const tuiPassInput = runScript('check-tui.mjs', ['--input', goodTui, '--cols', '30', '--json']);
  assert.equal(tuiPassInput.status, 0, tuiPassInput.stderr || tuiPassInput.stdout);
  const tuiGraphemeJson = JSON.parse(tuiPassInput.stdout);
  assert.equal(tuiGraphemeJson.label, 'static');
  assert.equal(tuiGraphemeJson.pass, true);

  // Exact grapheme width check on ZWJ + VS16 + NFD + CJK line (2 + 1 + 2 + 1 + 10 + 1 + 4 = 21 cols)
  const exactGraphemeFile = path.join(tmp, 'grapheme-exact.txt');
  fs.writeFileSync(exactGraphemeFile, `${graphemeLine}\n`);
  const exactRes = JSON.parse(runScript('check-tui.mjs', ['--input', exactGraphemeFile, '--cols', '21', '--json']).stdout);
  assert.equal(exactRes.maxWidth, 21, `expected ZWJ+VS16+NFD+CJK line to equal 21 cols, got ${exactRes.maxWidth}`);
  assert.equal(exactRes.pass, true);

  const tuiPassCmd = runScript('check-tui.mjs', [
    '--cols', '60', '--json', '--', process.execPath, '-e',
    'if (process.env.NO_COLOR !== "1") process.exit(2); console.log("Clean TUI line under 60 cols");',
  ]);
  assert.equal(tuiPassCmd.status, 0, tuiPassCmd.stderr || tuiPassCmd.stdout);
  const tuiCmdJson = JSON.parse(tuiPassCmd.stdout);
  assert.equal(tuiCmdJson.label, 'rendered');
  assert.equal(tuiCmdJson.pass, true);

  const tuiFailAnsiWidth = runScript('check-tui.mjs', [
    '--cols', '40', '--json', '--', process.execPath, '-e',
    'process.stdout.write("\\x1b[?1049h\\x1b[?2004h\\x1b[?1006h\\x1b[>1u\\x1b[31m" + "X".repeat(55) + "\\x1b[0m\\n"); process.exit(1);',
  ]);
  assert.equal(tuiFailAnsiWidth.status, 1, 'leaking ANSI, overflow, teardown leak, and nonzero exit must fail');
  const tuiFailJson = JSON.parse(tuiFailAnsiWidth.stdout);
  const tuiRules = new Set(tuiFailJson.findings.map((f) => f.rule));
  for (const expected of ['nonzero-exit', 'teardown-leak', 'ansi-leak-no-color', 'line-overflow']) {
    assert.ok(tuiRules.has(expected), `missing TUI finding '${expected}': ${[...tuiRules]}`);
  }
  const teardownMsgs = tuiFailJson.findings.filter((f) => f.rule === 'teardown-leak').map((f) => f.message).join(' | ');
  assert.match(teardownMsgs, /2004h/, 'should report unclosed bracketed paste ?2004h');
  assert.match(teardownMsgs, /1006h/, 'should report unclosed mouse tracking ?1006h');
  assert.match(teardownMsgs, /Kitty keyboard/, 'should report unclosed Kitty keyboard push');
  console.log('ok 4 - check-tui.mjs validates UAX #29 grapheme widths (ZWJ/VS16/NFD/CJK), NO_COLOR, 6-step teardown leaks, and exit status');

  // 5. check-pdf.mjs: valid tagged PDF passes; subset font missing /ToUnicode fails; --prepress checks /TrimBox /BleedBox /OutputIntents
  const goodPdf = path.join(tmp, 'tagged.pdf');
  fs.writeFileSync(goodPdf, Buffer.from(
    '%PDF-1.7\n'
    + '1 0 obj << /Type /Catalog /Pages 2 0 R /StructTreeRoot 5 0 R /MarkInfo << /Marked true >> /Lang (en-US) >> endobj\n'
    + '2 0 obj << /Type /Pages /Count 2 /Kids [3 0 R 4 0 R] >> endobj\n'
    + '3 0 obj << /Type /Page /Parent 2 0 R >> endobj\n'
    + '4 0 obj << /Type /Page /Parent 2 0 R >> endobj\n'
    + '5 0 obj << /Type /StructTreeRoot >> endobj\n'
    + '6 0 obj << /Title (Quarterly Statement) >> endobj\n'
    + '7 0 obj << /Type /FontDescriptor /FontFile2 8 0 R >> endobj\n'
    + '%%EOF\n',
    'latin1',
  ));
  const pdfPass = runScript('check-pdf.mjs', [goodPdf, '--json']);
  assert.equal(pdfPass.status, 0, pdfPass.stderr || pdfPass.stdout);
  const pdfPassJson = JSON.parse(pdfPass.stdout);
  assert.equal(pdfPassJson.label, 'static');
  assert.equal(pdfPassJson.validHeader, true);
  assert.equal(pdfPassJson.pageCount, 2);
  assert.equal(pdfPassJson.markers.structTreeRoot, true);
  assert.equal(pdfPassJson.markers.embeddedFonts, true);
  assert.equal(pdfPassJson.pass, true);

  const subsetNoUnicodePdf = path.join(tmp, 'subset-no-unicode.pdf');
  fs.writeFileSync(subsetNoUnicodePdf, Buffer.from(
    '%PDF-1.7\n'
    + '1 0 obj << /Type /Catalog /StructTreeRoot 2 0 R /MarkInfo << /Marked true >> /Lang (vi-VN) /Title (Bao Cao) >> endobj\n'
    + '3 0 obj << /Type /Page >> endobj\n'
    + '4 0 obj << /Type /Font /Subtype /Type0 /BaseFont /ABCDEF+BeVietnamPro /Encoding /Identity-H /FontFile2 5 0 R >> endobj\n'
    + '%%EOF\n',
    'latin1',
  ));
  const subsetFail = runScript('check-pdf.mjs', [subsetNoUnicodePdf, '--json']);
  assert.equal(subsetFail.status, 1, 'subset Type0 font without /ToUnicode must fail');
  assert.ok(JSON.parse(subsetFail.stdout).findings.some((f) => f.rule === 'missing-tounicode-cmap'));

  const prepressFail = runScript('check-pdf.mjs', [goodPdf, '--prepress', '--json']);
  assert.equal(prepressFail.status, 1, '--prepress without TrimBox/BleedBox/OutputIntents/ToUnicode must fail');
  const prepressRules = new Set(JSON.parse(prepressFail.stdout).findings.map((f) => f.rule));
  for (const expected of ['missing-tounicode-cmap', 'missing-trim-box', 'missing-bleed-box', 'missing-output-intent']) {
    assert.ok(prepressRules.has(expected), `missing prepress finding '${expected}': ${[...prepressRules]}`);
  }

  const prepressPassPdf = path.join(tmp, 'prepress-ok.pdf');
  fs.writeFileSync(prepressPassPdf, Buffer.from(
    '%PDF-1.7\n'
    + '1 0 obj << /Type /Catalog /StructTreeRoot 2 0 R /MarkInfo << /Marked true >> /Lang (en) /Title (Brochure) /OutputIntents [9 0 R] >> endobj\n'
    + '3 0 obj << /Type /Page /TrimBox [0 0 595 842] /BleedBox [-8.5 -8.5 603.5 850.5] >> endobj\n'
    + '4 0 obj << /Type /Font /Subtype /Type0 /BaseFont /ABCDEF+Fraunces /ToUnicode 6 0 R /FontFile2 7 0 R >> endobj\n'
    + '%%EOF\n',
    'latin1',
  ));
  const prepressOk = runScript('check-pdf.mjs', [prepressPassPdf, '--prepress', '--json']);
  assert.equal(prepressOk.status, 0, prepressOk.stderr || prepressOk.stdout);

  const untaggedPdf = path.join(tmp, 'untagged.pdf');
  fs.writeFileSync(untaggedPdf, Buffer.from('%PDF-1.4\n1 0 obj << /Type /Page >> endobj\n%%EOF\n', 'latin1'));
  const pdfFail = runScript('check-pdf.mjs', [untaggedPdf, '--json']);
  assert.equal(pdfFail.status, 1, 'untagged PDF without fonts/lang/title must fail');
  const pdfFailRules = new Set(JSON.parse(pdfFail.stdout).findings.map((f) => f.rule));
  for (const expected of ['missing-struct-tree', 'missing-mark-info', 'missing-pdf-lang', 'missing-pdf-title', 'unembedded-fonts']) {
    assert.ok(pdfFailRules.has(expected), `missing PDF finding '${expected}': ${[...pdfFailRules]}`);
  }

  const fakePdf = path.join(tmp, 'not-a-pdf.pdf');
  fs.writeFileSync(fakePdf, '<html>not a pdf</html>');
  const fakePdfRes = runScript('check-pdf.mjs', [fakePdf, '--json']);
  assert.equal(fakePdfRes.status, 1);
  assert.equal(JSON.parse(fakePdfRes.stdout).findings[0].rule, 'invalid-pdf-header');
  console.log('ok 5 - check-pdf.mjs validates %PDF header, PDF/UA markers, embedded fonts, /ToUnicode CMap, and --prepress PDF/X gates');

  // 6. check-acceptance.mjs: all 14 platforms initialize cleanly, pending/static-on-rendered fail (Rule #0.3), PASS_STUDIO_10K_20K & EXCEEDS_STUDIO pass
  const acceptanceCli = path.join(root, 'skills/pixelcraft-review/scripts/check-acceptance.mjs');
  const runAcc = (args) => spawnSync(process.execPath, [acceptanceCli, ...args], { encoding: 'utf8' });

  const accHelp = runAcc(['--help']);
  assert.equal(accHelp.status, 0);
  assert.match(accHelp.stdout, /Rule #0\.3/);

  const listRes = JSON.parse(runAcc(['--list-platforms', '--json']).stdout);
  assert.equal(listRes.platforms.length, 14, `expected 14 platforms, got ${listRes.platforms.length}`);

  // Unwalked initialized template must exit 1 (FAIL) so agents cannot stop without filling it
  const accPath = path.join(tmp, 'web-acceptance.json');
  const initRes = runAcc(['--init', 'web', '--out', accPath]);
  assert.equal(initRes.status, 0, initRes.stderr);
  const rawFail = runAcc([accPath, '--json']);
  assert.equal(rawFail.status, 1, 'unwalked pending template must fail');
  assert.equal(JSON.parse(rawFail.stdout).grade, 'FAIL');

  // Fill every row, intentionally violating Rule #0.3 (marking A4-accessibility pass with static!)
  const manifest = JSON.parse(fs.readFileSync(accPath, 'utf8'));
  manifest.target = 'https://billing.example.com/checkout';
  manifest.sowThresholds = {
    devicesAndEnvironments: 'Chrome/Firefox/Safari macOS + iPhone 15 Safari + Galaxy S23 Chrome under 4G throttle',
    numericBudgets: 'LCP <= 2.5s, INP <= 200ms, CLS <= 0.1, initial JS+CSS <= 220 KB gzip',
  };
  for (const sec of [manifest.baseline, manifest.surfaceMatrix, manifest.platformGates]) {
    for (const item of Object.values(sec)) {
      item.result = 'pass';
      item.label = item.requiresRendered ? 'rendered' : 'static';
      item.evidence = item.requiresRendered
        ? 'visual-qa/checkout-390-768-1440.png + Lighthouse 3-run median Perf 94 / A11y 98'
        : 'slop-scan score 0 + tsc --noEmit exit 0 + package-lock.json audit clean';
    }
  }
  manifest.baseline['A4-accessibility-floor'].label = 'static'; // Violates Rule #0.3!
  fs.writeFileSync(accPath, JSON.stringify(manifest, null, 2));
  const rule03Fail = runAcc([accPath, '--json']);
  assert.equal(rule03Fail.status, 1, 'Rule #0.3 violation (static on requiresRendered) must exit 1');
  const rule03Json = JSON.parse(rule03Fail.stdout);
  assert.equal(rule03Json.grade, 'FAIL');
  assert.equal(rule03Json.issues[0].rule, 'static-or-model-judgment-insufficient');

  // Fix Rule #0.3, test PENDING_RENDERED_ENV (exit 2 without flag, exit 0 with --allow-not-checked)
  manifest.baseline['A4-accessibility-floor'].label = 'rendered';
  manifest.platformGates['WEB-6-deliverable-bundle'] = {
    ...manifest.platformGates['WEB-6-deliverable-bundle'],
    result: 'not-checked',
    label: 'not-checked',
    reason: 'Physical iPhone Safari device unavailable in headless Linux CI container',
  };
  fs.writeFileSync(accPath, JSON.stringify(manifest, null, 2));
  const envBlocked = runAcc([accPath, '--json']);
  assert.equal(envBlocked.status, 2, 'PENDING_RENDERED_ENV must exit 2 by default');
  assert.equal(JSON.parse(envBlocked.stdout).grade, 'PENDING_RENDERED_ENV');
  const envAllowed = runAcc([accPath, '--allow-not-checked', '--json']);
  assert.equal(envAllowed.status, 0, '--allow-not-checked should exit 0 while keeping PENDING_RENDERED_ENV grade');
  assert.equal(JSON.parse(envAllowed.stdout).grade, 'PENDING_RENDERED_ENV');

  // Full rendered pass + valid client waiver -> PASS_STUDIO_10K_20K (exit 0)
  manifest.platformGates['WEB-6-deliverable-bundle'] = {
    title: manifest.platformGates['WEB-6-deliverable-bundle'].title,
    requiresRendered: true,
    result: 'pass',
    label: 'rendered',
    evidence: 'qa/lighthouse-median-3runs.json + qa/safari-ios18-recording.mp4 + qa/voiceover-notes.md',
  };
  manifest.surfaceMatrix['M7-text-scale-and-localization'] = {
    title: manifest.surfaceMatrix['M7-text-scale-and-localization'].title,
    requiresRendered: true,
    result: 'pass',
    label: 'waived',
    approvedBy: 'Client SOW §4.2 (2026-11-25)',
    scope: 'RTL Arabic mirroring deferred to Phase 2; 200% zoom & EN/VI verified',
    consequence: 'RTL locales remain unsupported in v1.0 launch',
  };
  fs.writeFileSync(accPath, JSON.stringify(manifest, null, 2));
  const studioPass = runAcc([accPath, '--json']);
  assert.equal(studioPass.status, 0, studioPass.stderr || studioPass.stdout);
  assert.equal(JSON.parse(studioPass.stdout).grade, 'PASS_STUDIO_10K_20K');

  // Adding verified usability study -> EXCEEDS_STUDIO (exit 0)
  manifest.exceeds = [
    { id: 'usability-study-8-users', result: 'pass', label: 'rendered', evidence: 'research/moderated-checkout-study-n8.md (8/8 task completion)' },
  ];
  fs.writeFileSync(accPath, JSON.stringify(manifest, null, 2));
  const exceedsPass = runAcc([accPath, '--json']);
  assert.equal(exceedsPass.status, 0);
  assert.equal(JSON.parse(exceedsPass.stdout).grade, 'EXCEEDS_STUDIO');
  console.log('ok 6 - check-acceptance.mjs enforces all 14 platform checklists, Rule #0.3 rendered-evidence law, waivers, and 3-tier Studio grading');

  console.log('cross-platform QA CLI tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
