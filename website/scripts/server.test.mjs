import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { request } from "node:http";

test("production server supports static assets, seekable media, gzip, HEAD and traversal rejection", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "pixelcraft-http-"));
  await writeFile(
    join(dir, "index.html"),
    "<!doctype html><title>Test</title>" + "body ".repeat(500),
  );
  await writeFile(join(dir, "clip.webm"), "0123456789");
  const server = spawn(
    process.execPath,
    [fileURLToPath(new URL("./serve.mjs", import.meta.url))],
    {
      env: { ...process.env, PORT: "0", SITE_ROOT: dir },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  t.after(async () => {
    server.kill();
    await rm(dir, { recursive: true, force: true });
  });
  const address = await new Promise((resolve, reject) => {
    let output = "";
    server.stdout.on("data", (chunk) => {
      output += chunk;
      const m = output.match(/port (\d+)/);
      if (m) resolve(`http://127.0.0.1:${m[1]}`);
    });
    server.once("error", reject);
    server.once("exit", (code) => reject(new Error(`server exited ${code}`)));
  });
  const page = await fetch(address);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<title>Test/);
  assert.equal(
    (await fetch(address, { method: "HEAD" })).headers.get("content-type"),
    "text/html; charset=utf-8",
  );
  const head = await fetch(address, { method: "HEAD" });
  assert.equal(await head.text(), "");
  const range = await fetch(`${address}/clip.webm`, {
    headers: { Range: "bytes=2-5" },
  });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get("content-range"), "bytes 2-5/10");
  assert.equal(range.headers.get("content-type"), "video/webm");
  assert.equal(await range.text(), "2345");
  const suffix = await fetch(`${address}/clip.webm`, {
    headers: { Range: "bytes=-3" },
  });
  assert.equal(await suffix.text(), "789");
  assert.equal(
    (await fetch(`${address}/clip.webm`, { headers: { Range: "bytes=999-" } }))
      .status,
    416,
  );
  const gzip = await fetch(address, { headers: { "Accept-Encoding": "gzip" } });
  assert.equal(gzip.headers.get("content-encoding"), "gzip");
  assert.match(await gzip.text(), /<title>Test/);
  assert.equal((await fetch(address, { method: "POST" })).status, 405);
  assert.equal((await fetch(`${address}/missing`)).status, 404);
  const raw = request(address, { path: "/%2e%2e%2fpackage.json" });
  raw.end();
  const [escaped] = await once(raw, "response");
  assert.equal(escaped.statusCode, 403);
  escaped.resume();
});
