# pixelcraft-handoff evaluation cases

## Case 1 — figma implement

**Prompt**

> Implement this Figma checkout selection in our existing React design system.

**Expected behaviors**

- Selects or applies `pixelcraft-handoff` behavior when the prompt matches its trigger.
- records provenance/approval/breakpoint/mode and maps variables/components before coding.
- reuses existing components and preserves the approved visual direction instead of running divergence.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- copies generated markup.
- duplicates existing components.
- hard-codes token values.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — ambiguity handling

**Prompt**

> Translate a screenshot-only settings mockup into production UI.

**Expected behaviors**

- Selects or applies `pixelcraft-handoff` behavior when the prompt matches its trigger.
- classifies screenshot evidence as partial specification, documents assumptions/missing states, translates into the actual project stack, and validates fidelity with declared region-aware tolerance.
- normalizes viewport/scale/theme/locale/data fixtures before diffing and treats clipping/focus/contrast/state mismatch as hard failures independent of pixel tolerance.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- absolute-positioned screenshot clone.
- invents destructive behavior.
- pixel-only equality claim.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
