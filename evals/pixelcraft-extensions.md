# pixelcraft-extensions evaluation cases

## Case 1 — browser popup

**Prompt**

> Build a browser-extension popup for reviewing saved citations.

**Expected behaviors**

- Selects or applies `pixelcraft-extensions` behavior when the prompt matches its trigger.
- respects extension lifecycle/permissions/storage/popup constraints.
- uses least privilege.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- persistent web-app assumptions.
- broad host permissions.
- dead popup state.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — ide webview

**Prompt**

> Design a VS Code webview settings panel.

**Expected behaviors**

- Selects or applies `pixelcraft-extensions` behavior when the prompt matches its trigger.
- uses webview messaging/theme/csp/accessibility correctly.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- hard-coded theme colors.
- unsafe HTML injection.
- no postMessage lifecycle.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
