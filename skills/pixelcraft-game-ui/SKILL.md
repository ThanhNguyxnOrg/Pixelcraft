---
name: pixelcraft-game-ui
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into game interfaces across Unity UI Toolkit, Unity uGUI/TextMeshPro, Godot Control/UI (GDScript/C#), Unreal UMG/CommonUI/MVVM, Bevy, LÖVE2D, MonoGame, Phaser/PixiJS/Kaplay, Ebitengine, Macroquad, Flame, Pygame/Arcade, NoesisGUI/RmlUi/Gameface/Dear ImGui, and Raylib/SDL3/Defold/Cocos. Use for HUDs, menus, inventory, controller/keyboard navigation, dynamic input glyphs, focus order, safe areas, HDR/ultrawide HUDs, subtitles, accessibility options, localization, legibility at distance, and game UI verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft game UI

Use this skill when UI lives inside or around a game loop. Game UI must remain legible under motion, stress, distance, controller input, variable aspect ratios, localization expansion, and platform certification expectations.

## Surface craft

Separate always-needed survival information from inspect-on-demand stats. Preserve HUD anchors across resolution and safe-area changes; teach an action with its current input glyph, not a hard-coded device prompt. Test in motion against changing scene luminance, after swapping input, and from the target viewing distance. Do not infer readability from a paused screenshot.

## Detection signals

Unity `ProjectSettings/`, `.unity`, UXML/USS/UI Builder or uGUI `Canvas`/`TextMeshPro` assets; Godot `project.godot`, `.tscn`, `.gd`/`.cs`, Control/Theme resources; Unreal `.uproject`, UMG/CommonUI/MVVM widget assets and Slate; Rust `bevy`/`macroquad` (`Cargo.toml`); Go `ebiten`/`ebitenui` (`go.mod`); Flutter `flame` (`pubspec.yaml`); Python `pygame`/`pygame_gui`/`arcade`; LÖVE2D (`conf.lua`, `main.lua`); MonoGame (`.csproj`, Gum/Myra/FontStashSharp); Phaser/PixiJS/Excalibur/Kaplay (`package.json`); NoesisGUI (`.xaml`), RmlUi (`.rml`/`.rcss`), Coherent Gameface, Dear ImGui; Raylib/`raygui`, SDL3/`SDL_ttf`, Defold (`.gui`/`.gui_script`), Cocos Creator; input maps, localization pipelines, and safe-area/certification docs.

## Translate direction to game idioms

1. Map semantic tokens to engine theme/style systems: Unity USS variables/ScriptableObjects, Godot Theme resources, Unreal CommonUI styles/brushes/materials, or engine theme modules.
2. Separate diegetic world presentation, HUD state, menu/settings, and cinematic narration. Do not let spectacle destroy critical state legibility.
3. Design focus/navigation for controller/keyboard before mouse/touch polish; every actionable element needs predictable spatial navigation and visible focus.
4. Reserve safe areas, ultrawide HUD clamps, HDR paper-white luminance, and platform system overlays; verify aspect ratio, resolution scaling, split screen, handheld/TV distance, and stream/capture cropping.
5. Treat localization, accessibility options, input remapping, subtitles/captions, colorblind differentiation, and difficulty/assists as core UI systems—not post-launch patches.

## Platform-wide rules

- **Steam Deck Verified (`1280×800`, `16:10`) & brightest/darkest HUD legibility**: enforce **`>= 9px` absolute floor / `12–14px` body target at `1280×800`** handheld (`>= 24–28px` at `1080p` 10-foot TV distance), full gamepad navigation from boot with **zero external mouse-only launcher**, automatic OS/Steam virtual keyboard invocation (`ShowFloatingGamepadTextInput`), and **HUD legibility verified on both the brightest (glare/snow/sky) AND darkest gameplay scenes** (using subtle dropplates/backings/keylines rather than bare floating glyphs).
- **Safe areas & non-stretched ultrawide clamping**: keep critical HUD inside a **`90%` title-safe inset** (`5%` margin) and clamp peripheral HUD widgets to a centered **`16:9` anchor box** on `21:9` / `32:9` displays (with an edge-offset slider) **without stretching 2D sprites, radial reticles, or minimaps**.
- **Console Lotcheck / TRC / XR, interruption states & store compliance**:
  - Immediately **auto-pause single-player gameplay + open a modal prompt** on **controller disconnect** AND handle **OS interruption states** (**incoming mobile call, console Home/Quick Resume overlay, screen lock/suspend, and explicit `save-failed` / storage-full recovery**);
  - Display a persistent **active player profile / gamertag indicator** across account-bound menus;
  - Render an explicit **"Saving — do not turn off…" autosave indicator** before/during non-volatile writes without stalling the render thread;
  - Cap full-screen/UI luminance flashes strictly **`<= 3 Hz`** (photosensitivity floor), and satisfy **store age-rating (`ESRB` / `PEGI` / `IARC`), chat/UGC moderation, and child/player privacy compliance**.
- **Zero-lag glyphs, input buffering, audio feel & `0 B/frame` GC**:
  - Hot-swap input glyphs (`Xbox <-> DualSense <-> Switch <-> Steam Deck <-> KB/Mouse`) in **`<= 1 frame` (`0` hysteresis lag on deliberate input)** using fixed-metrics inline icon slots so prompts **never layout-jump**;
  - Buffer menu/confirm inputs for **`100–150 ms`** across brief state transitions, modulate repeated UI SFX pitch by **`±3%`** (`0.97–1.03`), route UI audio to **decoupled buses** (`Master / Music / SFX / Voice / UI`), and hold steady-state UI heap allocations to **`0 B/frame`** (pooled floaters, `SetText` / preallocated buffers).
- **Accessibility & motor/vestibular customization**: ship independent **HUD Scale**, **Subtitle size + background opacity (`0–100%`)**, **Colorblind symbol + palette**, **Full Input Remapping** (with conflict detection + hold-to-toggle), **hold-instead-of-mash (`tap-assist` / hold-to-repeat)** for QTEs/rapid actions, and **camera/screen-shake + FOV motion reduction (`0–100%`)**.

## Anti-lazy / do-not-hand-roll & anti-slop guard

- **Never hand-roll raw `drawRect` / `fillText` / `pygame.draw.rect` layout and hit-test engines** when real UI toolkits exist for the engine: Unity UI Toolkit/uGUI, Godot `Control`, Unreal CommonUI/UMG, Bevy `bevy_ui`, Flame `overlayBuilderMap` Flutter widgets, `ebitenui`, `macroquad::ui`, `pygame_gui`, `arcade.gui`, or semantic HTML/DOM overlays in Phaser/Excalibur.
- **Reject generic sci-fi/neon HUD slop**: do not paste glowing cyan boxes, stretched 16:9 bitmaps on 21:9 monitors, mouse-only launchers, per-frame string-concatenation GC spikes, or hardcoded Xbox/keyboard prompt strings detached from the active input device.

## Common game-UI failures

- text shrinking below `9px` on Steam Deck (`1280×800`) or `24px` on `1080p` TV, HUD washing out against snow/sky glare, or text inputs failing to summon the gamepad virtual keyboard;
- gameplay continuing unpaused on wireless controller disconnect, incoming call, or console Home overlay, or silent `save-failed` disk errors;
- mandatory button-mashing QTEs without `tap-assist` hold alternatives, or un-togglable camera/screen shake;
- input-glyph swaps lagging multiple seconds or shifting surrounding text layout;
- `21:9`/`32:9` ultrawide stretching 2D HUD sprites or pinning health bars at extreme screen edges;
- per-frame UI string allocations (`$"HP: {hp}"`) triggering GC frame hitches, `> 3 Hz` flashes, or single-bus audio lacking a dedicated `UI` slider.

## Verification options

Engine editor preview is `static`, never runtime gameplay verification (**Rule #0.3**). Capture playmode/device screenshots at `1280×800` (`16:10`), `1920×1080` (`16:9`), and `3440×1440` (`21:9`) across **both brightest (glare/snow/sky) and darkest scenes**, run controller-only boot-to-gameplay + interruption walkthroughs (disconnect, call/overlay, lock, `save-failed`), profile steady-state `0 B/frame` UI allocations, and test pseudo-localized (+35–40%) + CJK/RTL builds (`rendered`). Label unverified console TRC/Lotcheck/XR items `not-checked`.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, mouse-only boot launchers, or dead menu/remapping handlers;
- [ ] **Steam Deck (`1280×800`, `16:10`)** text `>= 9px` floor (`12–14px` target), **10ft TV (`1080p`)** `>= 24–28px`, gamepad virtual keyboard, `90%` safe zone, non-stretched `16:9` ultrawide HUD clamp, and **HUD legibility captures on both brightest (glare/snow/sky) and darkest scenes** verified;
- [ ] **TRC/Lotcheck/XR, interruptions & store compliance**: controller-disconnect auto-pause modal, **incoming call / console Home overlay / screen-lock / `save-failed` interruption states**, active player profile indicator, `"Saving — do not turn off…"` notice, `<= 3 Hz` flash cap, and **store age-rating (`ESRB`/`PEGI`/`IARC`) & privacy compliance** wired;
- [ ] **`<= 1 frame` input-glyph hot-swap** (zero layout jump), `100–150 ms` menu input buffer, `±3%` UI SFX pitch modulation, decoupled `Master/Music/SFX/Voice/UI` buses, and **`0 B/frame` steady-state UI GC** verified;
- [ ] independent HUD Scale, Subtitle background opacity (`0–100%`), Colorblind symbol+palette, Full Input Remapping, **hold-instead-of-mash (`tap-assist` / hold-to-repeat)**, **camera/screen-shake reduction (`0–100%`)**, and +35–40% / CJK / RTL localization verified;
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, playmode/profiler checks, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).

## Framework routing

- Read [references/hud-principles.md](references/hud-principles.md) for cross-engine HUD taxonomy (diegetic/spatial/meta/non-diegetic), dynamic input-glyph swapping, HDR paper-white calibration, ultrawide HUD clamping, controller navigation, safe areas, XAG accessibility patterns, and verification.
- Read [references/unity-ui-toolkit.md](references/unity-ui-toolkit.md) for Unity UI Toolkit (UXML/USS, Unity 6 `DataBinding`, Runtime Accessibility, `PanelSettings`, and UI Toolkit vs uGUI selection).
- Read [references/unity-ugui.md](references/unity-ugui.md) for Unity uGUI (`Canvas` static/dynamic splitting, `CanvasScaler`, `RectTransform`, `TextMeshPro` SDF atlases, `InputSystemUIInputModule`, explicit `Selectable` navigation, and world-space canvases).
- Read [references/godot.md](references/godot.md) for Godot 4 Control/Theme UI (GDScript & C# bindings), Godot 4.5 AccessKit, MSDF fonts, `DisplayServer.get_display_safe_area()`, `process_mode`, and `mouse_filter`.
- Read [references/unreal-umg.md](references/unreal-umg.md) for Unreal UMG, CommonUI (`UCommonActivatableWidget`, `CommonActionWidget`), UMG ViewModel (`MVVM`), Enhanced Input UI routing, Slate boundaries, and `InvalidationBox`/`RetainerBox`.
- Read [references/bevy.md](references/bevy.md) for Bevy 0.15–0.18 Rust UI (Required Components, `children!`, `bevy_picking`, `bevy_ui_widgets`, `bevy_feathers`, `bevy_input_focus`, and AccessKit).
- Read [references/love2d.md](references/love2d.md) for LÖVE2D/Lua games (`love.window.getSafeArea()`, gamepad glyph detection, SUIT/Slab/FlexLove).
- Read [references/monogame.md](references/monogame.md) for MonoGame/C# game UI (Gum UI, Myra, FontStashSharp).
- Read [references/web-and-middleware-game-ui.md](references/web-and-middleware-game-ui.md) for HTML5/web game engines (Phaser, PixiJS `@pixi/ui`, Excalibur, Kaplay), AAA/native middleware (NoesisGUI, RmlUi, Coherent Gameface, Dear ImGui), and native/indie engines (Raylib `raygui`, SDL3/`SDL_ttf` v3, Defold, Cocos Creator, Ebitengine `ebitenui`, Macroquad, Flame Flutter overlays, Pygame `pygame_gui`, and Python Arcade).
