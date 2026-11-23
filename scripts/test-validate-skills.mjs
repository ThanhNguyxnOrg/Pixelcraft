#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validatorSource = path.join(root, 'scripts/validate-skills.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-validator-test-'));
const validator = path.join(tmp, 'scripts/validate-skills.mjs');
const skillDir = path.join(tmp, 'skills/case');
const skillFile = path.join(skillDir, 'SKILL.md');

fs.mkdirSync(path.dirname(validator), { recursive: true });
fs.mkdirSync(skillDir, { recursive: true });
fs.mkdirSync(path.join(tmp, 'evals'), { recursive: true });
fs.copyFileSync(validatorSource, validator);
fs.writeFileSync(path.join(tmp, 'evals/case.md'), '# Evaluation\n\n## Case\n\nPrompt.\n');
fs.mkdirSync(path.join(tmp, 'evals/fixtures'), { recursive: true });
const validFixture = JSON.stringify({
  schemaVersion: 1,
  id: 'case-valid',
  skill: 'case',
  title: 'Valid fixture',
  contextSnapshot: {
    surface: 'settings',
    platform: 'web',
    mode: 'Operate',
    states: ['error'],
    constraints: ['keyboard only']
  },
  prompt: 'Verify the settings form.',
  expectedRouting: ['case'],
  forbiddenBehaviors: ['claims without evidence'],
  rubricDimensions: [
    { dimension: 'routing', pass: 'uses expected skill', fail: 'generic implementation' }
  ],
  negativeControls: [
    { name: 'build only', input: 'build passes without interaction', mustNot: 'claim rendered behavior' }
  ],
  baseline: { withoutSkill: 'generic output', withSkill: 'constrained behavior' }
}, null, 2);
fs.writeFileSync(path.join(tmp, 'evals/fixtures/case-valid.json'), `${validFixture}\n`);

function runValidator(frontmatter) {
  fs.writeFileSync(skillFile, `---\n${frontmatter}\n---\n\n# Case\n`);
  return spawnSync(process.execPath, [validator], { encoding: 'utf8' });
}

function expectFailure(frontmatter, pattern, label) {
  const result = runValidator(frontmatter);
  assert.notEqual(result.status, 0, `${label} unexpectedly passed`);
  assert.match(result.stderr, pattern, `${label} failed with unexpected message: ${result.stderr}`);
}

try {
  for (const indicator of ['|', '|-', '|+', '>', '>-', '>+', '|2-']) {
    const result = runValidator(`name: case\ndescription: ${indicator}\n  Handles block: scalar content\n  across multiple lines.\nmetadata:\n  version: 0.1.0\nlicense: MIT`);
    assert.equal(result.status, 0, `${indicator} failed: ${result.stderr}`);
  }
  console.log('ok 1 - literal and folded block scalars pass');

  const flow = runValidator('name: case\ndescription: Handles inline flow metadata\nmetadata: {version: 0.1.0, owner: validator-test, note: "safe: colon, with comma", plain_note: don\'t}\nlicense: MIT');
  assert.equal(flow.status, 0, flow.stderr);
  console.log('ok 2 - inline flow mappings pass');

  const comment = runValidator('name: case\ndescription: Handles YAML safely # trailing comment with: colon\nlicense: MIT');
  assert.equal(comment.status, 0, comment.stderr);
  const contraction = runValidator("name: case\ndescription: Don't break contractions # trailing comment with: colon\nlicense: MIT");
  assert.equal(contraction.status, 0, contraction.stderr);
  console.log('ok 3 - colon text inside trailing comments is ignored');

  expectFailure('name: case\ndescription: Invalid: plain scalar\nlicense: MIT', /contains ': '/, 'unsafe plain scalar');
  expectFailure('name: case\ndescription: @invalid\nlicense: MIT', /starts with YAML-special character/, 'reserved leading scalar');
  console.log('ok 4 - unsafe plain scalars still fail');

  expectFailure('name: case\ndescription: Handles metadata\nmetadata: {owner: bad: value}\nlicense: MIT', /contains ': '/, 'unsafe scalar inside flow mapping');
  console.log('ok 5 - unsafe plain scalars inside flow mappings fail');

  expectFailure('name: case\ndescription: |\n  Handles correct indentation.\n orphaned continuation\nlicense: MIT', /no owning block or mapping/, 'under-indented block scalar leftover');
  console.log('ok 6 - unconsumed indented frontmatter lines fail');

  const scalarCases = [
    ['name: [case]\ndescription: Handles YAML\nlicense: MIT', 'flow-sequence name'],
    ['name: case\ndescription: [one, two]\nlicense: MIT', 'flow-sequence description'],
    ['name: {value: case}\ndescription: Handles YAML\nlicense: MIT', 'flow-mapping name'],
    ['name: case\ndescription: {topic: test}\nlicense: MIT', 'flow-mapping description'],
    ['name:\n  - case\ndescription: Handles YAML\nlicense: MIT', 'block-sequence name'],
    ['name: case\ndescription:\n  - one\n  - two\nlicense: MIT', 'block-sequence description'],
    ['name:\n  value: case\ndescription: Handles YAML\nlicense: MIT', 'block-mapping name'],
    ['name: case\ndescription:\n  topic: test\nlicense: MIT', 'block-mapping description'],
    ['name:\ndescription: Handles YAML\nlicense: MIT', 'null name'],
    ['name: case\ndescription:\nlicense: MIT', 'null description']
  ];
  for (const [frontmatter, label] of scalarCases) {
    expectFailure(frontmatter, /must be a scalar string/, label);
  }
  console.log('ok 7 - name and description must be scalar strings');

  const validEvalRun = runValidator('name: case\ndescription: Handles YAML\nlicense: MIT');
  assert.equal(validEvalRun.status, 0, validEvalRun.stderr);
  console.log('ok 8 - valid evaluation fixture passes');

  const brokenFixture = JSON.parse(validFixture);
  brokenFixture.id = 'case-broken';
  delete brokenFixture.negativeControls;
  fs.writeFileSync(path.join(tmp, 'evals/fixtures/case-broken.json'), `${JSON.stringify(brokenFixture, null, 2)}\n`);
  expectFailure('name: case\ndescription: Handles YAML\nlicense: MIT', /negativeControls must be a nonempty array/, 'missing negative controls');
  fs.rmSync(path.join(tmp, 'evals/fixtures/case-broken.json'));
  console.log('ok 9 - evaluation fixture negative controls are required');

  console.log('validator YAML tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
