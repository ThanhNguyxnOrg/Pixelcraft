#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'skills/pixelcraft-visual-qa/scripts/style-inventory.mjs');
const fixture = path.join(root, 'skills/pixelcraft-visual-qa/scripts/fixtures/style-inventory.html');
const edgeFixture = path.join(root, 'skills/pixelcraft-visual-qa/scripts/fixtures/style-inventory-edge.html');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-style-inventory-'));

function browserUnavailable(output) {
  return /Executable doesn't exist|browser executable|playwright install chromium|chrome-headless-shell/i.test(output);
}

function runInventory(target, outPath, extra = []) {
  const extraArgs = [];
  if (process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT) extraArgs.push('--project', process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT);
  if (process.env.PIXELCRAFT_TEST_CHROMIUM) extraArgs.push('--executable-path', process.env.PIXELCRAFT_TEST_CHROMIUM);
  return spawnSync(process.execPath, [script, target, '--out', outPath, ...extra, ...extraArgs], { encoding: 'utf8', cwd: root });
}

function runInventoryAsync(target, outPath, extra = []) {
  const extraArgs = [];
  if (process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT) extraArgs.push('--project', process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT);
  if (process.env.PIXELCRAFT_TEST_CHROMIUM) extraArgs.push('--executable-path', process.env.PIXELCRAFT_TEST_CHROMIUM);
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, target, '--out', outPath, ...extra, ...extraArgs], { cwd: root });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

try {
  const out = path.join(tmp, 'inventory.json');
  const result = runInventory(fixture, out, ['--breakpoints=390x500,800x600', '--wait-ms=100']);
  const combined = `${result.stdout}\n${result.stderr}`;
  const skipped = (result.status === 2 && /Playwright is not installed/.test(combined)) || (result.status !== 0 && browserUnavailable(combined));
  if (skipped) console.log('ok 1 - Playwright unavailable; style inventory test skipped cleanly');
  else assert.equal(result.status, 0, combined);
  if (!skipped) {
    assert.ok(fs.existsSync(out), 'inventory JSON was not written');
    const report = JSON.parse(fs.readFileSync(out, 'utf8'));
    assert.equal(report.schemaVersion, 1);
    assert.equal(report.viewports.length, 2);
    const narrow = report.viewports[0];
    assert.equal(narrow.width, 390);
    const wide = report.viewports[1];
    assert.equal(narrow.fonts.count, 1, 'expected one preferred font family');
    assert.ok(narrow.type.ratio >= 2, `expected type contrast ratio, got ${narrow.type.ratio}`);
    assert.ok(narrow.color.distinct >= 3, 'expected multiple quantized palette entries');
    assert.equal(narrow.color.mode, 'light');
    assert.ok(wide.layout.maxContentWidth >= 600 && wide.layout.maxContentWidth <= 720, `unexpected desktop content measure ${wide.layout.maxContentWidth}`);
    assert.equal(typeof narrow.layout.whitespaceRatio, 'number');
    assert.equal(narrow.motion.reducedMotionCSS, true);
    assert.equal(narrow.accessibility.focusVisibleCSS, true);
    assert.equal(narrow.accessibility.landmarks.main, 1);
    assert.equal(narrow.accessibility.headingCount, 1);
    assert.match(narrow.url, /^http:\/\/127\.0\.0\.1:\d+\/style-inventory\.html$/);
    assert.equal(narrow.network.status, 200);
    assert.equal(typeof narrow.network.requests, 'number');
    assert.equal(typeof narrow.network.transferBytes, 'number');
    assert.equal(typeof narrow.network.jsBytes, 'number');
    assert.ok(narrow.lcp === null || typeof narrow.lcp === 'number', `expected nullable numeric LCP, got ${narrow.lcp}`);
    assert.equal(typeof narrow.cls, 'number');
    assert.equal(narrow.cursor.hidden, true);
    assert.ok(narrow.cursor.values.includes('none'));
    assert.equal(typeof narrow.motion.libraries.gsap, 'boolean');
    assert.ok(narrow.fonts.entries.some((entry) => entry.weight === '800'), 'expected the display weight in the font inventory');
    assert.ok(Array.isArray(narrow.type.lineHeights));
    assert.equal(report.units.transfer, 'bytes');
    assert.equal(typeof narrow.network.initial.requests, 'number');
    assert.equal(typeof narrow.network.initial.transferBytes, 'number');
    assert.equal(typeof narrow.network.initial.jsBytes, 'number');
    assert.equal(typeof narrow.network.deferred.requests, 'number');
    assert.equal(typeof narrow.network.deferred.transferBytes, 'number');
    assert.equal(typeof narrow.network.deferred.jsBytes, 'number');
    assert.ok(narrow.network.initial.jsBytes > 0, 'expected the initial fixture script in jsBytes');
    assert.ok(narrow.network.deferred.jsBytes > 0, 'expected the deferred fixture script in jsBytes');
    assert.ok(narrow.network.resourceTypes && typeof narrow.network.resourceTypes === 'object', 'expected resource-type accounting');
    assert.ok(narrow.network.resourceTypes.script.requests >= 2, 'expected script resource-type accounting');
    assert.match(report.measurement.payloadPhase, /before the document load event/);
    assert.match(narrow.color.dominant, /^#[0-9a-f]{6}$/);
    console.log('ok 1 - local fixture produces style inventory JSON');

    const edgeOut = path.join(tmp, 'edge.json');
    const edgeResult = runInventory(edgeFixture, edgeOut, ['--breakpoints=800x600', '--wait-ms=100']);
    assert.equal(edgeResult.status, 0, `${edgeResult.stdout}\n${edgeResult.stderr}`);
    const edgeReport = JSON.parse(fs.readFileSync(edgeOut, 'utf8'));
    const edge = edgeReport.viewports[0];
    assert.equal(edge.color.dominant, '#000000');
    assert.equal(edge.color.mode, 'dark');
    assert.equal(edge.accessibility.contrastChecked, 3, `expected 3 visible text leaves (clipped descendant excluded), got ${edge.accessibility.contrastChecked}`);
    assert.equal(edge.accessibility.contrastFailures, 1, `expected 1 opacity contrast failure, got ${edge.accessibility.contrastFailures}`);
    assert.deepEqual(edge.accessibility.landmarks, { main: 1, contentinfo: 1 }, `unexpected landmark exposure/scope: ${JSON.stringify(edge.accessibility.landmarks)}`);
    console.log('ok 2 - zero-channel background, opacity contrast, ancestor clipping, and landmarks work');

    const clsFile = path.join(tmp, 'cls-windows.html');
    fs.writeFileSync(clsFile, `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>CLS windows</title>
<style>body{margin:0;background:#fff;color:#111}#box{height:180px;background:#222}</style>
</head>
<body>
<div id="spacer"></div>
<div id="box" style="height:180px;background:#222;color:#fff;padding:16px">shifted block content</div>
<script>
let total = 0;
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    if (!e.hadRecentInput) {
      total += e.value;
      document.title = 'sum=' + total.toFixed(4);
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
window.addEventListener('load', () => {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(() => { document.getElementById('spacer').style.height = '140px'; }, 60);
    setTimeout(() => {
      document.getElementById('spacer').style.height = '280px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const done = document.createElement('div');
        done.id = 'shift-done';
        done.textContent = 'done';
        document.body.appendChild(done);
      }));
    }, 1200);
  }));
});
</script>
</body>
</html>`);
    const clsOut = path.join(tmp, 'cls.json');
    const clsResult = runInventory(clsFile, clsOut, ['--breakpoints=800x600', '--wait-for=#shift-done', '--wait-ms=100']);
    assert.equal(clsResult.status, 0, `${clsResult.stdout}\n${clsResult.stderr}`);
    const clsViewport = JSON.parse(fs.readFileSync(clsOut, 'utf8')).viewports[0];
    const sumMatch = /^sum=([0-9.]+)$/.exec(clsViewport.title);
    assert.ok(sumMatch, `expected recorded shift sum in title, got '${clsViewport.title}'`);
    const totalShiftSum = Number(sumMatch[1]);
    assert.ok(totalShiftSum > 0.1, `expected two real layout shifts, got sum=${totalShiftSum}`);
    assert.ok(clsViewport.cls > 0 && clsViewport.cls < totalShiftSum * 0.75, `expected max session-window CLS (${clsViewport.cls}) < 75% of cumulative sum (${totalShiftSum})`);
    console.log('ok 3 - CLS uses max session window instead of cumulative sum');

    const navServer = http.createServer((req, res) => {
      if (req.url === '/iframe-404') {
        res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
        res.end('<!doctype html><title>Missing frame</title><p>Not found</p>');
        return;
      }
      if (req.url === '/redirect.js') {
        res.writeHead(302, { location: '/final.js', 'x-redirect-pad': 'r'.repeat(900), 'content-type': 'text/plain; charset=utf-8' });
        res.end();
        return;
      }
      if (req.url === '/final.js') {
        res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' });
        res.end('window.__redirectLoaded = true;');
        return;
      }
      if (req.url === '/hanging-media') {
        res.writeHead(200, { 'content-type': 'image/png' });
        setTimeout(() => res.end(), 10000).unref();
        return;
      }
      if (req.url === '/slow-page') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Slow subresource</title></head><body><main><h1>Ready before load</h1><img src="/hanging-media" alt="slow"></main></body></html>');
        return;
      }
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Main 200</title><script src="/redirect.js"></script></head><body><main><h1>Main</h1><iframe src="/iframe-404"></iframe></main></body></html>');
    });
    await new Promise((resolve) => navServer.listen(0, '127.0.0.1', resolve));
    try {
      const { port } = navServer.address();
      const navOut = path.join(tmp, 'nav-status.json');
      const navResult = await runInventoryAsync(`http://127.0.0.1:${port}/`, navOut, ['--breakpoints=800x600', '--wait-ms=100']);
      assert.equal(navResult.status, 0, `${navResult.stdout}\n${navResult.stderr}`);
      const navViewport = JSON.parse(fs.readFileSync(navOut, 'utf8')).viewports[0];
      assert.equal(navViewport.network.status, 200, `expected main document status 200, got ${navViewport.network.status}`);
      console.log('ok 4 - subframe document responses do not overwrite main navigation status');
      assert.equal(navViewport.network.redirects, 1, `expected 1 redirect, got ${navViewport.network.redirects}`);
      assert.ok(navViewport.network.jsBytes >= 1000, `expected redirect response bytes included in jsBytes, got ${navViewport.network.jsBytes}`);
      console.log('ok 5 - redirect hops account for redirect response transfer bytes');

      const dclOut = path.join(tmp, 'dcl.json');
      const dclResult = await runInventoryAsync(`http://127.0.0.1:${port}/slow-page`, dclOut, ['--breakpoints=800x600', '--wait-until=domcontentloaded', '--timeout=3000', '--wait-ms=100']);
      assert.equal(dclResult.status, 0, `${dclResult.stdout}\n${dclResult.stderr}`);
      const dclViewport = JSON.parse(fs.readFileSync(dclOut, 'utf8')).viewports[0];
      assert.equal(dclViewport.title, 'Slow subresource');
      assert.ok(dclViewport.network.pendingRequests >= 1, `expected hanging media in pendingRequests, got ${dclViewport.network.pendingRequests}`);
      console.log('ok 6 - --wait-until=domcontentloaded measures pages with stalled subresources');
    } finally {
      navServer.closeAllConnections?.();
      await new Promise((resolve) => navServer.close(resolve));
    }

    console.log('style inventory tests passed');
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
