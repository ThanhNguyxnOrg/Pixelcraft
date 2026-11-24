import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluateEvidence } from '../skills/pixelcraft-visual-qa/scripts/finish-gate.mjs';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-finish-gate.mjs');
  process.exit(0);
}

const evidence = { result: 'pass', label: 'rendered', method: 'local sandbox', expected: 'expected value', observed: 'actual value', artifact: 'evidence.txt' };
const excluded = { applies: false, reason: 'Interface has no animation or alternative theme' };
const manifest = {
  schemaVersion: 1, surface: 'responsive-web', target: '/search', revision: 'abc', task: 'Search products', fixture: 'local sandbox',
  applicability: { error: true, empty: true, loading: true, theme: excluded, 'reduced-motion': excluded, 'reflow-320': true },
  layoutMatrix: {
    'layout-landscape': { width: 844, height: 390 },
    'layout-short-height': { width: 1280, height: 480 },
  },
  checks: {
    outcome: { ...evidence, assertion: 'Results refresh to one matching item' },
    input: { ...evidence, modality: 'keyboard', focus: 'Tab visibly focuses search, then submit' },
    ...Object.fromEntries([390, 768, 1440].map((width) => [`width-${width}`, { ...evidence, width }])),
    'layout-landscape': { ...evidence, width: 844, height: 390 },
    'layout-short-height': { ...evidence, width: 1280, height: 480, artifact: 'before.txt' },
    'reflow-320': { ...evidence, width: 320 }, error: evidence, empty: evidence, loading: evidence,
  },
  rounds: [],
};
const hasArtifact = (value) => ['evidence.txt', 'before.txt'].includes(value);
assert.equal(evaluateEvidence(manifest, hasArtifact).status, 'PASS');
const missing = { ...manifest, checks: { ...manifest.checks, outcome: evidence, input: { ...manifest.checks.input, label: 'static' }, 'reflow-320': { ...evidence, width: 390 }, loading: { result: 'not-checked', reason: 'Sandbox offline' } } };
const unchecked = evaluateEvidence(missing, hasArtifact);
assert.equal(unchecked.status, 'NOT CHECKED');
assert.deepEqual(Object.keys(unchecked.notChecked), ['outcome', 'input', 'loading', 'reflow-320']);
assert.equal(unchecked.notChecked.loading, 'Sandbox offline');
assert.equal(evaluateEvidence({ ...manifest, applicability: {} }, hasArtifact).status, 'NOT CHECKED');
assert.equal(evaluateEvidence({ ...manifest, checks: { ...manifest.checks, error: { ...evidence, artifact: 'missing' } } }, hasArtifact).status, 'NOT CHECKED');
assert.equal(evaluateEvidence({ ...manifest, surface: 'other', layoutMatrix: undefined, checks: { outcome: manifest.checks.outcome, layout: evidence, input: { ...evidence, focus: 'controller focus ring' }, error: evidence, empty: evidence, loading: evidence } }, hasArtifact).status, 'PASS');
console.log('ok 1 - finish gate requires task, focus, responsive and applicable state evidence');

const failed = { ...manifest, checks: { ...manifest.checks, 'critical-overflow': { ...evidence, result: 'fail' } } };
const round = { failure: 'critical-overflow', reproduction: 'Submit clipped at 390', change: 'Reflow actions', rerun: 'Still clipped on longer locale', before: 'before.txt', after: 'evidence.txt' };
assert.equal(evaluateEvidence({ ...failed, rounds: [round, round] }, hasArtifact).status, 'FAIL');
const open = evaluateEvidence({ ...failed, rounds: [round, round, round] }, hasArtifact);
assert.equal(open.status, 'OPEN');
assert.equal(open.failures['critical-overflow'].artifact, 'evidence.txt');
assert.throws(() => evaluateEvidence({ ...failed, rounds: [round, round, round, round] }, hasArtifact), /at most three/);
const omittedRerun = evaluateEvidence({ ...manifest, rounds: [round, round, round] }, hasArtifact);
assert.equal(omittedRerun.status, 'NOT CHECKED');
assert.ok(omittedRerun.notChecked['critical-overflow']);
const repaired = { ...manifest, checks: { ...manifest.checks, 'critical-overflow': evidence }, rounds: [round, round, round] };
assert.equal(evaluateEvidence(repaired, hasArtifact).status, 'PASS');
const skippedRerun = evaluateEvidence({ ...manifest, rounds: [{ ...round, failure: 'theme' }] }, hasArtifact);
assert.equal(skippedRerun.status, 'NOT CHECKED');
assert.ok(skippedRerun.notChecked.theme);
assert.ok(!Object.hasOwn(skippedRerun.notApplicable, 'theme'));
assert.throws(() => evaluateEvidence({ ...failed, rounds: [{ ...round, after: 'before.txt' }] }, hasArtifact), /distinct before\/after/);
console.log('ok 2 - gate keeps confirmed failures open after three rounds and requires rerun evidence');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-gate-test-'));
try {
  const file = path.join(dir, 'manifest.json');
  const cli = fileURLToPath(new URL('../skills/pixelcraft-visual-qa/scripts/finish-gate.mjs', import.meta.url));
  const run = (input) => {
    fs.writeFileSync(file, JSON.stringify(input));
    return spawnSync(process.execPath, [cli, file], { encoding: 'utf8' });
  };
  fs.writeFileSync(path.join(dir, 'evidence.txt'), 'sandbox trace');
  fs.writeFileSync(path.join(dir, 'before.txt'), 'prior sandbox trace');
  const good = run(manifest);
  assert.equal(good.status, 0, good.stderr);
  assert.equal(JSON.parse(good.stdout).status, 'PASS');
  const bad = run({ ...failed, rounds: [round, round, round] });
  assert.equal(bad.status, 1, bad.stderr);
  assert.equal(JSON.parse(bad.stdout).status, 'OPEN');
  const external = run({ ...manifest, checks: { ...manifest.checks, error: { ...evidence, artifact: cli } } });
  assert.equal(external.status, 2, external.stderr);
  assert.equal(JSON.parse(external.stdout).status, 'NOT CHECKED');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
console.log('ok 3 - gate exits nonzero for open or unchecked scope and rejects external artifacts');

const widthDefect = { ...evidence, result: 'fail', width: 390 };
const scopedRound = { ...round, failure: 'width-390-submit' };
const scopedDefect = { ...manifest, rounds: [scopedRound, scopedRound, scopedRound],
  checks: { ...manifest.checks, 'width-390-submit': widthDefect } };
const scopedOpen = evaluateEvidence(scopedDefect, hasArtifact);
assert.equal(scopedOpen.status, 'OPEN');
assert.equal(scopedOpen.failures['width-390-submit'].artifact, 'evidence.txt');
const wrongWidth = evaluateEvidence({ ...scopedDefect,
  checks: { ...scopedDefect.checks, 'width-390-submit': { ...widthDefect, width: 768 } } }, hasArtifact);
assert.equal(wrongWidth.status, 'NOT CHECKED');
assert.ok(wrongWidth.notChecked['width-390-submit']);
console.log('ok 4 - width-scoped defect IDs require the viewport encoded in their prefix');

const malformedWidth = evaluateEvidence({ ...manifest, checks: { ...manifest.checks,
  'width-390px-submit': { ...evidence, width: 768 } } }, hasArtifact);
assert.equal(malformedWidth.status, 'NOT CHECKED');
assert.ok(malformedWidth.notChecked['width-390px-submit']);
console.log('ok 5 - malformed width IDs cannot bypass viewport validation');

const adaptive = { ...manifest, layoutMatrix: { ...manifest.layoutMatrix, 'layout-ultrawide': { width: 2560, height: 1080 } } };
const omittedMatrix = evaluateEvidence({ ...manifest, layoutMatrix: undefined }, hasArtifact);
assert.equal(omittedMatrix.status, 'NOT CHECKED');
assert.deepEqual(Object.keys(omittedMatrix.notChecked), ['layout-landscape', 'layout-short-height']);
const uncheckedClass = evaluateEvidence(adaptive, hasArtifact);
assert.equal(uncheckedClass.status, 'NOT CHECKED');
assert.ok(uncheckedClass.notChecked['layout-ultrawide']);
const wrongHeight = evaluateEvidence({ ...manifest, checks: {
  ...manifest.checks, 'layout-short-height': { ...manifest.checks['layout-short-height'], height: 900 },
} }, hasArtifact);
assert.equal(wrongHeight.status, 'NOT CHECKED');
assert.ok(wrongHeight.notChecked['layout-short-height']);
const excludedClass = evaluateEvidence({ ...adaptive, layoutMatrix: {
  ...adaptive.layoutMatrix, 'layout-ultrawide': { applies: false, reason: 'This product is limited to the embedded host window' },
} }, hasArtifact);
assert.equal(excludedClass.status, 'PASS');
assert.ok(excludedClass.notApplicable['layout-ultrawide']);
console.log('ok 6 - responsive evidence requires landscape, short height, and every declared layout at matching dimensions');

const desktop = { ...manifest.checks['width-1440'], height: 900 };
const desktopAsShort = evaluateEvidence({
  ...manifest,
  layoutMatrix: { ...manifest.layoutMatrix, 'layout-short-height': { width: 1440, height: 900 } },
  checks: { ...manifest.checks, 'width-1440': desktop, 'layout-short-height': desktop },
}, hasArtifact);
assert.equal(desktopAsShort.status, 'NOT CHECKED');
assert.match(desktopAsShort.notChecked['layout-short-height'], /below 600 CSS px/);
for (const [height, status] of [[600, 'NOT CHECKED'], [599, 'PASS']]) {
  const atBoundary = evaluateEvidence({
    ...manifest,
    layoutMatrix: { ...manifest.layoutMatrix, 'layout-short-height': { width: 1440, height } },
    checks: { ...manifest.checks, 'layout-short-height': { ...manifest.checks['layout-short-height'], width: 1440, height } },
  }, hasArtifact);
  assert.equal(atBoundary.status, status);
}
const reusesDesktopArtifact = evaluateEvidence({
  ...manifest,
  checks: { ...manifest.checks, 'layout-short-height': { ...manifest.checks['layout-short-height'], artifact: './evidence.txt' } },
}, (artifact) => hasArtifact(artifact.replace(/^\.\//, '')));
assert.equal(reusesDesktopArtifact.status, 'NOT CHECKED');
assert.match(reusesDesktopArtifact.notChecked['layout-short-height'], /separate artifact/);
console.log('ok 7 - regular desktop evidence cannot satisfy the short-height check');

const extendedMissing = evaluateEvidence({
  ...manifest,
  applicability: {
    ...manifest.applicability,
    i18n: true,
    'forced-colors': true,
    'text-scale-200': { applies: false, reason: 'Fixed terminal grid has no browser text zoom' },
    locale: { applies: false },
  },
}, hasArtifact);
assert.equal(extendedMissing.status, 'NOT CHECKED');
assert.ok(extendedMissing.notChecked.i18n);
assert.ok(extendedMissing.notChecked['forced-colors']);
assert.ok(extendedMissing.notChecked.locale);
assert.equal(extendedMissing.notApplicable['text-scale-200'], 'Fixed terminal grid has no browser text zoom');

const extendedPassing = evaluateEvidence({
  ...manifest,
  applicability: {
    ...manifest.applicability,
    i18n: true,
    'forced-colors': true,
    'text-scale-200': true,
    locale: { applies: false, reason: 'Covered by i18n check' },
  },
  checks: {
    ...manifest.checks,
    i18n: evidence,
    'forced-colors': evidence,
    'text-scale-200': evidence,
  },
}, hasArtifact);
assert.equal(extendedPassing.status, 'PASS');
assert.equal(extendedPassing.notApplicable.locale, 'Covered by i18n check');
console.log('ok 8 - declared extended optional keys (i18n, locale, forced-colors, text-scale-200) are enforced without breaking v1 manifests');
