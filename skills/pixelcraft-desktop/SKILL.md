---
name: pixelcraft-desktop
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into desktop applications across Tauri, Electron, Electrobun, Qt 6/PySide6/QML, WinUI 3/WPF, AppKit, SwiftUI macOS, GTK4/libadwaita, Avalonia, Rust GUI (GPUI, Dioxus, Iced, Slint, egui, AccessKit), JavaFX/Swing, C++/C/Zig GUI (FLTK, wxWidgets, Dear ImGui), Go GUI (Wails v3, Fyne, Gio), and Uno Platform. Use for window/menu design, keyboard shortcuts, resizing, multi-monitor restore, high-DPI, native/custom chrome, platform accessibility, and desktop verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft desktop

Use this skill when the surface is a desktop window rather than a browser page or phone screen. Desktop quality depends on window behavior, input acceleration, persistence, menus, shortcuts, density, and platform chrome as much as visual styling.

## Surface craft

Organize persistent navigation, working content and one contextual inspector around the object being edited; hide secondary chrome without hiding state or actions from menus and shortcuts. Resize to the supported minimum, detach or collapse the inspector, then reopen the last workspace and verify selection, keyboard focus and document state.

## Detection signals

`src-tauri/tauri.conf.json`, Electron main/preload configs, `electrobun.config.*`, Qt 6 `.pro`/CMake/PySide6/QML/Kirigami imports, `.csproj` WinUI 3/WPF/Avalonia/Uno (`Uno.Sdk`) references, Xcode AppKit or SwiftUI macOS scenes (`WindowGroup`/`DocumentGroup`/`MenuBarExtra`), GTK4/libadwaita/Blueprint (`.blp`) definitions, Rust `gpui`/`egui`/`slint`/`dioxus`/`iced`/`floem`/`relm4`/`xilem` dependencies, Go `wails3`/`wails`/`fyne`/`gio` modules, JavaFX/Swing/FlatLaf, C++/C/Zig `FLTK`/`wxWidgets`/`imgui`/`dvui`/`clay`, installers/bundles, menu/shortcut registration, multi-window architecture.

## Translate direction to desktop idioms

1. Map tokens to native or webview theme resources while respecting system light/dark/high-contrast modes and platform accent/vibrancy/glass fallbacks.
2. Decide whether chrome is native, custom, or hybrid before layout. Never hide essential window controls or break drag/resize/minimize/Snap Layouts behavior.
3. Design for keyboard/mouse precision and acceleration: shortcuts, `F6`/pane focus traversal, context menus, multiple selection, undo, drag/drop, scroll behavior, toolbar density.
4. Handle window state: resize, minimum size, split panes, maximized/fullscreen, multiple windows/monitors, invalid-bounds clamping on restore, DPI changes (and Wayland's no-global-positioning model).
5. Respect platform conventions: macOS menu bar vs Windows/Linux window menus, close/quit semantics, document modified state, notifications, taskbar/dock/tray integration.
6. Use web idioms inside Tauri/Electron/Electrobun/Wails only after honoring desktop shell behavior and security boundaries.

## Platform-wide rules

- Do not trap the user in fixed-size windows unless the interaction truly is modal/essential.
- Every primary task works without a mouse; shortcuts must be discoverable, non-conflicting, localizable, and documented.
- Dirty document state must survive close/crash/logout semantics or warn proportionately.
- Multi-window state must not leak selection/editing focus or duplicate destructive operations.
- High-DPI scaling must keep icons/type sharp; do not hard-code pixel screenshots as the only UI.
- Honor reduced motion, reduced transparency, high contrast, screen readers, platform accessibility APIs, keyboard navigation, and system theme.

## Common desktop failures

- browser SPA pasted into Electron/Tauri/Wails shell with no menus/shortcuts/native behavior;
- custom titlebar missing drag regions, double-click maximize, right-click system menu, Snap Layouts, or accessible controls;
- panes that collapse irreversibly or lose resize state;
- restoring a window at off-screen coordinates after an external monitor is unplugged;
- fixed 1024px layout clipped on small screens/high scaling;
- shortcut conflicts with platform/input method/window manager;
- hidden focus because custom controls never implement keyboard behavior;
- modal dialog chains blocking unrelated windows;
- ignoring multi-instance/file association/deep-link startup state.

## Verification options

Rendered verification requires running the actual app/windowing stack or platform-specific UI tests. Webview DOM inspection only covers inner content, not menus/titlebar/window integration. `Avalonia.Headless`, Qt test tools, XCUITest, Accessibility Insights for Windows (UIA), VoiceOver/Narrator/Orca, screenshot/golden tests, and manual resize/multi-monitor checks provide distinct evidence. Label untested OS/window-manager combinations `not-checked`.

## Framework routing

- Read [references/working-context.md](references/working-context.md) when designing editors, debuggers, inspectors, linked source/canvas panes, `F6` focus traversal, workspace persistence, or multi-monitor bounds clamping.
- Read [references/tauri.md](references/tauri.md) when building Tauri v2 desktop apps, Rust IPC/`Channel`/`Response`, capability ACLs, v2 plugins, or macOS Overlay chrome.
- Read [references/electron.md](references/electron.md) when building Electron (`WebContentsView`, `safeStorage`, `@electron/fuses`, `titleBarOverlay`, Mica) or evaluating **Electrobun** (Bun + Zig + OS WebView).
- Read [references/qt-pyside-qml.md](references/qt-pyside-qml.md) when building Qt 6 Widgets, PySide6, Qt Quick/QML (`FluentWinUI3`/`macOS`, `qmltc`), or Kirigami apps.
- Read [references/winui-wpf.md](references/winui-wpf.md) when building WinUI 3 (Windows App SDK, `x:Bind`, `MicaBackdrop`) or .NET 9/10 WPF (`ThemeMode="System"` Fluent Theme) Windows apps.
- Read [references/appkit.md](references/appkit.md) when building **AppKit** (`NSDocument`, `NSStatusItem`, `NSGlassEffectView`) or **SwiftUI for macOS** (`WindowGroup`, `DocumentGroup`, `MenuBarExtra`, `Settings`, macOS 26 Tahoe Liquid Glass).
- Read [references/gtk.md](references/gtk.md) when building GTK4 / libadwaita 1.4–1.8 Linux UI, Blueprint (`.blp`), XDG Desktop Portals/Flatpak, and Wayland windows.
- Read [references/avalonia.md](references/avalonia.md) when building Avalonia 11+ apps with `ControlTheme`, `ThemeVariant`, `x:CompileBindings`, `TopLevel` services, and `Avalonia.Headless`.
- Read [references/rust-gui.md](references/rust-gui.md) when building Rust desktop UIs across **GPUI**, **Dioxus** (Subsecond/Blitz), **Iced**, **Slint**, **egui**, **Floem**, **Makepad**, **Xilem**, **Freya**, **Relm4**, and **AccessKit**.
- Read [references/javafx-swing.md](references/javafx-swing.md) when building JavaFX 22+ (`Platform.Preferences`, AtlantaFX, `jpackage`) or Swing (**FlatLaf**) desktop apps.
- Read [references/cpp-gui.md](references/cpp-gui.md) when building C++/C/Zig desktop UIs across Qt C++, wxWidgets, **FLTK 1.4**, Dear ImGui, **DVUI**, **Clay**, and **raygui**.
- Read [references/go-gui.md](references/go-gui.md) when building Go desktop apps with **Wails v3**/v2, **Fyne**, or **Gio**.
- Read [references/uno-platform.md](references/uno-platform.md) when building Uno Platform 5/6 (`Uno.Sdk` Single Project, Skia Desktop, MVUX, Uno Toolkit) desktop apps.

For **Compose Multiplatform Desktop**, **Flutter Desktop**, **Flet**, or **Kivy** desktop targets, use the canonical framework reference in `pixelcraft-mobile` together with the desktop window/menu/high-DPI/multi-monitor rules in this skill; do not duplicate those framework files here.
