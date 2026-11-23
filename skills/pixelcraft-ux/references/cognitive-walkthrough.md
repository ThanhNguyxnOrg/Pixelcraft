# Cognitive walkthrough

Use this reference to evaluate whether a first-time user can learn and complete a task without training or hidden knowledge. It is an inspection method, not a substitute for observing real users.

## Setup contract

Before walking steps, record:

1. **Actor/persona hypothesis:** role, expertise, language/locale, accessibility needs, device/input modality, interruption context.
2. **Task:** exact goal in user terms, not a feature name.
3. **Correct action sequence:** the shortest successful path, including decisions, system feedback, recovery, and completion.
4. **Evidence boundary:** prototype, implementation, static specification, or rendered surface.

Do not use a persona as proof of user behavior. Label it a hypothesis and include evidence class (`user-provided`, `analytics/research`, `assumption`, or `unknown`).

## Stepwise inspection

For every action in the correct sequence, answer four questions:

| Question | Failure examples |
|---|---|
| Will the user try to achieve the right effect? | user does not know this step is necessary; feature framing does not match their goal |
| Will the user notice the correct action/control? | hidden navigation, ambiguous icon, low contrast, action outside expected scan/input region |
| Will the user associate the action with the intended effect? | label describes implementation rather than outcome; control placement contradicts mental model |
| If the action is taken, will feedback show progress toward the goal? | no acknowledgment, delayed/ambiguous state, success/error unclear, input lost |

A “yes” must cite observable UI evidence: visible label, proximity, conventional placement, feedback text/state, or platform idiom. “Users will figure it out” is not evidence.

## Walkthrough record

```markdown
| Step | User goal at step | Correct action | Q1 intent | Q2 notice | Q3 association | Q4 feedback | Finding/evidence |
|---|---|---|---|---|---|---|---|
| 1 |  |  | pass/risk/fail/not-checked |  |  |  |  |
```

Record confidence and evidence label for each important judgment. Distinguish:

- **failure:** the interface blocks or misleads the correct action;
- **risk:** ambiguity depends on knowledge/context not yet validated;
- **assumption:** missing persona/task evidence;
- **positive confirmation:** concrete cue supports learnability.

## Required inspection passes

Run the walkthrough at least once for:

- first use with no prior product knowledge;
- returning use after interruption where state matters;
- error/recovery path for the highest-cost failure;
- accessibility/input-modality path relevant to the audience (keyboard, screen reader, touch, controller, IME/voice where applicable);
- non-English/RTL or expanded-text path when localization is in scope.

For expert/high-frequency interfaces, evaluate both initial learnability and efficient repeated use. Do not excuse a confusing first use solely because training exists unless training is part of the actual product context.

## Common failure patterns

- actions named after system objects rather than user outcomes;
- progressive disclosure that hides the only path forward;
- success feedback identical to neutral state;
- focus/scroll position moving without explanation;
- destructive or irreversible consequence revealed only after commitment;
- required conceptual knowledge present nowhere in the interface or onboarding;
- recovery path requiring memory of a previous screen;
- translated text pushing the action outside the visible/focusable region;
- confirmation dialogs used as a substitute for clear action labeling.

## Output and escalation

Report blockers/risks in task order with concrete repair suggestions. If the walkthrough depends on uncertain user knowledge, task frequency, domain vocabulary, or environmental constraints, escalate to lightweight usability testing rather than treating model judgment as validation.
