# Mandatory cross-platform floor

Evidence base: WCAG 2.2, platform target-size guidance, response-time principles, and cross-platform hardening practice.

The floor is non-negotiable unless the user explicitly waives a scoped item. It constrains quality, not appearance.

## 1. Truthfulness & completeness (`A7`)

- Do not invent facts, testimonials, usage counts, customer logos, case studies, screenshots, measurements, certifications, or image content.
- Missing material must be omitted, requested, or visibly marked as a *user-requested* placeholder (never a silent agent-invented filler).
- Never use stock-looking fake proof to fill a layout. Empty space is better than false evidence.
- Generated imagery must match the brief and must not accidentally include illegible pseudo-text unless intentionally abstract.
- Deliver the complete in-scope behavior, never a stub or half-wired shell:
  - zero `// TODO`, `// FIXME`, or unimplemented comments standing in for requested UI or logic;
  - zero ellipsis code truncation (`// ... rest`, `/* ... */`, omitted branches);
  - zero empty or no-op handlers (empty action closures, unbound commands, no-op callbacks, dead placeholder links, or decorative buttons that do nothing);
  - zero unwired mobile navigation (e.g. a hamburger toggle that never opens, traps focus, or omits desktop routes);
  - zero unapproved 3-item hardcoded mock arrays masquerading as live or persisted data.
- User-requested placeholders, explicit test fixtures, and intentional UI display truncation are not defects; visibly label any requested demo/fixture data and never present it as live production truth.

## 2. Accessibility (`A4`)

- Use real interactive semantics before adding roles or keyboard handlers.
- Every control needs an accessible name; every input needs a persistent visible label or platform-equivalent labeling behavior.
- Keyboard/touch/controller/remote paths must complete the primary task. Focus is visible, logical, and never obscured by sticky UI.
- Meet the applicable contrast floor. For WCAG 2.2 AA web work: normal text 4.5:1, large text 3:1, non-text UI 3:1 unless exempt.
- Respect reduced-motion settings and provide a non-motion way to perceive state changes.
- Text scaling must not clip, overlap, or truncate essential content. Test dynamic type/sp scaling or platform equivalent where available.
- Do not encode meaning by color alone; pair color with text, shape, icon, position, or pattern.
- Dragging requires a single-pointer alternative. Authentication must not require a cognitive memory test or block paste/password managers.

## 3. Interaction & state matrix (`A3`)

- Enforce the explicit **response-latency ladder**: **`<= 100 ms`** immediate visual/tactile response for direct manipulation; **`> 1 s`** visible progress indicator so the user knows the system is working; **`> 10 s`** explicit **cancellable action** (plus percent/step progress or background continuation where supported).
- Targets obey platform units: web floor 24×24 CSS px for WCAG 2.2 AA unless an exception applies; iOS baseline 44×44 pt; Android/Material baseline 48×48 dp.
- Every asynchronous action exposes loading, success, failure, cancellation/retry, and duplicate-submission behavior.
- Destructive actions use confirmation or undo proportionate to consequence.
- Escape/cancel/back behavior is consistent with the platform and never traps the user.
- Gesture conflicts, edge swipes, nested scrolling, hover-only affordances, and focus loss are checked explicitly.

## 4. Adaptation and responsiveness (`M1–M4`)

- Restructure rather than stretch. Reflow across narrow/wide, portrait/landscape, window resizing, split screen, text scaling, and input modality.
- Plan and verify the primary task for each supported layout/input class; preserve task access, content meaning, input and focus as the presentation changes. A different mobile and desktop composition is allowed; a mobile task cut just to fit is not.
- No unintentional clipping, overlap, horizontal scrolling, unreachable controls, or hidden primary actions.
- Respect safe areas, system bars, on-screen keyboards, display cutouts, system chrome, and minimum practical viewport/window sizes.
- Use platform navigation idioms instead of transplanting UI patterns across operating systems.

## 5. Localization and internationalization (`A5`)

- Split text-expansion budgets by element class: budget **`+30–40%`** for prose and multi-sentence paragraphs, and **`+50–100%`** for short buttons, tabs, chips, column headers, and badges (where compact English words like `"Save"` or `"Views"` double in German, Vietnamese, or Finnish); test CJK horizontal contraction alongside vertical line-height and line-count growth.
- Enforce **IME composition safety**: pressing `Enter` or `Escape` during active input-method composition (Vietnamese Telex/VNI, Japanese Kana-to-Kanji, Korean Hangul, Chinese Pinyin) commits or cancels candidate text and never prematurely submits forms, search bars, chat composers, or inline edits.
- Enforce **combining and precomposed diacritic integrity**: normalize and test `Unicode NFC` strings and verify full font glyph coverage (including Vietnamese horn/circumflex/breve + stacked tone marks such as `ư, ơ, ệ, ử, ẫ` and target scripts) so custom fonts never drop marks, clip ascenders, or fall back mid-word to mismatched system glyphs.
- Use logical direction (`inline-start`, trailing/leading) rather than physical left/right assumptions in directional layout.
- Support RTL mirroring where directionality is semantic; do not mirror numerals, clocks, playback direction, or culturally asymmetric symbols blindly.
- Use locale-aware plural, gender/case, date, time, number, currency, calendar, sorting, input method, and name formatting. Do not concatenate translated fragments.
- Treat color symbolism, gestures, imagery, formality, humor, reading order, and trust cues as localizable design decisions, not translation afterthoughts.

## 6. Performance and resilience (`A6`)

- Honor the **`<= 100 ms` direct-manipulation / `> 1 s` progress indicator / `> 10 s` cancellable action** latency ladder under real runtime load, keeping layout stable while assets load (reserve dimensions or geometry-matched skeleton structure without fake content).
- Prioritize the primary content/action. Defer decorative media and heavy effects.
- Cover zero, one, many, very long, missing, malformed, offline, permission-denied, interrupted, concurrent, slow, and error states.
- Preserve user input after validation/server failures. Error text identifies the problem and recovery path.
- Avoid blocking interaction during animation or network activity unless the operation truly is modal.

## 7. Coherence, tokens, and distinctiveness (`A1–A2`)

- Use semantic tokens for color, spacing, type, elevation, motion, and state rather than raw one-off values.
- Establish hierarchy through scale, weight, spacing, position, and contrast—not decoration everywhere.
- Keep affordance consistent: things that look interactive must be interactive; identical actions use identical language and behavior.
- Iconography has one metaphor system, stroke/fill logic, optical size, and meaning inventory.
- Copy uses consistent action vocabulary, active voice, and user-centered naming.
- When mode permits, make at least one deliberate subject-specific commitment (composition, material, imagery, motion behavior, typography, or interaction detail) and check repetition history so “distinctive” does not collapse into a repeating template.

## 8. Engineering, security, and commercial handoff (`A8`)

- Zero dead interactive controls: every visible button, menu item, command, shortcut, toggle, or link executes wired behavior across supported input paths (never a no-op callback, unbound command, or placeholder target).
- Strict compiler, type, analyzer, and linter checks pass cleanly for the active language and toolchain without blanket rule suppressions.
- **Clean dependency vulnerability audit & reproducible `< 10 minute` setup**: committed lockfiles/toolchain pins pass the active ecosystem's dependency vulnerability audit (`0` unaddressed critical/high advisories), paired with a documented configuration template and single-command bootstrap + verification path.
- **Staging isolated from production**: staging/preview environments use separate credentials, databases, storage buckets, and payment/messaging sandboxes so QA never mutates live customer state.
- Isolated component or screen state previews exist where the target stack supports them, covering non-happy-path states.
- Zero hardcoded secrets, private API keys, signing credentials, or privileged tokens in client-visible source, bundles, binaries, or debug output.
- Verified commercial licenses for all shipped fonts, icon sets, imagery, 3D/audio media, and restricted packages, paired with clean owner-level transfer boundaries (domains, store accounts, analytics/error DSNs, signing keys, billing) and an explicit **30–90 day defect-warranty / severity-triage handoff note** for commercial deliveries.

## 9. Verifiability & Golden Evidence Rule (`Rule #0.3`)

- Every compliance claim carries `rendered`, `static`, `model-judgment`, `not-checked`, or `waived` plus method/scope.
- **Golden Evidence Rule (`Rule #0.3`):** **`static` or `model-judgment` NEVER counts as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements.** Those rows require `rendered` evidence—or must be recorded honestly as `not-checked` (with concrete environment reason) or `waived` (with explicit user authorization, scope, and consequence).
- A successful build, static AST check, or uninspected process launch is never evidence that visual, performance, or assistive UX quality passed.
