# Stack and surface detection

Detect from concrete files; do not infer from repository age, buzzwords, or one copied import. Multiple matches mean multiple surfaces. Prefer the file nearest the UI being changed. The reference names below live inside the named platform skill; never construct cross-skill relative paths.

## Web signals

| Signal | Platform skill → framework reference |
|---|---|
| plain `.html`/`.css` or no framework dependency | `pixelcraft-web` → `html-css` |
| `react`, `next`, `@vitejs/plugin-react` | `pixelcraft-web` → `react-next` |
| `vue`, `nuxt`, `vite.config` Vue plugin | `pixelcraft-web` → `vue-nuxt` |
| `svelte`, `@sveltejs/kit`, `.svelte` | `pixelcraft-web` → `svelte` |
| `solid-js`, SolidStart config | `pixelcraft-web` → `solid` |
| `@angular/core`, `angular.json` | `pixelcraft-web` → `angular` |
| `astro`, `.astro` | `pixelcraft-web` → `astro` |
| `@builder.io/qwik`, Qwik City config | `pixelcraft-web` → `qwik` |
| `htmx.org`, `alpinejs`, `hx-*` fragments/`x-data` | `pixelcraft-web` → `htmx-alpine` |
| `lit`, custom elements/`.ce`/`shadowRoot` UI | `pixelcraft-web` → `lit-web-components` |
| `tailwindcss`, `@import "tailwindcss"`, Tailwind classes/config | `pixelcraft-web` → `tailwind` |
| Rails views/Hotwire (`Gemfile`, Turbo/Stimulus) | `pixelcraft-web` → `server-rendered` |
| Laravel Blade/Livewire (`composer.json`, `.blade.php`) | `pixelcraft-web` → `server-rendered` |
| Django/Jinja/templates (`manage.py`, template dirs) | `pixelcraft-web` → `server-rendered` |
| Phoenix/LiveView (`mix.exs`, `.heex`) | `pixelcraft-web` → `server-rendered` |
| Blazor (`.razor`, `.csproj`) | `pixelcraft-web` → `server-rendered` |
| Go templ/html template (`.templ`, `.tmpl`, handler templates) | `pixelcraft-web` → `server-rendered` |
| `Cargo.toml` deps `leptos`/`yew`, `Trunk.toml`, `Leptos.toml` | `pixelcraft-web` → `leptos-yew` |
| Kotlin web/Kobweb dependencies/config in Gradle project | `pixelcraft-web` → `kotlin-web` |
| `elm.json` | `pixelcraft-web` → `elm` |
| `deps.edn`, `shadow-cljs.edn`, Reagent/re-frame deps | `pixelcraft-web` → `clojurescript` |
| `.fsproj`, Fable/Feliz/Elmish deps | `pixelcraft-web` → `fsharp-fable` |
| `build.sbt`, Scala.js/Laminar deps | `pixelcraft-web` → `scala-laminar` |
| `pom.xml`/Gradle Vaadin or Thymeleaf deps/templates | `pixelcraft-web` → `java-web` |

## Mobile signals

| Signal | Platform skill → framework reference |
|---|---|
| SwiftUI imports/types, `Package.swift`, Xcode project | `pixelcraft-mobile` → `swiftui` |
| UIKit imports/view controllers/storyboards | `pixelcraft-mobile` → `uikit` |
| `build.gradle(.kts)` Compose dependencies, `@Composable` | `pixelcraft-mobile` → `jetpack-compose` |
| `pubspec.yaml`, Flutter imports | `pixelcraft-mobile` → `flutter` |
| React Native/Expo config, `app.json`, RN dependencies | `pixelcraft-mobile` → `react-native-expo` |
| Kotlin Multiplatform/Compose Multiplatform source sets | `pixelcraft-mobile` → `kotlin-multiplatform` |
| Ionic/Capacitor config/dependencies | `pixelcraft-mobile` → `ionic-capacitor` |
| MAUI `.csproj`/XAML/AppShell references | `pixelcraft-mobile` → `dotnet-maui` |
| `flet` controls/page | `pixelcraft-mobile` → `flet` |
| `kivy`/KV language/App classes | `pixelcraft-mobile` → `kivy` |

## Data-app signals

| Signal | Platform skill → framework reference |
|---|---|
| `streamlit` import/dependency or `.streamlit/config.toml` | `pixelcraft-data-apps` → `streamlit` |
| `gradio`/`gr.Blocks`/`gr.Interface` | `pixelcraft-data-apps` → `gradio` |
| `reflex`/`rx.App` | `pixelcraft-data-apps` → `reflex` |
| `nicegui`/`from nicegui import ui` | `pixelcraft-data-apps` → `nicegui` |
| `dash`/Dash layout callbacks | `pixelcraft-data-apps` → `dash` |
| `panel`/`import panel as pn` | `pixelcraft-data-apps` → `panel` |
| Shiny for Python (`shiny` UI/server/reactive) | `pixelcraft-data-apps` → `shiny` |
| `ipywidgets`/notebook widget traits | `pixelcraft-data-apps` → `jupyter-widgets` |
| R `DESCRIPTION`/`app.R` with `shiny`/`bslib` | `pixelcraft-data-apps` → `r-shiny` |
| Julia `Project.toml` with Genie/Stipple | `pixelcraft-data-apps` → `julia-genie` |
| `observablehq.config.*`, Framework Markdown/data loaders | `pixelcraft-data-apps` → `observable-framework` |
| `evidence.config.yaml`, `theme.yaml`, Evidence `pages/`/`sources/` | `pixelcraft-data-apps` → `evidence` |

## Desktop signals

| Signal | Platform skill → framework reference |
|---|---|
| `src-tauri/tauri.conf.json` or Tauri dependency | `pixelcraft-desktop` → `tauri` |
| Electron main/preload/package configuration | `pixelcraft-desktop` → `electron` |
| Qt `.pro`/CMake Qt modules/PySide/PyQt/`.qml` | `pixelcraft-desktop` → `qt-pyside-qml` |
| WinUI/WPF `.csproj`/XAML/WindowsAppSDK references | `pixelcraft-desktop` → `winui-wpf` |
| AppKit/Cocoa imports/macOS target | `pixelcraft-desktop` → `appkit` |
| GTK/libadwaita build definitions/imports/blueprints | `pixelcraft-desktop` → `gtk` |
| Avalonia `.csproj`/XAML references | `pixelcraft-desktop` → `avalonia` |
| `egui`, `slint`, `dioxus`, `iced` in Rust dependencies | `pixelcraft-desktop` → `rust-gui` |
| `pom.xml`/Gradle JavaFX, Swing UI entry points/FXML | `pixelcraft-desktop` → `javafx-swing` |
| `CMakeLists.txt` Qt/imgui/wxWidgets dependencies | `pixelcraft-desktop` → `cpp-gui` |
| `go.mod` Fyne/Wails/Gio deps | `pixelcraft-desktop` → `go-gui` |
| Uno Platform `.csproj`/XAML/config references | `pixelcraft-desktop` → `uno-platform` |

## TUI signals

| Signal | Platform skill → framework reference |
|---|---|
| `textual` dependency/import | `pixelcraft-tui` → `textual` |
| `rich` dependency/import without full Textual app | `pixelcraft-tui` → `rich` |
| `ink` dependency/import | `pixelcraft-tui` → `ink` |
| Go `bubbletea`/`lipgloss` imports | `pixelcraft-tui` → `bubbletea-lipgloss` |
| Rust `ratatui`/`crossterm` dependencies | `pixelcraft-tui` → `ratatui` |

## Email signals

| Signal | Platform skill → framework reference |
|---|---|
| table-heavy HTML email/inline CSS templates | `pixelcraft-email` → `html-tables` |
| `.mjml` files or `mjml` dependency | `pixelcraft-email` → `mjml` |
| `@react-email`/`react-email` dependencies/templates | `pixelcraft-email` → `react-email` |
| Outlook/Gmail/Apple Mail/client/dark/plaintext concerns | `pixelcraft-email` → `client-quirks` |

## Game UI signals

| Signal | Platform skill → framework reference |
|---|---|
| `ProjectSettings/`, `.unity`, UXML/USS/UI Builder assets | `pixelcraft-game-ui` → `unity-ui-toolkit` |
| `project.godot`, `.tscn`, `.gd`, Control/Theme resources | `pixelcraft-game-ui` → `godot` |
| `.uproject`, UMG/Slate/CommonUI assets or references | `pixelcraft-game-ui` → `unreal-umg` |
| HUD/controller/safe-area/certification/accessibility question | `pixelcraft-game-ui` → `hud-principles` |
| `main.lua` + `conf.lua`, `love.*` calls | `pixelcraft-game-ui` → `love2d` |
| `Cargo.toml` with `bevy` dependency | `pixelcraft-game-ui` → `bevy` |
| MonoGame `.csproj`/Content Pipeline/Game class references | `pixelcraft-game-ui` → `monogame` |

## Language → framework routing matrix

| Language | Frameworks/surfaces | Skill → reference |
|---|---|---|
| C# | Blazor, MAUI, WinUI/WPF, Avalonia, Uno, MonoGame | `pixelcraft-web` → `server-rendered`; `pixelcraft-mobile` → `dotnet-maui`; `pixelcraft-desktop` → `winui-wpf`/`avalonia`/`uno-platform`; `pixelcraft-game-ui` → `monogame` |
| C++ | Qt/QML, Dear ImGui, wxWidgets | `pixelcraft-desktop` → `cpp-gui` |
| Clojure | ClojureScript/Reagent/re-frame | `pixelcraft-web` → `clojurescript` |
| Dart | Flutter mobile/desktop/web | `pixelcraft-mobile` → `flutter`; apply `pixelcraft-web` checks for browser-dominant surfaces |
| Elm | Elm Browser UI | `pixelcraft-web` → `elm` |
| Elixir | Phoenix LiveView | `pixelcraft-web` → `server-rendered` |
| F# | Fable/Feliz/Elmish, .NET desktop | `pixelcraft-web` → `fsharp-fable`; desktop by actual XAML framework |
| Go | templ/templates, Bubble Tea/Lip Gloss, Fyne/Wails/Gio | `pixelcraft-web` → `server-rendered`; `pixelcraft-tui` → `bubbletea-lipgloss`; `pixelcraft-desktop` → `go-gui` |
| Java | Vaadin/Thymeleaf, JavaFX/Swing | `pixelcraft-web` → `java-web`; `pixelcraft-desktop` → `javafx-swing` |
| Julia | Genie/Stipple | `pixelcraft-data-apps` → `julia-genie` |
| Kotlin | Compose Android/KMP, Compose Web/Kobweb | `pixelcraft-mobile` → `jetpack-compose`/`kotlin-multiplatform`; `pixelcraft-web` → `kotlin-web` |
| Lua | LÖVE2D | `pixelcraft-game-ui` → `love2d` |
| PHP | Laravel Blade/Livewire | `pixelcraft-web` → `server-rendered` |
| Python | Streamlit/Gradio/Reflex/NiceGUI/Dash/Panel/Shiny/Jupyter; Flet/Kivy; Qt/PySide; Textual/Rich | `pixelcraft-data-apps` matching reference; `pixelcraft-mobile` → `flet`/`kivy`; `pixelcraft-desktop` → `qt-pyside-qml`; `pixelcraft-tui` → `textual`/`rich` |
| R | Shiny/bslib | `pixelcraft-data-apps` → `r-shiny` |
| Ruby | Rails/Hotwire | `pixelcraft-web` → `server-rendered` |
| Rust | Leptos/Yew, egui/Slint/Dioxus/iced, Ratatui, Bevy | `pixelcraft-web` → `leptos-yew`; `pixelcraft-desktop` → `rust-gui`; `pixelcraft-tui` → `ratatui`; `pixelcraft-game-ui` → `bevy` |
| Scala | Laminar/Scala.js | `pixelcraft-web` → `scala-laminar` |
| Swift | SwiftUI, UIKit, AppKit | `pixelcraft-mobile` → `swiftui`/`uikit`; `pixelcraft-desktop` → `appkit` |
| TS/JS | React/Next, Vue/Nuxt, Svelte, Solid, Angular, Astro, Qwik, htmx/Alpine, Lit, Observable Framework, Evidence, Electron/Tauri, Ink | `pixelcraft-web` matching reference; `pixelcraft-data-apps` → `observable-framework`/`evidence`; `pixelcraft-desktop`/`pixelcraft-tui` matching reference |
| Zig | no substantive dedicated reference yet | plan manually in `pixelcraft-plan`; inspect actual UI/library constraints |

## Brand identity signals

| Signal | Route |
|---|---|
| request for brand kit, identity board, visual identity, brand guidelines image, moodboard, visual-world board, logo system, launch identity, rebrand, or refresh | `pixelcraft-brandkit` |
| supplied logo/wordmark/palette/type/brand assets to preserve | `pixelcraft-brandkit` intake: build on existing brand |
| explicit rebrand/refresh scope | `pixelcraft-brandkit` intake: refresh/rebrand |
| selected palette/type must become implementation tokens | `pixelcraft-brandkit` → `pixelcraft-tokens` |

## Existing system inventory

Before designing, inspect design token files (`tokens.json`, `.tokens`, theme objects, Tailwind CSS/theme, asset catalogs, resource dictionaries, Qt/QSS, Godot themes, UMG styles), component libraries, lint/test/screenshot fixtures, localization catalogs, brand assets/licenses, density conventions, and navigation structure. Record whether the system is authoritative, partial, inconsistent, or absent. Existing tokens outrank Pixelcraft-generated taste.

## Input/render surface

Classify input modality (touch, mouse/keyboard, controller, remote, terminal keyboard, screen reader, voice), viewport/window constraints, network context, platform/version, and rendering surface (DOM/canvas/native/skia/terminal cells/email client/game engine). These facts determine which floor checks and platform idioms apply.
