#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const optional = ['error', 'empty', 'loading', 'theme', 'reduced-motion', 'reflow-320'];
const interfaces = ['responsive-web', 'other'];
const present = (value) => typeof value === 'string' && Boolean(value.trim());
const record = (value) => value && typeof value === 'object' && !Array.isArray(value);

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
  for (const id of optional) {
    if (id === 'reflow-320' && !web) continue;
    const applicability = manifest.applicability[id];
    if (applicability === true) required.push(id);
    else if (record(applicability) && applicability.applies === false && present(applicability.reason)) {
      skipped.set(id, applicability.reason);
    } else notChecked.set(id, 'Applicability must be decided before verification.');
  }

  if (manifest.rounds.length > 3) throw new Error('at most three repair rounds are allowed');
  for (const round of manifest.rounds) {
    if (!record(round) || ![round.failure, round.reproduction, round.change, round.rerun].every(present)
        || !hasArtifact(round.before) || !hasArtifact(round.after)
        || round.before === round.after) {
      throw new Error('every repair round needs a failure, reproduction, change, rerun and distinct before/after artifacts');
    }
  }

  for (const id of new Set([...required, ...Object.keys(manifest.checks)])) {
    const entry = manifest.checks[id];
    if (skipped.has(id) && entry?.result !== 'fail') continue;
    if (!record(entry) || !['pass', 'fail'].includes(entry.result) || entry.label !== 'rendered'
        || ![entry.method, entry.expected, entry.observed].every(present) || !hasArtifact(entry.artifact)
        || (id === 'outcome' && !present(entry.assertion))
        || (id === 'input' && !present(entry.focus))
        || (web && id === 'input' && entry.modality !== 'keyboard')
        || (/^width-|^reflow-320$/.test(id) && entry.width !== Number(id.split('-').at(-1)))) {
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
