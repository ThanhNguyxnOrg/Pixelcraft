#!/usr/bin/env node
/**
 * Syncs live repository metadata (package.json, skills/*, references, scripts,
 * CLI agent targets, and stack ticker labels) into website/src/generated/repo-meta.json.
 * Zero external dependencies; safe to run in predev, prebuild, and CI.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(
    "Usage: node scripts/sync-repo-data.mjs\n\nGenerates src/generated/repo-meta.json from ../package.json, ../skills/*, and ../bin/pixelcraft.mjs.",
  );
  process.exit(0);
}

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(websiteRoot, "..");

const CATEGORY_MAP = {
  pixelcraft: "Core",
  "pixelcraft-plan": "Core",
  "pixelcraft-direction": "Core",
  "pixelcraft-craft": "System",
  "pixelcraft-tokens": "System",
  "pixelcraft-ux": "System",
  "pixelcraft-patterns": "System",
  "pixelcraft-dataviz": "System",
  "pixelcraft-accessibility": "System",
  "pixelcraft-brandkit": "System",
  "pixelcraft-web": "Platforms",
  "pixelcraft-mobile": "Platforms",
  "pixelcraft-data-apps": "Platforms",
  "pixelcraft-desktop": "Platforms",
  "pixelcraft-tui": "Platforms",
  "pixelcraft-extensions": "Platforms",
  "pixelcraft-game-ui": "Platforms",
  "pixelcraft-spatial": "Platforms",
  "pixelcraft-constrained": "Platforms",
  "pixelcraft-email": "Channels",
  "pixelcraft-document": "Channels",
  "pixelcraft-media": "Channels",
  "pixelcraft-chat-ui": "Channels",
  "pixelcraft-review": "Verify",
  "pixelcraft-visual-qa": "Verify",
  "pixelcraft-handoff": "Verify",
};

const SKILL_ORDER = Object.keys(CATEGORY_MAP);

// Maps real reference file basenames to concise stack/ecosystem labels for the hero ticker.
const REF_TO_STACKS = {
  "react-next": ["React 19", "Next.js", "TanStack Start", "React Router v7"],
  "vue-nuxt": ["Vue 3.5 / Vapor", "Nuxt 4", "Pinia"],
  svelte: ["Svelte 5", "SvelteKit 2"],
  solid: ["SolidJS", "SolidStart"],
  angular: ["Angular Signals"],
  astro: ["Astro 5"],
  qwik: ["Qwik"],
  "preact-fresh-hono": ["Preact", "Fresh", "Hono JSX"],
  "htmx-alpine": ["htmx 2", "Alpine.js", "Datastar"],
  "lit-web-components": ["Lit", "Web Components"],
  tailwind: ["Tailwind v4"],
  "styling-ecosystem": ["Panda CSS", "vanilla-extract", "StyleX", "UnoCSS"],
  "component-systems": ["Base UI", "Radix UI", "React Aria", "shadcn/ui"],
  "interaction-and-search-primitives": [
    "cmdk",
    "Vaul",
    "Sonner",
    "Embla",
    "Pagefind",
    "Orama",
  ],
  "state-architecture": ["TanStack Query", "Zustand", "XState"],
  "forms-validation": ["TanStack Form", "React Hook Form", "Zod v4"],
  "build-and-architecture": ["Vite 8 / Rolldown", "Rsbuild", "Biome"],
  "component-testing": ["Storybook", "Vitest Browser", "Playwright"],
  "rich-text-and-code-editors": [
    "Tiptap",
    "Lexical",
    "BlockNote",
    "CodeMirror 6",
    "Monaco",
  ],
  "canvas-and-node-editors": ["React Flow", "tldraw", "Konva"],
  "enterprise-data-ui": ["TanStack Table", "AG Grid", "FullCalendar"],
  "local-first-sync": ["Zero", "ElectricSQL", "Yjs", "PowerSync", "Convex"],
  "auth-and-checkout-ui": ["Better Auth", "Clerk", "Passkeys", "Stripe"],
  "i18n-engineering": [
    "i18next",
    "FormatJS",
    "Lingui",
    "Paraglide",
    "next-intl",
  ],
  "web-3d-engines": [
    "Three.js WebGPU/TSL",
    "Babylon.js",
    "Threlte",
    "TresJS",
    "PlayCanvas",
  ],
  "media-players": ["Vidstack", "hls.js", "Shaka Player", "Tone.js"],
  "server-rendered": [
    "Rails 8 / Hotwire",
    "Laravel Livewire",
    "Inertia.js v2",
    "Django",
    "Phoenix LiveView",
    "Blazor",
    "Go templ",
  ],
  "leptos-yew": ["Rust Leptos / Yew / Dioxus"],
  "kotlin-web": ["Kotlin/Wasm", "Kobweb"],
  "java-web": ["Vaadin / Hilla", "Thymeleaf"],
  swiftui: ["SwiftUI / Liquid Glass"],
  "jetpack-compose": ["Jetpack Compose / M3E"],
  flutter: ["Flutter / Impeller"],
  "react-native-expo": ["React Native / Expo"],
  lynxjs: ["LynxJS"],
  "kotlin-multiplatform": ["Kotlin Multiplatform"],
  "nativescript-and-skip": ["NativeScript", "Skip"],
  "harmonyos-and-emerging-mobile": ["HarmonyOS ArkUI", "LiveView Native"],
  "dotnet-maui": [".NET MAUI"],
  "reactive-data-apps": ["marimo", "Solara", "Mesop", "Taipy"],
  "ai-and-internal-data-apps": ["Chainlit", "FastHTML", "Retool"],
  streamlit: ["Streamlit"],
  gradio: ["Gradio 5/6"],
  "jupyter-widgets": ["AnyWidget", "Jupyter"],
  tauri: ["Tauri v2"],
  electron: ["Electron", "Electrobun"],
  "qt-pyside-qml": ["Qt 6 / PySide6 / QML"],
  "winui-wpf": ["WinUI 3 / WPF"],
  appkit: ["AppKit / SwiftUI macOS"],
  gtk: ["GTK4 / libadwaita"],
  avalonia: ["Avalonia 11"],
  "rust-gui": ["GPUI", "Slint", "Iced", "egui"],
  "go-gui": ["Wails v3", "Fyne", "Gio"],
  "cpp-gui": ["Dear ImGui", "FLTK", "Zig DVUI"],
  textual: ["Textual"],
  ink: ["Ink"],
  ratatui: ["Ratatui"],
  "bubbletea-lipgloss": ["Bubble Tea v2"],
  "extended-tui-toolkits": [
    "Terminal.Gui v2",
    "Spectre.Console",
    "OpenTUI",
    "FTXUI",
  ],
  mjml: ["MJML"],
  "react-email": ["React Email"],
  maizzle: ["Maizzle"],
  "pdf-tools": ["Typst", "WeasyPrint", "Playwright PDF", "Gotenberg", "Quarto"],
  "pdfjs-and-pptx": ["PDF.js", "PptxGenJS"],
  slides: ["Slidev", "reveal.js", "Marp"],
  "og-generation": ["Satori", "Takumi", "Sharp"],
  "banners-video": ["Remotion", "Motion Canvas", "FFmpeg"],
  "maps-geospatial": ["MapLibre", "PMTiles", "deck.gl", "Turf.js"],
  "ai-ui-libraries": [
    "Vercel AI SDK",
    "assistant-ui",
    "CopilotKit",
    "AG-UI",
    "MCP Apps",
  ],
  "browser-extensions": ["WXT / MV3", "VS Code Webviews", "Raycast"],
  "ide-and-saas-plugins": ["JetBrains Jewel", "Obsidian", "Shopify Polaris"],
  platforms: ["visionOS", "Android XR", "Horizon OS", "WebXR"],
  "tv-wearables": ["tvOS", "Compose for TV", "Wear OS", "Roku"],
  "voice-ui": ["Realtime Voice AI", "Siri App Intents"],
  "unity-ui-toolkit": ["Unity UI Toolkit"],
  "unity-ugui": ["Unity uGUI"],
  godot: ["Godot 4.5"],
  "unreal-umg": ["Unreal CommonUI"],
  bevy: ["Bevy"],
  "web-and-middleware-game-ui": ["Phaser", "RmlUi", "SDL3", "Raylib"],
  "token-tooling": [
    "DTCG Resolver",
    "Style Dictionary",
    "Terrazzo",
    "Figma MCP",
  ],
};

function parseDescription(skillMd) {
  const fm = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return "";
  const lines = fm[1].split(/\r?\n/);
  const idx = lines.findIndex((line) => /^description:\s*/.test(line));
  if (idx === -1) return "";
  let raw = lines[idx].replace(/^description:\s*/, "").trim();
  if (/^[|>][+-]?\d?$/.test(raw)) {
    const collected = [];
    for (let i = idx + 1; i < lines.length; i += 1) {
      if (!lines[i].trim()) {
        collected.push("");
        continue;
      }
      if (!/^[ \t]+/.test(lines[i])) break;
      collected.push(lines[i].trim());
    }
    raw = collected.filter(Boolean).join(" ");
  }
  let desc = raw.replace(/^["']|["']$/g, "");
  // Keep the first sentence for concise table display.
  const firstPeriod = desc.indexOf(". ");
  if (firstPeriod > 0) desc = desc.slice(0, firstPeriod + 1);
  return desc;
}

async function listSorted(dir, ext) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(ext))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

async function main() {
  const pkg = JSON.parse(
    await readFile(resolve(repoRoot, "package.json"), "utf8"),
  );
  const rawRepoUrl =
    typeof pkg.repository === "string"
      ? pkg.repository
      : pkg.repository?.url || "https://github.com/ThanhNguyxnOrg/Pixelcraft";
  const repoUrl = rawRepoUrl.replace(/^git\+/, "").replace(/\.git$/, "");

  // Parse canonical agent targets from bin/pixelcraft.mjs
  const cliSource = await readFile(
    resolve(repoRoot, "bin/pixelcraft.mjs"),
    "utf8",
  );
  const agentsMatch = cliSource.match(
    /const\s+canonicalAgents\s*=\s*\[([^\]]+)\]/,
  );
  const canonicalAgents = agentsMatch
    ? [...agentsMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])
    : [];

  // Discover all skills, references, and scripts live from skills/*
  const skillsDir = resolve(repoRoot, "skills");
  const skillDirs = (await readdir(skillsDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => {
      const ia = SKILL_ORDER.indexOf(a);
      const ib = SKILL_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

  const skills = [];
  const allRefSlugs = new Set();

  for (const name of skillDirs) {
    const skillPath = resolve(skillsDir, name);
    const skillMd = await readFile(resolve(skillPath, "SKILL.md"), "utf8");
    const refs = (await listSorted(resolve(skillPath, "references"), ".md"))
      .map((f) => f.replace(/\.md$/, ""))
      .sort((a, b) => a.localeCompare(b));
    const scripts = await listSorted(resolve(skillPath, "scripts"), ".mjs");
    for (const r of refs) allRefSlugs.add(r);

    const entry = {
      name,
      category: CATEGORY_MAP[name] ?? "Platforms",
      purpose: parseDescription(skillMd),
      references: refs,
    };
    if (scripts.length > 0) entry.scripts = scripts;
    skills.push(entry);
  }

  // Build deduplicated stack ticker list from references that actually exist on disk
  const stacks = [];
  const seen = new Set();
  for (const [slug, labels] of Object.entries(REF_TO_STACKS)) {
    if (!allRefSlugs.has(slug)) continue;
    for (const label of labels) {
      if (!seen.has(label)) {
        seen.add(label);
        stacks.push(label);
      }
    }
  }

  const totalReferences = skills.reduce((n, s) => n + s.references.length, 0);
  const totalScripts = skills.reduce((n, s) => n + (s.scripts?.length ?? 0), 0);

  // Parse live token formats from skills/pixelcraft-tokens/scripts/export-tokens.mjs
  const exporterSource = await readFile(
    resolve(repoRoot, "skills/pixelcraft-tokens/scripts/export-tokens.mjs"),
    "utf8",
  );
  const formatsMatch = exporterSource.match(
    /const\s+formats\s*=\s*\[([\s\S]*?)\];/,
  );
  const tokenFormats = formatsMatch
    ? [...formatsMatch[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1])
    : [];

  // Parse live slop-scan rules and extensions from skills/pixelcraft-review/scripts/slop-scan.mjs
  const slopSource = await readFile(
    resolve(repoRoot, "skills/pixelcraft-review/scripts/slop-scan.mjs"),
    "utf8",
  );
  const scanRules = [
    ...new Set(
      [...slopSource.matchAll(/\badd\(\s*['"]([a-z0-9-]+)['"]/g)].map(
        (m) => m[1],
      ),
    ),
  ].sort((a, b) => a.localeCompare(b));
  const extsMatch = slopSource.match(
    /const\s+exts\s*=\s*new\s+Set\(\[([\s\S]*?)\]\);/,
  );
  const scanExtensionCount = extsMatch
    ? [...extsMatch[1].matchAll(/['"]\.[a-z0-9]+['"]/gi)].length
    : 0;

  // Count live eval guides, cases, and JSON fixtures from evals/
  const evalDir = resolve(repoRoot, "evals");
  const evalGuideFiles = (await listSorted(evalDir, ".md")).filter((f) =>
    f.startsWith("pixelcraft"),
  );
  let totalEvalCases = 0;
  for (const f of evalGuideFiles) {
    const content = await readFile(resolve(evalDir, f), "utf8");
    totalEvalCases += (content.match(/^## Case\b/gm) || []).length;
  }
  const totalEvalFixtures = (
    await listSorted(resolve(evalDir, "fixtures"), ".json")
  ).length;

  // Count live gallery exhibit pairs under website/public/gallery/*
  const galleryDir = resolve(websiteRoot, "public/gallery");
  let totalGalleryExhibits = 0;
  try {
    const entries = await readdir(galleryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const files = await listSorted(resolve(galleryDir, entry.name), ".html");
      if (files.includes("before.html") && files.includes("after.html")) {
        totalGalleryExhibits += 1;
      }
    }
  } catch {
    totalGalleryExhibits = 0;
  }

  const meta = {
    version: pkg.version,
    npmPkg: pkg.name,
    license: pkg.license || "MIT",
    repoUrl,
    totalSkills: skills.length,
    totalReferences,
    totalScripts,
    canonicalAgents,
    agentTargetCount: canonicalAgents.length,
    tokenFormats,
    totalTokenFormats: tokenFormats.length,
    scanRules,
    totalScanRules: scanRules.length,
    scanExtensionCount,
    totalEvalGuides: evalGuideFiles.length,
    totalEvalCases,
    totalEvalFixtures,
    totalGalleryExhibits,
    stacks,
    skills,
  };

  const outPath = resolve(websiteRoot, "src/generated/repo-meta.json");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");

  console.log(
    `Synced repo-meta.json: ${meta.totalSkills} skills, ${meta.totalReferences} references, ${meta.totalScripts} scripts, ${meta.totalTokenFormats} token targets, ${meta.totalScanRules} slop rules, ${meta.totalEvalFixtures} eval fixtures, ${meta.agentTargetCount} agent targets, ${meta.stacks.length} stack ticker items.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
