# Pixelcraft evaluation corpus

This directory contains behavioral evaluations for all 26 Pixelcraft skills. Each skill has one markdown guide named `evals/<skill-name>.md` containing 2–6 prompt cases, paired with machine-readable JSON fixtures under `evals/fixtures/` (71 fixtures covering all 26 skills, including non-JS/TS ecosystems and Grill-Me/Brainstorming gates). Each case records the prompt, expected behaviors, failure signals, and comparison criteria for a with-skill versus without-skill run.

## Automated offline contract & fixture checks

Run the deterministic offline evaluation runner before opening a PR:

```sh
npm run eval:offline
```

`scripts/run-evals.mjs` verifies that every JSON fixture in `evals/fixtures/` resolves valid skills and reference files on disk, checks router expectations against real stack detection rules, and confirms zero orphaned or malformed cases.

## How to run a live model evaluation

1. Choose one case and create two matched runs in the same repository/fixture: one baseline run without the skill available and one treatment run with the skill available.
2. Use the same model, temperature, tools, repository state, time budget, and user prompt. Do not give the treatment run extra manual hints.
3. Inspect the final artifact and process transcript. Score each expected behavior as pass, partial, fail, or not applicable.
4. Inspect failure signals independently; a polished final screenshot does not cancel privacy, truthfulness, accessibility, or state-model failures.
5. Compare dimensions using the case table. Prefer concrete evidence: file diffs, command output, rendered screenshots, interaction recordings, validator results, and labeled uncertainty.
6. Record model/version/date/fixture/result in the evaluation notes. Live behavioral prompts complement—not replace—deterministic script tests.

For finish-gate and anti-slop changes, compare a landing page, a dashboard, a non-JS surface (such as TUI, SwiftUI, or Typst), and a brownfield design with justified brand choices. Keep task success, brief fidelity, missed confirmed failures, and false positives separate; record repair rounds, elapsed time, and tool cost. Spot-check rendered outcomes and include cases the reviewer has not optimized the rules against.

## Interpretation

For scoped-work or freshness experiments use the same model, task, lockfile, and fixture for both runs. Record repeated file reads, duplicate tool calls, input/output tokens when exposed, tool time, repair rounds, and confirmed task outcomes. Do not reward reduced cost if it comes from skipping applicable verification. Keep agent-backed evaluation opt-in.

- The baseline can still pass; the goal is measuring whether the skill improves routing, specificity, verification, and constraint fidelity.
- Do not score keyword presence alone. A response that names a skill but ignores its constraints is a failure.
- A response that uses the skill's behavior without literally naming it can still satisfy the behavioral criterion.
- Treat exact documented limits as time-sensitive. Recheck official sources when updating a case.

## Validator contract

`npm run validate` requires every skill folder in `skills/` to have a matching `evals/<skill-name>.md` file containing at least one `## Case` heading. It also validates the structure of machine-readable JSON fixtures under `evals/fixtures/`: unique filename-matched IDs, existing skill references, context snapshots, expected routing, forbidden behaviors, rubric dimensions, negative controls, and baselines. The validator enforces presence and structure; `npm run eval:offline` checks routing consistency; human or model evaluators judge semantic quality.
