import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { marked } from "marked";

export const repository = "https://github.com/ThanhNguyxnOrg/Pixelcraft";
export const installBase = "npx skills add ThanhNguyxnOrg/Pixelcraft";
export const categories = [
  "All skills",
  "Core",
  "Surfaces",
  "Patterns",
  "Quality",
] as const;
export const metadata: Record<
  string,
  { category: string; summary: string; tags: string[] }
> = {
  pixelcraft: {
    category: "Core",
    summary:
      "The conductor. Detect the stack, frame the job, and run the full design-to-evidence loop.",
    tags: ["Orchestrator", "Start here"],
  },
  plan: {
    category: "Core",
    summary:
      "Map the repo before touching the pixels. Choose a stack with reasons, not reflexes.",
    tags: ["Discovery", "Architecture"],
  },
  direction: {
    category: "Core",
    summary:
      "Explore genuinely different visual worlds. Score them. Commit to one with intent.",
    tags: ["Art direction", "Divergence"],
  },
  craft: {
    category: "Core",
    summary:
      "Make type, color, composition, motion, imagery, and icons work as one system.",
    tags: ["Typography", "Composition"],
  },
  tokens: {
    category: "Core",
    summary:
      "Turn design decisions into portable tokens, from CSS to SwiftUI and Compose.",
    tags: ["DTCG", "Design systems"],
  },
  ux: {
    category: "Core",
    summary:
      "Start with the job to be done. Design flows, feedback, and the states in between.",
    tags: ["Flows", "States"],
  },
  web: {
    category: "Surfaces",
    summary:
      "Browser-native craft for HTML, React, Vue, Svelte, Astro, and server-rendered UI.",
    tags: ["Web", "Any framework"],
  },
  mobile: {
    category: "Surfaces",
    summary:
      "Respect the platform. Build with the idioms of SwiftUI, Compose, Flutter, and more.",
    tags: ["iOS", "Android"],
  },
  desktop: {
    category: "Surfaces",
    summary:
      "Real desktop behavior: windows, menus, keyboard navigation, and dense workspaces.",
    tags: ["Tauri", "Electron", "Qt"],
  },
  tui: {
    category: "Surfaces",
    summary:
      "Design for terminal cells, keyboard focus, and information that earns its space.",
    tags: ["Textual", "Ink", "Ratatui"],
  },
  "data-apps": {
    category: "Surfaces",
    summary:
      "Bring deliberate design to analytical tools built in Streamlit, Shiny, Dash, and beyond.",
    tags: ["Python", "R", "Julia"],
  },
  email: {
    category: "Surfaces",
    summary:
      "Create messages that hold together across email clients, dark mode, and image blocking.",
    tags: ["MJML", "React Email"],
  },
  document: {
    category: "Surfaces",
    summary:
      "Give PDFs, reports, invoices, and slides the same care as an interactive screen.",
    tags: ["Print", "PDF", "Slides"],
  },
  media: {
    category: "Surfaces",
    summary:
      "Design social cards, banners, and video with real crop, legibility, and export checks.",
    tags: ["OG images", "Video"],
  },
  "chat-ui": {
    category: "Surfaces",
    summary:
      "Use native messaging patterns, from Slack Block Kit to Telegram Mini Apps.",
    tags: ["Messaging", "Bot interfaces"],
  },
  constrained: {
    category: "Surfaces",
    summary:
      "Adapt to the hardware: TV, wearables, e-ink, kiosk, embedded, and voice interfaces.",
    tags: ["Hardware", "10-foot UI"],
  },
  extensions: {
    category: "Surfaces",
    summary:
      "Work inside the host: browser extensions, editor webviews, and plugin interfaces.",
    tags: ["Browser", "VS Code", "Plugins"],
  },
  spatial: {
    category: "Surfaces",
    summary:
      "Design for depth, comfort, and embodied interaction in visionOS, WebXR, and Quest.",
    tags: ["XR", "Spatial"],
  },
  "game-ui": {
    category: "Surfaces",
    summary:
      "Make HUDs, menus, and controller navigation legible in the middle of play.",
    tags: ["Unity", "Godot", "Unreal"],
  },
  patterns: {
    category: "Patterns",
    summary:
      "Translate product patterns into usable dashboards, editors, commerce, and settings.",
    tags: ["Product UI", "Interaction"],
  },
  dataviz: {
    category: "Patterns",
    summary:
      "Choose honest encodings, accessible palettes, and charts that answer real questions.",
    tags: ["Charts", "Data stories"],
  },
  brandkit: {
    category: "Core",
    summary:
      "Build coherent identity worlds, from art direction and moodboards to logo systems.",
    tags: ["Identity", "Brand worlds"],
  },
  handoff: {
    category: "Core",
    summary:
      "Translate an approved design faithfully. Preserve intent instead of redesigning it.",
    tags: ["Figma", "Design-to-code"],
  },
  accessibility: {
    category: "Quality",
    summary:
      "Apply the WCAG 2.2 AA floor with concrete checks for each platform.",
    tags: ["WCAG", "Inclusive design"],
  },
  review: {
    category: "Quality",
    summary:
      "Audit the experience, catch default patterns, and turn critique into specific fixes.",
    tags: ["Audit", "Polish"],
  },
  "visual-qa": {
    category: "Quality",
    summary:
      "Render it. Inspect it. Fix it. Report exactly what the evidence supports.",
    tags: ["Screenshots", "Evidence"],
  },
};

const root = resolve(process.cwd(), "../skills");
const names = readdirSync(root)
  .filter((name) => name.startsWith("pixelcraft"))
  .sort();
export const skills = names
  .map((name) => {
    const slug =
      name === "pixelcraft" ? "pixelcraft" : name.replace("pixelcraft-", "");
    const source = readFileSync(`${root}/${name}/SKILL.md`, "utf8");
    const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
    if (!metadata[slug]) throw new Error(`Missing website metadata: ${name}`);
    // Skill-relative reference links belong to the upstream skill, not this site's routes.
    const withLinks = body.replace(
      /\]\((?![a-z]+:|\/|#)([^)]+)\)/gi,
      `](${repository}/blob/main/skills/${name}/$1)`,
    );
    return {
      name,
      slug,
      ...metadata[slug],
      body,
      html: marked.parse(withLinks) as string,
      sourceUrl: `${repository}/blob/main/skills/${name}/SKILL.md`,
    };
  })
  .sort(
    (a, b) =>
      Object.keys(metadata).indexOf(a.slug) -
      Object.keys(metadata).indexOf(b.slug),
  );

export const steps = [
  [
    "Plan",
    "Understand before you build.",
    "Map the repo, read the constraints, and choose the stack that actually fits.",
  ],
  [
    "Frame",
    "Find the real job.",
    "Identify the audience, surface, material, and what a successful outcome means.",
  ],
  [
    "Diverge",
    "Explore before you commit.",
    "Generate far-apart directions. Score the tradeoffs. Choose one deliberately.",
  ],
  [
    "Specify",
    "Make the decisions explicit.",
    "Define tokens, flows, states, and the direction card before implementation.",
  ],
  [
    "Build",
    "Speak the platform’s language.",
    "Translate the system idiomatically. A mobile screen is not a small website.",
  ],
  [
    "Verify",
    "Look at what you made.",
    "Render, inspect, test the states, and repair what the evidence reveals.",
  ],
  [
    "Report",
    "Say what was actually checked.",
    "Separate rendered evidence from static checks, judgment, and unknowns.",
  ],
];
