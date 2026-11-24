import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site under /<repository>/; CI passes that path as SITE_BASE.
const base = process.env.SITE_BASE || "/";

function injectRepoMetaHtml(): Plugin {
  return {
    name: "pixelcraft-inject-repo-meta",
    transformIndexHtml(html) {
      const meta = JSON.parse(
        readFileSync(
          resolve(import.meta.dirname, "src/generated/repo-meta.json"),
          "utf8",
        ),
      );
      const tokens: Record<string, string> = {
        "%PIXELCRAFT_VERSION%": String(meta.version),
        "%PIXELCRAFT_SKILLS%": String(meta.totalSkills),
        "%PIXELCRAFT_REFS%": String(meta.totalReferences),
        "%PIXELCRAFT_SCRIPTS%": String(meta.totalScripts),
        "%PIXELCRAFT_FIXTURES%": String(meta.totalEvalFixtures),
      };
      return Object.entries(tokens).reduce(
        (acc, [key, value]) => acc.split(key).join(value),
        html,
      );
    },
  };
}

export default defineConfig({
  base: base.endsWith("/") ? base : `${base}/`,
  plugins: [react(), tailwindcss(), injectRepoMetaHtml()],
  server: { host: "0.0.0.0" },
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
  },
});
