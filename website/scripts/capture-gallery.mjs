#!/usr/bin/env node
// Renders every gallery page in a real browser, runs the Pixelcraft slop scanner on its source,
// and writes the evidence the site displays. Nothing in the output is hand-typed.
//
//   node scripts/capture-gallery.mjs [--scan path/to/slop-scan.mjs]
//
// Outputs: public/gallery/<id>/{before,after}.webp  and  src/generated/gallery.json

import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (process.argv.includes("--help")) {
  console.log(
    "Usage: node website/scripts/capture-gallery.mjs [--scan path/to/slop-scan.mjs]\nCapture supplied gallery pages and regenerate scanner metadata. Set CHROMIUM to a Chrome/Chromium executable if needed.",
  );
  process.exit(0);
}
const argScan = process.argv.indexOf("--scan");
const SCAN =
  argScan > -1
    ? process.argv[argScan + 1]
    : process.env.SLOP_SCAN ||
      path.resolve(ROOT, "../skills/pixelcraft-review/scripts/slop-scan.mjs");
const BROWSER =
  process.env.CHROMIUM ||
  (existsSync("/usr/bin/google-chrome")
    ? "/usr/bin/google-chrome"
    : "/usr/bin/chromium");
const W = 1440;
const H = 900;
const IDS = [
  "swiftui",
  "compose",
  "flutter",
  "mobile",
  "kubetrace",
  "tui",
  "desktop",
  "python",
  "dashboard",
  "grid",
  "liveview",
  "saas",
  "store",
  "booking",
  "learning",
  "magazine",
  "coffee",
  "clinic",
  "email",
  "proposal",
  "document",
  "gamehud",
];

if (!existsSync(SCAN))
  throw new Error(`slop-scan.mjs not found at ${SCAN}. Pass --scan <path>.`);

function encodeWebp(pngPath, webpPath) {
  try {
    execFileSync("ffmpeg", [
      "-y",
      "-v",
      "error",
      "-i",
      pngPath,
      "-c:v",
      "libwebp",
      "-quality",
      "88",
      webpPath,
    ]);
  } catch {
    execFileSync("python3", [
      "-c",
      "import sys; from PIL import Image; Image.open(sys.argv[1]).save(sys.argv[2], 'WEBP', quality=88, method=6)",
      pngPath,
      webpPath,
    ]);
  }
}

const chrome = (args) =>
  execFileSync(
    BROWSER,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${W},${H}`,
      "--force-device-scale-factor=1",
      ...args,
    ],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    },
  );

// Injected only into a temp copy: reports where each data-slop element sits on the page.
const PROBE = `<script>
addEventListener('load', async () => {
  await document.fonts.ready;
  const out = {};
  for (const el of document.querySelectorAll('[data-slop]')) {
    const r = el.getBoundingClientRect();
    const rule = el.getAttribute('data-slop');
    if (!out[rule]) out[rule] = { x: (r.left + Math.min(r.width, 160) * 0.5) / innerWidth, y: (r.top + Math.min(r.height, 60) * 0.5) / innerHeight };
  }
  const pre = document.createElement('pre'); pre.id = '__pins'; pre.textContent = JSON.stringify(out); document.body.append(pre);
});
</script>`;

function scan(file) {
  const raw = execFileSync("node", [SCAN, file, "--json"], {
    encoding: "utf8",
  });
  const j = JSON.parse(raw);
  const lines = readFileSync(file, "utf8").split("\n");
  return {
    score: j.score,
    findings: j.findings.map((f) => ({
      rule: f.rule,
      severity: f.severity,
      line: f.line,
      snippet: (lines[f.line - 1] ?? f.evidence ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 96),
      fix: f.fix,
    })),
  };
}

const result = {};
for (const id of IDS) {
  const dir = path.join(ROOT, "public/gallery", id);
  result[id] = {};
  for (const side of ["before", "after"]) {
    const file = path.join(dir, `${side}.html`);
    const png = path.join("/tmp", `pc-${id}-${side}.png`);
    chrome([
      `--screenshot=${png}`,
      "--virtual-time-budget=12000",
      `file://${file}`,
    ]);
    encodeWebp(png, path.join(dir, `${side}.webp`));

    const s = scan(file);
    let pins = {};
    if (side === "before") {
      const tmp = path.join("/tmp", `pc-probe-${id}.html`);
      writeFileSync(
        tmp,
        readFileSync(file, "utf8").replace("</body>", `${PROBE}</body>`),
      );
      const dom = chrome([
        "--dump-dom",
        "--virtual-time-budget=12000",
        `file://${tmp}`,
      ]);
      const m = /<pre id="__pins">([\s\S]*?)<\/pre>/.exec(dom);
      if (m)
        pins = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
      rmSync(tmp, { force: true });
    }
    // One pin per distinct rule that the scanner reported and the page can point at.
    const seen = new Set();
    s.findings.forEach((f) => {
      if (pins[f.rule] && !seen.has(f.rule) && seen.add(f.rule))
        f.pin = {
          x: Math.round(pins[f.rule].x * 1000) / 10,
          y: Math.round(pins[f.rule].y * 1000) / 10,
        };
    });
    result[id][side] = s;
    console.log(
      id,
      side,
      "score",
      s.score,
      "findings",
      s.findings.length,
      "pins",
      s.findings.filter((f) => f.pin).length,
    );
  }
}

mkdirSync(path.join(ROOT, "src/generated"), { recursive: true });
writeFileSync(
  path.join(ROOT, "src/generated/gallery.json"),
  JSON.stringify(
    {
      viewport: { w: W, h: H },
      scanner: "skills/pixelcraft-review/scripts/slop-scan.mjs",
      items: result,
    },
    null,
    2,
  ) + "\n",
);
console.log("wrote src/generated/gallery.json");
