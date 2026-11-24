# pixelcraft-patterns evaluation cases

## Case 1 — pattern choice

**Prompt**

> Design a collaborative document editing empty state and permissions flow.

**Expected behaviors**

- Selects or applies `pixelcraft-patterns` behavior when the prompt matches its trigger.
- selects named product pattern intentionally and completes state matrix.
- records the workflow/navigation decision matrix evidence and rejected alternative rather than inheriting a template.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- generic dashboard cards.
- missing unauthorized state.
- pattern name without substance.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — flow review

**Prompt**

> Review a multi-step import flow.

**Expected behaviors**

- Selects or applies `pixelcraft-patterns` behavior when the prompt matches its trigger.
- recognizes wizard/progressive disclosure/recovery patterns and their failure modes.
- covers empty-result diagnosis beyond “no results” and dense-table selection persistence/virtualization semantics where relevant.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- linear happy path only.
- no resume/rollback.
- hidden validation.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 3 — immersive narrative that remains readable

**Prompt**

> Design a chapter-based product story with a pinned artifact on desktop and a readable sequence on mobile.

**Expected behaviors**

- Writes a linear chapter outline before selecting scroll effects.
- Uses native flow/sticky layout first and GSAP ScrollTrigger only when complex choreography justifies it.
- Provides chapter anchors, browser history, reverse/fast-scroll recovery, meaningful progress, and static/reduced-motion alternatives.

**Failure signals**

- Hides copy at scroll thresholds, breaks scrollbar/history, or makes story comprehension depend on animation.
