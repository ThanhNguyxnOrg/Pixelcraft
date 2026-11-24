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

## Creative rendering

For expressive browser work, compare the lightest sufficient option before introducing a renderer: CSS-native View Transitions, Scroll-Driven Animations, Anchor Positioning, and Popover API; DOM/CSS/SVG; Rive or Lottie for authored vector/state-machine motion; Canvas 2D; Motion for React or GSAP; `<model-viewer>` for lightweight embedded 3D; PixiJS/WebGL; Three.js/R3F, Threlte (Svelte), TresJS (Vue), Babylon.js, PlayCanvas, or Spline; and WebGPU as an optional capability path with fallback. Use `pixelcraft-web` for compatibility, asset, lifecycle, accessibility, and performance gates.


## Decision quality bar

A valid recommendation explains why this stack fits the user and team, not why it is popular. It names tradeoffs, verification plan, migration/reversal cost, and what would make the runner-up win.