# MonoGame (C#)

## Token mapping

MonoGame has no standard high-level UI theme system. Centralize colors/fonts/spacing/scale in a semantic C# settings object and asset pipeline plan. Do not scatter raw `Color` literals across draw/update code.

## Layout and responsive idioms

Implement explicit layout regions/state scaling; handle backbuffer/window resize, aspect ratio, pixel-perfect versus scaled art, safe margins, mouse/touch/controller input. Separate HUD, menu, dialog, and world rendering layers.

## Typography/custom fonts

Use SpriteFont/font assets deliberately; validate glyph coverage/localization, scaling, hinting, measurement, and licensing. Fixed bitmap typography is a commitment with accessibility/localization costs.

## Motion/reduced motion

Game-loop motion must expose reduced-motion/flash options, respect pause/interruption, clamp frame spikes where appropriate, and avoid masking critical HUD state. Do not tie correctness to visual tween completion.

## Accessibility specifics

No meaningful built-in UI automation/focus system should be assumed. Keyboard/controller remapping, focus model, colorblind differentiation, subtitle/caption scaling/background, contrast, reduced flash/motion, and platform-specific accessibility integration are explicit engineering scope.

## States idiom

Use explicit state machines for loading/menu/pause/error/empty/death/network/settings/remap/interruption/resume. Preserve selection/focus across state transitions. Loading IO/asset failure needs visible recovery rather than crash-only behavior.

## Forms idiom

Text input is low-level. Validate caret/selection/clipboard/IME/platform keyboard behavior before using text fields. Prefer constrained menus where text is not essential. Remapping UI must detect conflicts/chords/multiple devices.

## Do/don't pairs

| Do | Don't |
|---|---|
| semantic theme object/assets | `Color.OrangeRed` hard-coded everywhere |
| explicit controller focus navigation | mouse-only hit testing in menus |
| resolution/aspect-aware layout | fixed pixel UI at one backbuffer size |
| scalable readable SpriteFont strategy | assuming bitmap font supports every locale |

## Known traps

No standard UI/accessibility layer, SpriteFont glyph limitations, input device complexity, scaling artifacts, state/focus loss, asset pipeline/platform differences, over-scoping custom UI engine.

## Verification commands

```sh
dotnet test
dotnet build
dotnet run --project <GameProject>
```

Run platform/input/resolution matrix, controller-only flow, localization glyph checks, pause/interruption/resume, reduced motion/flash settings, screenshots on target devices, packaging validation.
