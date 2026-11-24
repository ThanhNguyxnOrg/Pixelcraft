---
name: pixelcraft-plan
description: Plans greenfield and brownfield UI work, selects platforms and technology stacks, checks dependency freshness and lockfile reproducibility, records architecture decisions (ADR), and produces the .pixelcraft/plan.md consumed by later Pixelcraft skills. Use when starting a product or feature, choosing a stack, mapping an existing brownfield codebase, verifying library versions, or resolving material scope and architecture decisions. Run a structured discovery interview only when the user's intent or important decisions remain unresolved; skip it for fully specified or narrowly scoped work.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft plan

This skill runs **first**, before `pixelcraft-direction`, UX specification, platform implementation, review, or brand generation. Its job is evidence before taste: understand the repository that exists or choose the stack that should exist.

Planning is required; a long interview is not. Always perform a lightweight preflight, then choose a direct plan or the optional discovery path. Read [references/discovery-interview.md](references/discovery-interview.md) when the user asks to brainstorm/define a project, compare material options, or when an unresolved decision could change the product outcome, scope, platform, stack, architecture, data model, or major constraints. Do not interview users about facts available in the repository or current documentation, and do not turn a small fix or a complete brief into a questionnaire.


## Brownfield/greenfield decision

Classify the task before acting:

- **Brownfield:** a repository, application, package, prototype, or existing design system exists—even if the requested surface is new.
- **Greenfield:** no meaningful implementation exists, or the user explicitly asks for stack selection from scratch.
- **Hybrid:** a new surface in an existing product needs a separate stack/runtime decision. Inventory the existing system first, then run constrained greenfield selection. A new surface on the current stack follows brownfield planning.

Do not infer greenfield merely because the current folder is empty; inspect parent context, user brief, linked assets, and whether an existing product/database/API constrains the choice.

Record the task route separately: new project, extend existing product, edit/fix, redesign/rebuild, or behavior-preserving refactor. To extend an existing product, map the affected integration points and conventions first, then plan the new surface's requirements, flows, states and acceptance checks. Keep the existing stack unless a separate decision is needed and in scope.

## Brownfield workflow

1. **Scope the read.** Enumerate repository roots, packages/apps, generated/vendor directories, and ownership boundaries. Do not skim only `package.json`.
2. **Inventory systematically.** Use [references/repo-discovery.md](references/repo-discovery.md): languages/frameworks, entry points, routing/screens, design tokens/theme/components, styling approach, state management, i18n, tests/visual tooling, CI, packaging, runtime constraints, accessibility evidence, and legal/privacy constraints.
3. **Distinguish fact from inference.** Cite key files in the repo map. Classify material facts as user-provided, repo-observed, artifact-observed, research/analytics, assumption, or unknown. Mark unread/generated/ignored areas explicitly.
4. **Intake design inputs.** Use [references/design-input.md](references/design-input.md) for Figma, screenshots, mockups, existing UI, prototypes, and reference imagery: classify specification versus inspiration, record provenance/version/breakpoints/constraints, assess completeness, and decide whether `pixelcraft-handoff` is needed.
5. **Map existing authority.** Decide whether tokens/components/conventions are authoritative, partial, inconsistent, or absent. Existing project decisions outrank Pixelcraft taste.
6. **Resolve only material open decisions.** After inspecting the repository and design inputs, read [references/discovery-interview.md](references/discovery-interview.md) when the requested outcome, scope, platform, architecture, or another high-impact choice remains unresolved. Ask only what the repository, artifacts, and current research cannot answer. Keep the existing stack unless a separate runtime or authorized migration is necessary.
7. **Check resolved versions and APIs.** Before using a version-sensitive API or changing a dependency, apply [references/stack-freshness.md](references/stack-freshness.md) to the affected package/runtime and API. Use the installed or locked version unless an upgrade is in scope.
8. **Write `.pixelcraft/plan.md`** using [references/plan-template.md](references/plan-template.md). Include the discovery outcome (or why it was not needed), exact platform skill/framework reference routing, and available verification capabilities.

Before modifying an existing surface, read the affected entry point, implementation, shared conventions/tokens, state or data flow, resolved dependencies and relevant tests or fixtures. Record inspected paths or symbols and what each establishes. Capture the current task outcome or failure where tools allow; otherwise record which baseline is `not-checked`. For a redesign or rebuild, map what must be preserved, what may change, and the regression check for each material contract. An implementation replacement is not authorization to remove existing behavior.

## Greenfield workflow

1. **Inspect supplied context and discover intent when needed.** Review the user's brief, conversation, supplied artifacts, and any existing project context. If the project idea or a material product/technical decision is unresolved, use [references/discovery-interview.md](references/discovery-interview.md) before locking requirements. If the brief is already actionable, do not ask redundant questions.
2. **Intake technical constraints before candidates:** target platforms/input modalities, audience/locales, team languages and operational experience, offline/network model, performance/hardware constraints, accessibility/legal requirements, distribution/store/update model, existing backend/protocol, maintenance horizon, budget/timeline, hard exclusions, and any supplied design inputs. Classify those inputs using [references/design-input.md](references/design-input.md). Ask only for missing facts that materially change selection.
3. **Generate candidates across languages.** Use [references/stack-selection.md](references/stack-selection.md). Consider the full catalog rather than defaulting to TypeScript/React.
4. **Build a weighted matrix.** Choose weights from requirements, score evidence honestly, include uncertainty, and reject candidates that fail hard constraints regardless of weighted total.
5. **Verify and recommend one stack plus runner-up.** Apply [references/stack-freshness.md](references/stack-freshness.md) before finalizing the selected versions and APIs. Record why the runner-up lost. Any web choice must be justified against native/TUI/server-rendered alternatives; TypeScript/React is never a default.
6. **Write `.pixelcraft/plan.md`** before visual direction begins.

## Required plan contents

The plan must state: chosen stack; platform skill and framework reference by name; surfaces/screens; mode per surface; UX flows/state matrices to design; existing design-system authority; design-input classification/provenance/completeness and the handoff decision; i18n/accessibility/legal constraints; risks/unknowns; verification capabilities available in the current environment; evidence classification for material facts; and open questions. Record whether planning used the direct or discovery path, the trigger (or why an interview was unnecessary), user-selected decisions, recommendations the user accepted, assumptions, unresolved material questions, and the approval boundary. Link or embed the design brief when one exists. Later skills consume this plan instead of rediscovering the repository or silently changing stack.

For adaptable surfaces, fill out the device class matrix in the plan before building. Name supported sizes and inputs, what changes in navigation, density and task controls, what stays equivalent, and how each applicable class or transition will be checked. Include height and aspect ratio, not just width.

## Hard rules

- Do not select a stack before inventorying hard constraints.
- Do not rely on training-data memory for version-sensitive APIs, config syntax, or current package versions. When choosing a greenfield stack or upgrading dependencies, verify current versions and APIs using whatever live docs/registry capability the host provides (such as a documentation MCP like Context7, official docs lookup, or package registry queries like `npm view`); if unavailable, record the assumed version in `.pixelcraft/plan.md` as `assumption` / `not-checked`.
- Keep brownfield runtime and dependencies unless an upgrade is in scope. For a new application, resolve a compatible supported stable stack and commit its lockfile; never resolve floating `@latest` on every CI build or deploy.
- Do not treat familiarity, hype, or example availability as evidence of fit.
- Do not hide uncertainty behind precise scores; annotate confidence.
- Do not overwrite an existing `.pixelcraft/plan.md` without preserving prior decisions and recording why they changed.
- Do not write implementation before this plan exists unless the user explicitly waives planning.

## Reference routing

- Read [references/repo-discovery.md](references/repo-discovery.md) for brownfield inventory order and ecosystem signal files.
- Read [references/design-input.md](references/design-input.md) when the task includes Figma, screenshots, mockups, prototypes, existing UI, or visual references.
- Read [references/stack-selection.md](references/stack-selection.md) for criteria, weighting, matrix format, and use-case shortlists.
- Read [references/stack-freshness.md](references/stack-freshness.md) when choosing or upgrading versions, or setting up dependency maintenance for a generated app.
- Read [references/discovery-interview.md](references/discovery-interview.md) only when material requirements or decisions are unresolved, or the user explicitly asks to brainstorm/compare options.
- Read [references/plan-template.md](references/plan-template.md) before writing `.pixelcraft/plan.md`.
