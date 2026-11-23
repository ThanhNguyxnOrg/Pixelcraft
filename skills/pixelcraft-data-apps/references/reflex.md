# Reflex

Evidence: current docs confirm `rx.App(theme=rx.theme(appearance="light", has_background=True, radius="large", accent_color="teal"))` and Radix Themes-based props.

## Token mapping

Use `rx.theme` for global appearance/accent/radius and semantic style props/classes for local composition:

```python
app = rx.App(theme=rx.theme(appearance="light", radius="medium", accent_color="blue"))
```

Map DTCG semantic decisions into theme props plus a constrained style constants module. Do not scatter raw style dictionaries through every component.

## Layout and responsive idioms

Reflex compiles to web UI; use responsive layout components/props and CSS-like semantics rather than desktop-only fixed widths. State-driven conditional rendering should preserve layout stability. Treat backend event latency as part of interaction design.

## Typography/custom fonts

Use theme/head asset configuration deliberately. Font loading is web behavior even though authoring is Python; fallbacks/subsets/script coverage still matter.

## Motion/reduced motion

Use web-level motion sparingly and honor `prefers-reduced-motion` in CSS/custom components. Backend roundtrips are not animation; immediate client feedback may be needed for responsive interaction.

## Accessibility specifics

Reflex/Radix components provide useful primitives but still require names/labels/focus behavior. Dynamic server-driven updates need loading/error/status semantics and keyboard verification. Do not hide state behind color-only conditional styles.

## States idiom

Reflex state classes/vars define interaction truth. Explicitly model loading/error/empty/permission/offline/optimistic states. Understand backend state scope per user/session; never leak mutable global state. Event handlers need validation, error return paths, and duplicate-submit protection.

## Forms idiom

Use form controls with labels/name/value binding and validation timing appropriate to backend events. Preserve input in state after failed validation. Correct input types/autocomplete behavior ultimately depend on generated DOM—inspect it.

## Do/don't pairs

| Do | Don't |
|---|---|
| central typed state vars for form draft | hidden mutable module-global data shared across users |
| explicit pending bool during backend mutation | allowing repeated double-submit while waiting |
| theme-level semantic appearance | arbitrary inline style dictionaries repeated everywhere |
| validation error text adjacent to field | toast-only backend failure |
| inspect generated DOM/a11y behavior | assuming Python component abstraction guarantees browser semantics |

## Known traps

Backend roundtrip latency, state serialization limits, accidental shared mutable state, websocket/offline behavior, compile/runtime version mismatch, style prop sprawl, browser-only assumptions hidden in Python, generated DOM differing from expectation.

## Verification commands

```sh
reflex run
reflex export 2>/dev/null || true
python -m pytest
python -m compileall .
```

Inspect actual browser rendering/network behavior for visual/interaction evidence; Python compile success proves almost nothing about UX.
