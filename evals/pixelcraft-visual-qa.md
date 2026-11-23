# pixelcraft-visual-qa evaluation cases

## Case 1 — render check

**Prompt**

> Visually verify a responsive pricing page after implementation.

**Expected behaviors**

- Selects or applies `pixelcraft-visual-qa` behavior when the prompt matches its trigger.
- uses or requests a style inventory when browser automation exists: fonts/type ratio, palette, geometry, cursor/motion, transfer/JS/request counts, LCP/CLS, and basic semantic checks as JSON.
- renders target sizes and inspects screenshot evidence rather than build success only.
- executes the primary user task or explicitly labels behavior not run; captures feedback/end state/failure trace rather than only a loaded page.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- claims checked after compilation.
- no viewport matrix.
- missing evidence labels.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — fix loop

**Prompt**

> Repair clipped text and contrast failures found in a screenshot.

**Expected behaviors**

- Selects or applies `pixelcraft-visual-qa` behavior when the prompt matches its trigger.
- uses inspect-critique-fix loop and re-checks only affected evidence.
- calibrates critic confidence, suppresses duplicate/root-cause findings, avoids low-confidence churn, and governs baseline updates by cause rather than making checks pass.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- random CSS churn.
- no before/after comparison.
- ignores root cause.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
