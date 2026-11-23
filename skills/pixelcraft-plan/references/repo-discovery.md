# Brownfield repository discovery

Read broadly before narrowing. Exclude generated/vendor/build output only after identifying it. Record evidence as `path → meaning`; do not turn absence of evidence into evidence of absence.

## Inventory checklist

| Area | Inspect |
|---|---|
| Repository shape | root files, workspace/package manifests, modules/apps, ownership, generated code, vendor dirs |
| Language/framework inventory | manifests, lockfiles, compilers, framework imports/config, version constraints |
| Entry points | main files, app shells, server routes, process entrypoints, window creation, notebook/app startup |
| Routing/screens | file-system routes, routers/controllers, navigation graph, deep links, scene/window management |
| Existing design system | DTCG/tokens JSON, CSS variables, Tailwind config/theme, ThemeData, resource dictionaries, asset catalogs, Qt/Godot/UMG themes |
| Component library | shared components/widgets, wrappers, UI kits, vendored dependencies, ownership and maturity |
| Styling approach | global CSS, CSS modules, utility classes, inline styles, styled system, native resources, QSS/XAML/theme objects |
| State management | stores, reactive streams, server state, session ownership, caching, persistence, concurrency model |
| i18n/localization | locale catalogs, ICU framework, RTL support, font assets/fallback, date/number libraries, translation workflow |
| Test/visual tooling | unit/component/e2e/golden/snapshot/screenshot/axe tests, fixtures, device matrix, visual CI |
| CI/release | workflows, required checks, versioning, packaging/signing/notarization/store/release constraints |
| Constraints | offline/network, performance/hardware, accessibility/legal/privacy/security, platform/store/certification, backend/protocol, deadlines |

## High-signal files by ecosystem

| Ecosystem | Signals |
|---|---|
| TS/JS web/data | `package.json`, lockfiles, `next.config.*`, `vite.config.*`, `nuxt.config.*`, `svelte.config.*`, `angular.json`, `astro.config.*`, `tailwind.config.*`, router directories, `observablehq.config.*`, `evidence.config.yaml`, `theme.yaml`, `pages/`, `sources/` |
| Rust web/GUI/TUI/game | `Cargo.toml`, `Leptos.toml`, `Trunk.toml`, `Dioxus.toml`; deps `leptos`, `yew`, `egui`, `slint`, `iced`, `dioxus`, `ratatui`, `bevy` |
| Kotlin | `build.gradle(.kts)`, `settings.gradle*`, Compose/Android/KMP plugins, Kobweb deps/config |
| Swift/Apple | `Package.swift`, `*.xcodeproj`, Xcode workspace, asset catalogs, entitlements, Info.plist |
| Dart/Flutter | `pubspec.yaml`, `analysis_options.yaml`, platform folders, golden tests |
| .NET | `*.csproj`, `*.fsproj`, `*.sln`, `App.xaml`, MAUI/WinUI/WPF/Avalonia/Uno/Blazor references |
| Java/JVM | `pom.xml`, `build.gradle*`, JavaFX/Vaadin/Spring dependencies, FXML, templates |
| Python | `pyproject.toml`, `requirements*.txt`, framework imports/config, notebooks |
| Go | `go.mod`, templ files, Bubble Tea/Lip Gloss/Fyne/Wails/Gio deps |
| PHP/Ruby/Elixir | `composer.json`/Laravel, `Gemfile`/Rails, `mix.exs`/Phoenix templates/components |
| Scala/Clojure/Elm | `build.sbt`, `deps.edn`, `shadow-cljs.edn`, `elm.json` |
| R/Julia/Lua/Zig/C++ | `DESCRIPTION`, `app.R`, `Project.toml`, `main.lua`+`conf.lua`, `build.zig`, `CMakeLists.txt` |
| Email/game | MJML/React Email templates; Unity `ProjectSettings`, Godot `project.godot`, Unreal `.uproject` |

## Repo map output

Write concise evidence-backed sections: overview; execution surfaces; routing/screens; design-system authority; state/data ownership; localization; verification tooling; constraints/risks; exact recommended `pixelcraft-*` skill/reference path; unread or uncertain areas. Link facts to paths, not line-perfect guesses.
