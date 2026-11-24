# Stack and surface detection

Detect from concrete files; do not infer from repository age, buzzwords, or one copied import. Multiple matches mean multiple surfaces. Prefer the file nearest the UI being changed. The reference names below live inside the named platform skill; never construct cross-skill relative paths.

## Web signals

| Signal | Platform skill → framework reference |
|---|---|
| plain `.html`/`.css` or no framework dependency | `pixelcraft-web` → `html-css` |
| `react`, `next`, `react-router.config.*`, `@tanstack/react-start`, `@vitejs/plugin-react` | `pixelcraft-web` → `react-next` |
| `vue`, `nuxt`, `pinia`, `@nuxt/ui`, `vite.config` Vue plugin | `pixelcraft-web` → `vue-nuxt` |
| `svelte`, `@sveltejs/kit`, `.svelte` | `pixelcraft-web` → `svelte` |
| `solid-js`, `@solidjs/start`, SolidStart config | `pixelcraft-web` → `solid` |
| `@angular/core`, `angular.json` | `pixelcraft-web` → `angular` |
| `astro`, `.astro`, `src/content.config.ts` | `pixelcraft-web` → `astro` |
| `@builder.io/qwik`, `@qwik.dev/core`, Qwik Router/City config | `pixelcraft-web` → `qwik` |
| `preact`, `@preact/signals`, Deno Fresh (`fresh.config.*`), `hono/jsx`, `waku`, `rwsdk` | `pixelcraft-web` → `preact-fresh-hono` |
| `htmx.org`, `alpinejs`, `@starfederation/datastar`, `unpoly`, `hx-*`/`x-data`/`data-on-*` | `pixelcraft-web` → `htmx-alpine` |
| `lit`, custom elements/`.ce`/`shadowRoot` UI | `pixelcraft-web` → `lit-web-components` |
| `tailwindcss`, `@import "tailwindcss"`, `@theme`, Tailwind config | `pixelcraft-web` → `tailwind` |
| `@pandacss/*`, `@vanilla-extract/*`, `@stylexjs/*`, `unocss`, `lightningcss`, `cva`, `tamagui` | `pixelcraft-web` → `styling-ecosystem` |
| `components.json` (shadcn), `@base-ui/react`, `radix-ui`, `react-aria`, `@ark-ui/*`, `@kobalte/*` | `pixelcraft-web` → `component-systems` |
| Rails/Hotwire, Laravel Blade/Livewire, Inertia.js, Django/Jinja, FastHTML, Phoenix LiveView, Blazor, Go templ | `pixelcraft-web` → `server-rendered` |
| `Cargo.toml` deps `leptos`/`yew`/`dioxus-web`, `Trunk.toml`, `Leptos.toml`, `Dioxus.toml` | `pixelcraft-web` → `leptos-yew` |
| Kotlin web/Compose Multiplatform `wasmJs`/Kobweb in Gradle project | `pixelcraft-web` → `kotlin-web` |
| `elm.json` | `pixelcraft-web` → `elm` |
| `deps.edn`, `shadow-cljs.edn`, Reagent/re-frame/UIx/Helix deps | `pixelcraft-web` → `clojurescript` |
| `.fsproj`, Fable/Feliz/Elmish deps | `pixelcraft-web` → `fsharp-fable` |
| `build.sbt`, Scala.js/Laminar deps | `pixelcraft-web` → `scala-laminar` |
| `pom.xml`/Gradle Vaadin/Hilla/Thymeleaf/JTE/Qute deps | `pixelcraft-web` → `java-web` |
| `gsap`, `motion`, `lenis`, `@rive-app/*`, `dotlottie`, `three`, `@react-three/fiber`, `pixi.js`, `@babylonjs/core`, `playcanvas`, `@threlte/core`, `@tresjs/core`, `<model-viewer>`, `luma.gl` | `pixelcraft-web` → matching motion/3D/shader/creative ref (`gsap`, `motion-react`, `smooth-scroll`, `rive-lottie`, `scene-architecture`, `r3f-integration`, `web-3d-engines`, `rendering-choice`, `shader-workflow`) |
| `hls.js`, `shaka-player`, `dashjs`, `video.js`, `vidstack`, `media-chrome`, `@mux/mux-player`, `wavesurfer.js`, `howler`, `tone` | `pixelcraft-web` → `media-players` (plus `video-media`/`audio-reactive`) |
| `@tanstack/react-table`, `ag-grid-*`, `@mui/x-data-grid`, `handsontable`, `fullcalendar`, `@tiptap/*`, `lexical`, `@blocknote/*`, `@codemirror/*`, `monaco-editor`, `@xyflow/react`, `tldraw`, `konva` | `pixelcraft-web` → `enterprise-data-ui`, `rich-text-and-code-editors`, or `canvas-and-node-editors` |
| `yjs`, `@automerge/*`, `@liveblocks/*`, `rxdb`, `@rocicorp/zero`, `@electric-sql/*`, `@tanstack/db`, `@powersync/*`, `jazz-tools`, `@instantdb/*`, `convex` | `pixelcraft-web` → `local-first-sync` |
| `better-auth`, `@clerk/*`, `next-auth`, `@stripe/react-stripe-js`, `@simplewebauthn/*`, `@uppy/*`, `filepond`, `uploadthing` | `pixelcraft-web` → `auth-and-checkout-ui` or `file-upload-media-ui` |

## Mobile signals

| Signal | Platform skill → framework reference |
|---|---|
| SwiftUI imports/types, `Package.swift`, Xcode project | `pixelcraft-mobile` → `swiftui` |
| UIKit imports/view controllers/storyboards | `pixelcraft-mobile` → `uikit` |
| `build.gradle(.kts)` Compose dependencies, `@Composable` | `pixelcraft-mobile` → `jetpack-compose` |
| `pubspec.yaml`, Flutter imports | `pixelcraft-mobile` → `flutter` |
| React Native/Expo config, `app.json`, `expo-router`, RN dependencies | `pixelcraft-mobile` → `react-native-expo` |
| `@lynx-js/react`, `@lynx-js/rspeedy`, `lynx.config.*` | `pixelcraft-mobile` → `lynxjs` |
| Kotlin Multiplatform/Compose Multiplatform source sets | `pixelcraft-mobile` → `kotlin-multiplatform` |
| `@nativescript/core`, `nativescript.config.*`, `skip.yml`/`SkipUI` | `pixelcraft-mobile` → `nativescript-and-skip` |
| Ionic/Capacitor config/dependencies | `pixelcraft-mobile` → `ionic-capacitor` |
| MAUI `.csproj`/XAML/AppShell references | `pixelcraft-mobile` → `dotnet-maui` |
| `flet` controls/page | `pixelcraft-mobile` → `flet` |
| `kivy`/`kivymd`/KV language/App classes | `pixelcraft-mobile` → `kivy` |

## Data-app signals

| Signal | Platform skill → framework reference |
|---|---|
| `streamlit` import/dependency or `.streamlit/config.toml` | `pixelcraft-data-apps` → `streamlit` |
| `gradio`/`gr.Blocks`/`gr.Interface`/`gr.ChatInterface` | `pixelcraft-data-apps` → `gradio` |
| `marimo`/`import marimo as mo`, `solara`, `mesop`, `taipy` | `pixelcraft-data-apps` → `reactive-data-apps` |
| `chainlit`/`.chainlit/config.toml`, `python-fasthtml`, `preswald`, Retool/Appsmith/ToolJet/Budibase configs | `pixelcraft-data-apps` → `ai-and-internal-data-apps` |
| `reflex`/`rx.App` | `pixelcraft-data-apps` → `reflex` |
| `nicegui`/`from nicegui import ui` | `pixelcraft-data-apps` → `nicegui` |
| `dash`/Dash layout callbacks | `pixelcraft-data-apps` → `dash` |
| `panel`/`import panel as pn` | `pixelcraft-data-apps` → `panel` |
| Shiny for Python (`shiny` UI/server/reactive) | `pixelcraft-data-apps` → `shiny` |
| `ipywidgets`/`anywidget`/`voila` notebook widgets | `pixelcraft-data-apps` → `jupyter-widgets` |
| R `DESCRIPTION`/`app.R` with `shiny`/`bslib` | `pixelcraft-data-apps` → `r-shiny` |
| Julia `Project.toml` with Genie/Stipple | `pixelcraft-data-apps` → `julia-genie` |
| `observablehq.config.*`, Framework Markdown/data loaders | `pixelcraft-data-apps` → `observable-framework` |
| `evidence.config.yaml`, `theme.yaml`, Evidence `pages/`/`sources/` | `pixelcraft-data-apps` → `evidence` |

## Desktop signals

| Signal | Platform skill → framework reference |
|---|---|
| `src-tauri/tauri.conf.json` or Tauri dependency | `pixelcraft-desktop` → `tauri` |
| Electron main/preload/package config, `electrobun.config.*` | `pixelcraft-desktop` → `electron` |
| Qt `.pro`/CMake Qt modules/PySide6/PyQt6/`.qml` | `pixelcraft-desktop` → `qt-pyside-qml` |
| WinUI/WPF `.csproj`/XAML/WindowsAppSDK references | `pixelcraft-desktop` → `winui-wpf` |
| AppKit/Cocoa or macOS SwiftUI `WindowGroup`/`MenuBarExtra` targets | `pixelcraft-desktop` → `appkit` |
| GTK4/libadwaita build definitions/imports/Blueprint `.blp` | `pixelcraft-desktop` → `gtk` |
| Avalonia `.csproj`/AXAML references | `pixelcraft-desktop` → `avalonia` |
| `gpui`, `egui`, `slint`, `dioxus`, `iced`, `floem`, `makepad`, `xilem`, `freya`, `relm4` in Rust deps | `pixelcraft-desktop` → `rust-gui` |
| `pom.xml`/Gradle JavaFX, Swing/FlatLaf UI entry points/FXML | `pixelcraft-desktop` → `javafx-swing` |
| `CMakeLists.txt` Qt C++/Dear ImGui/wxWidgets/FLTK, Zig `dvui`/C `clay`/`raygui` | `pixelcraft-desktop` → `cpp-gui` |
| `go.mod` Fyne/Wails (v2/v3)/Gio deps | `pixelcraft-desktop` → `go-gui` |
| Uno Platform `.csproj`/XAML/config references | `pixelcraft-desktop` → `uno-platform` |

## TUI signals

| Signal | Platform skill → framework reference |
|---|---|
| `textual` dependency/import or `.tcss` | `pixelcraft-tui` → `textual` |
| `rich` dependency/import without full Textual app | `pixelcraft-tui` → `rich` |
| `ink` dependency/import | `pixelcraft-tui` → `ink` |
| Go `bubbletea`/`lipgloss`/`huh`/`bubbles` imports | `pixelcraft-tui` → `bubbletea-lipgloss` |
| Rust `ratatui`/`crossterm` dependencies | `pixelcraft-tui` → `ratatui` |
| `.NET` `Terminal.Gui`/`Spectre.Console`, Python `prompt_toolkit`/`questionary`, `@opentui/*`, `@clack/prompts`, `@inquirer/prompts`, C++ `ftxui`, `notcurses`, Go `tcell`/`tview`, Rust `dialoguer`/`inquire` | `pixelcraft-tui` → `extended-tui-toolkits` |
| Kitty Graphics, Sixel, OSC 8/52/9;4, DEC Mode 2026, `NO_COLOR`/`COLORTERM` capability checks | `pixelcraft-tui` → `terminal-protocols` |

## Email signals

| Signal | Platform skill → framework reference |
|---|---|
| table-heavy HTML email/inline CSS templates | `pixelcraft-email` → `html-tables` |
| `.mjml` files or `mjml` dependency | `pixelcraft-email` → `mjml` |
| `@react-email`/`react-email`, `vue-email`, Resend/Loops templates | `pixelcraft-email` → `react-email` |
| `@maizzle/framework`, `maizzle.config.*` | `pixelcraft-email` → `maizzle` |
| Classic/New Outlook, Gmail 102 KB clipping, Apple Mail, dark mode, image blocking, BIMI/plaintext | `pixelcraft-email` → `client-quirks` |

## Document and slide signals

| Signal | Platform skill → framework reference |
|---|---|
| `@page`, `@media print`, Paged.js, Vivliostyle, PrinceXML print stylesheets | `pixelcraft-document` → `print-css` |
| `.typ` (Typst), `.tex` (LaTeX), `weasyprint`, `@react-pdf/renderer`, `page.pdf()`, Gotenberg, `pdf-lib`, ReportLab, Quarto `.qmd`, `docx`/`exceljs` | `pixelcraft-document` → `pdf-tools` |
| `pdfjs-dist` embedded viewers, `pptxgenjs` programmatic decks | `pixelcraft-document` → `pdfjs-and-pptx` |
| invoices, ZUGFeRD/Factur-X, reports, CVs/résumés | `pixelcraft-document` → `archetypes` |
| Slidev, `reveal.js`, Marp, Typst Touying/Polylux, Quarto RevealJS | `pixelcraft-document` → `slides` |

## External media signals

| Signal | Platform skill → framework reference |
|---|---|
| OG/Twitter/YouTube/Bluesky/Discord/WhatsApp preview dimensions & safe zones | `pixelcraft-media` → `social-cards` |
| `satori`, `@vercel/og`, `ImageResponse`, `takumi`, `@resvg/resvg-js`, `sharp`, `@napi-rs/canvas` | `pixelcraft-media` → `og-generation` |
| `remotion`, `@motion-canvas/*`, `revideo`, FFmpeg export pipelines, SVG posters/banners | `pixelcraft-media` → `banners-video` |

## Chat and AI-native UI signals

| Signal | Platform skill → framework reference |
|---|---|
| `@slack/bolt`, Slack Block Kit/AI Assistant, `discord.js`, Discord Components V2/Activities | `pixelcraft-chat-ui` → `slack-discord` |
| Telegram Bot API/Mini Apps, Zalo `zmp-ui`/`zmp-sdk`, WhatsApp Flows, Teams Adaptive Cards, LINE LIFF/Flex, WeChat Mini Program | `pixelcraft-chat-ui` → `mobile-business-platforms` |
| `@ai-sdk/react`/`vue`/`svelte`/`angular`, `@assistant-ui/*`, `@copilotkit/*`, `AG-UI`, `@langchain/langgraph-sdk`, MCP Apps/MCP-UI, OpenAI Apps SDK (`window.openai`), A2UI | `pixelcraft-chat-ui` → `ai-ui-libraries` (pair with `agentic-workspace`) |
| streaming LLM assistant threads, tool-call traces, split artifact panes, approval gates | `pixelcraft-chat-ui` → `agentic-workspace` |

## Extensions and plugin signals

| Signal | Platform skill → framework reference |
|---|---|
| `manifest.json` (`manifest_version: 3`), `wxt.config.*`, Plasmo, CRXJS, Safari Web Extensions, `chrome.sidePanel`, DevTools panels | `pixelcraft-extensions` → `browser-extensions` |
| VS Code `contributes`, `createWebviewPanel`, Custom Editors, `vscode.chat`, `vscode.lm` | `pixelcraft-extensions` → `vscode-webviews` |
| `@raycast/api`, `@raycast/utils` | `pixelcraft-extensions` → `raycast` |
| Figma plugin/widget `manifest.json` (`@figma/plugin-typings`, `figma.widget`), Office Add-in Unified Manifest / `office-js` | `pixelcraft-extensions` → `figma-office` |
| JetBrains `plugin.xml`/Jewel, Obsidian `manifest.json`/`ItemView`, Shopify `@shopify/app-bridge-react`/Polaris, Atlassian Forge `manifest.yml` | `pixelcraft-extensions` → `ide-and-saas-plugins` |

## Constrained hardware and voice signals

| Signal | Platform skill → framework reference |
|---|---|
| tvOS, Android TV / `androidx.tv:tv-material`, Roku BrightScript/SceneGraph, Fire TV/Vega OS, webOS Enact, Tizen, watchOS, `androidx.wear.compose` | `pixelcraft-constrained` → `tv-wearables` |
| e-ink (Boox/Kindle/reMarkable), kiosk/POS, ISA-101 HMI, LVGL, Slint MCU, Rust `embedded-graphics`, TouchGFX, Qt for MCUs, CarPlay/Android Auto/AAOS | `pixelcraft-constrained` → `specialized-hardware` |
| OpenAI Realtime API, Gemini Live, LiveKit Agents, Pipecat, Siri `AppIntent`, Alexa APL, SSML/IVR | `pixelcraft-constrained` → `voice-ui` |

## Spatial and XR signals

| Signal | Platform skill → framework reference |
|---|---|
| visionOS (`RealityKit`, `ImmersiveSpace`, `TabletopKit`), Android XR (`androidx.xr.compose`, SceneCore), Meta Horizon OS / Spatial SDK / MRUK, `@react-three/xr`, WebXR, Wonderland/Needle Engine, Unity XRI, Unreal OpenXR | `pixelcraft-spatial` → `platforms` (pair with `comfort-accessibility`) |

## Dataviz signals

| Signal | Platform skill → framework reference |
|---|---|
| `d3`, `@observablehq/plot`, `vega-lite`, `echarts`, `plotly`, `chart.js`, `recharts`, `@visx/*`, `@nivo/*`, `highcharts`, `uplot`, `lightweight-charts`, `@antv/*`, `maplibre-gl`, `mapbox-gl`, `deck.gl`, `leaflet`, `pmtiles`, `@turf/*`, `cytoscape`, `sigma`, `cosmograph`, `@finos/perspective`, `@uwdata/mosaic-*`, `matplotlib`/`seaborn`/`altair`/`bokeh`/`holoviews`/`datashader`, `ggplot2`, `Makie`, Swift Charts, Compose Vico | `pixelcraft-dataviz` → `libraries`, `maps-geospatial`, or `realtime-graphs-maps-scale` (alongside the platform skill) |

## Game UI signals

| Signal | Platform skill → framework reference |
|---|---|
| `ProjectSettings/`, `.unity`, UXML/USS/UI Builder assets | `pixelcraft-game-ui` → `unity-ui-toolkit` |
| Unity `Canvas`/`CanvasScaler`/`RectTransform`/TextMeshPro (`.prefab`, `TMPro`) | `pixelcraft-game-ui` → `unity-ugui` |
| `project.godot`, `.tscn`, `.gd`, Control/Theme resources | `pixelcraft-game-ui` → `godot` |
| `.uproject`, UMG/Slate/CommonUI/MVVM assets or references | `pixelcraft-game-ui` → `unreal-umg` |
| HUD/controller/safe-area/certification/accessibility question | `pixelcraft-game-ui` → `hud-principles` |
| `main.lua` + `conf.lua`, `love.*` calls | `pixelcraft-game-ui` → `love2d` |
| `Cargo.toml` with `bevy` dependency | `pixelcraft-game-ui` → `bevy` |
| MonoGame `.csproj`/Content Pipeline/Gum/Myra/FontStashSharp | `pixelcraft-game-ui` → `monogame` |
| `phaser`, `@pixi/ui`, `excalibur`, `kaplay`, NoesisGUI, RmlUi, Coherent Gameface, Dear ImGui HUD, Raylib `raygui`, SDL3, Defold, Cocos Creator | `pixelcraft-game-ui` → `web-and-middleware-game-ui` |

## Design handoff and brand identity signals

| Signal | Route |
|---|---|
| Figma URL/Dev Mode/Figma MCP, Code Connect `*.figma.*`, Penpot, approved design mockup/screenshot to implement faithfully | `pixelcraft-handoff` → `design-translation` (plus `fidelity-tolerance`, `motion-handoff`) |
| request for brand kit, identity board, visual identity, brand guidelines image, moodboard, visual-world board, logo system, launch identity, rebrand, or refresh | `pixelcraft-brandkit` |
| supplied logo/wordmark/palette/type/brand assets to preserve | `pixelcraft-brandkit` intake: build on existing brand |
| selected palette/type must become implementation tokens | `pixelcraft-brandkit` → `pixelcraft-tokens` |

## Language → framework routing matrix

| Language | Frameworks/surfaces | Skill → reference |
|---|---|---|
| C / C++ | Qt/QML, Dear ImGui, wxWidgets, FLTK, Clay, raygui, LVGL, FTXUI, Notcurses, RmlUi, NoesisGUI, SDL3, Raylib | `pixelcraft-desktop` → `cpp-gui`; `pixelcraft-tui` → `extended-tui-toolkits`; `pixelcraft-constrained` → `specialized-hardware`; `pixelcraft-game-ui` → `web-and-middleware-game-ui` |
| C# | Blazor, MAUI, WinUI/WPF, Avalonia, Uno, Terminal.Gui/Spectre.Console, Unity uGUI/UI Toolkit, MonoGame | `pixelcraft-web` → `server-rendered`; `pixelcraft-mobile` → `dotnet-maui`; `pixelcraft-desktop` → `winui-wpf`/`avalonia`/`uno-platform`; `pixelcraft-tui` → `extended-tui-toolkits`; `pixelcraft-game-ui` → `unity-ugui`/`unity-ui-toolkit`/`monogame` |
| Clojure | ClojureScript/Reagent/re-frame/UIx/Helix | `pixelcraft-web` → `clojurescript` |
| Dart | Flutter mobile/desktop/web | `pixelcraft-mobile` → `flutter`; pair `pixelcraft-desktop` or `pixelcraft-web` checks by primary surface |
| Elm | Elm Browser UI | `pixelcraft-web` → `elm` |
| Elixir | Phoenix LiveView | `pixelcraft-web` → `server-rendered` |
| F# | Fable/Feliz/Elmish, .NET desktop | `pixelcraft-web` → `fsharp-fable`; desktop by actual XAML framework |
| Go | templ/templates, Bubble Tea/Lip Gloss/Huh/tview, Fyne/Wails (v2/v3)/Gio | `pixelcraft-web` → `server-rendered`; `pixelcraft-tui` → `bubbletea-lipgloss`/`extended-tui-toolkits`; `pixelcraft-desktop` → `go-gui` |
| Java | Vaadin/Hilla/Thymeleaf/JTE/Qute, JavaFX/Swing/FlatLaf | `pixelcraft-web` → `java-web`; `pixelcraft-desktop` → `javafx-swing` |
| Julia | Genie/Stipple, Makie | `pixelcraft-data-apps` → `julia-genie`; `pixelcraft-dataviz` → `libraries` |
| Kotlin | Compose Android/TV/Wear/XR, KMP, Compose Web `wasmJs`/Kobweb, JetBrains Jewel/UI DSL | `pixelcraft-mobile` → `jetpack-compose`/`kotlin-multiplatform`; `pixelcraft-web` → `kotlin-web`; `pixelcraft-constrained` → `tv-wearables`; `pixelcraft-spatial` → `platforms`; `pixelcraft-extensions` → `ide-and-saas-plugins` |
| Lua | LÖVE2D, Defold | `pixelcraft-game-ui` → `love2d`/`web-and-middleware-game-ui` |
| PHP | Laravel Blade/Livewire/Inertia | `pixelcraft-web` → `server-rendered` |
| Python | marimo/Solara/Mesop/Taipy/Streamlit/Gradio/Chainlit/Reflex/NiceGUI/Dash/Panel/Shiny/Jupyter/AnyWidget/FastHTML; Django; Flet/Kivy/KivyMD; Qt/PySide6; Textual/Rich/prompt_toolkit; WeasyPrint/ReportLab | `pixelcraft-data-apps` matching ref; `pixelcraft-web` → `server-rendered`; `pixelcraft-mobile` → `flet`/`kivy`; `pixelcraft-desktop` → `qt-pyside-qml`; `pixelcraft-tui` → `textual`/`rich`/`extended-tui-toolkits`; `pixelcraft-document` → `pdf-tools` |
| R | Shiny/bslib, ggplot2, Quarto | `pixelcraft-data-apps` → `r-shiny`; `pixelcraft-dataviz` → `libraries`; `pixelcraft-document` → `pdf-tools` |
| Ruby | Rails/Hotwire/Turbo 8/Inertia | `pixelcraft-web` → `server-rendered` |
| Rust | Leptos/Yew/Dioxus Web, GPUI/Slint/Dioxus/Iced/egui/Floem/Xilem/Relm4, Ratatui, Bevy, Typst, `embedded-graphics`/Slint MCU | `pixelcraft-web` → `leptos-yew`; `pixelcraft-desktop` → `rust-gui`; `pixelcraft-tui` → `ratatui`; `pixelcraft-game-ui` → `bevy`; `pixelcraft-document` → `pdf-tools`; `pixelcraft-constrained` → `specialized-hardware` |
| Scala | Laminar/Scala.js | `pixelcraft-web` → `scala-laminar` |
| Swift | SwiftUI/UIKit, macOS AppKit/SwiftUI, visionOS, Skip, tvOS/watchOS, Siri App Intents | `pixelcraft-mobile` → `swiftui`/`uikit`/`nativescript-and-skip`; `pixelcraft-desktop` → `appkit`; `pixelcraft-spatial` → `platforms`; `pixelcraft-constrained` → `tv-wearables`/`voice-ui` |
| TS/JS | React/Next/RR7/TanStack Start, Vue/Nuxt, Svelte, Solid, Angular, Astro, Qwik, Preact/Fresh/Hono, htmx/Alpine/Datastar, Lit, RN/Expo/LynxJS/NativeScript/Ionic, Tauri/Electron/Electrobun, Ink/OpenTUI/Clack, Observable/Evidence, React Email/Maizzle/MJML, Slidev/PDF.js/PptxGenJS, Satori/Remotion, AI SDK/assistant-ui/CopilotKit, WXT/VS Code/Raycast/Figma, Phaser/PixiJS | route by surface (`pixelcraft-web`, `pixelcraft-mobile`, `pixelcraft-desktop`, `pixelcraft-tui`, `pixelcraft-data-apps`, `pixelcraft-email`, `pixelcraft-document`, `pixelcraft-media`, `pixelcraft-chat-ui`, `pixelcraft-extensions`, `pixelcraft-game-ui`) |
| Zig | DVUI, C interop (`clay`/`raygui`/`SDL3`), Electrobun host | `pixelcraft-desktop` → `cpp-gui`/`electron`; verify current library APIs in `pixelcraft-plan` |

## Existing system inventory

Before designing, inspect design token files (`tokens.json`, `*.tokens.json`, `*.resolver.json`, `style-dictionary.config.*`, `terrazzo.config.*`, Tokens Studio `$themes.json`/`$metadata.json`, `*.figma.tsx` Code Connect, Tailwind v4 `@theme` or v3 config, asset catalogs, resource dictionaries, Qt/QSS, Godot themes, UMG styles), component libraries (`components.json`), lint/test/screenshot fixtures, localization catalogs, brand assets/licenses, density conventions, and navigation structure. Record whether the system is authoritative, partial, inconsistent, or absent. Existing tokens outrank Pixelcraft-generated taste.

## Input/render surface

Classify input modality (touch, mouse/keyboard, controller, remote/D-pad, gaze/hand, terminal keyboard, screen reader, voice), viewport/window constraints, network context, platform/version, and rendering surface (DOM/canvas/WebGL/WebGPU/native/Skia/terminal cells/email client/paged print/game engine/XR compositor). These facts determine which floor checks and platform idioms apply.
