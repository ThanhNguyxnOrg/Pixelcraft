---
name: pixelcraft-review
description: Audits, critiques, and polishes UI with evidence-backed findings. Use for UX/design review, heuristic evaluation, accessibility/state/floor audits, implementation polish, slop detection, pre-handoff inspection, redesign critique, persona walkthroughs, or verification reporting. Produces severity-ranked findings with file:line or screenshot evidence, confidence, concrete fixes, distinctiveness/repetition analysis, and honest not-checked labels.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft review

Review is evidence work, not taste commentary. Never say “looks good” or “accessible” without naming scope and method.

Treat detector hits as leads. Confirm task, content, contrast, clipping and focus defects in the actual state. Decorative gradient text, repeated accent rails, familiar fonts/palettes, card stacks, emoji and eyebrow labels require brief or design-system context, not blanket bans. Compare failing and passing examples before adding a rule. For an approved brand exception use the scanner's `--waivers FILE` with a JSON array of `{rule,file,line,reason}` entries (paths relative to the scan root). Keep unused waivers visible and remove stale ones; the scanner only accepts selected aesthetic IDs, not accessibility/task failures.

For a substantial review, first critique the brief and captures without detector scores, then audit rendered evidence and scanner hits; combine them by user impact. Limit regression claims to the changed scope or verify against the prior baseline; don't hide pre-existing failures or reset baselines to get a pass.

## References

- Read [references/heuristics.md](references/heuristics.md) when translating Nielsen's 10 heuristics into concrete checks.
- Read [references/personas.md](references/personas.md) for structured persona walkthroughs. Treat personas as hypothesis generators.
- Read [references/polish.md](references/polish.md) for final optical/state/copy/motion/dark-mode/long-string inspection.
- Read [references/critique-protocol.md](references/critique-protocol.md) before structured critique/design decision review.
- Read [references/audit-report.md](references/audit-report.md) before writing an audit report.
- Run `node scripts/slop-scan.mjs --help` for deterministic fingerprint scanning (use `--fail-on P0|P1|P2|P3` to fail review/CI gates on severity threshold, and `--waivers FILE` only for approved brand rules). The scanner is evidence input, not a judge of good design.

## Modes

| Mode | Use | Output |
|---|---|---|
| audit | verify floor/state/a11y/copy/implementation against criteria | severity-ranked findings + evidence + unverified scope |
| critique | evaluate direction, hierarchy, distinctiveness, coherence | strengths, risks, alternatives, decision recommendation |
| polish | improve an accepted implementation without changing direction | concrete micro-fixes in alignment/spacing/states/copy/motion |

Do not silently redesign during polish. Do not treat an audit as complete when only static code was inspected.

## Adversarial Defect-Hunt Iron Law & Rationalization Table

**IRON LAW:** Assume defects exist until proven otherwise. Actively hunt unfinished stubs (`// TODO`, ellipsis truncation), dead handlers (`onClick={() => {}}`, `href="#"`), unwired mobile navigation, lazy DIY substitutes (hand-rolled modals/editors/charts/tables/toasts/drawers/carousels), lazy platform defaults (Tkinter/raw-Flexbox email/`window.print()` PDFs), and unapproved 3-item hardcoded mock arrays masquerading as live data.

| Reviewer rationalization | Reality & required action |
|---|---|
| "`slop-scan.mjs` returned 0 findings, so the UI is clean." | Zero static hits proves only absence of scanned regexes. Inspect rendered captures, interactive flows, keyboard focus, and architectural DIY slop (`references/heuristics.md`). |
| "The desktop layout looks polished, so mobile is probably fine." | Unwired hamburger toggles, clipped drawers, and hidden primary actions hide in narrow viewports. Explicitly inspect and exercise mobile navigation and reflow (`320px`). |
| "Those 3 sample cards and `+24.5%` stats are fine for a demo." | Unapproved mock arrays and invented KPI deltas violate Truthfulness (`P0`) unless explicitly requested by the user and visibly labeled as fixture/demo data. |
| "The custom `<div>` modal works when I click it." | Click-only `<div>` modals break focus trap, `inert` backdrop, `Escape` dismissal, and focus restoration. Flag as Architectural / DIY Slop (`P1`). |
| "There's a `// TODO` on the secondary action, I'll skip mentioning it." | Dead handlers and omitted branches on in-scope UI are delivery defects (`P0`/`P1`). Report every unfinished interactive path with `file:line`. |

## Severity taxonomy

| Severity | Meaning | Examples |
|---|---|---|
| P0 | floor violation/blocker/deception | inaccessible primary task, invented proof, data loss, unreadable critical content, unapproved fake live data |
| P1 | major UX failure / architectural slop | missing error recovery, broken back state, unwired mobile nav, empty primary handler, DIY broken modal/editor/table, wrong platform idiom, severe clipping |
| P2 | quality defect affecting comprehension/efficiency/trust | weak hierarchy, inconsistent state, vague error copy, AI marketing clichés, poor localization resilience |
| P3 | polish/craft refinement | optical alignment, rhythm, copy tightening, restrained motion refinement |

Every finding requires: severity, evidence (`file:line`, screenshot region/device state, tool output), confidence (`high/medium/low`), user impact, concrete fix, and evidence label (`rendered/static/model-judgment/not-checked/waived`). No unlabeled certainty.

## Protocol

1. Establish scope, mode, direction card/project system, commit/build state, target platforms, locales, and user tasks.
2. Gather deterministic evidence first: run `slop-scan.mjs` (with `--fail-on` where gating), tests, and builds; inspect files; capture rendered/device states via `pixelcraft-visual-qa` where possible.
3. Walk primary flows using personas as hypotheses; do not claim they are users.
   Actively inspect changed routes and diffs for unfinished handlers, `// TODO` stubs, ellipsis truncation, `href="#"` links, unwired mobile navigation, lazy DIY widgets, and unapproved mock arrays presented as live truth. Confirm suspected omissions through the affected interaction; a TODO in an unrelated test or a truthful empty state is not a failure.
4. Apply heuristics (including **Architectural / DIY Slop** in `references/heuristics.md`) and floor checks. Separate actual violation from risk/opportunity; use the structured critique protocol when the output informs a design decision.
5. Compare against slop fingerprints and `.pixelcraft/history.json`; identify repetition or absence of subject commitment.
6. Rank by user impact and floor authority, not ease of fixing.
7. Report verified positives only when material; prioritize actionable findings and unverified scope.

## Distinctiveness check

Ask whether removing the subject would leave a generic interface. Compare composition/type/color/material/motion/imagery/copy fingerprints with history. A repetition is not automatically wrong inside one coherent product; repetition across unrelated surfaces or absence of any subject-derived commitment is a finding.

## Review termination

One repair pass is appropriate for clear deterministic findings. Stop when findings become speculative, require unavailable user/business knowledge, or need device/access human review. Report `not-checked` rather than inventing certainty.

## Pre-submit checklist

- [ ] Adversarial defect hunt completed for stubs (`// TODO`, ellipsis), empty handlers (`onClick={() => {}}`, `href="#"`), unwired mobile nav, unapproved mock data, and lazy DIY substitutes.
- [ ] `slop-scan.mjs` executed (with `--fail-on` threshold where applicable) and paired with rendered/manual inspection—never treated as sole pass proof.
- [ ] Every finding includes severity (`P0`–`P3`), exact `file:line` or capture evidence, confidence, user impact, concrete fix, and evidence label.
- [ ] Architectural / DIY Slop and Nielsen + AI/agentic heuristics (`references/heuristics.md`) audited against the changed scope.
- [ ] Distinctiveness and `.pixelcraft/history.json` repetition checked; any brand waivers are explicit and non-floor only.
- [ ] Unchecked surfaces, devices, or states are explicitly listed as `not-checked` with no false "looks good / ready" claim.
