// All counts, names, and commands below are copied from the Pixelcraft repository
// (README.md, skills/*, package.json). Nothing here is invented proof.

export const REPO_URL = "https://github.com/ThanhNguyxnOrg/Pixelcraft";
export const VERSION = "0.1.0";
export const NPM_PKG = "@thanhnguyxn/pixelcraft";

export type Category = "Core" | "System" | "Platforms" | "Channels" | "Verify";

export type Skill = {
  name: string;
  category: Category;
  purpose: string;
  references: string[];
  scripts?: string[];
};

export const SKILLS: Skill[] = [
  {
    name: "pixelcraft",
    category: "Core",
    purpose:
      "Orchestrator: stack and surface detection, mode classification, the plan-first loop, mandatory floor, evidence-labeled reporting.",
    references: [
      "design-brief",
      "floor",
      "report-template",
      "stack-detection",
      "surface-acceptance",
      "workflow-checkpoints",
    ],
  },
  {
    name: "pixelcraft-plan",
    category: "Core",
    purpose:
      "Step zero: brownfield repo mapping, greenfield intake, weighted stack selection, .pixelcraft/plan.md.",
    references: [
      "design-input",
      "plan-template",
      "repo-discovery",
      "stack-freshness",
      "stack-selection",
    ],
  },
  {
    name: "pixelcraft-direction",
    category: "Core",
    purpose:
      "Divergent visual directions, scoring, direction cards, repetition history, anti-slop fingerprints, design movements.",
    references: [
      "composition-library",
      "direction-card",
      "direction-scoring",
      "movements",
      "repetition-history",
      "slop-fingerprints",
      "wildcards",
    ],
  },
  {
    name: "pixelcraft-craft",
    category: "System",
    purpose:
      "Typography, color, layout, motion, imagery, and icon craft across platforms.",
    references: [
      "color",
      "imagery-icons",
      "layout-quality",
      "layout",
      "motion",
      "typography",
    ],
  },
  {
    name: "pixelcraft-tokens",
    category: "System",
    purpose: "DTCG token structure and multi-platform token export.",
    references: [
      "adoption",
      "format",
      "governance",
      "state-tokens",
      "theme-presets",
    ],
    scripts: ["export-tokens.mjs"],
  },
  {
    name: "pixelcraft-ux",
    category: "System",
    purpose:
      "JTBD, flows, information architecture, state matrices, forms, feedback, i18n UX, UX writing.",
    references: [
      "cognitive-walkthrough",
      "feedback-performance",
      "flows-ia",
      "forms",
      "i18n",
      "laws",
      "locale-test-matrix",
      "state-matrix",
      "usability-testing",
      "ux-writing",
    ],
  },
  {
    name: "pixelcraft-patterns",
    category: "System",
    purpose:
      "Dashboard/admin, commerce, editors and canvas, communication, auth and onboarding, marketing, settings, search, tables/CRUD.",
    references: [
      "auth-onboarding",
      "commerce",
      "communication",
      "creative-tools",
      "dashboard-admin",
      "marketing",
      "pattern-selection",
      "search-filtering",
      "settings",
      "tables-crud",
    ],
  },
  {
    name: "pixelcraft-dataviz",
    category: "System",
    purpose:
      "Chart choice, encoding, truthful labeling, colorblind-safe palettes, dashboards, streaming, graphs, maps, chart accessibility.",
    references: [
      "chart-choice",
      "color-accessibility",
      "encoding-tables-dashboards",
      "libraries",
      "realtime-graphs-maps-scale",
    ],
  },
  {
    name: "pixelcraft-accessibility",
    category: "System",
    purpose:
      "WCAG 2.2 AA floor translated into concrete platform checks and verification methods.",
    references: ["apg-patterns", "platforms", "verification", "wcag22-checks"],
  },
  {
    name: "pixelcraft-brandkit",
    category: "System",
    purpose:
      "Brand kits, identity boards, logo systems, moodboards, visual-world presentations, brand prompting and QA.",
    references: [
      "asset-pipeline",
      "brand-governance",
      "layouts",
      "logo-concepting",
      "logo-methods",
      "pixel-art-logos",
      "prompt-template",
      "qa-checklist",
      "visual-modes",
    ],
  },
  {
    name: "pixelcraft-web",
    category: "Platforms",
    purpose:
      "HTML/CSS, React/Next, Vue/Nuxt, Svelte, Solid, Angular, Astro, Qwik, htmx/Alpine, Lit, Tailwind v4, server-rendered and compile-to-JS web.",
    references: [
      "adaptive-layout",
      "angular",
      "astro",
      "clojurescript",
      "elm",
      "fsharp-fable",
      "html-css",
      "htmx-alpine",
      "java-web",
      "kotlin-web",
      "leptos-yew",
      "lit-web-components",
      "pwa",
      "qwik",
      "react-next",
      "scala-laminar",
      "server-rendered",
      "solid",
      "svelte",
      "tailwind",
      "vue-nuxt",
    ],
  },
  {
    name: "pixelcraft-mobile",
    category: "Platforms",
    purpose:
      "SwiftUI, UIKit, Jetpack Compose, Flutter, React Native/Expo, Kotlin Multiplatform, Ionic/Capacitor, .NET MAUI, Flet, Kivy.",
    references: [
      "dotnet-maui",
      "flet",
      "flutter",
      "ionic-capacitor",
      "jetpack-compose",
      "kivy",
      "kotlin-multiplatform",
      "react-native-expo",
      "swiftui",
      "task-state-composition",
      "uikit",
    ],
  },
  {
    name: "pixelcraft-data-apps",
    category: "Platforms",
    purpose:
      "Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny, Jupyter widgets, R Shiny, Julia Genie, Observable Framework, Evidence.",
    references: [
      "dash",
      "evidence",
      "gradio",
      "julia-genie",
      "jupyter-widgets",
      "nicegui",
      "observable-framework",
      "panel",
      "r-shiny",
      "reflex",
      "shiny",
      "streamlit",
    ],
  },
  {
    name: "pixelcraft-desktop",
    category: "Platforms",
    purpose:
      "Tauri, Electron, Qt/PySide/QML, WinUI/WPF, AppKit, GTK, Avalonia, Rust GUI, JavaFX/Swing, C++ GUI, Go GUI, Uno.",
    references: [
      "appkit",
      "avalonia",
      "cpp-gui",
      "electron",
      "go-gui",
      "gtk",
      "javafx-swing",
      "qt-pyside-qml",
      "rust-gui",
      "tauri",
      "uno-platform",
      "winui-wpf",
      "working-context",
    ],
  },
  {
    name: "pixelcraft-tui",
    category: "Platforms",
    purpose: "Textual, Rich, Ink, Bubble Tea/Lip Gloss, Ratatui.",
    references: ["bubbletea-lipgloss", "ink", "ratatui", "rich", "textual"],
  },
  {
    name: "pixelcraft-extensions",
    category: "Platforms",
    purpose:
      "Browser MV3 extensions, Shadow DOM content-script UI, VS Code webviews, Raycast commands, and Office plugins.",
    references: ["browser-extensions", "raycast", "vscode-webviews"],
  },
  {
    name: "pixelcraft-game-ui",
    category: "Platforms",
    purpose:
      "Unity UI Toolkit, Godot, Unreal UMG, LÖVE2D, Bevy, MonoGame, HUD principles.",
    references: [
      "bevy",
      "godot",
      "hud-principles",
      "love2d",
      "monogame",
      "unity-ui-toolkit",
      "unreal-umg",
    ],
  },
  {
    name: "pixelcraft-spatial",
    category: "Platforms",
    purpose:
      "visionOS, WebXR/Three.js/R3F/A-Frame, Quest Interaction SDK, Unity XRI, XR comfort and accessibility.",
    references: ["comfort-accessibility", "platforms"],
  },
  {
    name: "pixelcraft-constrained",
    category: "Platforms",
    purpose:
      "TV and 10-foot UI, wearables, e-ink, kiosk, embedded/LVGL, automotive templates, voice UI.",
    references: ["specialized-hardware", "tv-wearables", "voice-ui"],
  },
  {
    name: "pixelcraft-email",
    category: "Channels",
    purpose:
      "Table HTML email, MJML, React Email, client quirks, dark mode, image blocking, plaintext.",
    references: ["client-quirks", "html-tables", "mjml", "react-email"],
  },
  {
    name: "pixelcraft-document",
    category: "Channels",
    purpose:
      "Print CSS and paged media, PDF pipelines, invoices, reports, CVs, slides, projector legibility.",
    references: ["archetypes", "pdf-tools", "print-css", "slides"],
  },
  {
    name: "pixelcraft-media",
    category: "Channels",
    purpose:
      "OG and social cards, SVG banners, platform safe zones, thumbnail legibility, Remotion/Motion Canvas.",
    references: ["banners-video", "og-generation", "social-cards"],
  },
  {
    name: "pixelcraft-chat-ui",
    category: "Channels",
    purpose:
      "Slack Block Kit, Discord components, Telegram Mini Apps, Zalo, WhatsApp, Teams Adaptive Cards, conversation design.",
    references: [
      "conversation-design",
      "mobile-business-platforms",
      "slack-discord",
    ],
  },
  {
    name: "pixelcraft-review",
    category: "Verify",
    purpose:
      "Audit, critique, and polish modes, severity taxonomy, Nielsen checks, persona walkthroughs, slop scanning.",
    references: [
      "audit-report",
      "critique-protocol",
      "heuristics",
      "personas",
      "polish",
    ],
    scripts: ["slop-scan.mjs"],
  },
  {
    name: "pixelcraft-visual-qa",
    category: "Verify",
    purpose:
      "Render, screenshot, self-critique, fix. Capture matrices, contrast/overflow/clipping audits, performance budgets.",
    references: [
      "baseline-governance",
      "capture-desktop-game",
      "capture-email",
      "capture-mobile",
      "capture-terminal",
      "critique-rubric",
      "finish-gate",
      "measured-craft",
      "performance-budgets",
      "task-verification",
    ],
    scripts: ["finish-gate.mjs", "shoot.mjs", "style-inventory.mjs"],
  },
  {
    name: "pixelcraft-handoff",
    category: "Verify",
    purpose:
      "Approved-design translation, variables-to-token mapping, component reuse, missing states, visual fidelity loops.",
    references: ["design-translation", "fidelity-tolerance"],
  },
];

export const CATEGORIES: { id: Category; blurb: string }[] = [
  { id: "Core", blurb: "Run first. Plan, frame, diverge." },
  { id: "System", blurb: "Craft, tokens, UX, patterns, data, access, brand." },
  { id: "Platforms", blurb: "Idiomatic translation per rendering surface." },
  { id: "Channels", blurb: "Constrained media: email, print, social, chat." },
  { id: "Verify", blurb: "Critique, rendered QA, design handoff." },
];

export const TOTAL_REFERENCES = SKILLS.reduce(
  (n, s) => n + s.references.length,
  0,
);
export const TOTAL_SCRIPTS = SKILLS.reduce(
  (n, s) => n + (s.scripts?.length ?? 0),
  0,
);

export type EvidenceLabel =
  | "rendered"
  | "static"
  | "model-judgment"
  | "not-checked"
  | "waived";

export const EVIDENCE: { id: EvidenceLabel; meaning: string }[] = [
  {
    id: "rendered",
    meaning:
      "Inspected actual rendered output: screenshot, device, simulator, snapshot, or browser surface.",
  },
  {
    id: "static",
    meaning:
      "Inferred from source, schema, configuration, or deterministic static analysis.",
  },
  {
    id: "model-judgment",
    meaning: "Heuristic or model evaluation. A useful hypothesis, not proof.",
  },
  {
    id: "not-checked",
    meaning: "Relevant but not inspected. State why when it matters.",
  },
  {
    id: "waived",
    meaning:
      "The user or brief explicitly overrides the rule. Scope and consequence are recorded.",
  },
];

export type Phase = {
  id: string;
  name: string;
  does: string;
  skills: string[];
  artifact: string;
  gate: string;
};

export const PHASES: Phase[] = [
  {
    id: "plan",
    name: "Plan",
    does: "Map the existing repository systematically, or intake a greenfield brief and justify the stack with a weighted matrix.",
    skills: ["pixelcraft-plan"],
    artifact: ".pixelcraft/plan.md",
    gate: "No visual direction before stack, constraints, and ownership are recorded.",
  },
  {
    id: "frame",
    name: "Frame",
    does: "Detect stack, surface mode, input modality, audience, job-to-be-done, real material, and locale scope.",
    skills: ["pixelcraft"],
    artifact: "design brief",
    gate: "Every fact is classed: user-provided, repo-observed, research, assumption, or unknown.",
  },
  {
    id: "diverge",
    name: "Diverge",
    does: "Sample 3–5 far-apart directions with conventional-choice probabilities, score them, and log why each loser lost.",
    skills: ["pixelcraft-direction", "pixelcraft-brandkit"],
    artifact: ".pixelcraft/history.json",
    gate: "Every pair of directions differs on at least three axes. Approved designs are never rediverged.",
  },
  {
    id: "specify",
    name: "Specify",
    does: "Write the direction card, DTCG tokens, flows, and the state matrix before component trivia.",
    skills: [
      "pixelcraft-tokens",
      "pixelcraft-ux",
      "pixelcraft-patterns",
      "pixelcraft-dataviz",
      "pixelcraft-handoff",
    ],
    artifact: "direction card · tokens.json",
    gate: "One signature element, explicit taboos, and every empty, loading, error, and offline state named.",
  },
  {
    id: "build",
    name: "Build",
    does: "Translate the direction idiomatically into the actual stack, with the floor applied by default rather than as cleanup.",
    skills: [
      "pixelcraft-web",
      "pixelcraft-mobile",
      "pixelcraft-desktop",
      "pixelcraft-tui",
      "+9 more",
    ],
    artifact: "code in the resolved stack",
    gate: "Version-sensitive APIs are checked against official docs; no floating @latest in CI.",
  },
  {
    id: "verify",
    name: "Verify",
    does: "Slop scan, heuristic critique, accessibility and state review, then rendered capture through the finish gate.",
    skills: [
      "pixelcraft-review",
      "pixelcraft-visual-qa",
      "pixelcraft-accessibility",
    ],
    artifact: "slop-scan.mjs · shoot.mjs · finish-gate.mjs",
    gate: "At most three repair rounds, then remaining defects are reported as OPEN.",
  },
  {
    id: "report",
    name: "Report",
    does: "State decisions, the selected direction and why, verification by evidence label, waivers, and open risks.",
    skills: ["pixelcraft"],
    artifact: "final report",
    gate: "No claim of visual quality because the app compiled or a page loaded.",
  },
];

export const FLOOR: { name: string; rule: string }[] = [
  {
    name: "Truthfulness",
    rule: "No invented facts, proof, assets, metrics, logos, or testimonials.",
  },
  {
    name: "Accessibility",
    rule: "Semantic controls, names and labels, keyboard path, contrast floor, reduced motion, text scaling, no color-only meaning.",
  },
  {
    name: "Interaction",
    rule: "Visible feedback, suitable targets, cancel/undo/escape, no conflicting gestures, complete states.",
  },
  {
    name: "Adaptation",
    rule: "Restructure across sizes, orientations, input modalities, and platform idioms.",
  },
  {
    name: "Localization",
    rule: "Expansion, directionality, script fallback, input composition, plurals, locale formats, cultural fit.",
  },
  {
    name: "Performance",
    rule: "Fast acknowledgment, stable layout, asset budgets, nonblocking interaction.",
  },
  {
    name: "Robustness",
    rule: "Zero, one, many, long, missing, error, offline, permission, interruption, concurrency.",
  },
  {
    name: "Coherence",
    rule: "Semantic tokens and consistent hierarchy, affordances, motion, iconography, copy.",
  },
  {
    name: "Distinctiveness",
    rule: "At least one deliberate subject-specific commitment when the mode permits.",
  },
  { name: "Verifiability", rule: "No claim without an evidence label." },
];

export type Finding = {
  rule: string;
  severity: "P0" | "P1" | "P2" | "P3";
  target: string;
  fix: string;
};

// Rule IDs are the real identifiers emitted by skills/pixelcraft-review/scripts/slop-scan.mjs.
export const SPECIMEN_FINDINGS: Finding[] = [
  {
    rule: "outline-removed",
    severity: "P0",
    target: "CTA button",
    fix: "Restore a visible :focus-visible outline.",
  },
  {
    rule: "purple-blue-gradient",
    severity: "P2",
    target: "hero background",
    fix: "Use color with a physical or symbolic basis.",
  },
  {
    rule: "generic-copy",
    severity: "P2",
    target: "headline",
    fix: "Make a subject-specific claim with evidence.",
  },
  {
    rule: "emoji-as-icon",
    severity: "P2",
    target: "feature icons",
    fix: "Use one coherent icon system, or text.",
  },
  {
    rule: "centered-hero-two-ctas",
    severity: "P3",
    target: "hero layout",
    fix: "Order hierarchy by the user’s decision.",
  },
  {
    rule: "rounded-2xl-repetition",
    severity: "P3",
    target: "feature cards",
    fix: "Derive radius from component semantics.",
  },
];

export const SCAN_DISCLAIMER =
  "A zero score means only that these known fingerprints were not detected; zero findings is not evidence of good design.";

export type Direction = {
  id: string;
  name: string;
  p: number;
  score: number;
  verdict: string;
  won?: boolean;
};

// The divergence actually run for this page; mirrors .pixelcraft/plan.md.
export const THIS_PAGE_DIRECTIONS: Direction[] = [
  {
    id: "A",
    name: "Neon launch page",
    p: 0.55,
    score: 19,
    verdict:
      "Depends on two slop fingerprints: a centered hero over three cards, and a decorative gradient wash.",
  },
  {
    id: "B",
    name: "Swiss specification sheet",
    p: 0.15,
    score: 23,
    verdict: "Abandons the navy pixel brand the project already owns.",
  },
  {
    id: "C",
    name: "Agent terminal transcript",
    p: 0.2,
    score: 17,
    verdict:
      "Fake-terminal risk; long prose in monospace hurts scanning 26 skills.",
  },
  {
    id: "D",
    name: "Evidence ledger on a pixel grid",
    p: 0.1,
    score: 25,
    verdict:
      "The page proves its own process, keeps the owned brand, and scales to an index.",
    won: true,
  },
];

export type InstallMethod = {
  id: string;
  label: string;
  note: string;
  lines: string[];
};

// Commands come from the published package (`pixelcraft --help`, 0.1.0) and the README.
export const INSTALL: InstallMethod[] = [
  {
    id: "wizard",
    label: "npx wizard",
    note: "Interactive: pick agents, skills, and project or user scope. Node.js 18 or newer.",
    lines: [`npx ${NPM_PKG}`],
  },
  {
    id: "global",
    label: "npm global",
    note: "Installs the `pixelcraft` command once; then add skills to any project.",
    lines: [`npm i -g ${NPM_PKG}`, "pixelcraft add all --agent claude"],
  },
  {
    id: "skills",
    label: "skills CLI",
    note: "Cross-agent discovery from GitHub. Requires Node.js 22.20 or newer.",
    lines: ["npx skills add ThanhNguyxnOrg/Pixelcraft"],
  },
  {
    id: "claude",
    label: "Claude Code plugin",
    note: "Plugin-managed updates inside Claude Code.",
    lines: [
      "/plugin marketplace add ThanhNguyxnOrg/Pixelcraft",
      "/plugin install pixelcraft@pixelcraft",
    ],
  },
  {
    id: "curl",
    label: "curl / bash",
    note: "Linux and macOS without Node.js. Never uses sudo.",
    lines: [
      "curl -fsSL https://raw.githubusercontent.com/ThanhNguyxnOrg/Pixelcraft/main/install.sh | bash -s -- --agent claude --skills all",
    ],
  },
  {
    id: "pwsh",
    label: "PowerShell",
    note: "Windows without Node.js. Installs into .agents/skills.",
    lines: [
      "irm https://raw.githubusercontent.com/ThanhNguyxnOrg/Pixelcraft/main/install.ps1 | iex",
    ],
  },
];

export type AgentTarget = {
  id: string;
  label: string;
  project: string;
  global: string;
  also?: string;
};

// Paths from `pixelcraft --help` (0.1.0). `also` lists adapter files the README says are written alongside the skills.
export const AGENT_TARGETS: AgentTarget[] = [
  {
    id: "claude",
    label: "Claude Code",
    project: ".claude/skills",
    global: "~/.claude/skills",
    also: ".claude/commands/*.md",
  },
  {
    id: "codex",
    label: "Codex",
    project: ".agents/skills",
    global: "~/.agents/skills",
  },
  {
    id: "cursor",
    label: "Cursor",
    project: ".cursor/skills",
    global: "~/.cursor/skills",
    also: ".cursor/rules/pixelcraft.mdc",
  },
  {
    id: "gemini",
    label: "Gemini CLI",
    project: ".gemini/skills",
    global: "~/.gemini/skills",
  },
  {
    id: "copilot",
    label: "GitHub Copilot",
    project: ".github/skills",
    global: "~/.copilot/skills",
    also: "instruction and prompt files",
  },
  {
    id: "opencode",
    label: "OpenCode",
    project: ".opencode/skills",
    global: "~/.config/opencode/skills",
  },
  {
    id: "windsurf",
    label: "Windsurf",
    project: ".windsurf/skills",
    global: "~/.codeium/windsurf/skills",
    also: "rules, memory, and workflow routers",
  },
  {
    id: "kiro",
    label: "Kiro",
    project: ".kiro/skills",
    global: "~/.kiro/skills",
    also: "steering adapter",
  },
  {
    id: "cline",
    label: "Cline",
    project: ".cline/skills",
    global: "~/.cline/skills",
  },
  {
    id: "roo",
    label: "Roo Code",
    project: ".roo/skills",
    global: "~/.roo/skills",
  },
  {
    id: "droid",
    label: "Factory Droid",
    project: ".factory/skills",
    global: "~/.factory/skills",
  },
  {
    id: "antigravity",
    label: "Antigravity",
    project: ".agents/skills",
    global: "~/.gemini/config/skills",
  },
  {
    id: "devin",
    label: "Devin",
    project: ".agents/skills",
    global: "~/.agents/skills",
  },
  {
    id: "agents",
    label: "Generic .agents",
    project: ".agents/skills",
    global: "~/.agents/skills",
  },
];

// The package always installs these two when any subset is requested (real CLI output: "including required core skill(s)").
export const REQUIRED_SKILLS = ["pixelcraft", "pixelcraft-plan"];

export const AGENTS = [
  "Claude Code",
  "Codex",
  "Cursor",
  "Gemini CLI",
  "GitHub Copilot",
  "OpenCode",
  "Windsurf",
  "Kiro",
  "Cline",
  "Roo Code",
  "Factory Droid",
  "Google Antigravity",
  "Amp",
  "Zed",
  "Goose",
  "Devin",
  "Pi",
];

// From the README "Supported stacks" table; a sample, not the full list.
export const STACKS = [
  "React",
  "Next.js",
  "Vue",
  "Nuxt",
  "Svelte",
  "Solid",
  "Angular",
  "Astro",
  "Qwik",
  "htmx",
  "Lit",
  "Tailwind v4",
  "Rails / Hotwire",
  "Laravel Livewire",
  "Django",
  "Phoenix LiveView",
  "Blazor",
  "SwiftUI",
  "Jetpack Compose",
  "Flutter",
  "React Native",
  "Kotlin Multiplatform",
  ".NET MAUI",
  "Streamlit",
  "Gradio",
  "Tauri",
  "Electron",
  "Qt / QML",
  "WinUI",
  "GTK",
  "Textual",
  "Ink",
  "Ratatui",
  "Bubble Tea",
  "MJML",
  "React Email",
  "Unity UI Toolkit",
  "Godot",
  "Unreal UMG",
  "Bevy",
  "visionOS",
  "WebXR",
];

export type Chapter = { res: number; title: string; body: string };

// Resolution steps map to the Pixelcraft loop; the hero logo is the specimen.
export const THESIS: Chapter[] = [
  {
    res: 1,
    title: "The average.",
    body: "Models have seen the same landing pages thousands of times. Ask for a design and you get their mean: a centered hero, a gradient, three cards. At one pixel, every logo is this color.",
  },
  {
    res: 4,
    title: "Structure before style.",
    body: "Pixelcraft plans before it paints. It maps the repository, scores the stack with a weighted matrix, and classifies every fact in the brief as observed, assumed, or unknown.",
  },
  {
    res: 16,
    title: "Then, divergence.",
    body: "Three to five far-apart directions, each with the probability a typical model would pick it. They are scored against evidence, and the losers’ reasons are logged. The likely one often loses.",
  },
  {
    res: 512,
    title: "Detail you can verify.",
    body: "The floor is applied while building, not after. Findings are labeled rendered, static, model-judgment, not-checked, or waived, so a page that compiles is never mistaken for one that was inspected.",
  },
];

// ---------- gallery ----------
import galleryEvidence from "./generated/gallery.json";

export type ScanFinding = {
  rule: string;
  severity: "P0" | "P1" | "P2" | "P3";
  line: number;
  snippet: string;
  fix: string;
  pin?: { x: number; y: number };
};
export type ScanResult = { score: number; findings: ScanFinding[] };

export type GalleryItem = {
  id: string;
  title: string;
  kind: string;
  mode: "Persuade" | "Operate";
  brief: string;
  direction: string;
  decisions: string[];
  skills: string[];
  /** Review notes the static scanner cannot see. Labeled model-judgment on the page. */
  judgment: string[];
  /** Honest limits for this exhibit. */
  limits: string[];
  scanBefore: ScanResult;
  scanAfter: ScanResult;
  before: string;
  after: string;
  liveBefore: string;
  liveAfter: string;
};

const scans = galleryEvidence.items as unknown as Record<
  string,
  { before: ScanResult; after: ScanResult }
>;
const pair = (id: string) => ({
  scanBefore: scans[id].before,
  scanAfter: scans[id].after,
  before: `/gallery/${id}/before.webp`,
  after: `/gallery/${id}/after.webp`,
  liveBefore: `/gallery/${id}/before.html`,
  liveAfter: `/gallery/${id}/after.html`,
});

// Scores, findings, and screenshots are generated by scripts/capture-gallery.mjs; the prose below is authored.
export const GALLERY: GalleryItem[] = [
  {
    id: "coffee",
    title: "Small-batch roaster",
    kind: "Landing page",
    mode: "Persuade",
    brief: "A coffee landing page, built around the roast. Fictional brand.",
    direction: "Roast-curve data sheet",
    decisions: [
      "A roast curve becomes the hero. Amber marks the data and one clear action.",
      "Condensed headlines, quiet body copy, mono readings. Each has one job.",
      "The fictional offer is specific: roasted Tuesday, delivered Friday.",
    ],
    skills: [
      "pixelcraft-direction",
      "pixelcraft-craft",
      "pixelcraft-web",
      "pixelcraft-review",
    ],
    judgment: [
      "The default could sell anything. The revision only makes sense for coffee.",
      "One purchase action replaces two equally loud buttons.",
    ],
    limits: [
      "Single viewport captured at 1440 x 900. Mobile layout not captured.",
    ],
    ...pair("coffee"),
  },
  {
    id: "clinic",
    title: "Clinic booking form",
    kind: "Form and states",
    mode: "Operate",
    brief:
      "Choose a time and confirm an appointment at a clinic. Fictional clinic and patient.",
    direction: "Quiet clinical form with a live summary",
    decisions: [
      "Every field has a persistent label. Placeholders are never the only name.",
      'Availability is stated in words and strikethrough ("Full"), not color alone.',
      "The error appears twice on purpose: a summary that links to the field, and an inline message with the fix.",
      'The primary action names its result: "Confirm Tue 14 Oct, 10:40".',
      'Progress ("Step 2 of 3") and a sticky booking summary keep the user oriented.',
    ],
    skills: [
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-patterns",
      "pixelcraft-review",
    ],
    judgment: [
      "Nine inputs on one screen with no grouping or progress.",
      "The only error signal is a red border. Nothing says what is wrong.",
      'The button says "Submit". It does not say what happens next.',
    ],
    limits: [
      "Form is static: no validation logic runs. Screen reader pass not checked.",
    ],
    ...pair("clinic"),
  },
  {
    id: "grid",
    title: "Grid demand board",
    kind: "Data dashboard",
    mode: "Operate",
    brief:
      "A live view of national electricity demand for control-room staff. Data is illustrative.",
    direction: "One readout, direct labels, ranked table",
    decisions: [
      "One number leads: demand right now, with its delta to forecast in a sentence.",
      "Lines are labelled directly. There is no legend to decode.",
      "Regions are sorted by margin, thinnest first, because the question is where it breaks.",
      "Status uses a symbol and a word, not only color.",
      "The page states that the data is illustrative.",
    ],
    skills: [
      "pixelcraft-dataviz",
      "pixelcraft-craft",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "Four equal KPI cards with status chips give no reading order.",
      "A five-color pie is used for a mix where order matters, and the bars have no axis or labels.",
      "The scanner sees only the font and the gradient here. The real problems are chart design, which needs the dataviz skill and a reviewer.",
    ],
    limits: [
      "All values are made up for the exhibit. Chart is an SVG sketch, not a charting library.",
    ],
    ...pair("grid"),
  },
];

export type QueuedItem = { id: string; title: string; skill: string };

// Slots the gallery is ready for. Nothing is shown for these until real work exists.
export const GALLERY_QUEUE: QueuedItem[] = [
  { id: "email", title: "Order confirmation email", skill: "pixelcraft-email" },
  { id: "mobile", title: "Mobile checkout", skill: "pixelcraft-mobile" },
  { id: "social", title: "Release social card", skill: "pixelcraft-media" },
  { id: "brand", title: "Brand kit board", skill: "pixelcraft-brandkit" },
];

// ---------- authority, tools, commands, FAQ (all from the repo's SKILL.md, README, and scripts) ----------

export const AUTHORITY: { rank: number; name: string; detail: string }[] = [
  {
    rank: 1,
    name: "Your brief",
    detail: "What you asked for, in your words. Nothing below can override it.",
  },
  {
    rank: 2,
    name: "Your project",
    detail:
      "Existing design system, tokens, components, content, and conventions.",
  },
  {
    rank: 3,
    name: "The platform",
    detail:
      "Platform conventions, legal requirements, and the accessibility floor.",
  },
  {
    rank: 4,
    name: "Pixelcraft",
    detail: "Its own guidance: divergence, craft, and the verification loop.",
  },
  {
    rank: 5,
    name: "Model taste",
    detail:
      "The agent’s own preference. Last, and the only one that loses every conflict.",
  },
];

export type Tool = { id: string; file: string; blurb: string; command: string };

export const TOOLS: Tool[] = [
  {
    id: "scan",
    file: "slop-scan.mjs",
    blurb:
      "Static scan for the fingerprints models converge on. Prints file:line, severity, and a fix.",
    command: "node slop-scan.mjs <dir> [--json] [--waivers FILE]",
  },
  {
    id: "shoot",
    file: "shoot.mjs",
    blurb:
      "Captures rendered pages at three breakpoints with Playwright when it is installed.",
    command: "node shoot.mjs <url|file|dir> --out visual-qa",
  },
  {
    id: "inventory",
    file: "style-inventory.mjs",
    blurb:
      "Measures rendered type, color, estimated geometry, motion signals, and payload.",
    command: "node style-inventory.mjs <url|file> --out inventory.json",
  },
  {
    id: "gate",
    file: "finish-gate.mjs",
    blurb:
      "Checks that evidence is complete before a UI change is called done.",
    command: "node finish-gate.mjs evidence.json",
  },
  {
    id: "tokens",
    file: "export-tokens.mjs",
    blurb:
      "Exports DTCG 2025.10 design tokens to eight targets with no dependencies.",
    command: "node export-tokens.mjs tokens.json --format all",
  },
];

export const SCAN_RULES = [
  "outline-removed",
  "zoom-disabled",
  "paste-blocked",
  "placeholder-as-label",
  "missing-reduced-motion",
  "default-font-only",
  "transition-all",
  "emoji-as-icon",
  "generic-copy",
  "purple-blue-gradient",
  "hardcoded-color-literals",
  "rounded-2xl-repetition",
  "uniform-shadow",
  "centered-hero-two-ctas",
  "gradient-text-treatment",
  "rounded-accent-rail",
];

export const SHOOT_BREAKPOINTS = [
  { w: 390, h: 844, label: "phone" },
  { w: 768, h: 1024, label: "tablet" },
  { w: 1440, h: 900, label: "desktop" },
];

export const TOKEN_FORMATS = [
  "css",
  "tailwind",
  "swift",
  "kotlin",
  "dart",
  "python",
  "qt",
  "textual",
];

export const GATE_EXITS: { code: number; label: string }[] = [
  { code: 0, label: "PASS" },
  { code: 1, label: "FAIL / OPEN" },
  { code: 2, label: "NOT CHECKED" },
];

// Slash commands the installer writes for Claude Code (`installed adapter: .claude/commands/...`).
export const COMMANDS: { cmd: string; does: string }[] = [
  {
    cmd: "/pixelcraft",
    does: "Run the orchestrator for UI design and build work.",
  },
  {
    cmd: "/pixelcraft-plan",
    does: "Run step-zero planning before any UI work.",
  },
  {
    cmd: "/pixelcraft-review",
    does: "Audit or critique UI with evidence rules.",
  },
  {
    cmd: "/pixelcraft-visual-qa",
    does: "Capture and inspect rendered UI evidence.",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Does it replace my design system?",
    a: "No. The authority order puts your brief and your existing project conventions above Pixelcraft’s own guidance. If they conflict, the agent flags it instead of silently replacing your decision.",
  },
  {
    q: "What if my design is already approved?",
    a: "Then it does not diverge. The handoff skill preserves layout, hierarchy, tokens, and interaction meaning while translating into your stack. Divergence only applies to what is still undecided: missing states, breakpoints, and gaps.",
  },
  {
    q: "Is it only for websites?",
    a: "No. There are references for web, server-rendered UI, mobile, data apps, desktop, terminal, email, documents, social cards, chat platforms, game UI, XR, and browser or editor extensions.",
  },
  {
    q: "Does a clean scan mean the design is good?",
    a: "No, and the scanner says so on every run. A zero score means only that the known fingerprints were not detected. That is why every claim in a Pixelcraft report carries one of five evidence labels.",
  },
  {
    q: "What does installing change in my project?",
    a: "It copies self-contained skill folders into your agent’s skills directory, plus small adapter files for some hosts. It skips folders that already exist unless you pass --force, refuses symlinked targets, and never uses sudo.",
  },
  {
    q: "How do I know the skills actually help?",
    a: "The repo ships an evaluation corpus: one file per skill with at least two prompt cases, each meant to be run once without the skill and once with it, then compared on the same model, tools, and fixture.",
  },
  {
    q: "What is the license?",
    a: "MIT. The current version is 0.1.0.",
  },
];
