# Evidence-labeled report template

Use this structure for substantial UI creation or review. Compress it for tiny changes, but never omit unverified floor risks or violate Evidence Rule #0.3.

```markdown
## Pixelcraft report

**Final Studio verdict:** `PASS_STUDIO_10K_20K` | `EXCEEDS_STUDIO` | `PENDING_RENDERED_ENV` *(never submit on `FAIL`)*
**Direction selected:** <name> — <one-sentence rationale>.
**Rejected directions:** <names> — <why each lost, terse>.
**Surface/mode:** <stack/render surface/input modality>; <Persuade/Operate/Read/Experience/Play/Communicate>.

### Implemented & deliverable artifacts
- <user-visible change, files/surface affected, and required deliverable capture/profiler/proof paths>

### Executed scans & checklist gate (`Scan-Until-Clean`)
| Gate / Scanner / Checklist | Command or checklist walked | Repair rounds | Final result |
|---|---|---|---|
| Slop & floor static scan | `node .../slop-scan.mjs <target> --fail-on p2` | <0..N> | `exit 0` (score <N>, 0 P0–P2) |
| Surface / token / build / audit checks | `<check-contrast / check-email / check-tui / check-pdf / compiler / dep-audit / tests>` | <0..N> | `exit 0` / `<not-checked reason>` |
| Checklist walk | `floor.md` (`A1–A8`) + `pixelcraft-<platform>` Pre-submit + `polish.md` (`B1–B6`) | <0..N> | `<all applicable rows passed>` |
| Rendered finish gate | `node .../finish-gate.mjs <evidence.json>` | <0..3> | `PASS` / `OPEN` / `not-checked` |
| Studio acceptance manifest | `node .../check-acceptance.mjs .pixelcraft/acceptance.json` | <0..N> | `PASS_STUDIO_10K_20K` / `EXCEEDS_STUDIO` / `PENDING_RENDERED_ENV` (`0` fail/pending) |

### 12-row surface acceptance & floor verification
| Claim / Universal row | Evidence label | Method/scope | Result |
|---|---|---|---|
| 1. Responsive/adaptive layout | rendered/not-checked/waived | <viewports, orientation, split-pane> | <pass/not-checked/waived> |
| 2–5. Navigation, Input/IME, Focus, States | rendered/not-checked/waived | <task path, IME, interruption, state captures> | <pass/not-checked/waived> |
| 6–8. A11y/SR, Text scale/i18n, Performance | rendered/not-checked/waived | <assistive tool, 200% scale/locale, profiler budget> | <pass/not-checked/waived> |
| 9–12. Safe geometry, Captures, Privacy, Idiom | rendered/static/not-checked/waived | <safe areas, deliverables, audit/licenses/warranty> | <pass/not-checked/waived> |

### Not checked / waived
- `<label>` <item> — concrete reason, user sign-off (if `waived`), consequence, and next command.

### Open risks
- <risk, affected user/context, suggested next check>
```

## Rules

- Use only the five canonical labels: `rendered`, `static`, `model-judgment`, `not-checked`, `waived`.
- **Golden Evidence Rule (`Rule #0.3`):** **`static` or `model-judgment` NEVER counts as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements.** Those rows require `rendered` evidence—or must be recorded honestly as `not-checked` (with concrete reason) or `waived` (with explicit user sign-off, scope, and consequence).
- **3-Tier Final Grading Rubric:**
  - `FAIL (Not Accepted)` (`FAIL`, exit `1`): any Baseline `A1–A8`, 12-row Surface Matrix, or platform threshold/checklist item is `fail`/`pending`, or violates `Rule #0.3`. **Keep fixing and re-verifying; never claim completion.**
  - `PASS (Studio $10k–$20k Bar)` (`PASS_STUDIO_10K_20K`, exit `0`; or `PENDING_RENDERED_ENV` exit `2` when external physical hardware/store runtime is genuinely unavailable): all applicable rows pass on target environments (`rendered` where required) and any `not-checked`/`waived` row is explicitly justified.
  - `EXCEEDS` (`EXCEEDS_STUDIO`, exit `0`): adds real-user research/usability testing, A/B experimentation, deep multi-locale validation, or high-scale systems integration.
- State scope: viewport/device/window, orientation, locale/script/direction, input modality, theme/contrast/motion setting, and dataset size when relevant.
- Never hide a material unknown in prose. Put it in “Not checked / waived.”
