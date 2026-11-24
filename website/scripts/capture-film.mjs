#!/usr/bin/env node
// Development-only asset capture. No network/model output is simulated or executed.
import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: node scripts/capture-film.mjs [--url http://127.0.0.1:4321]\nCaptures the actual site specimens for the promotional film. Requires optional website dev dependency Playwright and its Chromium browser.",
  );
  process.exit(0);
}
const { chromium } = await import("playwright").catch(() => {
  throw new Error(
    "Install website dev dependencies with npm ci, then npx playwright install chromium.",
  );
});
const at = process.argv.indexOf("--url");
const url = at < 0 ? "http://127.0.0.1:4321" : process.argv[at + 1];
const out = fileURLToPath(new URL("../public/video/assets/", import.meta.url));
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".stays-photo img").evaluate((img) => img.decode());
  await page.locator(".preview-web").screenshot({ path: `${out}web.png` });
  await page.getByRole("button", { name: "Before", exact: true }).click();
  await page.locator(".demo-before").screenshot({ path: `${out}before.png` });
  await page.getByRole("button", { name: /With Pixelcraft/ }).click();
  for (const [surface, selector] of [
    ["mobile", ".preview-mobile"],
    ["desktop", ".desktop-window"],
    ["terminal", ".terminal-window"],
  ]) {
    await page.locator(`[data-surface="${surface}"]`).click();
    await page.locator(selector).screenshot({ path: `${out}${surface}.png` });
  }
  await copyFile(
    fileURLToPath(
      new URL(
        "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
        import.meta.url,
      ),
    ),
    `${out}manrope.woff2`,
  );
  await copyFile(
    fileURLToPath(
      new URL(
        "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
        import.meta.url,
      ),
    ),
    `${out}mono.woff2`,
  );
  for (const [packageName, filename] of [
    ["@fontsource-variable/manrope", "manrope-OFL.txt"],
    ["@fontsource/ibm-plex-mono", "ibm-plex-mono-OFL.txt"],
  ]) {
    await copyFile(
      fileURLToPath(
        new URL(`../node_modules/${packageName}/LICENSE`, import.meta.url),
      ),
      `${out}${filename}`,
    );
  }
  console.log(`Film source assets captured in ${out}`);
} finally {
  await browser.close();
}
