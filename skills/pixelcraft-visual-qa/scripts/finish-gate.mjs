#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const optional = ['error', 'empty', 'loading', 'theme', 'reduced-motion', 'reflow-320'];
const extendedOptional = ['i18n', 'locale', 'forced-colors', 'text-scale-200'];
const interfaces = ['responsive-web', 'other'];
const shortHeightLayout = 'layout-short-height';
const shortHeightLimit = 600;
const webLayoutClasses = ['layout-landscape', shortHeightLayout];
const present = (value) => typeof value === 'string' && Boolean(value.trim());
const record = (value) => value && typeof value === 'object' && !Array.isArray(value);
const dimension = (value) => Number.isSafeInteger(value) && value > 0;

export function evaluateEvidence(manifest, hasArtifact) {
  if (!record(manifest) || manifest.schemaVersion !== 1 || !interfaces.includes(manifest.surface)
      || ![manifest.target, manifest.revision, manifest.task, manifest.fixture].every(present)
      || !record(manifest.applicability) || !record(manifest.checks) || !Array.isArray(manifest.rounds)) {
    throw new Error('expected schemaVersion 1, surface, target, revision, task, fixture, applicability, checks and rounds');
  }
  const web = manifest.surface === 'responsive-web';
  const required = ['outcome', 'input', ...(web ? ['width-390', 'width-768', 'width-1440'] : ['layout'])];
  const notChecked = new Map();
  const failures = new Map();
  const skipped = new Map();
  const applyOptionalDecision = (id) => {
    const applicability = manifest.applicability[id];
    if (applicability === true) required.push(id);
    else if (record(applicability) && applicability.applies === false && present(applicability.reason)) {
      skipped.set(id, applicability.reason);
    } else notChecked.set(id, 'Applicability must be decided before verification.');
  };
  for (const id of optional) {
    if (id === 'reflow-320' && !web) continue;
    applyOptionalDecision(id);
  }
  for (const id of extendedOptional) {
    if (!Object.hasOwn(manifest.applicability, id)) continue;
    applyOptionalDecision(id);
  }

  const layouts = record(manifest.layoutMatrix) ? manifest.layoutMatrix : {};
  const expectedLayouts = new Map();
  for (const id of new Set([...(web ? webLayoutClasses : []), ...Object.keys(layouts)])) {
    const layout = layouts[id];
    if (!/^layout-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      notChecked.set(id, 'Use layout-<class> for layout matrix IDs.');
    } else if (record(layout) && layout.applies === false && present(layout.reason)) {
      skipped.set(id, layout.reason);
    } else if (web && id === shortHeightLayout && dimension(layout?.height) && layout.height >= shortHeightLimit) {
      notChecked.set(id, `Short-height evidence must use a viewport below ${shortHeightLimit} CSS px tall.`);
    } else if (record(layout) && layout.applies !== false
        && dimension(layout.width) && dimension(layout.height)
        && (id !== 'layout-landscape' || layout.width > layout.height)) {
      required.push(id);
      expectedLayouts.set(id, layout);
    } else {
      notChecked.set(id, 'Declare positive layout width and height (landscape must be wider than tall), or a reason it does not apply.');
    }
  }

  if (manifest.rounds.length > 3) throw new Error('at most three repair rounds are allowed');
  const repaired = new Set();
  for (const round of manifest.rounds) {
    if (!record(round) || ![round.failure, round.reproduction, round.change, round.rerun].every(present)
        || !hasArtifact(round.before) || !hasArtifact(round.after)
        || round.before === round.after) {
      throw new Error('every repair round needs a failure, reproduction, change, rerun and distinct before/after artifacts');
    }
    repaired.add(round.failure);
    skipped.delete(round.failure);
  }

  const desktopArtifact = manifest.checks['width-1440']?.artifact;
  for (const id of new Set([...required, ...repaired, ...Object.keys(manifest.checks)])) {
    const entry = Object.hasOwn(manifest.checks, id) ? manifest.checks[id] : undefined;
    if (skipped.has(id) && entry?.result !== 'fail') continue;
    const width = id === 'reflow-320' ? 320 : Number(/^width-([1-9]\d*)(?:-.+)?$/.exec(id)?.[1]);
    const layout = expectedLayouts.get(id);
    if (id.startsWith('width-') && !Number.isSafeInteger(width)) {
      notChecked.set(id, 'Invalid width check ID; use width-<px> or width-<px>-<defect>.');
      continue;
    }
    if (web && layout && id === shortHeightLayout && present(entry?.artifact) && present(desktopArtifact)
        && path.normalize(entry.artifact) === path.normalize(desktopArtifact)) {
      notChecked.set(id, 'Short-height evidence must use a separate artifact from width-1440.');
      continue;
    }
    if (!record(entry) || !['pass', 'fail'].includes(entry.result) || entry.label !== 'rendered'
        || ![entry.method, entry.expected, entry.observed].every(present) || !hasArtifact(entry.artifact)
        || (id === 'outcome' && !present(entry.assertion))
        || (id === 'input' && !present(entry.focus))
        || (web && id === 'input' && entry.modality !== 'keyboard')
        || (Number.isSafeInteger(width) && entry.width !== width)
        || (layout && (entry.width !== layout.width || entry.height !== layout.height))) {
      notChecked.set(id, present(entry?.reason) ? entry.reason : 'Missing required rendered evidence or assertion.');
    } else if (entry.result === 'fail') {
      skipped.delete(id);
      failures.set(id, { expected: entry.expected, observed: entry.observed, artifact: entry.artifact });
    }
  }

  const status = failures.size ? (manifest.rounds.length === 3 ? 'OPEN' : 'FAIL')
    : notChecked.size ? 'NOT CHECKED' : 'PASS';
  return { status, rounds: manifest.rounds.length, failures: Object.fromEntries(failures),
    notChecked: Object.fromEntries(notChecked), notApplicable: Object.fromEntries(skipped) };
}

function main(args) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node finish-gate.mjs <evidence.json>\nChecks evidence completeness; exit 0 PASS, 1 FAIL/OPEN, 2 NOT CHECKED or invalid input.');
    return;
  }
  if (args.length !== 1) throw new Error('provide one evidence manifest; see --help');
  const file = path.resolve(args[0]);
  const root = path.dirname(file);
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hasArtifact = (relative) => {
    if (!present(relative) || path.isAbsolute(relative)) return false;
    try {
      const resolved = fs.realpathSync(path.resolve(root, relative));
      const local = path.relative(fs.realpathSync(root), resolved);
      if (!local || local === '..' || local.startsWith(`..${path.sep}`) || path.isAbsolute(local)) return false;
      const stat = fs.statSync(resolved);
      return stat.isFile() && stat.size > 0;
    } catch {
      return false;
    }
  };
  const result = evaluateEvidence(manifest, hasArtifact);
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = { PASS: 0, FAIL: 1, OPEN: 1, 'NOT CHECKED': 2 }[result.status];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`finish-gate: ${error.message}`);
    process.exitCode = 2;
  }
}
