# Kivy & KivyMD

## Token mapping & density units (`dp` / `sp`)

Encode semantic colors, spacing, and typography scales once in Python and KV rather than scattering raw normalized RGBA tuples `(0.0, 0.455, 0.792, 1)` across screens. Always measure layout dimensions in density-independent **`dp`** and text in scale-independent **`sp`** from `kivy.metrics`:

```python
from kivy.metrics import dp, sp
from kivymd.app import MDApp
from kivymd.uix.button import MDButton, MDButtonText
from kivymd.uix.boxlayout import MDBoxLayout

class PcTokens:
    CONTROL_INLINE = dp(12)
    MIN_TOUCH_TARGET = dp(48)
    BODY_SIZE = sp(16)

class InvoiceApp(MDApp):
    def build(self):
        self.theme_cls.theme_style = "Dark"  # switchable Light / Dark
        self.theme_cls.primary_palette = "Blue"
        root = MDBoxLayout(orientation="vertical", padding=PcTokens.CONTROL_INLINE, spacing=dp(8))
        root.add_widget(
            MDButton(
                MDButtonText(text="Save invoice"),
                style="filled",
                size_hint=(None, None),
                height=PcTokens.MIN_TOUCH_TARGET,
            )
        )
        return root
```

For apps targeting Material Design 3 aesthetics and structured mobile widgets, use **KivyMD 2.x** (`MDApp`, `MDButton`, `MDTextField`, `MDNavigationBar`, `MDTopAppBar`, `theme_cls.theme_style`, `theme_cls.primary_palette`) instead of hand-styling low-level Kivy `Button` canvases.

## Layout and responsive idioms

Use `BoxLayout`, `GridLayout`, `AnchorLayout`, `RecycleView` (for virtualized long lists—never add hundreds of rows directly into a `ScrollView`), `size_hint`, and `dp`/`sp` metrics. Recompute custom `canvas` instructions on `pos`/`size` bindings so resizing, rotation, and foldable transitions never leave stale geometry. Account for system bars and mobile keyboard height (`Window.softinput_mode = "below_target"` or `"pan"`).

## Typography, motion, & reduced motion

Register custom TTF/OTF fonts via `LabelBase.register(...)` and verify glyph coverage for every target locale (Kivy does not automatically cascade OS fallback fonts cleanly for CJK/RTL/emoji without explicit shaping/font config—verify HarfBuzz/Pango text provider where RTL or complex scripts matter).

Use `kivy.animation.Animation` sparingly and call `Animation.cancel_all(widget)` on screen exit (`on_leave`). Because Kivy does not automatically mirror OS reduced-motion preferences across all platforms, expose an in-app reduced-motion toggle and never rely on animation as the only status cue.

## Accessibility, states, & forms idioms

**Honest accessibility limit**: Kivy's OpenGL/canvas widget tree has minimal built-in screen-reader (TalkBack/VoiceOver/Narrator) integration compared to native SwiftUI, Jetpack Compose, or Flutter. Treat screen-reader compliance as `not-checked` or unsupported until explicitly bridged and verified on device; enforce explicit keyboard focus (`FocusBehavior`), ≥ `48 dp` touch targets, high contrast, and text+icon (non-color-only) state encoding.

Own state via Kivy `Property` bindings (`StringProperty`, `BooleanProperty`, `ListProperty`) so UI updates stay reactive. Cancel `Clock.schedule_*` callbacks on screen leave and marshal background-thread results onto the main thread with `@mainthread` or `Clock.schedule_once`. Preserve form drafts across `ScreenManager` transitions and verify mobile soft-keyboard occlusion and paste behavior on real devices.

## Mobile packaging: Buildozer & `kivy-ios`

- **Android (`Buildozer` / `python-for-android`)**: pin `android.api` / `android.minapi` / `android.ndk`, target `arm64-v8a` (required by Google Play), list every pure-Python and compiled recipe explicitly in `buildozer.spec` (`requirements = python3,kivy,kivymd,...`), declare runtime permissions truthfully, and test APK/AAB size and cold-start time on real Android hardware.
- **iOS (`kivy-ios`)**: compile Python and native recipes via `toolchain build python3 kivy ...`, generate the Xcode project via `toolchain create`, and verify iOS privacy manifests, code signing, safe-area insets, and background audio/network suspension inside Xcode on a real iPhone.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `dp()` / `sp()` metrics and `RecycleView` for long lists | Hard-code raw pixels or dump 500 widgets into a `ScrollView` |
| Use KivyMD 2.x `MDApp` / `theme_cls` for Material 3 mobile UI | Hand-draw buttons with raw `canvas` rectangles and touch math |
| Marshal worker results via `@mainthread` and cancel `Clock` jobs in `on_leave` | Mutate Kivy widgets directly from a Python background thread |
| Set `Window.softinput_mode` and test keyboard occlusion on device | Assume desktop window layout works when the Android IME opens |
| Disclose Kivy's screen-reader limitations honestly | Claim VoiceOver/TalkBack compliance from a desktop launch |

## Known traps

Missing CJK/RTL/emoji font glyphs without HarfBuzz/Pango text provider, `canvas` instructions not bound to `pos`/`size`, mutating graphics from background threads causing GL crashes, Buildozer NDK/recipe version conflicts for C-extension packages, `kivy-ios` missing iOS privacy manifest or safe-area handling, keyboard hiding `TextInput` fields, uncancelled `Clock` timers leaking screens.

## Verification commands

```sh
python -m compileall .
python -m pytest
python main.py
# Android / iOS packaging (run on configured Linux/macOS build hosts):
buildozer android debug
toolchain build python3 kivy
```

`compileall` and `pytest` provide `static` / logic evidence. Run the packaged app on actual Android/iOS/desktop targets across resize, soft-keyboard input, dark/light theme, and cold-start packaging checks for `rendered` evidence; mark untested mobile targets and screen-reader parity `not-checked`.
