# Mandatory cross-platform floor

Evidence base: WCAG 2.2, platform target-size guidance, response-time principles, and cross-platform hardening practice.

The floor is non-negotiable unless the user explicitly waives a scoped item. It constrains quality, not appearance.

## 1. Truthfulness

- Do not invent facts, testimonials, usage counts, customer logos, case studies, screenshots, measurements, certifications, or image content.
- Missing material must be omitted, requested, or visibly marked as an approved placeholder.
- Never use stock-looking fake proof to fill a layout. Empty space is better than false evidence.
- Generated imagery must match the brief and must not accidentally include illegible pseudo-text unless intentionally abstract.

## 2. Accessibility

- Use real interactive semantics before adding roles or keyboard handlers.
- Every control needs an accessible name; every input needs a persistent visible label or platform-equivalent labeling behavior.
- Keyboard/touch/controller/remote paths must complete the primary task. Focus is visible, logical, and never obscured by sticky UI.
- Meet the applicable contrast floor. For WCAG 2.2 AA web work: normal text 4.5:1, large text 3:1, non-text UI 3:1 unless exempt.
- Respect reduced-motion settings and provide a non-motion way to perceive state changes.
- Text scaling must not clip, overlap, or truncate essential content. Test dynamic type/sp scaling or platform equivalent where available.
- Do not encode meaning by color alone; pair color with text, shape, icon, position, or pattern.
- Dragging requires a single-pointer alternative. Authentication must not require a cognitive memory test or block paste/password managers.

## 3. Interaction

- Acknowledge input quickly: target approximately 0.1s for direct manipulation feedback, 1s for uninterrupted flow, and explicit progress or interruption options beyond that.
- Targets obey platform units: web floor 24×24 CSS px for WCAG 2.2 AA unless an exception applies; iOS baseline 44×44 pt; Android/Material baseline 48×48 dp.
- Every asynchronous action exposes loading, success, failure, cancellation/retry, and duplicate-submission behavior.
- destructive actions use confirmation or undo proportionate to consequence.
- Escape/cancel/back behavior is consistent with the platform and never traps the user.
- Gesture conflicts, edge swipes, nested scrolling, hover-only affordances, and focus loss are checked explicitly.

## 4. Adaptation and responsiveness

- Restructure rather than stretch. Reflow across narrow/wide, portrait/landscape, window resizing, split screen, text scaling, and input modality.
- No unintentional clipping, overlap, horizontal scrolling, unreachable controls, or hidden primary actions.
- Respect safe areas, system bars, on-screen keyboards, display cutouts, browser chrome, and minimum practical viewport/window sizes.
- Use platform navigation idioms instead of transplanting UI patterns across operating systems.

## 5. Localization and internationalization

- Budget approximately 30–40% expansion for translated strings in dense UI; test contraction for CJK and expansion for German/Finnish-like cases where feasible.
- Use logical direction (`inline-start`, trailing/leading) rather than physical left/right assumptions in directional layout.
- Support RTL mirroring where directionality is semantic; do not mirror numerals, clocks, playback direction, or culturally asymmetric symbols blindly.
- Use locale-aware plural, gender/case, date, time, number, currency, calendar, sorting, input method, and name formatting. Do not concatenate translated fragments.
- Choose fonts/fallbacks for script coverage and test shaping, line breaking, hyphenation, emphasis, numerals, and input composition.
- Treat color symbolism, gestures, imagery, formality, humor, reading order, and trust cues as localizable design decisions, not translation afterthoughts.

## 6. Performance and resilience

- Keep layout stable while assets load; reserve dimensions or skeleton structure without fake content.
- Prioritize the primary content/action. Defer decorative media and heavy effects.
- Cover zero, one, many, very long, missing, malformed, offline, permission-denied, interrupted, concurrent, slow, and error states.
- Preserve user input after validation/server failures. Error text identifies the problem and recovery path.
- Avoid blocking interaction during animation or network activity unless the operation truly is modal.

## 7. Coherence and craft

- Use semantic tokens for color, spacing, type, elevation, motion, and state rather than raw one-off values.
- Establish hierarchy through scale, weight, spacing, position, and contrast—not decoration everywhere.
- Keep affordance consistent: things that look interactive must be interactive; identical actions use identical language and behavior.
- Iconography has one metaphor system, stroke/fill logic, optical size, and meaning inventory.
- Copy uses consistent action vocabulary, active voice, and user-centered naming.

## 8. Distinctiveness and verifiability

- When mode permits, make at least one deliberate subject-specific commitment: composition, material, imagery, motion behavior, typography, or interaction detail.
- Check repetition history so “distinctive” does not become a repeating template.
- Every compliance claim carries `rendered`, `static`, `model-judgment`, `not-checked`, or `waived` plus method/scope.
- A successful build, DOM presence, or page load is not evidence that visual or UX quality was inspected.
