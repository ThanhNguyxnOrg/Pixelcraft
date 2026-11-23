---
name: pixelcraft-plan
description: Runs before other Pixelcraft skills to map brownfield repositories or plan greenfield products. Use when starting UI work, choosing a frontend stack, inventorying an existing codebase, identifying framework/design-system constraints, selecting among languages or platforms, creating implementation strategy, or producing the .pixelcraft/plan.md consumed by later Pixelcraft skills.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft plan

This skill runs **first**, before `pixelcraft-direction`, UX specification, platform implementation, review, or brand generation. Its job is evidence before taste: understand the repository that exists or choose the stack that should exist.

## Brownfield/greenfield decision

Classify the task before acting:

- **Brownfield:** a repository, application, package, prototype, or existing design system exists—even if the requested surface is new.
- **Greenfield:** no meaningful implementation exists, or the user explicitly asks for stack selection from scratch.
- **Hybrid:** existing product but new surface/platform. Inventory the existing system first, then run constrained greenfield selection.

Do not infer greenfield merely because the current folder is empty; inspect parent context, user brief, linked assets, and whether an existing product/database/API constrains the choice.

## Brownfield workflow

1. **Scope the read.** Enumerate repository roots, packages/apps, generated/vendor directories, and ownership boundaries. Do not skim only `package.json`.
2. **Inventory systematically.** Use [references/repo-discovery.md](references/repo-discovery.md): languages/frameworks, entry points, routing/screens, design tokens/theme/components, styling approach, state management, i18n, tests/visual tooling, CI, packaging, runtime constraints, accessibility evidence, and legal/privacy constraints.
3. **Distinguish fact from inference.** Cite key files in the repo map. Classify material facts as user-provided, repo-observed, artifact-observed, analytics/research, assumption, or unknown. Mark unread/generated/ignored areas explicitly.
4. **Intake design inputs.** Use [references/design-input.md](references/design-input.md) for Figma, screenshots, mockups, existing UI, prototypes, and reference imagery: classify specification versus inspiration, record provenance/version/breakpoints/constraints, assess completeness, and decide whether `pixelcraft-handoff` is needed.
5. **Map existing authority.** Decide whether tokens/components/conventions are authoritative, partial, inconsistent, or absent. Existing project decisions outrank Pixelcraft taste.
6. **Write `.pixelcraft/plan.md`** using [references/plan-template.md](references/plan-template.md). Include exact platform skill/framework reference routing and available verification capabilities.

## Greenfield workflow

1. **Intake requirements before candidates:** target platforms/input modalities, audience/locales, team languages and operational experience, offline/network model, performance/hardware constraints, accessibility/legal requirements, distribution/store/update model, existing backend/protocol, maintenance horizon, budget/timeline, hard exclusions, and any supplied design inputs. Classify those inputs using [references/design-input.md](references/design-input.md). Ask only for missing facts that materially change selection.
2. **Generate candidates across languages.** Use [references/stack-selection.md](references/stack-selection.md). Consider the full catalog rather than defaulting to TypeScript/React.
3. **Build a weighted matrix.** Choose weights from requirements, score evidence honestly, include uncertainty, and reject candidates that fail hard constraints regardless of weighted total.
4. **Recommend one stack plus runner-up.** Record why the runner-up lost. Any web choice must be justified against native/TUI/server-rendered alternatives; TypeScript/React is never a default.
5. **Write `.pixelcraft/plan.md`** before visual direction begins.

## Required plan contents

The plan must state: chosen stack; platform skill and framework reference by name; surfaces/screens; mode per surface; UX flows/state matrices to design; existing design-system authority; design-input classification/provenance/completeness and the handoff decision; i18n/accessibility/legal constraints; risks/unknowns; verification capabilities available in the current environment; evidence classification for material facts; and open questions. Link or embed the design brief when one exists. Later skills consume this plan instead of rediscovering the repository or silently changing stack.

## Hard rules

- Do not select a stack before inventorying hard constraints.
- Do not rely on training-data memory for version-sensitive APIs, config syntax, or current package versions. When choosing a greenfield stack or upgrading dependencies, verify current versions and APIs using whatever live docs/registry capability the host provides (such as a documentation MCP like Context7, official docs lookup, or package registry queries like `npm view`); if unavailable, record the assumed version in `.pixelcraft/plan.md` as `assumption` / `not-checked`.
- Do not treat familiarity, hype, or example availability as evidence of fit.
- Do not hide uncertainty behind precise scores; annotate confidence.
- Do not overwrite an existing `.pixelcraft/plan.md` without preserving prior decisions and recording why they changed.
- Do not write implementation before this plan exists unless the user explicitly waives planning.

## Reference routing

- Read [references/repo-discovery.md](references/repo-discovery.md) for brownfield inventory order and ecosystem signal files.
- Read [references/design-input.md](references/design-input.md) when the task includes Figma, screenshots, mockups, prototypes, existing UI, or visual references.
- Read [references/stack-selection.md](references/stack-selection.md) for criteria, weighting, matrix format, and use-case shortlists.
- Read [references/plan-template.md](references/plan-template.md) before writing `.pixelcraft/plan.md`.
