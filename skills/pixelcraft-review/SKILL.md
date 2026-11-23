---
name: pixelcraft-review
description: Audits, critiques, and polishes UI with evidence-backed findings. Use for UX/design review, heuristic evaluation, accessibility/state/floor audits, implementation polish, slop detection, pre-handoff inspection, redesign critique, persona walkthroughs, or verification reporting. Produces severity-ranked findings with file:line or screenshot evidence, confidence, concrete fixes, distinctiveness/repetition analysis, and honest not-checked labels.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft review

Review is evidence work, not taste commentary. Never say “looks good” or “accessible” without naming scope and method.

## References

- Read [references/heuristics.md](references/heuristics.md) when translating Nielsen's 10 heuristics into concrete checks.
- Read [references/personas.md](references/personas.md) for structured persona walkthroughs. Treat personas as hypothesis generators.
- Read [references/polish.md](references/polish.md) for final optical/state/copy/motion/dark-mode/long-string inspection.
- Read [references/critique-protocol.md](references/critique-protocol.md) before structured critique/design decision review.
- Read [references/audit-report.md](references/audit-report.md) before writing an audit report.
- Run `node scripts/slop-scan.mjs --help` for deterministic fingerprint scanning. The scanner is evidence input, not a judge of good design.

## Modes

| Mode | Use | Output |
|---|---|---|
| audit | verify floor/state/a11y/copy/implementation against criteria | severity-ranked findings + evidence + unverified scope |
| critique | evaluate direction, hierarchy, distinctiveness, coherence | strengths, risks, alternatives, decision recommendation |
| polish | improve an accepted implementation without changing direction | concrete micro-fixes in alignment/spacing/states/copy/motion |

Do not silently redesign during polish. Do not treat an audit as complete when only static code was inspected.

## Severity taxonomy

| Severity | Meaning | Examples |
|---|---|---|
| P0 | floor violation/blocker/deception | inaccessible primary task, invented proof, data loss, unreadable critical content |
| P1 | major UX failure | missing error recovery, broken back state, wrong platform idiom, severe clipping |
| P2 | quality defect affecting comprehension/efficiency/trust | weak hierarchy, inconsistent state, vague error copy, poor localization resilience |
| P3 | polish/craft refinement | optical alignment, rhythm, copy tightening, restrained motion refinement |

Every finding requires: severity, evidence (`file:line`, screenshot region/device state, tool output), confidence (`high/medium/low`), user impact, concrete fix, and evidence label (`rendered/static/model-judgment/not-checked/waived`). No unlabeled certainty.

## Protocol

1. Establish scope, mode, direction card/project system, commit/build state, target platforms, locales, and user tasks.
2. Gather deterministic evidence first: run scanners/tests/builds; inspect files; capture rendered/device states where possible.
3. Walk primary flows using personas as hypotheses; do not claim they are users.
4. Apply heuristics and floor checks. Separate actual violation from risk/opportunity; use the structured critique protocol when the output informs a design decision.
5. Compare against slop fingerprints and `.pixelcraft/history.json`; identify repetition or absence of subject commitment.
6. Rank by user impact and floor authority, not ease of fixing.
7. Report verified positives only when material; prioritize actionable findings and unverified scope.

## Distinctiveness check

Ask whether removing the subject would leave a generic interface. Compare composition/type/color/material/motion/imagery/copy fingerprints with history. A repetition is not automatically wrong inside one coherent product; repetition across unrelated surfaces or absence of any subject-derived commitment is a finding.

## Review termination

One repair pass is appropriate for clear deterministic findings. Stop when findings become speculative, require unavailable user/business knowledge, or need device/access human review. Report `not-checked` rather than inventing certainty.
