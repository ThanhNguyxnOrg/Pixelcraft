# pixelcraft-mobile evaluation cases

## Case 1 — ios android flow

**Prompt**

> Build a mobile expense-capture flow in SwiftUI and Compose.

**Expected behaviors**

- Selects or applies `pixelcraft-mobile` behavior when the prompt matches its trigger.
- uses native navigation/input/haptic/safe-area/platform idioms.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- same web layout on both.
- missing dynamic type.
- keyboard covers input.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — offline app

**Prompt**

> Design an offline-first field inspection mobile app.

**Expected behaviors**

- Selects or applies `pixelcraft-mobile` behavior when the prompt matches its trigger.
- models sync/conflict/permission/connectivity states explicitly.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- spinner-only offline state.
- lost drafts.
- no restore path.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
