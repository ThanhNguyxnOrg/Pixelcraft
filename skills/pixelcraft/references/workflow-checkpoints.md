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

## Adaptive discovery and approval boundary

Choose one of three modes inside `pixelcraft-plan` after inspecting the repository and supplied artifacts first (never ask the user facts readable from the repo):

| Mode | When to use | Interaction & gate |
|---|---|---|
| **Grill-Me / Deep Shaping** | Greenfield product, vague or ambiguous brief, major redesign, or user asks to brainstorm / grill / compare options | Walk unresolved branches of the decision tree strictly **one principal question per turn** with 2–4 concrete options leading with **(Recommended)** + trade-offs. Stop once the plan and direction constraints are actionable. |
| **Fast Confirm** | Clear feature or scoped surface with 1–2 undecided design, IA, or stack/library choices | Inspect the repo/brief, propose concrete defaults with trade-offs in one focused turn, and confirm before coding. |
| **Direct Execution** | Narrow bug fix, copy tweak, visual polish, behavior-preserving refactor, or implementation of an already-approved design | Skip the interview, record a compact scoped brief/plan with reversible defaults, and execute directly. |

The agent researches discoverable facts; the user owns priorities, anti-goals, preferences, and approvals. Accept a direct answer, correction, "you decide", or "skip". If the user explicitly says to decide and build directly, record conservative, reversible defaults and surface material risks.

## Design Approval `<HARD-GATE>` (Phase 2 → Phase 3 → Phase 4)

For **new products, new multi-screen features, or undecided redesigns**, do **not** write implementation code until the user approves the committed design proposal:

1. Present 2–3 materially different direction options (leading with your `(Recommended)` choice and evidence-backed trade-offs),
2. Include a compact **ASCII structural skeleton** and **real-copy headline/primary action draft** for each option (not vague adjectives),
3. State the **stack and sub-stack capability library choices** (rejecting lazy defaults and DIY substitutes), and
4. Wait for user confirmation (or explicit approval of one option / hybrid) before entering **Phase 4 (Build)**.

Bypass this `<HARD-GATE>` **only** when the user explicitly says to decide and build directly without stopping, or when an already-approved design / narrow fix puts the task in **Direct Execution**.

## Completion & Scan-Until-Clean `<HARD-GATE>` (Phase 5 → Phase 6 / Stop)

Never stop after **Phase 4 (Build)** or after a single unverified pass. Before entering **Phase 6 (Report)** or declaring any task complete, execute the planned **Definition-of-Done Completion Contract** from `.pixelcraft/plan.md`:

1. **Execute all applicable deterministic scans & static/build gates:**
   - Run `slop-scan.mjs <changed-or-surface-path> --fail-on p2` (must exit `0` with zero `P0`/`P1`/`P2` findings; `P3` waivers allowed only via explicit user-approved brand waivers).
   - Run every applicable surface/token CLI: `check-contrast.mjs` (tokens/theme pairs), `check-email.mjs` (`--plaintext`, `--headers`), `check-tui.mjs` (`--cols`, non-TTY `NO_COLOR=1`), `check-pdf.mjs` (`--prepress` when print-targeted), `export-tokens.mjs`.
   - Run the active language's strict compiler, typechecker, linter, and unit/integration test suite (`exit 0`, zero newly introduced errors).
2. **Walk every applicable checklist item-by-item (never skim headings):**
   - Normative Floor (`references/floor.md`),
   - Active Platform Skill `Pre-submit checklist` (`pixelcraft-<platform>`), and
   - Studio-Grade Polish & Delivery Gate (`pixelcraft-review` `references/polish.md`: 5-second hierarchy, `B1–B6` Invisible Craft, non-happy-path/`404`/`500`/`IME`/`+50–100%` short-label/`NFC` resilience, and `< 10m` setup / license / ownership handoff).
3. **Run rendered verification & `finish-gate.mjs` where runtime is available:**
   - Capture representative states/breakpoints (`shoot.mjs`, `style-inventory.mjs`, native simulator/emulator, CLI capture, or PDF rasterization) and validate `finish-gate.mjs` on new or materially changed flows.
4. **Enforce `Scan → Fix → Rescan` until clean:**
   - Whenever any deterministic scanner, compiler/test check, or checklist row fails, **fix the underlying defect and re-run the affected scans + checks until they exit `0`**. Never silence rules, hide overflow, strip features, or invent waivers to force a green exit. (Rendered pixel-critique rounds inside `finish-gate.mjs` remain capped at 3 documented rounds before escalating genuinely blocked visual conflicts as `OPEN`.)

## Check before advancing

Use the existing brief, plan, direction card, checks and report; link or summarize their relevant sections in the plan rather than creating a separate set of artifacts. For each phase, record the result and point to what you actually read, inspected or ran (path and section or symbol; source and date; command and outcome; rendered artifact and state). Name the constraint or decision it established. A filename list, headings-only skim, or search hit without reading the relevant surrounding code or rule does not count. Use current evidence only; reread affected sections when inputs or scope change. If the workspace cannot be written, keep the same record in the run or handoff.

| Phase | Exit evidence |
|---|---|
| 0. Plan | Record the task route, adaptive discovery mode (`Grill-Me` / `Fast Confirm` / `Direct Execution`), scoped requirements, stack/version decision, **Sub-Stack Capability → Purpose-Built Library resolution** (for any rich editor, chart, large table, modal/drawer, search, toast, carousel, DnD, calendar, map, node graph, or PDF capability — rejecting lazy defaults and fragile DIY hand-rolls), applicable platform skill and reference, and the **Mandatory Completion Gate & Scan-Until-Clean Contract** (exact scan commands, compiler/test commands, and checklists that block completion). For existing products, cite the inspected conventions, runtime/lock, affected UI/state path (or the new surface's integration points) and relevant tests; identify preserved behavior and its verification baseline. Where a stack must be selected, include requirements, weighted stack comparison and version sources. |
| 1. Frame | Record the target user, job, real material, surface mode, constraints and a concrete task success condition in the brief. Reuse a brief only after checking those facts against the current scope. |
| 2. Diverge | Record the 2–3+ contrasting directions (with ASCII structural skeletons and real-copy lead drafts), evidence-backed scores, repetition check, and **Design Approval `<HARD-GATE>`** outcome for undecided scope. Where direction is already fixed, cite the approved design or existing convention and state why divergence is not applicable. If the winning creative direction requires a stack/renderer upgrade, update `.pixelcraft/plan.md` before advancing. |
| 3. Specify | Record the approved direction card (including ASCII skeleton and real-copy draft), finalized **Sub-Stack Capability → Purpose-Built Library** picks wired into the architecture (confirming zero fragile DIY modals, editors, charts, tables, search, drawers, toasts, or carousels), task flows, applicable states and acceptance checks, including how preserved behavior will be verified. Resolve material assumptions that determine implementation before building. |
| 4. Build | Point to implementation and its platform/reference decisions. Check against the spec, applicable floor, and preserved contracts before handing off to verification. Do not count stubs, `// TODO`s, empty handlers, unwired mobile nav, simulated production outcomes, or unapproved dependency changes as delivery. |
| 5. Verify | Pass the **Completion & Scan-Until-Clean `<HARD-GATE>`**: record exact executed commands, repair-and-rescan iterations, final `exit 0` outcomes for `slop-scan.mjs --fail-on p2`, applicable `check-*` CLIs, and strict compiler/linter/tests, item-by-item sign-off of `floor.md` + platform `Pre-submit` + `polish.md`, plus rendered task evidence and `finish-gate.mjs` status where runtime is available. Compilation or a loaded screen alone proves neither behavior nor visual quality. |
| 6. Report | Point to the clean scan outputs, checklist sign-off, and rendered artifacts; report any genuinely blocked `not-checked` / `OPEN` items and explicit user waivers, and include the next discriminating command when external device/runtime checks remain. |

Use the standard evidence labels. Explain why a branch is not applicable rather than marking it as passed; reserve `waived` for explicit user authorization. Mark unavailable requirements `not-checked` with the affected claim. Do not advance dependent work on an unresolved prerequisite or claim completion for an unchecked requirement. Scope reduces the size of the evidence, not the obligation to inspect or verify.
