# WCAG 2.2 AA operational checks

Primary source; new-criteria overview. This is a practical floor, not legal certification.

## Perceivable

- Text contrast: 4.5:1 normal, 3:1 large; non-text UI/icons 3:1 unless exempt. Check states, placeholders, disabled-but-relevant text, focus indicators, diagrams/charts.
- Resize/reflow: 200% zoom/text scaling and 320 CSS px-equivalent width without two-dimensional scrolling or loss of content/function, subject to exceptions.
- Meaning does not depend on color, shape, position, sound, or sensory characteristic alone.
- Media: captions/subtitles, transcripts/audio description as applicable; no flashing above safe thresholds.
- Content adapts orientation unless essential; meaningful images have appropriate alternative text or are marked decorative.

## Operable

| Criterion | Concrete check |
|---|---|
| keyboard/focus | every action reachable/operable; no keyboard trap; visible focus with sufficient contrast |
| 2.4.11 focus not obscured | sticky headers, banners, overlays, keyboards, and floating actions never fully hide focused component; enhanced AAA minimum is stricter |
| bypass/navigation | skip/landmarks/headings or platform equivalent; logical reading/focus order; meaningful page/screen titles |
| link/control purpose | destination/action understandable in context; avoid repeated vague names |
| 2.5.7 dragging | every dragging movement has single-pointer alternative (buttons, menu, keyboard, direct input) |
| 2.5.8 target size | web AA minimum 24×24 CSS px unless spacing/inline/essential/user-agent exception applies; platform baselines may be larger |
| gestures/motion | multipoint/path gestures have simple alternatives; motion actuation can be disabled/substituted |
| timing | user can extend/disable/control nonessential time limits; no unexpected context change on input/focus |

## Understandable

- Language of page/parts declared; consistent navigation/identification; icons/controls behave consistently.
- Errors are identified in text, associated with the input, and suggestions are provided when correction rules are known.
- 3.3.7 redundant entry: do not require re-entering information already supplied in the same process unless essential/security/revalidation exception applies.
- 3.3.8 accessible authentication: no cognitive function test (memory, puzzle, transcription) unless an allowed alternative/mechanism such as password manager/paste/passkey path exists.
- Help appears consistently when repeated across pages/screens.

## Robust

- Use valid native semantics first; ARIA only where needed and correct. Name/role/value/state must update programmatically.
- Status messages are exposed without moving focus where platform supports it.
- Custom components preserve focus, selection, input method, screen-reader ordering, and platform accessibility tree behavior.

## Automatic failures to scan/fix

`outline:none` without replacement, positive tabindex, placeholder-as-label, missing form label, mouse-only handlers, blocked paste, disabled zoom, color-only state, missing reduced-motion path, focus removed/unmanaged in dialogs, keyboard-inaccessible drag/drop/menu/grid, target padding counted as visual target when hit box is smaller.

## WCAG 2.2 addition test matrix

| Addition | Test procedure | Pass evidence | Exception handling |
|---|---|---|---|
| focus not obscured (minimum) | tab forward/backward through sticky headers/footers, banners, overlays, cookie/consent UI, virtual keyboards, floating actions | focused component is not fully hidden; enough visible pixels/state remain to identify it | enhanced visibility is stricter; document intentional overlay behavior |
| dragging movements | inspect every drag sort/resize/canvas/slider/map gesture | single-pointer click/tap alternative exists and achieves equivalent result; keyboard path remains required where applicable | exception only when dragging is essential to the activity; record why |
| target size minimum | measure rendered interactive target, not padding alone, at supported densities/viewports | 24×24 CSS px-equivalent minimum on web AA unless spacing/inline/equivalent/user-agent/essential exception applies | platform baseline may require larger; use stricter platform rule |
| consistent help | identify each help/contact/support/human-escalation mechanism and compare only the pages/steps where that mechanism repeats | repeated mechanism appears in the same relative order/location across the set; absence from some steps is not itself a violation | help need not exist on every page/step; evaluate consistency only where a repeated mechanism is provided |
| redundant entry | complete multi-step form/process and induce validation/server errors | previously supplied information is retained or selectable; no unnecessary retyping | essential/security/revalidation exceptions must be explicit and justified |
| accessible authentication | attempt login/recovery with password manager/paste/passkey/biometric/magic-link paths where supported | no cognitive memory test, puzzle, or transcription-only requirement blocks authentication | object recognition/manual transcription may be permitted only through specified alternative/mechanism; verify actual path |

Run these tests in the actual rendering/input context. A static line of code is not proof when sticky elements, viewport occlusion, scaling, hit slop, or asynchronous validation determine the outcome.

## Manual verification scripts

Use short repeatable scripts rather than vague manual inspection:

1. **Keyboard reverse-path script:** complete the primary flow forward, then reverse with Shift+Tab/platform equivalent; verify focus visibility, logical order, escape/close behavior, and restoration.
2. **Occlusion script:** zoom/resize to the smallest supported geometry, enable any sticky/floating UI and virtual keyboard emulation where relevant, tab through all controls, and inspect whether focused controls remain visible.
3. **Authentication script:** enter incorrect credentials, correct one field, use paste/manager/autofill, trigger recovery, and verify no memory/puzzle/transcription-only barrier or redundant entry.
4. **Dragging alternative script:** identify every drag interaction, complete the same outcome using its single-pointer/keyboard alternative, cancel midway, and verify state/announcement.
5. **Error recovery script:** submit invalid input, correct only one field, verify prompt revalidation, preserved input, summary freshness, and focus behavior.
6. **Scaling script:** set 200% text/zoom or platform-large text, complete the task in light/dark/high-contrast modes, and inspect clipping, overlap, target size, and focus visibility.
