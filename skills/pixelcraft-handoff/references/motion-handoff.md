# Motion handoff specification

When a Figma/prototype/reference includes motion, record behavior separately from static appearance.

## Required fields

| Field | Meaning |
|---|---|
| trigger | user action, scroll threshold, route change, media event, or automatic event |
| initial/final state | properties and semantic state before/after |
| timing | duration, delay, stagger, repetitions, interruption behavior |
| easing | named curve/spring plus whether it is tokenized |
| ownership | component/route and runtime that owns the animation |
| input | pointer, keyboard, touch, controller, or automatic |
| lifecycle | mount, unmount, resize, route transition, visibility |
| reduced motion | immediate/static/fade alternative |
| focus/semantics | focus placement, reading order, accessible state announcement |
| evidence | design prototype, user recording, rendered implementation, static inference |

## Translation

- Reuse the project's animation runtime and tokens where possible.
- Do not translate a prototype's exact frame values into production without testing with real content and device constraints.
- Resolve missing keyboard/touch/reduced-motion states; do not silently invent them.
- Keep semantic content and real controls in the platform surface.
- Verify motion alongside the visual fidelity loop, not as a separate decorative pass.
