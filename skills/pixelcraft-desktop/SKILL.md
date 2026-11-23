---
name: pixelcraft-desktop
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into desktop applications across Tauri, Electron, Qt/PySide/QML, WinUI/WPF, AppKit, GTK, Avalonia, Rust GUI, Java desktop, C++ GUI, Go GUI, and Uno Platform. Use for window/menu design, keyboard shortcuts, resizing, high-DPI behavior, multi-window state, native/custom chrome, platform accessibility, forms, states, motion, and desktop verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft desktop

Use this skill when the surface is a desktop window rather than a browser page or phone screen. Desktop quality depends on window behavior, input acceleration, persistence, menus, shortcuts, density, and platform chrome as much as visual styling.

## Detection signals

`src-tauri/tauri.conf.json`, Electron main/preload packages/config, Qt `.pro`/CMake/PySide/QML imports, `.csproj` WinUI/WPF/Avalonia references, Xcode/AppKit targets, GTK build definitions, Rust `egui`/`slint`/`dioxus`/`iced` dependencies, installers/bundles, menu/shortcut registration, multi-window process architecture.

## Translate direction to desktop idioms

1. Map tokens to native or webview theme resources while respecting system light/dark/high-contrast modes.
2. Decide whether chrome is native, custom, or hybrid before layout. Never hide essential window controls or break drag/resize/minimize behavior.
3. Design for keyboard/mouse precision and acceleration: shortcuts, focus traversal, context menus, multiple selection, undo, drag/drop, scroll behavior, toolbar density.
4. Handle window state: resize, minimum size, split panes, maximized/fullscreen, multiple windows/monitors, DPI changes, persistence/restoration.
5. Respect platform conventions: macOS menu bar vs Windows/Linux window menus, close/quit semantics, document modified state, notifications, taskbar/dock integration.
6. Use web idioms inside Tauri/Electron only after honoring desktop shell behavior.

## Platform-wide rules

- Do not trap the user in fixed-size windows unless the interaction truly is modal/essential.
- Every primary task works without a mouse; shortcuts must be discoverable, non-conflicting, localizable, and documented.
- Dirty document state must survive close/crash/logout semantics or warn proportionately.
- Multi-window state must not leak selection/editing focus or duplicate destructive operations.
- High-DPI scaling must keep icons/type sharp; do not hard-code pixel screenshots as the only UI.
- Honor reduced motion, contrast, screen readers, platform accessibility APIs, keyboard navigation, and system theme.

## Common desktop failures

- browser SPA pasted into Electron/Tauri shell with no menus/shortcuts/native behavior;
- custom titlebar missing drag regions, double-click maximize, right-click system menu, or accessible controls;
- panes that collapse irreversibly or lose resize state;
- fixed 1024px layout clipped on small screens/high scaling;
- shortcut conflicts with platform/input method/window manager;
- hidden focus because custom controls never implement keyboard behavior;
- modal dialogs chains blocking unrelated windows;
- ignoring multi-instance/file association/deep-link startup state.

## Verification options

Rendered verification requires running the actual app/windowing stack or platform-specific UI tests. Webview DOM inspection only covers inner content, not menus/titlebar/window integration. Qt test tools, XCUITest, Windows UI Automation, accessibility inspectors, screenshot/golden tests, and manual resize/multi-monitor checks provide distinct evidence. Label untested OS/window-manager combinations `not-checked`.

## Framework routing

- Read [references/tauri.md](references/tauri.md) for Tauri.
- Read [references/electron.md](references/electron.md) for Electron.
- Read [references/qt-pyside-qml.md](references/qt-pyside-qml.md) for Qt Widgets, PySide/PyQt, and QML.
- Read [references/winui-wpf.md](references/winui-wpf.md) for WinUI/WPF/Windows desktop.
- Read [references/appkit.md](references/appkit.md) for AppKit/macOS.
- Read [references/gtk.md](references/gtk.md) for GTK/libadwaita Linux UI.
- Read [references/avalonia.md](references/avalonia.md) for Avalonia.
- Read [references/rust-gui.md](references/rust-gui.md) for egui, Slint, Dioxus, and iced.
- Read [references/javafx-swing.md](references/javafx-swing.md) for JavaFX/Swing desktop.
- Read [references/cpp-gui.md](references/cpp-gui.md) for Qt C++/QML, Dear ImGui, and wxWidgets.
- Read [references/go-gui.md](references/go-gui.md) for Fyne, Wails, and Gio.
- Read [references/uno-platform.md](references/uno-platform.md) for Uno Platform/XAML cross-platform desktop.

For Flet or Kivy desktop targets, use the canonical framework reference in `pixelcraft-mobile` together with the desktop window/menu/high-DPI rules in this skill; do not duplicate those framework files here.
