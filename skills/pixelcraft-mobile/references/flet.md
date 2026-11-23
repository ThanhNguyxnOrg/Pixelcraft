# Flet

## Token mapping

Configure page/theme objects rather than styling every control ad hoc. Current Flet commonly uses `page.theme = ft.Theme(...)` and color-scheme-related properties; verify exact constructor against the installed version. Keep generated Python constants in a semantic module and map them once into theme/control styles.

## Layout and responsive idioms

Use controls/containers/rows/columns/views/routes/expansion behavior according to app/window model. Flet can target desktop/web/mobile-like surfaces; do not assume browser DOM or mobile platform conventions automatically apply. Handle resize/orientation/window dimensions explicitly.

## Typography/custom fonts

Register/configure fonts and text styles deliberately. Verify fallback/glyph coverage and scaling. Fixed-size containers must not clip localized or scaled copy without intentional overflow behavior.

## Motion/reduced motion

Use animation/transition properties purposefully and keep durations semantic. Platform reduced-motion behavior depends on target/host; expose an app-level reduced-motion setting if system integration is uncertain. Never rely on motion alone for state.

## Accessibility specifics

Use semantic properties/labels/tooltips only as appropriate and inspect actual target behavior. Keyboard focus/traversal and screen-reader support vary by surface/version; custom-painted/control-heavy UI needs explicit verification. Do not fake buttons with gesture-only containers.

## States idiom

Understand page/update lifecycle and control tree ownership. Model loading/error/empty/offline/permission/background-task states explicitly. Async tasks need cancellation/error propagation and duplicate-submit protection. Preserve control values through route/navigation/session behavior.

## Forms idiom

Use labeled text fields/dropdowns/checkboxes, validation timing after completion/submit, focus traversal, correct keyboard/input behavior where exposed, paste/autofill capability verification, and input preservation across route changes.

## Do/don't pairs

| Do | Don't |
|---|---|
| one semantic theme module | raw color/style constants repeated through controls |
| real button/control semantics | clickable/gesture container as fake primary action |
| explicit async task error/cancel state | fire-and-forget background work with silent failure |
| resize-aware adaptive layout | fixed desktop wireframe scaled to every target |
| preserve form draft through navigation | reconstructing blank controls on every route change |

## Known traps

Version API churn, update batching/lifecycle confusion, control duplication, unclear async ownership, platform capability differences, font/glyph coverage, accessibility uncertainty, desktop/web behavior divergence.

## Verification commands

```sh
flet run app.py 2>/dev/null || python app.py
python -m pytest
python -m compileall .
```

Inspect the actual target surface (browser/desktop/device). Python tests are state evidence only unless they drive the rendered target.
