import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--help')) {
  console.log('Usage: node scripts/test-release-archives.mjs');
  process.exit(0);
}

const script = fileURLToPath(new URL('./build-release-archives.mjs', import.meta.url));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-release-test-'));
const names = ['pixelcraft-skills.zip', 'pixelcraft-skills.tar.gz'];

function build(output, tz, umask) {
  const previous = process.umask(umask);
  try {
    execFileSync(process.execPath, [script, output], { env: { ...process.env, TZ: tz } });
  } finally {
    process.umask(previous);
  }
  return names.map((name) => createHash('sha256').update(fs.readFileSync(path.join(output, name))).digest('hex'));
}

try {
  const first = path.join(scratch, 'first');
  const second = path.join(scratch, 'second');
  const expected = build(first, 'Pacific/Honolulu', 0o022);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2100);
  assert.deepEqual(build(second, 'Asia/Tokyo', 0o077), expected);
  for (const [command, args] of [['unzip', ['-Z1', path.join(first, names[0])]], ['tar', ['-tzf', path.join(first, names[1])]]]) {
    const entries = execFileSync(command, args, { encoding: 'utf8' }).split('\n');
    assert.ok(entries.includes('skills/pixelcraft/SKILL.md'));
    assert.ok(entries.includes('adapters/manifest.json'));
  }
  console.log('ok - both release archives have identical SHA-256 checksums across independent builds');
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
