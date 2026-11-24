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

- Critical HUD information survives motion, explosion/particle noise, low brightness, colorblindness, and glanceable viewing distance.
- Do not cover crosshair/objective/danger/state with decorative panels or tutorial prompts.
- Controller navigation must have sane initial focus, wrapping/dead-end behavior, back/cancel semantics, and no invisible focus traps.
- Text scaling/localization can break bitmap atlases, fixed-width labels, and glyph coverage; plan overflow/expansion early.
- Certification-style requirements vary by platform/version; treat them as constraints to verify against current official checklists, not universal law.
- UI audio/haptics/animation should reinforce state without masking gameplay-critical feedback.

## Anti-lazy / do-not-hand-roll & anti-slop guard

- **Never hand-roll raw `drawRect` / `fillText` / `pygame.draw.rect` layout and hit-test engines** when real UI toolkits exist for the engine: Unity UI Toolkit/uGUI, Godot `Control`, Unreal CommonUI/UMG, Bevy `bevy_ui`, Flame `overlayBuilderMap` Flutter widgets, `ebitenui`, `macroquad::ui`, `pygame_gui`, `arcade.gui`, or semantic HTML/DOM overlays in Phaser/Excalibur.
- **Reject generic sci-fi/neon HUD slop**: do not paste glowing cyan boxes, unscaled 1080p mockups, or hardcoded Xbox/keyboard prompt strings detached from the game's direction and active input device.

## Common game-UI failures

- HUD designed on a static 1080p mockup but illegible in motion/at distance;
- menu navigation impossible without mouse or precise touch;
- focus jumping unpredictably after closing a popup;
- text clipped in German/Finnish or missing CJK/Arabic glyph atlases;
- color-only team/enemy/rarity/status encoding;
- tutorial modal blocking the mechanic it teaches;
- safe-area violation on TV/handheld/notched devices;
- remapping UI that cannot represent conflicts/chords/multiple devices.

## Verification options

Engine editor preview is not equivalent to runtime gameplay verification. Use playmode/device screenshots, controller-only walkthroughs, resolution/aspect matrices, localization pseudo-text/glyph tests, accessibility settings tests, and platform-specific validation where available. Label console/certification claims `not-checked` unless current official requirements were actually inspected.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, invented strings, or dead menu/button handlers;
- [ ] HUD legibility verified in motion across bright/dark scenes, ultrawide clamps, mobile/TV safe areas, and target viewing distance;
- [ ] full controller/keyboard-only navigation works with clear focus state, dynamic input-device glyphs, and focus restoration after closing popups;
- [ ] pause/modal layers own input cleanly (`mouse_filter`, `process_mode`, input stacks) without leaking clicks to gameplay;
- [ ] localization expansion (+30–40%), CJK/RTL glyph atlases, subtitles, colorblind cues, and reduced-motion/HUD-scale options verified;
- [ ] live playmode/device evidence labeled `rendered` and unchecked console/certification/screen-reader items labeled `not-checked`.

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
