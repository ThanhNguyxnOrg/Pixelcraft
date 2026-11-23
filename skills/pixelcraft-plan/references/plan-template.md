# `.pixelcraft/plan.md` template

```markdown
# Pixelcraft plan

## Mode and scope
- Planning mode: brownfield / greenfield / hybrid
- Task:
- Date/agent:
- Prior plan change/waiver:

## Evidence base
- Repository areas inspected:
- Not inspected / uncertainty:
- Requirement sources:
- Design brief path/status:

| Fact/requirement | Class (`user-provided` / `repo-observed` / `artifact-observed` / `analytics-research` / `assumption` / `unknown`) | Evidence scope/path | Consequence if wrong |
|---|---|---|---|
|  |  |  |  |

## Stack decision
- Chosen stack:
- Platform skill: `pixelcraft-…`
- Framework reference: `references/…` inside that skill
- Runner-up:
- Why runner-up lost:
- Hard constraints/gates:
- Reversal conditions:
- Confidence:

## Design input intake
- Artifact inventory/classification (specification vs inspiration):
- Provenance/version/approval state:
- Breakpoints/modes/locales/input represented:
- Completeness matrix (`specified` / `partial` / `missing` / `not applicable`):
- Explicit assumptions and contradictions:
- Handoff needed? yes / no / partial and scope:
- Visual-fidelity evidence required:

## Repository/system map
- Language/framework inventory:
- Entry points:
- Routing/screens:
- Existing design system/tokens/theme:
- Component library/styling approach:
- State management/data ownership:
- i18n/localization:
- CI/test/visual tooling:
- Packaging/distribution/legal constraints:

## Surfaces and modes
| Surface/screen | Mode | Input modality | Notes |
|---|---|---|---|

## UX work required
- Flows to design:
- State matrices required:
- Accessibility/legal floor specifics:
- Localization scope:

## Design-system authority
- Existing authoritative decisions:
- Partial/inconsistent/missing areas:
- Token export/handoff needs:

## Verification capabilities
- Available here: rendered / static / device / browser / simulator / snapshot / CI
- Commands/tools:
- Cannot verify here (`not-checked`):

## Risks and open questions
- Risks:
- Questions that materially affect implementation:
- Explicit waivers:
```

Rules: write facts before recommendations; link key evidence paths; keep the file concise enough for later agents to read; update rather than silently discard prior decisions.
