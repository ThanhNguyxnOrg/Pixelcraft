import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-slop-scan.mjs');
  process.exit(0);
}

const base = new URL('../skills/pixelcraft-review/scripts/', import.meta.url);
const local = (relative) => fileURLToPath(new URL(relative, base));
const runPath = (target, ...args) => {
  const result = spawnSync(process.execPath, [local('slop-scan.mjs'), target, '--json', ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
};
const run = (file, ...args) => runPath(local(`fixtures/${file}`), ...args);

assert.equal(run('slop.html').score, 40);
assert.equal(run('clean.html').score, 0);
const { findings } = run('brand-critique.css');
assert.deepEqual(findings.map(({ rule, line }) => [rule, line]), [
  ['gradient-text-treatment', 3], ['rounded-accent-rail', 8],
]);
console.log('ok 1 - advisory rules flag decorative forms, not plain styles, and preserve prior scores');

const waived = run('brand-critique.css', '--waivers', local('fixtures/brand-critique-waivers.json'));
assert.deepEqual(waived.findings.map(({ rule }) => rule), ['rounded-accent-rail']);
assert.equal(waived.waived[0].label, 'waived');
assert.match(waived.waived[0].reason, /approved wordmark/i);
assert.equal(waived.unusedWaivers[0].line, 17);
console.log('ok 2 - scoped brand waiver preserves the evidence and reports stale waivers');

const longhand = run('focus-longhand-removal.css');
assert.deepEqual(longhand.findings.map(({ rule, line, match }) => [rule, line, match]), [
  ['outline-removed', 2, 'outline-style: none'],
  ['outline-removed', 6, 'outline-style: hidden'],
  ['outline-removed', 10, 'outline-width: 0'],
  ['outline-removed', 14, 'outline: none'],
  ['outline-removed', 19, 'outline: none'],
]);
console.log('ok 3 - longhand outline removals and zero/transparent box-shadow non-replacements are caught while system/light-dark/contrast-color tokens pass');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-slop-scan-'));
try {
  // Tailwind + inline styles + positive-tabindex + generic-copy + motion
  const twBad = path.join(tmp, 'BadComponent.tsx');
  fs.writeFileSync(twBad, `export function BadComponent() {
  return (
    <div>
      <button className="px-4 focus:outline-none">No ring</button>
      <a className="focus-visible:outline-0 focus-visible:ring-0" href="/x">Zero ring</a>
      <button className="focus:outline-none focus-visible:ring-2">Safe ring</button>
      <button className="focus:outline-none focus-visible:outline-2">Safe outline</button>
      <button className="focus:outline-none focus:border-blue-600">Safe border</button>
      <div className="transition-all duration-200">Broad transition</div>
      <h1 className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Banner</h1>
      <h2 className="bg-linear-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">V4 Banner</h2>
      <span className="animate-bounce">Bouncing</span>
      <button style={{ outline: 'none' }}>Inline outline none</button>
      <input tabIndex={2} aria-label="Order" />
      <p>Supercharge your cutting-edge analytics</p>
    </div>
  );
}
`);
  const twRes = runPath(twBad);
  const rulesAndLines = twRes.findings.map(({ rule, line }) => `${rule}:${line}`);
  assert.ok(rulesAndLines.includes('outline-removed:4'), `expected focus:outline-none: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('outline-removed:5'), `expected focus-visible:outline-0 with ring-0: ${rulesAndLines}`);
  assert.ok(!rulesAndLines.includes('outline-removed:6'), `safe ring flagged: ${rulesAndLines}`);
  assert.ok(!rulesAndLines.includes('outline-removed:7'), `safe outline flagged: ${rulesAndLines}`);
  assert.ok(!rulesAndLines.includes('outline-removed:8'), `safe border flagged: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('transition-all:9'), `expected Tailwind transition-all: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('gradient-text-treatment:10'), `expected Tailwind bg-gradient-to: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('gradient-text-treatment:11'), `expected Tailwind bg-linear-to: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('missing-reduced-motion:12'), `expected Tailwind animate-bounce missing reduced motion: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('outline-removed:13'), `expected inline JSX outline none: ${rulesAndLines}`);
  assert.ok(rulesAndLines.includes('positive-tabindex:14'), `expected positive tabIndex: ${rulesAndLines}`);
  assert.equal(twRes.findings.find((f) => f.rule === 'positive-tabindex').weight, 3);
  assert.ok(rulesAndLines.includes('generic-copy:15'), `expected supercharge/cutting-edge: ${rulesAndLines}`);
  console.log('ok 4 - Tailwind utilities, inline styles, positive-tabindex, and supercharge/cutting-edge copy are detected');

  // False-positive reductions: useTransition, code identifiers, labeled multi-line inputs, custom brand font stack, motion-reduce
  const cleanTsx = path.join(tmp, 'CleanComponent.tsx');
  fs.writeFileSync(cleanTsx, `import { useTransition } from 'react';
// animation: fade 1s; transition: all 200ms; font-family: Inter;
export function unlockAccount(getStartedUrl: string) {
  const [isPending, startTransition] = useTransition();
  const unlock_account = Boolean(getStartedUrl);
  return (
    <form style={{ fontFamily: "'Fraunces', Inter, sans-serif" }}>
      <label htmlFor="email-field">Work email</label>
      <input
        id="email-field"
        type="email"
        placeholder="name@company.com"
        tabIndex={0}
      />
      <label>
        Notes
        <textarea
          rows={3}
          placeholder="Optional details"
          tabIndex={-1}
        />
      </label>
      <span className="animate-spin motion-reduce:animate-none">{isPending ? 'Saving' : String(unlock_account)}</span>
    </form>
  );
}
`);
  const cleanTsxRes = runPath(cleanTsx);
  assert.deepEqual(cleanTsxRes.findings, [], `unexpected findings on clean TSX: ${JSON.stringify(cleanTsxRes.findings)}`);

  // Multi-line unlabeled input IS still caught, and default-font-only stack IS caught
  const unlabeled = path.join(tmp, 'Unlabeled.astro');
  fs.writeFileSync(unlabeled, `<style>
  body { font-family: 'Inter', system-ui, sans-serif; }
  .brand { font-family: 'Fraunces', Inter, sans-serif; }
  button:focus-visible { outline-style: none; }
</style>
<input
  type="text"
  placeholder="Search inventory"
  tabindex="3"
/>
`);
  const astroRes = runPath(unlabeled);
  assert.deepEqual(astroRes.findings.map(({ rule, line }) => [rule, line]).sort((a, b) => a[1] - b[1]), [
    ['default-font-only', 2],
    ['outline-removed', 4],
    ['placeholder-as-label', 6],
    ['positive-tabindex', 9],
  ]);
  console.log('ok 5 - false positives are avoided for useTransition, code identifiers, labeled multi-line inputs, and brand font stacks while real defects in .astro are caught');

  // Expanded extensions, skips, and skillHosts
  const walkDir = path.join(tmp, 'walk-test');
  fs.mkdirSync(path.join(walkDir, '.next'), { recursive: true });
  fs.mkdirSync(path.join(walkDir, '.windsurf/skills/pixelcraft-review'), { recursive: true });
  fs.mkdirSync(path.join(walkDir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(walkDir, '.next', 'ignored.css'), 'button:focus { outline: none; }\n');
  fs.writeFileSync(path.join(walkDir, '.windsurf/skills/pixelcraft-review', 'ignored.css'), 'button:focus { outline: none; }\n');
  fs.writeFileSync(path.join(walkDir, 'src', 'app.pcss'), 'button:focus-visible { outline-width: 0; }\n');
  const walkRes = runPath(walkDir);
  assert.equal(walkRes.findings.length, 1);
  assert.equal(walkRes.findings[0].file.replace(/\\/g, '/'), 'src/app.pcss');
  console.log('ok 6 - directory scan includes expanded extensions and skips build directories and installed skill hosts');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

