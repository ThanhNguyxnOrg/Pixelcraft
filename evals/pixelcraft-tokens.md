# pixelcraft-tokens evaluation cases

## Case 1 — token mapping

**Prompt**

> Convert scattered CSS colors/spacing into DTCG tokens.

**Expected behaviors**

- Selects or applies `pixelcraft-tokens` behavior when the prompt matches its trigger.
- separates primitive/semantic/component layers and preserves mode behavior.
- inventories consumers/direct primitive usage and records migration or waiver state instead of assuming a rewrite is safe.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- renamed hex dump.
- no aliases.
- dark mode inversion.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — theme scaling

**Prompt**

> Add a high-contrast theme to an existing token system.

**Expected behaviors**

- Selects or applies `pixelcraft-tokens` behavior when the prompt matches its trigger.
- maps semantic roles across modes without breaking consumers.
- validates realistic state combinations such as invalid+focus and selected+disabled and records ownership/rollback/deprecation consequences for behavioral changes.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- component overrides everywhere.
- duplicate scales.
- missing contrast validation.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
