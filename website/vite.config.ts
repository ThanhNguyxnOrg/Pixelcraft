import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site under /<repository>/; CI passes that path as SITE_BASE.
const rawBase = process.env.SITE_BASE || "/";
const normalizedBase = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

function injectRepoMetaAndFontPreloads(): Plugin {
  return {
    name: "pixelcraft-inject-repo-meta",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
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
          "%PIXELCRAFT_EXHIBITS%": String(meta.totalGalleryExhibits),
          "%PIXELCRAFT_AGENTS%": String(meta.agentTargetCount),
        };
        const populated = Object.entries(tokens).reduce(
          (acc, [key, value]) => acc.split(key).join(value),
          html,
        );
        const tags: HtmlTagDescriptor[] = [];
        if (ctx.bundle) {
          for (const fileName of Object.keys(ctx.bundle)) {
            if (
              (fileName.includes("archivo-latin-standard-normal") ||
                fileName.includes("ibm-plex-mono-latin-400-normal")) &&
              fileName.endsWith(".woff2")
            ) {
              tags.push({
                tag: "link",
                attrs: {
                  rel: "preload",
                  as: "font",
                  type: "font/woff2",
                  crossorigin: "",
                  href: `${normalizedBase}${fileName}`,
                },
                injectTo: "head-prepend",
              });
            }
          }
        }
        return { html: populated, tags };
      },
    },
  };
}

export default defineConfig({
  base: normalizedBase,
  plugins: [react(), tailwindcss(), injectRepoMetaAndFontPreloads()],
  server: { host: "0.0.0.0" },
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react")) return "vendor";
          if (id.includes("node_modules/motion")) return "motion";
          if (id.includes("node_modules/gsap") || id.includes("@gsap/react"))
            return "choreography";
          if (id.includes("src/generated/") || id.includes("src/data.ts"))
            return "showcase-data";
        },
      },
    },
  },
});
