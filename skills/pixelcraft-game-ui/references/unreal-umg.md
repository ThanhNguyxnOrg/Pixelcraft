# Unreal UMG

## Token mapping

Use shared styles/brushes/materials/data assets/project style guides where available rather than copying colors/fonts per widget. Map semantic colors/type/spacing into centralized widget styles or design-system wrapper widgets. UMG inheritance/retainer/material behavior must be understood before creating parallel constants.

## Layout and responsive idioms

Use panels (`VerticalBox`, `HorizontalBox`, `GridPanel`, `CanvasPanel`, `SizeBox`, `ScaleBox`, `SafeZone`) intentionally. Separate HUD widget, menu screens, world-space widgets, overlays, scaling/resolution behavior, split screen, aspect ratios, safe zones, and platform-specific UI layers.

## Typography/custom fonts

Configure font assets/localization/font fallback carefully. Verify glyph coverage/memory, scaling/DPI, line breaking, expansion, and readability at distance. Bitmap/font atlas constraints matter for localized games; do not treat editor English as coverage.

## Motion/reduced motion

Use UMG animations/sequencer/material motion intentionally. Provide reduced-motion/flash/camera-motion settings as game accessibility options; platform-level hooks may not cover all gameplay motion. Never hide critical HUD state behind cinematic animation timing.

## Accessibility specifics

Use navigation/focus behavior explicitly, controller/keyboard input routing, visible focus state, text scaling/HUD scaling/subtitles/captions/colorblind-safe coding/remapping. Unreal/platform screen-reader support varies; label uncertainty honestly. CommonUI/input routing plugins can help but introduce their own constraints.

## States idiom

Model game state and UI lifecycle together: loading/connecting/error/offline/permission/death/respawn/pause/cutscene/inventory-empty/matchmaking/cancelled/purchase-pending. Input mode (game-only/UI-only/game-and-UI) is UX state; mistakes trap input or leak gameplay actions.

## Forms idiom

Editable text/widgets need labels/instructions, virtual keyboard/platform integration, validation timing, paste/input constraints, focus navigation, preservation after error/menu interruption, and recovery copy. Account linking/authentication must not force redundant manual entry when platform identity exists.

## Do/don't pairs

| Do | Don't |
|---|---|
| centralized semantic style assets/wrappers | copying colors/fonts per widget instance |
| explicit input mode/focus ownership | modal that traps controller input or leaks firing/movement |
| safe-zone/aspect matrix testing | validating only editor PIE 16:9 window |
| HUD scaling/subtitle/colorblind options | fixed tiny monochrome HUD treated as hardcore aesthetic |
| restore focus after popup/menu close | focus lost to hidden/removed widget |

## Known traps

Blueprint visual-script sprawl hiding state ownership, input mode mistakes, focus/navigation inconsistency, hard references/memory cost, localized glyph coverage, editor/runtime scaling mismatch, safe-area/platform differences, retainer/material rendering artifacts, certification constraints discovered late.

## Verification commands

```sh
# project dependent; use Unreal automation/build commands available in repo
ls *.uproject 2>/dev/null || true
```

Use PIE/device/console-like target screenshots, controller-only navigation, resolution/aspect/safe-zone matrix, localization pseudo-text/glyph checks, accessibility option tests, input-mode/menu interruption flows, automation tests, and current platform certification checklists where applicable.
