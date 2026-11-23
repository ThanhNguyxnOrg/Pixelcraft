---
name: pixelcraft-visual-qa
description: Verifies interfaces through rendered evidence using a render → screenshot → self-critique → fix loop. Use for visual QA, screenshot review, responsive/light/dark/reduced-motion inspection, browser or device verification, horizontal overflow, clipping, contrast, performance budget review, pre-submit checks, and honest rendered-vs-static evidence reporting across web, mobile, desktop, terminal, email, document, and game surfaces.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft visual QA

Visual QA is evidence production, not screenshot collection. Render the actual surface, capture representative states, inspect the pixels deliberately, fix deterministic failures once, and report what remains unverified.

## References

- Read [references/critique-rubric.md](references/critique-rubric.md) before judging captures; it prevents generic taste commentary.
- Read [references/task-verification.md](references/task-verification.md) when behavior or task completion matters more than static appearance.
- Read [references/baseline-governance.md](references/baseline-governance.md) before updating, trusting, masking, or retaining screenshot baselines.
- Read [references/performance-budgets.md](references/performance-budgets.md) when setting or evaluating web vitals, interaction latency, frame budgets, and asset budgets.
- Run `node scripts/style-inventory.mjs <url-or-html-file>` when a rendered style/payload inventory would make critique measurable; it emits JSON rather than proof of quality.
- Read [references/capture-mobile.md](references/capture-mobile.md) for iOS simulator, Android emulator/device, responsive viewport, gesture, and safe-area capture.
- Read [references/capture-terminal.md](references/capture-terminal.md) for tmux, VHS, asciinema, snapshot backends, color fallback, resize, and scrollback evidence.
- Read [references/capture-email.md](references/capture-email.md) for email-client matrix, image blocking, dark mode, plaintext, and capture limitations.
- Read [references/capture-desktop-game.md](references/capture-desktop-game.md) for native windows, high-DPI, multi-window, frame capture, HUD legibility, and game-safe-area checks.
- Run `node scripts/shoot.mjs --help` for optional browser capture/audit. The script has no required dependencies; it uses Playwright only when already installed or installable by the user.

## Required loop

1. **Render** — build/run the real product surface. A typecheck, bundle, DOM snapshot, or successful server start is not visual evidence. For behavior that matters, execute a defined user task rather than only loading a page.
2. **Capture** — cover the smallest supported width, a middle width, and a wide/desktop width; include light and dark where supported; include reduced motion where animation exists; capture meaningful states, task feedback, failure traces, and end states, not only the happy path.
3. **Inspect** — evaluate the capture against the direction card, platform conventions, floor requirements, rubric, and task. Look at edges, clipping, overlap, empty space, contrast, hierarchy, alignment, text truncation, input modality, and state communication.
4. **Fix once** — repair deterministic defects and recapture only affected surfaces. Do not iterate indefinitely by taste.
5. **Report** — list captures or artifacts inspected, evidence label (`rendered` only for actual pixels/device/simulator/snapshot backends), defects fixed, and material `not-checked` scope.

## Capture matrix

Choose rows relevant to the surface; do not claim rows skipped without saying so.

| Dimension | Minimum evidence |
|---|---|
| geometry | smallest supported size, typical size, large/resize behavior |
| appearance | light, dark, high contrast/forced colors where platform supports it |
| motion/input | reduced motion, keyboard/controller/touch focus, pointer size or D-pad where applicable |
| state | loading, empty, error, long content, offline/permission when relevant |
| locale | expansion/contraction, RTL, non-Latin scripts when in scope |
| capability | zoom/text scaling, magnification, image blocking, reduced data, degraded color/unicode |

## Browser quick path

```bash
node scripts/shoot.mjs http://localhost:3000 --out visual-qa
node scripts/shoot.mjs dist/index.html --breakpoints 390x844,768x1024,1440x900
```

The script writes PNGs plus `report.json`, flags horizontal overflow, elements outside the viewport, clipped text, and low-contrast text heuristically. Treat findings as leads: inspect the PNG before changing design. Absence of findings is not proof of quality.

For local files, the built-in server defaults to the file's own directory. Pass `--root` only when shared parent assets are required: it exposes every non-dotfile beneath that root to page scripts for the duration of the capture. Dot-segments such as `.env` and `.git/` are refused. HTTP error pages are still captured and recorded; runs exit non-zero for 4xx/5xx unless `--allow-http-error` is intentionally used for error-page design review.

## Hard rules

- Do not use browser emulation as proof of physical-device behavior; label it emulation.
- Do not hide overflow-x globally to silence a capture finding.
- Do not lower text contrast, shrink type below platform norms, or truncate essential content to fit a screenshot.
- Do not crop away defects or capture only flattering states.
- Do not update screenshot baselines merely to make a check pass; classify intentional change, regression, environment drift, fixture nondeterminism, or platform difference first.
- Do not claim task completion from pixels alone; execute the task or label behavioral uncertainty.
- Do not claim accessibility from pixels alone; pair captures with semantic/keyboard inspection.
- Preserve user data and secrets: redact private content in saved artifacts.

## Pre-submit checklist

- [ ] actual surface rendered in the target runtime or the closest explicitly labeled emulation;
- [ ] required breakpoints/orientations/safe areas captured;
- [ ] light/dark and reduced-motion behavior inspected where applicable;
- [ ] primary empty/loading/error/long-content states inspected;
- [ ] primary task/recovery path executed with expected end state evidence where feasible;
- [ ] no unintended horizontal overflow, clipped essential text, overlap, or off-viewport controls;
- [ ] contrast/legibility checked in context, including disabled and focus states;
- [ ] performance budget measured or explicitly marked `not-checked`;
- [ ] defects fixed once and recaptured;
- [ ] report distinguishes `rendered`, `static`, `model-judgment`, `not-checked`, and `waived`.
