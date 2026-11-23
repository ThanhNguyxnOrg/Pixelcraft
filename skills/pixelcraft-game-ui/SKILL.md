---
name: pixelcraft-game-ui
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into game interfaces across Unity UI Toolkit, Godot Control/UI, Unreal UMG, LÖVE2D, Bevy, and MonoGame. Use for HUDs, menus, inventory, controller/keyboard navigation, focus order, safe areas, subtitles, accessibility options, localization, legibility at distance, platform certification-style constraints, pause/settings flows, and game UI verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft game UI

Use this skill when UI lives inside or around a game loop. Game UI must remain legible under motion, stress, distance, controller input, variable aspect ratios, localization expansion, and platform certification expectations.

## Detection signals

Unity `ProjectSettings/`, `.unity`, UXML/USS/UI Builder assets; Godot `project.godot`, `.tscn`, `.gd`, Control/Theme resources; Unreal `.uproject`, UMG widget assets/Blueprints; input maps, localization pipelines, platform target settings, safe-area/certification documentation.

## Translate direction to game idioms

1. Map semantic tokens to engine theme/style systems: Unity USS variables/selectors, Godot Theme resources, Unreal styles/brushes/materials.
2. Separate diegetic world presentation, HUD state, menu/settings, and cinematic narration. Do not let spectacle destroy critical state legibility.
3. Design focus/navigation for controller/keyboard before mouse/touch polish; every actionable element needs predictable spatial navigation and visible focus.
4. Reserve safe areas and platform-specific system overlays; verify aspect ratio, resolution scaling, split screen, handheld/TV distance, and stream/capture cropping.
5. Treat localization, accessibility options, input remapping, subtitles/captions, colorblind differentiation, and difficulty/assists as core UI systems—not post-launch patches.

## Platform-wide rules

- Critical HUD information survives motion, explosion/particle noise, low brightness, colorblindness, and glanceable viewing distance.
- Do not cover crosshair/objective/danger/state with decorative panels or tutorial prompts.
- Controller navigation must have sane initial focus, wrapping/dead-end behavior, back/cancel semantics, and no invisible focus traps.
- Text scaling/localization can break bitmap atlases, fixed-width labels, and glyph coverage; plan overflow/expansion early.
- Certification-style requirements vary by platform/version; treat them as constraints to verify against current official checklists, not universal law.
- UI audio/haptics/animation should reinforce state without masking gameplay-critical feedback.

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

## Framework routing

- Read [references/unity-ui-toolkit.md](references/unity-ui-toolkit.md) for Unity UI Toolkit/UXML/USS.
- Read [references/godot.md](references/godot.md) for Godot Control/UI/Theme/focus behavior.
- Read [references/unreal-umg.md](references/unreal-umg.md) for Unreal UMG/Slate-style UI.
- Read [references/hud-principles.md](references/hud-principles.md) for cross-engine HUD, controller navigation, safe-area, localization, accessibility, and certification-style constraints.
- Read [references/love2d.md](references/love2d.md) for LÖVE2D/Lua games.
- Read [references/bevy.md](references/bevy.md) for Bevy/Rust UI and AccessKit-oriented semantics.
- Read [references/monogame.md](references/monogame.md) for MonoGame/C# custom game UI.
