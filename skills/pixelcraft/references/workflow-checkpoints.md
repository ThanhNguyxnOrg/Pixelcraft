# Workflow checkpoints

## Choose the task route during Plan

Classify both the project (greenfield, brownfield or hybrid) and the requested change. A new screen in an existing product is not a new project. For mixed work, name the route per affected surface and verify shared contracts.

| Task route | Required scope |
|---|---|
| New project | Run the full loop and produce each applicable result below. Identify platform, audience, hard constraints and real material before choosing a compatible stack. Diverge wherever visual direction is undecided; use the approved-design path where it is already fixed. Specify complete flows and applicable states before coding. |
| Extend existing product | For a new screen, feature or platform, first read the existing entry points/navigation, design system, data contracts, locked stack and neighboring tests. Then frame the new task, decide direction only where unresolved, and specify its full flow and applicable states before building. Reuse the existing stack where it fits; do constrained stack selection when a new platform or separate runtime requires one. Verify both the new outcome and affected existing paths. |
| Edit or fix | Trace the affected entry point, component, state/data path, tokens and checks. Record the current behavior or defect, intended change and invariants. Use a scoped brief and spec; keep unchanged visual decisions. Reproduce a reported defect where possible, then verify the fix and affected neighbors. |
| Redesign or rebuild | Inventory existing routes or entry points, task outcomes, content/data, accessibility and localization, and other relevant contracts. Record what stays, what changes, and how each preserved or migrated contract will be checked before replacing anything. Diverge only in the undecided scope. A rebuild does not by itself authorize a new stack, dropped routes or changed outcomes. |
| Behavior-preserving refactor | Inventory consumers and observable contracts first. Reuse the approved direction and assert output, interactions, accessibility behavior and public contracts before/after where affected. Do not turn an internal change into a visual redesign. |

## Optional discovery interview boundary

Use the discovery path inside `pixelcraft-plan` only when the user asks to shape/brainstorm/compare options, or when a material decision remains unresolved and could change the product outcome, scope, platform, architecture, data model, or major constraints. Inspect the repository and artifacts before asking. The agent must research discoverable facts; the user decides priorities, preferences, and approvals.

For each material choice, explain why it matters, offer a small set of credible options, recommend one with evidence and trade-offs, and allow a free-form answer or “you decide”. Ask one principal question per turn by default; defer dependent choices until prerequisites are resolved. Stop when the plan is actionable rather than interrogating every implementation detail.

Do not interview for a complete brief, approved design, straightforward fix, or narrow edit. For low-impact unknowns, choose a reversible default and record the assumption. For high-impact or hard-to-reverse choices, obtain the user's decision before committing to that direction. If the user skips discovery, use conservative defaults and surface material risks.

## Check before advancing

Use the existing brief, plan, direction card, checks and report; link or summarize their relevant sections in the plan rather than creating a separate set of artifacts. For each phase, record the result and point to what you actually read, inspected or ran (path and section or symbol; source and date; command and outcome; rendered artifact and state). Name the constraint or decision it established. A filename list, headings-only skim, or search hit without reading the relevant surrounding code or rule does not count. Use current evidence only; reread affected sections when inputs or scope change. If the workspace cannot be written, keep the same record in the run or handoff.

| Phase | Exit evidence |
|---|---|
| 0. Plan | Record the task route, scoped requirements, stack/version decision, applicable platform and reference, and verification capabilities. For existing products, cite the inspected conventions, runtime/lock, affected UI/state path (or the new surface's integration points) and relevant tests; identify preserved behavior and its verification baseline. Where a stack must be selected, include requirements, weighted stack comparison and version sources. |
| 1. Frame | Record the target user, job, real material, surface mode, constraints and a concrete task success condition in the brief. Reuse a brief only after checking those facts against the current scope. |
| 2. Diverge | Record the selected direction, scored alternatives and repetition check for undecided scope. Where direction is already fixed, cite the approved design or existing convention and state why divergence is not applicable. |
| 3. Specify | Record the direction card or scoped decision, task flows, applicable states and acceptance checks, including how preserved behavior will be verified. Resolve material assumptions that determine implementation before building. |
| 4. Build | Point to implementation and its platform/reference decisions. Check against the spec, applicable floor, and preserved contracts before handing off to verification. Do not count stubs, simulated production outcomes, or unapproved dependency changes as delivery. |
| 5. Verify | Record checks and observed outcomes for the actual task and relevant regressions. Include rendered evidence when the runtime is available and the finish gate for new or materially changed flows. Compilation or a loaded screen alone proves neither behavior nor visual quality. |
| 6. Report | Point to the results and artifacts, report open failures and unchecked scope, and include the next discriminating check when work remains. |

Use the standard evidence labels. Explain why a branch is not applicable rather than marking it as passed; reserve `waived` for explicit user authorization. Mark unavailable requirements `not-checked` with the affected claim. Do not advance dependent work on an unresolved prerequisite or claim completion for an unchecked requirement. Scope reduces the size of the evidence, not the obligation to inspect or verify.
