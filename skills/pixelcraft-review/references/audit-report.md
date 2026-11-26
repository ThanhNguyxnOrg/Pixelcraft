# Audit report template

```markdown
# Pixelcraft audit: <surface/commit/date>

**Mode:** audit|critique|polish  
**Scope:** <flows/screens/platforms/locales/themes/input modalities>  
**Method:** <rendered/static/tools/personas/model judgment>  
**Direction/system:** <selected direction or existing system inspected>

## Summary

- P0: n · P1: n · P2: n · P3: n
- Acceptance manifest (`check-acceptance.mjs`): `FAIL` (exit `1`) | `PENDING_RENDERED_ENV` (exit `2`) | `PASS_STUDIO_10K_20K` (exit `0`) | `EXCEEDS_STUDIO` (exit `0`)
- Highest-risk unknown: <scope not checked>
- Overall recommendation: <block/fix-before-release/fix-normal/polish>

## Findings

| ID | Severity | Finding | Evidence | Label | Confidence | User impact | Concrete fix |
|---|---|---|---|---|---|---|---|
| F1 | P0/P1/P2/P3 | <observable defect> | `file:line` or screenshot region/device state | rendered/static/model-judgment | high/med/low | <who/what task> | <specific change> |

## Positive evidence

- <only material verified strengths; omit praise padding>

## Distinctiveness/repetition

- History file: `.pixelcraft/history.json` inspected/not present/not writable.
- Slop scan: <score/findings; note zero ≠ good design>.
- Subject-derived commitment: <present/weak/absent + evidence>.

## Studio-grade delivery & acceptance gate (`polish.md` + `check-acceptance.mjs`)

| Pillar | Status (`pass`/`fail`/`not-checked`/`waived`) | Evidence & scope | Label |
|---|---|---|---|
| 1. Art direction & 5-second hierarchy (`≤2` fonts+`1` mono, `45–75ch`, 1–2 CTAs) |  |  |  |
| 2. Invisible craft (`B1` timing, `B2` optical/concentric, `B3` origin/exit, `B4` dark `L`/edge, `B5` hit-slop/Safe Triangle/capture, `B6` `tnum`/`U+2212`) |  |  |  |
| 3. States, latency (`<=100ms`/`>1s`/`>10s`), a11y (`2.4.11`/`EAA`), `IME` `Enter` guard & `+50–100%` short-label / `NFC` i18n |  |  |  |
| 4. Stack-neutral engineering (`<10m` setup, strict checks, dep audit, staging split, zero secrets) & license/30–90d warranty handoff |  |  |  |
| 5. `.pixelcraft/acceptance.json` (`A1–A8` + 12-row Surface Matrix + platform thresholds & deliverables) |  |  |  |

## Not checked / waived

- `<label>` <scope> — concrete reason, explicit client sign-off (if `waived`), consequence, and next command.

## Recommended order

1. <P0/P1 sequence>
2. <risk reduction/verification>
3. <optional polish>
```

Do not bury a blocker in prose. Do not convert absence of automated findings into conformance language.

## Evidence Rule #0.3 & 3-tier Studio verdict rubric

- **Golden Evidence Rule (`Rule #0.3`):** **`static` or `model-judgment` NEVER counts as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements.** Those rows require `rendered` evidence—or must be recorded honestly as `not-checked` (with concrete reason) or `waived` (with explicit user authorization, scope, and consequence).
- **3-Tier Final Grading (`check-acceptance.mjs`):**
  - **`FAIL` (`exit 1` — Not Accepted):** any Baseline `A1–A8`, 12-row Surface Matrix, or platform threshold/checklist/deliverable item is `fail` or `pending`, or relies on `static`/`model-judgment` where `rendered` evidence is required (`Rule #0.3`). **Do not approve or claim completion.**
  - **`PASS_STUDIO_10K_20K` (`exit 0` — Studio $10k–$20k Bar)** *(or `PENDING_RENDERED_ENV` `exit 2` when physical hardware/store runtime is genuinely unavailable)*: all applicable rows pass on target environments (`rendered` where required) and any `not-checked`/`waived` row carries concrete justification or explicit user sign-off.
  - **`EXCEEDS_STUDIO` (`exit 0` — Exceeds Bar):** meets `PASS_STUDIO_10K_20K` plus real-user usability testing, live A/B experimentation, deep multi-locale native review, or high-scale systems integration.

## Confidence calibration

Use `high` only when the evidence directly demonstrates the defect or requirement in the stated scope. Use `medium` when the inference is strong but depends on runtime/user/context not fully inspected. Use `low` for hypotheses that should guide testing, not implementation churn. Every high-confidence critique should identify observable evidence; if it cannot, downgrade it.

Record false positives and duplicate/root-cause grouping in the notes when iterating. Do not let repeated model critique manufacture independent findings from one underlying defect. When findings become contradictory or increasingly cosmetic after a repair pass, stop and report residual uncertainty rather than continuing indefinitely.
