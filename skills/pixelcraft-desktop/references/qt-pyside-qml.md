# Qt / PySide / QML

## Token mapping

For Qt Widgets/PySide/QSS, generated Qt variables are preprocessor-style constants because QSS has no runtime CSS variables:

```qss
/* substitute @semantic-color-action before loading */
QPushButton { background: @semantic-color-action; }
```

Use Qt resource/palette/theme mechanisms where possible. In QML, create a singleton/theme object or context property containing semantic colors, spacing, type roles, and motion values.

## Layout and responsive idioms

Widgets: use layout managers (`QVBoxLayout`, `QGridLayout`, size policies, splitter) rather than fixed geometry. QML: anchors/layouts/scaling behavior chosen deliberately. Handle resize/minimum size, high-DPI scaling, multiple monitors, platform style differences, and keyboard focus chain.

## Typography/custom fonts

Use `QFontDatabase` for font loading and platform font fallback. Qt scaling/point-vs-pixel behavior can vary by DPI/platform; verify actual output. QML font properties should use semantic roles rather than ad hoc pixelsize everywhere.

## Motion/reduced motion

Use QML animations/behaviors/NumberAnimation or Qt property animations purposefully. System reduced-motion exposure varies by platform/Qt version; provide application setting or platform-specific detection where necessary. Do not block input in modal animation loops.

## Accessibility specifics

Qt accessibility APIs expose name/description/role/state through accessible object layers. Set object names/accessibility metadata deliberately, preserve keyboard focus chain/shortcuts/mnemonics, use standard controls first, honor platform high-contrast themes, and test screen readers per OS. Custom painting needs explicit accessibility exposure.

## States idiom

Model loading/error/empty/offline/permission/dirty document state explicitly. Long work belongs in worker thread/task patterns with cancellation/progress; never block GUI thread. Multiwindow/document state, close confirmation, crash recovery, and drag/drop failure are UX states.

## Forms idiom

Use labeled line edits/combo boxes/form layouts, validators/input masks carefully, correct focus order, paste/IME behavior, validation timing, and input preservation. Do not use placeholder text as the only label where platform expectation is persistent labeling.

## Do/don't pairs

| Do | Don't |
|---|---|
| layout managers/size policies | fixed geometry copied from one screenshot |
| worker thread/progress/cancel for long work | blocking the GUI thread and freezing the window |
| semantic QML singleton/theme object | raw color constants in every component |
| explicit focus chain/mnemonics | mouse-only custom controls |
| platform high-contrast/theme testing | forcing custom paint/colors over system accessibility settings |

## Known traps

QSS unsupported variable assumptions, stylesheet cascading unpredictably, GUI-thread blocking, DPI scaling mismatch, font metric differences, object lifetime/deletion in Python/C++ boundary, focus proxy confusion, platform theme clash, accessibility metadata absent in custom widgets/QML items.

## Verification commands

```sh
python -m pytest 2>/dev/null || true
cmake --build build 2>/dev/null || true
qmltestrunner 2>/dev/null || true
python main.py 2>/dev/null || true
```

Use real OS runs, Qt accessibility inspection where available, keyboard-only completion, high-DPI/multi-monitor/resize tests, screen readers, high-contrast themes, and window-state verification.
