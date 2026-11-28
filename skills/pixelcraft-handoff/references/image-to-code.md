# Image-to-Code & Mockup-to-Code Engine

Use this reference whenever the primary visual specification is a **raster image**—an approved AI-generated UI mockup (from the Mockup-First workflow), a product screenshot, a static export (PNG/WebP/JPEG), a hand-drawn wireframe, or an existing app capture—where structured Figma/Penpot vector metadata is absent or incomplete.

Monolithic "paste full screenshot → emit code in one shot" fails predictably: models omit small controls, flatten nested containers into fragile absolute positioning, copy garbled AI micro-text verbatim, reproduce failing contrast, and skip responsive breakpoints and interactive states. Follow this 6-stage divide-and-conquer pipeline instead.

---

## Stage 1 — Visual Triage, Provenance & AI-Artifact Stripping

Before writing a single line of code, classify the input image and separate **design intent** from **raster artifacts**:

| Image source | Default authority | Mandatory artifact-stripping actions |
|---|---|---|
| **Approved AI-generated UI mockup** (Mockup-First) | Specification for layout, hierarchy, palette posture, typography scale, and visual rhythm | Strip garbled/misspelled micro-text, inconsistent AI-drawn icon strokes, melted 1px borders, hallucinated metrics/charts, decorative background haze, and fake browser chrome/device bezels. |
| **Figma / Sketch / Penpot static PNG export** | High-fidelity visual specification for the captured breakpoint & state | Request structured tokens/specs if available (`design-translation.md`); otherwise infer semantic roles and verify WCAG/APCA contrast rather than blindly copying washed-out text. |
| **Existing production app screenshot (rebuild/port)** | Behavioral & visual evidence of current state | Preserve real user workflows and data contracts; do not copy legacy layout bugs, broken focus states, or desktop-only tables onto mobile. |
| **Hand sketch / low-fi wireframe** | IA and structural intent only | Treat styling as undecided; apply the committed direction card and semantic tokens (`pixelcraft-tokens`) rather than literal monochrome boxes. |

Record in `.pixelcraft/plan.md`: image path/provenance, viewport orientation/aspect ratio represented, which regions are `specification` vs `inspiration`, and what is missing (mobile breakpoint, dark mode, states, real data).

---

## Stage 2 — Divide-and-Conquer Layout Tree Decomposition

Never translate a complex full-screen image in one flat codegen pass. Partition the visual canvas recursively along clear horizontal and vertical split boundaries (DCGen / DesignCoder grouping chain) and write a **Layout Tree Spec** before coding:

1. **Level 0 — Page Shell & Landmarks:** Identify outer chrome and semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, or native `NavigationSplitView` / `Scaffold` / `TabView`). Strip any fake browser window frame or phone bezel from the image—never render fake OS traffic lights or device frames inside the real app.
2. **Level 1 — Major Bands & Split Regions:** Slice the viewport into named, non-overlapping regions (`top-bar`, `left-rail`, `hero-split`, `kpi-strip`, `primary-table`, `detail-drawer`). Record each region's approximate track proportion (`240px / 1fr`, `7fr / 5fr`, `3-col equal`).
3. **Level 2 — Flex & Grid Containers:** Within each region, classify every grouping as a flow container (`row`, `column`, `grid`, `wrap`, `sticky-header + scroll-body`) with alignment and gap rhythm. **Never use `position: absolute` with hardcoded `top`/`left` pixel coordinates for normal document flow.** Reserve absolute/overlay positioning strictly for badges, popovers, tooltips, or intentional overlapping media.
4. **Level 3 — Atomic Leaf Components & Repeating Data Patterns:** Identify repeated visual structures (nav items, stat cards, table rows, feed items, chips) and factor them into parameterized components driven by typed data arrays—never copy-paste 6 nearly identical static markup blocks.
5. **Multi-Screen Navigation Graph (when multiple mockups exist):** Map every visible navigation link, tab, modal trigger, and CTA to its target route/sheet/dialog (Page Transition Graph) before coding so zero dead controls slip into Build.

```text
Example Layout Tree (written before code):
AppShell (grid: 240px 1fr, min-h: 100dvh)
├── SidebarNav (column, gap: 16px, sticky)
│   ├── BrandHeader (row, align: center)
│   ├── NavGroup[primary] -> loop(NavItem[])
│   └── AccountFooter (row, mt: auto)
└── MainStage (column, min-w: 0)
    ├── TopBar (row, justify: space-between, sticky)
    │   ├── PageTitle + Breadcrumb
    │   └── ActionCluster (SearchTrigger, PrimaryCTA)
    └── ContentGrid (grid: 12-col, gap: 20px)
        ├── MetricStrip (span 12 -> 4x MetricCard loop)
        ├── ActivityTable (span 8 -> DataTable with empty/loading/error)
        └── InspectorRail (span 4 -> DetailPanel)
```

---

## Stage 3 — Semantic Token, Spacing & Typography Extraction

Extract visual measurements into **semantic tokens** (`pixelcraft-tokens`) rather than scattering raw hex codes and arbitrary pixel values:

1. **Color Role Extraction:**
   - Sample background canvas (`surface.canvas`), elevated panels (`surface.raised`), recessed wells (`surface.sunken`), borders (`border.subtle`, `border.strong`), primary/secondary/muted ink (`ink.primary`, `ink.secondary`, `ink.muted`), primary accent (`accent.primary`, `accent.on-primary`), and status roles (`status.success`, `status.warning`, `status.danger`).
   - Map into existing project tokens first (brownfield reuse outranks exact image RGB).
   - **Contrast Floor Override:** Verify every extracted text/background and control/surface pair against WCAG AA (`>= 4.5:1` body, `>= 3:1` large text & UI controls) using `check-contrast.mjs`. **If an AI mockup or screenshot has low-contrast muted text or unreadable ghost buttons, darken/adjust the semantic ink token to pass the floor** and log the intentional accessibility improvement.
2. **Spatial Rhythm Quantization:**
   - Snap noisy raster measurements (e.g., `15px`, `17px`, `23px`) onto a clean base scale (`4px`/`8px`: `4, 8, 12, 16, 20, 24, 32, 48, 64`) and consistent radius steps (`0`, `4`, `8`, `12`, `16`, `9999`).
   - Preserve intentional optical hierarchy (tighter gaps inside a card than between cards; clear section separation).
3. **Typography Extraction:**
   - Infer role hierarchy (`display`, `heading-lg`, `heading-md`, `body`, `caption`, `mono/numeric`) with explicit sizes, weights, line-heights, and letter-spacing.
   - Use licensed/available project fonts or close metric-compatible equivalents; never hotlink unverified font URLs. Apply `font-variant-numeric: tabular-nums` to aligned metrics, prices, timestamps, and table columns.

---

## Stage 4 — Asset, Icon & Copy De-Hallucination

Static mockups—especially AI-generated ones—always require active de-hallucination before reaching production code:

| Element in image | Forbidden literal translation | Required production translation |
|---|---|---|
| **Garbled / misspelled AI text or lorem ipsum** | Copying `"Dashb0ard"`, `"Lorem ipsum"`, or invented testimonials/metrics verbatim | Replace with verified copy from the brief/repo; mark genuinely missing copy visibly (`[Copy needed: ...]`) or ask. |
| **Inconsistent AI-drawn icons** | Tracing blurry raster icons as inline `<svg>` blobs or substituting emojis (`🚀`, `✨`) | Map every icon to **one** coherent vector icon system (`lucide`, SF Symbols, Material Symbols, Phosphor, Heroicons) with uniform stroke width and optical size (`16px`/`20px`/`24px`). |
| **Rasterized charts, sparklines & maps** | Embedding a cropped PNG of a fake chart or hand-coding brittle static SVG paths with invented numbers | Wire a real charting/mapping library (`pixelcraft-dataviz`) backed by typed data (or explicit empty/sample fixture state). |
| **Hero photography / product visuals** | Drawing fake illustrations out of CSS `<div>` rectangles or shipping blurry cropped mockup fragments | Use real licensed project assets, dedicated clean image generation (`imagegen` / `pixelcraft-media` at native aspect ratio without UI text baked in), or explicit labeled media placeholders until real assets arrive. |
| **Baked-in shadows/gradients on text** | Exporting headings as PNG images | Render real selectable, scalable text with CSS/native typography primitives. |

---

## Stage 5 — Non-Visual Behavior Inference (What a Static Image Cannot Show)

A single image only shows one viewport, one data snapshot, and zero interaction. Infer and implement the missing production contract explicitly (recording non-obvious choices as `assumption` in `.pixelcraft/plan.md`):

1. **Semantic Controls & Accessibility:**
   - Every clickable region becomes a native `<button>`, `<a href>`, `<input>`, or native platform control—never `<div onClick>`.
   - Provide accessible names (`<label>`, `aria-label` on icon-only controls), visible `:focus-visible` rings, logical keyboard tab order, `Escape` to dismiss overlays, `>= 44×44` touch targets, and `>= 16px` mobile input font-size (preventing iOS Safari auto-zoom).
2. **Responsive Restructuring (from a single desktop or mobile mockup):**
   - **Desktop mockup → Mobile (`390×844`):** Collapse fixed sidebars into a real wired drawer/sheet or bottom tab bar; stack multi-column splits vertically; convert dense multi-column tables into horizontal scroll containers or stacked mobile rows; ensure zero horizontal overflow (`scrollWidth <= innerWidth`).
   - **Mobile mockup → Desktop (`1440×900`):** Constrain readable prose (`max-width: 65ch`), promote bottom tabs to sidebar or top navigation rail, and expand single-column lists into balanced multi-column grids or master-detail panes—never stretch a phone screen to 1440px wide.
3. **Complete State Matrix:**
   - Interactive states: `hover`, `focus-visible`, `active`, `selected`, `disabled`.
   - Async & edge states: `loading` (with `> 300 ms` spinner delay/skeleton), `empty` (first-use & no-results with recovery CTA), `error` (inline recovery preserving dirty user input), `long/unbroken strings` (`min-w: 0`, `overflow-wrap: anywhere`, `+50–100%` short-label i18n tolerance), and `prefers-reduced-motion`.
   - Dark / high-contrast mode parity when in scope.

---

## Stage 6 — Hierarchy-Guided Synthesis & Vision-Guided Self-Correction Loop

Build bottom-up or region-by-region from the Stage 2 Layout Tree, then close the visual loop with `pixelcraft-visual-qa`:

1. **Stack-Idiomatic Synthesis:** Translate each Layout Tree branch into the target stack's native primitives—reusing existing repo components before creating new ones:
   - **Web (React/Next, Vue/Nuxt, Svelte, Angular, Astro, HTML/CSS):** Semantic HTML, CSS Grid/Flexbox, custom properties/tokens, real form/dialog primitives.
   - **SwiftUI / UIKit:** `NavigationSplitView`, `Grid`/`VStack`/`HStack`, `@Environment`, Dynamic Type, SF Symbols, `#Preview` states.
   - **Jetpack Compose / KMP:** `Scaffold`, `Row`/`Column`/`LazyVerticalGrid`, `Modifier` chains, Material/custom `CompositionLocal` tokens, `@Preview`.
   - **Flutter:** `LayoutBuilder`, `Row`/`Column`/`CustomScrollView`, `ThemeData` extensions, `Semantics`, Widgetbook/golden states.
   - **React Native / Expo / LynxJS:** Native navigation, Flexbox/CSS tokens, `SafeAreaView`, platform accessibility props.
   - **Desktop (Tauri, Qt/QML, WinUI/WPF, Avalonia, Rust GPUI/Slint):** Native window/menu bar, system DPI scaling, keyboard shortcuts, platform accessibility tree.
2. **Render & Compare (Vision-Guided Self-Correction):**
   - Run the app and capture the rendered output at the **exact viewport size, scale, and mode** of the approved mockup (e.g., `shoot.mjs` for web, simulator/emulator for mobile, window capture for desktop).
   - Compare **full frame + per-region crops** against the approved mockup using the region-aware tolerances in `references/fidelity-tolerance.md`.
   - Diagnose every mismatch by category:
     1. **Semantics / Accessibility / Contrast** (fix first—never sacrifice for pixel parity),
     2. **Macro Layout & Proportions** (column ratios, alignment, above-the-fold balance, overflow),
     3. **Typography & Surface Hierarchy** (scale jumps, weight contrast, padding rhythm, border/elevation weight),
     4. **Micro Polish** (icon optical alignment, hairline precision, badge spacing).
3. **Targeted Branch Patching (Max 3 Rendered Rounds):**
   - Patch **only** the divergent component/branch from the Layout Tree—never rewrite the whole file from scratch when fixing a spacing or alignment drift.
   - Re-render and re-compare after each batch. Cap rendered visual-parity loops at **3 documented rounds**; if a conflict remains (e.g., mockup geometry vs WCAG/responsive floor), record it honestly as an intentional floor deviation or `OPEN` item with `rendered` evidence.
   - Run full Phase 5 verification (`slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, compiler/tests, `check-acceptance.mjs`) before reporting.

---

## Do / Don't Quick Reference

| Don't (Monolithic Screenshot Copying) | Do (Divide-and-Conquer Image-to-Code) |
|---|---|
| Dump the full image into one pass and emit `position: absolute` divs with pixel coordinates. | Decompose into a semantic Layout Tree (Shell → Bands → Flex/Grid → Repeating Components) before coding. |
| Copy garbled AI mockup text, fake `+24.5%` KPIs, or broken `2.4:1` contrast verbatim. | Replace with real brief copy, real data/empty states, one clean vector icon set, and WCAG-passing semantic tokens. |
| Leave the image's fake macOS window dots, phone bezel, or browser address bar inside the web/app UI. | Strip all presentation chrome; build only the real application viewport. |
| Ship only the desktop happy path shown in the mockup. | Infer responsive restructuring (`390×844` + desktop), keyboard/a11y semantics, and `loading`/`empty`/`error`/`overflow` states. |
| Declare "matches the mockup" by reading source code (`static`). | Render the build, compare full frame + region crops against the approved mockup (`rendered`), and patch divergent branches cleanly. |

## Verification checklist

- [ ] Image provenance, source type (`AI mockup` / `export` / `screenshot` / `sketch`), and region authority recorded in `.pixelcraft/plan.md`.
- [ ] Layout Tree Spec written before code; zero `position: absolute` flow-layout hacks; repeated items factored into data-driven components.
- [ ] Colors, typography, and spacing mapped to semantic tokens (`pixelcraft-tokens`); contrast verified via `check-contrast.mjs` (fixing low-contrast mockup text rather than copying failures).
- [ ] Zero garbled AI text, zero fake device/browser chrome, zero mismatched raster icons, zero unapproved invented proof/metrics.
- [ ] Responsive breakpoints, keyboard/a11y semantics, and `hover`/`focus`/`loading`/`empty`/`error`/`overflow`/`reduced-motion` states implemented.
- [ ] Rendered comparison against the approved mockup completed via `pixelcraft-visual-qa` (up to 3 targeted branch-patch rounds) with honest `rendered` / `not-checked` labels.
