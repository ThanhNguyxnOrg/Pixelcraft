# Design brief contract

Use this reference before direction, handoff, or implementation whenever the work changes a user-facing surface. The brief is the alignment object: it records what must be true before taste, exploration, or framework choice begins. Keep it short enough that a later agent can read it in one pass.

## Required brief artifact

Write or update `.pixelcraft/brief.md` when the project directory is writable. If it is not writable, include the same fields in the working plan/report.

```markdown
# Design brief

## Outcome
- User/business outcome:
- Primary task and success signal:
- Failure cost if the task fails:
- Frequency/criticality:

## Audience and context
- Actors/personas backed by evidence:
- Expertise, accessibility, locale/language, input modality:
- Environment/device/network constraints:

## Evidence
| Fact or requirement | Class | Source/scope |
|---|---|---|
|  | user-provided / repo-observed / artifact-observed / analytics/research / assumption / unknown |  |

## Constraints and authority
- Explicit user decisions:
- Existing project authority:
- Platform/legal/accessibility constraints:
- Performance/privacy/security constraints:
- Approval owner and approval state:

## Material inventory
- Real copy/data/media/assets available:
- Missing material that must not be invented:
- Content tone/language constraints:

## Boundaries
- Non-goals:
- Explicit anti-goals/taboo patterns:
- Approved visual scope vs undecided scope:
- Deadline/cost/implementation budget:

## Validation plan
- Success measurement:
- Required states/breakpoints/locales:
- Rendered/device evidence required:
- What may be marked `not-checked` and why:
```

## Field rules

1. **Outcome before appearance.** “Increase activation by improving first-run completion” is actionable; “make it modern” is not.
2. **Evidence class is mandatory.** Do not blend user facts, repository facts, visual-source observations, analytics/research evidence, assumptions, and unknowns into one undifferentiated list.
3. **Approval ownership names a role/person when known.** “Team” or “everyone” is not an approval owner.
4. **Missing material is a constraint.** Record absent copy, data, imagery, legal text, logo assets, and customer evidence so the agent does not fabricate them.
5. **Anti-goals must be behavioral.** “No dashboard clone” is weak; “do not use a three-card feature row as the main structure” is checkable.
6. **Validation is part of the brief.** A visual goal without a measurement/rendering plan is incomplete.
7. **Update rather than fork.** When scope changes, preserve the old decision, record who/what changed it, and keep the waiver history.

## Minimum viable brief

For a small task, do not skip the brief; compress it. Record at least: primary task, audience, evidence class for key facts, hard constraints, approved-vs-undecided visual scope, non-goals, missing material, validation plan, and unresolved questions.

## Escalation triggers

Ask or stop when any missing fact changes the outcome materially:

- the target user or primary task is unknown;
- legal/safety/destructive behavior is implied but not specified;
- visual direction is claimed to be approved but no artifact/scope/version exists;
- success means a metric but no baseline or measurement source exists;
- required real content/data/assets are absent and cannot be truthfully represented.
