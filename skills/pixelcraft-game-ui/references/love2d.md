# LÖVE2D (Lua)

## Token mapping

Centralize palette, typography, spacing, and scale tokens in a Lua module (`theme.lua`) rather than scattering raw RGB tables across `love.draw()`. Preload fonts and glyph atlases deliberately in `love.load()` or on `love.resize()`.

## Layout, `love.window.getSafeArea()`, and Lua UI libraries

LÖVE2D is immediate-mode drawing with no built-in retained UI framework. Compute HUD bounds inside **`love.window.getSafeArea()`** (which returns usable `x, y, w, h` excluding mobile notches, Dynamic Island, and TV overscan) and recompute on `love.resize(w, h)`:

```lua
local ui = { safe = { x = 0, y = 0, w = 1280, h = 720 }, inputDevice = "kbm" }

function ui.updateSafeArea()
  local x, y, w, h = love.window.getSafeArea()
  ui.safe.x, ui.safe.y, ui.safe.w, ui.safe.h = x, y, w, h
end

function ui.detectGlyphFamily(joystick)
  local name = (joystick:getName() or ""):lower()
  if name:find("dualsense") or name:find("dualshock") or name:find("ps[45]") then
    return "playstation"
  elseif name:find("nintendo") or name:find("switch") or name:find("joy%-con") then
    return "nintendo"
  elseif name:find("steam") then
    return "steamdeck"
  end
  return "xbox"
end

function love.gamepadpressed(joystick, _button)
  ui.inputDevice = ui.detectGlyphFamily(joystick)
end

function love.keypressed(_key)
  ui.inputDevice = "kbm"
end
```

When you need ready-made widgets instead of hand-drawn rects:

- **SUIT**: lightweight immediate-mode Lua widgets (`suit.Button`, `suit.Slider`, `suit.Input`) with minimal runtime footprint;
- **Slab**: ImGui-style retained debug/tool/settings windows in pure Lua (ideal for simulation HUDs, editors, and dev consoles);
- **FlexLove**: Flexbox-inspired responsive layout and styling in LÖVE for complex multi-resolution menus.

None of these provide automatic OS screen-reader semantics or console focus graphs—wire explicit keyboard/gamepad focus, focus restoration across state pops, and glyph swapping yourself.

## Typography, motion, accessibility, and states

- Use `love.graphics.newFont(path, size, hinting, dpiscale)` with explicit DPI scaling (`love.window.getDPIScale()`) and verify fallback/glyph coverage for non-Latin locales; pixel fonts need integer scaling to avoid shimmer.
- Clamp `dt` (`math.min(dt, 0.05)`), decouple game state from tween completion, and expose reduced-motion and flash-intensity sliders.
- Implement dynamic gamepad glyph detection via `love.joystickadded` / `love.gamepadpressed` + `joystick:getName()` (plus a manual glyph-style override in Settings for Steam Input or third-party controllers), and debounce stick drift so prompts do not flicker between controller and mouse.
- Use explicit state stacks (HUD / Pause / Settings / Remap / Loading / Error) that preserve selected index on push/pop; test `love.textinput` IME/virtual-keyboard limits before relying on freeform text forms.

## Do/don't pairs

| Do | Don't |
|---|---|
| Central `theme.lua` semantic palette and DPI-scaled fonts | Literal `{1, 0.2, 0.2}` RGB tables scattered through `love.draw()` |
| Layout HUD inside `love.window.getSafeArea()` and recompute on `love.resize` | Hard-code 1920×1080 coordinates that clip on notches or ultrawide displays |
| Swap prompt glyphs dynamically via `joystick:getName()` / last input event + Settings override | Hard-code `"Press E"` or Xbox-only prompts for PlayStation/Switch/Steam Deck players |
| Explicit keyboard/gamepad focus stack + reduced-flash/motion toggles | Mouse-only hitboxes or uncontrolled screen-shake/particles behind HUD text |

## Known traps

No built-in screen-reader/focus infrastructure, `dpiscale` blurry text on macOS/Retina displays, joystick analog drift flickering KBM/gamepad prompts, font glyph gaps in localized text, unbounded `dt` breaking tweens after alt-tab, and blocking asset loads freezing the loop.

## Verification commands

Run your configured linter without suppressing exit codes, then launch the game runtime:

```sh
luacheck .
love .
```

Test window resize, HiDPI scaling, safe-area inset simulation, controller-only menu traversal, gamepad/KBM prompt hot-swapping, localization glyph checks, and pause/interruption flows (`rendered`; label missing screen-reader integration honestly as `not-checked` / unsupported).
