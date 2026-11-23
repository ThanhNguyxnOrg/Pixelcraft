# Pixelcraft evaluation corpus

This directory contains lightweight behavioral evaluations for every skill. Each skill has one markdown file named `evals/<skill-name>.md` with two prompt cases. A case records the prompt, expected behaviors, failure signals, and comparison criteria for a with-skill versus without-skill run.

## How to run an evaluation

1. Choose one case and create two matched runs in the same repository/fixture: one baseline run without the skill available and one treatment run with the skill available.
2. Use the same model, temperature, tools, repository state, time budget, and user prompt. Do not give the treatment run extra manual hints.
3. Inspect the final artifact and process transcript. Score each expected behavior as pass, partial, fail, or not applicable.
4. Inspect failure signals independently; a polished final screenshot does not cancel privacy, truthfulness, accessibility, or state-model failures.
5. Compare dimensions using the case table. Prefer concrete evidence: file diffs, command output, rendered screenshots, interaction recordings, validator results, and labeled uncertainty.
6. Record model/version/date/fixture/result in the evaluation notes. These cases are behavioral prompts, not deterministic unit tests.

## Interpretation

- The baseline can still pass; the goal is measuring whether the skill improves routing, specificity, verification, and constraint fidelity.
- Do not score keyword presence alone. A response that names a skill but ignores its constraints is a failure.
- A response that uses the skill's behavior without literally naming it can still satisfy the behavioral criterion.
- Treat exact documented limits as time-sensitive. Recheck official sources when updating a case.

## Validator contract

`npm run validate` requires every skill folder in `skills/` to have a matching `evals/<skill-name>.md` file containing at least one `## Case` heading. It also validates the structure of machine-readable JSON fixtures under `evals/fixtures/`: unique filename-matched IDs, existing skill references, context snapshots, expected routing, forbidden behaviors, rubric dimensions, negative controls, and baselines. The validator enforces presence/structure only; evaluators judge semantic quality.
