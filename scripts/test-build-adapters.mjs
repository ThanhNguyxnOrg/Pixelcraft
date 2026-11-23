#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'scripts/build-adapters.mjs');
const base = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-build-adapters-'));

function run(out) {
  return spawnSync(process.execPath, [script, '--out', out], { encoding: 'utf8' });
}

try {
  const nonMarker = path.join(base, 'non-marker');
  fs.mkdirSync(nonMarker, { recursive: true });
  fs.writeFileSync(path.join(nonMarker, 'user-file.txt'), 'do not delete\n');
  const refused = run(nonMarker);
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /refusing to clear non-empty output directory without \.pixelcraft-dist/);
  assert.equal(fs.readFileSync(path.join(nonMarker, 'user-file.txt'), 'utf8'), 'do not delete\n');
  console.log('ok 1 - refuses a non-empty directory without the marker');

  const marked = path.join(base, 'marked');
  fs.mkdirSync(marked, { recursive: true });
  fs.writeFileSync(path.join(marked, '.pixelcraft-dist'), 'generated\n');
  fs.writeFileSync(path.join(marked, 'stale.txt'), 'replace me\n');
  const rebuilt = run(marked);
  assert.equal(rebuilt.status, 0, rebuilt.stderr);
  assert.equal(fs.existsSync(path.join(marked, 'stale.txt')), false);
  assert.equal(fs.existsSync(path.join(marked, '.pixelcraft-dist')), true);
  assert.equal(fs.existsSync(path.join(marked, 'manifest.json')), true);
  console.log('ok 2 - clears and rebuilds a directory containing the marker');

  const empty = path.join(base, 'empty');
  fs.mkdirSync(empty, { recursive: true });
  const accepted = run(empty);
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.equal(fs.existsSync(path.join(empty, '.pixelcraft-dist')), true);
  assert.equal(fs.existsSync(path.join(empty, 'manifest.json')), true);
  console.log('ok 3 - accepts an empty output directory');
  console.log('adapter output safety tests passed');
} finally {
  fs.rmSync(base, { recursive: true, force: true });
}
