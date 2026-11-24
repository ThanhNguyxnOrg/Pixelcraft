#!/usr/bin/env node
import { writeFile, unlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: node scripts/soundtrack.mjs\nGenerate the original 40-second, 120 BPM electronic campaign soundtrack. Requires FFmpeg on PATH. No sampled or third-party audio.",
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
  [146.832, 174.614, 220, 261.626],
  [116.541, 146.832, 174.614, 233.082],
  [130.813, 164.814, 195.998, 261.626],
  [110, 146.832, 174.614, 220],
];
const cuts = [3.5, 7.5, 12.5, 20, 28, 34];
let seed = 91735;
let previousNoise = 0;
for (let i = 0; i < samples; i++) {
  const t = i / rate;
  const beatTime = t % 0.5;
  const beatIndex = Math.floor(t / 0.5);
  const chord = chords[Math.floor(t / 4) % chords.length];
  const envelope = Math.min(1, t / 0.3, (seconds - t) / 1.4);
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  const noise = seed / 2147483648 - 1;
  const brightNoise = noise - previousNoise;
  previousNoise = noise;
  let l = 0;
  let r = 0;
  chord.forEach((hz, k) => {
    const sidechain = 0.55 + 0.45 * (1 - Math.exp(-beatTime * 11));
    l +=
      Math.sin(2 * Math.PI * hz * t + 0.08 * Math.sin(t)) * 0.025 * sidechain;
    r += Math.sin(2 * Math.PI * (hz + 0.18) * t) * 0.025 * sidechain;
    if (Math.floor(t / 0.25) % 4 === k) {
      const a = Math.exp(-(t % 0.25) * 20);
      l += Math.sin(2 * Math.PI * hz * 4 * t) * a * 0.045;
      r += Math.sin(2 * Math.PI * hz * 4 * t + 0.1) * a * 0.035;
    }
  });
  const groove = t >= 3.5 && t < 37;
  const kick = groove
    ? Math.sin(
        2 * Math.PI * (46 * beatTime + 3.4 * (1 - Math.exp(-beatTime * 30))),
      ) *
      Math.exp(-beatTime * 19) *
      0.26
    : 0;
  const snare =
    groove && beatIndex % 2 === 1
      ? (brightNoise * 0.07 + Math.sin(2 * Math.PI * 180 * beatTime) * 0.045) *
        Math.exp(-beatTime * 27)
      : 0;
  const hat = groove ? brightNoise * Math.exp(-(t % 0.25) * 100) * 0.025 : 0;
  const bass = groove
    ? Math.sin(((2 * Math.PI * chord[0]) / 2) * t) *
      Math.exp(-beatTime * 6) *
      0.1
    : 0;
  let whoosh = 0;
  for (const cut of cuts) {
    const d = t - cut;
    if (d > -0.28 && d < 0.2)
      whoosh +=
        brightNoise * 0.07 * (d < 0 ? (d + 0.28) / 0.28 : Math.exp(-d * 23));
  }
  l = Math.tanh((l + kick + snare + hat + bass + whoosh) * 1.35) * envelope;
  r =
    Math.tanh((r + kick + snare + hat * 0.8 + bass + whoosh * 0.9) * 1.35) *
    envelope;
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
  [
    "-y",
    "-v",
    "error",
    "-i",
    temp,
    "-af",
    "loudnorm=I=-16:TP=-1.5:LRA=9",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    output,
  ],
  { stdio: "inherit" },
);
if (result.status !== 0) throw new Error("FFmpeg soundtrack encoding failed");
await unlink(temp);
console.log(`Original soundtrack generated: ${output}`);
