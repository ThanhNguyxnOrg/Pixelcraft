// Synced automatically from ../package.json, ../skills/*, and ../bin/pixelcraft.mjs
// via scripts/sync-repo-data.mjs (predev/prebuild/CI). Nothing here is invented proof.
import repoMeta from "./generated/repo-meta.json";
import { publicUrl } from "./lib/publicUrl";

export const REPO_URL = repoMeta.repoUrl;
export const VERSION = repoMeta.version;
export const NPM_PKG = repoMeta.npmPkg;
export const AGENT_TARGET_COUNT = repoMeta.agentTargetCount;

export type Category = "Core" | "System" | "Platforms" | "Channels" | "Verify";

export type Skill = {
  name: string;
  category: Category;
  purpose: string;
  references: string[];
  scripts?: string[];
};

export const SKILLS: Skill[] = repoMeta.skills as Skill[];

export const CATEGORIES: { id: Category; blurb: string }[] = [
  { id: "Core", blurb: "Plan, grill-me discovery, frame, creative diverge." },
  { id: "System", blurb: "Craft, tokens, UX, patterns, dataviz, a11y, brand." },
  { id: "Platforms", blurb: "Idiomatic translation per rendering surface." },
  { id: "Channels", blurb: "Constrained media: email, print, social, chat." },
  { id: "Verify", blurb: "Adversarial critique, rendered QA, handoff." },
];

export const TOTAL_REFERENCES = repoMeta.totalReferences;
export const TOTAL_SCRIPTS = repoMeta.totalScripts;
export const TOTAL_EVAL_FIXTURES = repoMeta.totalEvalFixtures;
export const TOTAL_EVAL_CASES = repoMeta.totalEvalCases;
export const SCAN_EXTENSION_COUNT = repoMeta.scanExtensionCount;

const SURFACE_SKILLS_COUNT = SKILLS.filter(
  (s) => s.category === "Platforms" || s.category === "Channels",
).length;

export const LANGUAGE_PILLS = [
  { label: "HTML / CSS / TS" },
  { label: "Rust (Ratatui · GPUI · Slint · Bevy)" },
  { label: "Swift (SwiftUI · AppKit · visionOS)" },
  { label: "Kotlin (Compose · KMP)" },
  { label: "Python (PySide6 · Textual · marimo)" },
  { label: "Go (Bubble Tea · Wails · Ebitengine)" },
  { label: "C# (Avalonia · WinUI · Blazor)" },
  { label: "C++ (Qt · JUCE · ImGui)" },
  { label: "Dart (Flutter · Flame)" },
  { label: "PHP · Ruby · Elixir" },
  { label: "Typst · MJML" },
];

export const LANGUAGE_FILTERS: {
  id: string;
  label: string;
  terms: string[];
}[] = [
  { id: "All", label: "All languages", terms: [] },
  {
    id: "web",
    label: "Web / JS / TS",
    terms: [
      "html",
      "react",
      "vue",
      "svelte",
      "solid",
      "angular",
      "astro",
      "tailwind",
      "gsap",
    ],
  },
  {
    id: "rust",
    label: "Rust",
    terms: [
      "rust",
      "ratatui",
      "bevy",
      "leptos",
      "tauri",
      "typst",
      "slint",
      "gpui",
    ],
  },
  {
    id: "swift",
    label: "Swift / Apple",
    terms: ["swift", "uikit", "appkit", "visionos", "ios", "macos"],
  },
  {
    id: "kotlin",
    label: "Kotlin / Java",
    terms: ["kotlin", "compose", "android", "java", "javafx"],
  },
  {
    id: "python",
    label: "Python",
    terms: [
      "python",
      "textual",
      "rich",
      "pyside",
      "streamlit",
      "marimo",
      "shiny",
      "dash",
      "flet",
      "kivy",
    ],
  },
  {
    id: "go",
    label: "Go",
    terms: ["go-gui", "bubbletea", "lipgloss", "templ", "wails", "ebitengine"],
  },
  {
    id: "dotnet",
    label: "C# / .NET",
    terms: ["avalonia", "winui", "maui", "uno", "blazor", "unity", "monogame"],
  },
  {
    id: "cpp",
    label: "C / C++ / Zig",
    terms: ["cpp-gui", "qt", "juce", "imgui", "godot", "unreal", "lvgl"],
  },
  {
    id: "server",
    label: "PHP / Ruby / Elixir / Dart",
    terms: [
      "server-rendered",
      "flutter",
      "harmonyos",
      "liveview",
      "filament",
      "symfony",
      "rails",
    ],
  },
];

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
      "Inspected actual rendered output: screenshot, device, simulator, terminal buffer, or browser surface.",
  },
  {
    id: "static",
    meaning:
      "Inferred from source, schema, configuration, or deterministic static analysis scripts.",
  },
  {
    id: "model-judgment",
    meaning:
      "Heuristic or editorial evaluation. A useful hypothesis, not proof.",
  },
  {
    id: "not-checked",
    meaning: "Relevant but not inspected. State why when it matters.",
  },
  {
    id: "waived",
    meaning:
      "The user or brief explicitly overrides a rule. Scope and consequence are recorded.",
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
    name: "Plan & Grill-Me",
    does: "Inspect the repo first; run one-question-at-a-time Socratic discovery when scope is open; block lazy stack defaults and DIY substitutes.",
    skills: ["pixelcraft-plan"],
    artifact: ".pixelcraft/plan.md",
    gate: "No visual direction or code before constraints, stack, and purpose-built libraries are settled.",
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
    name: "Brainstorm & Diverge",
    does: "Pitch 3 far-apart directions across IA, visual posture, and craft ambition — each with an ASCII wireframe and real-copy draft.",
    skills: ["pixelcraft-direction", "pixelcraft-brandkit"],
    artifact: ".pixelcraft/history.json",
    gate: "Pre-code Design Approval gate: confirm direction and structure before scaffolding implementation.",
  },
  {
    id: "specify",
    name: "Specify",
    does: "Write the direction card, DTCG 2025.10 tokens, IA flows, and complete state matrix before component trivia.",
    skills: [
      "pixelcraft-tokens",
      "pixelcraft-ux",
      "pixelcraft-patterns",
      "pixelcraft-dataviz",
      "pixelcraft-handoff",
    ],
    artifact: "direction card · tokens.json",
    gate: "One signature element, explicit taboos, and empty/loading/error/offline/AI states named.",
  },
  {
    id: "build",
    name: "Build",
    does: "Translate idiomatically into the resolved stack with the mandatory floor applied by default and zero TODOs or dead handlers.",
    skills: [
      "pixelcraft-web",
      "pixelcraft-mobile",
      "pixelcraft-desktop",
      "pixelcraft-tui",
      `+${Math.max(0, SURFACE_SKILLS_COUNT - 4)} more`,
    ],
    artifact: "idiomatic code in target stack",
    gate: "Version-sensitive APIs verified against official docs; zero unapproved mocks or stubs.",
  },
  {
    id: "verify",
    name: "Adversarial Verify",
    does: "Hunt defects with multi-language slop-scan, WCAG+APCA contrast, TUI/email/PDF checks, rendered captures, and finish-gate.",
    skills: [
      "pixelcraft-review",
      "pixelcraft-visual-qa",
      "pixelcraft-accessibility",
    ],
    artifact: "slop-scan · check-* · finish-gate",
    gate: "At most three repair rounds, distinct per-breakpoint artifacts, then open defects stay OPEN.",
  },
  {
    id: "report",
    name: "Report",
    does: "State decisions, selected direction, verification by evidence label, waivers, and concrete open risks.",
    skills: ["pixelcraft"],
    artifact: "evidence-labeled report",
    gate: "Never claim visual quality because the app compiled or a page loaded.",
  },
];

export const FLOOR: { name: string; rule: string }[] = [
  {
    name: "Truthfulness",
    rule: "No invented proof, fake metrics, TODO stubs, dead click handlers, or unapproved mock data.",
  },
  {
    name: "Accessibility",
    rule: "Native semantics, labels, keyboard/focus visibility, 4.5:1/3:1 contrast, reduced motion, 200% zoom, no color-only meaning.",
  },
  {
    name: "Interaction",
    rule: "Fast feedback, platform target sizes (24px/44pt/48dp), cancel/undo/escape, no conflicting gestures.",
  },
  {
    name: "Adaptation",
    rule: "Restructure across viewports, orientations, Dynamic Type, terminal cells, and input modalities.",
  },
  {
    name: "Localization",
    rule: "Logical direction, 30–40% expansion budget, RTL mirroring, script fallback, locale formatting, IME safety.",
  },
  {
    name: "Performance",
    rule: "Instant orientation, zero CLS, bounded GPU/asset budgets, non-blocking async work.",
  },
  {
    name: "Robustness",
    rule: "Zero, one, many, long, missing, error, offline, permission, interruption, and streaming states.",
  },
  {
    name: "Coherence",
    rule: "Semantic DTCG tokens and consistent hierarchy, affordances, iconography, motion, and copy.",
  },
  {
    name: "Distinctiveness",
    rule: "One deliberate subject-derived commitment checked against repetition history.",
  },
  {
    name: "Verifiability",
    rule: "No compliance claim without an explicit rendered, static, model-judgment, not-checked, or waived label.",
  },
];

export type Direction = {
  id: string;
  name: string;
  p: number;
  score: number;
  verdict: string;
  won?: boolean;
};

export const THIS_PAGE_DIRECTIONS: Direction[] = [
  {
    id: "A",
    name: "SaaS spotlight bento",
    p: 0.55,
    score: 16,
    verdict:
      "Relies on mouse-spotlight cards, infinite ticker marquee, and delayed hero reveal — literal slop fingerprints.",
  },
  {
    id: "B",
    name: "Swiss specification sheet",
    p: 0.15,
    score: 22,
    verdict:
      "Strong typographic clarity, but drops the petrol-and-mint pixel identity the project already owns.",
  },
  {
    id: "C",
    name: "Fake agent terminal",
    p: 0.2,
    score: 15,
    verdict: `Decorative macOS chrome harms scanning ${SKILLS.length} skills and multi-stack exhibits on mobile.`,
  },
  {
    id: "D",
    name: "Multi-stack evidence ledger",
    p: 0.1,
    score: 26,
    verdict:
      "Zero autonomous loops, frame-0 orientation, owned brand palette, and a cool paper proof workbench.",
    won: true,
  },
];

export const TOTAL_GALLERY_EXHIBITS = repoMeta.totalGalleryExhibits;

export type RefineSpecimen = {
  id: string;
  stack: string;
  before: string;
  after: string;
  scoreBefore: number;
  scoreAfter: number;
};

const exhibitScores =
  (
    repoMeta as unknown as {
      exhibitScores?: Record<string, { before: number; after: number }>;
    }
  ).exhibitScores ?? {};

export const REFINE_SPECIMENS: RefineSpecimen[] = (
  [
    ["swiftui", "SwiftUI · Liquid Glass"],
    ["tui", "TUI · Ratatui 80×24"],
    ["python", "Python · marimo"],
    ["store", "Nuxt 4 · Store"],
    ["gamehud", "Godot 4.5 · HUD"],
  ] as const
).map(([id, stack]) => ({
  id,
  stack,
  before: publicUrl(`gallery/${id}/before.webp`),
  after: publicUrl(`gallery/${id}/after.webp`),
  scoreBefore: exhibitScores[id]?.before ?? 0,
  scoreAfter: exhibitScores[id]?.after ?? 0,
}));

export const AUTHORITY: { rank: number; name: string; detail: string }[] = [
  {
    rank: 1,
    name: "Explicit user brief",
    detail: "What you asked for, in your words. Nothing below can override it.",
  },
  {
    rank: 2,
    name: "Existing project system",
    detail:
      "Existing tokens, components, content, locks, and conventions outrank Pixelcraft taste.",
  },
  {
    rank: 3,
    name: "Platform, legal & accessibility floor",
    detail: "Native platform idioms, legal duties, and WCAG 2.2 AA floor.",
  },
  {
    rank: 4,
    name: "Pixelcraft guidance",
    detail:
      "Grill-me planning, divergence, craft rules, and verification loop.",
  },
  {
    rank: 5,
    name: "Model taste",
    detail: "Last in every conflict — never used to rationalize shortcuts.",
  },
];

export type Tool = {
  id: string;
  file: string;
  surface: string;
  blurb: string;
  command: string;
};

export const TOOLS: Tool[] = [
  {
    id: "scan",
    file: "slop-scan.mjs",
    surface: "Multi-lang",
    blurb: `Scans ${SCAN_EXTENSION_COUNT} UI file extensions for focus removal, TODO stubs, dead handlers, AI copy clichés, Compose .dp fonts, Flutter zoom locks, and reduced-motion gaps.`,
    command: "node slop-scan.mjs <dir> --fail-on p0 [--waivers FILE]",
  },
  {
    id: "tokens",
    file: "export-tokens.mjs",
    surface: `${repoMeta.totalTokenFormats} targets`,
    blurb:
      "Exports DTCG 2025.10 tokens ($root, $deprecated, modes) to CSS, Tailwind, Swift, Kotlin, Dart, Rust, Go Lip Gloss, Godot, Unity USS, Slint, GTK4, Typst, and more.",
    command: "node export-tokens.mjs tokens.json --format all",
  },
  {
    id: "contrast",
    file: "check-contrast.mjs",
    surface: "Any stack",
    blurb:
      "Computes exact WCAG 2.2 luminance contrast and APCA Lc directly on DTCG token JSON across light/dark/high-contrast modes.",
    command: "node check-contrast.mjs tokens.json --mode dark",
  },
  {
    id: "gate",
    file: "finish-gate.mjs",
    surface: "All surfaces",
    blurb:
      "Validates rendered evidence manifests per surface profile, rejecting reused breakpoint artifacts and lazy n/a exclusions.",
    command: "node finish-gate.mjs visual-qa/evidence.json",
  },
  {
    id: "shoot",
    file: "shoot.mjs",
    surface: "Web",
    blurb:
      "Captures Playwright screenshots across breakpoints, light/dark/reduced-motion modes, keyboard Tab probes, and overflow/clipping leads.",
    command: "node shoot.mjs dist/index.html --keyboard --out qa",
  },
  {
    id: "inventory",
    file: "style-inventory.mjs",
    surface: "Web",
    blurb:
      "Measures rendered font families, type ratios, quantized palette groups, motion signals, and asset payloads in Chromium.",
    command: "node style-inventory.mjs dist/index.html --out inv.json",
  },
  {
    id: "email",
    file: "check-email.mjs",
    surface: "Email",
    blurb:
      "Checks HTML emails for Gmail 102 KB clipping, Outlook-unsafe CSS (Flex/Grid/vars), missing alt/role='presentation', and plaintext parity.",
    command: "node check-email.mjs receipt.html --plaintext receipt.txt",
  },
  {
    id: "tui",
    file: "check-tui.mjs",
    surface: "Terminal",
    blurb:
      "Inspects terminal output or runs a CLI under NO_COLOR=1 and non-TTY pipes to catch ANSI leakage and 80-column overflow.",
    command: "node check-tui.mjs --cols 80 -- ./my-cli status",
  },
  {
    id: "pdf",
    file: "check-pdf.mjs",
    surface: "Document",
    blurb:
      "Inspects PDF binary structure zero-dependency for PDF/UA tags (/StructTreeRoot, /Lang, /Title), embedded fonts, and file size.",
    command: "node check-pdf.mjs invoice.pdf --json",
  },
];

export const SCAN_RULES: string[] = repoMeta.scanRules;

export const TOKEN_FORMATS: string[] = repoMeta.tokenFormats;

export const GATE_EXITS: { code: number; label: string }[] = [
  { code: 0, label: "PASS — all required rendered evidence present" },
  { code: 1, label: "FAIL / OPEN — confirmed defects remain" },
  { code: 2, label: "NOT CHECKED — missing or invalid manifest" },
];

export const CLI_COMMANDS: { cmd: string; does: string }[] = [
  {
    cmd: "pixelcraft doctor",
    does: "Audit installed agents, missing core skills, and Node compatibility.",
  },
  {
    cmd: "pixelcraft init-router",
    does: "Detect your repo stack and print an AGENTS.md routing block.",
  },
  {
    cmd: "pixelcraft check <target>",
    does: "Run slop-scan, contrast, or PDF/email checks from one command.",
  },
  {
    cmd: "pixelcraft remove <skills>",
    does: "Cleanly uninstall selected skills without touching other files.",
  },
];

export const COMMANDS: { cmd: string; does: string }[] = [
  {
    cmd: "/pixelcraft",
    does: "Run the orchestrator for UI design and build work.",
  },
  {
    cmd: "/pixelcraft-plan",
    does: "Run step-zero repo discovery, grill-me interview, and stack selection.",
  },
  {
    cmd: "/pixelcraft-review",
    does: "Run adversarial audit or critique with evidence labels.",
  },
  {
    cmd: "/pixelcraft-visual-qa",
    does: "Capture and inspect rendered UI evidence.",
  },
];

export type InstallMethod = {
  id: string;
  label: string;
  note: string;
  lines: string[];
};

export const INSTALL: InstallMethod[] = [
  {
    id: "skills",
    label: "skills CLI",
    note: "Cross-agent discovery from GitHub. Requires Node.js 22.20 or newer.",
    lines: ["npx skills add ThanhNguyxnOrg/Pixelcraft"],
  },
  {
    id: "wizard",
    label: "Interactive wizard",
    note: "Interactive setup: pick agents, skills, scope, and optional Context7 docs guidance. Node.js 18+.",
    lines: [`npm i -g ${NPM_PKG}`, "pixelcraft"],
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

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Does it replace my existing design system?",
    a: "No. The authority order ranks your explicit brief and existing project tokens/components above Pixelcraft guidance. Conflicts are flagged instead of silently replaced.",
  },
  {
    q: "How does Grill-Me discovery and pre-code approval work?",
    a: "When scope is open or you ask to brainstorm, pixelcraft-plan inspects your repo first, asks one sharp question per turn with a recommended option, and pixelcraft-direction presents 3 contrasting directions with ASCII wireframes for approval before writing code. Narrow fixes skip straight to Direct Execution.",
  },
  {
    q: "Is it only for React and TypeScript?",
    a: "No. Pixelcraft translates design tokens, UX flows, and verification scripts across Rust, Swift, Kotlin, Python, Go, C#, C++, Dart, PHP, Ruby, Elixir, Typst, MJML, and web frameworks — and explicitly blocks lazy defaults like Tkinter or raw print() TUIs.",
  },
  {
    q: "Does a zero slop-scan score prove the UI is good?",
    a: "No, and the scanner prints that disclaimer on every run. A zero score means known static fingerprints were not detected; real proof requires rendered inspection and task verification with explicit evidence labels.",
  },
  {
    q: "What does installing modify in my repository?",
    a: "It copies self-contained skill folders into your chosen agent directory plus small router adapters where supported. It never uses sudo, refuses symlinks, and skips existing folders unless you pass --force for explicitly requested skills.",
  },
  {
    q: "How do I verify the skills and tooling locally?",
    a: `Run \`npm test\` for all validator, doc-sync, and script contract suites, \`npm run eval:offline\` for the ${TOTAL_EVAL_FIXTURES}-fixture multi-language eval harness, and \`pixelcraft doctor\` to inspect installed agent directories.`,
  },
  {
    q: "What is the license?",
    a: `${repoMeta.license}. Current version: ${VERSION}.`,
  },
];

export const STACKS: string[] = repoMeta.stacks;

export type Chapter = { res: number; title: string; body: string };

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

export type Finding = {
  rule: string;
  severity: "P0" | "P1" | "P2" | "P3";
  target: string;
  fix: string;
};

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

export const SHOOT_BREAKPOINTS = [
  { w: 320, h: 568, label: "compact phone" },
  { w: 390, h: 844, label: "phone" },
  { w: 768, h: 1024, label: "tablet" },
  { w: 1440, h: 900, label: "desktop" },
];
