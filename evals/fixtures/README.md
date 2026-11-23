# Eval fixture schema

JSON fixtures in this directory define deterministic behavioral contexts for evaluation. They are structured inputs for evaluators, not executable user tests.

Required shape:

```json
{
  "schemaVersion": 1,
  "id": "fixture-id-matching-filename",
  "skill": "pixelcraft-visual-qa",
  "title": "short behavioral name",
  "contextSnapshot": {
    "surface": "surface under test",
    "platform": "target platform/stack",
    "mode": "Operate/Read/Persuade/Experience/Play/Communicate/hybrid",
    "states": ["state coverage"],
    "constraints": ["input/locale/runtime constraints"]
  },
  "prompt": "representative user prompt",
  "expectedRouting": ["skills/references expected"],
  "forbiddenBehaviors": ["behavior that must not occur"],
  "rubricDimensions": [
    { "dimension": "what is judged", "pass": "pass evidence", "fail": "failure evidence" }
  ],
  "negativeControls": [
    { "name": "control name", "input": "misleading evidence/condition", "mustNot": "incorrect inference/behavior" }
  ],
  "baseline": {
    "withoutSkill": "expected baseline weakness",
    "withSkill": "expected improvement"
  }
}
```

`schemaVersion` must be `1`. The validator checks structure, uniqueness, filename/id agreement, existing skill names, nonempty routing/forbidden/rubric/control arrays, and baseline fields. It does not judge semantic quality; evaluators do.
