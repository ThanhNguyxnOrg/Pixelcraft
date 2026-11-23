# Visual critique rubric

Use this rubric after capture, never as a substitute for capture. Rank findings by user impact rather than visual preference.

## Evidence hierarchy

1. physical device/platform chrome (`rendered`);
2. simulator/emulator/browser runtime (`rendered`, labeled as emulation);
3. deterministic snapshot backend (`rendered` for layout/text raster only, not interaction truth);
4. static geometry/style/code inference (`static`);
5. model interpretation of a screenshot (`model-judgment`).

Never upgrade a label because the screenshot looks convincing.

## Inspection order

| Layer | Questions |
|---|---|
| task | Can the primary action be found and completed? Is state feedback unambiguous? |
| platform | Does chrome, navigation, target size, focus, safe area, scaling, and input behavior fit the host? |
| hierarchy | Do eye path, grouping, spacing, and emphasis match importance? Is anything competing with the primary task? |
| legibility | Are type size, line length, contrast, truncation, wrapping, script shaping, and icon recognition adequate in context? |
| geometry | Check edges first: clipping, overlap, unintended scroll, off-screen controls, cramped resize, unstable aspect ratios. |
| state | Loading/empty/error/offline/permission/long-content/disabled/selected/focus states visible and truthful? |
| theme/motion | Do dark/high-contrast modes preserve semantic contrast? Does reduced motion preserve meaning? |
| distinctiveness | Does the result express the chosen direction and subject, or could any product reuse it unchanged? |
| performance | Is interaction responsive, layout stable, and media cost proportionate? |

## Severity guide

- **P0:** primary task impossible, unreadable, inaccessible, deceptive, or destructive.
- **P1:** major state/navigation/platform failure or essential content clipped/invisible.
- **P2:** comprehension, efficiency, trust, contrast, localization, or layout defect with a workaround.
- **P3:** optical refinement that does not change task success.

## Critique format

```text
[P1][rendered][high] 390px light capture: checkout button is clipped at the right edge.
Evidence: captures/390x844-light-motion.png, right-bottom quadrant.
Fix: move the action into the normal flow before the safe-area inset; do not hide overflow.
Residual: physical touch target not checked.
```

## Anti-patterns

- “Looks clean/premium/modern” without evidence or criteria.
- Fixing alignment by magic numbers instead of correcting layout constraints.
- Cropping captures to avoid edge defects.
- Treating a full-page screenshot as proof of keyboard, screen-reader, motion, or runtime behavior.
- Redesigning the product during a QA pass; report direction-level concerns separately.

## Critic calibration and iteration control

Model-based screenshot critique is useful but unreliable. Treat each finding as a hypothesis until tied to observable evidence:

1. **Require localization.** Name capture, region/element/state, expected behavior, actual pixels/behavior, and why it matters.
2. **Assign confidence.** `high` means directly visible/deterministic; `medium` means strong inference but context-dependent; `low` means speculative and must not drive layout churn.
3. **Separate defect from preference.** A defect violates task/floor/platform/direction evidence. Preference requires explicit authority before redesign.
4. **Suppress duplicates.** Group symptoms with the same layout/token/root cause rather than generating many independent-looking findings.
5. **Track false positives.** If inspection disproves a critic finding, record the false positive and tighten subsequent prompts/criteria instead of repeating it.
6. **Do not degrade across iterations.** Each repair round must address a specific deterministic defect and recapture only affected evidence. Stop when new findings are low-confidence, contradictory, or increasingly cosmetic.
7. **Preserve positives.** Do not fix one defect by destroying hierarchy, contrast, spacing rhythm, accessibility, or performance elsewhere; inspect regression risk after repair.

Stopping is valid when the remaining findings are speculative, require user/business evidence, or cost more than their user impact. Mark them `not-checked` or deferred with consequence.

## DOM evidence paired with pixels

When browser automation is available, pair screenshot inspection with a DOM/style inventory: rendered font families and sizes, foreground/background color counts by area, maximum content width, estimated uncovered viewport area, cursor overrides, motion-library signals, detected reduced-motion and focus-visible CSS, transfer/request counts, landmarks, heading-order jumps, missing alt attributes, and sampled text contrast.

These measurements are leads with context. Cross-origin stylesheets can hide CSS evidence; canvas/WebGL text is invisible to DOM typography; overlap/whitespace estimates cannot understand meaning. Inspect the capture before acting. Do not claim an accessibility pass from this extraction.
