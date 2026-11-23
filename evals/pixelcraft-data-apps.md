# pixelcraft-data-apps evaluation cases

## Case 1 — streamlit tool

**Prompt**

> Build a Streamlit operations explorer with filters and empty states.

**Expected behaviors**

- Selects or applies `pixelcraft-data-apps` behavior when the prompt matches its trigger.
- uses idiomatic data-app execution/state patterns.
- handles rerun/cache/error/empty behavior.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- web SPA assumptions.
- hidden state mutation.
- blank cache failure.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — gradio review

**Prompt**

> Review a Gradio model demo before launch.

**Expected behaviors**

- Selects or applies `pixelcraft-data-apps` behavior when the prompt matches its trigger.
- designs input/output/progress/error/privacy states for model latency.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- single happy-path textbox.
- no queue/failure state.
- fake confidence claims.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
