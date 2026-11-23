# LÖVE2D (Lua)

## Token mapping

Centralize palette/type/scale in a Lua module. Return semantic values, not raw constants scattered through draw calls. Fonts/images are runtime assets; preload intentionally.

## Layout and responsive idioms

LÖVE is immediate-mode drawing with no built-in retained UI system. Define layout regions mathematically, handle `love.resize`, pixel scale/aspect, safe margins, keyboard/gamepad/touch differences. Separate HUD/state/menu layers.

## Typography/custom fonts

Use `love.graphics.newFont`/font assets with explicit sizes and fallback/licensing. Bitmap/pixel fonts must remain legible when scaled; validate glyph coverage for localization.

## Motion/reduced motion

All motion is game-loop owned. Provide reduced-motion/flash-intensity options, decouple critical state from tween completion, clamp delta time where needed, and avoid visual noise behind critical HUD.

## Accessibility specifics

There is no built-in screen-reader/focus system. Keyboard/gamepad remapping, colorblind-safe encoding, scalable text/contrast/subtitle presentation, input remapping, and reduced-flash/motion options are manual responsibilities. Do not claim platform accessibility integration that does not exist.

## States idiom

Use explicit state machines for loading/menu/pause/error/empty inventory/death/network/permission/cutscene/resume. Preserve focus/selection across push-pop state transitions. Loading must not freeze frame presentation without feedback.

## Forms idiom

`love.textinput`/`love.keyboard` are low-level. Validate focus, IME/composition limitations, paste behavior, caret/selection, virtual keyboard/platform constraints before using consequential text input. Prefer constrained selection UI where appropriate.

## Do/don't pairs

| Do | Don't |
|---|---|
| central `theme.lua` semantic palette | literal RGB tables in every draw call |
| explicit gamepad/keyboard focus model | mouse-only clickable hitboxes |
| `love.resize` adaptive layout | fixed 1920×1080 coordinate assumptions |
| reduced flash/motion options | uncontrolled particle noise behind HUD |

## Known traps

No built-in accessibility/UI semantics, glyph atlas gaps, coordinate scaling mistakes, input method complexity, delta-time-dependent motion bugs, focus loss between states, asset loading freezes.

## Verification commands

```sh
luacheck . 2>/dev/null || true
love .
```

Run resolution/aspect/input matrix, controller-only flow, resize/window mode, localization glyph checks, pause/interruption/resume, reduced motion/flash settings, screenshots on target devices.
