# pixelcraft-constrained evaluation cases

## Case 1 — tv interface

**Prompt**

> Design a TV media-library browse screen for D-pad input.

**Expected behaviors**

- Selects or applies `pixelcraft-constrained` behavior when the prompt matches its trigger.
- uses 10-foot hierarchy/overscan/spatial focus/restoration.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- mouse hover UI.
- tiny dense grid.
- focus lost after refresh.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — voice kiosk

**Prompt**

> Design a voice-assisted self-service check-in flow.

**Expected behaviors**

- Selects or applies `pixelcraft-constrained` behavior when the prompt matches its trigger.
- uses short turns/targeted recovery/multimodal fallback/physical timeout privacy.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- repeated prompt loop.
- voice-only critical path.
- no reach/privacy model.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
