#!/usr/bin/env node
import { writeFile, unlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: node scripts/soundtrack.mjs\nGenerate the original 40-second ambient electronic soundtrack. Requires FFmpeg on PATH. No sampled or third-party audio.",
  );
  process.exit(0);
}
const rate = 44100;
const seconds = 40;
const samples = rate * seconds;
const wav = Buffer.alloc(44 + samples * 4);
wav.write("RIFF");
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(rate, 24);
wav.writeUInt32LE(rate * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(samples * 4, 40);
const chords = [
  [130.813, 164.814, 195.998, 246.942],
  [110, 130.813, 164.814, 220],
  [87.307, 130.813, 174.614, 220],
  [97.999, 146.832, 195.998, 246.942],
];
for (let i = 0; i < samples; i++) {
  const t = i / rate;
  const beat = (t % 0.625) / 0.625;
  const phase = t % 5;
  const chord = chords[Math.floor(t / 5) % 4];
  const envelope = Math.min(1, t / 2.5, (seconds - t) / 3.5);
  let l = 0;
  let r = 0;
  chord.forEach((hz, k) => {
    const swell = 0.4 + 0.6 * Math.sin(Math.PI * Math.min(phase / 5, 1));
    l += Math.sin(2 * Math.PI * hz * t + 0.08 * Math.sin(t)) * 0.032 * swell;
    r += Math.sin(2 * Math.PI * (hz + 0.18) * t) * 0.032 * swell;
    if (t > 5 && t < 35 && Math.floor(t / 0.3125) % 4 === k) {
      const a = Math.exp(-((t % 0.3125) / 0.3125) * 5);
      l += Math.sin(2 * Math.PI * hz * 4 * t) * a * 0.023;
      r += Math.sin(2 * Math.PI * hz * 4 * t) * a * 0.019;
    }
  });
  const kick =
    t > 5 && t < 35
      ? Math.sin(2 * Math.PI * (44 * t + 0.75 * (1 - Math.exp(-beat * 25)))) *
        Math.exp(-beat * 17) *
        0.09
      : 0;
  l = (l + kick) * envelope;
  r = (r + kick) * envelope;
  wav.writeInt16LE(
    Math.round(Math.max(-0.9, Math.min(0.9, l)) * 32767),
    44 + i * 4,
  );
  wav.writeInt16LE(
    Math.round(Math.max(-0.9, Math.min(0.9, r)) * 32767),
    46 + i * 4,
  );
}
const temp = fileURLToPath(
  new URL("../public/video/assets/soundtrack.wav", import.meta.url),
);
const output = temp.replace(".wav", ".m4a");
await writeFile(temp, wav);
const result = spawnSync(
  "ffmpeg",
  ["-y", "-v", "error", "-i", temp, "-c:a", "aac", "-b:a", "160k", output],
  { stdio: "inherit" },
);
if (result.status !== 0) throw new Error("FFmpeg soundtrack encoding failed");
await unlink(temp);
console.log(`Original soundtrack generated: ${output}`);
