# Cross-engine HUD principles

## Legibility under play

- Define criticality tiers: survival-critical, objective-critical, tactical/optional, ambient/flavor.
- Critical information must survive motion/particles/lighting, distance, low brightness, colorblindness, localization expansion, compression/streaming artifacts, and glance duration.
- Use redundancy: color + shape/icon/text/position/audio where appropriate.
- Do not cover crosshair/objective/danger/state with decorative panels/tutorial prompts.
- Test at actual worst-case distance/resolution/brightness, not only editor close-up.

## Controller/focus navigation

- Design initial focus for every screen/popup and restore focus after close/transaction/error/scene change.
- Spatial navigation must be predictable; avoid dead ends, invisible wrapping surprises, and focus jumping to hidden/disabled widgets.
- Back/cancel semantics must be consistent across menus/HUD/platform overlays.
- Every primary action must be possible without mouse/touch where controller/keyboard is supported.
- Input remapping UI must show device/context/chords/conflicts and preserve user mappings safely.

## Safe areas and platform constraints

Reserve safe areas for TV/handheld/notched/system overlay contexts. Test 16:9/ultrawide/portrait/steam-deck-like handheld/split screen where applicable. Certification-style constraints vary by console/platform/version and are often confidential or changing: label them as verification requirements to check in current official docs, never invent them here.

## Localization/accessibility options

- pseudo-localize early; budget expansion and test glyph coverage for target scripts;
- support text/HUD scaling, subtitle size/background/speaker/sound cues, colorblind-safe palettes, flash reduction, motion/camera comfort, input remapping/toggle/hold alternatives;
- localize button prompts/icons and input-device terminology rather than hard-coding one controller/layout;
- treat accessibility settings as persistent first-class UX with preview/reset/recovery.

## State hierarchy

Separate persistent HUD state, transient feedback, modal interruption, tutorial/coach marks, cinematic subtitles, network/system notifications, and debug overlays. Define priority/interruption rules; otherwise everything competes at once.

## Verification matrix

Record engine/version/platform/device, resolution/aspect/scale, input device, brightness/contrast/HDR setting, locale/script/text size, motion/flash/accessibility settings, network state, gameplay chaos level, and exact task. Editor screenshot alone is weak evidence; runtime chaos/distance/controller evidence is stronger.
