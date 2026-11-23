# pixelcraft-media evaluation cases

## Case 1 — og card

**Prompt**

> Generate a social card for a technical documentation launch.

**Expected behaviors**

- Selects or applies `pixelcraft-media` behavior when the prompt matches its trigger.
- uses correct dimensions/safe area/thumbnail-scale hierarchy/truthful content.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- tiny screenshot wall.
- edge-clipped logo.
- fake user metrics.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — motion export

**Prompt**

> Create a short product-announcement animation.

**Expected behaviors**

- Selects or applies `pixelcraft-media` behavior when the prompt matches its trigger.
- uses deterministic frame/aspect/caption/export constraints and validates compression.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- random particle filler.
- missing captions.
- wrong aspect crop.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
