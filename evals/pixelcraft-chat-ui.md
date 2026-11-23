# pixelcraft-chat-ui evaluation cases

## Case 1 — slack approval

**Prompt**

> Build a Slack approval card for expense reports.

**Expected behaviors**

- Selects or applies `pixelcraft-chat-ui` behavior when the prompt matches its trigger.
- uses Block Kit surface limits/native actions/ephemeral error behavior.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- wall of text.
- dead buttons.
- public leakage of private validation.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — discord flow

**Prompt**

> Design a Discord bug-report modal and follow-up components.

**Expected behaviors**

- Selects or applies `pixelcraft-chat-ui` behavior when the prompt matches its trigger.
- uses correct component/modal model/ids/expiry/fallback semantics.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- embed-only interaction.
- custom_id collisions.
- no unauthorized state.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
