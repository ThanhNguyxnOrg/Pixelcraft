# pixelcraft-document evaluation cases

## Case 1 — invoice PDF

**Prompt**

> Generate a multi-page invoice PDF with line items and localized currency.

**Expected behaviors**

- Selects or applies `pixelcraft-document` behavior when the prompt matches its trigger.
- controls named pages/breaks/repeated headers/totals/fonts.
- tests actual PDF extraction.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- screen CSS assumptions.
- totals split from rows.
- unembedded missing glyphs.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — slide deck

**Prompt**

> Design a technical launch deck for projector delivery.

**Expected behaviors**

- Selects or applies `pixelcraft-document` behavior when the prompt matches its trigger.
- uses one idea per slide/type scale/safe area/export verification.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- dense bullet walls.
- tiny code screenshots.
- untested edge clipping.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
