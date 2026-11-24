import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-installers.mjs [--shell|--powershell]');
  process.exit(0);
}

const root = fileURLToPath(new URL('..', import.meta.url));
const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-installers-'));
const run = (command, args, cwd = destination, env = process.env) => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 30000, env });
  assert.equal(result.status, 0, result.error?.message ?? result.stderr);
  return result.stdout;
};
const assertGuidance = (command, args, flag) => {
  assert.doesNotMatch(run(command, args), /context7/i);
  const output = run(command, [...args, flag]);
  assert.match(output, /dry-run: .*pixelcraft-plan/);
  assert.match(output, /https:\/\/github\.com\/upstash\/context7#readme/);
  assert.deepEqual(fs.readdirSync(destination), []);
};
const harnesses = 'kiro,cline,roo,droid,antigravity,goose,amp,zed';
const assertHarnessPaths = (output) => {
  const portableOutput = output.replaceAll('\\', '/');
  for (const prefix of ['.kiro/skills', '.cline/skills', '.roo/skills', '.factory/skills', '.agents/skills']) {
    assert.ok(portableOutput.includes(`/${prefix}/pixelcraft-plan`), prefix);
  }
  assert.ok(portableOutput.includes('/.kiro/steering/pixelcraft.md'));
  assert.equal(portableOutput.split('/.agents/skills/pixelcraft-plan').length, 2);
  assert.deepEqual(fs.readdirSync(destination), []);
};

const expandedGlobExts = ['mjml', 'typ', 'tex', 'uxml', 'uss', 'gd', 'tscn', 'qml', 'xaml', 'cpp', 'h', 'glsl', 'wgsl', 'mdx', 'razor', 'heex', 'erb', 'templ', 'tcss', 'qss', 'r', 'jl'];

function assertProjectAdapterParity(projectDir) {
  const cursorRule = fs.readFileSync(path.join(projectDir, '.cursor/rules/pixelcraft.mdc'), 'utf8');
  assert.ok(cursorRule.includes('.cursor/skills'), 'cursor rule should reference project-relative .cursor/skills');
  assert.ok(!cursorRule.includes(projectDir), 'cursor rule must not leak absolute workspace path');

  const copilotInstructions = fs.readFileSync(path.join(projectDir, '.github/copilot-instructions.md'), 'utf8');
  assert.ok(copilotInstructions.includes('<!-- pixelcraft:start -->'));
  assert.ok(copilotInstructions.includes('<!-- pixelcraft:end -->'));
  assert.ok(copilotInstructions.includes('.github/skills'));
  assert.ok(!copilotInstructions.includes(projectDir), 'copilot instructions must not leak absolute workspace path');
  assert.ok(copilotInstructions.includes('Existing user note'), 'managed upsert must preserve existing user instructions');

  const copilotPath = fs.readFileSync(path.join(projectDir, '.github/instructions/pixelcraft.instructions.md'), 'utf8');
  for (const ext of expandedGlobExts) {
    assert.ok(copilotPath.includes(ext), `missing ${ext} in Copilot applyTo glob`);
  }

  const windsurfRule = fs.readFileSync(path.join(projectDir, '.windsurf/rules/pixelcraft.md'), 'utf8');
  assert.ok(windsurfRule.includes('.windsurf/skills'));
  assert.ok(!windsurfRule.includes(projectDir));

  const kiroSteering = fs.readFileSync(path.join(projectDir, '.kiro/steering/pixelcraft.md'), 'utf8');
  assert.ok(kiroSteering.includes('.kiro/skills'));
  assert.ok(!kiroSteering.includes(projectDir));

  const claudeCommands = fs.readdirSync(path.join(projectDir, '.claude/commands')).sort();
  assert.deepEqual(claudeCommands, [
    'pixelcraft-plan.md',
    'pixelcraft-review.md',
    'pixelcraft-visual-qa.md',
    'pixelcraft.md',
  ]);
}

try {
  const cliHelp = run(process.execPath, [path.join(root, 'bin/pixelcraft.mjs'), '--help']);
  assert.match(cliHelp, /antigravity=\.agents\/skills/);
  assert.match(cliHelp, /windsurf=\.windsurf\/skills/);
  assertGuidance(process.execPath, [path.join(root, 'bin/pixelcraft.mjs'), 'add', 'pixelcraft-plan', '--agent', 'agents', '--dry-run'], '--docs-mcp');
  console.log('ok - Node installer only prints MCP guidance on opt-in and dry-run leaves the workspace unchanged');
  assertHarnessPaths(run(process.execPath, [path.join(root, 'bin/pixelcraft.mjs'), 'add', 'pixelcraft-plan', '--agent', harnesses, '--dry-run']));
  console.log('ok - Node installer maps native harnesses and deduplicates shared project skills');

  const nodeProject = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-node-adapters-'));
  try {
    fs.mkdirSync(path.join(nodeProject, '.github'), { recursive: true });
    fs.writeFileSync(path.join(nodeProject, '.github/copilot-instructions.md'), '# Team notes\n\nExisting user note.\n');
    run(process.execPath, [path.join(root, 'bin/pixelcraft.mjs'), 'add', 'pixelcraft-plan', '--agent', 'claude,cursor,copilot,windsurf,kiro'], nodeProject);
    assertProjectAdapterParity(nodeProject);
    console.log('ok - Node installer writes project-relative adapter paths, 4 Claude commands, expanded Copilot glob, and managed Copilot block');
  } finally {
    fs.rmSync(nodeProject, { recursive: true, force: true });
  }

  // Verify install.ps1 static parity (4 Claude commands, managed global Windsurf rules, expanded Copilot glob, relative paths)
  const ps1 = fs.readFileSync(path.join(root, 'install.ps1'), 'utf8');
  assert.ok(ps1.includes('memories/global_rules.md'), 'install.ps1 must support global Windsurf memories/global_rules.md');
  assert.ok(ps1.includes('<!-- pixelcraft:start -->') && ps1.includes('<!-- pixelcraft:end -->'), 'install.ps1 must support managed blocks');
  assert.ok(ps1.includes('$displayRoot'), 'install.ps1 must use display skill root');
  for (const ext of expandedGlobExts) assert.ok(ps1.includes(ext), `install.ps1 missing ${ext} in Copilot applyTo glob`);
  const claudeBlock = /if \(\$AgentName -eq 'claude'\) \{([\s\S]*?)\} elseif/.exec(ps1)?.[1] ?? '';
  assert.ok(!claudeBlock.includes('pixelcraft-direction'), 'install.ps1 Claude commands must stay aligned to 4 commands');
  console.log('ok - PowerShell installer parity checks pass');

  if (process.argv.includes('--shell')) {
    const archive = `${destination}.tar.gz`;
    const shellProject = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-shell-project-'));
    const shellHome = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-shell-home-'));
    try {
      run('git', ['archive', '--format=tar.gz', `--output=${archive}`, '--prefix=Pixelcraft-test/', 'HEAD', 'skills'], root);
      assertGuidance('bash', [path.join(root, 'install.sh'), '--archive', archive, '--skills', 'pixelcraft-plan', '--dry-run'], '--docs-mcp');
      assertHarnessPaths(run('bash', [path.join(root, 'install.sh'), '--archive', archive, '--skills', 'pixelcraft-plan', '--agent', harnesses, '--dry-run']));

      fs.mkdirSync(path.join(shellProject, '.github'), { recursive: true });
      fs.writeFileSync(path.join(shellProject, '.github/copilot-instructions.md'), '# Team notes\n\nExisting user note.\n');
      run('bash', [path.join(root, 'install.sh'), '--archive', archive, '--skills', 'pixelcraft-plan', '--agent', 'claude,cursor,copilot,windsurf,kiro'], shellProject);
      assertProjectAdapterParity(shellProject);
      // Re-run to verify managed-block idempotency
      run('bash', [path.join(root, 'install.sh'), '--archive', archive, '--skills', 'pixelcraft-plan', '--agent', 'copilot'], shellProject);
      const copilotAfter = fs.readFileSync(path.join(shellProject, '.github/copilot-instructions.md'), 'utf8');
      assert.equal(copilotAfter.split('<!-- pixelcraft:start -->').length, 2, 'managed upsert must not duplicate blocks');

      // Test Windsurf --global managed memories/global_rules.md upsert
      const globalRules = path.join(shellHome, '.codeium/windsurf/memories/global_rules.md');
      fs.mkdirSync(path.dirname(globalRules), { recursive: true });
      fs.writeFileSync(globalRules, '# Personal global rules\n\nKeep answers terse.\n');
      run('bash', [path.join(root, 'install.sh'), '--archive', archive, '--skills', 'pixelcraft-plan', '--agent', 'windsurf', '--global'], shellProject, { ...process.env, HOME: shellHome });
      const rulesContent = fs.readFileSync(globalRules, 'utf8');
      assert.ok(rulesContent.includes('Keep answers terse.'), 'global_rules.md must preserve existing user rules');
      assert.ok(rulesContent.includes('<!-- pixelcraft:start -->') && rulesContent.includes('<!-- pixelcraft:end -->'));
      assert.ok(rulesContent.includes('~/.codeium/windsurf/skills'));
      assert.equal(fs.existsSync(path.join(shellHome, '.codeium/windsurf/rules/pixelcraft.md')), false, 'global windsurf should write memories/global_rules.md, not rules/pixelcraft.md');
      console.log('ok - Bash installer accepts a local archive, writes relative paths, and upserts managed Copilot and global Windsurf rules');
    } finally {
      fs.rmSync(archive, { force: true });
      fs.rmSync(shellProject, { recursive: true, force: true });
      fs.rmSync(shellHome, { recursive: true, force: true });
    }
  }
  if (process.argv.includes('--powershell')) {
    const archive = `${destination}.zip`;
    try {
      run('git', ['archive', '--format=zip', `--output=${archive}`, '--prefix=Pixelcraft-test/', 'HEAD', 'skills'], root);
      assertGuidance('pwsh', ['-NoProfile', '-File', path.join(root, 'install.ps1'), '-Archive', archive, '-Skill', 'pixelcraft-plan', '-DryRun'], '-DocsMcp');
      assertHarnessPaths(run('pwsh', ['-NoProfile', '-File', path.join(root, 'install.ps1'), '-Archive', archive, '-Skill', 'pixelcraft-plan', '-Agent', harnesses, '-DryRun']));
      console.log('ok - PowerShell installer accepts a local archive and opt-in guidance without writing');
    } finally {
      fs.rmSync(archive, { force: true });
    }
  }
} finally {
  fs.rmSync(destination, { recursive: true, force: true });
}
