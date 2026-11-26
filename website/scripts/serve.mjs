#!/usr/bin/env node
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: node scripts/serve.mjs\nServe the Vite production dist folder (or an immutable export via SITE_ROOT). PORT defaults to 4321. Supports HEAD, gzip, HTTP security headers, and media byte ranges.",
  );
  process.exit(0);
}
const root =
  process.env.SITE_ROOT || fileURLToPath(new URL("../dist/", import.meta.url));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".vtt": "text/vtt; charset=utf-8",
};

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "frame-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  );
  res.setHeader("Content-Security-Policy", CSP);
}

const base = resolve(root);
const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);
  const finish = (status, message) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(message);
  };
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return finish(405, "Method not allowed");
  }
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    return finish(400, "Invalid URL");
  }
  if (pathname.includes("\0")) return finish(400, "Invalid path");
  let path = resolve(base, `.${pathname}`);
  if (path !== base && !path.startsWith(base + sep))
    return finish(403, "Forbidden");
  let info;
  let status = 200;
  try {
    info = await stat(path);
    if (info.isDirectory()) {
      path = resolve(path, "index.html");
      info = await stat(path);
    }
    if (!info.isFile()) throw new Error("not file");
  } catch {
    path = resolve(base, "404.html");
    status = 404;
    try {
      info = await stat(path);
    } catch {
      return finish(404, "Not found");
    }
  }
  res.setHeader(
    "Content-Type",
    mime[extname(path)] ?? "application/octet-stream",
  );
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader(
    "Cache-Control",
    pathname.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : /^\/(?:fonts|gallery)\//.test(pathname) &&
          /\.(?:woff2?|webp|png|jpg)$/.test(pathname)
        ? "public, max-age=86400"
        : "no-cache",
  );
  let start = 0;
  let end = info.size - 1;
  if (req.method === "GET" && req.headers.range && status === 200) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!match || (!match[1] && !match[2])) {
      res.setHeader("Content-Range", `bytes */${info.size}`);
      return finish(416, "Invalid range");
    }
    start = match[1]
      ? Number(match[1])
      : Math.max(0, info.size - Number(match[2]));
    end =
      match[1] && match[2]
        ? Math.min(Number(match[2]), info.size - 1)
        : info.size - 1;
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start > end ||
      start >= info.size
    ) {
      res.setHeader("Content-Range", `bytes */${info.size}`);
      return finish(416, "Invalid range");
    }
    status = 206;
    res.setHeader("Content-Range", `bytes ${start}-${end}/${info.size}`);
  }
  const encodings = (req.headers["accept-encoding"] ?? "")
    .toLowerCase()
    .split(",")
    .map((entry) => entry.split(";").map((part) => part.trim()));
  const quality = (coding) => {
    const entry = encodings.find(([name]) => name === coding);
    if (!entry) return undefined;
    const q = entry.slice(1).find((part) => /^q\s*=/.test(part));
    return q ? Number(q.split("=")[1]) : 1;
  };
  const gzipQuality = quality("gzip") ?? quality("*") ?? 0;
  const gzip =
    status !== 206 &&
    info.size > 0 &&
    gzipQuality > 0 &&
    gzipQuality <= 1 &&
    /\.(?:html|css|js|json|xml|txt|webmanifest|svg|vtt)$/.test(path);
  res.setHeader("Vary", "Accept-Encoding");
  if (gzip) res.setHeader("Content-Encoding", "gzip");
  else res.setHeader("Content-Length", end - start + 1);
  res.writeHead(status);
  if (req.method === "HEAD" || info.size === 0) return res.end();
  const stream = createReadStream(path, { start, end });
  // pipeline closes the file and compressor when the client cancels the response.
  pipeline(stream, ...(gzip ? [createGzip()] : []), res, () => {});
});
server.listen(Number(process.env.PORT ?? 4321), "0.0.0.0", () =>
  console.log(
    `Pixelcraft production server ready on port ${server.address().port}`,
  ),
);
