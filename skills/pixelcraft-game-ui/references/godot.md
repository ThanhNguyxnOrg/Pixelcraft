# Godot UI

Evidence: Godot docs confirm Control focus modes including keyboard/D-pad behavior, `add_theme_*_override` methods, theme inheritance, and dynamic font formats/size overrides.

## Token mapping

Use Theme resources for shared colors/fonts/styles/constants and scoped overrides only when necessary:

```gdscript
button.add_theme_color_override("font_color", pc_action_text)
```

Prefer theme types/items that express semantic roles. Do not duplicate styleboxes/fonts per control unless variation is intentional.

## Layout and responsive idioms

Use Control containers (`VBoxContainer`, `HBoxContainer`, `GridContainer`, `MarginContainer`, aspect/size flags/anchors) rather than absolute positioning everywhere. Handle window resizing/stretch mode/aspect ratio/safe area/controller distance. Separate HUD CanvasLayer from menu/control tree ownership.

## Typography/custom fonts

Use dynamic TTF/OTF/WOFF fonts where scaling/localization matter; bitmap fonts only for intentional pixel/bitmap systems. Since Godot 4 separates font resource and size override, define sizes semantically. Verify glyph coverage/fallbacks/localization expansion.

## Motion/reduced motion

Use Tweens/AnimationPlayer purposefully, pause/cancel behavior explicitly, and expose reduced-motion/flash-reduction options. Do not make critical state dependent on tween completion without interruption handling.

## Accessibility specifics

Use Control focus mode and focus neighbors/input map behavior deliberately. Focus visual appears for keyboard/gamepad/grab focus scenarios; do not hide it. Verify controller/keyboard navigation, colorblind differentiation, subtitle/caption sizing/background, remapping, scalable HUD/text, and platform screen-reader limitations honestly.

## States idiom

Model pause/loading/error/empty inventory/network/offline/death/respawn/dialogue/cutscene/permission states explicitly. Pause behavior/process mode affects UI; interruption/resume semantics are core game UX. Restore focus after popup/menu close/scene transition.

## Forms idiom

LineEdit/controls need labels/help, validation timing, virtual keyboard/platform input awareness, paste behavior where available, focus order, input preservation, and recovery copy. Settings/remapping UI must handle conflicts/device multiplicity.

## Do/don't pairs

| Do | Don't |
|---|---|
| shared Theme resource with scoped overrides | duplicating styleboxes/fonts across every Control |
| explicit `focus_neighbor_*`/initial focus | random controller navigation dead ends |
| containers/size flags for resize | absolute pixel layout only at 1080p |
| focus restoration after popup close | focus trapped in hidden/freed node |
| process mode/pause behavior explicit | menu hidden or input dead because pause ownership was unclear |

## Known traps

Mouse filter blocking input unintentionally, focus loss after node removal, theme item confusion because theme values are not ordinary object properties, localization glyph/overflow issues, stretch/aspect mismatch, safe-area neglect, controller/keyboard input map conflict, pause/process-mode bugs.

## Verification commands

```sh
godot --headless --check-only 2>/dev/null || true
godot --headless --run-tests 2>/dev/null || true
godot --path . 2>/dev/null || true
```

Use runtime screenshots/device tests, controller-only navigation, resize/aspect/safe-area matrix, localization pseudo-text/glyph checks, accessibility option tests, pause/interruption/reconnect flows, and platform export validation where applicable.
