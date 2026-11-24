import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help')) {
  console.log('Usage: node scripts/test-installers.mjs [--shell|--powershell]');
  process.exit(0);
}

const root = fileURLToPath(new URL('..', import.meta.url));
const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-installers-'));
const run = (command, args, cwd = destination) => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 30000 });
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

try {
  assertGuidance(process.execPath, [path.join(root, 'bin/pixelcraft.mjs'), 'add', 'pixelcraft-plan', '--agent', 'agents', '--dry-run'], '--docs-mcp');
  console.log('ok - Node installer only prints MCP guidance on opt-in and dry-run leaves the workspace unchanged');
  if (process.argv.includes('--shell')) {
    const archive = `${destination}.tar.gz`;
    try {
      run('git', ['archive', '--format=tar.gz', `--output=${archive}`, '--prefix=Pixelcraft-test/', 'HEAD', 'skills'], root);
      assertGuidance('bash', [path.join(root, 'install.sh'), '--archive', archive, '--skills', 'pixelcraft-plan', '--dry-run'], '--docs-mcp');
      console.log('ok - Bash installer accepts a local archive and opt-in guidance without writing');
    } finally {
      fs.rmSync(archive, { force: true });
    }
  }
  if (process.argv.includes('--powershell')) {
    const archive = `${destination}.zip`;
    try {
      run('git', ['archive', '--format=zip', `--output=${archive}`, '--prefix=Pixelcraft-test/', 'HEAD', 'skills'], root);
      assertGuidance('pwsh', ['-NoProfile', '-File', path.join(root, 'install.ps1'), '-Archive', archive, '-Skill', 'pixelcraft-plan', '-DryRun'], '-DocsMcp');
      console.log('ok - PowerShell installer accepts a local archive and opt-in guidance without writing');
    } finally {
      fs.rmSync(archive, { force: true });
    }
  }
} finally {
  fs.rmSync(destination, { recursive: true, force: true });
}
