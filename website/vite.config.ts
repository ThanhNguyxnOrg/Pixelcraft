import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site under /<repository>/; CI passes that path as SITE_BASE.
const base = process.env.SITE_BASE || "/";

export default defineConfig({
  base: base.endsWith("/") ? base : `${base}/`,
  plugins: [react(), tailwindcss()],
  server: { host: "0.0.0.0" },
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
  },
});
