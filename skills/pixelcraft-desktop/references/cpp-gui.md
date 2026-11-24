# C++, C, & Zig desktop GUIs: Qt C++, JUCE, GTKmm, wxWidgets, FLTK 1.4, Dear ImGui, Nuklear, Ultralight, & Zig toolkits

**Boundary note**: use this reference for **C++ / C / Zig native toolchains** (CMake + Qt C++, JUCE, GTKmm, wxWidgets, FLTK 1.4, Dear ImGui, Nuklear, Ultralight, DVUI, Clay, raygui). For **Qt 6 / PySide6 / QML** styling rules, `styleHints.colorScheme`, Qt Quick Controls 2 (`FluentWinUI3`/`macOS`), `qmltc`, Kirigami, and the QSS native-style warning, read `references/qt-pyside-qml.md` alongside this file.

## Toolkit decision matrix

| Toolkit | Language | UI model | Strengths | Accessibility / IME reality |
|---|---|---|---|---|
| **Qt 6 (C++ / QML)** | C++ | Retained native/QML (`cmake`, `qmltc`) | Full enterprise desktop maturity, native styles, i18n, HiDPI | Mature `QAccessible` / UIA / NSAccessibility / AT-SPI + full IME |
| **JUCE** | C++ | Retained vector/GPU component tree for VST3/AU/CLAP/standalone audio | Realtime audio plugin & DAW industry standard, `APVTS`, `LookAndFeel`, scalable vector paths | Built-in `juce::AccessibilityHandler` (VoiceOver/Narrator/UIA)—must populate titles, descriptions, and focus order |
| **GTKmm (`gtkmm-4.0`)** | C++20 | Idiomatic RAII C++ bindings over GTK4 / `libadwaita` | Native Linux/Wayland craft, `Gtk::Builder`/Blueprint, zero raw GObject boilerplate | Full native AT-SPI screen-reader & IME parity (follow `references/gtk.md`) |
| **wxWidgets** | C++ | Native OS control wrapper (`wxSizer`) | True native Windows/macOS/GTK controls, small footprint | Strong via OS native controls; custom `wxPanel` drawing needs manual bridges |
| **FLTK 1.4** | C++ | Lightweight retained (`Fl_Flex`, `Fl_Grid`) | Tiny static binary, native **Wayland** backend, per-monitor **HiDPI** scaling | Basic keyboard nav; limited screen-reader exposure—verify before accessibility claims |
| **Dear ImGui** | C++ | Immediate-mode GPU (`ImGui::Begin`) | Unmatched speed for game/engine/DSP debuggers and in-app tools | No built-in screen-reader tree; low-level IME—not for screen-reader-mandated apps |
| **Nuklear** | ANSI C (single-header) | Immediate-mode renderer-agnostic (`nk_begin`) | Tiny zero-dep C footprint for embedded tools and custom GPU engines | No built-in screen-reader tree or complex IME; dev/embedded scope only |
| **Ultralight** | C++ + HTML/CSS/JS | Lightweight commercial WebKit-derived renderer | Smaller footprint than Chromium/Electron for custom C++ apps & game UI | Commercial license; verify IME/screen-reader support per target OS before productivity use |
| **DVUI** | Zig | Immediate-mode native (`dvui` over SDL/Raylib/Web) | Zero-bloat Zig ergonomics, retained scroll/text state, HiDPI, single binary | Basic keyboard focus; limited native screen-reader bridge (verify/label `not-checked`) |
| **Clay** | C (single-header) | Zero-allocation Flexbox layout engine (renderer-agnostic) | Microsecond deterministic layout for C/C++/Zig/WASM custom renderers | Layout only—you own widget semantics, text shaping, focus, and accessibility |
| **raygui** | C | Immediate-mode UI over Raylib | Rapid prototyping of Raylib level editors, audio tools, dev overlays | Dev-tool focus; no native OS accessibility or complex IME |

## JUCE (VST3 / AU / CLAP audio plugins & DAW UI)

Audio UIs have a hard real-time constraint: glitches on the audio thread ruin recordings.

- **Strict audio-thread vs message-thread separation**: NEVER allocate heap memory, acquire a `std::mutex`, lock the `MessageManager`, or call `repaint()` inside `processBlock()`. Bind controls via **`juce::AudioProcessorValueTreeState` (`APVTS`)** attachments (`SliderAttachment`, `ButtonAttachment`, `ComboBoxAttachment`), exchange meter levels via `std::atomic<float>` polled on a `juce::Timer` (30–60 Hz), and stream waveforms/spectra across lock-free `juce::AbstractFifo` ring buffers.
- **Custom `LookAndFeel` & cleanup**: centralize semantic palette tokens in a `juce::LookAndFeel_V4` subclass (`setColour(...)`), draw knobs/meters with resolution-independent `juce::Path` vectors for crisp HiDPI scaling, and **always call `setLookAndFeel(nullptr)` in the editor destructor** before destroying the LookAndFeel member (dangling `LookAndFeel*` asserts/crashes on close).
- **Resizing & host DAW scaling**: enable `setResizable(true, true)` + `setResizeLimits(minW, minH, maxW, maxH)` and compute child bounds in `resized()` using `juce::FlexBox` / `juce::Grid` / `Rectangle::removeFromTop(...)` rather than fixed coordinates.
- **Keyboard & accessibility**: set `setTitle(...)`, `setDescription(...)`, `setWantsKeyboardFocus(true)`, and expose custom controls through `juce::AccessibilityHandler` (value + units, e.g., `-6.0 dB`) so VoiceOver/Narrator users can operate plugin parameters in DAWs.

```cpp
// JUCE AudioProcessorEditor: lock-free APVTS attachment, LookAndFeel lifecycle, & a11y metadata
class GainEditor final : public juce::AudioProcessorEditor {
public:
    GainEditor(GainProcessor& proc, juce::AudioProcessorValueTreeState& apvts)
        : AudioProcessorEditor(&proc), apvts_(apvts) {
        setLookAndFeel(&laf_);
        gainSlider_.setSliderStyle(juce::Slider::RotaryHorizontalVerticalDrag);
        gainSlider_.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 72, 22);
        gainSlider_.setTitle("Output Gain");
        gainSlider_.setDescription("Adjusts output level in decibels");
        gainSlider_.setWantsKeyboardFocus(true);
        addAndMakeVisible(gainSlider_);
        gainAttachment_ = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
            apvts_, "gainDb", gainSlider_);

        setResizable(true, true);
        setResizeLimits(320, 220, 960, 660);
        setSize(420, 280);
    }

    ~GainEditor() override {
        setLookAndFeel(nullptr); // Mandatory before laf_ is destroyed
    }

    void resized() override {
        gainSlider_.setBounds(getLocalBounds().reduced(24));
    }

private:
    StudioLookAndFeel laf_;
    juce::AudioProcessorValueTreeState& apvts_;
    juce::Slider gainSlider_;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> gainAttachment_;
};
```

## Token mapping & idiomatic snippets

Centralize semantic theme values once—never scatter raw RGB integers through paint or frame callbacks:

- **Qt C++**: bind semantic tokens via `QPalette` / QML `pragma Singleton` (avoid massive global QSS that strips native styles; see `references/qt-pyside-qml.md`).
- **GTKmm (`gtkmm-4.0`)**: load semantic CSS variables via `Gtk::CssProvider`, pair with `libadwaita` adaptive widgets (`Adw::NavigationSplitView`, `Adw::Dialog`), and rely on RAII `Gtk::make_managed<T>()` + `sigc::trackable` so disconnected signals never dangle.
- **wxWidgets**: query `wxSystemSettings::GetColour(...)` and `GetAppearance().IsDark()` so native dark/high-contrast themes stay intact.
- **FLTK 1.4**: compose responsive layouts with **`Fl_Flex`** and **`Fl_Grid`** (introduced in 1.4 alongside native Wayland and per-monitor scaling) rather than fixed pixel coordinates.
- **Nuklear & Ultralight**: in **Nuklear**, drive colors from a central `nk_style` table and bake Unicode font ranges into `nk_font_atlas`; in **Ultralight**, keep HTML/CSS tokens in local bundled assets (`FileSystem`), validate C++↔JS bridge calls, pass OS display scale cleanly, and check licensing before commercial use.
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

- Use **Qt layouts**, **JUCE `FlexBox`/`Grid`**, **GTKmm boxes/grids**, **wxWidgets sizers** (`wxBoxSizer`/`wxFlexGridSizer`), **FLTK 1.4 `Fl_Flex`/`Fl_Grid`**, or **Clay** Flexbox declarations—never hard-code pixel rectangles assuming 96 DPI.
- Verify font loading and glyph coverage explicitly: Qt, GTKmm, JUCE, and wxWidgets inherit OS text shaping/fallbacks, whereas **Dear ImGui**, **Nuklear**, **raygui**, and custom **Clay** renderers require explicit font-atlas glyph ranges (Latin, Cyrillic, CJK, symbols) or missing characters render as `?`/tofu.
- Avoid draining laptop batteries in immediate-mode loops (**Dear ImGui**, **Nuklear**, **DVUI**, **raygui**): wait on OS input/window events (`SDL_WaitEventTimeout` / `glfwWaitEventsTimeout`) when idle instead of spinning an uncapped 120 FPS render loop. Expose an app-level reduced-motion toggle where OS preference hooks are absent.

## Accessibility, states, & forms idioms

- Choose **Qt 6**, **GTKmm**, **wxWidgets**, or **JUCE** (for audio) when full screen-reader support (VoiceOver/Narrator/Orca), complex CJK/RTL IME composition, and High Contrast compliance are mandatory.
- For immediate-mode/lightweight C/C++/Zig toolkits (**Dear ImGui**, **Nuklear**, **FLTK**, **DVUI**, **Clay**, **raygui**), be honest about accessibility boundaries: either integrate **AccessKit** (C ABI `accesskit-c`) and verify live screen-reader output, or scope the UI strictly to dev/engineering/embedded tooling and record screen-reader verification accurately (`not-checked` / `waived` per project floor).
- Keep durable document state, dirty-close checks, and cancellable background worker threads outside frame/paint loops, marshaling completion back to the UI thread safely (`QMetaObject::invokeMethod`, `wxQueueEvent`, `Fl::awake`, `juce::MessageManager::callAsync`, or lock-free queues).

## Do/don't pairs

| Do | Don't |
|---|---|
| Bind JUCE UI controls via `APVTS` attachments / atomics + `Timer`, and call `setLookAndFeel(nullptr)` in `~Editor()` | Touch `juce::Component`, allocate memory, or lock mutexes inside `processBlock()`, or leak `LookAndFeel*` |
| Use Qt layouts, JUCE `FlexBox`/`Grid`, GTKmm containers, `wxSizer`, FLTK 1.4 `Fl_Flex`/`Fl_Grid`, or Clay Flexbox | Hard-code fixed pixel coordinates for one 1080p monitor |
| Wait on OS events when idle in Dear ImGui / Nuklear / DVUI / raygui | Spin an uncapped `while (true)` GPU loop burning battery while idle |
| Choose Qt 6, GTKmm, wxWidgets, or JUCE `AccessibilityHandler` (or bridge `accesskit-c`) for accessible apps | Ship a raw Dear ImGui, Nuklear, or raygui form and claim screen-reader compliance |
| Marshal background worker completion safely (`Fl::awake`, `wxQueueEvent`, `invokeMethod`, `callAsync`) | Mutate UI widgets directly from worker or realtime audio threads |
| Load explicit Unicode/CJK/RTL glyph ranges or HarfBuzz shaping in GPU font atlases | Rely on default ASCII-only bitmap font atlases for localized apps |

## Known traps

Audio-thread allocations or mutex locks in JUCE `processBlock()`, dangling `LookAndFeel*` on JUCE editor teardown, dangling `QObject`/widget pointers across threads, uncapped immediate-mode GPU frame loops, missing glyph ranges in ImGui/Nuklear/raygui font atlases, FLTK 1.3 vs 1.4 confusion, Ultralight commercial-licensing oversight, ABI/CRT linkage mismatches on packaging, and claiming accessibility for immediate-mode canvas tools without testing VoiceOver/Narrator/Orca.

## Verification commands

```sh
# C++ (CMake — Qt, JUCE, GTKmm, wxWidgets, FLTK, ImGui):
cmake --build build
ctest --test-dir build --output-on-failure
./build/<app>
# Zig (DVUI / Clay):
zig build test
zig build run
```

Build and test suites provide `static` / logic evidence. Run native binaries (and for JUCE plugins, host DAW validation such as `pluginval` across AU/VST3/CLAP) on each shipped OS across Wayland/X11/Windows/macOS fractional HiDPI scaling, resize/minimum bounds, idle CPU/GPU power draw, keyboard traversal, screen readers (where supported), and dirty-close recovery for `rendered` evidence; label untested OSes and unsupported assistive-tech surfaces `not-checked`.
