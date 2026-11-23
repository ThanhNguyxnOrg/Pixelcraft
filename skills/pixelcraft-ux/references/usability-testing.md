# Lightweight usability testing escalation

Use this reference when inspection cannot answer whether real users understand or complete the task. Automated agents should not fabricate user evidence. Either run an approved lightweight study with real participants or label the uncertainty `not-checked`.

## When to escalate

Escalate when a decision depends on any of:

- whether users understand domain vocabulary, navigation, or conceptual model;
- whether they notice the correct action without guidance;
- error cost, trust, comprehension, or abandonment risk;
- competing designs whose differences are behavioral rather than visual;
- accessibility or localization needs outside the implementer's direct experience;
- a cognitive walkthrough finding rated medium/high risk that cannot be resolved by platform convention.

Do not escalate merely to validate taste. Usability testing answers behavior/comprehension questions, not whether the team prefers a color.

## Minimum viable study

For a small iterative study, use approximately 3–5 participants per materially distinct audience segment. This is a risk-discovery sample, not statistical proof. More participants or quantitative instrumentation are needed for comparative claims.

Record:

| Field | Required content |
|---|---|
| research question | behavioral uncertainty to resolve |
| participant segment | inclusion criteria and evidence source; avoid convenience-only bias when possible |
| task(s) | realistic goals with completion criteria |
| fixture/data | realistic content, permissions, device, network, locale, accessibility setup |
| moderator behavior | neutral prompts; no teaching unless testing recovery after failure |
| measurement | success/failure/assists, time where useful, errors, navigation path, verbatim comprehension evidence |
| privacy/consent | consent, recording permission, data handling, redaction |

Never claim statistical significance or population truth from five users. Report discovered failure patterns and unresolved risk.

## Session structure

1. **Context:** establish relevant background without demonstrating the answer.
2. **Task:** give the goal, not click instructions.
3. **Think-aloud or retrospective probing:** choose based on task risk/accessibility; do not interrupt the user's natural recovery immediately.
4. **Neutral prompts:** “What are you expecting?” / “What would you do next?” rather than leading hints.
5. **Recovery boundary:** intervene only when the participant is stuck beyond the defined failure threshold or harm/frustration is disproportionate.
6. **Debrief:** ask comprehension and expectation questions after the task.

## Measures

Use behavior first:

| Measure | Evidence |
|---|---|
| task success | completed / assisted / failed / abandoned, defined before session |
| critical errors | wrong destructive action, lost data, wrong interpretation, inability to recover |
| navigation path | detours, backtracking, search use, help use |
| comprehension | user's own explanation of what happened or what a label means |
| confidence/trust | stated certainty before committing; treat as secondary |
| time/efficiency | useful only with context and enough care about variance |

Do not reduce the result to a satisfaction score. A participant can like an interface and still fail the task.

## Reporting template

```markdown
## Usability evidence
- Question:
- Participants: n, segment, recruitment limitation
- Build/prototype/context:
- Tasks and success criteria:

| Task | Success | Critical failure pattern | Evidence | Severity | Recommended change |
|---|---|---|---|---|---|

- Confirmed risks:
- Not-generalizable / not checked:
```

Distinguish observed behavior from interpretation. Quote or describe what happened before inferring why.

## Agent honesty rules

- Never fabricate participants, sessions, quotes, metrics, or consent.
- Do not call a model-generated persona walkthrough “user testing.”
- Do not use employees/friends as proof of target-user behavior without saying so.
- If no participants are available, keep the risk open and choose the safer conventional design.
- Do not continue polishing visual detail while a critical behavioral question remains unresolved.
