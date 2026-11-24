import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help')) {
  console.log('Usage: npm run test:distribution -- [--release]');
  process.exit(0);
}

const root = fileURLToPath(new URL('..', import.meta.url));
const json = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const pkg = json('package.json');
const portable = json('plugin.json');
const claudeCatalog = json('.claude-plugin/marketplace.json');
const codexCatalog = json('.agents/plugins/marketplace.json');
const gemini = json('gemini-extension.json');
const skillDirectories = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, 'skills', entry.name, 'SKILL.md')))
  .map((entry) => `./skills/${entry.name}`)
  .sort();

assert.equal(claudeCatalog.plugins.length, 1);
const [claude] = claudeCatalog.plugins;
for (const manifest of [portable, claude, gemini]) {
  assert.equal(manifest.name, 'pixelcraft');
  assert.equal(manifest.version, pkg.version);
}
assert.equal(claude.source, './');
assert.equal(claude.strict, false);
assert.deepEqual([...claude.skills].sort(), skillDirectories);
assert.ok(!fs.existsSync(path.join(root, '.claude-plugin/plugin.json')), 'the inline Claude marketplace entry must be the only Claude plugin manifest');
assert.equal(codexCatalog.plugins[0].name, portable.name);
assert.equal(codexCatalog.plugins[0].source.source, 'local');
assert.equal(path.resolve(root, codexCatalog.plugins[0].source.path), path.resolve(root));
assert.deepEqual(pkg.pi.skills, ['./skills']);
console.log('ok - native manifests share the canonical skill root and package version');

if (process.argv.includes('--release')) {
  assert.equal(process.env.GITHUB_REF, `refs/tags/v${pkg.version}`, 'the release tag must match package.json');
}

const packArgs = ['pack', '--dry-run', '--json'];
const npmCli = process.env.npm_execpath;
const [pack] = JSON.parse(execFileSync(npmCli ? process.execPath : 'npm', npmCli ? [npmCli, ...packArgs] : packArgs, {
  cwd: root,
  encoding: 'utf8',
}));
assert.equal(pack.name, 'pixelcraft');
const files = new Set(pack.files.map((entry) => entry.path));
for (const expected of ['package.json', pkg.bin.pixelcraft, 'plugin.json', 'gemini-extension.json',
  '.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json', 'assets/pixelcraft-logo-512.png']) {
  assert.ok(files.has(expected), `missing from npm package: ${expected}`);
}
for (const directory of skillDirectories) {
  const skill = `${directory.slice(2)}/SKILL.md`;
  assert.ok(files.has(skill), `missing from npm package: ${skill}`);
}
console.log(`ok - npm pack --dry-run includes the CLI, host manifests, and canonical skills for ${pack.name}@${pack.version}`);
