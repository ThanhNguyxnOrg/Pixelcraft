import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help')) {
  console.log('Usage: node scripts/test-shoot.mjs');
  process.exit(0);
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-shoot-test-'));
try {
  const local = (file) => fileURLToPath(new URL(`../skills/pixelcraft-visual-qa/scripts/${file}`, import.meta.url));
  const run = (fixture, ...options) => spawnSync(process.execPath, [
    local('shoot.mjs'), local(`fixtures/${fixture}`), '--out', dir, '--project',
    process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT ?? process.cwd(), '--breakpoints=390x844,768x1024',
    '--light-only', '--no-reduced-motion', '--wait-ms=100', ...options,
  ], { encoding: 'utf8', timeout: 30000 });
  const result = run('shoot-audit.html', '--keyboard');
  if (result.status === 2 && /Playwright is not installed/.test(result.stderr) && !process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT) {
    console.log('SKIP - Playwright not installed; set PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT to verify browser diagnostics');
  } else {
    assert.equal(result.status, 0, `${result.error ?? ''}\n${result.stdout}\n${result.stderr}`);
    const [narrow, wide] = JSON.parse(fs.readFileSync(path.join(dir, 'report.json'), 'utf8')).captures;
    const has = (capture, type, id) => capture.findings.some((item) => item.type === type && (!id || item.element?.endsWith(`#${id}`)));
    for (const [type, bad, good] of [
      ['broken-image', 'broken', 'valid'],
      ['content-hidden-at-rest', 'hidden-essential', 'closed'],
      ['text-occlusion', 'occluded', 'not-occluded'],
      ['low-contrast-text', 'low-contrast', 'readable'],
      ['keyboard-focus-not-detected', 'focusless', 'focus-ring'],
    ]) {
      assert.ok(has(wide, type, bad), `expected ${type} for ${bad}: ${JSON.stringify(wide.findings)}`);
      assert.ok(!has(wide, type, good), `unexpected ${type} for ${good}`);
    }
    assert.ok(!has(wide, 'broken-image', 'hidden-image'));
    assert.ok(!has(wide, 'content-hidden-at-rest', 'closed-dialog'));
    assert.ok(has(narrow, 'horizontal-overflow'));
    assert.ok(!has(wide, 'horizontal-overflow'));
    assert.deepEqual(wide.keyboard.slice(0, 2), [
      { element: 'button#focusless', indicator: 'not-detected' },
      { element: 'button#focus-ring', indicator: 'style-change' },
    ]);
    console.log('ok 1 - actual browser distinguishes broken images, hidden content, occlusion, overflow, contrast and focus controls');
    const modal = run('shoot-modal.html', '--breakpoints=768x1024');
    assert.equal(modal.status, 0, `${modal.error ?? ''}\n${modal.stdout}\n${modal.stderr}`);
    const [dialog] = JSON.parse(fs.readFileSync(path.join(dir, 'report.json'), 'utf8')).captures;
    assert.ok(has(dialog, 'text-occlusion', 'occluded-modal'), 'expected occlusion inside a visible modal');
    assert.ok(!has(dialog, 'text-occlusion', 'readable-modal'));
    assert.ok(!has(dialog, 'text-occlusion', 'behind-modal'));
    console.log('ok 2 - visible modal detects internal occlusion without flagging its intentional background coverage');
    const ariaModal = run('shoot-aria-modal.html');
    assert.equal(ariaModal.status, 0, `${ariaModal.error ?? ''}\n${ariaModal.stdout}\n${ariaModal.stderr}`);
    const [hiddenAriaDialog, ariaDialog] = JSON.parse(fs.readFileSync(path.join(dir, 'report.json'), 'utf8')).captures;
    assert.ok(has(hiddenAriaDialog, 'text-occlusion', 'behind-aria-modal'), 'fixed overlay is a defect when the sibling modal is hidden');
    assert.ok(has(ariaDialog, 'text-occlusion', 'occluded-aria-modal'));
    assert.ok(!has(ariaDialog, 'text-occlusion', 'readable-aria-modal'));
    assert.ok(!has(ariaDialog, 'text-occlusion', 'behind-aria-modal'), 'sibling backdrop intentionally covers background text');
    console.log('ok 3 - open ARIA modal distinguishes sibling backdrop from internal occlusion');
  }
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
