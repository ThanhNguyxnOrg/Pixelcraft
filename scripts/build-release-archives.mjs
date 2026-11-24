import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [output, ...extra] = process.argv.slice(2);
if (output === '--help' || output === '-h') {
  console.log('Usage: node scripts/build-release-archives.mjs OUTPUT_DIRECTORY');
  console.log('Build reproducible skill and adapter archives on Linux (requires git, GNU tar, gzip, and zip).');
  process.exit(0);
}
if (!output || extra.length) throw new Error('expected OUTPUT_DIRECTORY (see --help)');

const commitTime = Number(execFileSync('git', ['log', '-1', '--format=%ct'], { cwd: root, encoding: 'utf8' }).trim());
const timestamp = new Date(commitTime * 1000);
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-release-'));
const out = path.resolve(output);
const dirs = ['skills', 'adapters'];

function* archiveEntries(relativePath) {
  const entry = path.join(stage, relativePath);
  const stat = fs.lstatSync(entry);
  const directory = stat.isDirectory();
  if (!directory && !stat.isFile()) throw new Error(`unsupported archive entry: ${relativePath}`);
  fs.chmodSync(entry, directory || (stat.mode & 0o111) ? 0o755 : 0o644);
  fs.utimesSync(entry, timestamp, timestamp);
  yield directory ? `${relativePath}/` : relativePath;
  if (directory) {
    for (const child of fs.readdirSync(entry).sort()) yield* archiveEntries(`${relativePath}/${child}`);
  }
}

try {
  fs.cpSync(path.join(root, 'skills'), path.join(stage, 'skills'), { recursive: true });
  execFileSync(process.execPath, [path.join(root, 'scripts/build-adapters.mjs'), '--out', path.join(stage, 'adapters')], {
    stdio: 'inherit',
  });
  const entries = dirs.flatMap((dir) => [...archiveEntries(dir)]);
  const env = { ...process.env, TZ: 'UTC', LC_ALL: 'C', ZIPOPT: '', TAR_OPTIONS: '' };
  execFileSync('zip', ['-X', '-q', 'pixelcraft-skills.zip', '-@'], {
    cwd: stage,
    env,
    input: entries.join('\n') + '\n',
  });
  execFileSync('tar', ['--format=gnu', '--sort=name', `--mtime=@${commitTime}`, '--owner=0', '--group=0', '--numeric-owner',
    '--use-compress-program=gzip -n', '-cf', 'pixelcraft-skills.tar.gz', ...dirs], { cwd: stage, env });
  fs.mkdirSync(out, { recursive: true });
  for (const name of ['pixelcraft-skills.zip', 'pixelcraft-skills.tar.gz']) {
    fs.copyFileSync(path.join(stage, name), path.join(out, name));
  }
} finally {
  fs.rmSync(stage, { recursive: true, force: true });
}
