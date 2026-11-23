# Greenfield stack selection

Never default to TypeScript/React. Generate candidates from the requirement shape and the team's actual language/operations constraints, then justify any browser/web choice against native, server-rendered, terminal, or embedded alternatives.

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
| Web application | TypeScript React/Vue/Svelte/Solid/Qwik; Rust Leptos/Yew; Kotlin Kobweb/Compose Web; Elm; ClojureScript Reagent/re-frame; F# Fable; Scala Laminar; Java Vaadin; server-rendered Rails/Laravel/Django/Phoenix/Blazor/Go templ | Prefer server rendering when content/forms/SEO/reliability dominate; WASM/canvas approaches need accessibility/bundle scrutiny |
| Content site | Astro, plain HTML/CSS, static generators, server-rendered CMS/framework, lightweight islands | Justify any SPA-like choice; rendering performance/reader mode matter |
| Mobile | SwiftUI/UIKit, Kotlin Compose, Flutter, React Native/Expo, Kotlin Multiplatform, Ionic, .NET MAUI, Uno | Platform fidelity vs shared code; store/accessibility/input behavior decide |
| Cross-platform app | Flutter, React Native, Kotlin Multiplatform/Compose Multiplatform, .NET MAUI, Uno, Tauri/Electron for desktop-centric use | “Write once” does not erase platform conventions |
| Desktop | Tauri, Electron, Qt C++/PySide/QML, WinUI/WPF, AppKit, GTK, Avalonia, Uno, JavaFX/Swing, Rust egui/Slint/iced/Dioxus, Go Fyne/Wails/Gio | Native integration, memory/startup, accessibility, signing, menus/windowing matter |
| Internal tool/data app | Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny for Python/R, Jupyter widgets, Genie (Julia), Observable Framework, Evidence, CRUD server-rendered frameworks | Choose speed/clarity/reproducibility, but inspect session/concurrency/security/freshness limits |
| CLI/TUI | Textual/Rich (Python), Ink (Node), Bubble Tea/Lip Gloss (Go), Ratatui (Rust), language-native CLI libraries | Character grid, keyboard behavior, terminal capability fallback, snapshot tests |
| Game UI | Unity, Godot, Unreal, Bevy (Rust), MonoGame (C#), LÖVE2D (Lua), custom engine | Engine/gameplay architecture comes first; UI accessibility/certification constraints follow |
| Email | HTML tables, MJML, React Email | Client fragmentation dominates framework preference; plaintext parity mandatory |
| Embedded/kiosk | Qt/QML, Slint, LVGL/custom native, webview/Tauri/Electron only when resources permit, Flutter embedded where supported | Hardware/input/power/update/security constraints are hard gates |

## Decision quality bar

A valid recommendation explains why this stack fits the user and team, not why it is popular. It names tradeoffs, verification plan, migration/reversal cost, and what would make the runner-up win.