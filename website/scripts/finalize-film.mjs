#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { unlink } from "node:fs/promises";
if (process.argv.includes("--help")) {
  console.log(
    "Usage: node scripts/finalize-film.mjs\nNormalizes the Remotion export to limited-range H.264/yuv420p with fast-start and creates the poster. Requires FFmpeg.",
  );
  process.exit(0);
}
const render = "video/.render.mp4";
const output = "public/video/pixelcraft-promo.mp4";
for (const args of [
  [
    "-y",
    "-loglevel",
    "error",
    "-i",
    render,
    "-vf",
    "scale=in_range=auto:out_range=tv",
    "-pix_fmt",
    "yuv420p",
    "-color_range",
    "tv",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "19",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    output,
  ],
  [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    "37.5",
    "-i",
    output,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    "public/video/poster.jpg",
  ],
]) {
  const result = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (result.error || result.status !== 0)
    throw result.error ?? new Error("FFmpeg export failed");
}
await unlink(render);
console.log("Published film and poster finalized.");
