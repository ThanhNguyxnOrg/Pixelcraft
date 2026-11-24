# C++, C, & Zig desktop GUIs: Qt C++, wxWidgets, FLTK 1.4, Dear ImGui, & lightweight C/Zig toolkits

**Boundary note**: use this reference for **C++ / C / Zig native toolchains** (CMake + Qt C++, wxWidgets, FLTK 1.4, Dear ImGui, DVUI, Clay, raygui). For **Qt 6 / PySide6 / QML** styling rules, `styleHints.colorScheme`, Qt Quick Controls 2 (`FluentWinUI3`/`macOS`), `qmltc`, Kirigami, and the QSS native-style warning, read `references/qt-pyside-qml.md` alongside this file.

## Toolkit decision matrix

| Toolkit | Language | UI model | Strengths | Accessibility / IME reality |
|---|---|---|---|---|
| **Qt 6 (C++ / QML)** | C++ | Retained native/QML (`cmake`, `qmltc`) | Full enterprise desktop maturity, native styles, i18n, HiDPI | Mature `QAccessible` / UIA / NSAccessibility / AT-SPI + full IME |
| **wxWidgets** | C++ | Native OS control wrapper (`wxSizer`) | True native Windows/macOS/GTK controls, small footprint | Strong via OS native controls; custom `wxPanel` drawing needs manual bridges |
| **FLTK 1.4** | C++ | Lightweight retained (`Fl_Flex`, `Fl_Grid`) | Tiny static binary, native **Wayland** backend, per-monitor **HiDPI** scaling | Basic keyboard nav; limited screen-reader exposure—verify before accessibility claims |
| **Dear ImGui** | C++ | Immediate-mode GPU (`ImGui::Begin`) | Unmatched speed for game/engine/DSP debuggers and in-app tools | No built-in screen-reader tree; low-level IME—not for screen-reader-mandated apps |
| **DVUI** | Zig | Immediate-mode native (`dvui` over SDL/Raylib/Web) | Zero-bloat Zig ergonomics, retained scroll/text state, HiDPI, single binary | Basic keyboard focus; limited native screen-reader bridge (verify/label `not-checked`) |
| **Clay** | C (single-header) | Zero-allocation Flexbox layout engine (renderer-agnostic) | Microsecond deterministic layout for C/C++/Zig/WASM custom renderers | Layout only—you own widget semantics, text shaping, focus, and accessibility |
| **raygui** | C | Immediate-mode UI over Raylib | Rapid prototyping of Raylib level editors, audio tools, dev overlays | Dev-tool focus; no native OS accessibility or complex IME |

## Token mapping & idiomatic snippets

Centralize semantic theme structs/palettes once—never scatter raw RGB integers through paint or frame callbacks:

- **Qt C++**: bind semantic tokens via `QPalette` / QML `pragma Singleton` (avoid massive global QSS that strips native styles; see `references/qt-pyside-qml.md`).
- **wxWidgets**: query `wxSystemSettings::GetColour(...)` and `GetAppearance().IsDark()` so native dark/high-contrast themes stay intact.
- **FLTK 1.4**: compose responsive layouts with **`Fl_Flex`** and **`Fl_Grid`** (introduced in 1.4 alongside native Wayland and per-monitor scaling) rather than fixed pixel coordinates.
- **DVUI (Zig)**: read semantic colors from `dvui.themeGet()` and build responsive rows cleanly without manual pixel math:

```zig
// Zig + DVUI responsive row using active theme tokens:
var hbox = try dvui.box(@src(), .horizontal, .{ .expand = .horizontal });
defer hbox.deinit();

if (try dvui.button(@src(), "Save invoice", .{}, .{
    .color_fill = dvui.themeGet().color_accent,
})) {
    try saveInvoice();
}
```

## Layout, typography, & power-aware motion

- Use **Qt layouts**, **wxWidgets sizers** (`wxBoxSizer`/`wxFlexGridSizer`), **FLTK 1.4 `Fl_Flex`/`Fl_Grid`**, or **Clay** Flexbox declarations—never hard-code pixel rectangles assuming 96 DPI.
- Verify font loading and glyph coverage explicitly: Qt and wxWidgets inherit rich OS text shaping/fallbacks, whereas **Dear ImGui**, **raygui**, and custom **Clay** renderers require explicit font-atlas glyph ranges (Latin, Cyrillic, CJK, symbols) or missing characters render as `?`/tofu.
- Avoid draining laptop batteries in immediate-mode loops (**Dear ImGui**, **DVUI**, **raygui**): wait on OS input/window events (`SDL_WaitEventTimeout` / `glfwWaitEventsTimeout`) when idle instead of spinning an uncapped 120 FPS render loop. Expose an app-level reduced-motion toggle where OS preference hooks are absent.

## Accessibility, states, & forms idioms

- Choose **Qt 6** or **wxWidgets** when full screen-reader support (VoiceOver/Narrator/Orca), complex CJK/RTL IME composition, and High Contrast compliance are mandatory.
- For immediate-mode/lightweight C/C++/Zig toolkits (**Dear ImGui**, **FLTK**, **DVUI**, **Clay**, **raygui**), be honest about accessibility boundaries: either integrate **AccessKit** (C ABI `accesskit-c`) and verify live screen-reader output, or scope the UI strictly to dev/engineering/embedded tooling and record screen-reader verification accurately (`not-checked` / `waived` per project floor).
- Keep durable document state, dirty-close checks, and cancellable background worker threads outside frame/paint loops, marshaling completion back to the UI thread safely (`QMetaObject::invokeMethod`, `wxQueueEvent`, `Fl::awake`, or lock-free queues).

## Do/don't pairs

| Do | Don't |
|---|---|
| Use Qt layouts, `wxSizer`, FLTK 1.4 `Fl_Flex`/`Fl_Grid`, or Clay Flexbox | Hard-code fixed pixel coordinates for one 1080p monitor |
| Wait on OS events when idle in Dear ImGui / DVUI / raygui | Spin an uncapped `while (true)` GPU loop burning battery while idle |
| Choose Qt 6 or wxWidgets (or bridge `accesskit-c`) for accessible productivity apps | Ship a raw Dear ImGui or raygui form and claim screen-reader compliance |
| Marshal background worker completion safely (`Fl::awake`, `wxQueueEvent`, `invokeMethod`) | Mutate UI widgets directly from worker `std::thread`s |
| Load explicit Unicode/CJK/RTL glyph ranges or HarfBuzz shaping in GPU font atlases | Rely on default ASCII-only bitmap font atlases for localized apps |

## Known traps

Dangling `QObject`/widget pointers or signals across threads, uncapped immediate-mode GPU frame loops, missing glyph ranges in ImGui/raygui font atlases, FLTK 1.3 vs 1.4 confusion (missing Wayland/HiDPI/`Fl_Flex` on 1.3), ABI/CRT linkage mismatches on Windows/Linux packaging, claiming accessibility for immediate-mode canvas tools without testing VoiceOver/Narrator/Orca.

## Verification commands

```sh
# C++ (CMake):
cmake --build build
ctest --test-dir build --output-on-failure
./build/<app>
# Zig (DVUI / Clay):
zig build test
zig build run
```

Build and test suites provide `static` / logic evidence. Run native binaries on each shipped OS across Wayland/X11/Windows/macOS fractional HiDPI scaling, resize/minimum bounds, idle CPU/GPU power draw, keyboard traversal, screen readers (where supported), and dirty-close recovery for `rendered` evidence; label untested OSes and unsupported assistive-tech surfaces `not-checked`.
