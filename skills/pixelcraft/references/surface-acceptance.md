# Shared surface acceptance matrix & 3-tier Studio rubric

Use this reference when deciding what evidence a platform implementation must produce and when populating `.pixelcraft/acceptance.json` (`check-acceptance.mjs` in `pixelcraft-review`). It is the cross-surface contract; platform skills add native idioms, measurable thresholds, and required deliverable artifacts.

## Golden Evidence Rule (`Rule #0.3`)

**`static` or `model-judgment` NEVER counts as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements.** Those rows require `rendered` evidence from a real runtime, device, simulator, or instrumented harness—or must be recorded honestly as `not-checked` (with concrete environment reason + next command) or `waived` (with explicit user authorization, scope, and consequence). `check-acceptance.mjs` mechanically rejects any `pass` claim backed only by `static` or `model-judgment` on `rendered`-required rows.

## 12-Row Shared Surface Acceptance Matrix

| # | Universal acceptance row | Required design & implementation behavior | Minimum acceptance evidence (`rendered` where visual/perf/interactive-a11y) |
|---:|---|---|---|
| 1 | **Responsive/adaptive layout** | Surface controls resize, orientation, split-pane, and breakpoint reflow through constraints rather than fixed perfect pixels | Smallest, typical, and large target geometries inspected (`rendered`) with zero clipping, overlap, or accidental 2D scrolling |
| 2 | **Navigation & back** | Back, `Escape`, close, deep link, refresh, and relaunch restore understandable route and selection state without dead ends | Primary forward/back/dismiss task path exercised in the real runtime or labeled emulation (`rendered`) |
| 3 | **Input modalities** | Pointer, touch, keyboard, controller, remote, or voice paths match platform expectations with forgiving hit areas, pointer capture, and active **IME composition safety** (`Enter`/`Escape` never prematurely submits) | Primary task completed without mouse-only, hover-only, or precision-only dependency + composed input (`ư, ơ, ệ`, CJK, RTL) checked (`rendered`) |
| 4 | **Focus & state restoration** | Focus, selection, scroll, and dirty input survive dialogs, errors, route changes, OS interruptions, and re-entry without sticky-chrome occlusion (`WCAG 2.4.11`) | Focus traversal and restoration inspected across at least one interruption and smallest supported viewport (`rendered`) |
| 5 | **Rendered state matrix** | `loading`, `empty` (first-use + no-results), `error`, `offline`, `permission-denied`, `404`/`500`, conflict, cancellation, and **`Break UI` edge-case stress testing** (singular/plural counts, very long & unbroken strings/URLs, missing/corrupt media, `> 300 ms` latency, rapid double-submit) are implemented | Representative happy-path, non-happy-path, and `Break UI` edge-case states captured in the target runtime (`rendered`) |
| 6 | **Accessibility & screen reader** | Native semantics/accessibility tree expose name, role, value, state, contrast, reduced-motion/transparency fallbacks, and live announcements | Automated accessibility/contrast scan plus keyboard and screen-reader (or platform assistive tree) walkthrough (`rendered`) |
| 7 | **Text scaling & localization** | `+30–40%` prose and `+50–100%` short-label expansion, `200%` text zoom/Dynamic Type, CJK contraction, RTL mirroring, tabular numerals (`tnum` + `U+2212`), and `Unicode NFC` diacritic glyph coverage survive | Stress-locale / `200%` text-scale renders verified with zero fixed-height clipping or mid-word fallback glyphs (`rendered`) |
| 8 | **Measured performance** | Meets the `<= 100 ms` direct-manipulation / `> 1 s` progress / `> 10 s` cancellable ladder plus platform startup, frame-time, payload, memory, and battery budgets with **zero runtime console/log warnings or errors** | Instrumented runtime profiler / benchmark output plus clean runtime console/log verification across primary flows (`rendered`) |
| 9 | **Safe areas & frame geometry** | Safe areas, overscan, notches/cutouts, system bars, virtual keyboards, taskbar/menu bar, and window minimums are respected | Real device, simulator, windowed, print-trim, or terminal geometry captures (`rendered`) |
| 10 | **Capture/recording artifacts** | Required deliverable screenshots, video walkthroughs, profiler traces, print proofs, or terminal recordings capture edge cases without hiding defects | Complete platform deliverable package attached with exact build/device/viewport metadata (`rendered`) |
| 11 | **Data & privacy** | User data, PII, secrets, private media, and credentials are protected across source, bundles, staging/prod separation, exports, and QA captures; **anti-dark-pattern & privacy honesty** enforced (symmetric accept/reject prominence, same-channel cancellation, zero confirmshaming/false urgency/pre-checked add-ons per EU DSA Art. 25 / US ROSCA / ARL) | Secret/dependency audit (`static`) + redacted/synthetic captures and symmetric consent/cancellation/privacy flows verified (`rendered`/`static`) |
| 12 | **Platform idiom** | Navigation, chrome, feedback, packaging, store/regulatory compliance, `< 10m` setup, unused-dependency cleanup, commercial licenses, **Client Autonomy (`No Black-Box Build`)**, and 30–90d warranty/owner handoff feel native and release-ready | Platform idioms, regulatory/store gates, clean build/unused-dep/audit logs, and autonomy/handoff manifest verified (`rendered`/`static`) |

## Mode overlays

- **Operate:** keyboard/controller efficiency, density discipline, recovery/undo, latency, scanability, and state persistence dominate.
- **Read:** measure, typography, navigation orientation, print/export behavior, scaling, and distraction control dominate.
- **Persuade:** truthful proof, decision sequence, performance, memorable hierarchy, and action visibility dominate.
- **Experience/Play:** frame stability, input latency, comfort, HUD legibility, interruption recovery, and sensory-safe alternatives dominate.
- **Communicate:** client degradation, plaintext/low-bandwidth equivalent, image blocking, ink/data cost, and locale robustness dominate.

## 3-Tier Final Grading Rubric (`check-acceptance.mjs`)

| Final tier | CLI verdict & exit code | Criteria & mandatory agent action |
|---|---|---|
| **1. `FAIL (Not Accepted)`** | `FAIL` (`exit 1`) | Any Baseline `A1–A8` row, 12-row Surface Matrix row, or platform threshold/checklist/deliverable item is `fail` or `pending`, OR claims `pass` via `static`/`model-judgment` where `rendered` evidence is required (`Rule #0.3`), OR marks `waived` without explicit user sign-off + scope + consequence. **Agent MUST NOT claim completion—keep fixing and re-verifying.** |
| **2. `PASS (Studio $10k–$20k Bar)`** | `PASS_STUDIO_10K_20K` (`exit 0`) *(or `PENDING_RENDERED_ENV` `exit 2` when physical hardware/store runtime is genuinely unavailable here)* | All Baseline `A1–A8` + 12-row Surface Matrix + platform measurable thresholds, inspection items, and deliverable artifacts pass on agreed target environments (`rendered` where required), and any `not-checked` / `waived` row carries a concrete environment reason + next command or explicit user sign-off + scope + consequence. |
| **3. `EXCEEDS`** | `EXCEEDS_STUDIO` (`exit 0`) | Meets every `PASS_STUDIO_10K_20K` requirement AND adds real-user research/usability sessions, live A/B experimentation, deep multi-locale native review, or high-scale systems/telemetry integration. |

## Minimum acceptance statement

Every surface implementation must update `.pixelcraft/acceptance.json`, run `check-acceptance.mjs`, and end with a matrix summary:

```markdown
| Universal acceptance row | Result | Evidence | Label |
|---|---|---|---|
| 1. Responsive/adaptive layout | pass/not-checked/waived | artifact/path/command | rendered/static/not-checked/waived |
```

A blank or `pending` matrix means the implementation is `FAIL (Not Accepted)` even if it compiles.
