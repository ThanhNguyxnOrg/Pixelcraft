# Rust GUI: egui, Slint, Dioxus, iced

These frameworks have different rendering/state models. Do not treat “Rust GUI” as one platform.

## Token mapping

- egui: use semantic Rust constants/context style (`egui::Style`, `Visuals`) deliberately; immediate-mode styling can be set globally but inspect scope.
- Slint: use `.slint` global singletons/exported structs/palette-like properties for semantic values.
- Dioxus desktop: use generated CSS variables/web idioms plus desktop shell integration.
- iced: use theme/palette structs and semantic application constants.

Never smuggle raw repeated hex values into widgets because no dominant CSS layer exists.

## Layout and responsive idioms

- egui: immediate-mode layout is frame-local; explicit sizing/panels/columns/scroll areas matter.
- Slint: declarative layouts/constraint-like behavior and component reuse; verify resizing/high-DPI.
- Dioxus: web layout plus desktop window behavior.
- iced: Elm-like layout/widgets; pane/scroll/fill/shrink semantics must be explicit.

Handle resize/minimum size/high-DPI/window state/platform chrome separately from widget styling.

## Typography/custom fonts

Register/load fonts per framework/target and verify glyph fallback, scaling, localization, bitmap/vector rendering, and DPI behavior. Dense custom GUI often underinvests in font fallback—treat it as a floor issue.

## Motion/reduced motion

Implement motion intentionally per framework. Reduced-motion support is inconsistent; expose app-level reduced-motion setting when platform integration is uncertain. Never use continuous repaints/animation loops without lifecycle/power consideration.

## Accessibility specifics

Accessibility maturity varies sharply by framework/version/platform. Use semantic labels/roles where exposed, keyboard/focus navigation, platform integration, high-contrast/system theme awareness, and verify screen reader behavior honestly. Custom GPU/immediate-mode UI must not claim accessibility it has not implemented/tested.

## States idiom

Make application state explicit. Long-running work belongs in async/thread/task ownership with cancellation/progress/error propagation. Handle file permission/dirty state/offline/window close/update/crash recovery. Immediate-mode repaint state is not automatically durable application state.

## Forms idiom

Use real text input/control widgets where available; validate focus order, clipboard/paste/IME behavior, validation timing, input preservation, and error recovery. Custom text input is expensive to make correct—avoid unless essential.

## Do/don't pairs

| Do | Don't |
|---|---|
| use the framework's real button/text input primitives | hand-drawn clickable/text widgets without semantics |
| explicit async/cancel/error state | blocking or silently failing background work |
| semantic theme singleton/palette | raw color literals scattered through widgets |
| power-aware repaint/animation policy | continuous repaint loop for decorative motion |
| verify keyboard/screen reader per framework | claiming accessibility because Rust code compiles |

## Known traps

Accessibility gaps, IME/clipboard complexity, continuous repaint/power usage, async lifetime/cancellation bugs, font fallback/GPU rendering differences, high-DPI scaling, platform packaging/window chrome mismatch, immediate-mode state persistence confusion.

## Verification commands

```sh
cargo test
cargo clippy -- -D warnings 2>/dev/null || true
cargo run
```

Use actual OS/device runs, keyboard/focus/screen-reader inspection where supported, resize/DPI/power behavior, close/crash/update flows, and framework-specific screenshots/golden tests where present.
