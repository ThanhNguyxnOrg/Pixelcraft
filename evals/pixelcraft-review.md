# pixelcraft-review evaluation cases

## Case 1 — slop review

**Prompt**

> Review this generated landing page for AI slop and UX failures.

**Expected behaviors**

- Selects or applies `pixelcraft-review` behavior when the prompt matches its trigger.
- ranks evidence-backed findings and separates visual/UX/accessibility defects.
- distinguishes defect, behavioral risk, requirement conflict, hypothesis, preference, and scope expansion rather than flattening everything into taste critique.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- vague taste critique.
- style-only scan.
- unverified claims.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — state audit

**Prompt**

> Audit a dashboard implementation before merge.

**Expected behaviors**

- Selects or applies `pixelcraft-review` behavior when the prompt matches its trigger.
- checks states/accessibility/truthfulness/responsive behavior using evidence labels.
- records decision owner/outcome/rationale and calibrates confidence/false positives instead of endless speculative critique.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- screenshot-only approval.
- no empty/error states.
- severity confusion.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
