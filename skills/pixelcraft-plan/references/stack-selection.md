# Greenfield stack selection

Never pick a stack by habit—and **never avoid React, Vue, or Angular artificially** just to look minimal or "anti-default." Generate candidates from the requirement shape, ecosystem dependencies, and the team's actual language/operations constraints. Do not over-correct toward lightweight stacks (such as Svelte, Astro, Solid, or plain HTML/htmx) when the product genuinely depends on deep specialized ecosystems (rich-text/code/node editors, whiteboards, AI-native UI libraries, enterprise data grids, or broad team hiring/longevity) where React (Next.js, TanStack Start, React Router v7), Vue/Nuxt, or Angular is the stronger engineering fit.

## Required intake

Target platforms and input modalities; audience/locales/accessibility/legal duties; team languages and maintenance capacity; offline/network behavior; performance/startup/battery/hardware limits; distribution/update/store model; backend/protocol/contracts; design ambition/custom rendering needs; test/release maturity; budget/timeline; hard exclusions. Missing hard facts are risks, not permission to assume.

## Weighted decision matrix

| Criterion | Weight | Candidate A | Candidate B | Candidate C |
|---|---:|---:|---:|---:|
| Platform/input fit | 1–5 | score/evidence | | |
| Team/language fit | 1–5 | | | |
| Accessibility maturity | 1–5 | | | |
| Performance/resource fit | 1–5 | | | |
| Distribution/operations | 1–5 | | | |
| UX/expressiveness needs | 1–5 | | | |
| Ecosystem/hiring/longevity | 1–5 | | | |
| Verification tooling | 1–5 | | | |
| Time/budget risk | 1–5 | | | |

Use hard gates before weights: unsupported target platform, missing legal/accessibility requirement, impossible offline/distribution constraint, or team inability to maintain. Score 1–5 with evidence and confidence; do not manufacture false precision. Include at least three candidates when feasible. Report winner, runner-up, why runner-up lost, and reversal conditions.

## Use-case shortlists

| Use case | Candidates to compare | Notes |
|---|---|---|
| Web application | TypeScript React (Next.js, TanStack Start, React Router v7) / Vue (Nuxt 4) / Angular (Signals) / Svelte (SvelteKit) / Solid / Qwik; htmx/Alpine; Lit (Web Components); Rust Leptos/Yew; Kotlin Kobweb/Compose Web; Elm; ClojureScript Reagent/re-frame; F# Fable; Scala Laminar; Java Vaadin; server-rendered Rails/Laravel/Django/Phoenix/Blazor/Go templ | Match framework weight to ecosystem needs: pick React/Vue/Angular when rich component/editor/AI/grid ecosystems or multi-team hiring dominate; pick htmx/Alpine, Lit, SvelteKit, Solid, or server-rendered when compact runtime, standard Web Components, or low ceremony dominate; WASM/canvas approaches need accessibility/bundle scrutiny |
| Content site | Astro, plain HTML/CSS, static generators, server-rendered CMS/framework, lightweight islands | Justify any SPA-like choice; rendering performance/reader mode matter |
| AI-native / Agentic UI | Vercel AI SDK (`@ai-sdk/*`), assistant-ui, CopilotKit / AG-UI, Chainlit, MCP Apps | Evaluate streaming transport, tool-call/approval state lifecycles, generative UI sandboxing, provenance/citations, and fallback when models fail or stream slowly |
| Mobile | SwiftUI/UIKit, Kotlin Compose, Flutter, React Native/Expo, LynxJS, Kotlin Multiplatform, NativeScript, Skip, Ionic/Capacitor, .NET MAUI, Uno | Platform fidelity vs shared code; store/accessibility/input behavior decide |
| Cross-platform app | Flutter, React Native, LynxJS, Kotlin Multiplatform/Compose Multiplatform, .NET MAUI, Uno, Tauri v2/Electron for desktop-centric use | “Write once” does not erase platform conventions |
| Desktop | SwiftUI macOS, AppKit, Tauri v2, Electron, Electrobun, Flutter Desktop, Compose Multiplatform Desktop, Qt C++/PySide/QML, WinUI/WPF, GTK, Avalonia, Uno, JavaFX/Swing, Rust egui/Slint/iced/Dioxus/GPUI, Go Fyne/Wails/Gio | Native integration, memory/startup, accessibility, signing, menus/windowing matter |
| Internal tool/data app | marimo, Solara, Mesop, Taipy, Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny for Python/R, Jupyter widgets/anywidget, Genie (Julia), Observable Framework, Evidence, CRUD server-rendered frameworks | Choose speed/clarity/reproducibility, but inspect session/concurrency/security/freshness limits |
| CLI/TUI | Textual/Rich/prompt_toolkit (Python), Ink (Node), Bubble Tea/Lip Gloss (Go), Ratatui (Rust), Spectre.Console/Terminal.Gui (.NET), language-native CLI libraries | Character grid, keyboard behavior, terminal capability fallback, snapshot tests |
| Documents & Slides | Typst, WeasyPrint, Paged.js, Playwright PDF, Gotenberg, PDF.js, PptxGenJS, Slidev, Marp | Separate print pagination, PDF/UA tagging, font embedding, and deterministic raster output from browser layout habits |
| Media / Video | Satori, Takumi, Remotion, Motion Canvas, FFmpeg | Match deterministic frame/image generation, font loading, safe zones, and headless render throughput |
| Chat / Bot / Mini-Apps | Slack Block Kit, Discord Components/Modals, Telegram Mini Apps/Bot API, WhatsApp Flows, Adaptive Cards (Teams), LINE LIFF | Host payload/schema caps, interaction ack deadlines, and privacy/fallback rules govern UI design |
| Extensions / Plugins | WXT / Plasmo (browser MV3), VS Code Webviews/TreeViews, JetBrains Platform, Raycast, Obsidian, Figma Plugins, Shopify UI Extensions / Atlassian Forge | Host CSP, theme tokens, Shadow DOM isolation, and marketplace review rules are hard gates |
| Spatial / XR | visionOS (SwiftUI/RealityKit), Android XR (Compose XR), Horizon OS / Quest, WebXR, Unity XRI | Embodied comfort, depth/ergonomics, gaze/hand/controller input, and privacy boundaries come first |
| Game UI | Unity, Godot, Unreal, Bevy (Rust), MonoGame (C#), LÖVE2D (Lua), custom engine | Engine/gameplay architecture comes first; UI accessibility/certification constraints follow |
| Email | HTML tables, MJML, React Email, Maizzle | Client fragmentation dominates framework preference; plaintext parity mandatory |
| Embedded/kiosk | Qt/QML, Slint, LVGL/custom native, webview/Tauri/Electron only when resources permit, Flutter embedded where supported | Hardware/input/power/update/security constraints are hard gates |

## Lazy-Default Rejection Table

Never accept a low-craft or mismatched default merely because it is fast to scaffold. Reject these lazy defaults unless the user explicitly requires them (record an explicit waiver if kept):

| Surface | Lazy default to reject | Upgrade / craft-bar replacements | When the default is acceptable (requires explicit reason) |
|---|---|---|---|
| **Python desktop** | Tkinter / `ttk` for greenfield desktop products | PySide6 / Qt Quick (QML), Flet, NiceGUI (native mode), Tauri v2 + Python sidecar, or Textual (when terminal-native fits better) | Zero-dependency internal stdlib utility where installing any wheel is prohibited |
| **Desktop** | Unjustified Electron / heavy WebView wrapper | Tauri v2, SwiftUI / AppKit (macOS), WinUI 3 (Windows), GTK4 / libadwaita (Linux), Avalonia, Slint, or GPUI | Complex Chromium-dependent runtime (e.g., rich extension host, existing web studio) where memory/bundle cost is explicitly budgeted |
| **Data apps** | Streamlit for multi-user apps, reactive DAG notebooks, or production BI | marimo (reactive DAG), Shiny (Python/R), Panel, Dash, Reflex, NiceGUI, Observable Framework, or Evidence | Throwaway single-analyst script explicitly scoped as a disposable prototype |
| **CLI / TUI** | Bare `print()` loops, raw ANSI escape spaghetti, or unbuffered `input()` prompts | Ratatui (Rust), Bubble Tea v2 + Lip Gloss v2 (Go), Textual / Rich (Python), Ink (Node), `@clack/prompts` / `prompt_toolkit` | Non-interactive script piping plain line-oriented stdout/JSON (`NO_COLOR`, machine consumption) |
| **Mobile** | Lazy WebView / Cordova / Kivy wrapper for native consumer apps | SwiftUI (iOS), Jetpack Compose (Android), Flutter, or React Native (New Architecture / Expo) | Thin enterprise intranet wrapper explicitly constrained to an existing web portal |
| **Document / PDF** | `window.print()` or raster HTML screenshots masquerading as publication PDFs | Typst, WeasyPrint, Quarto, or React-PDF (plus Paged.js / Gotenberg where web-to-print CSS is required) | Ephemeral ad-hoc browser print stylesheet where print pagination/PDF-UA is out of scope |
| **Email** | Raw Flexbox / CSS Grid HTML (breaks Outlook Word engine & Gmail) | MJML, React Email, or Maizzle (compiling to hybrid table layouts + plaintext parity) | Never for production multi-client transactional/marketing email |
| **Web UI** | Hand-rolling fragile DIY modals, rich/code editors, charts, large tables, search facets, toasts, drawers, or carousels | Purpose-built accessible libraries below (via the active surface skill) | Trivial single-purpose micro-interaction with full native semantics (`<dialog>`, `<details>`, native `<input>`) |

## Sub-Stack Capability → Purpose-Built Library Gate

Before entering **Phase 3 (Specify)** or **Phase 4 (Build)**, map every complex UI capability in scope to a vetted, accessible, purpose-built library (or native platform primitive). **Hand-rolling these from scratch is a defect** unless a hard constraint forbids dependencies (record the constraint explicitly):

| Capability in scope | Web / JS purpose-built picks (match framework) | Non-web / native equivalents | Never hand-roll |
|---|---|---|---|
| **Rich text editor** | TipTap / ProseMirror, Lexical, Plate, BlockNote | AppKit/UIKit `TextKit 2`, Qt `QTextEdit`, Flutter Quill | `contenteditable` div + `execCommand` |
| **Code editor** | CodeMirror 6, Monaco Editor, Shiki (read-only highlight) | Qt `QPlainTextEdit` + syntax lexer, Zed GPUI / Textual `TextArea` | `<textarea>` overlaid on a regex-colored `<pre>` |
| **Node graph / canvas flow** | React Flow (`@xyflow/react`), Svelte Flow (`@xyflow/svelte`), Rete.js, Cytoscape.js | Qt Graphics View, egui/Slint custom scene graph | Raw SVG `<line>` dragging with manual zoom math |
| **Map / geospatial** | MapLibre GL JS, Leaflet, Deck.gl, PMTiles | MapKit (Apple), Google Maps Compose, MapLibre Native | Static image with hardcoded pixel pins |
| **>500-row / dense table** | TanStack Table + TanStack Virtual, AG Grid, Glide Data Grid | Qt `QTableView` + model, `NSTableView`/`LazyVStack`, Ratatui/Textual `DataTable` | Unvirtualized `<table>` mapping thousands of DOM nodes |
| **Command palette (`Cmd+K`)** | `cmdk`, KBar, Ninja Keys, Base UI / Ariakit combobox | macOS Spotlight-style `NSPanel`, Raycast API, Textual `CommandPalette` | Custom `keydown` window listener + un-trapped `<div>` |
| **Drawer / bottom sheet** | Vaul, Radix / Base UI / Ark UI / Headless UI Dialog, native `<dialog>` | SwiftUI `.sheet`, Compose `ModalBottomSheet`, Flutter `showModalBottomSheet` | `position: fixed` div with no focus trap, inert backdrop, or Escape/swipe close |
| **Toast / status queue** | Sonner, Radix Toast, Ariakit / Ark UI Toast | Android `Snackbar`, Flutter `SnackBar`, desktop native notification API | Stacked `setTimeout` divs missing `aria-live` & pause-on-hover/focus |
| **Carousel / media strip** | Embla Carousel, Swiper, native CSS Scroll Snap + real controls | SwiftUI `TabView`/scrollTargetBehavior, Compose `HorizontalPager`, Flutter `PageView` | Manual `translateX` slider breaking touch/trackpad/keyboard |
| **Search & faceting UI** | InstantSearch / Meilisearch / Orama / MiniSearch + URL-synced filter state | Platform search controllers (`UISearchController`, Compose `SearchBar`) | Client-side `.includes()` filter losing state on refresh |
| **Drag-and-drop** | `@dnd-kit`, Pragmatic Drag and Drop (Atlassian), SortableJS (with WCAG 2.5.7 button/keyboard move) | SwiftUI `.draggable`/transferable, Compose drag modifiers, Qt Drag & Drop | Mouse-only `mousedown`/`mousemove` with no keyboard/single-pointer move |
| **Date / calendar picker** | React Aria DatePicker, DayPicker, FullCalendar, Schedule-X, native `<input type="date">` (when simple) | SwiftUI `DatePicker`, Compose Material 3 `DatePicker`, Qt `QCalendarWidget` | Hand-rolled month math ignoring timezones, DST, locales, and arrow-key nav |
| **Media player (audio/video)** | Vidstack, Media Chrome, Plyr, Wavesurfer.js (audio waveform) | AVPlayerViewController, ExoPlayer/Media3, Flutter `video_player` | Uncaptioned `<video>` with custom non-keyboard buttons |
| **PDF view / generation** | PDF.js (view), Typst / WeasyPrint / React-PDF / Quarto / Gotenberg (generate) | PDFKit (Apple), Android `PdfRenderer`, Qt PDF | `window.print()` screenshots or unsearchable canvas-only dumps |
| **Charts / dataviz** | ECharts, Vega-Lite, Observable Plot, Visx, Recharts, Highcharts, uPlot, Plotly | Swift Charts, Vico (Compose), fl_chart, PyQtGraph, Matplotlib/Altair | Hand-coded inline SVG `<path>` charts with no axes, tooltips, or accessible table fallback |
| **Complex forms & validation** | React Hook Form / TanStack Form / Conform / Superforms + Zod / Valibot / ArkType | SwiftUI Form + typed validation, Flutter Form / Reactive Forms, Pydantic | Ad-hoc `useState` per field losing values on error and skipping `aria-invalid`/`aria-describedby` |

## Creative rendering

For expressive browser work, compare the lightest sufficient option before introducing a renderer: CSS-native View Transitions, Scroll-Driven Animations, Anchor Positioning, and Popover API; DOM/CSS/SVG; Rive or Lottie for authored vector/state-machine motion; Canvas 2D; Motion for React or GSAP; `<model-viewer>` for lightweight embedded 3D; PixiJS/WebGL; Three.js/R3F, Threlte (Svelte), TresJS (Vue), Babylon.js, PlayCanvas, or Spline; and WebGPU as an optional capability path with fallback. Use `pixelcraft-web` for compatibility, asset, lifecycle, accessibility, and performance gates.

## Creative Direction → Plan Feedback Loop

Planning runs first, but **stack selection is not a cage against a superior approved concept**. If `pixelcraft-direction` proposes a winning direction that genuinely requires a different runtime, renderer, or capability library—for example, interactive state-machine motion (Rive), shader/WebGPU canvas, publication-grade pagination (Typst/WeasyPrint), or a native desktop shell (Tauri v2 / SwiftUI / PySide6)—reopen `.pixelcraft/plan.md` cleanly before Build:

1. Record the triggering creative direction and why the earlier stack cannot execute it honestly.
2. Verify versions, licensing, bundle/performance cost, and accessibility/fallback gates for the added runtime or library.
3. Update the stack decision and Sub-Stack Capability table in `.pixelcraft/plan.md`, preserving prior decisions and why they changed.

## Decision quality bar

A valid recommendation explains why this stack fits the user and team, not why it is popular. It names tradeoffs, rejected lazy defaults, purpose-built sub-stack libraries, verification plan, migration/reversal cost, and what would make the runner-up win.