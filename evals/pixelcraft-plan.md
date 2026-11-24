# pixelcraft-plan evaluation cases

## Case — resolved versions before choosing an API

Ask for a filter UI in a locked brownfield app; the available docs MCP returns a new-major API that conflicts with the lockfile. Repeat for a greenfield app with the MCP rate-limited, then with both version sources offline.

Pass: preserve the brownfield lock, locate matching official API docs and record the version/source/date/result before building. Fall back to official docs and the registry without requiring MCP. Offline, document the assumption and affected check without claiming a latest version. Reuse matching evidence instead of looking up the same API again.

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


## Case 3 — optional discovery for a rough product idea

**Prompt**

> I have an idea for an app for independent fitness coaches. Help me figure out what to build and what stack makes sense.

**Expected behaviors**

- Selects the discovery path because the user explicitly asks for product shaping and stack guidance.
- Summarizes what is known, then asks about the highest-impact unresolved product outcome before framework questions.
- Offers a small number of plain-language choices with a recommended answer and trade-offs; allows free-form answers.
- Researches repository/environment facts and current technical facts rather than asking the user to supply them.
- Resolves dependencies progressively and records user choices, accepted recommendations, assumptions, scope, non-goals, and validation criteria in existing brief/plan artifacts.
- Stops when material decisions are actionable and obtains approval for a major product/architecture commitment.

**Failure signals**

- opens with a generic questionnaire or asks every category at once.
- makes the user choose libraries before clarifying the product's primary job.
- keeps asking low-impact questions after the plan is actionable.
- treats the agent's recommendation as user approval.

## Case 4 — complete brief does not trigger a grill

**Prompt**

> In this existing repository, add a CSV export button to the report page. Keep the current stack and design system. The export must include the active date filter, respect the current permission check, and have a loading and error state. Use the existing export utility if one exists.

**Expected behaviors**

- Inspects the existing report route, export utilities, permission logic, dependencies, and tests.
- Uses a direct/scoped plan and proceeds without an unnecessary discovery interview.
- Asks only if a material conflict or missing contract cannot be resolved from repository evidence.
- Records any small reversible assumption instead of blocking the task.

**Failure signals**

- asks the user to reselect the stack, platform, or styling system.
- asks generic questions already answered by the prompt or repository.
- treats every unknown detail as a reason to stop.

## Case 5 — brownfield feature discovery after repository inspection

**Prompt**

> I want to add collaboration to this app, but I'm not sure what the first version should include.

**Expected behaviors**

- Maps the existing app, identity/auth model, data ownership, permissions, realtime/offline model, deployment, and current stack before asking.
- Keeps the existing stack unless a separate runtime is genuinely needed and migration is authorized.
- Asks about the most consequential unresolved collaboration workflow and MVP boundary, with concrete options and a recommendation.
- Separates repository facts from user decisions and records resulting data/privacy/permission implications.
- Defers stack comparison unless evidence shows the current stack cannot satisfy a requirement.

**Failure signals**

- starts with a fresh technology shortlist before reading the codebase.
- asks the user for facts already present in manifests, API contracts, or project docs.
- assumes "collaboration" means realtime multiplayer editing without confirming the intended job.
