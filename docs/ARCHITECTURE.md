# Pixelcraft architecture

Pixelcraft is a pack of portable Agent Skills (`skills/<name>/SKILL.md`) that makes coding agents
produce distinctive UI and rigorous UX on **any** frontend stack. Read `docs/DESIGN-RATIONALE.md`
before changing the reasoning behind major rules.

## Product thesis

1. **Divergence before commitment** — LLM UIs converge because single-shot "best design" prompting
   collapses to the mode. Pixelcraft forces a distribution of 3–5 far-apart directions,
   scores them against the brief, commits to one, and records history so the next build differs.
2. **A hard floor that never dictates appearance** — truthfulness, accessibility, state coverage,
   localization, responsiveness, performance and verifiability are mandatory; heroes, cards,
   palettes, fonts and layout shapes are not.
3. **Design once, translate per stack** — core skills speak design language (roles, scales, units,
   rules). Platform skills translate them into idioms of web, mobile, data apps, desktop, TUI, email
   and game UI. Never assume React/Tailwind.
4. **Honest verification** — every claim names its evidence: rendered, static inspection,
   model judgment, not checked, or waived.

## Authority order

explicit user brief → existing project design system/tokens → platform conventions + legal +
accessibility floor → Pixelcraft guidance → model taste.

## Skills

The architecture has five layers: **Plan** (`pixelcraft-plan`), **Core** (orchestration, direction, craft, tokens, UX), **Surfaces** (platform/framework skills), **Patterns** (surface-independent product patterns), and **Quality** (review, accessibility, visual QA). Layers compose; no layer substitutes for the mandatory floor.

| Skill | Role |
|---|---|
| `pixelcraft` | Orchestrator: detect stack + surface mode, enforce anti-laziness iron laws, run the loop, route to other skills, final report contract |
| `pixelcraft-plan` | Step 0: brownfield repo discovery, greenfield intake, Grill-Me Socratic interview (one question at a time with recommendations), lazy-default rejection & sub-stack library craft gate, `.pixelcraft/plan.md` |
| `pixelcraft-direction` | Divergence & creative brainstorming engine: brief/material extraction, 3-tier ambition pitch, ASCII wireframe + real-copy draft, pre-code Design Approval gate, movements, motion identity, slop fingerprints, history |
| `pixelcraft-craft` | Visual craft: typography, color (OKLCH, contrast), layout/composition, motion language, imagery, iconography |
| `pixelcraft-tokens` | DTCG 2025.10 tokens (`$root`, `$deprecated`, Resolver), Style Dictionary/Terrazzo/Figma MCP, theming/modes, zero-dep export to 19 targets (CSS/Tailwind/SCSS/TS/Swift/Kotlin/Android XML/Dart/Python/Qt/Textual/XAML/Rust/Go Lip Gloss/Godot/Unity USS/Slint/GTK4/Typst) |
| `pixelcraft-ux` | UX before and during build: JTBD, IA/flow divergence, full state coverage (incl. AI/streaming), forms, feedback, navigation, cognitive load, i18n, UX writing |
| `pixelcraft-patterns` | Patterns layer: dashboards/admin, commerce, SaaS billing/paywalls, multi-tenant/RBAC/audit logs, notifications/inbox, scheduling/Kanban, history/diff/undo, AI-in-app & offline sync, creative tools, communication, auth/onboarding, marketing, scrollytelling, settings, search/filtering, tables/CRUD, sub-stack library escalation |
| `pixelcraft-dataviz` | Patterns layer for evidence communication: chart choice, encoding, color/accessibility, tables/dashboards, streaming, node graphs, maps/PMTiles/Turf, BI plugins (Grafana/Superset), rendering scale, cross-language libraries |
| `pixelcraft-accessibility` | WCAG 2.2 floor + platform translations (incl. AccessKit), native HTML APG replacements, reduced-motion, canvas/graphics alternatives, media controls, and verification split |
| `pixelcraft-review` | Adversarial audit / critique / polish: heuristic + DIY-slop scoring with evidence + confidence, persona walkthroughs, multi-language slop scan script (`--fail-on`) |
| `pixelcraft-visual-qa` | Quality-layer render/screenshot/video/trace/critique/fix loop, surface-typed `finish-gate.mjs`, and cross-platform zero-dep CLIs (`check-contrast`, `check-email`, `check-tui`, `check-pdf`) |
| `pixelcraft-extensions` | Host-constrained extension/plugin surfaces: MV3 browser UI (WXT/Plasmo/Safari), content-script Shadow DOM, VS Code webviews/Chat/MCP, Raycast, Figma plugins/widgets, Office, JetBrains, Obsidian, Shopify/Forge |
| `pixelcraft-web` | HTML/CSS/JS & non-JS web frameworks (incl. Filament, Symfony UX, WordPress Gutenberg, ViewComponent/Phlex, MudBlazor/FluentUI Blazor, Gomponents, Jaspr), styling/component/interaction-search primitives (`cmdk`/`vaul`/`sonner`/`embla`/Pagefind/Orama), editors, grids, sync, GSAP/Motion/Theatre.js/Spline/Three.js/WebGPU, and browser media players |
| `pixelcraft-mobile` | SwiftUI (incl. TCA), UIKit, Jetpack Compose, Flutter, React Native/Expo, LynxJS, KMP, NativeScript/Skip, HarmonyOS ArkUI/ArkTS, Elixir LiveView Native, Taro/uni-app, Ionic/Capacitor, .NET MAUI, Flet, Kivy |
| `pixelcraft-data-apps` | Streamlit, Gradio, marimo/Solara/Mesop/Taipy (Polars/Narwhals), Chainlit/FastHTML/Preswald/internal tools, Reflex, NiceGUI, Dash, Panel, Shiny, Jupyter/AnyWidget, R Shiny, Julia Genie, Observable Framework, Evidence |
| `pixelcraft-desktop` | Tauri v2, Electron/Electrobun, Qt 6/PySide6/PyQt6/QML (anti-Tkinter guard), WinUI 3/WPF, AppKit/SwiftUI macOS, GTK4/libadwaita, Avalonia, Rust GUIs (GPUI/Slint/Dioxus/Iced/`libcosmic`/Vizia/egui), JavaFX/Swing, C++/Zig GUI (incl. JUCE audio/GTKmm/Nuklear), Go GUI (Wails v3/Fyne/Gio), Uno |
| `pixelcraft-tui` | Textual, Rich, Ink, Bubble Tea v2/Lip Gloss v2, Ratatui, Terminal.Gui v2, Spectre.Console, prompt_toolkit, OpenTUI, FTXUI, CLI prompts, and modern terminal protocols |
| `pixelcraft-email` | HTML tables, MJML, React Email, Maizzle, Vue Email: Classic & New Outlook, Gmail 102 KB limits, dark mode, image blocking, BIMI, plaintext parity |
| `pixelcraft-document` | Print/paged-media surface: print CSS, Typst/LaTeX/WeasyPrint/Paged.js/Playwright PDF/Gotenberg/React-PDF/`pdf-lib`/Quarto, PDF.js/PptxGenJS, invoices/reports/CVs, slide decks, PDF/UA verification |
| `pixelcraft-media` | External media surface: social cards/OG generation (Satori/Takumi/Resvg/Sharp/Playwright), SVG banners, platform safe zones, thumbnail legibility, Remotion/Motion Canvas/Revideo/FFmpeg export |
| `pixelcraft-chat-ui` | Conversational surfaces across two tracks: host-constrained messaging/mini apps (Slack/Discord/Telegram/Zalo/WhatsApp/Teams/LINE/WeChat) and app-owned AI/agentic workspaces (Vercel AI SDK, assistant-ui, CopilotKit, AG-UI, MCP Apps, OpenAI Apps SDK, A2UI, LangGraph) |
| `pixelcraft-constrained` | Hardware/input-constrained surfaces: TV (tvOS/Compose for TV/Roku/Fire TV)/wearables (watchOS/Wear OS)/e-ink/kiosk/POS/ISA-101 HMI/embedded (LVGL/Slint MCU/`embedded-graphics`)/automotive (CarPlay/AAOS)/voice (SSML & Realtime Voice AI) |
| `pixelcraft-handoff` | Design-to-code bridge: Figma MCP/Code Connect/Variables, Penpot, approved-design translation, existing-component reuse, motion handoff, missing states and measured fidelity |
| `pixelcraft-spatial` | XR/spatial surface: visionOS 2/26, Android XR, Meta Horizon OS/Spatial SDK, WebXR (`@react-three/xr` v6/Wonderland/Needle), Unity XRI, Unreal OpenXR — embodied input, depth/ergonomics, comfort, privacy, accessibility |
| `pixelcraft-game-ui` | Unity UI Toolkit & uGUI, Godot (GDScript/C#), Unreal UMG/CommonUI/MVVM, LÖVE2D, Bevy, MonoGame, Ebitengine, Macroquad, Flame, Pygame/Arcade, HTML5/middleware game UI (Phaser/PixiJS/NoesisGUI/RmlUi/Dear ImGui/Raylib/SDL3) |
| `pixelcraft-brandkit` | Brand-kit / identity-board image generation, logo methods, governance, small-size icon pipelines, and token handoff |

### Creative engineering ownership

Creative engineering extends existing skills rather than creating a parallel catalog. `pixelcraft-craft` owns motion design intent; `pixelcraft-web` owns browser runtimes and implementation (GSAP/Motion/Lenis/Theatre.js/Spline, 3D engines including Three.js/R3F/Babylon/PlayCanvas/Threlte/TresJS/`<model-viewer>`, Canvas/PixiJS/WebGL/WebGPU/TSL, interaction/search primitives, and browser audio/video players); `pixelcraft-patterns` owns narrative/scrollytelling and pattern-to-library escalation; `pixelcraft-direction` owns creative brainstorming, pre-code design sign-off, and evidence-based reference analysis; `pixelcraft-accessibility` owns motion/canvas/media alternatives; `pixelcraft-visual-qa` owns timeline, device, contrast, TUI, email, and PDF evidence; `pixelcraft-handoff` owns motion specifications. `pixelcraft-spatial` stays focused on embodied XR/VR/AR rather than ordinary browser 3D; `pixelcraft-media` stays focused on external image/social/video asset generation rather than embedded browser players.

Each skill is self-contained (installable alone). Skills refer to each other **by name**
("use the `pixelcraft-ux` skill"), never by relative path across skill folders.
Platform skills keep one reference file per framework (`references/<framework>.md`) so they scale to
many stacks via progressive disclosure.

## The Pixelcraft loop (owned by `pixelcraft`)

0. **Plan** – `pixelcraft-plan`: brownfield repo map, optional Grill-Me one-question-at-a-time discovery, lazy-default rejection & sub-stack library craft gate in `.pixelcraft/plan.md`.
1. **Frame** – stack + surface detection, mode (Persuade / Operate / Read / Experience / Play /
   Communicate), audience, job-to-be-done, real material inventory, existing design system.
2. **Diverge** – `pixelcraft-direction`: 3–5 directions across IA, visual posture, and craft ambition with ASCII wireframes and real-copy drafts; pre-code Design Approval gate; check history.
3. **Specify** – direction card + tokens (`pixelcraft-tokens`) + UX plan (flows + state matrix,
   `pixelcraft-ux`).
4. **Build** – via the platform skill; floor rules and zero-stub discipline applied by default, not repaired later.
5. **Verify** – `pixelcraft-review` plus `pixelcraft-visual-qa`: adversarial defect-hunt, multi-language slop scan, WCAG+APCA contrast & surface checks (`check-email`/`check-tui`/`check-pdf`), rendered screenshots/captures, finish gate.
6. **Report** – what was verified and how, open risks, decisions.

## Conventions for SKILL.md

- Frontmatter: `name` (= folder name, lowercase-hyphen, ≤64 chars) and `description`
  (third person, what + when + trigger words, ≤1024 chars). Optional `license`, `metadata`.
  No host-specific fields.
- Body ≤ 500 lines (target ≤ 300). Depth in `references/*.md`, one level deep, each linked from
  SKILL.md with a one-line "read when…".
- Imperative, concrete, checkable rules. Do not restate what models already know.
  Prefer tables, checklists, do/don't pairs with code in the target idiom.
- Scripts: Node ≥ 18, zero dependencies, `.mjs`, runnable as `node scripts/x.mjs --help`.

## Repository layout

```
skills/<skill>/SKILL.md, references/, scripts/, assets/
bin/pixelcraft.mjs             # zero-dependency CLI (add, list, doctor, remove, init-router, check, wizard)
install.sh, install.ps1        # Node-free shell and PowerShell installers
scripts/                       # validator, adapter builder, offline eval runner, and contract tests
evals/                         # 26 behavioural eval guides + 74 multi-language JSON fixtures (26/26 skills)
website/                       # multi-stack showcase site and 6-exhibit gallery capture scripts
assets/                        # brand artwork and icons
docs/ARCHITECTURE.md, docs/DESIGN-RATIONALE.md, docs/INSTALL.md
plugin.json, gemini-extension.json
.claude-plugin/, .agents/plugins/
.github/workflows/             # CI validation, website deploy, and tag-release workflows
```
