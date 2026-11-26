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
- Read [references/polish.md](references/polish.md) for the **Comprehensive Studio-Grade Polish & Delivery Gate**: 5-second hierarchy, Invisible Craft (`B1–B6`), non-happy-path/`404`/`500`/`IME`/`+50–100%` short-label resilience, and stack-neutral engineering & license handoff.
- Read [references/critique-protocol.md](references/critique-protocol.md) before structured critique/design decision review.
- Read [references/audit-report.md](references/audit-report.md) before writing an audit report.
- Run `node scripts/slop-scan.mjs --help` for deterministic fingerprint scanning (use `--fail-on P0|P1|P2|P3` to fail review/CI gates on severity threshold, and `--waivers FILE` only for approved brand rules). The scanner is evidence input, not a judge of good design.

## Modes

| Mode | Use | Output |
|---|---|---|
| audit | verify floor/state/a11y/copy/engineering/handoff against criteria | severity-ranked findings + Studio-Grade Gate summary + unverified scope |
| critique | evaluate direction, 5-second hierarchy, distinctiveness, coherence | strengths, risks, alternatives, decision recommendation |
| polish | harden an accepted implementation to the Studio-Grade bar (`references/polish.md`) without changing direction | concrete fixes across `B1–B6` micro-craft, states, `IME`/i18n, and release hygiene |

Do not silently redesign during polish. Do not treat an audit as complete when only static code was inspected.

## Adversarial Defect-Hunt Iron Law & Rationalization Table

**IRON LAW:** Assume defects exist until proven otherwise. Actively hunt unfinished stubs (`// TODO`, ellipsis truncation), dead controls (no-op callbacks, unbound commands, placeholder links), unwired mobile navigation, unguarded `IME` `Enter` submits, missing `404`/`500`/offline/error recovery, lazy DIY substitutes (hand-rolled modals/editors/charts/tables/toasts/drawers/carousels), lazy platform defaults (Tkinter/raw-Flexbox email/`window.print()` PDFs), client-exposed secrets, unverified font/media licenses, and unapproved 3-item hardcoded mock arrays masquerading as live data.

| Reviewer rationalization | Reality & required action |
|---|---|
| "`slop-scan.mjs` returned 0 findings, so the UI is clean." | Zero static hits proves only absence of scanned regexes. Inspect rendered captures, interactive flows, `B1–B6` micro-craft, keyboard focus, and architectural DIY slop (`references/heuristics.md`, `references/polish.md`). |
| "The desktop layout looks polished, so mobile is probably fine." | Unwired hamburger toggles, clipped drawers, sticky-chrome focus occlusion (`2.4.11`), and hidden primary actions hide in narrow viewports. Explicitly exercise `320px` reflow and mobile navigation. |
| "Those 3 sample cards and `+24.5%` stats are fine for a demo." | Unapproved mock arrays and invented KPI deltas violate Truthfulness (`P0`) unless explicitly requested by the user and visibly labeled as fixture/demo data. |
| "The custom click-only modal works when I click it." | Non-semantic modals break focus trap, `inert` backdrop, `Escape` dismissal, and focus restoration. Flag as Architectural / DIY Slop (`P1`). |
| "There's a `// TODO` on the secondary action, I'll skip mentioning it." | Dead controls and omitted branches on in-scope UI are delivery defects (`P0`/`P1`). Report every unfinished interactive path with `file:line`. |
| "I fixed the findings, no need to re-run `slop-scan` / `check-*` / compiler." | **Forbidden.** Fixes frequently introduce new specificity, contrast, focus, or syntax regressions. Always re-run all affected scans and checklists until they exit `0`. |

## Severity taxonomy

| Severity | Meaning | Examples |
|---|---|---|
| P0 | floor violation/blocker/deception | inaccessible primary task, sticky-chrome focus trap/total occlusion, invented proof, leaked client secret, unlicensed commercial font/asset, data loss, unapproved fake live data |
| P1 | major UX failure / architectural slop | missing error/`404`/`500`/offline recovery, premature `IME` `Enter` submit, broken back state, unwired mobile nav, dead primary control, DIY broken modal/editor/table, failing strict language checks |
| P2 | quality defect affecting comprehension/efficiency/trust | weak 5-second hierarchy, `>2` unjustified font families, `>75ch` prose wall, muddy `#000000` dark-mode shadows (`B4`), jittering proportional digits (`B6`), clipped `+50–100%` short labels, `Unicode NFC` fallback ransom-note glyphs |
| P3 | polish/craft refinement | `+1–2` unit optical icon centroid nudge (`B2`), concentric radius tweak, asymmetric exit timing (`B3`), warm-tooltip chain (`B1`), microcopy tightening |

Every finding requires: severity, evidence (`file:line`, screenshot region/device state, tool output), confidence (`high/medium/low`), user impact, concrete fix, and evidence label (`rendered/static/model-judgment/not-checked/waived`). No unlabeled certainty.

## Protocol

1. Establish scope, mode, direction card/project system, commit/build state, target platforms, regulatory/store regime, locales, and user tasks.
2. Gather deterministic evidence first: run `slop-scan.mjs <target> --fail-on p2`, applicable surface CLIs (`check-contrast.mjs`, `check-email.mjs`, `check-tui.mjs`, `check-pdf.mjs`), strict active-language compiler/type/linter checks, and tests; inspect files; capture rendered/device states via `pixelcraft-visual-qa` where possible.
3. Walk primary and non-happy-path flows (`loading`, `empty`, `error`, `offline`, `404`/`500`, `permission-denied`, `IME` composition `Enter`, `+50–100%` short-label expansion) using personas as hypotheses; confirm suspected stubs, dead controls, or DIY widgets through the affected interaction.
4. Walk **100% of applicable checklist rows** across `polish.md` (**Studio Invisible Craft `B1–B6`**, **5-Second Hierarchy**, **Non-Happy-Path & Input Completeness**, **Commercial Handoff Hygiene**), the active platform skill's `Pre-submit checklist`, and `references/heuristics.md`.
5. Compare against slop fingerprints and `.pixelcraft/history.json`; identify repetition or absence of subject commitment.
6. Rank by user impact and floor authority, not ease of fixing. When polishing or verifying an implementation, run **`Scan → Fix → Rescan`** until `slop-scan.mjs --fail-on p2`, applicable `check-*` CLIs, compiler/tests, and in-scope checklist rows pass cleanly (`exit 0`), then report using `references/audit-report.md`.

## Distinctiveness check

Ask whether removing the subject would leave a generic interface. Compare composition/type/color/material/motion/imagery/copy fingerprints with history. A repetition is not automatically wrong inside one coherent product; repetition across unrelated surfaces or absence of any subject-derived commitment is a finding.

## Scan-until-clean & review termination

When verifying or polishing an implementation, **do not stop after a single pass while deterministic scan (`P0–P2`), compiler/test, stub, state, or floor-checklist defects remain**: fix every confirmed defect and re-run `slop-scan.mjs --fail-on p2`, applicable `check-*` scripts, and active-language checks until `exit 0`. Stop only once deterministic gates are clean and remaining observations become purely speculative taste, require unavailable user/business facts, or depend on unavailable external hardware (reported honestly as `not-checked`, never as passed).

## Pre-submit checklist

- [ ] Adversarial defect hunt completed for stubs (`// TODO`, ellipsis), dead controls/links, unwired mobile nav, unguarded `IME` `Enter` handlers, client secrets, unapproved mock data, and lazy DIY substitutes.
- [ ] **`Scan → Fix → Rescan` loop completed to `exit 0`:** `slop-scan.mjs --fail-on p2`, applicable `check-*` CLIs, and strict active-language compiler/type/analyzer/test suites re-executed after every edit until clean, paired with rendered/manual inspection.
- [ ] Studio-Grade Polish & Delivery Gate (`references/polish.md`) and active platform `Pre-submit checklist` walked row-by-row across 5-second hierarchy, Invisible Craft (`B1–B6`), non-happy-path + `+50–100%` short-label/`NFC` resilience, and `<10m` setup / license / ownership handoff.
- [ ] Every finding includes severity (`P0`–`P3`), exact `file:line` or capture evidence, confidence, user impact, concrete fix, and evidence label.
- [ ] Distinctiveness and `.pixelcraft/history.json` repetition checked; any brand waivers are explicit and non-floor only.
- [ ] Unchecked surfaces, devices, regulatory regimes, or states are explicitly listed as `not-checked` with no false "looks good / ready" claim.
