# Flet

## Token mapping

Store semantic colors, spacing, and typography roles in a Python module and wire them into `page.theme` and `page.dark_theme` (`ft.Theme` + `ft.ColorScheme`) once rather than passing hex literals to every control. Flet 0.25–1.0 evolved rapidly (introducing declarative `@ft.component` + hooks in 1.0 alongside imperative `page.add` / `page.update` in 0.25–0.28); inspect the installed `flet` version before choosing constructor names.

```python
import flet as ft

class PcTokens:
    ACTION = "#0074CA"
    CONTROL_INLINE = 12

# Declarative idiom (Flet 1.0+):
@ft.component
def InvoiceActions(on_save):
    saving, set_saving = ft.use_state(False)
    return ft.SafeArea(
        ft.Column(
            spacing=PcTokens.CONTROL_INLINE,
            controls=[
                ft.FilledButton(
                    "Save invoice" if not saving else "Saving...",
                    disabled=saving,
                    on_click=lambda _: (set_saving(True), on_save()),
                ),
            ],
        )
    )

def main(page: ft.Page):
    page.adaptive = True  # renders Cupertino controls on iOS/macOS, Material on Android/Windows/Linux
    page.theme = ft.Theme(color_scheme_seed=PcTokens.ACTION)
    page.theme_mode = ft.ThemeMode.SYSTEM
    page.render(lambda: InvoiceActions(on_save=lambda: None))
```

## Layout, adaptive controls, & SafeArea

- Always wrap top-level mobile screens in **`ft.SafeArea(...)`** so notches, Dynamic Island, status bars, and gesture navigation bars do not clip content or bottom actions.
- Enable **`page.adaptive = True`** (or opt into `ft.CupertinoButton`, `ft.CupertinoNavigationBar`, `ft.CupertinoAlertDialog`, `ft.CupertinoSlidingSegmentedButton` explicitly on Apple targets) so iOS/macOS users do not receive foreign Material chrome.
- Handle window/viewport resizing (`page.on_resized`) explicitly because Flet renders via Flutter across iOS, Android, macOS, Windows, Linux, and Web—do not freeze one desktop wireframe across every target.

## Typography, motion, & reduced motion

Register custom font files via `page.fonts = {"Brand": "/fonts/Brand.ttf"}` and verify glyph coverage and fallback fonts on the actual target OS. Avoid fixed pixel `height` on text containers so localized or scaled copy does not clip.

Keep `animate`, `animate_opacity`, and `animate_position` durations brief and interruptible. Because system reduced-motion forwarding varies across Flutter/Flet hosts, expose an app-level reduced-motion toggle when animations carry motion and never use animation as the sole state cue.

## Accessibility, states, & forms idioms

Use real interactive controls (`FilledButton`, `IconButton`, `Switch`, `Checkbox`, `TextField`) with `tooltip`, `label`, and `semantics_label` (`ft.Semantics`) rather than wrapping styled `ft.Text` in `ft.GestureDetector` or clickable `ft.Container`. Verify keyboard Tab order and VoiceOver/TalkBack/Narrator output on the shipped platform.

Model async state (`loading`, `empty`, `error`, `offline`) explicitly via reactive state or page controls with cancellation and duplicate-submit guards—never launch untracked `asyncio.create_task` loops that mutate detached controls. In forms, pair `ft.TextField` with persistent `label`, `keyboard_type`, `error_text` validated after completion/submit, and draft preservation across `page.views` / route changes.

## Do/don't pairs

| Do | Don't |
|---|---|
| Centralize tokens in `page.theme` / `page.dark_theme` + `ft.SafeArea` | Scatter raw hex strings and forget safe-area padding on iOS/Android |
| Enable `page.adaptive = True` or `ft.Cupertino*` on Apple surfaces | Ship identical Material-only dialogs and controls to iOS users |
| Use real `ft.FilledButton` / `ft.IconButton` + `ft.Semantics` | Build primary actions from `ft.Container(on_click=...)` with no semantics |
| Track async tasks cleanly and guard against double-submit | Fire unawaited background coroutines that fail silently or race |
| Preserve form values in state across route transitions | Re-instantiate blank `ft.TextField` controls on every route push |

## Known traps

API differences between Flet 0.25–0.28 imperative apps and Flet 1.0 declarative `@ft.component` apps, forgetting `ft.SafeArea` on Android 15/16 edge-to-edge or notched iPhones, packaging failures in `flet build` when native Python C-extensions are not compiled for mobile ABIs, missing `page.update()` in imperative mode, unverified screen-reader trees on target OS.

## Verification commands

```sh
python -m compileall .
python -m pytest
# Interactive run and mobile/desktop packaging (requires Flutter SDK for flet build):
flet run app.py
flet build apk    # or: flet build ipa / flet build macos / flet build linux
```

`compileall` and `pytest` provide `static` / logic evidence only. Inspect actual `flet run` and packaged `flet build` outputs on target devices/OSes for safe areas, adaptive Cupertino/Material parity, dark mode, text scaling, and screen-reader behavior (`rendered`; label untested platforms `not-checked`).
