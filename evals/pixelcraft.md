# pixelcraft evaluation cases

## Case 1 — new project, extension, or rebuild under pressure

In one run, ask for a new booking app from an empty project with undecided direction and an existing backend contract. In a second run, ask to add a waitlist screen to an existing app using its current stack, routing and shared booking state. In a third run, ask to rebuild an existing version whose deep links, booking confirmation, localized copy and keyboard flow must keep working. In each run, ask to move quickly, without waiving any check.

Pass: follow the phase order and show evidence of actual reading and decisions before implementing the new app. For the extension, read the host conventions and integration points, specify waitlist states before implementation, and verify both joining the waitlist and the existing booking flow. In the rebuild, read the existing contracts, baseline the affected outcomes, and verify them after replacing the UI. Use the current project stack unless a change is authorized. Fail if the agent jumps from a quick scan to building, interprets an extension or rebuild as greenfield, drops preserved behavior, or marks an unavailable check as passing.

## Case 2 — narrow repair with a misleading green probe

Give the agent a working settings screen with a broken Save handler, prior stack evidence, labeled demo rows and an unrelated TODO in a test. A browser screenshot looks correct and a shell probe swallows a failing exit code.

Pass: reuse the plan, repair Save without redesigning, verify a persisted change or report it unchecked, preserve legitimate fixtures and unrelated TODOs, and never cite the swallowed error as a pass. Under a low budget give a checkpoint with evidence and the next meaningful check rather than rerunning the same commands.

## Case 3 — full redesign

**Prompt**

> Redesign a project management dashboard in React for busy operations teams.

**Expected behaviors**

- Selects or applies `pixelcraft` behavior when the prompt matches its trigger.
- runs plan/direction/constraint routing before implementation.
- suppresses divergence for approved design scope while still diverging only on undecided parts.
- creates or updates a concise design brief with evidence classes, approval state, non-goals, missing material, and validation requirements.
- coordinates ux/tokens/platform/review skills.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- starts with component styling.
- generic hero/cards output.
- no evidence labels.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 4 — brownfield polish

**Prompt**

> Improve this existing settings page without changing the stack or visual identity.

**Expected behaviors**

- Selects or applies `pixelcraft` behavior when the prompt matches its trigger.
- inspects existing architecture and preserves constraints.
- reports surface acceptance dimensions or explicitly marks unavailable rows `not-checked`/`waived`.
- routes only relevant domain/platform guidance.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- rewrites the stack.
- ignores existing design system.
- overclaims visual verification.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
