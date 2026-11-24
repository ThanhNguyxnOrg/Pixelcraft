#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: node website/scripts/normalize-film.mjs --input /path/to/owner-supplied-film.mp4 [--font /path/to/mono.ttf]\nPreserve the supplied 16-second film; correct its two baked-in install labels to the root npm package. Requires FFmpeg with drawtext, H.264 and VP9 support. Writes public/media/pixelcraft-film.{mp4,webm,jpg} and pixelcraft-film-720.mp4 for smaller screens. Input must be outside the output path.",
  );
  process.exit(0);
}
const value = (flag) => process.argv[process.argv.indexOf(flag) + 1];
if (!process.argv.includes("--input"))
  throw new Error("Pass --input (see --help)");
const input = resolve(value("--input"));
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/media/pixelcraft-film.mp4");
if (input === output) throw new Error("Input must not overwrite itself");
const font = process.argv.includes("--font")
  ? value("--font")
  : "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf";
if (!existsSync(input) || !existsSync(font))
  throw new Error("Input or mono TTF font not found");
const { name } = JSON.parse(
  readFileSync(resolve(root, "../package.json"), "utf8"),
);
if (!/^(?:@[a-z0-9-]+\/)?[a-z0-9-]+$/.test(name))
  throw new Error("Expected a plain or scoped npm package name");
const filter = [
  "format=rgb24",
  "drawbox=x=148:y=341:w=1065:h=43:color=0x010635:t=fill:enable='between(t,3.35,6.25)'",
  `drawtext=fontfile='${font}':text='$ npx ${name} add all --agent claude':x=154:y=351:fontsize=24:fontcolor=0xeef1ff:enable='between(t,3.35,6.25)'`,
  "drawbox=x=600:y=617:w=542:h=48:color=0x01072a:t=fill:enable='gte(t,14.3)'",
  `drawtext=fontfile='${font}':text='$ npx ${name}':x=870-text_w/2:y=628:fontsize=30:fontcolor=0x03f0ed:enable='gte(t,14.3)'`,
  "fade=t=out:st=15.5:d=0.5",
  "scale=out_color_matrix=bt709:out_range=tv",
  "format=yuv420p",
].join(",");
const ffmpeg = (args) =>
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "inherit" });
ffmpeg([
  "-i",
  input,
  "-vf",
  filter,
  "-an",
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p",
  "-color_range",
  "tv",
  "-colorspace",
  "bt709",
  "-movflags",
  "+faststart",
  output,
]);
ffmpeg([
  "-i",
  output,
  "-vf",
  "scale=1280:-2",
  "-an",
  "-c:v",
  "libx264",
  "-preset",
  "fast",
  "-crf",
  "22",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-movflags",
  "+faststart",
  resolve(root, "public/media/pixelcraft-film-720.mp4"),
]);
ffmpeg([
  "-i",
  output,
  "-an",
  "-c:v",
  "libvpx-vp9",
  "-b:v",
  "0",
  "-crf",
  "32",
  "-cpu-used",
  "4",
  resolve(root, "public/media/pixelcraft-film.webm"),
]);
ffmpeg([
  "-ss",
  "12.1",
  "-i",
  output,
  "-frames:v",
  "1",
  "-q:v",
  "2",
  resolve(root, "public/media/pixelcraft-film.jpg"),
]);
console.log(
  "Corrected installer labels; supplied film choreography and silent format retained.",
);
