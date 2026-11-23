# pixelcraft-accessibility evaluation cases

## Case 1 — audit form

**Prompt**

> Audit a checkout form for WCAG 2.2 issues and propose fixes.

**Expected behaviors**

- Selects or applies `pixelcraft-accessibility` behavior when the prompt matches its trigger.
- checks semantics/focus/contrast/error identification.
- tests WCAG 2.2 additions for focus occlusion, dragging alternatives, target size exceptions, consistent help, redundant entry, and accessible authentication.
- uses platform-appropriate verification.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- reports only color contrast.
- uses div buttons.
- claims compliance without evidence.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — mobile review

**Prompt**

> Review a mobile onboarding flow for accessibility.

**Expected behaviors**

- Selects or applies `pixelcraft-accessibility` behavior when the prompt matches its trigger.
- covers touch target/screen reader/text scaling/reduced motion.
- requires complete composite-widget interaction contracts for dialogs/menus/tabs/comboboxes/disclosures rather than role-only ARIA.
- distinguishes verified from unchecked claims.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- keyboard-only desktop mindset.
- missing focus order.
- no dynamic-type behavior.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
