#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-export-tokens.mjs');
  process.exit(0);
}

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
    [['--mode='], /--mode requires a value/],
    [['--selector'], /--selector requires a value/],
    [['--selector='], /--selector requires a value/],
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
  for (const nativeFmt of ['swift', 'kotlin', 'dart', 'xaml', 'android-xml', 'rust']) {
    const failed = run([namedColor, '--format', nativeFmt]);
    assert.notEqual(failed.status, 0, `${nativeFmt} should reject non-hex string color`);
    assert.match(failed.stderr, /non-hex string 'red'/);
  }
  console.log('ok 5 - non-hex string colors fail loudly on typed native formats instead of emitting corrupt colors');

  // Flag-before-positional and unknown option rejection
  const flagFirst = run(['--format', 'css', '--selector', '[data-theme="dark"]', '--preserve-references', fixture]);
  assert.equal(flagFirst.status, 0, flagFirst.stderr);
  assert.match(flagFirst.stdout, /\[data-theme="dark"\] \{/);
  assert.match(flagFirst.stdout, /--semantic-background: var\(--color-surface\);/);
  const unknownFlag = run([fixture, '--bogus']);
  assert.notEqual(unknownFlag.status, 0);
  assert.match(unknownFlag.stderr, /unknown option: --bogus/);
  console.log('ok 6 - flags before positional input, --selector, --preserve-references, and unknown flag rejection work');

  // DTCG composite types, cubicBezier, fontFamily quoting, color spaces, rem-to-px, and new formats
  const rich = path.join(tmp, 'rich.json');
  fs.writeFileSync(rich, JSON.stringify({
    color: {
      $type: 'color',
      lab: { $value: { colorSpace: 'oklab', components: [0.6, 0.1, -0.05], alpha: 1 } },
      p3: { $value: { colorSpace: 'display-p3', components: [1, 0.2, 0.1], alpha: 0.9, hex: '#e8331a' } },
      hsl: { $value: { colorSpace: 'hsl', components: [210, 80, 50], alpha: 1 } },
      ink: { $value: '#112233' },
    },
    space: {
      $type: 'dimension',
      gutter: { $value: { value: 1.5, unit: 'rem' } },
    },
    text: {
      size: {
        $type: 'dimension',
        body: { $value: { value: 1, unit: 'rem' } },
      },
    },
    font: {
      family: {
        $type: 'fontFamily',
        ui: { $value: ['IBM Plex Sans', 'System UI', 'sans-serif'] },
      },
    },
    motion: {
      easing: {
        $type: 'cubicBezier',
        standard: { $value: [0.2, 0, 0, 1] },
      },
      duration: {
        $type: 'duration',
        fast: { $value: { value: 150, unit: 'ms' } },
      },
    },
    elevation: {
      card: {
        $type: 'shadow',
        $value: {
          color: '{color.ink}',
          offsetX: { value: 0, unit: 'px' },
          offsetY: { value: 4, unit: 'px' },
          blur: { value: 12, unit: 'px' },
          spread: { value: 0, unit: 'px' },
        },
      },
    },
    stroke: {
      focus: {
        $type: 'border',
        $value: { color: '{color.ink}', width: { value: 2, unit: 'px' }, style: 'solid' },
      },
    },
    anim: {
      fade: {
        $type: 'transition',
        $value: { duration: '{motion.duration.fast}', timingFunction: '{motion.easing.standard}' },
      },
    },
    surface: {
      banner: {
        $type: 'gradient',
        $value: [
          { color: '{color.ink}', position: 0 },
          { color: '{color.hsl}', position: 1 },
        ],
      },
    },
    type: {
      heading: {
        $type: 'typography',
        $value: { fontFamily: '{font.family.ui}', fontSize: '{text.size.body}', fontWeight: 700, lineHeight: 1.2 },
      },
    },
  }, null, 2));

  const richCss = run(['--format', 'css', rich]);
  assert.equal(richCss.status, 0, richCss.stderr);
  assert.match(richCss.stdout, /--color-lab: oklab\(0\.6 0\.1 -0\.05\);/);
  assert.match(richCss.stdout, /--color-p3: color\(display-p3 1 0\.2 0\.1 \/ 0\.9\);/);
  assert.match(richCss.stdout, /--color-hsl: hsl\(210 80% 50%\);/);
  assert.match(richCss.stdout, /--font-family-ui: "IBM Plex Sans", "System UI", sans-serif;/);
  assert.match(richCss.stdout, /--motion-easing-standard: cubic-bezier\(0\.2, 0, 0, 1\);/);
  assert.match(richCss.stdout, /--elevation-card: 0px 4px 12px 0px #112233;/);
  assert.match(richCss.stdout, /--stroke-focus: 2px solid #112233;/);
  assert.match(richCss.stdout, /--anim-fade: 150ms cubic-bezier\(0\.2, 0, 0, 1\);/);
  assert.match(richCss.stdout, /--surface-banner: linear-gradient\(#112233 0%, hsl\(210 80% 50%\) 100%\);/);
  assert.match(richCss.stdout, /--type-heading: 700 1rem\/1\.2 "IBM Plex Sans", "System UI", sans-serif;/);
  assert.doesNotMatch(richCss.stdout, /"\$?value"|"\w+":/);

  const richTw = run(['--format', 'tailwind', rich]);
  assert.equal(richTw.status, 0, richTw.stderr);
  assert.match(richTw.stdout, /@theme \{/);
  assert.match(richTw.stdout, /--spacing-gutter: 1\.5rem;/);
  assert.match(richTw.stdout, /--font-ui: "IBM Plex Sans", "System UI", sans-serif;/);
  assert.match(richTw.stdout, /--ease-standard: cubic-bezier\(0\.2, 0, 0, 1\);/);
  assert.match(richTw.stdout, /--shadow-elevation-card: 0px 4px 12px 0px #112233;/);

  // Native rem -> px (* 16) scaling and hex fallback
  const richSwift = run(['--format', 'swift', rich]);
  assert.equal(richSwift.status, 0, richSwift.stderr);
  assert.match(richSwift.stdout, /spaceGutter: CGFloat = 24 \/\/ 1\.5rem @ 16px base/);
  assert.match(richSwift.stdout, /colorP3 = Color\(red: 0\.9098, green: 0\.2000, blue: 0\.1020, opacity: 0\.9\)/);

  const richKotlin = run(['--format', 'kotlin', rich]);
  assert.equal(richKotlin.status, 0, richKotlin.stderr);
  assert.match(richKotlin.stdout, /val spaceGutter = 24\.dp \/\/ 1\.5rem @ 16px base/);
  assert.match(richKotlin.stdout, /val textSizeBody = 16\.sp \/\/ 1rem @ 16px base/);

  const richDart = run(['--format', 'dart', rich]);
  assert.equal(richDart.status, 0, richDart.stderr);
  assert.match(richDart.stdout, /static const double spaceGutter = 24; \/\/ 1\.5rem @ 16px base/);
  console.log('ok 7 - DTCG color spaces, hex fallback, cubicBezier, fontFamily quoting, composite types, Tailwind v4 namespaces, and native rem scaling work');

  // New formats: ts, scss, xaml, android-xml, rust
  const richTs = run(['--format', 'ts', rich]);
  assert.equal(richTs.status, 0, richTs.stderr);
  assert.match(richTs.stdout, /export const pixelcraftTokens = \{/);
  assert.match(richTs.stdout, /export type PixelcraftTokenName = keyof typeof pixelcraftTokens;/);

  const richScss = run(['--format', 'scss', '--preserve-references', fixture]);
  assert.equal(richScss.status, 0, richScss.stderr);
  assert.match(richScss.stdout, /\$semantic-background: \$color-surface;/);

  const richXaml = run(['--format', 'xaml', rich]);
  assert.equal(richXaml.status, 0, richXaml.stderr);
  assert.match(richXaml.stdout, /<ResourceDictionary/);
  assert.match(richXaml.stdout, /<Color x:Key="ColorP3">#E6E8331A<\/Color>/);
  assert.match(richXaml.stdout, /<x:Double x:Key="SpaceGutter">24<\/x:Double>/);

  const richAndroid = run(['--format', 'android-xml', rich]);
  assert.equal(richAndroid.status, 0, richAndroid.stderr);
  assert.match(richAndroid.stdout, /<resources>/);
  assert.match(richAndroid.stdout, /<color name="color_ink">#FF112233<\/color>/);
  assert.match(richAndroid.stdout, /<dimen name="space_gutter">24dp<\/dimen>/);
  assert.match(richAndroid.stdout, /<dimen name="text_size_body">16sp<\/dimen>/);

  const richRust = run(['--format', 'rust', rich]);
  assert.equal(richRust.status, 0, richRust.stderr);
  assert.match(richRust.stdout, /pub const COLOR_INK: \[u8; 4\] = \[17, 34, 51, 255\];/);
  assert.match(richRust.stdout, /pub const SPACE_GUTTER: f32 = 24\.0;/);
  assert.match(richRust.stdout, /pub const MOTION_DURATION_FAST: u64 = 150;/);

  // Example asset files: no broken HTML $schema and all formats export cleanly
  for (const asset of ['tokens.example.json', 'tokens.modes.example.json']) {
    const assetPath = path.join(root, 'skills/pixelcraft-tokens/assets', asset);
    const parsedAsset = JSON.parse(fs.readFileSync(assetPath, 'utf8'));
    assert.equal(parsedAsset.$schema, undefined, `${asset} should not point $schema to an HTML spec page`);
    const allOut = run(['--format', 'all', assetPath]);
    assert.equal(allOut.status, 0, `${asset} failed --format all: ${allOut.stderr}`);
  }
  console.log('ok 8 - ts, scss, xaml, android-xml, rust formats and example assets export cleanly');

  console.log('token exporter tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
