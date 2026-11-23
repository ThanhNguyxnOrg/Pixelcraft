# C++ GUI: Qt/QML, Dear ImGui, wxWidgets

## Token mapping

Qt Widgets/QML: use QObject/QML singleton theme objects, QSS preprocessor variables, palettes, and semantic constants. wxWidgets: centralize system-aware colors/fonts/metrics. Dear ImGui: use a deliberate style struct; remember immediate-mode style is not an accessibility or validation system.

## Layout and responsive idioms

Qt layouts/widgets/QML anchors/layouts handle resizing; wxWidgets sizers are mandatory; ImGui layout is frame-local and explicit. Handle high-DPI, window state, minimum size, multi-window ownership, monitor changes. Choose native versus custom chrome deliberately.

## Typography/custom fonts

Load font assets and verify glyph fallback/IME/localization. Qt has mature font/input infrastructure; wx relies on native controls; ImGui font atlas must include required glyphs and scaling or text becomes missing/tofu.

## Motion/reduced motion

Use Qt animations/timers or wx events purposefully with lifecycle/power awareness. OS reduced-motion integration is inconsistent across custom toolchains; expose an application-level reduced-motion option. ImGui continuous rendering can waste power—use dirty/frame events where possible.

## Accessibility specifics

Qt Widgets/QML have mature accessibility hooks when using real controls/properties; custom painting must expose semantics. wxWidgets benefits from native controls but custom canvases need work. Dear ImGui has no meaningful built-in screen-reader/focus semantics—do not choose it for accessibility-critical productivity UI without an explicit adaptation layer.

## States idiom

Model loading/error/empty/offline/permission/dirty/concurrent states outside paint/frame loops. Long work needs thread/task ownership, cancellation, progress, and safe UI-thread handoff. Preserve document state across close/crash/update.

## Forms idiom

Prefer real Qt/wx controls for validation, clipboard, IME, focus traversal, shortcuts, screen readers. ImGui text input is low-level; validate composition/paste/caret/selection/accessibility before using it for consequential forms.

## Do/don't pairs

| Do | Don't |
|---|---|
| Qt layouts/QML layouts | fixed pixel widget placement |
| wx sizers/native controls | owner-drawing everything unnecessarily |
| explicit worker cancellation/progress | blocking UI thread/frame loop |
| central theme/style object | raw color literals in paint/frame code |

## Known traps

Object lifetime/signals across threads, GPU/context loss, high-DPI bitmap scaling, font atlas glyph omissions, custom chrome breaking platform behavior, accessibility overclaims, power use from continuous rendering, packaging/compiler ABI complexity.

## Verification commands

```sh
cmake --build build
ctest --test-dir build
./build/<app>
```

Run actual OS/windows, inspect keyboard/focus/screen reader behavior where supported, resize/DPI/multi-monitor, shutdown/crash/dirty state, power/frame pacing, package/signing smoke tests.
