#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help')) {
  console.log('Usage: node scripts/test-sync-docs.mjs');
  process.exit(0);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'scripts/sync-docs.mjs');

function run(args, allowFail = false) {
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, stdout, stderr: '' };
  } catch (err) {
    if (!allowFail) throw err;
    return {
      code: err.status ?? 1,
      stdout: err.stdout?.toString('utf8') ?? '',
      stderr: err.stderr?.toString('utf8') ?? '',
    };
  }
}

// 1. --help works
const helpRes = run(['--help']);
assert.equal(helpRes.code, 0);
assert.match(helpRes.stdout, /--check/);
assert.match(helpRes.stdout, /--write/);
console.log('ok 1 - sync-docs.mjs supports --help');

// 2. Real repo passes --check cleanly
const checkRes = run(['--check', '--json']);
assert.equal(checkRes.code, 0);
const parsed = JSON.parse(checkRes.stdout);
assert.deepEqual(parsed.drifted, [], `Unexpected drift in repo: ${parsed.drifted.join(', ')}`);
assert.ok(parsed.metrics.skills >= 26);
assert.ok(parsed.metrics.references >= 247);
assert.ok(parsed.metrics.scripts >= 9);
assert.ok(parsed.metrics.tokenFormatCount >= 19);
assert.ok(parsed.metrics.scanRuleCount >= 23);
assert.ok(parsed.metrics.evalFixtures >= 66);
assert.ok(parsed.metrics.galleryExhibits >= 6);
console.log('ok 2 - real repository passes --check with live metrics');

// 3. Stale counts & version drift fail --check and heal cleanly under --write
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-sync-docs-'));
try {
  for (const rel of [
    'package.json',
    'plugin.json',
    'gemini-extension.json',
    '.claude-plugin',
    '.cursor-plugin',
    '.antigravity-plugin',
    '.codex-plugin',
    '.github/plugin',
    '.devin-plugin',
    'README.md',
    'docs',
    'evals',
    'skills',
    'bin',
    'website/package.json',
    'website/package-lock.json',
    'website/README.md',
    'website/public/gallery',
  ]) {
    const src = path.join(root, rel);
    const dst = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.cpSync(src, dst, { recursive: true });
  }

  // Introduce deliberate drift across README.md, evals/README.md, website/package.json, and .antigravity-plugin/plugin.json
  const readmePath = path.join(tmp, 'README.md');
  fs.writeFileSync(
    readmePath,
    fs.readFileSync(readmePath, 'utf8')
      .replace(/references-\d+-0984e3\.svg" alt="\d+ References"/, 'references-199-0984e3.svg" alt="199 References"')
      .replace(/\(\d+ JSON fixtures\)/, '(48 JSON fixtures)'),
    'utf8',
  );
  const evalReadmePath = path.join(tmp, 'evals/README.md');
  fs.writeFileSync(
    evalReadmePath,
    fs.readFileSync(evalReadmePath, 'utf8').replace(/\(\d+ fixtures covering/, '(48 fixtures covering'),
    'utf8',
  );
  const webPkgPath = path.join(tmp, 'website/package.json');
  const webPkg = JSON.parse(fs.readFileSync(webPkgPath, 'utf8'));
  webPkg.version = '0.0.1';
  fs.writeFileSync(webPkgPath, `${JSON.stringify(webPkg, null, 2)}\n`, 'utf8');

  const agyPath = path.join(tmp, '.antigravity-plugin/plugin.json');
  const agyPkg = JSON.parse(fs.readFileSync(agyPath, 'utf8'));
  agyPkg.version = '0.0.1';
  fs.writeFileSync(agyPath, `${JSON.stringify(agyPkg, null, 2)}\n`, 'utf8');

  const failRes = run(['--check', '--root', tmp], true);
  assert.equal(failRes.code, 1, 'Expected --check to fail on drifted files');
  assert.match(failRes.stderr, /README\.md/);
  assert.match(failRes.stderr, /evals\/README\.md/);
  assert.match(failRes.stderr, /website\/package\.json/);
  assert.match(failRes.stderr, /\.antigravity-plugin\/plugin\.json/);

  const writeRes = run(['--write', '--root', tmp]);
  assert.equal(writeRes.code, 0);

  const healedRes = run(['--check', '--root', tmp]);
  assert.equal(healedRes.code, 0);
  const healedWebPkg = JSON.parse(fs.readFileSync(webPkgPath, 'utf8'));
  assert.equal(healedWebPkg.version, parsed.metrics.version);
  const healedAgyPkg = JSON.parse(fs.readFileSync(agyPath, 'utf8'));
  assert.equal(healedAgyPkg.version, parsed.metrics.version);
  console.log('ok 3 - drift fails --check and heals idempotently with --write');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('sync-docs tests passed');
