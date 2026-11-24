# Qt 6 / PySide6 / QML

Use this reference for **Qt 6, PySide6 (official Python bindings), Qt Quick / QML, and Kirigami**. For C++ CMake build chains, wxWidgets, FLTK 1.4, Dear ImGui, and lightweight C/Zig desktop GUIs, see `references/cpp-gui.md`.

## Token mapping, `styleHints.colorScheme`, & QSS caveat

- **Qt Quick / QML (preferred for bespoke & modern cross-platform UI)**: create a QML `pragma Singleton` theme object keyed to semantic roles and react directly to **`Application.styleHints.colorScheme`** (`Qt.ColorScheme.Dark` / `Light` / `Unknown` in Qt 6.5+):

```qml
pragma Singleton
import QtQuick

QtObject {
    readonly property bool isDark: Application.styleHints.colorScheme === Qt.ColorScheme.Dark
    readonly property color action: isDark ? "#5bb2ff" : "#0074ca"
    readonly property color surface: isDark ? "#14161a" : "#ffffff"
    readonly property int controlInline: 12
}
```

- **Qt Quick Controls 2 native styles**: select native platform styles (`FluentWinUI3` on Windows 11, `macOS` on macOS, `Fusion`/`Basic` fallback on Linux) via `QQuickStyle.setStyle(...)` / `qtquickcontrols2.conf` so dialogs, scrollbars, and focus rings match the host OS. For adaptive Linux/KDE/convergent apps, layer **Kirigami** (`Kirigami.PageRow`, `Kirigami.Action`, `Kirigami.PlaceholderMessage`) on top of Qt Quick Controls 2.
- **Qt Widgets / PySide6 QSS warning**: **heavy `setStyleSheet(...)` (QSS) breaks native platform widget styles** (`QStyle` falls back to `QStyleSheetStyle`, stripping native Windows 11 Fluent animations, macOS Aqua chrome, focus rings, and system high-contrast palettes). Prefer **`QPalette`**, **`QApplication.styleHints().colorScheme()`**, and targeted sub-control overrides over full-app QSS rewrites; where QSS is unavoidable, preprocess semantic `@token` placeholders at build time because QSS has no runtime CSS variables.

```python
from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication

def is_system_dark(app: QApplication) -> bool:
    return app.styleHints().colorScheme() == Qt.ColorScheme.Dark
```

## Layout, compilation (`qmltc`), & responsive idioms

- **Qt Widgets**: always use layout managers (`QVBoxLayout`, `QGridLayout`, `QFormLayout`, `QSplitter`) and `QSizePolicy`—never fixed geometry (`setGeometry`).
- **QML**: prefer `QtQuick.Layouts` (`RowLayout`, `ColumnLayout`, `GridLayout`) with `Layout.fillWidth` and explicit minimum window sizes. Use **`qmltc`** (QML Type Compiler) and `qmllint` on C++/Qt 6 projects to compile QML into C++ for startup performance and catch type/binding bugs statically.
- Handle fractional HiDPI scaling, multi-monitor DPI changes, and clamped window geometry restoration (`QSettings` / `restoreGeometry`).

## Typography, motion, & reduced motion

Load custom fonts via `QFontDatabase.addApplicationFont(...)` and verify platform fallback chains (CJK/RTL/emoji) and point-vs-pixel scaling. Keep QML `NumberAnimation` / `Behavior` and `QPropertyAnimation` brief and interruptible; because Qt does not expose one uniform cross-OS reduced-motion property across every desktop environment, query platform hooks or provide an explicit app-level reduced-motion preference so animations can be disabled cleanly.

## Accessibility, states, & forms idioms

Use standard Qt/QML controls first (they implement `QAccessible` / platform UIA / NSAccessibility / AT-SPI peers automatically). Set `accessibleName` / `Accessible.name`, `Accessible.role`, `Accessible.description`, keyboard shortcuts (`QShortcut` / `Action`), mnemonics (`&Save`), and explicit `QWidget.setTabOrder` / `KeyNavigation` chains.

Never block the Qt GUI event loop (`QApplication.exec()`) with synchronous network or disk I/O—use `QThreadPool` + `QRunnable` / `QObject` worker signals (or Python `QtAsyncio` / `QProcess`) with cancellation and progress states. Intercept `closeEvent` to protect dirty documents. In forms, pair `QFormLayout` / labeled `TextField` controls with `QValidator` / post-edit validation text (not red borders alone) and preserve input on failed submits.

## PyQt6 & Qt Designer (`.ui` / `uic`)

- **PyQt6 vs PySide6**: both wrap Qt 6 with identical layout, palette, and `QAccessible` mechanics, but differ in licensing (PyQt6 is GPLv3/commercial; PySide6 is LGPLv3) and bindings (`pyqtSignal`/`pyqtSlot` + strict scoped enums like `Qt.AlignmentFlag.AlignCenter` in PyQt6 vs `Signal`/`Slot` in PySide6). Match whichever binding the repo already declares.
- **Qt Designer `.ui` workflow**: compile `.ui` forms ahead of time (`pyside6-uic form.ui -o ui_form.py` or `pyuic6`) for static typing and fast startup rather than runtime `QUiLoader` loading in packaged apps. **Never hand-edit generated `ui_*.py` files**—compose or subclass them (`self.ui = Ui_MainWindow(); self.ui.setupUi(self)`) so re-running `uic` never overwrites behavior. Inside Designer, always attach layout managers (`QVBoxLayout`/`QGridLayout`) and avoid pasting global QSS into root dialogs.

## Python desktop anti-lazy guard (`Tkinter` / `CustomTkinter` / `Dear PyGui`)

- **Do not default to plain `Tkinter` / `ttk` on greenfield Python desktop apps**: plain `Tkinter` ships dated widget chrome, inconsistent fractional HiDPI scaling, weak dark/high-contrast OS synchronization, and thin accessibility tooling. On greenfield projects, choose **PySide6 / Qt Quick**, **Flet**, **NiceGUI** (native mode), **Tauri** (with a Python sidecar), or **Textual** (for keyboard-first terminal utilities) instead.
- **Brownfield maintenance rules (`CustomTkinter` & `Dear PyGui`)**: when maintaining an existing app that already depends on `CustomTkinter` or `Dear PyGui`:
  - **DPI & fonts**: enable OS DPI awareness on Windows, scale cleanly (`ctk.set_widget_scaling` / Dear PyGui `set_global_font_scale` + `dpg.add_font(...)` with a real TTF font instead of the default blurry bitmap font).
  - **Non-blocking worker threads**: never perform HTTP, SQL, or ML work inside button callbacks or the Dear PyGui render loop—run work in a background `threading.Thread` / `ThreadPoolExecutor` and marshal UI updates safely back to the main thread (`queue.Queue` polled via `root.after(...)` in CustomTkinter, or thread-safe `dpg.set_value(...)` in Dear PyGui).
  - **Theme sync & tokens**: sync `ctk.set_appearance_mode("System")` and centralize semantic `(light, dark)` color tuples or Dear PyGui `dpg.theme()` bindings rather than scattering raw hex values.
  - **Keyboard focus & accessibility honesty**: wire explicit `Tab` order and shortcuts, and label screen-reader testing honestly (`not-checked` / `waived` on GPU-drawn `Dear PyGui` viewports rather than claiming native UIA/VoiceOver parity).

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `QPalette` / `styleHints().colorScheme()` or Qt Quick Controls 2 (`FluentWinUI3`/`macOS`) | Apply massive global QSS that disables native platform styling and High Contrast |
| Compile `.ui` files via `pyside6-uic`/`pyuic6` and compose them in a separate controller class | Hand-edit generated `ui_*.py` files or hard-code pixel positions inside Qt Designer |
| Choose PySide6/QML, Flet, NiceGUI, Tauri, or Textual for greenfield Python apps | Default to plain `Tkinter` on greenfield Python desktop projects |
| Marshal worker results via `queue.Queue` + `after(...)` and load real TTF fonts in brownfield CustomTkinter/Dear PyGui | Block the Tkinter/Dear PyGui main loop with network calls or ship blurry bitmap defaults |
| Run `qmllint` / `qmltc` and QML singleton semantic tokens | Scatter raw hex strings and untyped dynamic JS lookups across QML files |
| Offload I/O to worker threads/async tasks and guard `closeEvent` on dirty docs | Block the Qt main event loop and freeze window repainting |
| Set `Accessible.name`/`role` and verify VoiceOver, Narrator, and Orca | Custom-paint interactive `QWidget` or `Item` surfaces with zero accessibility |

## Known traps

Global QSS breaking native Windows 11/macOS chrome and High Contrast, PySide6 Python GC prematurely collecting unparented `QObject`/worker references, GUI-thread blocking, missing `qmllint` hiding runtime QML reference errors, fractional DPI blur on raster icons (use SVG/high-DPI pixmaps), custom `QPainter` widgets invisible to screen readers, and unmarshaled Tkinter calls from background threads crashing the interpreter.

## Verification commands

```sh
# Run the test & build commands matching your project (PySide6/PyQt6 vs C++/QML):
python -m pytest
qmllint qml/
qmltestrunner -input tests/qml
cmake --build build
```

Test runners and `qmllint` provide `static` / logic evidence. Launch the real desktop app across Windows/macOS/Linux to verify native styles (`FluentWinUI3`/`macOS`), Dark & High Contrast modes, fractional HiDPI, keyboard-only Tab/mnemonic completion, screen readers, and dirty `closeEvent` flows for `rendered` evidence; label untested OSes `not-checked`.
