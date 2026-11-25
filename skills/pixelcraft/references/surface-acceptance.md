# Shared surface acceptance matrix

Use this reference when deciding what evidence a platform implementation must produce. It is the cross-surface contract; platform skills add native idioms and tooling. Do not treat every row as mandatory in every prototype: classify skipped rows as `not-checked` or `waived` with consequence.

## Acceptance dimensions

| Dimension | Required design/implementation behavior | Acceptance evidence |
|---|---|---|
| layout ownership | the surface controls resize/reflow through constraints rather than fixed perfect pixels | smallest/typical/large geometry inspected without clipping or accidental two-dimensional scrolling |
| navigation truth | back/escape/close/deep link/refresh/relaunch restore understandable state | primary forward/back task path exercised in the real runtime or labeled emulation |
| input completeness | pointer/touch/keyboard/controller/remote/voice paths match platform expectations with forgiving hit areas and pointer capture | primary task completed without mouse-only, hover-only, precision-only, or hidden-command dependency |
| IME and composition safety | active input-method composition (`Enter`/`Escape` during Telex/VNI, Kana-Kanji, Hangul, Pinyin) commits/cancels candidates without premature submit; `Unicode NFC` text preserved | search, chat, form, and inline-edit inputs verified with composed characters (`ư, ơ, ệ`, CJK, RTL) or labeled `not-checked` |
| focus and restoration | focus/selection/scroll/input context survive dialogs, errors, route changes, interruption, and re-entry without sticky-chrome occlusion | focus path and restoration inspected across at least one interruption and smallest supported viewport |
| state coverage | loading/empty/error/offline/permission/long-content/conflict/cancellation states are designed | representative non-happy-path states rendered or explicitly marked absent/not applicable |
| accessibility exposure | native semantics/accessibility tree carry name, role, value, state, order, grouping, and status changes | automated scan plus manual keyboard/screen-reader or platform-equivalent inspection where available |
| text scaling/localization | `+30–40%` prose and `+50–100%` short-label expansion, CJK contraction, line breaking, directionality, tabular numerals, plural forms, and diacritic glyph coverage survive | representative locale matrix or targeted stress case; zero fixed-height clipping or ransom-note fallback glyphs |
| performance/interaction | frequency-calibrated motion, fast acknowledgment, responsive input, stable layout, proportionate media/asset cost | runtime measurement against surface budget or explicit `not-checked` |
| safe geometry | safe areas, overscan, notches, system chrome, virtual keyboard, taskbar/menu bar, window minimums are respected | real device/simulator/windowed/terminal evidence where environment permits |
| capture/verification | output can be captured meaningfully without hiding defects | screenshots/recordings/snapshots include edge cases and identify exact runtime/build |
| data/privacy | user data, secrets, private media, and personal identifiers are protected in source, bundles, and artifacts | zero client-exposed secrets; captures redacted/synthetic; no fake metrics/proof/testimonials |
| platform idiom | navigation, controls, feedback, scaling, lifecycle, packaging, and system integration feel native | idioms named in implementation notes; deviations deliberate and justified |
| regulatory/store readiness | target distribution and legal gates (App Store, Google Play, browser `MV3`, EU `EAA` / `EN 301 549` accessibility statement, console/Steam Deck TRC, print `PDF/X-4`, bulk email `RFC 8058`) are addressed | store/regulatory checklist items verified in config/UI or explicitly scoped `not-checked`/`waived` |
| commercial/engineering handoff | `< 10m` clean-clone setup, strict active-language static checks, isolated state previews where supported, verified font/icon/media commercial licenses, and owner-level account/key transfer | clean build/analyzer output, license manifest, and root billing/DNS/store/signing ownership boundaries documented |

## Mode overlays

- **Operate:** keyboard/controller efficiency, density discipline, recovery/undo, latency, scanability, and state persistence dominate.
- **Read:** measure, typography, navigation orientation, print/export behavior, scaling, and distraction control dominate.
- **Persuade:** truthful proof, decision sequence, performance, memorable hierarchy, and action visibility dominate.
- **Experience/Play:** frame stability, input latency, comfort, HUD legibility, interruption recovery, and sensory-safe alternatives dominate.
- **Communicate:** client degradation, plaintext/low-bandwidth equivalent, image blocking, ink/data cost, and locale robustness dominate.

## Minimum acceptance statement

Every surface implementation must end with a matrix row summary:

```markdown
| Dimension | Result | Evidence | Label |
|---|---|---|---|
| layout ownership | pass/issue/not applicable | artifact/path/command | rendered/static/model-judgment/not-checked/waived |
```

A blank matrix means the implementation is unverified even if it compiles.
