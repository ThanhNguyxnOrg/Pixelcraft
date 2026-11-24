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
  console.log('ok 3 - check-email.mjs catches Gmail 102KB clip, Outlook-unsafe CSS, missing alt/role/title/lang, and plaintext gaps');

  // 4. check-tui.mjs: clean capture & live NO_COLOR command pass; ANSI leak, >80 col overflow, teardown leak, and nonzero exit fail
  const goodTui = path.join(tmp, 'good-tui.txt');
  fs.writeFileSync(goodTui, 'STATUS   SERVICE    LATENCY\nOK       billing    12ms\nOK       ledger     18ms\n');
  const tuiPassInput = runScript('check-tui.mjs', ['--input', goodTui, '--cols', '80', '--json']);
  assert.equal(tuiPassInput.status, 0, tuiPassInput.stderr || tuiPassInput.stdout);
  assert.equal(JSON.parse(tuiPassInput.stdout).label, 'static');

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
    'process.stdout.write("\\x1b[?1049h\\x1b[31m" + "X".repeat(55) + "\\x1b[0m\\n"); process.exit(1);',
  ]);
  assert.equal(tuiFailAnsiWidth.status, 1, 'leaking ANSI, overflow, teardown leak, and nonzero exit must fail');
  const tuiFailJson = JSON.parse(tuiFailAnsiWidth.stdout);
  const tuiRules = new Set(tuiFailJson.findings.map((f) => f.rule));
  for (const expected of ['nonzero-exit', 'teardown-leak', 'ansi-leak-no-color', 'line-overflow']) {
    assert.ok(tuiRules.has(expected), `missing TUI finding '${expected}': ${[...tuiRules]}`);
  }
  console.log('ok 4 - check-tui.mjs validates NO_COLOR ANSI hygiene, visible column width, teardown leaks, and exit status');

  // 5. check-pdf.mjs: valid tagged PDF with embedded font passes; untagged/non-PDF fails with honest static label
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
  console.log('ok 5 - check-pdf.mjs validates %PDF header, page counts, PDF/UA markers, and embedded fonts with static labeling');

  console.log('cross-platform QA CLI tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
