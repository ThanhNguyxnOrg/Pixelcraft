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
| Web application | TypeScript React (Next.js, TanStack Start, React Router v7) / Vue (Nuxt 4) / Angular (Signals) / Svelte (SvelteKit) / Solid / Qwik; Rust Leptos/Yew; Kotlin Kobweb/Compose Web; Elm; ClojureScript Reagent/re-frame; F# Fable; Scala Laminar; Java Vaadin; server-rendered Rails/Laravel/Django/Phoenix/Blazor/Go templ | Match framework weight to ecosystem needs: pick React/Vue/Angular when rich component/editor/AI/grid ecosystems or multi-team hiring dominate; pick SvelteKit/Solid/server-rendered when compact runtime and low ceremony dominate; WASM/canvas approaches need accessibility/bundle scrutiny |
| Content site | Astro, plain HTML/CSS, static generators, server-rendered CMS/framework, lightweight islands | Justify any SPA-like choice; rendering performance/reader mode matter |
| Mobile | SwiftUI/UIKit, Kotlin Compose, Flutter, React Native/Expo, LynxJS, Kotlin Multiplatform, Ionic, .NET MAUI, Uno | Platform fidelity vs shared code; store/accessibility/input behavior decide |
| Cross-platform app | Flutter, React Native, LynxJS, Kotlin Multiplatform/Compose Multiplatform, .NET MAUI, Uno, Tauri v2/Electron for desktop-centric use | “Write once” does not erase platform conventions |
| Desktop | Tauri v2, Electron, Qt C++/PySide/QML, WinUI/WPF, AppKit, GTK, Avalonia, Uno, JavaFX/Swing, Rust egui/Slint/iced/Dioxus/GPUI, Go Fyne/Wails/Gio | Native integration, memory/startup, accessibility, signing, menus/windowing matter |
| Internal tool/data app | marimo, Solara, Mesop, Taipy, Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny for Python/R, Jupyter widgets, Genie (Julia), Observable Framework, Evidence, CRUD server-rendered frameworks | Choose speed/clarity/reproducibility, but inspect session/concurrency/security/freshness limits |
| CLI/TUI | Textual/Rich/prompt_toolkit (Python), Ink (Node), Bubble Tea/Lip Gloss (Go), Ratatui (Rust), Spectre.Console/Terminal.Gui (.NET), language-native CLI libraries | Character grid, keyboard behavior, terminal capability fallback, snapshot tests |
| Game UI | Unity, Godot, Unreal, Bevy (Rust), MonoGame (C#), LÖVE2D (Lua), custom engine | Engine/gameplay architecture comes first; UI accessibility/certification constraints follow |
| Email | HTML tables, MJML, React Email, Maizzle | Client fragmentation dominates framework preference; plaintext parity mandatory |
| Embedded/kiosk | Qt/QML, Slint, LVGL/custom native, webview/Tauri/Electron only when resources permit, Flutter embedded where supported | Hardware/input/power/update/security constraints are hard gates |

## Creative rendering

For expressive browser work, compare the lightest sufficient option before introducing a renderer: DOM/CSS/SVG, native scroll, Canvas 2D, Motion for React, GSAP, PixiJS/WebGL, Three.js/R3F/Spline, and WebGPU as an optional capability path. Use the dedicated web references for compatibility, asset, lifecycle, accessibility, and performance gates.


## Decision quality bar

A valid recommendation explains why this stack fits the user and team, not why it is popular. It names tradeoffs, verification plan, migration/reversal cost, and what would make the runner-up win.