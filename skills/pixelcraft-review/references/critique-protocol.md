# Structured design critique protocol

Use this reference for critique mode. Critique is a decision process: it evaluates whether the design meets intent and exposes risk. It is not a vote about taste and not permission to redesign outside scope.

## Before the session

Prepare explicit inputs:

- design brief/plan, direction card, approved artifact/version, and scope of critique;
- user/audience/context evidence and open behavioral assumptions;
- platform/accessibility/localization constraints;
- state matrix, real content/data inventory, and verification evidence;
- decision owner and decision deadline;
- what is fixed versus open for change.

If these are absent, critique the missing evidence as a risk instead of filling gaps with personal preference.

## Roles

| Role | Responsibility |
|---|---|
| presenter/author | explain intent, constraints, evidence, and known trade-offs without defending every choice |
| facilitator | enforce scope/order, separate clarification from evaluation, prevent loudest-voice collapse |
| reviewers | independently inspect before group discussion; provide evidence-backed observations |
| decision owner | accept/reject/prioritize outcomes and own unresolved risk |
| recorder | preserve decision rationale, losing alternatives, waivers, and action owners |

In an agent workflow one agent may simulate roles, but must not pretend independent human review occurred. Label role simulation as model judgment.

## Independent review first

Before discussion or generation of fixes, each reviewer inspects independently against:

1. task success and cognitive walkthrough risks;
2. hierarchy/composition/visual complexity;
3. state coverage and recovery;
4. platform/input/accessibility floor;
5. localization/content truth;
6. token/component/system coherence;
7. distinctiveness/repetition against the brief and history.

Independent notes prevent anchoring. Require concrete evidence locations: screenshot region, flow step, state, file/component, or behavioral observation.

## Session order

1. **Restate intent/constraints:** outcome, user, mode, approval scope, hard floors.
2. **Clarify only:** resolve factual misunderstandings before evaluation.
3. **Evidence review:** inspect rendered/static/task evidence; separate observed fact from inference.
4. **Strengths:** identify what must be preserved so critique does not flatten the design.
5. **Risks/defects:** report severity, confidence, evidence, affected user/task, and scope.
6. **Alternatives:** generate only after problems are understood; do not jump to a preferred redesign.
7. **Decision:** accept, revise, escalate, defer, or waive each material issue with rationale.

## Feedback taxonomy

Classify every comment:

| Type | Example | Handling |
|---|---|---|
| defect | contrast failure, inaccessible dialog, clipped critical text | fix before release unless explicitly waived |
| behavioral risk | users may not understand navigation | inspect/test or choose safer convention |
| requirement conflict | approved design conflicts with localization/legal/platform constraint | escalate according to authority order |
| hypothesis | denser layout may improve scanning | mark experiment/test needed; do not present as fact |
| preference | reviewer dislikes hue/typeface | lowest authority; must not silently override brief/project direction |
| scope expansion | new feature/page/request | record separately; do not hide inside critique |

## Decision log

```markdown
| Issue | Severity | Evidence/label | Decision | Owner | Rationale/trade-off | Follow-up |
|---|---|---|---|---|---|---|
```

Valid decisions include fix, preserve intentionally, test behavior, escalate override, defer with consequence, or waive explicitly. “No decision” is sometimes honest, but record it as unresolved risk rather than implying approval.

## Critique anti-patterns

- brainstorming fixes before agreeing on the problem;
- treating novelty as inherently good or bad;
- averaging conflicting feedback into a bland compromise;
- criticizing placeholder absence when real content was explicitly unavailable;
- letting visual polish crowd out floor/state/task blockers;
- using “users won't understand” without labeling it hypothesis/risk;
- redesigning approved visual scope without explicit authority;
- ending with no priority, owner, or preservation rule.

## Termination

Stop when material issues have decisions, additional comments repeat existing risks, evidence required is unavailable and recorded, or further changes would exceed scope. One focused revision round is normal; endless critique by taste is not verification.
