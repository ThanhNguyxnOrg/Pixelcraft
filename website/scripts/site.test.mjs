import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, readdir, readlink, stat } from "node:fs/promises";
import { get } from "node:http";
import { setTimeout as delay } from "node:timers/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const website = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(website, "out");

test("every repository skill has a source-backed static page", async () => {
  const names = (await readdir(resolve(website, "../skills"))).filter((name) =>
    name.startsWith("pixelcraft"),
  );
  for (const name of names) {
    const slug = name === "pixelcraft" ? name : name.replace("pixelcraft-", "");
    const html = await readFile(
      resolve(output, "skills", slug, "index.html"),
      "utf8",
    );
    assert.ok(html.includes(`/blob/main/skills/${name}/SKILL.md`), name);
    assert.ok(html.includes('id="instructions"'), name);
  }
});
test("exported HTML has no missing local links, images, fonts, scripts, or media", async () => {
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((e) =>
          e.isDirectory() ? walk(resolve(dir, e.name)) : resolve(dir, e.name),
        ),
      )
    ).flat();
  }
  const pages = (await walk(output)).filter((p) => p.endsWith(".html"));
  for (const page of pages) {
    const html = await readFile(page, "utf8");
    for (const [, reference] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const url = reference.split(/[?#]/)[0].replaceAll("&amp;", "&");
      if (!url || /^(?:[a-z]+:|\/\/)/i.test(url)) continue;
      const target = url.startsWith("/")
        ? resolve(output, "." + decodeURIComponent(url))
        : resolve(dirname(page), decodeURIComponent(url));
      const info = await stat(target).catch(() => null);
      assert.ok(info, `${page}: ${url}`);
      if (info.isDirectory()) await stat(resolve(target, "index.html"));
    }
  }
});
test("production server serves routes and seekable media without exposing other files", async (t) => {
  const child = spawn(process.execPath, ["scripts/serve.mjs"], {
    cwd: website,
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  t.after(() => child.kill());
  const base = await new Promise((res, rej) => {
    const timer = setTimeout(
      () => rej(new Error("Server startup timed out")),
      10000,
    );
    child.once("error", rej);
    child.stdout.on("data", (buffer) => {
      const match = /ready on port (\d+)/.exec(String(buffer));
      if (match) {
        clearTimeout(timer);
        res(`http://127.0.0.1:${match[1]}`);
      }
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      rej(new Error(`Server exited: ${code}`));
    });
  });
  for (const path of ["/", "/guide/", "/skills/web/", "/film/"]) {
    const r = await fetch(base + path);
    assert.equal(r.status, 200, path);
    assert.match(r.headers.get("content-type"), /text\/html/);
  }
  const missing = await fetch(base + "/does-not-exist/");
  const compressed = await fetch(base + "/", {
    headers: { "Accept-Encoding": "gzip" },
  });
  assert.equal(compressed.headers.get("content-encoding"), "gzip");
  assert.equal(compressed.headers.get("vary"), "Accept-Encoding");
  assert.match(await compressed.text(), /Pixelcraft/);
  for (const [encoding, expected] of [
    ["gzip;q=0", null],
    ["br, gzip;q=0, *;q=1", null],
    ["GZip;q=0", null],
    ["identity", null],
    ["gzip;q=0.25", "gzip"],
    ["*;q=0.5", "gzip"],
  ]) {
    const negotiated = await fetch(base + "/", {
      headers: { "Accept-Encoding": encoding },
    });
    assert.equal(
      negotiated.headers.get("content-encoding"),
      expected,
      encoding,
    );
    assert.match(await negotiated.text(), /Pixelcraft/);
  }
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /This pixel is missing/);
  const media = await fetch(base + "/video/pixelcraft-promo.mp4", {
    headers: { range: "bytes=0-31" },
  });
  assert.equal(media.status, 206);
  assert.equal((await media.arrayBuffer()).byteLength, 32);
  assert.match(media.headers.get("content-range"), /^bytes 0-31\//);
  const suffix = await fetch(base + "/video/pixelcraft-promo.mp4", {
    headers: { range: "bytes=-20" },
  });
  assert.equal(suffix.status, 206);
  assert.equal((await suffix.arrayBuffer()).byteLength, 20);
  const bad = await fetch(base + "/video/pixelcraft-promo.mp4", {
    headers: { range: "bytes=999999999-" },
  });
  assert.equal(bad.status, 416);
  const head = await fetch(base + "/video/pixelcraft-promo.mp4", {
    method: "HEAD",
  });
  assert.equal(head.status, 200);
  assert.ok(Number(head.headers.get("content-length")) > 0);
  assert.equal((await head.text()).length, 0);
  for (const range of ["bytes=0-31", "bytes=999999999-", "invalid"]) {
    const probe = await fetch(base + "/video/pixelcraft-promo.mp4", {
      method: "HEAD",
      headers: { range },
    });
    assert.equal(probe.status, 200, range);
    assert.equal(
      probe.headers.get("content-length"),
      head.headers.get("content-length"),
    );
    assert.equal(probe.headers.get("content-range"), null);
    assert.equal((await probe.text()).length, 0);
  }
  assert.equal((await fetch(base + "/package.json")).status, 404);
  assert.equal((await fetch(base + "/%00")).status, 400);
  assert.equal((await fetch(base + "/%ZZ")).status, 400);
  assert.equal((await fetch(base + "/%2e%2e%2fpackage.json")).status, 403);
  assert.equal((await fetch(base + "/", { method: "POST" })).status, 405);
  // Cancel after the first chunk while the remaining video is backpressured.
  await Promise.all(
    Array.from(
      { length: 8 },
      () =>
        new Promise((res, rej) => {
          const request = get(
            base + "/video/pixelcraft-promo.mp4",
            (response) => {
              response.once("data", () => {
                request.destroy();
                res();
              });
            },
          );
          request.once("error", rej);
        }),
    ),
  );
  if (process.platform === "linux") {
    let openMedia = [];
    for (let attempt = 0; attempt < 10; attempt++) {
      await delay(50);
      const descriptors = await readdir(`/proc/${child.pid}/fd`);
      openMedia = (
        await Promise.all(
          descriptors.map((fd) =>
            readlink(`/proc/${child.pid}/fd/${fd}`).catch(() => ""),
          ),
        )
      ).filter(
        (target) => target === resolve(output, "video/pixelcraft-promo.mp4"),
      );
      if (!openMedia.length) break;
    }
    assert.equal(
      openMedia.length,
      0,
      "cancelled video streams must release their file descriptors",
    );
  }
});
