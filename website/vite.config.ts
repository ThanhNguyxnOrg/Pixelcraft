import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: "0.0.0.0" },
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: { manualChunks: { choreography: ["gsap", "@gsap/react"] } },
    },
  },
});
