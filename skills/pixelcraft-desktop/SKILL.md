---
name: pixelcraft-desktop
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into desktop applications across Tauri, Electron, Electrobun, Qt 6/PySide6/PyQt6/QML, WinUI 3/WPF, AppKit, SwiftUI macOS, GTK4/libadwaita, Avalonia, Rust GUI (GPUI, Dioxus, Iced, libcosmic, Vizia, Slint, egui, AccessKit), JavaFX/Swing, C++/C/Zig GUI (JUCE, GTKmm, FLTK, wxWidgets, Dear ImGui, Nuklear, Ultralight), Go GUI (Wails v3, Fyne, Gio), and Uno Platform. Use for window/menu design, keyboard shortcuts, resizing, multi-monitor restore, high-DPI, native/custom chrome, platform accessibility, and desktop verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft desktop

Use this skill when the surface is a desktop window rather than a browser page or phone screen. Desktop quality depends on window behavior, input acceleration, persistence, menus, shortcuts, density, and platform chrome as much as visual styling.

## Surface craft

Organize persistent navigation, working content and one contextual inspector around the object being edited; hide secondary chrome without hiding state or actions from menus and shortcuts. Resize to the supported minimum, detach or collapse the inspector, then reopen the last workspace and verify selection, keyboard focus and document state.

## Detection signals

`src-tauri/tauri.conf.json`, Electron main/preload configs, `electrobun.config.*`, Qt 6 `.pro`/CMake/PySide6/PyQt6/`.ui`/QML/Kirigami imports, `.csproj` WinUI 3/WPF/Avalonia/Uno (`Uno.Sdk`) references, Xcode AppKit or SwiftUI macOS scenes (`WindowGroup`/`DocumentGroup`/`MenuBarExtra`), GTK4/libadwaita/GTKmm/Blueprint (`.blp`) definitions, Rust `gpui`/`egui`/`slint`/`dioxus`/`iced`/`libcosmic`/`vizia`/`floem`/`relm4`/`xilem` dependencies, Go `wails3`/`wails`/`fyne`/`gio` modules, JavaFX/Swing/FlatLaf, C++/C/Zig `JUCE`/`FLTK`/`wxWidgets`/`imgui`/`nuklear`/`ultralight`/`dvui`/`clay`, installers/bundles, menu/shortcut registration, multi-window architecture.

## Translate direction to desktop idioms

1. Map tokens to native or webview theme resources while respecting system light/dark/high-contrast modes and platform accent/vibrancy/glass fallbacks.
2. Decide whether chrome is native, custom, or hybrid before layout. Never hide essential window controls or break drag/resize/minimize/Snap Layouts behavior.
3. Design for keyboard/mouse precision and acceleration: shortcuts, `F6`/pane focus traversal, context menus, multiple selection, undo, drag/drop, scroll behavior, toolbar density.
4. Handle window state: resize, minimum size, split panes, maximized/fullscreen, multiple windows/monitors, invalid-bounds clamping on restore, DPI changes (and Wayland's no-global-positioning model).
5. Respect platform conventions: macOS menu bar vs Windows/Linux window menus, close/quit semantics, document modified state, notifications, taskbar/dock/tray integration.
6. Use web idioms inside Tauri/Electron/Electrobun/Wails only after honoring desktop shell behavior and security boundaries.

## Platform-wide rules

- **Startup, idle CPU & 30-minute active RAM envelope**: hit **`< 300–500 ms`** cold start on Native/Tauri/Rust/C++/Qt/AppKit/WinUI/GTK apps or **`< 1.0–1.2 s`** on Electron (explicitly justifying Chromium's footprint in the brief); hold **`~0%` idle CPU** when minimized or unfocused; **measure RSS/private RAM after 30 minutes of active usage** against the agreed memory ceiling (verifying zero unbounded leaks); and offload heavy I/O to worker threads/processes.
- **Full workspace session restoration & mixed-DPI clamping**: never trap users in fixed-size windows unless truly modal; restore the **full workspace session across restarts** (open windows, tabs, split ratios, scroll/cursor context, and active/unsaved documents), preserve bounds across mixed-DPI (`100%` ↔ `200%`) monitors, and **clamp off-screen coordinates** onto a connected display's work area when external monitors disconnect (respecting Wayland's size-only model).
- **OS-standard paths, atomic persistence, clean uninstall & support logs**: store config, caches, DBs, and logs in XDG / `~/Library/Application Support` / `%APPDATA%` (never beside the executable); write files atomically (**write temp → `fsync` → atomic rename**) and run SQLite in **`WAL` mode** with versioned migrations; ship a **clean uninstaller** (leaving zero leftover daemons, LaunchAgents, Services, or registry bloat—with explicit user choice on keeping vs removing user data) and an **opt-in support/diagnostic log export** bundle (PII/token redacted).
- **Keyboard acceleration, high-contrast modes & multi-window hygiene**: every primary workflow completes without a mouse (`Tab`, `F6` pane cycle, platform `Cmd` vs `Ctrl` accelerators, `Escape`); honor **Windows `forced-colors` / High Contrast themes and macOS `Increase Contrast` + `Reduce Transparency`**; guard dirty documents on close/quit; soften unfocused window chrome so active focus across multiple windows is unmistakable.
- **2026 code signing, clean-VM install proof & live `v(N-1) -> vN` auto-update rollback**: macOS Developer ID + Hardened Runtime + `xcrun notarytool` + `stapler` + **clean-VM install screenshot** confirming zero Gatekeeper warning; Windows Authenticode via **Azure Artifact Signing (Trusted Signing)** or HSM OV/EV + **clean-VM SmartScreen/install capture** (noting EV certs no longer grant instant SmartScreen bypass since 2024); Linux `.deb`/`.rpm`/Flatpak/GPG AppImage; **`Ed25519`/`minisign`-signed delta auto-updates + rollback verified live across 2 consecutive versions (`v(N-1) -> vN`)**; screen-reader verification across **`NVDA`/`JAWS`/`Narrator`**, **`VoiceOver`**, and **`Orca`** (AT-SPI/AccessKit).

## The 8 WebView Giveaway Killers (mandatory for Tauri / Electron / Wails / WebView2)

1. **`cursor: default`** on buttons, tabs, sidebar rows, menus, and chrome—reserve `cursor: pointer` strictly for external web links.
2. **`user-select: none`** on all toolbars, sidebars, tabs, menus, and buttons (selectable strictly inside editor/content/log panes).
3. **Block browser tells in production**: suppress raw browser `contextmenu` ("Inspect Element"), `Cmd/Ctrl+R` page reload, `Cmd/Ctrl +`/`-` accidental pinch-zoom, and rubber-band `overscroll-behavior` on outer chrome.
4. **Zero white flash on dark cold start**: create hidden native window (`show: false` / `visible: false`) with dark/theme-matched native `backgroundColor` before first paint, revealing on ready.
5. **Custom `40–52 px` titlebar geometry**: dedicated drag region (`data-tauri-drag-region` / `-webkit-app-region: drag`) excluding interactive buttons, double-click to maximize/zoom per OS setting, and **`72–80 px` left inset** for macOS traffic lights (collapsed on fullscreen).
6. **Native OS materials + inactive-window dimming**: pair `NSVisualEffectView` / `Mica` / `Acrylic` / libadwaita backdrops (plus High Contrast / Reduce Transparency fallbacks) with `:window-inactive` / focus-state dimming on unfocused sidebars/titlebars.
7. **Two-way native OS file drag-and-drop & dialogs**: support dropping files from Finder/Explorer with visual drop targets, dragging files out to Desktop/apps, and native OS file open/save dialogs.
8. **Native OS menu bar & single-instance deep links**: register real `File/Edit/View/Window/Help` menus with `Cmd`/`Ctrl` shortcuts and single-instance deep-link activation.

## Anti-lazy-default & anti-slop guard

- **Never default to plain `Tkinter` on greenfield Python desktop apps**: choose **PySide6 / Qt Quick**, **Flet**, **NiceGUI**, **Tauri** (Python sidecar), or **Textual** instead; apply strict DPI/threading/theme hygiene when inheriting brownfield `CustomTkinter` or `Dear PyGui`.
- **Reject unjustified ~200 MB Electron web-SPA wrappers**: when targeting a single OS, prefer native **SwiftUI/AppKit** (macOS), **WinUI 3** (Windows), or **GTK4 + libadwaita** (Linux); when cross-platform efficiency matters, evaluate **Tauri v2**, **Qt 6**, **Avalonia**, **Slint**, or **GPUI** before bundling Chromium.
- **Reject web-page chrome masquerading as a desktop app**: never paste an unadapted browser SPA into a desktop window without all 8 WebView Giveaway Killers, native menus, keyboard shortcuts, dirty-document close confirmation, and multi-monitor restore.

## Common desktop failures

- WebView shell leaking `cursor: pointer`, selectable button text, white dark-mode launch flash, `Ctrl+R` reload, or browser "Inspect Element" menus;
- custom titlebar colliding with macOS traffic lights (`< 72 px` inset or stuck inset in fullscreen), swallowing button clicks, or breaking Windows Snap Layouts;
- restoring a window at off-screen coordinates after an external monitor is unplugged, losing open tabs/documents on restart, or blurring across `100%` ↔ `200%` mixed-DPI displays;
- writing `config.json`/SQLite next to the binary, leaving orphan background helpers/registry keys on uninstall, or truncating project files non-atomically without `fsync` + `rename`;
- assuming Windows EV certs still grant instant SmartScreen bypass or shipping untested auto-updaters.

## Verification options

Rendered verification requires running the actual app/windowing stack or platform-specific UI tests (**Rule #0.3**: inner WebView DOM checks or compilation alone never count as `rendered` desktop verification). Attach 30-minute RAM/CPU profiler readings, clean-VM install screenshots, `v(N-1) -> vN` update/rollback logs, and `NVDA`/`JAWS`/`Narrator`/`VoiceOver`/`Orca` + High Contrast captures; label untested OSes `not-checked`.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, invented copy, or dead menu/toolbar/shortcut handlers;
- [ ] all 8 WebView Giveaway Killers enforced (if Tauri/Electron/Wails/WebView2), `< 300–500 ms` (`< 1.2 s` Electron) cold start, `~0%` idle CPU when minimized/unfocused, and **RAM measured after 30 minutes of active usage** within budget;
- [ ] **full workspace session restoration** (open windows, tabs, splits, active documents), `100%` ↔ `200%` mixed-DPI scaling, and unplugged-monitor on-screen clamping verified;
- [ ] OS-standard storage paths (XDG / `Application Support` / `%APPDATA%`), atomic `temp → fsync → rename` writes, SQLite `WAL` migrations, dirty-close protection, **clean uninstaller** (zero leftover files/daemons/registry), and **opt-in redacted support log export** wired;
- [ ] every primary workflow completes by keyboard (`Tab`, `F6` pane focus, `Cmd`/`Ctrl` menu shortcuts, `Escape`), and **Windows `forced-colors` / High Contrast + macOS `Increase Contrast`** render cleanly;
- [ ] 2026 signing/notarization + **clean-VM Gatekeeper/SmartScreen install screenshot**, **live `v(N-1) -> vN` auto-update + rollback**, and `NVDA`/`JAWS`/`Narrator`/`VoiceOver`/`Orca` checked or honestly labeled `not-checked`;
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, desktop UI/build tests, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).

## Framework routing

- Read [references/working-context.md](references/working-context.md) when designing editors, debuggers, inspectors, linked source/canvas panes, `F6` focus traversal, workspace persistence, or multi-monitor bounds clamping.
- Read [references/tauri.md](references/tauri.md) when building Tauri v2 desktop apps, Rust IPC/`Channel`/`Response`, capability ACLs, v2 plugins, or macOS Overlay chrome.
- Read [references/electron.md](references/electron.md) when building Electron (`WebContentsView`, `safeStorage`, `@electron/fuses`, `titleBarOverlay`, Mica) or evaluating **Electrobun** (Bun + Zig + OS WebView).
- Read [references/qt-pyside-qml.md](references/qt-pyside-qml.md) when building Qt 6 Widgets, PySide6, PyQt6 / Qt Designer (`.ui`), Qt Quick/QML (`FluentWinUI3`/`macOS`, `qmltc`), Kirigami, or maintaining brownfield CustomTkinter/Dear PyGui apps.
- Read [references/winui-wpf.md](references/winui-wpf.md) when building WinUI 3 (Windows App SDK, `x:Bind`, `MicaBackdrop`) or .NET 9/10 WPF (`ThemeMode="System"` Fluent Theme) Windows apps.
- Read [references/appkit.md](references/appkit.md) when building **AppKit** (`NSDocument`, `NSStatusItem`, `NSGlassEffectView`) or **SwiftUI for macOS** (`WindowGroup`, `DocumentGroup`, `MenuBarExtra`, `Settings`, macOS 26 Tahoe Liquid Glass).
- Read [references/gtk.md](references/gtk.md) when building GTK4 / libadwaita 1.4–1.8 Linux UI, Blueprint (`.blp`), XDG Desktop Portals/Flatpak, and Wayland windows.
- Read [references/avalonia.md](references/avalonia.md) when building Avalonia 11+ apps with `ControlTheme`, `ThemeVariant`, `x:CompileBindings`, `TopLevel` services, and `Avalonia.Headless`.
- Read [references/rust-gui.md](references/rust-gui.md) when building Rust desktop UIs across **GPUI**, **Dioxus** (Subsecond/Blitz), **Iced**, **`libcosmic`**, **Vizia**, **Slint**, **egui**, **Floem**, **Makepad**, **Xilem**, **Freya**, **Relm4**, and **AccessKit**.
- Read [references/javafx-swing.md](references/javafx-swing.md) when building JavaFX 22+ (`Platform.Preferences`, AtlantaFX, `jpackage`) or Swing (**FlatLaf**) desktop apps.
- Read [references/cpp-gui.md](references/cpp-gui.md) when building C++/C/Zig desktop UIs across Qt C++, **JUCE** (VST3/AU/CLAP audio plugins), **GTKmm**, wxWidgets, **FLTK 1.4**, Dear ImGui, **Nuklear**, **Ultralight**, **DVUI**, **Clay**, and **raygui**.
- Read [references/go-gui.md](references/go-gui.md) when building Go desktop apps with **Wails v3**/v2, **Fyne**, or **Gio**.
- Read [references/uno-platform.md](references/uno-platform.md) when building Uno Platform 5/6 (`Uno.Sdk` Single Project, Skia Desktop, MVUX, Uno Toolkit) desktop apps.

For **Compose Multiplatform Desktop**, **Flutter Desktop**, **Flet**, or **Kivy** desktop targets, use the canonical framework reference in `pixelcraft-mobile` together with the desktop window/menu/high-DPI/multi-monitor rules in this skill; do not duplicate those framework files here.
