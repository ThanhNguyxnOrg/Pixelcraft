#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exporter = path.join(root, 'skills/pixelcraft-tokens/scripts/export-tokens.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-export-tokens-'));

function run(args, cwd = root) {
  return spawnSync(process.execPath, [exporter, ...args], { encoding: 'utf8', cwd });
}

try {
  const fixture = path.join(tmp, 'tokens.json');
  fs.writeFileSync(fixture, JSON.stringify({
    color: {
      $type: 'color',
      surface: { $value: { colorSpace: 'srgb', components: [1, 1, 1], alpha: 1 } }
    },
    semantic: {
      background: {
        $value: '{color.surface}',
        $extensions: {
          pixelcraft: {
            modes: {
              dark: { $value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 1 } }
            }
          }
        }
      }
    }
  }, null, 2));

  const dark = run([fixture, '--format', 'css', '--mode', 'dark']);
  assert.equal(dark.status, 0, dark.stderr);
  assert.match(dark.stdout, /--semantic-background: #000000;/);
  assert.doesNotMatch(dark.stdout, /colorSpace/);
  console.log('ok 1 - mode override inherits the original alias target type');

  const missingValueCases = [
    [['--format'], /--format requires a value/],
    [['--format='], /--format requires a value/],
    [['--format', '--out-dir', 'x'], /--format requires a value/],
    [['--out-dir'], /--out-dir requires a value/],
    [['--out-dir='], /--out-dir requires a value/],
    [['--mode'], /--mode requires a value/],
    [['--mode='], /--mode requires a value/]
  ];
  for (const [optionArgs, message] of missingValueCases) {
    const missing = run([fixture, ...optionArgs]);
    assert.notEqual(missing.status, 0, `${optionArgs.join(' ')} unexpectedly succeeded`);
    assert.match(missing.stderr, message);
  }
  console.log('ok 2 - missing option values are rejected');

  const dashOutDir = run([fixture, '--format', 'css', '--mode', 'dark', '--out-dir', '-generated'], tmp);
  assert.equal(dashOutDir.status, 0, dashOutDir.stderr);
  assert.ok(fs.existsSync(path.join(tmp, '-generated', 'tokens.dark.css')), 'dash-prefixed output directory was not used');
  assert.match(dashOutDir.stdout, /wrote -generated[\\/]tokens\.dark\.css/);
  console.log('ok 3 - dash-prefixed option values are accepted');

  console.log('token exporter tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
