# Direction scoring and selection

Use this reference after generating the direction distribution and before committing. The purpose is disciplined comparison, not false mathematical precision. Scores are evidence-weighted judgments; annotate uncertainty instead of hiding it behind exact-looking totals.

## Scale

Score each criterion from 0–4:

| Score | Meaning |
|---|---|
| 0 | fails or contradicts the criterion |
| 1 | major unresolved risk |
| 2 | acceptable only with mitigation |
| 3 | strong fit with minor residual risk |
| 4 | excellent fit supported by concrete material/evidence |

Do not average away a hard failure. A floor, legal, security, or truthfulness violation is disqualifying regardless of total score.

## Scorecard

| Criterion | Evidence to inspect | High-score behavior |
|---|---|---|
| subject fit | real domain objects, vocabulary, material, user task | the concept could not be moved unchanged to an unrelated product |
| task/mode fit | frequency, urgency, attention budget, expertise | expression supports user success rather than competing with it |
| prototypicality | learned platform/domain patterns | familiar structure is preserved where users benefit from recognition; novelty is deliberate |
| hierarchy clarity | first fixation path, grouping, scanning, action priority | the next decision is obvious without reading every pixel |
| visual complexity | element count, grouping, density, contour clutter, focal competition | complexity matches mode and is controlled by grouping/focal structure |
| accessibility risk | contrast, focus, target size, text scaling, motion, cognitive load | floor behavior survives the concept rather than being patched afterward |
| localization risk | expansion, RTL, script shaping, numerals, plural/message structure | layout/type system survives non-English content |
| platform transfer | rendering model, input modality, navigation, performance envelope | the idea can be idiomatic rather than copied literally |
| implementation cost | component/token reuse, asset availability, timeline, runtime cost | achievable without fake simplification or hidden technical debt |
| distinctiveness | slop fingerprint scan, repetition history, memory test | one strong subject-derived commitment; no dependency on current template fashion |
| content truth | availability and provenance of copy/data/media | no invented proof, fake metrics, rasterized copy, or placeholder masquerading as final content |
| coherence | states, surfaces, modes, future screens | one system can support the whole product rather than a single hero shot |

## Weighting

Default weights:

| Mode | Highest weights | Usually lower weights |
|---|---|---|
| Operate | task/mode fit, prototypicality, hierarchy, accessibility, localization, implementation cost | visual novelty, dense spectacle |
| Read | hierarchy, typography/content truth, localization, low clutter | motion, ornamental distinctiveness |
| Persuade | subject fit, memory, composition, content truth | dense operational efficiency |
| Experience/Play | subject fit, sensory coherence, distinctiveness | conventional efficiency, provided floor remains intact |
| Communicate | content truth, renderer robustness, localization, hierarchy | fragile effects |

Adjust weights only because the brief says so. Record the reason.

## Required comparison table

```markdown
| Direction | Subject | Task/mode | Prototype | Hierarchy | Complexity | A11y | i18n | Platform | Cost | Distinct | Truth | Coherence | Decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| A |  |  |  |  |  |  |  |  |  |  |  |  |  |
```

Add a short evidence note under the table for any score of 0–1 or uncertain 2. Do not write only adjectives such as “clean,” “premium,” or “bold.”

## Selection rules

1. Select the best evidence-weighted direction, not automatically the most unusual or the safest.
2. Reject near-duplicates before scoring; they waste the distribution budget.
3. Preserve one low-conventional-probability candidate long enough to score it fairly.
4. Penalize repeated composition/type/color/motion signatures found in repetition history unless this product intentionally continues one system.
5. Record why each losing direction lost using criteria names. “Less attractive” is not a reason.
6. If two directions tie, choose the one with lower accessibility/localization/implementation risk unless the brief explicitly prioritizes memorability.
7. Commit before implementation. Do not keep silently blending losers into the winner; deliberate hybridization must be written into the direction card.

## Iteration budget

Use 3–5 candidates for most new direction work. Use fewer when the surface is small, operational, heavily constrained, or partially approved. Use more only when the brief is high-value and genuinely open. Stop when new candidates differ only in color/font/decoration or when the evidence needed to choose is unavailable; escalate the missing evidence instead of generating noise.
