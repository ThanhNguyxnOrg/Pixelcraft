---
name: pixelcraft-plan
description: Plans greenfield and brownfield UI work, runs Socratic Grill-Me discovery interviews for ambiguous or greenfield briefs, selects platforms and technology stacks while rejecting lazy defaults, maps complex capabilities to purpose-built libraries, checks dependency freshness and lockfile reproducibility, records architecture decisions (ADR), and produces the .pixelcraft/plan.md consumed by later Pixelcraft skills. Use when starting a product or feature, brainstorming or shaping an ambiguous idea, choosing a stack, mapping an existing brownfield codebase, verifying library versions, or resolving material scope and architecture decisions.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft plan

This skill runs **first**, before `pixelcraft-direction`, UX specification, platform implementation, review, or brand generation. Its job is evidence before taste: inspect the codebase that exists, grill unresolved product/IA/visual/stack branches one question at a time, and choose the stack and libraries that should exist.

## Adaptive discovery modes

Always inspect the repository, manifests, tokens, and supplied artifacts **first** (never ask the user facts readable from the repo), then choose the matching mode:

| Mode | Trigger | Required behavior |
|---|---|---|
| **Grill-Me / Deep Shaping** | Greenfield product, vague/ambiguous brief, major redesign, or user asks to brainstorm / grill / compare options | Read [references/grill-me-protocol.md](references/grill-me-protocol.md). Walk unresolved decision branches **one principal question per turn** with 1-sentence stakes + 2–4 concrete options leading with **(Recommended)** + trade-offs. Stop once actionable. |
| **Fast Confirm** | Clear feature or scoped surface with 1–2 undecided design, IA, or stack/library choices | Read [references/discovery-interview.md](references/discovery-interview.md). Summarize observed evidence, propose concrete recommended defaults + trade-offs in one focused turn, and confirm before coding. |
| **Direct Execution** | Narrow bug fix, copy tweak, visual polish, behavior-preserving refactor, or already-approved design spec | Skip discovery interviewing. Record a concise scoped `.pixelcraft/plan.md`, use reversible defaults for trivia, and proceed directly. |

## Brownfield/greenfield decision

Classify the task before acting:

- **Brownfield:** a repository, application, package, prototype, or existing design system exists—even if the requested surface is new.
- **Greenfield:** no meaningful implementation exists, or the user explicitly asks for stack selection from scratch.
- **Hybrid:** a new surface in an existing product needs a separate stack/runtime decision. Inventory the existing system first, then run constrained greenfield selection. A new surface on the current stack follows brownfield planning.

Do not infer greenfield merely because the current folder is empty; inspect parent context, user brief, linked assets, and whether an existing product/database/API constrains the choice.

Record the task route separately: new project, extend existing product, edit/fix, redesign/rebuild, or behavior-preserving refactor. To extend an existing product, map the affected integration points and conventions first, then plan the new surface's requirements, flows, states and acceptance checks. Keep the existing stack unless a separate decision is needed and in scope.

## Brownfield workflow

1. **Scope the read (Codebase-First Gate).** Enumerate repository roots, packages/apps, generated/vendor directories, and ownership boundaries. Do not skim only `package.json`.
2. **Inventory systematically.** Use [references/repo-discovery.md](references/repo-discovery.md): languages/frameworks, entry points, routing/screens, design tokens/theme/components, styling approach, state management, i18n, tests/visual tooling, CI, packaging, runtime constraints, accessibility evidence, and legal/privacy constraints.
3. **Distinguish fact from inference.** Cite key files in the repo map. Classify material facts as user-provided, repo-observed, artifact-observed, research/analytics, assumption, or unknown. Mark unread/generated/ignored areas explicitly.
4. **Intake design inputs.** Use [references/design-input.md](references/design-input.md) for Figma, screenshots, mockups, existing UI, prototypes, and reference imagery: classify specification versus inspiration, record provenance/version/breakpoints/constraints, assess completeness, and decide whether `pixelcraft-handoff` is needed.
5. **Map existing authority.** Decide whether tokens/components/conventions are authoritative, partial, inconsistent, or absent. Existing project decisions outrank Pixelcraft taste.
6. **Resolve material open decisions.** After inspecting the repo and artifacts, enter **Grill-Me / Deep Shaping** ([references/grill-me-protocol.md](references/grill-me-protocol.md)) or **Fast Confirm** ([references/discovery-interview.md](references/discovery-interview.md)) if outcome, anti-goals, IA, visual ambition, or architecture remains unresolved. Ask only what the repo and docs cannot answer.
7. **Apply the Capability Library Gate & check versions.** Map any complex UI capability (editor, chart, >500-row table, command palette, drawer, toast, carousel, search, DnD, calendar, map, node graph, PDF, media player, complex form) to a vetted library using [references/stack-selection.md](references/stack-selection.md). Verify version-sensitive APIs via [references/stack-freshness.md](references/stack-freshness.md).
8. **Write `.pixelcraft/plan.md`** using [references/plan-template.md](references/plan-template.md). Include discovery mode/outcome, anti-goals, platform skill/reference routing, capability libraries, and available verification capabilities.

Before modifying an existing surface, read the affected entry point, implementation, shared conventions/tokens, state or data flow, resolved dependencies and relevant tests or fixtures. Record inspected paths or symbols and what each establishes. Capture the current task outcome or failure where tools allow; otherwise record which baseline is `not-checked`. For a redesign or rebuild, map what must be preserved, what may change, and the regression check for each material contract. An implementation replacement is not authorization to remove existing behavior.

## Greenfield workflow

1. **Inspect supplied context and run adaptive discovery.** Review the brief, conversation, and artifacts. Unless the brief is fully specified or the user explicitly asks you to decide and build directly, run **Grill-Me / Deep Shaping** ([references/grill-me-protocol.md](references/grill-me-protocol.md)) one principal question per turn—covering **Business KPIs & 1–2 Primary CTAs**, Anti-Goals/Hate-List, **5-Second Hierarchy & Content/CMS Ownership**, Visual Ambition, Stack Craft Bar, and **Target Regulatory/Store Regime** + Critical States.
2. **Intake technical & commercial constraints before candidates:** target platforms/input modalities, audience/locales (`IME`/RTL), team languages and operational experience, content/CMS authoring model, offline/network model, performance/hardware constraints, **regulatory & store regimes** (App Store, Google Play, Chrome `MV3`, EU `EAA` / `EN 301 549`, Steam Deck/Console `TRC`, Commercial Print `PDF/X-4`, Bulk Email `RFC 8058`), existing backend/protocol, maintenance horizon, budget/timeline, hard exclusions, and supplied design inputs ([references/design-input.md](references/design-input.md)).
3. **Reject lazy defaults and generate candidates across languages.** Use [references/stack-selection.md](references/stack-selection.md). Reject Tkinter for greenfield Python desktop, unjustified Electron wrappers, Streamlit for multi-user/DAG BI, bare `print()` TUIs, WebView consumer mobile apps, `window.print()` PDFs, raw-Flexbox email, and DIY web widgets unless explicitly waived.
4. **Build a weighted matrix & resolve sub-stack libraries.** Reject candidates that fail hard constraints regardless of total score. Complete the **Sub-Stack Capability → Purpose-Built Library Gate** so no fragile DIY editors, charts, tables, drawers, toasts, carousels, or search widgets slip into Build.
5. **Verify and recommend one stack plus runner-up.** Apply [references/stack-freshness.md](references/stack-freshness.md) before finalizing versions and APIs. Record why the runner-up lost. Any web choice must be justified against native/TUI/server-rendered alternatives; TypeScript/React is never an unexamined default, nor artificially avoided when its ecosystem is the best fit.
6. **Write `.pixelcraft/plan.md`** before visual direction begins, and keep the **Creative Direction → Plan Feedback Loop** open: if `pixelcraft-direction` wins approval for a concept needing Rive, WebGPU, Typst, Tauri, or a native runtime, update `.pixelcraft/plan.md` cleanly before Build.

## Required plan contents

The plan must state: **business KPIs & 1–2 primary CTAs**; **5-second hierarchy goal**; **content/CMS ownership**; **target regulatory/store regime**; chosen stack and rejected lazy defaults; platform skill and framework reference by name; Sub-Stack Capability → Purpose-Built Library mappings; surfaces/screens; mode per surface; UX flows/state matrices to design; existing design-system authority; design-input classification/provenance/completeness and handoff decision; i18n/accessibility/legal constraints; risks/unknowns; verification capabilities available here; evidence classification for material facts; and open questions. Record the adaptive discovery mode (`Grill-Me` / `Fast Confirm` / `Direct Execution`), anti-goals/hate-list, user-selected decisions, accepted recommendations, assumptions, and approval gate status.

For adaptable surfaces, fill out the device class matrix in the plan before building. Name supported sizes and inputs, what changes in navigation, density and task controls, what stays equivalent, and how each applicable class or transition will be checked. Include height and aspect ratio, not just width.

## Iron Laws & Rationalization Table

- **IRON LAW 1:** Never ask the user facts readable from the repo, manifests, lockfiles, or supplied artifacts.
- **IRON LAW 2:** Never dump a multi-question questionnaire wall; walk unresolved branches **one principal question per turn** with **(Recommended)** options and trade-offs.
- **IRON LAW 3:** Never silently invent product scope, accept lazy defaults (Tkinter, unjustified Electron, raw Flexbox email, DIY modals/charts/editors), or bypass design approval on undecided greenfield/redesign work.

| Agent rationalization | Reality & required action |
|---|---|
| "The brief is short, so I'll just pick defaults and start coding fast." | Short greenfield briefs hide the highest-cost unknowns. Enter **Grill-Me / Deep Shaping** (one question at a time) unless the user explicitly told you to decide and build directly. |
| "I'll ask all 8 questions at once to save turns." | Question walls overwhelm users and ask downstream questions invalidated by upstream answers. Ask the single highest-leverage unresolved branch per turn. |
| "Tkinter / Streamlit / raw `<div>` modal / hand-coded SVG chart is quicker and avoids dependencies." | Lazy defaults and DIY substitutes fail accessibility, edge cases, and visual craft. Enforce the Lazy-Default Rejection and Sub-Stack Capability tables. |
| "Planning locked the stack, so I can't adopt the stronger creative concept." | Use the **Creative Direction → Plan Feedback Loop**: update `.pixelcraft/plan.md` cleanly when the approved direction warrants a better runtime or renderer. |
| "I remember the latest API for this library." | Training memory drifts. Verify current versions/APIs via docs/registry tools or mark `assumption` / `not-checked` explicitly. |

## Hard rules

- Do not select a stack before inventorying hard constraints.
- Do not rely on training-data memory for version-sensitive APIs, config syntax, or package versions; verify via available docs/registry tools or mark `assumption` / `not-checked`.
- Keep brownfield runtime and dependencies unless an upgrade is in scope. For new apps, commit a reproducible lockfile; never resolve floating `@latest` on every CI build.
- Do not overwrite an existing `.pixelcraft/plan.md` without preserving prior decisions and recording why they changed.
- Do not write implementation before `.pixelcraft/plan.md` exists unless the user explicitly waives planning.

## Pre-submit checklist

- [ ] Codebase-first inspection completed and cited (zero questions asked about repo-observable facts).
- [ ] Correct adaptive mode chosen (`Grill-Me / Deep Shaping`, `Fast Confirm`, or `Direct Execution`) with **business KPIs & 1–2 primary CTAs**, **5-second hierarchy goal**, **content/CMS ownership**, **regulatory/store regime**, and anti-goals recorded before visual styling.
- [ ] Stack selected against hard constraints with lazy defaults explicitly rejected (or waived by user) and version sources cited or labeled `not-checked`.
- [ ] Every complex UI capability in scope mapped in the **Sub-Stack Capability → Purpose-Built Library Gate** (no DIY modals, editors, charts, large tables, search, toasts, drawers, or carousels).
- [ ] Device/window class matrix, verification capabilities, and preservation boundaries documented in `.pixelcraft/plan.md`.
- [ ] Approval boundary clear before handing off to `pixelcraft-direction` / `pixelcraft-ux` (no premature implementation on undecided scope).

## Reference routing

- Read [references/grill-me-protocol.md](references/grill-me-protocol.md) for the Socratic one-question-per-turn decision tree on greenfield, ambiguous, redesign, or brainstorm requests.
- Read [references/discovery-interview.md](references/discovery-interview.md) for adaptive discovery mode selection, Fast Confirm framing, decision memory, and approval boundaries.
- Read [references/repo-discovery.md](references/repo-discovery.md) for brownfield inventory order and ecosystem signal files.
- Read [references/design-input.md](references/design-input.md) when the task includes Figma, screenshots, mockups, prototypes, existing UI, or visual references.
- Read [references/stack-selection.md](references/stack-selection.md) for weighted stack selection, the Lazy-Default Rejection Table, the Sub-Stack Capability Library Gate, and the Direction → Plan feedback loop.
- Read [references/stack-freshness.md](references/stack-freshness.md) when choosing or upgrading versions, or setting up dependency maintenance for a generated app.
- Read [references/plan-template.md](references/plan-template.md) before writing `.pixelcraft/plan.md`.
