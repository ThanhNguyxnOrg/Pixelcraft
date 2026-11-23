# pixelcraft-spatial evaluation cases

## Case 1 — visionos scene

**Prompt**

> Design a visionOS volume for inspecting a mechanical part.

**Expected behaviors**

- Selects or applies `pixelcraft-spatial` behavior when the prompt matches its trigger.
- chooses window/volume/space intentionally and respects privacy/hover/depth behavior.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- floating desktop clone.
- ornament clutter.
- logs gaze unnecessarily.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — webxr comfort

**Prompt**

> Build a WebXR warehouse training scene with locomotion.

**Expected behaviors**

- Selects or applies `pixelcraft-spatial` behavior when the prompt matches its trigger.
- uses correct session/input/reference-space lifecycle plus comfort/accessibility settings.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- forced camera motion.
- no frame budget.
- no non-XR fallback.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
