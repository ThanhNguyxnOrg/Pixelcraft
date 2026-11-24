# Persona walkthrough protocol

Personas are hypothesis generators, not simulated users and not evidence of actual human behavior. Never claim a persona walkthrough proves user satisfaction; use it to expose concrete interaction, input, and recovery gaps, then verify each hypothesis against code or rendered captures.

## Walkthrough cast

| Persona lens | Force through the walkthrough |
|---|---|
| confused novice | zero domain knowledge; relies on visible labels/help; trips over jargon or hidden controls |
| impatient expert | keyboard/bulk/shortcut path; repeats frequent tasks; exposes latency and modal friction |
| screen-reader user | semantic name/role/order/state/status; catches visual-only grouping and silent dynamic updates |
| Voice Control user | speaks visible labels verbatim (WCAG 2.5.3 Label in Name); tests duplicate labels and icon-only controls |
| Switch Access / single-input user | linear step-scanning count, logical focus grouping, zero hover-only or drag-only barriers |
| magnified / 200–400% zoom user | 320 CSS px-equivalent reflow, no horizontal scrolling, sticky headers/bars never occluding focus or forms |
| one-hand mobile user | bottom thumb reach, virtual keyboard occlusion, target spacing, mid-task interruption |
| low-bandwidth / offline user | slow-3G latency, offline draft preservation, stale-cache labeling, idempotent retry without duplicates |
| non-Latin / RTL / IME user | text expansion, RTL mirroring, bidi isolation, locale formats, CJK/Vietnamese/Arabic IME composition |
| stressed / rushed user | low working memory, interruptions, error recovery, accidental destructive-action risk |

## Concrete modality stress checks

Run the applicable checks instead of generic roleplay:

- **Voice Control:** inspect computed accessible names against visible labels (`Label in Name`, WCAG 2.5.3). Reject icon-only controls lacking clear spoken names or pages with five identical `"Edit"` buttons lacking disambiguating context.
- **Switch Access:** count Tab/scan stops from page entry to the primary action; verify skip links, landmark grouping, single-pointer alternatives to dragging (`2.5.7`), and zero hover-only triggers.
- **200–400% zoom & 320 px reflow:** zoom desktop viewport to 200% and 400% (or render at `320 px` logical width). Verify zero horizontal scrollbars for prose/forms, zero clipped buttons, and sticky headers/banners not swallowing active fields (`2.4.11`).
- **Non-Latin IME composition:** test entering Japanese/Chinese/Korean/Vietnamese text where `Enter` confirms an IME candidate (`compositionstart` / `compositionend` / `isComposing`). Confirm `Enter` during composition does **not** prematurely submit the form, close a combobox, or strip combining marks/diacritics.
- **Low-bandwidth / offline:** throttle network to slow 3G and toggle offline mid-form or mid-navigation. Confirm pending state appears within `100 ms`, user input survives disconnect, cached data is marked stale, and retrying does not double-submit.

## Walkthrough record schema

Log each walkthrough concisely so hypotheses stay auditable and clearly separated from confirmed defects:

```markdown
### Walkthrough: <Task name> — Lens: <Persona lens>
- Entry point & preconditions: <route/screen, auth state, viewport/device, locale, network>
- Success criterion: <observable end state>

| Step | User goal | Perceived affordance | Friction / ambiguity | Evidence (`rendered` / `static` / `model-judgment` / `not-checked`) | Promoted finding? |
|---|---|---|---|---|---|
| 1 | Submit Japanese search query | Search field + Enter | `keydown` submits while `e.isComposing === true` (`SearchBar.tsx:48`) | `static` (needs live IME test) | Yes → P1 |
| 2 | Confirm delete | Modal button says "Yes" | Consequence unclear if user skipped body | `rendered` (screenshot `modal.png`) | Yes → P2 |
```

## Protocol

1. Pick 2–4 lenses matched to the highest-risk surface constraints; do not perform theatrical personas unrelated to risk.
2. State exact task, entry point, context, constraints, and success criterion before stepping through.
3. Walk without author knowledge: record what is perceived, what is ambiguous, what happens on error/cancel, and what breaks on reverse navigation.
4. Promote a walkthrough hypothesis to a ranked finding only when grounded in code (`static`) or live inspection (`rendered`).
5. Explicitly record what stayed `not-checked` because a real assistive technology, IME, or hardware device was unavailable.

Do not use personas to launder taste (“the expert would find this ugly”). Use them to expose missing cues, memory burden, unsafe assumptions, and recovery failures.
