# Kivy

## Token mapping

Kivy has no universal modern design-token pipeline. Encode semantic constants in Python/KV variables and apply them through reusable styles/classes:

```kv
#:set pc_action (0.0, 0.455, 0.792, 1)
```

Keep color units/channel conventions explicit. Do not scatter raw RGBA arrays through KV/rules.

## Layout and responsive idioms

Use Box/Grid/Relative/Float/Anchor layouts intentionally, KV size hints, dp/sp units, window resize behavior, orientation/density, and scroll views. Do not use absolute pixel coordinates for everything. Canvas drawing is powerful but must be recomputed on resize/scale.

## Typography/custom fonts

Register custom fonts and use sp-based sizing. Verify glyph coverage/fallback because Kivy font behavior differs by platform. Do not fixed-size clip localized or scaled text; measure texture constraints where custom layout matters.

## Motion/reduced motion

Use `kivy.animation.Animation` purposefully, cancel animations on lifecycle/navigation, and avoid motion-only feedback. System reduced-motion integration is not uniform; expose an app-level reduced-motion option where necessary.

## Accessibility specifics

Kivy accessibility support is limited/platform-dependent compared with native UI frameworks. Keyboard input/focus behavior must be explicit; touch target sizing and non-color state are critical. Treat screen-reader support as uncertain until verified on target. Do not make essential UI canvas-only without semantic/navigation alternatives.

## States idiom

Use properties/event binding/state machine explicitness. Loading/empty/error/offline/permission/background-operation states must be represented in widget tree. Clock scheduling/threading needs lifecycle cancellation and duplicate protection. Preserve user input across screen manager transitions.

## Forms idiom

Use labeled inputs, focus order, keyboard behavior, validation timing, paste/input-method capabilities verification, and input preservation. Mobile keyboard occlusion and scrolling need deliberate testing.

## Do/don't pairs

| Do | Don't |
|---|---|
| real `Button` behavior where control semantics matter | drawing a fake button on canvas with only touch coordinates |
| dp/sp units and resize-aware layout | absolute pixels copied from one mockup |
| cancel/complete Clock/thread work explicitly | background thread mutating UI/state after screen destruction |
| explicit keyboard/focus order | assuming tab/screen-reader behavior exists automatically |
| non-color/icon/text state cues | color-only validation or status |

## Known traps

Canvas redraw/resize bugs, touch target inconsistency, platform packaging differences, text scaling/glyph coverage, weak screen-reader support, thread/UI lifecycle mistakes, keyboard occlusion, accidental absolute positioning, animation cancellation leaks.

## Verification commands

```sh
python main.py
python -m pytest
python -m compileall .
```

Use actual desktop/device runs at multiple sizes/input modes. Kivy behavior cannot be verified meaningfully by compile/tests alone.
