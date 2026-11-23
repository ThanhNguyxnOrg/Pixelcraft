# pixelcraft-plan evaluation cases

## Case 1 — greenfield plan

**Prompt**

> Plan a greenfield desktop screenshot annotation tool.

**Expected behaviors**

- Selects or applies `pixelcraft-plan` behavior when the prompt matches its trigger.
- intakes constraints and compares stack choices with weighted evidence.
- classifies key facts as user-provided, repo-observed, artifact-observed, analytics/research, assumption, or unknown.
- inventories supplied design inputs and classifies specification versus inspiration before visual decisions.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- chooses favorite framework first.
- no platform matrix.
- missing brownfield/greenfield distinction.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — brownfield mapping

**Prompt**

> Map this unfamiliar repo before changing UI.

**Expected behaviors**

- Selects or applies `pixelcraft-plan` behavior when the prompt matches its trigger.
- inspects architecture/framework evidence and writes useful plan artifacts.
- links the design brief status and separates evidence from assumptions/unknowns in the plan.
- records design provenance/version/breakpoints, missing dimensions, assumptions, and whether handoff is required.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- starts editing immediately.
- summary without file evidence.
- no unresolved-risk list.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
