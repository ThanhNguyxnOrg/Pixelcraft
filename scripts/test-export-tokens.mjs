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

  const stringColors = path.join(tmp, 'string-colors.json');
  fs.writeFileSync(stringColors, JSON.stringify({
    color: {
      $type: 'color',
      whiteShort: { $value: '#fff' },
      accentAlpha: { $value: '#ff000080' }
    }
  }, null, 2));

  const swiftHex = run([stringColors, '--format', 'swift']);
  assert.equal(swiftHex.status, 0, swiftHex.stderr);
  assert.match(swiftHex.stdout, /colorWhiteShort = Color\(red: 1\.0000, green: 1\.0000, blue: 1\.0000, opacity: 1\)/);
  assert.match(swiftHex.stdout, /colorAccentAlpha = Color\(red: 1\.0000, green: 0\.0000, blue: 0\.0000, opacity: 0\.501961\)/);

  const kotlinHex = run([stringColors, '--format', 'kotlin']);
  assert.equal(kotlinHex.status, 0, kotlinHex.stderr);
  assert.match(kotlinHex.stdout, /val colorWhiteShort = Color\(0xffffffff\)/);
  assert.match(kotlinHex.stdout, /val colorAccentAlpha = Color\(0x80ff0000\)/);

  const dartHex = run([stringColors, '--format', 'dart']);
  assert.equal(dartHex.status, 0, dartHex.stderr);
  assert.match(dartHex.stdout, /static const Color colorWhiteShort = Color\(0xffffffff\);/);
  assert.match(dartHex.stdout, /static const Color colorAccentAlpha = Color\(0x80ff0000\);/);
  console.log('ok 4 - string hex colors (#rgb/#rrggbbaa) export accurately to Swift, Kotlin, and Dart');

  const namedColor = path.join(tmp, 'named-color.json');
  fs.writeFileSync(namedColor, JSON.stringify({ color: { $type: 'color', bad: { $value: 'red' } } }));
  const cssNamed = run([namedColor, '--format', 'css']);
  assert.equal(cssNamed.status, 0, cssNamed.stderr);
  for (const nativeFmt of ['swift', 'kotlin', 'dart']) {
    const failed = run([namedColor, '--format', nativeFmt]);
    assert.notEqual(failed.status, 0, `${nativeFmt} should reject non-hex string color`);
    assert.match(failed.stderr, /non-hex string 'red'/);
  }
  console.log('ok 5 - non-hex string colors fail loudly on Swift, Kotlin, and Dart instead of emitting corrupt colors');

  console.log('token exporter tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
