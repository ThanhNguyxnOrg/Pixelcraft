# pixelcraft-game-ui evaluation cases

## Case 1 — hud design

**Prompt**

> Design a first-person exploration HUD with controller navigation.

**Expected behaviors**

- Selects or applies `pixelcraft-game-ui` behavior when the prompt matches its trigger.
- prioritizes legibility/safe area/input modality/state priority.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- MMO chrome overload.
- tiny text.
- hover-only inventory.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — menu flow

**Prompt**

> Build a game settings menu for keyboard and controller.

**Expected behaviors**

- Selects or applies `pixelcraft-game-ui` behavior when the prompt matches its trigger.
- models focus/navigation/rebinds/confirmation/accessibility states.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- mouse-only layout.
- lost focus.
- no rebind conflict handling.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
