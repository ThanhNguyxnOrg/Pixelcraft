import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help')) {
  console.log('Usage: node scripts/test-slop-scan.mjs');
  process.exit(0);
}

const base = new URL('../skills/pixelcraft-review/scripts/', import.meta.url);
const local = (relative) => fileURLToPath(new URL(relative, base));
const run = (file, ...args) => {
  const result = spawnSync(process.execPath, [local('slop-scan.mjs'), local(`fixtures/${file}`), '--json', ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
};
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
