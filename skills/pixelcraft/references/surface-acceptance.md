# Shared surface acceptance matrix

Use this reference when deciding what evidence a platform implementation must produce. It is the cross-surface contract; platform skills add native idioms and tooling. Do not treat every row as mandatory in every prototype: classify skipped rows as `not-checked` or `waived` with consequence.

## Acceptance dimensions

| Dimension | Required design/implementation behavior | Acceptance evidence |
|---|---|---|
| layout ownership | the surface controls resize/reflow through constraints rather than fixed perfect pixels | smallest/typical/large geometry inspected without clipping or accidental two-dimensional scrolling |
| navigation truth | back/escape/close/deep link/refresh/relaunch restore understandable state | primary forward/back task path exercised in the real runtime or labeled emulation |
| input completeness | pointer/touch/keyboard/controller/remote/voice/IME paths match platform expectations | primary task completed without mouse-only, hover-only, precision-only, or hidden-command dependency |
| focus and restoration | focus/selection/scroll/input context survive dialogs, errors, route changes, interruption, and re-entry | focus path and restoration inspected across at least one interruption |
| state coverage | loading/empty/error/offline/permission/long-content/conflict/cancellation states are designed | representative non-happy-path states rendered or explicitly marked absent/not applicable |
| accessibility exposure | native semantics/accessibility tree carry name, role, value, state, order, grouping, and status changes | automated scan plus manual keyboard/screen-reader or platform-equivalent inspection where available |
| text scaling/localization | expansion, contraction, line breaking, directionality, numerals, fonts, plural forms, IME composition survive | representative locale matrix or targeted stress case; no fixed-height clipping |
| performance/interaction | acknowledgment is fast, input remains responsive, layout is stable, media/asset cost is proportionate | runtime measurement against surface budget or explicit `not-checked` |
| safe geometry | safe areas, overscan, notches, system chrome, virtual keyboard, taskbar/menu bar, window minimums are respected | real device/simulator/windowed/terminal evidence where environment permits |
| capture/verification | output can be captured meaningfully without hiding defects | screenshots/recordings/snapshots include edge cases and identify exact runtime/build |
| data/privacy | user data, secrets, private media, and personal identifiers are protected in artifacts | captures redacted/synthetic; no fake metrics/proof/testimonials |
| platform idiom | navigation, controls, feedback, scaling, lifecycle, packaging, and system integration feel native | idioms named in implementation notes; deviations deliberate and justified |

## Mode overlays

- **Operate:** keyboard/controller efficiency, density discipline, recovery/undo, latency, scanability, and state persistence dominate.
- **Read:** measure, typography, navigation orientation, print/export behavior, scaling, and distraction control dominate.
- **Persuade:** truthful proof, decision sequence, performance, memorable hierarchy, and action visibility dominate.
- **Experience/Play:** frame stability, input latency, comfort, HUD legibility, interruption recovery, and sensory-safe alternatives dominate.
- **Communicate:** client degradation, plaintext/low-bandwidth equivalent, image blocking, ink/data cost, and locale robustness dominate.

## Minimum acceptance statement

Every surface implementation must end with a matrix row summary:

```markdown
| Dimension | Result | Evidence | Label |
|---|---|---|---|
| layout ownership | pass/issue/not applicable | artifact/path/command | rendered/static/model-judgment/not-checked/waived |
```

A blank matrix means the implementation is unverified even if it compiles.
