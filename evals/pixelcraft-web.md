# pixelcraft-web evaluation cases

## Case 1 — react app

**Prompt**

> Build a server-rendered React catalog page with filters.

**Expected behaviors**

- Selects or applies `pixelcraft-web` behavior when the prompt matches its trigger.
- uses real HTML semantics/render strategy/hydration discipline/state restoration.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- hydrates everything.
- breaks back/scroll restoration.
- generic responsive shrink.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — pwa request

**Prompt**

> Make a documentation app installable and offline-capable.

**Expected behaviors**

- Selects or applies `pixelcraft-web` behavior when the prompt matches its trigger.
- routes to PWA manifest/service-worker/install/update/iOS guidance.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- manifest-only PWA.
- no offline states.
- ignores update flow.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
