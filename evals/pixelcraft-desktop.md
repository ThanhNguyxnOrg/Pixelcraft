# pixelcraft-desktop evaluation cases

## Case 1 — native app

**Prompt**

> Build a Tauri disk-image mounter for macOS and Windows.

**Expected behaviors**

- Selects or applies `pixelcraft-desktop` behavior when the prompt matches its trigger.
- respects platform window/menu/input/file-security idioms.
- handles background and error states.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- portable web page in a shell.
- wrong keyboard/menu conventions.
- no permission states.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — qt review

**Prompt**

> Review a Qt settings dialog.

**Expected behaviors**

- Selects or applies `pixelcraft-desktop` behavior when the prompt matches its trigger.
- uses platform layout/model-view/accessibility conventions appropriately.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- absolute web-like layout.
- missing keyboard mnemonics.
- no validation feedback.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
