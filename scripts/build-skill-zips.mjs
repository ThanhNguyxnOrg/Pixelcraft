import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const skills = path.join(root, 'skills');
const crcTable = Array.from({ length: 256 }, (_, byte) => {
  for (let bit = 0; bit < 8; bit++) byte = (byte >>> 1) ^ ((byte & 1) ? 0xedb88320 : 0);
  return byte;
});

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function* files(directory) {
  for (const name of fs.readdirSync(directory).sort()) {
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    if (name.includes('\\') || name.includes(':')) throw new Error(`unsupported ZIP path: ${file}`);
    if (stat.isDirectory()) yield* files(file);
    else if (stat.isFile()) yield { file, mode: stat.mode };
    else throw new Error(`refusing non-regular ZIP input: ${file}`);
  }
}

function buildZip(skill) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const { file, mode } of files(path.join(skills, skill))) {
    const name = Buffer.from(path.relative(skills, file).split(path.sep).join('/'));
    const data = fs.readFileSync(file);
    const compressed = deflateRawSync(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(8, 8);
    header.writeUInt16LE(33, 12);
    header.writeUInt32LE(crc32(data), 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(0x0314, 4);
    header.copy(entry, 6, 4);
    entry.writeUInt32LE((mode << 16) >>> 0, 38);
    entry.writeUInt32LE(offset, 42);
    central.push(entry, name);
    local.push(header, name, compressed);
    offset += header.length + name.length + compressed.length;
  }

  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(central.length / 2, 8);
  end.writeUInt16LE(central.length / 2, 10);
  end.writeUInt32LE(central.reduce((size, part) => size + part.length, 0), 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/build-skill-zips.mjs [--out DIRECTORY]');
  console.log('Build one upload ZIP per canonical skill (default: skill-zips/).');
  process.exit(0);
}

try {
  if (args.length !== 0 && (args.length !== 2 || args[0] !== '--out' || args[1].startsWith('-'))) {
    throw new Error('expected --out DIRECTORY (see --help)');
  }
  const out = args.length ? path.resolve(args[1]) : path.join(root, 'skill-zips');
  const names = fs.readdirSync(skills, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skills, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort();
  fs.mkdirSync(out, { recursive: true });
  for (const name of names) {
    const target = path.join(out, `${name}.zip`);
    fs.writeFileSync(target, buildZip(name), { flag: 'wx' });
  }
  console.log(`Built ${names.length} skill ZIPs in ${out}`);
} catch (error) {
  console.error(`build-skill-zips: ${error.message}`);
  process.exitCode = 1;
}
