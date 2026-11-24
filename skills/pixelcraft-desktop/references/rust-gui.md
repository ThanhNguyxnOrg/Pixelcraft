# Rust GUI: GPUI, Dioxus, Iced, Slint, egui, & emerging toolkits

Rust GUI frameworks have fundamentally different rendering, layout, and accessibility models—never treat “Rust GUI” as one uniform platform.

## Framework decision matrix

| Framework | Rendering & UI model | Key 2025–2026 idioms | Best fit |
|---|---|---|---|
| **GPUI** | Hybrid immediate/retained GPU (Metal/Vulkan/DX12, Taffy Flexbox, up to 120 FPS) | `gpui-component` widget kit, `Entity<T>`, `Render`, `FocusHandle`, `actions!` keymaps | Ultra-fast developer tools, editors, data workspaces (Zed ecosystem) |
| **Dioxus 0.6/0.7** | RSX reactive components over OS WebView **or** **Blitz** (pure-Rust native HTML/CSS renderer) | `dx` CLI, **Subsecond** live Rust hot-patching, fullstack/desktop/mobile sharing | Web-fluent Rust teams wanting fast iteration and optional zero-WebView Blitz |
| **Iced 0.13/0.14** | Elm-inspired functional reactive (`wgpu` / tiny-skia) | `iced::application(title, update, view)` and `iced::daemon` multi-window API | Cross-platform desktop apps, predictable state machines |
| **`libcosmic`** | COSMIC Desktop adaptive toolkit built on Iced + Wayland layer-shell | `cosmic::Application`, `cosmic::applet::run`, `nav_model`, `context_drawer`, live `cosmic-config` tokens | Linux / COSMIC Desktop native apps and panel applets with adaptive condensed/expanded layouts |
| **Slint** | Declarative `.slint` DSL compiled to native Rust/C++ | IDE / `slint-viewer` live preview, shared desktop + `#![no_std]` MCU codebases | Embedded HMIs and crisp lightweight native desktop utilities |
| **egui** | Pure immediate-mode (`eframe`, glow/wgpu) | Frame-local `egui::Ui`, `egui_plot`, retained app state outside UI closure | Engineering tools, debuggers, audio/CAD inspectors, internal utilities |
| **Relm4** | Idiomatic Rust Elm-style wrapper over **GTK4 / libadwaita** | Native Linux Wayland, AT-SPI accessibility, Blueprint/GTK widgets | Linux-first native desktop apps prioritizing full OS accessibility (see `gtk.md`) |
| **Vizia** | Reactive Lens-based tree + Morphorm layout + Femtovg/Skia | `#[derive(Lens)]`, hot-reloadable external CSS stylesheets with CSS custom properties, built-in AccessKit | Reactive CSS-styled desktop utilities and audio plugins (check release cadence before greenfield commitment) |
| **Floem** | Fine-grained reactive signals + Taffy Flexbox (Vger/tiny-skia) | Leptos-like signals without VDOM diffing (Lapce ecosystem) | Responsive native editors and reactive Rust desktop apps |
| **Xilem** | Linebender reactive stack: **Vello** (GPU 2D) + **Masonry** (widget tree) + **Parley** (text) | Modern GPU compute rendering + AccessKit-first architecture | Next-gen high-craft vector/text-heavy Rust apps (track API stability) |
| **Makepad** | GPU shader-first live-design DSL with instant hot reload | Custom SDF shaders, cross-platform desktop/mobile/WASM | Visually bespoke audio/creative/shader-driven tools |
| **Freya** | Dioxus RSX reactive components rendered directly via **Skia** | No WebView, CSS-like layout over Skia | Dioxus developers wanting native Skia rendering |

## Token mapping & idiomatic snippets

Centralize semantic theme values once—never scatter raw hex literals across render closures:

```rust
// Iced 0.13/0.14 functional application entry point:
pub fn main() -> iced::Result {
    iced::application("Invoices", App::update, App::view)
        .theme(App::theme)
        .run()
}
```

- **`libcosmic` (COSMIC Desktop & adaptive applets)**: implement `cosmic::Application` (or `cosmic::applet::run::<MyApplet>(())` for Wayland panel applets with popups). Consume live user/system theme tokens via `cosmic::theme::active()` (`theme.cosmic().accent_color()`, `spacing()`, `corner_radii`) synced automatically through `cosmic-config` instead of hardcoding colors; use `nav_model()` + `context_drawer()` so windows collapse cleanly from expanded multi-pane desktop layouts to condensed narrow widths, and populate widget accessibility labels exposed through Iced/AccessKit on Wayland/AT-SPI.
- **Vizia**: bind reactive state with `#[derive(Lens)]` and map DTCG semantic roles into CSS custom properties inside loaded stylesheets (`cx.add_stylesheet(include_style!("src/tokens.css"))`) so light/dark theme classes swap without rebuilding widget code.
- **GPUI**: read a global `Theme` struct from `App` context (`cx.theme()`) and pair `gpui-component` primitives with semantic tokens rather than repeating `rgb(0x...)`.
- **Slint**: declare `export global Palette { in-out property <color> action; }` in `.slint` files for light/dark switching.
- **Dioxus**: map DTCG CSS custom properties directly in stylesheets (works across both WebView and Blitz).
- **egui**: configure `ctx.style_mut(...)` / `egui::Visuals` centrally; never mutate global style mid-frame unpredictably.

## Layout, typography, & power-aware motion

- Use virtualized lists (`uniform_list` in GPUI, `ScrollArea::show_rows` in egui, virtualized views in Slint/Iced/`libcosmic`) for logs and large tables.
- Verify font registration, fallback chains (CJK/RTL/emoji via `cosmic-text` or `Parley`), and fractional HiDPI scaling per OS—custom GPU renderers often ship with missing glyph fallback ("tofu") unless bundled explicitly.
- Guard animations against wasted power: in immediate-mode (`egui`), drive repaints on events or `ctx.request_repaint_after(...)` rather than spinning 120 FPS idle loops. Provide an app-level reduced-motion toggle when OS integration is incomplete.

## Accessibility & AccessKit

**AccessKit** is the shared Rust accessibility bridge translating widget trees to **Windows UI Automation**, **macOS NSAccessibility**, and **Linux AT-SPI** (integrated in `egui`, `Slint`, `Masonry`/`Xilem`, `Floem`, `Iced`/`libcosmic`, and `Vizia`).

- AccessKit enables native screen-reader support, but **only** for widgets that actually populate roles, names, bounds, states, and focus actions—its presence in `Cargo.toml` is **not** proof of accessibility.
- For accessibility-mandated productivity apps on Linux/cross-platform where native screen-reader parity is non-negotiable, prefer **Relm4 (GTK4)**, **`libcosmic`** (on COSMIC/Wayland, verified with Orca), **Slint**, or **Dioxus** and verify live with VoiceOver, Narrator, and Orca; treat custom GPU/immediate-mode accessibility as `not-checked` until actually tested with assistive tech.

## States & forms idioms

Own async I/O on Tokio/async executors with explicit cancellation handles and bounded channels—never block the UI/render thread. Handle dirty-document close interception, crash recovery, and multi-window focus cleanly. Prefer framework text-editing widgets (`gpui-component` input, Slint `TextInput`, `iced::widget::text_editor`, `cosmic::widget::text_input`) over hand-rolled keystroke buffers so IME composition, dead keys, selection, and clipboard paste work reliably.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `iced::application`/`daemon`, `libcosmic` `Application`/`applet` + `cosmic::theme::active()`, `dx` Subsecond, or `gpui-component` idioms | Copy obsolete pre-0.13 `Application` traits, hardcode COSMIC colors, or hand-roll custom text editors |
| Verify AccessKit output (including `libcosmic` and `Vizia`) with VoiceOver, Narrator, and Orca | Claim screen-reader compliance merely because AccessKit is a dependency |
| Request repaints on dirty state/events in `egui` / GPU renderers | Spin a continuous 120 FPS render loop while the window is idle |
| Centralize semantic `Theme`, Vizia CSS custom properties, or `.slint` `global` palettes | Scatter `Color32::from_rgb(...)` or `rgb(0x...)` literals across views |
| Bundle fallback fonts and verify CJK/RTL shaping & fractional DPI | Ship ASCII-only embedded fonts that turn localized text into tofu boxes |

## Known traps

Incomplete AccessKit widget semantics (missing names/focus/actions), IME & dead-key breakage in custom GPU text inputs, idle CPU/GPU battery drain from continuous repaints, fractional Wayland/Windows HiDPI blur, missing font fallbacks, blocking the render thread with synchronous disk/network calls, failing to restore or clamp multi-monitor window state.

## Verification commands

```sh
cargo test
cargo clippy --all-targets -- -D warnings
cargo run
# Dioxus live desktop iteration:
dx serve --platform desktop
```

`cargo test` and `cargo clippy` are `static` evidence. Run native binaries on each target OS across keyboard-only traversal, VoiceOver/Narrator/Orca (or label screen-reader testing `not-checked`), fractional HiDPI resize, dark/high-contrast themes, idle CPU/GPU usage, and dirty-close recovery for `rendered` evidence.
