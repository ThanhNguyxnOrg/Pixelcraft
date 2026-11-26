# `.pixelcraft/plan.md` template

```markdown
# Pixelcraft plan

## Mode and scope
- Planning mode: brownfield / greenfield / hybrid
- Task route: new project / extend existing product / edit or fix / redesign or rebuild / behavior-preserving refactor
- Task:
- Date/agent:
- Prior plan change/waiver:

## Evidence base
- Repository areas inspected:
- Not inspected / uncertainty:
- Requirement sources:
- Design brief path/status:

| Fact/requirement | Class (`user-provided` / `repo-observed` / `artifact-observed` / `research/analytics` / `assumption` / `unknown`) | Evidence scope/path | Consequence if wrong |
|---|---|---|---|
|  |  |  |  |

## Discovery status
- Adaptive discovery mode: Grill-Me / Deep Shaping | Fast Confirm | Direct Execution
- Trigger or reason deep discovery was unnecessary:
- Business KPIs & 1–2 primary CTAs:
- 5-second hierarchy goal (what first-time viewers grasp & where they act):
- Content & CMS ownership (source of truth, post-launch editor workflow, localization ownership):
- Target regulatory & store regime (App Store, Google Play, Chrome `MV3`, EU `EAA` / `EN 301 549`, Steam Deck/Console `TRC`, Print `PDF/X-4`, Bulk Email `RFC 8058`, or N/A):
- Anti-goals & hate-list (rejected competitor tropes / visual or UX patterns):
- Material decisions resolved (user-selected / recommendation accepted / repository-constrained):
- Assumptions and their consequences:
- Unresolved decisions, owner, and next check:
- Approval boundary/status (including Design Approval `<HARD-GATE>` status):

## Stack decision
- Chosen stack:
- Platform skill: `pixelcraft-…`
- Framework reference: `references/…` inside that skill
- Runner-up:
- Why runner-up lost:
- Rejected lazy default(s) & rationale (see `references/stack-selection.md`):
- Hard constraints/gates:
- Reversal conditions:
- Confidence:
- Runtime, package manager, and lockfile:
- Update ownership and opt-in dependency automation:
- Creative Direction → Plan feedback loop updates (if a winning direction upgraded the renderer/runtime):

### Sub-Stack Capability → Purpose-Built Library Gate
List every complex UI capability in scope (rich text, code editor, node graph, map, >500-row table, command palette, drawer/sheet, toast, carousel, search UI, drag-and-drop, date/calendar picker, media player, PDF, charts, complex forms). Do not hand-roll DIY substitutes.

| Capability in scope | Chosen library / native primitive | Rejected lazy default / DIY substitute | A11y / license / version note |
|---|---|---|---|
|  |  |  |  |

| Package/runtime + resolved version | Version-sensitive API or compatibility question | Version source and matching API docs (date) | Compatibility / verification command + outcome | Evidence (`static` / `not-checked`) |
|---|---|---|---|---|
|  |  |  |  |  |

- Record an assumption and its impact when a source could not be verified. Add a row before introducing a new version-sensitive API later in the task.

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
- Content/CMS & asset licensing pipeline:
- i18n/localization (`IME` & `Unicode NFC` scope):
- CI/test/visual tooling:
- Packaging/store/regulatory constraints:

## Surfaces and modes
| Surface/screen | Mode | Input modality | Notes |
|---|---|---|---|

## UX work required
- Flows to design:
- State matrices required:
- Accessibility/legal floor specifics (including sticky-chrome focus & `EAA` statement if applicable):
- Localization scope (`+30–40%` prose / `+50–100%` short-label expansion, `IME`, RTL):

## Adaptive UI by device or window class
| Class, sample size/aspect, input | Navigation, density, controls and reach | Task/data/state to preserve | Runtime, acceptance check, evidence/status |
|---|---|---|---|
|  |  |  |  |

For responsive web, consider small and large phone portrait, phone landscape, tablet portrait and landscape, foldable or split pane, laptop, desktop, ultrawide and short-height. Record applicable cases or a product-specific reason for exclusion; tool unavailability is `not-checked`. Choose sizes at content/layout transitions, not from user-agent names. For other resizable surfaces use the corresponding platform geometry and inputs.

## Design-system authority
- Existing authoritative decisions:
- Partial/inconsistent/missing areas:
- Token export/handoff needs:

## Mandatory completion gate & scan-until-clean contract (Definition of Done `<HARD-GATE>`)
Implementation MUST NOT stop or claim completion until every applicable row below is executed, repaired, and re-verified clean (`exit 0` on all deterministic scans and build checks, `0` `fail`/`pending` rows in `.pixelcraft/acceptance.json`, and **Rule #0.3** satisfied):

- Acceptance manifest initialized: `node <path>/check-acceptance.mjs --init <platform> --out .pixelcraft/acceptance.json`
- Agreed numeric & device thresholds (startup/LCP/INP/CLS/frame-rate, payload/install size, target viewports/devices/clients):
- Available verification runtimes here: rendered / static / device / browser / simulator / snapshot / CI
- Genuinely unavailable here (`not-checked` + exact missing binary/device reason):

| Gate | Exact command or checklist to execute | Required pass condition before stopping | Final status (`exit 0` / `PASS` / `not-checked`) |
|---|---|---|---|
| Slop & floor static scan | `node <path>/slop-scan.mjs <target> --fail-on p2` | `exit 0` (`0` `P0`/`P1`/`P2` findings; `scan → fix → rescan` until clean) |  |
| Surface / token scanners | `<check-contrast.mjs / check-email.mjs / check-tui.mjs / check-pdf.mjs / export-tokens.mjs>` | `exit 0` across all applicable modes/targets (`scan → fix → rescan` until clean) |  |
| Active-language compiler, linter, dep audit & tests | `<strict compiler / typecheck / analyzer / linter / dep-audit / test command>` | `exit 0` with zero newly introduced errors, unpatched advisories, or blanket suppressions |  |
| Mandatory checklists walked item-by-item | `pixelcraft` `floor.md` (`A1–A8`) + `pixelcraft-<platform>` `Pre-submit checklist` + `pixelcraft-review` `polish.md` (`B1–B6`) | 100% of applicable items verified in code/render (fix & re-check any failing row) |  |
| Rendered task QA & finish gate | `<shoot.mjs / simulator / CLI capture + finish-gate.mjs evidence.json>` | `PASS` (up to 3 rendered repair rounds before escalating blocked visual conflict as `OPEN`) |  |
| Studio acceptance manifest (`Rule #0.3`) | `node <path>/check-acceptance.mjs .pixelcraft/acceptance.json` | `0` `fail`/`pending` rows; `rendered` on visual/perf/interactive-a11y; verdict `PASS_STUDIO_10K_20K` / `EXCEEDS_STUDIO` (or `PENDING_RENDERED_ENV` exit `2` if external hardware absent) |  |

## Existing behavior and replacement boundaries
| Contract (entry point, flow, content, data, accessibility/localization, etc.) | Inspected source and current evidence | Preserve or authorized change | Baseline and regression check |
|---|---|---|---|
|  |  |  |  |

## Risks and open questions
- Risks:
- Questions that materially affect implementation:
- Explicit waivers:
```

Rules: write facts before recommendations; link key evidence paths; keep the file concise enough for later agents to read; update rather than silently discard prior decisions.
