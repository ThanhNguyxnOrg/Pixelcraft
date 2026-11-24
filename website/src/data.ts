// Synced automatically from ../package.json, ../skills/*, and ../bin/pixelcraft.mjs
// via scripts/sync-repo-data.mjs (predev/prebuild/CI). Nothing here is invented proof.
import repoMeta from "./generated/repo-meta.json";
import galleryEvidence from "./generated/gallery.json";
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
  stackShort: string;
  stackLabel: string;
  mode: "Persuade" | "Operate" | "Communicate";
  brief: string;
  direction: string;
  decisions: string[];
  skills: string[];
  judgment: string[];
  limits: string[];
  codeDiff: {
    language: string;
    before: string;
    after: string;
    note: string;
  };
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
  scanBefore: scans[id]?.before ?? { score: 0, findings: [] },
  scanAfter: scans[id]?.after ?? { score: 0, findings: [] },
  before: publicUrl(`gallery/${id}/before.webp`),
  after: publicUrl(`gallery/${id}/after.webp`),
  liveBefore: publicUrl(`gallery/${id}/before.html`),
  liveAfter: publicUrl(`gallery/${id}/after.html`),
});

export const GALLERY: GalleryItem[] = [
  {
    id: "coffee",
    title: "Halden Roasters",
    stackShort: "Web · HTML/CSS",
    stackLabel: "HTML/CSS · Baseline 2026",
    mode: "Persuade",
    brief:
      "Single-origin coffee drop page built around the actual roast curve rather than generic SaaS hero cards. Fictional brand.",
    direction: "Roast-curve data sheet",
    decisions: [
      "Replaces the purple gradient + 3-card SaaS template with the lot's bean-temperature and declining rate-of-rise curve.",
      "Condensed display, quiet body, tabular mono specs — full <dl> strip fits cleanly inside 1440×900 with responsive mobile reflow.",
      "One concrete action ('Reserve 250 g $18') replaces competing 'Get started / Learn more' buttons.",
    ],
    skills: [
      "pixelcraft-direction",
      "pixelcraft-craft",
      "pixelcraft-web",
      "pixelcraft-review",
    ],
    judgment: [
      "The default could sell any SaaS tool; the Pixelcraft layout stops making sense if you remove coffee.",
      "Every curve annotation sits clear of strokes and matches the declining rate-of-rise description.",
    ],
    limits: [
      "Captured at 1440 × 900; mobile @media rules are authored in after.html (open live HTML to resize).",
    ],
    codeDiff: {
      language: "HTML / CSS",
      before: `<section class="hero" style="background: linear-gradient(135deg,#7c3aed,#3b82f6)">
  <h1>Elevate your coffee experience seamlessly</h1>
  <button class="btn primary">Get started</button>
  <button class="btn ghost">Learn more</button>
</section>
<style>.btn:focus { outline: none; }</style>`,
      after: `<main id="this-week">
  <p class="lot">Lot 214 · Huila, Colombia · washed Caturra</p>
  <h1>Roasted Tuesday. On your counter Friday.</h1>
  <a class="cta" href="#reserve">Reserve 250 g <span>$18</span></a>
  <figure><svg role="img" aria-labelledby="curve-t curve-d">…</svg></figure>
</main>
<style>.cta:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }</style>`,
      note: "Zero focus removal, truthful declining RoR curve, semantic tokens, and responsive @media reflow.",
    },
    ...pair("coffee"),
  },
  {
    id: "clinic",
    title: "Marlow Clinic",
    stackShort: "Web · WCAG Form",
    stackLabel: "Semantic HTML · WCAG 2.2 AA",
    mode: "Operate",
    brief:
      "Interactive appointment time picker and email confirmation with live error recovery. Fictional clinic and patient.",
    direction: "Clinical form with live booking summary",
    decisions: [
      "Persistent <label> on every field, two valid <fieldset>/<legend> groups, and <main> landmark.",
      "Unavailable slots strike only the time (not the 'Full' label) and communicate state without color alone.",
      "Live interactive validation preserves entered input, links summary errors to #email2, and lets users paste emails.",
    ],
    skills: [
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-patterns",
      "pixelcraft-review",
    ],
    judgment: [
      "Default dumps 9 unlabeled placeholder inputs, blocks paste on confirm-email, and hides focus outlines.",
      "Open the live Pixelcraft HTML to switch days, pick slots, fix the typo, and submit.",
    ],
    limits: [
      "Live client-side validation runs in after.html; manual VoiceOver/NVDA pass remains not-checked.",
    ],
    codeDiff: {
      language: "HTML / JS",
      before: `<input placeholder="Email">
<input class="bad" placeholder="Confirm email">
<script>
  // Hostile anti-pattern: blocks password managers & paste
  bad.addEventListener('paste', (e) => e.preventDefault());
</script>`,
      after: `<fieldset>
  <legend id="slot-legend">Time on Tue 14 Oct</legend>
  <button type="button" class="slot full" disabled>
    <span class="time-struck">09:00</span><small>Full</small>
  </button>
</fieldset>
<label for="email2">Confirm email</label>
<input id="email2" type="email" autocomplete="email"
       aria-invalid="true" aria-describedby="email2-err">`,
      note: "Valid one-legend-per-fieldset markup, paste preserved, and live interactive summary updates.",
    },
    ...pair("clinic"),
  },
  {
    id: "grid",
    title: "Northgrid Demand",
    stackShort: "Dataviz · SVG",
    stackLabel: "Dataviz · Linear Scales & Tables",
    mode: "Operate",
    brief:
      "Control-room view of national electricity demand and regional spare margin. Illustrative telemetry values.",
    direction: "Single readout, linear direct-labeled chart, ranked table",
    decisions: [
      "Exact linear Y-scale (14 px/GW) and linear 24-hour X-axis: 38.4 GW sits accurately below 40 GW, peak 44.2 GW below 45 GW.",
      "Direct line labels remove legend eye-travel; a vertical delta marker shows the exact 2.3 GW gap below forecast.",
      "Both tables use semantic <thead>/<th scope='col'>, tabular-nums, and symbol + word + color status indicators.",
    ],
    skills: [
      "pixelcraft-dataviz",
      "pixelcraft-craft",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "Default builds four equal KPI tiles, a 5-color unlabeled pie, and axis-free bars.",
      "Static scanning alone misses distorted chart scales — dataviz verification checks coordinate math directly.",
    ],
    limits: [
      "Values are illustrative; production apps should pair Observable Plot, ECharts, or uPlot for live streams.",
    ],
    codeDiff: {
      language: "SVG / HTML",
      before: `<!-- Distorted visual collage: unlabeled conic pie + 4 equal cards -->
<div class="pie" style="background: conic-gradient(#7c3aed 0 32%, #3b82f6 32% 60%, …)"></div>
<div class="kpi"><h3>Demand</h3><p>38.4</p><span>+4.2%</span></div>`,
      after: `<!-- Exact linear scale: y(gw) = 250 - (gw - 30) * 14 -->
<path d="M44 253 … C 348 148, 368 140, 386 132" stroke="#5ec8f2" stroke-width="4"/>
<rect x="380" y="126" width="12" height="12" fill="#5ec8f2"/>
<text x="402" y="148" fill="#5ec8f2">now 38.4 GW</text>
<table class="events">
  <thead><tr><th scope="col">Time</th><th scope="col">Event</th><th scope="col">Delta</th></tr></thead>`,
      note: "Exact coordinate projection eliminates misleading curves; semantic tables align labels and deltas cleanly.",
    },
    ...pair("grid"),
  },
  {
    id: "tui",
    title: "Kestrel Deploy",
    stackShort: "TUI · Rust Ratatui",
    stackLabel: "Rust · Ratatui 0.29 TUI",
    mode: "Operate",
    brief:
      "Production rollout monitor showing 120×36 color layout alongside 80×24 NO_COLOR=1 monochrome parity. Illustrative fixture.",
    direction: "Health-sorted multi-pane cell grid with explicit key legend",
    decisions: [
      "Replaces decorative ASCII art and raw ANSI log overflow with stable panes sorted failing-service first.",
      "Every state pairs text tokens ([ERR], [WRN], [OK]) and selection markers (>) so NO_COLOR=1 and TERM=dumb retain 100% meaning.",
      "Persistent footer documents every keyboard action (↑/↓, Tab, r Rollback, l Logs, q Quit with clean terminal teardown).",
    ],
    skills: [
      "pixelcraft-tui",
      "pixelcraft-plan",
      "pixelcraft-accessibility",
      "pixelcraft-visual-qa",
    ],
    judgment: [
      "Default agents routinely emit bare print() loops and raw ANSI escapes that corrupt pipes and 80-col terminals.",
      "Pixelcraft's check-tui.mjs validates NO_COLOR=1 cleanliness and 80-column overflow deterministically.",
    ],
    limits: [
      "HTML exhibit illustrates the exact Ratatui cell geometry for browser inspection; native TestBackend + insta tests verify Rust builds.",
    ],
    codeDiff: {
      language: "Rust (Ratatui 0.29)",
      before: `// Lazy CLI default: raw ANSI color-only print spam, no teardown or NO_COLOR
for svc in &services {
    println!("\\x1b[31m{} {} {} cpu={}% mem={}\\x1b[0m",
        svc.name, svc.status, svc.pod, svc.cpu, svc.mem);
}`,
      after: `// Idiomatic Ratatui 0.29: semantic tokens + NO_COLOR-safe prefixes + Flex layout
let rows = services.iter().map(|s| {
    let badge = match s.health {
        Health::Err => "[ERR] OOMKilled",
        Health::Warn => "[WRN] Draining",
        Health::Ok => "[OK]  Healthy",
    };
    Row::new([s.name.as_str(), badge, &s.release, &s.ready, &s.p95])
});
let table = Table::new(rows, [
    Constraint::Min(18), Constraint::Length(16), Constraint::Length(9),
    Constraint::Length(7), Constraint::Length(8),
]).row_highlight_style(theme.selected_row());`,
      note: "Status meaning survives NO_COLOR=1; ratatui::run() guarantees raw-mode and alternate-screen restoration on exit/panic.",
    },
    ...pair("tui"),
  },
  {
    id: "mobile",
    title: "Railward Transit",
    stackShort: "Mobile · SwiftUI",
    stackLabel: "Swift · SwiftUI iOS (Dynamic Type)",
    mode: "Operate",
    brief:
      "Live rail departures rendered side-by-side at Standard text and Dynamic Type AX3 with safe-area ergonomics. Illustrative fixture.",
    direction: "Native NavigationStack with ViewThatFits AX3 reflow",
    decisions: [
      "Replaces transplanted web gradient cards and 26pt pill buttons with native iOS semantic surfaces and >= 44pt targets.",
      "ViewThatFits switches rows from horizontal HStack to vertical VStack at Dynamic Type AX3 — zero station-name clipping.",
      "Bottom primary action clears the home indicator via safeAreaInset and pairs status dots with text labels.",
    ],
    skills: [
      "pixelcraft-mobile",
      "pixelcraft-accessibility",
      "pixelcraft-ux",
      "pixelcraft-review",
    ],
    judgment: [
      "Default mobile mocks ignore Dynamic Type scaling and place CTAs straight onto the home-indicator gesture bar.",
      "Platform conventions outrank web hero shapes under Pixelcraft's authority order.",
    ],
    limits: [
      "Rendered as an HTML iOS frame comparison for browser showcase; physical Xcode Simulator / VoiceOver audit remains not-checked.",
    ],
    codeDiff: {
      language: "Swift (SwiftUI)",
      before: `// Lazy mobile port: fixed height clips AX3 text, hardcoded colors, tiny tap target
HStack {
    Circle().fill(.green).frame(width: 10, height: 10)
    Text(dep.route).lineLimit(1)
    Spacer()
    Button("Track") { /* empty */ }.frame(height: 26)
}.frame(height: 64)`,
      after: `// Idiomatic SwiftUI: ViewThatFits reflows at AX3, >=44pt target, semantic tokens
ViewThatFits(in: .horizontal) {
    HStack(alignment: .center, spacing: 12) { routeInfo; Spacer(); statusBadge }
    VStack(alignment: .leading, spacing: 8) { routeInfo; statusBadge }
}
.safeAreaInset(edge: .bottom) {
    Button("Pin 14:48 Brighton to Lock Screen", action: pinLiveActivity)
        .frame(maxWidth: .infinity, minHeight: 50)
}`,
      note: "Dynamic Type AX3 restructures vertically instead of truncating; safeAreaInset keeps thumb-zone actions clear of the home bar.",
    },
    ...pair("mobile"),
  },
  {
    id: "document",
    title: "Northern Ledger",
    stackShort: "Doc & Email · Typst/MJML",
    stackLabel: "Typst PDF/UA + MJML Email",
    mode: "Communicate",
    brief:
      "A4 statement of account paired with its dark-mode and plaintext transactional email notification. Illustrative fixture.",
    direction: "Physical-unit Typst sheet + Outlook-safe MJML receipt",
    decisions: [
      "Replaces browser window.print() mid-table splits with explicit A4 physical margins (18 mm), repeating table headers, and unbreakable totals.",
      "Replaces broken Flexbox email with table-backed MJML (< 20 KB, well under Gmail's 102 KB clip threshold) that survives dark mode and images-off.",
      "Ships exact plaintext MIME companion preserving amount, due date, and PDF link order.",
    ],
    skills: [
      "pixelcraft-document",
      "pixelcraft-email",
      "pixelcraft-accessibility",
      "pixelcraft-visual-qa",
    ],
    judgment: [
      "Default web-trained agents route invoices through window.print() and style emails with Flexbox — both shatter in real readers.",
      "Pixelcraft verifies output with check-pdf.mjs (PDF/UA markers & embedded fonts) and check-email.mjs (102 KB + Outlook CSS).",
    ],
    limits: [
      "Displayed as browser-rendered A4 & email client frames; real Classic Outlook Windows and veraPDF runs remain not-checked.",
    ],
    codeDiff: {
      language: "Typst + MJML",
      before: `<!-- Default: browser print breaks mid-table; Flexbox email shatters in Outlook -->
<div style="display:flex; justify-content:space-between">
  <div>Invoice #4091</div><div>$2,208.00</div>
</div>
<!-- No @page margin rules, no plaintext MIME part, 138 KB clipped by Gmail -->`,
      after: `// Typst: physical A4 page, repeating header, unbreakable remittance block
#set page(paper: "a4", margin: 18mm, footer: [Page #counter(page).display("1 of 1", both: true)])
#table(columns: (1fr, auto, auto, auto), table.header([Line item], [Qty], [Unit], [Amount]), ..rows)
#block(breakable: false)[IBAN: GB29 NWBK 6016 1331 9268 19 · Ref: INV-2026-4091]

<!-- MJML: Outlook-safe table layout, < 20 KB, paired with plaintext MIME -->
<mj-section><mj-column><mj-button href="...">Download PDF (48 KB)</mj-button></mj-column></mj-section>`,
      note: "Physical units and breakable:false eliminate orphan totals; MJML + plaintext guarantees readable email everywhere.",
    },
    ...pair("document"),
  },
];

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
