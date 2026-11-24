import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(resolve(root, file), "utf8");
// Matches vite.config.ts: "/" locally, "/<repository>/" for the GitHub Pages build.
const siteBase = (process.env.SITE_BASE || "/").replace(/\/*$/, "/");

test("showcase identities, version, references, and agent count stay synced with the authoritative pack", async () => {
  const product = JSON.parse(await read("../package.json"));
  const site = JSON.parse(await read("package.json"));
  const meta = JSON.parse(await read("src/generated/repo-meta.json"));
  assert.equal(site.version, product.version);
  assert.equal(meta.version, product.version);
  assert.equal(meta.npmPkg, product.name);

  const actualSkills = meta.skills.map((s) => s.name).sort();
  const expectedSkills = (await readdir(resolve(root, "../skills")))
    .filter((s) => s.startsWith("pixelcraft"))
    .sort();
  assert.deepEqual(actualSkills, expectedSkills);

  let expectedRefs = 0;
  let expectedScripts = 0;
  for (const name of expectedSkills) {
    try {
      const refs = (
        await readdir(resolve(root, `../skills/${name}/references`))
      ).filter((f) => f.endsWith(".md"));
      expectedRefs += refs.length;
    } catch {}
    try {
      const scripts = (
        await readdir(resolve(root, `../skills/${name}/scripts`))
      ).filter((f) => f.endsWith(".mjs"));
      expectedScripts += scripts.length;
    } catch {}
  }
  assert.equal(meta.totalReferences, expectedRefs);
  assert.equal(meta.totalScripts, expectedScripts);
  assert.ok(meta.agentTargetCount >= 14);
  assert.ok(meta.stacks.length > 0);
  assert.ok(Array.isArray(meta.tokenFormats) && meta.tokenFormats.length >= 19);
  assert.equal(meta.totalTokenFormats, meta.tokenFormats.length);
  assert.ok(Array.isArray(meta.scanRules) && meta.scanRules.length >= 23);
  assert.equal(meta.totalScanRules, meta.scanRules.length);
  assert.ok(meta.scanExtensionCount >= 50);

  const expectedFixtures = (
    await readdir(resolve(root, "../evals/fixtures"))
  ).filter((f) => f.endsWith(".json")).length;
  assert.equal(meta.totalEvalFixtures, expectedFixtures);
  assert.ok(meta.totalEvalCases >= expectedSkills.length);
  assert.equal(meta.totalGalleryExhibits, 6);
});

test("gallery metadata matches source scanner output, covers all 6 multi-stack exhibits, and all paired assets exist", async () => {
  const { execFileSync } = await import("node:child_process");
  const meta = JSON.parse(await read("src/generated/gallery.json"));
  const expectedIds = ["coffee", "clinic", "grid", "tui", "mobile", "document"];
  assert.deepEqual(Object.keys(meta.items).sort(), [...expectedIds].sort());
  for (const [id, pair] of Object.entries(meta.items)) {
    for (const side of ["before", "after"]) {
      const path = resolve(root, `public/gallery/${id}/${side}.html`);
      const scan = JSON.parse(
        execFileSync(
          process.execPath,
          [
            resolve(root, "../skills/pixelcraft-review/scripts/slop-scan.mjs"),
            path,
            "--json",
          ],
          { encoding: "utf8" },
        ),
      );
      assert.equal(pair[side].score, scan.score, `${id}/${side} score`);
      assert.deepEqual(
        pair[side].findings.map((f) => [f.rule, f.severity, f.line]),
        scan.findings.map((f) => [f.rule, f.severity, f.line]),
        `${id}/${side} findings`,
      );
      if (side === "after") {
        assert.equal(
          scan.score,
          0,
          `${id}/after.html must score 0 under slop-scan.mjs, got ${scan.score}: ${JSON.stringify(scan.findings)}`,
        );
      }
      assert.ok(
        (await stat(resolve(root, `public/gallery/${id}/${side}.webp`))).size >
          1000,
      );
    }
  }
});

test("shipped website UI components, CSS, and entry shell score 0 under Pixelcraft slop-scan", async () => {
  const { execFileSync } = await import("node:child_process");
  const scanner = resolve(
    root,
    "../skills/pixelcraft-review/scripts/slop-scan.mjs",
  );
  for (const target of [
    "src/components",
    "src/App.tsx",
    "src/index.css",
    "index.html",
  ]) {
    const scan = JSON.parse(
      execFileSync(
        process.execPath,
        [scanner, resolve(root, target), "--json"],
        {
          encoding: "utf8",
        },
      ),
    );
    assert.equal(
      scan.score,
      0,
      `${target} failed dogfooding slop-scan (score ${scan.score}): ${JSON.stringify(scan.findings)}`,
    );
  }
});

test("shipped source has no host scaffold, remote font or superseded 3D dependency", async () => {
  const meta = JSON.parse(await read("src/generated/repo-meta.json"));
  async function files(path) {
    const out = [];
    for (const e of await readdir(resolve(root, path), {
      withFileTypes: true,
    })) {
      if (e.isDirectory()) out.push(...(await files(`${path}/${e.name}`)));
      else if (/\.(tsx?|css|html|json)$/.test(e.name))
        out.push(`${path}/${e.name}`);
    }
    return out;
  }
  for (const file of [
    "package.json",
    "index.html",
    "vite.config.ts",
    ...(await files("src")).filter((f) => f !== "src/generated/repo-meta.json"),
    ...(await files("public")),
  ]) {
    const source = await read(file);
    assert.doesNotMatch(
      source,
      /make-kit-plugin|fonts\.googleapis\.com|fonts\.gstatic\.com|@react-three|["']three["']/i,
      file,
    );
  }
  const shell = await read("dist/index.html");
  assert.match(shell, /lang="en"/);
  assert.match(shell, /<noscript\s*>/);
  assert.doesNotMatch(shell, /%PIXELCRAFT_/);
  assert.ok(
    shell.includes(`${meta.totalSkills} portable Agent Skills`),
    "dist/index.html must include live skill count from repo-meta.json",
  );
  const bundles = [
    ...shell.matchAll(/(?:src|href)="([^"#]*\/assets\/[^"#]+)"/g),
  ].map((m) => m[1]);
  assert.ok(bundles.length > 0, "dist/index.html references no bundles");
  for (const url of bundles) {
    assert.ok(url.startsWith(`${siteBase}assets/`), `${url} is outside base`);
    await stat(resolve(root, "dist", url.slice(siteBase.length)));
  }
});

test("public files are addressed through the deploy base, never the domain root", async () => {
  const names = (await readdir(resolve(root, "public")))
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const rooted = new RegExp(`["'\`(]/(?:${names})(?=[/"'\`?#)])`);
  async function sources(path) {
    const out = [];
    for (const e of await readdir(resolve(root, path), {
      withFileTypes: true,
    })) {
      if (e.isDirectory()) out.push(...(await sources(`${path}/${e.name}`)));
      else if (/\.(tsx?|css)$/.test(e.name)) out.push(`${path}/${e.name}`);
    }
    return out;
  }
  for (const file of await sources("src"))
    assert.doesNotMatch(
      await read(file),
      rooted,
      `${file}: wrap public paths in publicUrl() so they resolve under ${siteBase}`,
    );
});
