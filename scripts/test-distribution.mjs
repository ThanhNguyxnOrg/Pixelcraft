import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

if (process.argv.includes('--help')) {
  console.log('Usage: npm run test:distribution -- [--release]');
  process.exit(0);
}

const root = fileURLToPath(new URL('..', import.meta.url));
const json = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const pkg = json('package.json');
const portable = json('plugin.json');
const claudeCatalog = json('.claude-plugin/marketplace.json');
const claudePlugin = json('.claude-plugin/plugin.json');
const cursorPlugin = json('.cursor-plugin/plugin.json');
const cursorCatalog = json('.cursor-plugin/marketplace.json');
const antigravityPlugin = json('.antigravity-plugin/plugin.json');
const codexPlugin = json('.codex-plugin/plugin.json');
const codexCatalog = json('.agents/plugins/marketplace.json');
const copilotCatalog = json('.github/plugin/marketplace.json');
const devinPlugin = json('.devin-plugin/plugin.json');
const gemini = json('gemini-extension.json');
const skillDirectories = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, 'skills', entry.name, 'SKILL.md')))
  .map((entry) => `./skills/${entry.name}`)
  .sort();

assert.equal(claudeCatalog.plugins.length, 1);
const [claude] = claudeCatalog.plugins;
for (const manifest of [
  portable,
  claude,
  claudePlugin,
  cursorPlugin,
  antigravityPlugin,
  codexPlugin,
  devinPlugin,
  gemini,
]) {
  assert.equal(manifest.name, 'pixelcraft');
  assert.equal(manifest.version, pkg.version);
}
assert.equal(claude.source, './');
assert.equal(claude.strict, undefined);
assert.equal(claude.skills, undefined, 'Claude discovers the canonical skills/ directory from the plugin root');
assert.equal(claudePlugin.icon, undefined, 'Claude plugin manifest must omit directory-only icon for Cowork sync');

// Agent Plugins 1.0.0 closed top-level schema check
assert.equal(portable.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
const allowedAgentPluginKeys = new Set([
  '$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions',
]);
for (const key of Object.keys(portable)) {
  assert.ok(allowedAgentPluginKeys.has(key), `unexpected top-level key in plugin.json: ${key}`);
}

// Antigravity strict JSON schema check (https://antigravity.google/schemas/v1/plugin.json)
assert.equal(antigravityPlugin.$schema, 'https://antigravity.google/schemas/v1/plugin.json');
const allowedAntigravityKeys = new Set([
  '$schema', 'name', 'displayName', 'description', 'version', 'disabled', 'logo',
  'suggestedPrompts', 'skills', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions',
]);
for (const key of Object.keys(antigravityPlugin)) {
  assert.ok(allowedAntigravityKeys.has(key), `unexpected key in .antigravity-plugin/plugin.json: ${key}`);
}
assert.ok(antigravityPlugin.suggestedPrompts.length >= 1 && antigravityPlugin.suggestedPrompts.length <= 3);
assert.ok(fs.existsSync(path.join(root, antigravityPlugin.logo)), `missing antigravity logo: ${antigravityPlugin.logo}`);

// Cursor plugin & marketplace schema checks
assert.equal(cursorPlugin.skills, './skills/');
assert.ok(fs.existsSync(path.join(root, cursorPlugin.logo)), `missing cursor logo: ${cursorPlugin.logo}`);
assert.equal(cursorCatalog.name, 'pixelcraft');
assert.equal(cursorCatalog.metadata.version, pkg.version);
assert.equal(cursorCatalog.plugins[0].name, 'pixelcraft');
assert.equal(cursorCatalog.plugins[0].source, './');

// Codex plugin & .agents marketplace checks
assert.equal(codexPlugin.skills, './skills/');
assert.equal(codexPlugin.interface.displayName, codexCatalog.interface.displayName);
assert.ok(fs.existsSync(path.join(root, codexPlugin.interface.logo)), `missing codex logo: ${codexPlugin.interface.logo}`);
assert.ok(fs.existsSync(path.join(root, codexPlugin.interface.composerIcon)), `missing codex composerIcon: ${codexPlugin.interface.composerIcon}`);
assert.equal(codexCatalog.plugins[0].name, portable.name);
assert.equal(codexCatalog.plugins[0].source.source, 'local');
assert.equal(path.resolve(root, codexCatalog.plugins[0].source.path), path.resolve(root));
assert.equal(portable.extensions['com.openai'].interface.displayName, codexCatalog.interface.displayName);

// GitHub Copilot marketplace check
assert.equal(copilotCatalog.name, 'pixelcraft');
assert.equal(copilotCatalog.metadata.version, pkg.version);
assert.equal(copilotCatalog.plugins[0].name, 'pixelcraft');
assert.equal(copilotCatalog.plugins[0].version, pkg.version);
assert.equal(copilotCatalog.plugins[0].source, './');

// Gemini CLI extension contextFileName check
assert.equal(gemini.contextFileName, 'GEMINI.md');
assert.ok(fs.existsSync(path.join(root, gemini.contextFileName)), 'missing GEMINI.md');

assert.deepEqual(pkg.pi.skills, ['./skills']);
console.log('ok - all native multi-platform manifests share the canonical skill root, strict schema fields, and package version');

if (process.argv.includes('--release')) {
  assert.equal(process.env.GITHUB_REF, `refs/tags/v${pkg.version}`, 'the release tag must match package.json');
}

const packArgs = ['pack', '--dry-run', '--json'];
const npmCli = process.env.npm_execpath;
const rawPack = JSON.parse(execFileSync(npmCli ? process.execPath : 'npm', npmCli ? [npmCli, ...packArgs] : packArgs, {
  cwd: root,
  encoding: 'utf8',
}));
const pack = Array.isArray(rawPack) ? rawPack[0] : (rawPack.files ? rawPack : rawPack[pkg.name] || Object.values(rawPack)[0]);
assert.equal(pack.name, '@thanhnguyxn/pixelcraft');
assert.equal(pkg.publishConfig.access, 'public');
assert.deepEqual(pkg.bin, { pixelcraft: 'bin/pixelcraft.mjs' });
const files = new Set(pack.files.map((entry) => entry.path));
for (const expected of [
  'package.json',
  pkg.bin.pixelcraft,
  'plugin.json',
  'gemini-extension.json',
  'GEMINI.md',
  'scripts/build-skill-zips.mjs',
  '.claude-plugin/marketplace.json',
  '.claude-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.cursor-plugin/marketplace.json',
  '.antigravity-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  '.agents/plugins/marketplace.json',
  '.github/plugin/marketplace.json',
  '.devin-plugin/plugin.json',
  'assets/pixelcraft-logo-128.png',
  'assets/pixelcraft-logo-256.png',
  'assets/pixelcraft-logo-512.png',
]) {
  assert.ok(files.has(expected), `missing from npm package: ${expected}`);
}
for (const directory of skillDirectories) {
  const skill = `${directory.slice(2)}/SKILL.md`;
  assert.ok(files.has(skill), `missing from npm package: ${skill}`);
}
console.log(`ok - npm pack --dry-run includes the CLI, all multi-platform host manifests, and canonical skills for ${pack.name}@${pack.version}`);

function countFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).reduce((count, entry) =>
    count + (entry.isDirectory() ? countFiles(path.join(folder, entry.name)) : Number(entry.isFile())), 0);
}

const output = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-skill-zips-'));
try {
  execFileSync(process.execPath, [path.join(root, 'scripts/build-skill-zips.mjs'), '--out', output]);
  assert.deepEqual(fs.readdirSync(output).sort(), skillDirectories.map((directory) => `${path.basename(directory)}.zip`).sort());
  for (const directory of skillDirectories) {
    const folder = path.basename(directory);
    const zip = fs.readFileSync(path.join(output, `${folder}.zip`));
    const end = zip.length - 22;
    assert.equal(zip.readUInt32LE(end), 0x06054b50);
    let cursor = zip.readUInt32LE(end + 16);
    const entries = new Set();
    for (let n = 0; n < zip.readUInt16LE(end + 10); n++) {
      assert.equal(zip.readUInt32LE(cursor), 0x02014b50);
      const nameLength = zip.readUInt16LE(cursor + 28);
      const name = zip.toString('utf8', cursor + 46, cursor + 46 + nameLength);
      assert.ok(name.startsWith(`${folder}/`) && !name.split('/').includes('..') && !entries.has(name), name);
      entries.add(name);
      const local = zip.readUInt32LE(cursor + 42);
      const start = local + 30 + zip.readUInt16LE(local + 26);
      assert.deepEqual(inflateRawSync(zip.subarray(start, start + zip.readUInt32LE(cursor + 20))),
        fs.readFileSync(path.join(root, 'skills', name)), name);
      cursor += 46 + nameLength;
    }
    assert.equal(entries.size, countFiles(path.join(root, directory)));
    assert.ok(entries.has(`${folder}/SKILL.md`));
  }
  console.log(`ok - all ${skillDirectories.length} upload ZIPs contain one canonical skill and all its bundled files`);
} finally {
  fs.rmSync(output, { recursive: true, force: true });
}

const checkout = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-default-builds-'));
try {
  fs.cpSync(path.join(root, 'skills'), path.join(checkout, 'skills'), { recursive: true });
  fs.cpSync(path.join(root, 'scripts'), path.join(checkout, 'scripts'), { recursive: true });
  const run = (script) => execFileSync(process.execPath, [path.join(checkout, 'scripts', script)]);
  run('build-skill-zips.mjs');
  const archive = path.join(checkout, 'skill-zips', 'pixelcraft.zip');
  const original = fs.readFileSync(archive);
  run('build-adapters.mjs');
  run('build-adapters.mjs');
  assert.deepEqual(fs.readFileSync(archive), original);
  fs.rmSync(path.dirname(archive), { recursive: true });
  run('build-skill-zips.mjs');
  assert.deepEqual(fs.readFileSync(archive), original);
  assert.ok(fs.existsSync(path.join(checkout, 'dist', 'manifest.json')));
  console.log('ok - default skill ZIPs and adapters can build in either order and survive adapter rebuilds');
} finally {
  fs.rmSync(checkout, { recursive: true, force: true });
}
