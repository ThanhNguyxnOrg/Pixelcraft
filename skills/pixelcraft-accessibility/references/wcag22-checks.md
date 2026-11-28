# WCAG 2.2 AA operational checks

Primary source; new-criteria overview. This is a practical floor, not legal certification.

## Regulatory & standards scope

WCAG 2.2 AA is Pixelcraft's mandatory engineering floor (not legal certification; escalate formal compliance to legal/accessibility counsel):

- **EU European Accessibility Act (EAA, effective June 28, 2025)** & **EN 301 549:** covers consumer digital products, e-commerce, banking, transport, e-books, and communications sold in the EU (referencing WCAG 2.1/2.2 AA + non-web software/document requirements).
- **US ADA Title II (compliance deadlines starting April 24, 2026 for larger state/local public entities, April 2027 for smaller entities):** mandates WCAG 2.1 AA minimum (meeting WCAG 2.2 AA satisfies and exceeds 2.1 AA).
- **APCA / WCAG 3.0 cross-reference:** keep WCAG 2.2 AA luminance ratios (`4.5:1` / `3:1`) as the normative legal floor, and pair them with **APCA (`|Lc|`)** perceptual contrast checks (see `pixelcraft-craft`) to catch dark-mode halation and thin-weight legibility defects as WCAG 3.0 matures.

## Perceivable

- Text contrast: `4.5:1` normal, `3:1` large; non-text UI/icons `3:1` unless exempt. Check states, placeholders, focus indicators, diagrams/charts, and composited translucency. Supplement with APCA `|Lc|` checks on dark surfaces.
- Resize/reflow: 200% zoom/text scaling and 320 CSS px-equivalent width without two-dimensional scrolling or loss of content/function, subject to exceptions.
- **1.4.12 Text Spacing:** layout survives user overrides of line height ≥ `1.5×` font size, paragraph spacing ≥ `2×`, letter spacing ≥ `0.12×`, and word spacing ≥ `0.16×` with zero clipping, overlap, or lost controls.
- **1.4.13 Content on Hover or Focus:** tooltips, hovercards, and submenus triggered by hover/focus must be **dismissible** (`Esc` without moving pointer/focus), **hoverable** (pointer can move onto the revealed content without it vanishing), and **persistent** until the user dismisses or moves away.
- Meaning does not depend on color, shape, position, sound, or sensory characteristic alone.
- Media: captions/subtitles, transcripts/audio description as applicable; no flashing above safe thresholds (`≤ 3 flashes/s`).
- Content adapts orientation unless essential; meaningful images have appropriate alternative text or are marked decorative.

## Operable

| Criterion | Concrete check |
|---|---|
| keyboard/focus | every action reachable/operable; no keyboard trap; visible focus with sufficient contrast |
| **2.1.4 Character Key Shortcuts** | single-character shortcuts (`j`, `k`, `/`, `?`) can be turned off, remapped, or are active only while a relevant component has focus |
| **2.4.11 Focus Not Obscured (AA)** & **2.4.12 (Enhanced, AAA)** | sticky headers, banners, overlays, keyboards, and floating actions never hide the focused component (AA: not *entirely* hidden; AAA 2.4.12: *no part* obscured—prefer 2.4.12 via `scroll-margin-block`) |
| **2.4.13 Focus Appearance (AAA target)** | recommended focus ring geometry: enclosing area at least equivalent to a `2px` perimeter with `≥ 3:1` contrast change between unfocused and focused pixels |
| bypass/navigation | skip/landmarks/headings or platform equivalent; logical reading/focus order; meaningful page/screen titles |
| link/control purpose | destination/action understandable in context; avoid repeated vague names |
| **2.5.3 Label in Name** | accessible name (`aria-label`, `alt`, computed name) contains the exact visible text label (ideally starting with it) so Voice Control / speech-input users can say what they see |
| **2.5.7 Dragging Movements** | every dragging movement has a single-pointer alternative (buttons, menu, keyboard, direct input) |
| **2.5.8 Target Size (Minimum)** | web AA minimum `24×24` CSS px unless spacing/inline/essential/user-agent exception applies; native touch baselines are larger (`44pt` iOS / `48dp` Android) |
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

`outline:none` without replacement, positive tabindex, placeholder-as-label, missing form label, mouse-only handlers, blocked paste, disabled zoom, color-only state, missing reduced-motion path, focus removed/unmanaged in dialogs, keyboard-inaccessible drag/drop/menu/grid, target padding counted as visual target when hit box is smaller, and **third-party Accessibility Overlay widgets (`accessiBe`, `AudioEye`, etc.)** shipped in place of source-level remediation (overlays are strictly forbidden as a compliance substitute—fix semantics, contrast, focus, and interaction contracts in source code).

## WCAG 2.2 addition test matrix

| Addition | Test procedure | Pass evidence | Exception handling |
|---|---|---|---|
| focus not obscured (minimum) | tab forward/backward through sticky headers/footers, banners, overlays, cookie/consent UI, virtual keyboards, floating actions | focused component is not fully hidden; enough visible pixels/state remain to identify it | enhanced visibility is stricter; document intentional overlay behavior |
| dragging movements | inspect every drag sort/resize/canvas/slider/map gesture | single-pointer click/tap alternative exists and achieves equivalent result; keyboard path remains required where applicable | exception only when dragging is essential to the activity; record why |
| target size minimum | measure rendered interactive target, not padding alone, at supported densities/viewports | 24×24 CSS px-equivalent minimum on web AA unless spacing/inline/equivalent/user-agent/essential exception applies | platform baseline may require larger; use stricter platform rule |
| consistent help | identify each help/contact/support/human-escalation mechanism and compare only the pages/steps where that mechanism repeats | repeated mechanism appears in the same relative order/location across the set; absence from some steps is not itself a violation | help need not exist on every page/step; evaluate consistency only where a repeated mechanism is provided |
| redundant entry | complete multi-step form/process and induce validation/server errors | previously supplied information is retained or selectable; no unnecessary retyping | essential/security/revalidation exceptions must be explicit and justified |
| accessible authentication | attempt login/recovery with password manager/paste/passkey/biometric/magic-link paths where supported | no cognitive memory test, puzzle, or transcription-only requirement blocks authentication | object recognition/manual transcription may be permitted only through specified alternative/mechanism; verify actual path |

Run these tests in the actual rendering/input context. Under empirical **W3C ACT** coverage, automated scanners detect only **~31% of WCAG 2.2 A/AA criteria** and miss conditionally mounted live-region silence, focus loss on delete/`"Load more"`, sticky occlusion (`2.4.11`), drag alternatives (`2.5.7`), and real keyboard/screen-reader flows—directly reinforcing **Golden Evidence Rule (`Rule #0.3`)** that static or automated-only checks never prove interactive or assistive compliance.

## Manual verification scripts

Use short repeatable scripts rather than vague manual inspection:

1. **Keyboard reverse-path script:** complete the primary flow forward, then reverse with Shift+Tab/platform equivalent; verify focus visibility, logical order, escape/close behavior, and restoration.
2. **Occlusion script:** zoom/resize to the smallest supported geometry, enable any sticky/floating UI and virtual keyboard emulation where relevant, tab through all controls, and inspect whether focused controls remain visible.
3. **Authentication script:** enter incorrect credentials, correct one field, use paste/manager/autofill, trigger recovery, and verify no memory/puzzle/transcription-only barrier or redundant entry.
4. **Dragging alternative script:** identify every drag interaction, complete the same outcome using its single-pointer/keyboard alternative, cancel midway, and verify state/announcement.
5. **Error recovery script:** submit invalid input, correct only one field, verify prompt revalidation, preserved input, summary freshness, and focus behavior.
6. **Scaling script:** set 200% text/zoom or platform-large text, complete the task in light/dark/high-contrast modes, and inspect clipping, overlap, target size, and focus visibility.

## Sticky and fixed chrome focus-unobscured remediation (`WCAG 2.4.11` / `2.4.12`)

Sticky headers, floating action bars, bottom tab/composer bars, cookie/consent banners, and software keyboards routinely hide controls reached via `Tab` or `Shift+Tab`. Enforce unobscured focus (`2.4.12` zero-occlusion target; `2.4.11` AA floor) structurally across platforms:

| Platform | Structural remediation pattern |
|---|---|
| **Web CSS / DOM** | Declare `scroll-padding-top` and `scroll-padding-bottom` on the scrolling container (`html` or overflow pane) matching tokenized sticky chrome heights (`scroll-padding-block: calc(var(--sticky-header-h, 0px) + 12px) calc(var(--sticky-footer-h, 0px) + 12px);`), and set `scroll-margin-block` on anchor targets. Dismiss or reserve flow space for consent/cookie banners so they never float over focused fields. |
| **SwiftUI / UIKit** | Mount persistent bars with `.safeAreaInset(edge: .top / .bottom)` rather than uncompensated `ZStack` overlays so `ScrollView` and keyboard avoidance automatically inset focusable bounds; pair `@FocusState` with `ScrollViewReader` when custom chrome changes height dynamically. |
| **Jetpack Compose / Android** | Pass `Scaffold` `innerPadding` into scrollable containers, apply `Modifier.imePadding()` + `WindowInsets.safeDrawing`, and use `BringIntoViewRequester` on custom focusable rows so focused inputs clear bottom sheets and keyboards completely. |
| **Desktop / TUI / Game UI** | Subtract pinned toolbar/status-bar dimensions from scroll-into-view calculations (Qt `QScrollArea::ensureWidgetVisible`, WinUI/WPF/Avalonia `BringIntoView`, TUI/HUD viewport row clamping on keyboard/controller focus step). |

## European Accessibility Act (`EAA` / `EN 301 549`) production readiness

For B2C digital products, e-commerce checkouts, consumer banking/fintech, passenger transport services, e-books, and communications serving EU users, technical `WCAG 2.2 AA` / `EN 301 549` conformance must be paired with operational release readiness (escalating final legal sign-off to counsel):

1. **Public Accessibility Statement:** link persistently from global navigation, footer, app settings, or store listing; state the applied technical standard (`EN 301 549` / `WCAG 2.2 AA`), publication/review date, and honest conformance status (`fully`, `partially`, or `non-conformant`).
2. **Known limitations & accessible workarounds:** explicitly list any unresolved third-party embeds, archival documents, or exempted media alongside a concrete alternative path to complete the same user task.
3. **Assistive-technology verification matrix:** document the real OS, browser/runtime, keyboard, text-zoom (`200%`), and screen-reader combinations actually tested (`VoiceOver`, `NVDA`, `TalkBack`, `Narrator`, `Orca`); mark unverified combinations `not-checked` rather than implying universal certification.
4. **Accessible feedback & escalation channel:** provide a barrier-free contact mechanism (accessible form/email/support route free of cognitive CAPTCHAs) with expected response timing and jurisdiction-appropriate enforcement/ombudsman contact placeholders for the product owner to populate.
