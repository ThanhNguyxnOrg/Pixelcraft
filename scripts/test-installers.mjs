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

const expandedGlobExts = [
  'mjml', 'typ', 'tex', 'qmd', 'uxml', 'uss', 'gd', 'tscn', 'qml', 'xaml', 'axaml', 'fxml',
  'blp', 'slint', 'ets', 'zig', 'less', 'pcss', 'twig', 'cpp', 'h', 'glsl', 'wgsl', 'mdx',
  'razor', 'heex', 'erb', 'templ', 'tcss', 'qss', 'r', 'jl',
];

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
  const cli = path.join(root, 'bin/pixelcraft.mjs');
  const cliHelp = run(process.execPath, [cli, '--help']);
  assert.match(cliHelp, /antigravity=\.agents\/skills/);
  assert.match(cliHelp, /windsurf=\.windsurf\/skills/);
  assert.match(cliHelp, /\bdoctor\b/);
  assert.match(cliHelp, /\bremove\b/);
  assert.match(cliHelp, /\binit-router\b/);
  assert.match(cliHelp, /\bcheck\b/);
  assertGuidance(process.execPath, [cli, 'add', 'pixelcraft-plan', '--agent', 'agents', '--dry-run'], '--docs-mcp');
  console.log('ok - Node installer only prints MCP guidance on opt-in and dry-run leaves the workspace unchanged');
  assertHarnessPaths(run(process.execPath, [cli, 'add', 'pixelcraft-plan', '--agent', harnesses, '--dry-run']));
  console.log('ok - Node installer maps native harnesses and deduplicates shared project skills');

  const nodeProject = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-node-adapters-'));
  try {
    fs.mkdirSync(path.join(nodeProject, '.github'), { recursive: true });
    fs.writeFileSync(path.join(nodeProject, '.github/copilot-instructions.md'), '# Team notes\n\nExisting user note.\n');
    run(process.execPath, [cli, 'add', 'pixelcraft-plan', '--agent', 'claude,cursor,copilot,windsurf,kiro'], nodeProject);
    assertProjectAdapterParity(nodeProject);
    console.log('ok - Node installer writes project-relative adapter paths, 4 Claude commands, expanded Copilot glob, and managed Copilot block');

    // doctor reports healthy installation, then catches missing core skill after remove
    const doctorOk = run(process.execPath, [cli, 'doctor', '--agent', 'claude'], nodeProject);
    assert.match(doctorOk, /OK\s+\.claude\/skills: 2 skill\(s\) installed and healthy/);

    const removeDry = run(process.execPath, [cli, 'remove', 'pixelcraft-plan', '--agent', 'claude', '--dry-run'], nodeProject);
    assert.match(removeDry, /dry-run: remove pixelcraft-plan/);
    assert.ok(fs.existsSync(path.join(nodeProject, '.claude/skills/pixelcraft-plan')));

    // Refuse removing non-Pixelcraft folders
    const nonPc = spawnSync(process.execPath, [cli, 'remove', 'other-skill', '--agent', 'claude'], { cwd: nodeProject, encoding: 'utf8' });
    assert.notEqual(nonPc.status, 0);
    assert.match(nonPc.stderr, /non-Pixelcraft/);

    run(process.execPath, [cli, 'remove', 'pixelcraft-plan', '--agent', 'claude'], nodeProject);
    assert.equal(fs.existsSync(path.join(nodeProject, '.claude/skills/pixelcraft-plan')), false);

    const doctorMissingCore = spawnSync(process.execPath, [cli, 'doctor', '--agent', 'claude'], { cwd: nodeProject, encoding: 'utf8' });
    assert.equal(doctorMissingCore.status, 1, 'doctor must flag missing core skill pixelcraft-plan');
    assert.match(doctorMissingCore.stdout, /missing required core skill 'pixelcraft-plan'/);

    // init-router detects multi-language manifests and upserts managed block idempotently
    fs.writeFileSync(path.join(nodeProject, 'Cargo.toml'), '[dependencies]\nratatui = "0.29"\n');
    fs.writeFileSync(path.join(nodeProject, 'go.mod'), 'module example\nrequire github.com/charmbracelet/bubbletea v1.0.0\n');
    fs.writeFileSync(path.join(nodeProject, 'AGENTS.md'), '# Repo rules\n\nKeep commits focused.\n');
    const routerStdout = run(process.execPath, [cli, 'init-router', '--dir', nodeProject], nodeProject);
    assert.match(routerStdout, /pixelcraft-tui/);
    assert.match(routerStdout, /Cargo\.toml/);
    run(process.execPath, [cli, 'init-router', '--dir', nodeProject, '--write', 'AGENTS.md'], nodeProject);
    run(process.execPath, [cli, 'init-router', '--dir', nodeProject, '--write', 'AGENTS.md'], nodeProject);
    const agentsMd = fs.readFileSync(path.join(nodeProject, 'AGENTS.md'), 'utf8');
    assert.ok(agentsMd.includes('Keep commits focused.'));
    assert.equal(agentsMd.split('<!-- pixelcraft:start -->').length, 2, 'init-router --write must be idempotent');

    // check dispatches slop-scan, check-contrast (DTCG JSON), check-pdf (.pdf), and notes check-email for .mjml
    const cleanHtml = path.join(root, 'skills/pixelcraft-review/scripts/fixtures/clean.html');
    const checkHtml = run(process.execPath, [cli, 'check', cleanHtml, '--json', '--fail-on', 'any'], nodeProject);
    assert.equal(JSON.parse(checkHtml).score, 0);

    const tokensJson = path.join(root, 'skills/pixelcraft-tokens/assets/tokens.example.json');
    const checkTokens = run(process.execPath, [cli, 'check', tokensJson, '--json'], nodeProject);
    assert.equal(JSON.parse(checkTokens).pass, true);

    const sampleMjml = path.join(nodeProject, 'receipt.mjml');
    fs.writeFileSync(sampleMjml, '<mjml><mj-body><mj-section><mj-column><mj-text>Receipt #10</mj-text></mj-column></mj-section></mj-body></mjml>\n');
    const checkMjml = spawnSync(process.execPath, [cli, 'check', sampleMjml, '--json'], { cwd: nodeProject, encoding: 'utf8' });
    assert.equal(checkMjml.status, 0, checkMjml.stderr);
    assert.equal(JSON.parse(checkMjml.stdout).score, 0);
    assert.match(checkMjml.stderr, /check-email\.mjs/);

    const samplePdf = path.join(nodeProject, 'doc.pdf');
    fs.writeFileSync(samplePdf, Buffer.from('%PDF-1.7\n1 0 obj << /Type /Page /StructTreeRoot 2 0 R /MarkInfo << /Marked true >> /Lang (en) /Title (Test) /FontFile2 3 0 R >> endobj\n%%EOF\n', 'latin1'));
    const checkPdf = run(process.execPath, [cli, 'check', samplePdf, '--json'], nodeProject);
    assert.equal(JSON.parse(checkPdf).pass, true);
    console.log('ok - CLI doctor, remove, init-router, and check subcommands work cleanly');
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
