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
| `pixelcraft` | Orchestrator: detect stack + surface mode, run the loop, route to other skills, final report contract |
| `pixelcraft-plan` | Step 0: brownfield repo discovery, greenfield requirements intake, optional evidence-first product/stack decision interview for materially unresolved choices, weighted stack selection, `.pixelcraft/plan.md` consumed by later skills |
| `pixelcraft-direction` | Divergence engine: brief/material extraction, movement catalog, motion identity, evidence-based reference analysis, signature element, slop fingerprints, history |
| `pixelcraft-craft` | Visual craft: typography, color (OKLCH, contrast), layout/composition, motion language, imagery, iconography |
| `pixelcraft-tokens` | DTCG 2025.10 tokens & Resolver, Style Dictionary/Terrazzo/Figma MCP, theming/modes, zero-dep export to CSS/Tailwind/SCSS/TS/Swift/Kotlin/Android XML/Dart/Python/Qt/Textual/XAML/Rust |
| `pixelcraft-ux` | UX before and during build: JTBD, flows, IA, full state coverage (incl. AI/streaming), forms, feedback, navigation, cognitive load, i18n, UX writing |
| `pixelcraft-patterns` | Patterns layer: dashboards/admin, commerce, SaaS billing/paywalls, multi-tenant/RBAC/audit logs, notifications/inbox, scheduling/Kanban, history/diff/undo, AI-in-app & offline sync, creative tools, communication, auth/onboarding, marketing, scrollytelling, settings, search/filtering, tables/CRUD |
| `pixelcraft-dataviz` | Patterns layer for evidence communication: chart choice, encoding, color/accessibility, tables/dashboards, streaming, node graphs, maps/PMTiles/Turf, rendering scale, cross-language libraries |
| `pixelcraft-accessibility` | WCAG 2.2 floor + platform translations (incl. AccessKit), native HTML APG replacements, reduced-motion, canvas/graphics alternatives, media controls, and verification split |
| `pixelcraft-review` | Audit / critique / polish: heuristic scoring (incl. AI heuristics) with evidence + confidence, persona walkthroughs, slop scan script |
| `pixelcraft-visual-qa` | Quality-layer render/screenshot/video/trace/critique/fix loop, animation milestone evidence, document/PDF/terminal/email/mobile/desktop/game captures, and GPU performance budgets |
| `pixelcraft-extensions` | Host-constrained extension/plugin surfaces: MV3 browser UI (WXT/Plasmo/Safari), content-script Shadow DOM, VS Code webviews/Chat/MCP, Raycast, Figma plugins/widgets, Office, JetBrains, Obsidian, Shopify/Forge |
| `pixelcraft-web` | HTML/CSS/JS & non-JS web frameworks, styling/component/sync/auth/editor/grid ecosystems, GSAP/Motion/Lenis, Three.js/R3F/Babylon/PlayCanvas/Threlte/TresJS/`<model-viewer>`, PixiJS/Canvas/WebGL/WebGPU/TSL, and browser audio/video players |
| `pixelcraft-mobile` | SwiftUI, UIKit, Jetpack Compose, Flutter, React Native/Expo, LynxJS, KMP, NativeScript/Skip, Ionic/Capacitor, .NET MAUI, Flet, Kivy |
| `pixelcraft-data-apps` | Streamlit, Gradio, marimo/Solara/Mesop/Taipy, Chainlit/FastHTML/Preswald/internal tools, Reflex, NiceGUI, Dash, Panel, Shiny, Jupyter/AnyWidget, R Shiny, Julia Genie, Observable Framework, Evidence |
| `pixelcraft-desktop` | Tauri v2, Electron/Electrobun, Qt 6/PySide6/QML, WinUI 3/WPF, AppKit/SwiftUI macOS, GTK4/libadwaita, Avalonia, Rust GUIs (GPUI/Slint/Dioxus/Iced/egui), JavaFX/Swing, C++/Zig GUI, Go GUI (Wails v3/Fyne/Gio), Uno |
| `pixelcraft-tui` | Textual, Rich, Ink, Bubble Tea v2/Lip Gloss v2, Ratatui, Terminal.Gui v2, Spectre.Console, prompt_toolkit, OpenTUI, FTXUI, CLI prompts, and modern terminal protocols |
| `pixelcraft-email` | HTML tables, MJML, React Email, Maizzle, Vue Email: Classic & New Outlook, Gmail 102 KB limits, dark mode, image blocking, BIMI, plaintext parity |
| `pixelcraft-document` | Print/paged-media surface: print CSS, Typst/LaTeX/WeasyPrint/Paged.js/Playwright PDF/Gotenberg/React-PDF/`pdf-lib`/Quarto, PDF.js/PptxGenJS, invoices/reports/CVs, slide decks, PDF/UA verification |
| `pixelcraft-media` | External media surface: social cards/OG generation (Satori/Takumi/Resvg/Sharp/Playwright), SVG banners, platform safe zones, thumbnail legibility, Remotion/Motion Canvas/Revideo/FFmpeg export |
| `pixelcraft-chat-ui` | Conversational surfaces across two tracks: host-constrained messaging/mini apps (Slack/Discord/Telegram/Zalo/WhatsApp/Teams/LINE/WeChat) and app-owned AI/agentic workspaces (Vercel AI SDK, assistant-ui, CopilotKit, AG-UI, MCP Apps, OpenAI Apps SDK, A2UI, LangGraph) |
| `pixelcraft-constrained` | Hardware/input-constrained surfaces: TV (tvOS/Compose for TV/Roku/Fire TV)/wearables (watchOS/Wear OS)/e-ink/kiosk/POS/ISA-101 HMI/embedded (LVGL/Slint MCU/`embedded-graphics`)/automotive (CarPlay/AAOS)/voice (SSML & Realtime Voice AI) |
| `pixelcraft-handoff` | Design-to-code bridge: Figma MCP/Code Connect/Variables, Penpot, approved-design translation, existing-component reuse, motion handoff, missing states and measured fidelity |
| `pixelcraft-spatial` | XR/spatial surface: visionOS 2/26, Android XR, Meta Horizon OS/Spatial SDK, WebXR (`@react-three/xr` v6/Wonderland/Needle), Unity XRI, Unreal OpenXR — embodied input, depth/ergonomics, comfort, privacy, accessibility |
| `pixelcraft-game-ui` | Unity UI Toolkit & uGUI, Godot, Unreal UMG/CommonUI/MVVM, LÖVE2D, Bevy, MonoGame, HTML5/middleware game UI (Phaser/PixiJS/NoesisGUI/RmlUi/Dear ImGui/Raylib/SDL3): HUD legibility, controller nav, safe areas, localization |
| `pixelcraft-brandkit` | Brand-kit / identity-board image generation, logo methods, governance, small-size icon pipelines, and token handoff |

### Creative engineering ownership

Creative engineering extends existing skills rather than creating a parallel catalog. `pixelcraft-craft` owns motion design intent; `pixelcraft-web` owns browser runtimes and implementation (GSAP/Motion/Lenis, 3D engines including Three.js/R3F/Babylon/PlayCanvas/Threlte/TresJS/`<model-viewer>`, Canvas/PixiJS/WebGL/WebGPU/TSL, and browser audio/video players); `pixelcraft-patterns` owns narrative/scrollytelling; `pixelcraft-direction` owns evidence-based reference analysis; `pixelcraft-accessibility` owns motion/canvas/media alternatives; `pixelcraft-visual-qa` owns timeline and device evidence; `pixelcraft-handoff` owns motion specifications. `pixelcraft-spatial` stays focused on embodied XR/VR/AR rather than ordinary browser 3D; `pixelcraft-media` stays focused on external image/social/video asset generation rather than embedded browser players.

Each skill is self-contained (installable alone). Skills refer to each other **by name**
("use the `pixelcraft-ux` skill"), never by relative path across skill folders.
Platform skills keep one reference file per framework (`references/<framework>.md`) so they scale to
many stacks via progressive disclosure.

## The Pixelcraft loop (owned by `pixelcraft`)

0. **Plan** – `pixelcraft-plan`: brownfield repo map or greenfield constraints/stack decision in `.pixelcraft/plan.md`.
1. **Frame** – stack + surface detection, mode (Persuade / Operate / Read / Experience / Play /
   Communicate), audience, job-to-be-done, real material inventory, existing design system.
2. **Diverge** – `pixelcraft-direction`: 3–5 directions with probabilities, scored; pick; log why
   others lost; check history.
3. **Specify** – direction card + tokens (`pixelcraft-tokens`) + UX plan (flows + state matrix,
   `pixelcraft-ux`).
4. **Build** – via the platform skill; floor rules applied by default, not repaired later.
5. **Verify** – `pixelcraft-review` plus `pixelcraft-visual-qa`: slop scan, a11y checks, rendered screenshots/captures where possible,
   heuristic critique, persona walkthrough, performance-budget evidence.
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
bin/pixelcraft.mjs             # zero-dependency installer CLI and wizard
install.sh, install.ps1        # Node-free shell and PowerShell installers
scripts/                       # validator, adapter builder, and contract tests
evals/                         # 26 behavioural eval guides + JSON fixtures (26/26 skills)
website/                       # interactive showcase site and gallery capture scripts
assets/                        # brand artwork and icons
docs/ARCHITECTURE.md, docs/DESIGN-RATIONALE.md
plugin.json, gemini-extension.json
.claude-plugin/, .agents/plugins/
.github/workflows/             # CI validation, website deploy, and tag-release workflows
```
