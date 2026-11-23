# Audit report template

```markdown
# Pixelcraft audit: <surface/commit/date>

**Mode:** audit|critique|polish  
**Scope:** <flows/screens/platforms/locales/themes/input modalities>  
**Method:** <rendered/static/tools/personas/model judgment>  
**Direction/system:** <selected direction or existing system inspected>

## Summary

- P0: n · P1: n · P2: n · P3: n
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

## Not checked / waived

- `<label>` <scope> — reason/consequence.

## Recommended order

1. <P0/P1 sequence>
2. <risk reduction/verification>
3. <optional polish>
```

Do not bury a blocker in prose. Do not convert absence of automated findings into conformance language.

## Confidence calibration

Use `high` only when the evidence directly demonstrates the defect or requirement in the stated scope. Use `medium` when the inference is strong but depends on runtime/user/context not fully inspected. Use `low` for hypotheses that should guide testing, not implementation churn. Every high-confidence critique should identify observable evidence; if it cannot, downgrade it.

Record false positives and duplicate/root-cause grouping in the notes when iterating. Do not let repeated model critique manufacture independent findings from one underlying defect. When findings become contradictory or increasingly cosmetic after a repair pass, stop and report residual uncertainty rather than continuing indefinitely.
