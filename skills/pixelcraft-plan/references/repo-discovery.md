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

| Ecosystem / Surface | Signals |
|---|---|
| TS/JS web, AI & data | `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `deno.json`, `next.config.*`, `vite.config.*`, `react-router.config.*`, `nuxt.config.*`, `svelte.config.*`, `angular.json`, `astro.config.*`, `lynx.config.*`, `tailwind.config.*`, CSS-first Tailwind v4 (`@import "tailwindcss"` / `@theme` in CSS), `components.json`, `terrazzo.config.*`, `style-dictionary.config.*`, AI UI SDKs (`@ai-sdk/*`, `@assistant-ui/*`, `@copilotkit/*`), router directories, `observablehq.config.*`, `evidence.config.yaml`, `theme.yaml`, `pages/`, `sources/` |
| Rust web/GUI/TUI/game | `Cargo.toml`, `Cargo.lock`, `Leptos.toml`, `Trunk.toml`, `Dioxus.toml`; deps `leptos`, `yew`, `egui`, `slint`, `iced`, `dioxus`, `gpui`, `ratatui`, `bevy` |
| Kotlin | `build.gradle(.kts)`, `settings.gradle*`, Compose/Android/KMP plugins, Kobweb deps/config |
| Swift/Apple | `Package.swift`, `*.xcodeproj`, Xcode workspace, asset catalogs, entitlements, `Info.plist` |
| Dart/Flutter | `pubspec.yaml`, `pubspec.lock`, `analysis_options.yaml`, platform folders, golden tests |
| .NET | `*.csproj`, `*.fsproj`, `*.sln`, `packages.lock.json`, `App.xaml`, MAUI/WinUI/WPF/Avalonia/Uno/Blazor/Spectre.Console/Terminal.Gui references |
| Java/JVM | `pom.xml`, `build.gradle*`, JavaFX/Vaadin/Spring dependencies, FXML, templates |
| Python | `pyproject.toml`, `uv.lock`, `requirements*.txt`, `marimo`, `solara`, `mesop`, `taipy`, `chainlit`, `anywidget`, `prompt_toolkit`, `streamlit`, `gradio`, `reflex`, `nicegui`, `dash`, `panel`, `shiny`, `textual`, `rich`, notebooks |
| Go | `go.mod`, `go.sum`, templ files, Bubble Tea/Lip Gloss/Fyne/Wails/Gio deps |
| PHP/Ruby/Elixir | `composer.json`/Laravel, `Gemfile`/Rails, `mix.exs`/Phoenix templates/components |
| Scala/Clojure/Elm | `build.sbt`, `deps.edn`, `shadow-cljs.edn`, `elm.json` |
| R/Julia/Lua/Zig/C++ | `DESCRIPTION`, `app.R`, `Project.toml`, `main.lua`+`conf.lua`, `build.zig`, `CMakeLists.txt` |
| Email | `maizzle.config.*`, `*.mjml`, `@react-email/*` templates, plain-text/multipart renderers |
| Game | Unity `ProjectSettings`, Godot `project.godot`, Unreal `*.uproject`, Bevy `Cargo.toml`, MonoGame `*.csproj`, LÖVE2D `conf.lua` |
| Document / print / slides | `*.typ` (Typst), `@page` print CSS, WeasyPrint/Paged.js/Playwright PDF scripts, Gotenberg config, `slides.md` (Slidev/Marp), `pptxgenjs` / `pdfjs-dist` deps |
| Media / social / video | Satori / `@vercel/og` / Takumi OG route handlers, `remotion.config.*`, Motion Canvas `vite.config.*` + `src/scenes/`, FFmpeg render pipelines, SVG banner templates |
| Chat / bot / mini-apps | Slack Bolt / Block Kit JSON, Discord.js / Interaction builders, Telegram Mini App / `grammy` / `python-telegram-bot`, WhatsApp Flows JSON, Microsoft Teams Adaptive Cards, LINE LIFF |
| Extensions / plugins | `manifest.json` (MV3), `wxt.config.*`, `plasmo` config, VS Code `contributes.views` / `webview` in `package.json`, JetBrains `plugin.xml`, Raycast `package.json` (`@raycast/api`), Obsidian `manifest.json`, Figma `manifest.json`, Shopify `shopify.extension.toml`, Atlassian Forge `manifest.yml` |
| Spatial / XR | visionOS `RealityKit` / `ImmersiveSpace` scenes, Android XR Compose `Subspace`, Horizon OS / OpenXR manifests, WebXR (`navigator.xr`), Unity XR Interaction Toolkit (`com.unity.xr.interaction.toolkit`) |
| Constrained / TV / hardware | tvOS/Android TV leanback manifests, watchOS/Wear OS targets, LVGL `lv_conf.h`, Slint embedded targets, e-ink refresh drivers, kiosk shell/systemd configs, Alexa/Google/SSML voice schemas |

## Repo map output

Write concise evidence-backed sections: overview; execution surfaces; routing/screens; design-system authority; state/data ownership; localization; verification tooling; constraints/risks; exact recommended `pixelcraft-*` skill/reference path; unread or uncertain areas. Link facts to paths, not line-perfect guesses.
