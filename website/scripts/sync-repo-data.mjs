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
  "vue-nuxt": ["Vue 3.5", "Nuxt 4"],
  svelte: ["Svelte 5"],
  solid: ["SolidJS"],
  angular: ["Angular Signals"],
  astro: ["Astro"],
  qwik: ["Qwik"],
  "htmx-alpine": ["htmx", "Alpine.js"],
  "lit-web-components": ["Lit", "Web Components"],
  tailwind: ["Tailwind v4"],
  "styling-ecosystem": ["Panda CSS", "vanilla-extract", "StyleX", "UnoCSS"],
  "component-systems": ["Base UI", "Radix UI", "React Aria", "shadcn/ui"],
  "state-architecture": ["TanStack Query", "Zustand", "XState"],
  "forms-validation": ["TanStack Form", "React Hook Form", "Zod"],
  "build-and-architecture": ["Vite 8 / Rolldown", "Rsbuild", "Serwist"],
  "component-testing": ["Storybook", "Vitest Browser", "Playwright"],
  "rich-text-and-code-editors": ["Tiptap", "Lexical", "CodeMirror 6", "Monaco"],
  "canvas-and-node-editors": ["React Flow", "tldraw", "Konva"],
  "enterprise-data-ui": ["TanStack Table", "AG Grid", "FullCalendar"],
  "local-first-sync": ["Yjs", "Automerge", "Liveblocks"],
  "i18n-engineering": ["i18next", "FormatJS", "Lingui", "Paraglide"],
  "server-rendered": [
    "Rails / Hotwire",
    "Laravel Livewire",
    "Django",
    "Phoenix LiveView",
    "Blazor",
  ],
  swiftui: ["SwiftUI"],
  "jetpack-compose": ["Jetpack Compose"],
  flutter: ["Flutter"],
  "react-native-expo": ["React Native / Expo"],
  lynxjs: ["LynxJS"],
  "kotlin-multiplatform": ["Kotlin Multiplatform"],
  "dotnet-maui": [".NET MAUI"],
  "reactive-data-apps": ["marimo", "Solara", "Mesop"],
  streamlit: ["Streamlit"],
  gradio: ["Gradio"],
  tauri: ["Tauri v2"],
  electron: ["Electron"],
  "qt-pyside-qml": ["Qt / QML"],
  "winui-wpf": ["WinUI / WPF"],
  gtk: ["GTK"],
  "rust-gui": ["GPUI", "Slint", "egui"],
  textual: ["Textual"],
  ink: ["Ink"],
  ratatui: ["Ratatui"],
  "bubbletea-lipgloss": ["Bubble Tea"],
  "extended-tui-toolkits": ["Spectre.Console", "Terminal.Gui"],
  mjml: ["MJML"],
  "react-email": ["React Email"],
  maizzle: ["Maizzle"],
  "maps-geospatial": ["MapLibre", "deck.gl", "CesiumJS"],
  "web-3d-engines": ["Babylon.js", "Threlte", "TresJS"],
  "ai-ui-libraries": ["Vercel AI SDK", "assistant-ui", "CopilotKit"],
  "unity-ui-toolkit": ["Unity UI Toolkit"],
  godot: ["Godot"],
  "unreal-umg": ["Unreal UMG"],
  bevy: ["Bevy"],
  "token-tooling": ["Style Dictionary", "Figma Code Connect"],
};

function parseDescription(skillMd) {
  const fm = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return "";
  const match = fm[1].match(/^description:\s*(.+)$/m);
  if (!match) return "";
  let desc = match[1].trim().replace(/^["']|["']$/g, "");
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
    const refs = (
      await listSorted(resolve(skillPath, "references"), ".md")
    ).map((f) => f.replace(/\.md$/, ""));
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
    stacks,
    skills,
  };

  const outPath = resolve(websiteRoot, "src/generated/repo-meta.json");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");

  console.log(
    `Synced repo-meta.json: ${meta.totalSkills} skills, ${meta.totalReferences} references, ${meta.totalScripts} scripts, ${meta.agentTargetCount} agent targets, ${meta.stacks.length} stack ticker items.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
