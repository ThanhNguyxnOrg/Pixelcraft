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

export type Ecosystem =
  | "Mobile"
  | "Desktop & TUI"
  | "AI & Data"
  | "Web & SSR"
  | "Channels & HUD";

export type GalleryItem = {
  id: string;
  title: string;
  ecosystem: Ecosystem;
  stackShort: string;
  stack?: string;
  stackLabel: string;
  mode: "Persuade" | "Operate" | "Communicate";
  palette: [string, string, string, string];
  prompt: string;
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
    id: "swiftui",
    title: "Kestrel Treasury Vault",
    ecosystem: "Mobile",
    stackShort: "SwiftUI · Liquid Glass",
    stack: "SwiftUI · Liquid Glass",
    stackLabel: "Swift · SwiftUI iOS 26",
    mode: "Operate",
    palette: ["#EBE7DF", "#14181F", "#0D5C46", "#A6782B"],
    prompt:
      "Design an iOS multi-currency vault and international FX wire screen in SwiftUI. Show net liquidity across USD/EUR/JPY/SGD, mid-market rate vs explicit conversion fee, paste-friendly IBAN entry, and Dynamic Type / Reduce Motion support.",
    brief:
      "Multi-currency personal treasury and transparent FX wire corridor in SwiftUI. Fictional institution (Kestrel Vault); FX rates and balances are illustrative.",
    direction:
      "Swiss private-bank titanium & warm limestone twin-device studio",
    decisions: [
      "Twin machined-titanium iPhone frames contrast Vault Allocation on the left against the live FX Wire Corridor on the right, switchable between Light Alabaster and Dark Titanium.",
      "Every currency segment pairs code, symbol, and percentage share directly, while the wire sheet exposes mid-market spread vs 0.18% fee with zero hidden bank markup.",
      "IBAN entry preserves paste and autofill, Dynamic Type xLarge reflows rows cleanly, and the primary button names the exact payout and destination bank.",
    ],
    skills: [
      "pixelcraft-mobile",
      "pixelcraft-tokens",
      "pixelcraft-accessibility",
      "pixelcraft-ux",
      "pixelcraft-review",
    ],
    judgment: [
      "The default fintech mockup leans on neon crypto gradients, fake '420% APY' hype, disabled pinch-zoom, and paste-blocking on IBAN inputs.",
      "Restrained limestone, emerald, and brass tokens with tabular figures make high-value FX authorization calm and verifiable.",
    ],
    limits: [
      "HTML/CSS studio simulation of SwiftUI iOS views; VoiceOver rotor and Xcode simulator snapshots remain not-checked.",
    ],
    codeDiff: {
      language: "Swift (SwiftUI)",
      before: `// Hostile mobile port: blocks IBAN paste, removes focus, hardcoded hex
TextField("Enter IBAN", text: $iban)
    .onReceive(Just(iban)) { _ in /* paste blocked */ }
Button("Get Started") { send() }`,
      after: `@Environment(\\.accessibilityReduceMotion) private var reduceMotion
@Environment(\\.dynamicTypeSize) private var typeSize

LabeledContent("Recipient IBAN") {
    TextField("CH93 0076 2011 6238 5295 7", text: $store.iban)
        .textContentType(.IBANNumber)
}
.safeAreaInset(edge: .bottom) {
    Button("Authorize \\(store.formattedPayout) to \\(store.bankName)") { store.authorize() }
}`,
      note: "Preserves IBAN paste/autofill, respects Reduce Motion and Dynamic Type, and names the exact wire outcome.",
    },
    ...pair("swiftui"),
  },
  {
    id: "kubetrace",
    title: "KubeTrace Multiplexer",
    ecosystem: "Desktop & TUI",
    stackShort: "TUI · Ratatui Trace",
    stack: "TUI · Ratatui Trace",
    stackLabel: "Rust · Ratatui Span Waterfall",
    mode: "Operate",
    palette: ["#0A0D10", "#F5A623", "#38BDF8", "#34D399"],
    prompt:
      "Build a Rust Ratatui terminal UI for SREs triaging Kubernetes latency incidents. Sort pods worst-first, inspect causal span waterfalls and resource gauges with j/k keys, and ensure every status works under NO_COLOR.",
    brief:
      "Keyboard-first Kubernetes pod triage and causal trace terminal multiplexer in Rust Ratatui. Fictional cluster (prod-eu-central); telemetry is illustrative.",
    direction: "Amber-phosphor & ferroelectric slate box-drawing multiplexer",
    decisions: [
      "Unicode box-drawing cells, Braille sparklines, and tabular millisecond offsets pack pod health, causal span waterfalls, and resource gauges into one 1440×900 terminal frame.",
      "Every pod status pairs bracketed words ([BACKOFF], [DEGRADED], [OK]) with phosphor hues, plus a live NO_COLOR toggle proving monochrome legibility.",
      "Keyboard navigation (j/k, 1–3, t/l/r) and clickable rows inspect the exact Postgres connection-pool stall causing checkout latency.",
    ],
    skills: [
      "pixelcraft-tui",
      "pixelcraft-dataviz",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "The default terminal page wraps unaligned emoji logs inside a purple-blue marketing card with removed focus rings.",
      "Character-cell discipline, worst-first pod ordering, and an explicit bottom keybar honor real terminal operators.",
    ],
    limits: [
      "Browser-rendered specimen of a Ratatui layout; TestBackend insta snapshots and raw PTY resize remain not-checked.",
    ],
    codeDiff: {
      language: "Rust (Ratatui)",
      before: `// Raw emoji ANSI dump: breaks 80-col PTYs and fails under NO_COLOR
println!("🔥 POD {} CRITICAL LATENCY {}ms 🚀", pod.name, pod.p99);`,
      after: `let panes = Layout::horizontal([Constraint::Percentage(42), Constraint::Percentage(58)])
    .split(frame.area());
let badge = match pod.health {
    Health::Backoff => Span::styled("[BACKOFF]", theme.crit.add_modifier(Modifier::BOLD)),
    Health::Degraded => Span::styled("[DEGRADED]", theme.warn),
    Health::Ok => Span::styled("[OK]", theme.ok),
};`,
      note: "Cell-grid constraints scale cleanly per frame and bracketed text badges survive monochrome terminals.",
    },
    ...pair("kubetrace"),
  },
  {
    id: "python",
    title: "Veritas RAG Eval",
    ecosystem: "AI & Data",
    stackShort: "Python · marimo",
    stack: "Python · marimo",
    stackLabel: "Python 3.12 · marimo Reactive DAG",
    mode: "Operate",
    palette: ["#F6F5EF", "#111827", "#0F766E", "#B45309"],
    prompt:
      "Create a reactive Python marimo evaluation workbench comparing RAG retrieval pipelines on faithfulness, P95 latency, and chunk citations, flagging extrapolated claims clearly.",
    brief:
      "Reactive Python marimo notebook app auditing LLM RAG faithfulness, inline corpus citations, and unsupported claims. Fictional benchmark (Veritas-Bench v2).",
    direction: "Scientific paper-ledger & botanical ink reactive notebook",
    decisions: [
      "Switching between Hybrid BM25 + Cross-Encoder, Dense Cosine, and Naive Chunking updates faithfulness, latency, cost/1k, and inline claim grounding deterministically.",
      "A directly labeled Pareto scatter plot replaces decorative gauges, showing why Hybrid retrieval dominates Naive chunking on support vs latency.",
      "Generated answers link claims to verbatim retrieved chunks ([C1], [C2]) and flag unsupported extrapolations with explicit badges rather than color alone.",
    ],
    skills: [
      "pixelcraft-data-apps",
      "pixelcraft-chat-ui",
      "pixelcraft-dataviz",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "Default Python AI wrappers ship purple headers, fake '99.99% Zero Hallucinations' claims, and ungrounded walls of chat prose.",
      "Treating LLM evaluation like a laboratory ledger puts evidence, thresholds, and retrieved passages side by side.",
    ],
    limits: [
      "Standalone reactive HTML modeling a marimo DAG app; live Python kernel inference does not run in browser.",
    ],
    codeDiff: {
      language: "Python (marimo)",
      before: `# Stateful rerun bug: recomputes heavy embeddings on every slider pixel, no label
tau = st.slider("", 0.0, 1.0, 0.5)
st.markdown("✨ **99.99% Hallucination-Free Answer:** " + llm(prompt))`,
      after: `import marimo as mo

threshold = mo.ui.slider(
    start=0.50, stop=0.95, step=0.05, value=0.75,
    debounce=True, show_value=True, label="Grounding threshold",
)
@app.cell
def evaluate_claims(pipeline, threshold):
    return score_corpus(pipeline.value, min_support=threshold.value)`,
      note: "Deterministic @app.cell DAG eliminates hidden notebook state and debounce=True avoids redundant inference.",
    },
    ...pair("python"),
  },
  {
    id: "flutter",
    title: "Ampere EV & Solar",
    ecosystem: "Mobile",
    stackShort: "Flutter · Impeller",
    stack: "Flutter · Impeller",
    stackLabel: "Dart · Flutter Adaptive Canvas",
    mode: "Operate",
    palette: ["#E4E2DC", "#191B1E", "#DF4722", "#197442"],
    prompt:
      "Design an adaptive Flutter tablet/mobile controller for home EV charging and rooftop solar load balancing. Let drivers set target SoC, departure time, and tariff priority with a clear 24h cost curve.",
    brief:
      "Adaptive Flutter home energy and EV wallbox scheduler balancing rooftop PV surplus against off-peak grid tariffs. Fictional hardware (Ampere).",
    direction:
      "Dieter Rams anodized aluminum, chalk & signal vermilion instrument",
    decisions: [
      "A tactile graphite-and-chalk battery dial pairs with target SoC (60–100%), departure time, and solar/tariff priority switches that recalculate range and € cost live.",
      "The 24-hour CustomPainter tariff and solar curve labels Off-Peak, PV Peak, and Evening Cap directly with hatched fills so meaning never relies on green/red alone.",
      "Household circuit breaker bars expose live load sharing across Wallbox, Heat Pump, and Home Battery.",
    ],
    skills: [
      "pixelcraft-mobile",
      "pixelcraft-dataviz",
      "pixelcraft-craft",
      "pixelcraft-review",
    ],
    judgment: [
      "The default IoT app scatters six glowing glass emoji cards with unlabeled sliders and color-only status dots.",
      "Industrial Braun-inspired proportion and direct tariff geometry make overnight energy scheduling effortless.",
    ],
    limits: [
      "Browser specimen of a Flutter Impeller tablet layout; flutter golden tests and TalkBack pass remain not-checked.",
    ],
    codeDiff: {
      language: "Dart (Flutter)",
      before: `// Fake tap control + missing semantics on custom canvas
GestureDetector(
  onTap: startCharge,
  child: Container(color: Color(0xFF7C3AED), child: Text("⚡ Boost")),
)`,
      after: `final quiet = MediaQuery.disableAnimationsOf(context);
Semantics(
  label: 'Target battery charge',
  value: '$targetSoc percent, ready by $departureLabel',
  child: CustomPaint(painter: TariffCurvePainter(tokens: context.pcTokens)),
)`,
      note: "Exposes semantic labels/values on CustomPaint and honors MediaQuery.disableAnimationsOf(context).",
    },
    ...pair("flutter"),
  },
  {
    id: "desktop",
    title: "Folio Local Studio",
    ecosystem: "Desktop & TUI",
    stackShort: "Desktop · Tauri v2",
    stack: "Desktop · Tauri v2",
    stackLabel: "Rust + Tauri v2 Local-First",
    mode: "Operate",
    palette: ["#DCE1E7", "#FCFBF8", "#17191C", "#2C3A8C"],
    prompt:
      "Design a local-first desktop markdown and research citation studio in Tauri v2 + Rust. Include native window chrome, three-pane vault/editor/backlink graph, Ctrl+K command palette, and explicit offline SQLite status.",
    brief:
      "Local-first encrypted Markdown, wiki-link, and citation graph desktop studio built on Tauri v2 and Rust SQLite FTS5. Fictional client (Folio v2.4).",
    direction:
      "Nordic birch, brushed graphite & archival indigo three-pane studio",
    decisions: [
      "Native desktop chrome exposes breadcrumb path, Ctrl+K Command Palette overlay, and an honest local status indicator (SQLite FTS5 · 0 cloud calls · 14.2 MB RSS).",
      "Clicking any note in the Vault Explorer, inline [[wiki-link]], or SVG Citation Graph updates both the editor mode (Reading/Source/Split) and 1-hop backlinks.",
      "Least-privilege Tauri v2 capability scoping and sub-millisecond Rust IPC metrics replace bloated Electron AI upsell banners.",
    ],
    skills: [
      "pixelcraft-desktop",
      "pixelcraft-patterns",
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "The default desktop mockup copies generic Electron purple sidebars, rounded left-border tab rails, and emoji folder trees.",
      "Quiet birch paper typography flanked by brushed-slate navigation and a live local citation graph respects focused research.",
    ],
    limits: [
      "Inner-webview desktop specimen at 1440×900; native OS menu bar and multi-DPI window resize remain not-checked.",
    ],
    codeDiff: {
      language: "Rust (Tauri v2)",
      before: `// Over-privileged wildcard shell + silent IPC errors
"permissions": ["core:default", "shell:allow-execute"]`,
      after: `#[tauri::command]
pub async fn query_backlinks(
    note_id: String,
    state: tauri::State<'_, SqlitePool>,
) -> Result<GraphNeighborhood, VaultError> {
    fts5_neighbors(&state, &note_id).await
}`,
      note: "Typed tauri::command over local SQLite WAL with window-scoped capabilities and zero cloud telemetry.",
    },
    ...pair("desktop"),
  },
  {
    id: "compose",
    title: "MetroLine Pass & Watch",
    ecosystem: "Mobile",
    stackShort: "Compose · M3E + Wear",
    stack: "Compose · M3E + Wear",
    stackLabel: "Kotlin · Jetpack Compose M3E",
    mode: "Operate",
    palette: ["#ECEEE7", "#111C16", "#17633B", "#C86D00"],
    prompt:
      "Create an Android Jetpack Compose (Material 3 Expressive) commuter rail pass paired with a round Wear OS companion tile. Show 6-car carriage crowding accessibly, live platform countdown, and 1-tap ticket activation.",
    brief:
      "Android Material 3 Expressive commuter rail pass with carriage-level crowding and a synced Wear OS wrist tile. Fictional network (MetroLine Zürich-West).",
    direction:
      "Pistachio clay, forest slate & saffron transit signal + Wear OS tile",
    decisions: [
      "An Android phone frame pairs directly with a circular 416×416 Wear OS tile so switching routes (S4, U2, Tram 11) updates platform, countdown, and low-crowding car on both surfaces.",
      "A 6-car train diagram encodes passenger load with bar height plus explicit words (Low 28%, Mod 61%, Full 94%) and step-free boarding guidance.",
      "One primary thumb-zone action activates the 90-minute zone pass without burying riders in promotional cards.",
    ],
    skills: [
      "pixelcraft-mobile",
      "pixelcraft-constrained",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "The default transit app hides platform numbers behind purple gradient banners, emoji cards, and zoom-disabled meta tags.",
      "Pairing phone detail with a glanceable 3-datum watch complication demonstrates multi-surface restraint.",
    ],
    limits: [
      "HTML specimen of Jetpack Compose + Wear OS surfaces; Android emulator TalkBack and rotary bezel input remain not-checked.",
    ],
    codeDiff: {
      language: "Kotlin (Jetpack Compose)",
      before: `// Fixed .dp font breaks font scaling; color-only crowding dot
Text("Car 2", fontSize = 12.dp)
Box(Modifier.size(8.dp).background(Color.Green, CircleShape))`,
      after: `@Composable
fun CarriageRow(car: Carriage, modifier: Modifier = Modifier) {
    Row(modifier.semantics(mergeDescendants = true) {
        liveRegion = LiveRegionMode.Polite
        contentDescription = "Car \${car.number}, \${car.loadText}, step-free: \${car.stepFree}"
    }) { /* M3E scalable .sp typography + bar + text badge */ }
}`,
      note: "Uses scalable .sp units, merges row semantics for TalkBack, and pairs crowding bars with explicit text.",
    },
    ...pair("compose"),
  },
  {
    id: "liveview",
    title: "Osteria Ferro Floor Plan",
    ecosystem: "Web & SSR",
    stackShort: "Elixir · LiveView",
    stack: "Elixir · LiveView",
    stackLabel: "Elixir · Phoenix LiveView SSR",
    mode: "Operate",
    palette: ["#F4EDE1", "#231B15", "#3B5334", "#B54826"],
    prompt:
      "Build a server-rendered Phoenix LiveView dining room reservation page for a wood-fired neighborhood bistro. Let diners pick their actual table on an architectural floor plan with acoustic notes and 5-minute live holds.",
    brief:
      "Elixir Phoenix LiveView dining-room floor plan and real-time table reservation ledger for a wood-fired bistro. Fictional restaurant (Osteria Ferro).",
    direction:
      "Roman travertine, pressed olive & terracotta architectural plan",
    decisions: [
      "Instead of generic stock-photo cards, an architectural SVG floor plan maps Chef’s Counter, Courtyard Fig-Tree Window, Wine Alcove, and Communal Oak Table.",
      "Every table encodes seat count and state via fill + diagonal hatch + explicit words (Available, Held 4m, Booked) synced via simulated Phoenix.PubSub.",
      "Selecting any available table updates sightline, measured dBA acoustic level, step-free access, and an explicit zero-fee 5-minute hold CTA.",
    ],
    skills: [
      "pixelcraft-web",
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "The default restaurant template shouts 'Culinary Excellence ✨🍝' over a purple overlay with fake 4.99★ badges and paste-blocked phone inputs.",
      "Showing the physical room, hearth sightlines, and honest acoustic levels fits a neighborhood trattoria.",
    ],
    limits: [
      "Client-side simulation of Phoenix LiveView PubSub state; no live Elixir BEAM server runs behind the static exhibit.",
    ],
    codeDiff: {
      language: "Elixir (Phoenix LiveView)",
      before: `<!-- Generic restaurant card + unlabeled input + no hold state -->
<input placeholder="Phone number" onpaste="return false" />
<button>Book Now 🔥</button>`,
      after: `def handle_event("select_table", %{"id" => id}, socket) do
  case Seating.hold_table(id, socket.assigns.seating_window) do
    {:ok, hold} -> {:noreply, assign(socket, selected: hold, error: nil)}
    {:error, :taken} -> {:noreply, put_flash(socket, :error, "Just held by another party")}
  end
end`,
      note: "Server-authoritative table hold state broadcasts cleanly across connected diners while preserving form inputs.",
    },
    ...pair("liveview"),
  },
  {
    id: "email",
    title: "Helvetic Air Gate Slip",
    ecosystem: "Channels & HUD",
    stackShort: "Email · MJML",
    stack: "Email · MJML",
    stackLabel: "MJML · Dark Mode & Plaintext Email",
    mode: "Communicate",
    palette: ["#FFFFFF", "#0B1F3A", "#D92D20", "#157347"],
    prompt:
      "Design a flight gate-change notification email in MJML (< 102 KB Gmail clip budget) that puts the new gate in the first 100px and survives Apple Mail Light, Gmail Dark Mode, blocked images, and plain-text MIME.",
    brief:
      "Resilient 640px table-structured MJML flight gate-change email paired with a multi-client Dark Mode, Images-Blocked, and Plain-Text MIME inspector. Fictional airline (Helvetic Air LX-408).",
    direction:
      "Vignelli Swiss split-flap aviation timetable & client workbench",
    decisions: [
      "The urgent gate change (B14 → E42 · Terminal E) leads in the first 110px in live HTML text—never trapped inside a hero image.",
      "Interactive client preview tabs test Apple Mail Light, Gmail Dark Mode, Images Blocked, and Plain-Text MIME parity on the exact same content model.",
      "Payload stays at 18.4 kB (well below Gmail’s 102 kB clipping threshold) with Outlook-safe table cells and real-text calendar/wallet actions.",
    ],
    skills: [
      "pixelcraft-email",
      "pixelcraft-accessibility",
      "pixelcraft-craft",
      "pixelcraft-review",
    ],
    judgment: [
      "The default email buries an urgent gate change underneath a purple vacation banner and four hotel/car upsell cards.",
      "Treating transactional email as transit signage respects stressed travelers at the terminal.",
    ],
    limits: [
      "Browser workbench previewing MJML client states; live Classic Windows Outlook Word-engine captures remain not-checked.",
    ],
    codeDiff: {
      language: "MJML",
      before: `<!-- Hero image hides gate number when images are blocked; 140 KB clipped -->
<img src="gate-banner.png" />
<div style="display:grid; grid-template-columns:1fr 1fr">...</div>`,
      after: `<mj-section background-color="#0B1F3A" padding="20px 24px">
  <mj-column>
    <mj-text color="#FFFFFF" font-size="22px" font-weight="700">
      GATE CHANGED: B14 -> E42 (Terminal E · Skymetro 6 min)
    </mj-text>
  </mj-column>
</mj-section>`,
      note: "Live HTML text survives blocked images, table cells survive Outlook Word rendering, and 18.4 KB avoids Gmail clipping.",
    },
    ...pair("email"),
  },
  {
    id: "proposal",
    title: "Atelier Nord Fee Dossier",
    ecosystem: "Channels & HUD",
    stackShort: "Print · Typst A4",
    stack: "Print · Typst A4",
    stackLabel: "Typst 0.13 + @page Print CSS",
    mode: "Communicate",
    palette: ["#FDFCF9", "#141413", "#1E3A5F", "#57534E"],
    prompt:
      "Typeset a 2-page A4 architectural fee proposal and milestone ledger using Typst / @page Print CSS principles: crop marks, running headers, tabular-nums phase breakdown, widow/orphan protection, and print-safe ink coverage.",
    brief:
      "Paginated A4 architectural fee proposal, phase ledger, and milestone schedule designed for Typst and @page Print CSS proofing. Fictional Copenhagen practice (Atelier Nord ApS).",
    direction:
      "Danish architectural A4 specification sheet with bleed & baseline grid",
    decisions: [
      "Proofing controls toggle Page 1 (Scope & 5-Phase RIBA/FRI Fee Ledger) vs Page 2 (Milestone Gantt & Terms), Bleed/Baseline Grid overlay, and EUR/DKK currency.",
      "Cotton paper margins, running headers, crop marks, and right-aligned tabular numerals keep every figure scannable on screen and on 4.2%-toner laser print.",
      "Explicit @media print and break-inside: avoid rules prevent split tables or ink-wasting dark backgrounds.",
    ],
    skills: [
      "pixelcraft-document",
      "pixelcraft-craft",
      "pixelcraft-tokens",
      "pixelcraft-review",
    ],
    judgment: [
      "The default web invoice slaps a heavy purple gradient header over non-tabular numbers that waste toner and break awkwardly across pages.",
      "Paginated baseline typography and low-toner architectural linework treat documents as physical artifacts.",
    ],
    limits: [
      "HTML/CSS @page print-proofing specimen; veraPDF PDF/UA-1 binary validation remains not-checked.",
    ],
    codeDiff: {
      language: "Typst",
      before: `<!-- Web banner wastes 65% black/purple toner and splits fee rows mid-page -->
<div class="gradient-header"><h1>Architectural Proposal</h1></div>`,
      after: `#set page(paper: "a4", margin: (top: 22mm, bottom: 22mm, x: 20mm),
  header: context [Atelier Nord ApS #h(1fr) Ref AN-2026-041],
  numbering: "1 of 1")
#set text(font: "Public Sans", size: 9.5pt, number-type: "lining", number-width: "tabular")`,
      note: "Physical millimeter margins, lining tabular numerals, and unbreakable summary blocks guarantee clean A4 pagination.",
    },
    ...pair("proposal"),
  },
  {
    id: "gamehud",
    title: "AEGIS-07 Hangar HUD",
    ecosystem: "Channels & HUD",
    stackShort: "Game · Godot 4.5",
    stack: "Game · Godot 4.5",
    stackLabel: "Godot 4.5 · Control & FocusTree",
    mode: "Operate",
    palette: ["#0B0F13", "#F59E0B", "#22D3EE", "#FB7185"],
    prompt:
      "Build a diegetic sci-fi mech hangar loadout HUD following Godot 4.5 Control container & focus-neighbor principles. Balance reactor MW, thermal load, and chassis mass with Deuteranopia-safe vision and 115% HUD scale toggles.",
    brief:
      "Diegetic orbital salvage mech loadout and reactor-heat balancer modeling Godot 4.5 Control focus trees, controller hints, and colorblind/HUD-scale options. Fictional game (AEGIS-07).",
    direction:
      "Cassette-futurist gunmetal bulkhead, hazard ochre & vector reticle HUD",
    decisions: [
      "A vector bipedal rig schematic links four clickable hardpoints directly to live Reactor Draw (MW), Thermal Dissipation ([NOMINAL] vs [OVERHEAT ▲]), and Thruster Mass.",
      "Vision & Scale toggles switch live between Standard, Deuteranopia-Safe palette, and 115% HUD text scale without clipping containers.",
      "Gamepad/keyboard prompts and segmented bar geometry ensure combat readiness never depends on red/green vision alone.",
    ],
    skills: [
      "pixelcraft-game-ui",
      "pixelcraft-accessibility",
      "pixelcraft-craft",
      "pixelcraft-review",
    ],
    judgment: [
      "The default game UI mimics predatory mobile-gacha slop: glowing purple lootbox cards, tiny unreadable stats, and color-only health bars.",
      "Industrial stencil hierarchy, explicit thermal thresholds, and accessible HUD scaling feel native to a tactical hangar.",
    ],
    limits: [
      "Web specimen modeling Godot 4.5 Control layout and GDScript theme overrides; native Godot binary and gamepad rumble remain not-checked.",
    ],
    codeDiff: {
      language: "GDScript (Godot 4.5)",
      before: `# Hardcoded 1080p coordinates + hidden focus ring traps gamepad players
mount_btn.position = Vector2(1140, 620)
mount_btn.focus_mode = Control.FOCUS_NONE`,
      after: `func _apply_vision_profile(profile: VisionProfile) -> void:
    theme = preload("res://ui/themes/aegis_deuteranopia.tres") if profile.colorblind else default_theme
    get_tree().root.content_scale_factor = 1.15 if profile.large_hud else 1.0
    mount_list.get_child(0).grab_focus()`,
      note: "Preserves controller focus neighbors, swaps Theme resources cleanly, and scales HUD legibility for 10-foot play.",
    },
    ...pair("gamehud"),
  },
  {
    id: "saas",
    title: "Keel Edge Console",
    ecosystem: "Web & SSR",
    stackShort: "Web · Next.js 15",
    stack: "Web · Next.js 15",
    stackLabel: "Next.js 15 · App Router",
    mode: "Persuade",
    palette: ["#08090B", "#C8F53B", "#151921", "#E6EDF3"],
    prompt:
      "Create a developer-facing product page for Keel, a Next.js edge preview and release-gate platform. Avoid purple glassmorphism; let engineers inspect PoP cold-start TTFB, RSC payload budgets, and transparent seat pricing.",
    brief:
      "Next.js App Router edge preview and release-gate platform. Fictional brand (Keel); latencies and pricing are illustrative.",
    direction: "Nocturnal obsidian & acid lime hardware console",
    decisions: [
      "A recessed dark-room Global Edge Topology map lets visitors click five PoPs (iad-1, fra-2, nrt-1, sin-1, gru-1) to inspect cold-start TTFB and RSC payload size.",
      "Acid lime (#c8f53b) is reserved for one primary action ('Launch preview gate') and active routing nodes instead of competing neon glows.",
      "An interactive seat and billing pod calculates monthly/annual costs in tabular numerals alongside PASS/GATE checks paired with geometric symbols.",
    ],
    skills: [
      "pixelcraft-direction",
      "pixelcraft-craft",
      "pixelcraft-web",
      "pixelcraft-patterns",
      "pixelcraft-review",
    ],
    judgment: [
      "The default page relies on dark glassmorphism bento slop: glowing purple-blue orbs, gradient-clip headlines, and fake 'Trusted by 10,000+ teams' logos.",
      "Machined charcoal surfaces, tactile hardware switches, and real Next.js App Router inspection earn developer trust.",
    ],
    limits: [
      "Standalone HTML specimen modeling Next.js App Router idioms; region latency figures are illustrative.",
    ],
    codeDiff: {
      language: "TypeScript (Next.js 15)",
      before: `<div className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
  Unleash Next-Generation Cloud Velocity 🚀
</div>`,
      after: `export default async function ReleaseGatePage({ searchParams }: PageProps) {
  const pop = parseRegion((await searchParams).pop);
  const snapshot = await getEdgeSnapshot(pop);
  return <TopologyStage initialPop={pop} snapshot={snapshot} />;
}`,
      note: "URL-addressable server state replaces decorative glassmorphism and fake social-proof logos.",
    },
    ...pair("saas"),
  },
  {
    id: "store",
    title: "SORI Audio Flagship",
    ecosystem: "Web & SSR",
    stackShort: "Web · Nuxt 4",
    stack: "Web · Nuxt 4",
    stackLabel: "Vue 3.5 · Nuxt 4 Commerce",
    mode: "Persuade",
    palette: ["#1538D8", "#F9F9FB", "#111318", "#C8522A"],
    prompt:
      "Design a flagship storefront in Nuxt 4 for SORI, an industrial audio studio making direct-drive turntables and nearfield monitors. Let shoppers switch anodized finishes live and inspect bag totals with zero fake urgency timers.",
    brief:
      "Sculptural direct-drive turntable and nearfield studio monitor flagship store. Fictional audio studio (SORI); inventory and prices are illustrative.",
    direction: "Yves Klein cobalt & gallery white pop-modernism",
    decisions: [
      "A full-bleed Yves Klein cobalt stage frames the SORI T-01 turntable render whose brushed plinth and ring update live across Raw Silver, Kiln Terracotta, and Matte Obsidian.",
      "Soft gallery-white cards showcase three companion hardware pieces with studio-lit vector illustrations and symbol+text stock badges.",
      "Category filter pills and a live Bag & Parcel Summary compute item subtotals and the $600 free-shipping threshold with zero fake discount countdowns.",
    ],
    skills: [
      "pixelcraft-direction",
      "pixelcraft-craft",
      "pixelcraft-patterns",
      "pixelcraft-web",
      "pixelcraft-review",
    ],
    judgment: [
      "The default storefront mimics flash-sale clutter: screaming 70% off countdown timers, fake 5-star review counts, and an unlabeled search bar.",
      "Generous sculptural cards, honest 5-year warranty copy, and real colorway toggles turn shopping into calm material inspection.",
    ],
    limits: [
      "Standalone HTML specimen modeling Nuxt 4 catalog flows; cart is client-side only with no checkout backend.",
    ],
    codeDiff: {
      language: "Vue (Nuxt 4)",
      before: `<div class="flash-banner">🔥 70% OFF ENDS IN 04:59! 192 PEOPLE BUYING!</div>
<input placeholder="Search products..." style="outline:none" />`,
      after: `<script setup lang="ts">
const finish = useRouteQuery('finish', 'silver')
const { data: plinth } = await useAsyncData(() => fetchPlinth(finish.value), { watch: [finish] })
</script>`,
      note: "Eliminates dark-pattern countdown timers in favor of shareable colorway URL state and transparent parcel totals.",
    },
    ...pair("store"),
  },
  {
    id: "booking",
    title: "Aomori Thermal Stay",
    ecosystem: "Web & SSR",
    stackShort: "Web · SvelteKit 2",
    stack: "Web · SvelteKit 2",
    stackLabel: "Svelte 5 Runes · SvelteKit 2",
    mode: "Operate",
    palette: ["#151D26", "#EDE6DA", "#C46D45", "#241C17"],
    prompt:
      "Design a cliffside hot-spring retreat booking flow in SvelteKit 2. Show full-bleed coastal atmosphere, persistent labels on dates/guests, explicit sold-out states, and an itemized reservation slip with zero hidden resort fees.",
    brief:
      "Choose arrival dates, stay length, guests, and a cliffside coastal hot-spring suite with zero hidden resort fees. Fictional retreat (Aomori Thermal).",
    direction: "Full-bleed twilight architectural sanctuary",
    decisions: [
      "A full-bleed twilight coastal panorama sets the atmosphere while a floating Stay Bar keeps persistent labels on dates, nights, and guests.",
      "Booked dates ('Full') and unavailable suites ('Booked Oct 16–18') combine terracotta ink, strikethrough, explicit words, and disabled states.",
      "A warm charred-cedar Reservation Slip breaks down room rate, thermal upkeep, and stay tax with zero hidden fees, and the CTA names the exact result.",
    ],
    skills: [
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-craft",
      "pixelcraft-web",
      "pixelcraft-review",
    ],
    judgment: [
      "The default OTA clone blasts 'ONLY 1 ROOM LEFT! 47 viewing!' urgency spam, hides an $89 resort fee in fine print, and blocks paste on promo codes.",
      "Pairing twilight hospitality mood with an itemized dark-cedar ledger resolves both emotional tone and fee transparency.",
    ],
    limits: [
      "Standalone HTML specimen modeling Svelte 5 runes & form actions; no live booking store runs.",
    ],
    codeDiff: {
      language: "Svelte 5 (SvelteKit)",
      before: `<span class="urgent">⚠️ ONLY 1 ROOM LEFT! +$89 resort fee at checkout</span>
<input placeholder="Promo code" onpaste={(e) => e.preventDefault()} />`,
      after: `<script lang="ts">
  let nights = $state(3);
  let suite = $state(suites[0]);
  const total = $derived(suite.rate * nights + suite.onsenTax * nights);
</script>
<form method="POST" use:enhance>...</form>`,
      note: "Itemizes every tax upfront via $derived runes and progressive-enhancement form actions.",
    },
    ...pair("booking"),
  },
  {
    id: "dashboard",
    title: "Vektor Avionics Board",
    ecosystem: "AI & Data",
    stackShort: "Dataviz · SolidJS",
    stack: "Dataviz · SolidJS",
    stackLabel: "SolidJS · Canvas Oscilloscope",
    mode: "Operate",
    palette: ["#070A0F", "#38BDF8", "#F59E0B", "#10B981"],
    prompt:
      "Build a high-frequency edge telemetry cockpit in SolidJS with a real canvas P50/P95/P99 oscilloscope against an 80 ms SLA rail, pause/resume motion control, and worst-first webhook queue triage.",
    brief:
      "Monitor live edge routing latency, SLA error budget, throughput, and webhook delivery queues for platform engineers. Fictional telemetry (Vektor Edge).",
    direction: "Midnight avionics telemetry cockpit",
    decisions: [
      "A real HTML5 canvas oscilloscope renders directly labeled P50, P95, and P99 traces against an 80 ms SLA threshold, with a Live/Paused stream toggle and reduced-motion static snapshot.",
      "Three 240-degree SVG avionics arc gauges track SLA budget, throughput, and retry load alongside worst-first Edge PoP health bars.",
      "Every status combines a geometric symbol and word (● OK, ▲ Degraded, ■ Failing), and Solid-style signals update region and endpoint filters cleanly.",
    ],
    skills: [
      "pixelcraft-dataviz",
      "pixelcraft-craft",
      "pixelcraft-accessibility",
      "pixelcraft-web",
      "pixelcraft-review",
    ],
    judgment: [
      "The default admin template wastes viewport space on an emoji icon sidebar, four glowing '+142% 🚀' KPI cards, and an unlabeled rainbow pie chart.",
      "Midnight hull contrast, direct curve labeling, and worst-first queue sorting put incident triage first.",
    ],
    limits: [
      "Illustrative telemetry rendered via an inline signal store and HTML5 canvas rather than a live streaming backend.",
    ],
    codeDiff: {
      language: "TypeScript (SolidJS)",
      before: `// Unstoppable animation loop + unlabeled rainbow donut chart
setInterval(() => redrawEverything(), 16);`,
      after: `const [region, setRegion] = createSignal<Region>("ALL");
const [paused, setPaused] = createSignal(prefersReducedMotion());
createEffect(() => {
  if (!paused()) drawTraces(canvasRef, streamFor(region()));
});`,
      note: "Fine-grained signals isolate canvas updates and default to static snapshot under prefers-reduced-motion.",
    },
    ...pair("dashboard"),
  },
  {
    id: "learning",
    title: "Cadence Rhythm Lab",
    ecosystem: "Web & SSR",
    stackShort: "Web · Angular Signals",
    stack: "Web · Angular Signals",
    stackLabel: "Angular 19 · Signals & Web Audio",
    mode: "Operate",
    palette: ["#F7F3E8", "#1847E8", "#F4B400", "#E03B24"],
    prompt:
      "Design an interactive music rhythm studio lesson in Angular Signals teaching 3-over-2 polyrhythms with a playable 16-step Web Audio drum grid, BPM control, and accessible quiz feedback—no gamified streak spam.",
    brief:
      "Interactive music theory and rhythm studio lesson teaching Syncopation & 3-over-2 Polyrhythms (Lesson 04 of 06). Fictional studio (Cadence).",
    direction: "Bauhaus & neo-brutalist interactive playground",
    decisions: [
      "A clickable 3-track × 16-step drum sequencer with Web Audio synthesis, preset grooves, and BPM control lets learners hear and edit 3-over-2 cross-rhythms directly.",
      "Bauhaus saffron, electric ultramarine, vermilion, and 2px ink offset blocks bring tactile studio energy while keeping focus rings and contrast high.",
      "A geometric 6-beat polyrhythm wheel, live lesson switcher, and accessible comprehension quiz replace passive streak/XP clutter.",
    ],
    skills: [
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-craft",
      "pixelcraft-web",
      "pixelcraft-review",
    ],
    judgment: [
      "The default ed-tech page buries the actual lesson under '14 Day Streak 🔥', '2,450 XP 🏆', an unlabeled 'Ask AI Tutor' box, and locked upsell cards.",
      "Turning the lesson into a playable instrument proves that Operate-mode learning can be playful without sacrificing accessibility.",
    ],
    limits: [
      "Standalone HTML specimen modeling Angular Signals state; Web Audio playback requires user interaction.",
    ],
    codeDiff: {
      language: "TypeScript (Angular)",
      before: `<div class="streak-card">🔥 14 Day Streak! Upgrade to Pro to unlock audio!</div>`,
      after: `readonly bpm = signal(96);
readonly grid = signal<boolean[][]>(PRESETS.polyrhythm3x2);
readonly stepMs = computed(() => Math.round(60_000 / this.bpm() / 4));`,
      note: "Replaces gamified upsell chrome with a keyboard-operable instrument driven by Angular Signals.",
    },
    ...pair("learning"),
  },
  {
    id: "magazine",
    title: "SOLARIS Issue 09",
    ecosystem: "Web & SSR",
    stackShort: "Web · Lit Elements",
    stack: "Web · Lit Elements",
    stackLabel: "Lit · Shadow DOM Web Components",
    mode: "Communicate",
    palette: ["#0B0B0D", "#C81E2B", "#FAF9F6", "#18181B"],
    prompt:
      "Design a quarterly cinema & acoustics longform spread using encapsulated Lit Web Components (<solaris-reader-bar> and <solaris-footnote>) with S/M/L type scale, Print/Noir modes, and high-contrast editorial typography.",
    brief:
      "Avant-garde film, architecture, and sound design quarterly spread (Issue 09: Cinema & Acoustics). Fictional publication (SOLARIS).",
    direction: "Avant-garde neo-constructivist magazine spread",
    decisions: [
      "A pitch-obsidian and cinema-crimson Constructivist cover plate collides directly against a stark white serif reading spread with a crimson drop cap and pull-quote strip.",
      "Native Shadow DOM Web Components (<solaris-reader-bar> and <solaris-footnote>) switch S/M/L type scale, Print/Noir surface modes, and inline studio footnotes.",
      "Numbered Issue 09 dispatches swap an aria-live screening preview without breaking the spread's typographic hierarchy.",
    ],
    skills: [
      "pixelcraft-direction",
      "pixelcraft-craft",
      "pixelcraft-web",
      "pixelcraft-accessibility",
      "pixelcraft-review",
    ],
    judgment: [
      "The default blog template traps film criticism inside a generic lavender-blue banner, unlabeled newsletter pill, and three identical emoji cards.",
      "High-contrast obsidian/crimson drama on the left balanced by measured serif columns on the right keeps longform reading expressive yet legible.",
    ],
    limits: [
      "Standalone HTML specimen using custom Shadow DOM Web Components; dispatch links switch an in-page screening note.",
    ],
    codeDiff: {
      language: "TypeScript (Lit)",
      before: `<div class="blog-card rounded-2xl shadow-xl">🎬 Top 10 Cinema Trends ✨</div>`,
      after: `@customElement("solaris-reader-bar")
export class SolarisReaderBar extends LitElement {
  @property({ type: String }) scale: "s" | "m" | "l" = "m";
  @property({ type: String }) theme: "print" | "noir" = "print";
}`,
      note: "Encapsulated Shadow DOM reader controls expose accessible type-scale and surface-mode switching.",
    },
    ...pair("magazine"),
  },
  {
    id: "coffee",
    title: "Halden Roasters",
    ecosystem: "Web & SSR",
    stackShort: "Web · HTML/CSS",
    stack: "Web · HTML/CSS",
    stackLabel: "HTML/CSS · Baseline 2026",
    mode: "Persuade",
    palette: ["#161311", "#D97724", "#F4EFE6", "#8C7B6B"],
    prompt:
      "Make a single-origin coffee drop page built around the lot's actual bean-temperature and declining rate-of-rise roast curve, with one concrete purchase action.",
    brief:
      "Single-origin coffee drop storefront built around an interactive roast telemetry scrubber, brew recipe dialer, and farm-gate FOB price ledger. Fictional roastery.",
    direction: "Roast-telemetry dossier & interactive drop storefront",
    decisions: [
      "Replaces the purple gradient + 3-card SaaS template with the lot's interactive bean-temperature and declining rate-of-rise (RoR) curve.",
      "Includes live roast-phase scrubbing, V60/Espresso/AeroPress grind & water dialer, bag allocation drawer, and farm-gate FOB transparency.",
      "One concrete action ('Reserve 250 g $18') leads above the fold, fitting cleanly inside 1440×900 with responsive 320px–1440px mobile reflow.",
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
      "Interactive HTML/CSS/JS storefront specimen; fictional roastery and illustrative farm-gate FOB telemetry.",
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
    ecosystem: "Web & SSR",
    stackShort: "Web · WCAG Form",
    stack: "Web · WCAG Form",
    stackLabel: "Semantic HTML · WCAG 2.2 AA",
    mode: "Operate",
    palette: ["#F7F6F2", "#1B2A2F", "#1D6B52", "#B42318"],
    prompt:
      "Design an interactive clinic appointment time picker and confirmation form with persistent labels, paste-friendly email fields, and linked error recovery.",
    brief:
      "WCAG 2.2 AA patient intake, clinician triage, transparent NHS/insurer/self-pay fee estimator, and live error-recovery portal. Fictional clinic and patient.",
    direction: "Asymmetric clinical intake & live fee/booking dossier",
    decisions: [
      "Persistent <label> on every field, single-<legend> <fieldset> triage groups, and interactive multi-day clinician slot matrix.",
      "Unavailable slots strike only the time (not the 'Full' label) and pair shape + text + contrast so meaning never relies on color alone.",
      "Preserves entered input, links summary errors directly to #email2 with paste enabled, and generates an RFC 5545 .ics + printable appointment pass.",
    ],
    skills: [
      "pixelcraft-ux",
      "pixelcraft-accessibility",
      "pixelcraft-patterns",
      "pixelcraft-review",
    ],
    judgment: [
      "Default dumps 9 unlabeled placeholder inputs, blocks paste on confirm-email, and hides focus outlines.",
      "Open the live Pixelcraft HTML to switch clinicians, days, coverage pathways, fix the email typo, and download an .ics pass.",
    ],
    limits: [
      "Live client-side validation and .ics pass run in after.html; manual VoiceOver/NVDA pass remains not-checked.",
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
    ecosystem: "AI & Data",
    stackShort: "Dataviz · SVG",
    stack: "Dataviz · SVG",
    stackLabel: "Dataviz · Linear Scales & Tables",
    mode: "Operate",
    palette: ["#F4F3EE", "#14181D", "#0F62FE", "#B45309"],
    prompt:
      "Build a national electricity demand control-room board with one primary GW readout, exact linear SVG scales, direct line labels, and regions ranked thinnest margin first.",
    brief:
      "Interactive national electricity dispatch control room with scenario switching, 48-period settlement scrubbing, generation mix ledger, and ranked spare margins. Illustrative telemetry.",
    direction: "Linear direct-labeled dispatch deck & regional margin board",
    decisions: [
      "Exact linear Y-scale and 48 half-hour settlement scrubber: 38.4 GW sits proportionally below 40 GW, peak 44.2 GW below 45 GW.",
      "Direct line labels eliminate legend eye-travel; scenario tabs test Normal Dispatch, Cold Snap Peak, and HVDC Interconnector Trip.",
      "Generation mix and regional margin tables use semantic <th scope='col'>, tabular-nums, and hatched pattern + symbol + word status badges.",
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
      "Illustrative grid telemetry; production control rooms pair uPlot, ECharts, or streaming WebSocket feeds.",
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
    ecosystem: "Desktop & TUI",
    stackShort: "TUI · Ratatui 80×24",
    stack: "TUI · Ratatui 80×24",
    stackLabel: "Rust · Ratatui 0.29 NO_COLOR",
    mode: "Operate",
    palette: ["#0D1117", "#58A6FF", "#D29922", "#F85149"],
    prompt:
      "Design a Rust Ratatui production rollout monitor showing 120×36 color layout alongside 80×24 NO_COLOR=1 monochrome parity with explicit keyboard teardown.",
    brief:
      "Interactive Rust Ratatui rollout studio pairing 120×36 ANSI color with 80×24 NO_COLOR=1 monochrome parity, canary traffic gates, and staged rollback. Illustrative fixture.",
    direction: "Keyboard-first dual-pane cell grid with NO_COLOR=1 verifier",
    decisions: [
      "Synchronizes keyboard (↑/↓, j/k, r Rollback, n NO_COLOR=1) and pointer selection across both 120×36 color and 80×24 monochrome terminals.",
      "Every state pairs bracketed tokens ([ERR], [WRN], [OK]) and selection markers (>) so NO_COLOR=1 and TERM=dumb retain 100% meaning.",
      "Includes interactive canary traffic split controls, staged rollback confirmation, and a check-tui.mjs 80-column compliance ledger.",
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
      "Interactive browser simulation of Ratatui cell geometry; native TestBackend + insta tests verify Rust builds.",
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
    ecosystem: "Mobile",
    stackShort: "SwiftUI · Dynamic Type",
    stack: "SwiftUI · Dynamic Type",
    stackLabel: "Swift · SwiftUI iOS (AX3 Reflow)",
    mode: "Operate",
    palette: ["#F5F5F7", "#1C1C1E", "#0066CC", "#248A3D"],
    prompt:
      "Render live iOS rail departures in SwiftUI side-by-side at Standard text and Dynamic Type AX3 using ViewThatFits and safeAreaInset.",
    brief:
      "Interactive twin-iPhone SwiftUI commuter rail studio morphing live across Dynamic Type scales (.medium to AX3) with ActivityKit Lock Screen pinning. Illustrative fixture.",
    direction:
      "Twin-device NavigationStack with live ViewThatFits AX3 reflow & inspector",
    decisions: [
      "Live Dynamic Type segmented control + slider morphs the second device from HStack (.medium–.xxxLarge) to VStack (AX1–AX3) with zero station-name clipping.",
      "Tapping any departure updates calling points, 8-coach step-free boarding schematic, bicycle bays, and Lock Screen Live Activity preview.",
      "Bottom primary action clears the home indicator via safeAreaInset (>= 50pt target) and supports Light, Dark, and High Contrast modes.",
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
      "Interactive HTML iOS studio simulation; physical Xcode Simulator / VoiceOver rotor audit remains not-checked.",
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
    ecosystem: "Channels & HUD",
    stackShort: "Doc · Typst + MJML",
    stack: "Doc · Typst + MJML",
    stackLabel: "Typst PDF/UA + MJML Statement",
    mode: "Communicate",
    palette: ["#FAF9F6", "#18181B", "#1D4ED8", "#475569"],
    prompt:
      "Design an A4 statement of account in Typst paired with its Outlook-safe MJML and plaintext transactional email notification.",
    brief:
      "Dual-surface Typst A4 statement studio (with 18 mm margin guides & PDF/UA tag inspector) paired with a 4-mode Outlook-safe MJML & Plaintext email workbench. Illustrative fixture.",
    direction:
      "Physical-unit Typst A4 sheet + multi-client MJML & Plaintext workbench",
    decisions: [
      "Interactive Typst controls toggle 18 mm physical margin guides, PDF/UA /StructTreeRoot tag overlays, and multi-row page-break stress testing.",
      "Email workbench switches live across Apple Mail Light, Dark Mode, Images Blocked, and multipart/alternative Plaintext (.txt) under a 20 KB budget.",
      "Dedicated @media print rules output the clean physical A4 statement without studio chrome.",
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
      "Browser-rendered A4 & multi-client email studio; real Classic Outlook Windows and veraPDF runs remain not-checked.",
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
