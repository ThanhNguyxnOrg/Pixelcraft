---
name: pixelcraft-accessibility
description: Applies and verifies the accessibility floor across platforms. Use when designing or reviewing UI for WCAG 2.2 AA, APCA contrast, ARIA APG patterns, semantic structure, keyboard/focus operability, target size, screen readers, Dynamic Type/text scaling, reduced motion, prefers-reduced-transparency, forced-colors, dragging alternatives, redundant entry, accessible authentication, EAA/ADA compliance context, subtitles, canvas/WebGL alternatives, AccessKit, controller remapping, or web/mobile/desktop/TUI/document/spatial/extension/email/game accessibility.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft accessibility

Accessibility is a floor built during design, not a final repair pass. Meet the platform's native expectations first; use custom behavior only when native semantics cannot express the interaction.

## References

- Read [references/wcag22-checks.md](references/wcag22-checks.md) for the concrete WCAG 2.2 AA floor, cross-platform sticky-chrome Focus Unobscured (`2.4.11`/`2.4.12`) remediation, APCA cross-reference, ban on accessibility overlay widgets, and EU `EAA` / `EN 301 549` Accessibility Statement readiness.
- Read [references/apg-patterns.md](references/apg-patterns.md) before implementing or reviewing native HTML primitives (`<dialog>`, Popover, `inert`, `<details name>`), pre-mounted live regions, `document.ariaNotify()` progressive enhancement, Focus vs. Announce rules, split-text SR guards, semantic traps, or custom composite widgets.
- Read [references/platforms.md](references/platforms.md) when translating the floor to web, iOS, Android, Flutter/React Native/LynxJS, data apps, desktop/AccessKit, TUI, email, documents/PDF/UA, chat UI, extensions, spatial/XR, constrained/TV/wearables, or game UI.
- Read [references/motion-canvas.md](references/motion-canvas.md) when reviewing animation, reduced motion, prefers-reduced-transparency, flashing limits, custom cursor, canvas/WebGL DOM fallback, or audio/video captions.
- Read [references/verification.md](references/verification.md) before claiming compliance; separate static linters, browser-rendered automated scans (~31% W3C ACT ceiling), anti-overlay enforcement, and manual assistive-tech verification.

## Numeric floor targets (WCAG 2.2 AA & platform baselines)

| Requirement | Mandatory floor target |
|---|---|
| Text & UI contrast | **≥ 4.5:1** normal text; **≥ 3:1** large text (≥ 18pt / 14pt bold) and non-text UI boundaries/focus indicators |
| Pointer / touch target size | **≥ 24×24 CSS px** web (WCAG 2.2 `2.5.8`); **≥ 44×44 pt** iOS; **≥ 48×48 dp** Android / Material |
| Text scaling & reflow | **200%** text zoom with zero clipping/overlap; **320 CSS px** reflow width without horizontal scrolling for primary reading/tasks |
| Focus visibility (WCAG 2.2 `2.4.11` / `2.4.12`) | Visible focus indicator on every interactive element, **never obscured** by sticky headers, toolbars, banners, or keyboards (`scroll-padding-block` / `.safeAreaInset` / `imePadding`) |
| Dragging alternative (WCAG 2.2 `2.5.7`) | Every drag-and-drop, slider, or reorder interaction has a **single-pointer** (click/tap button) and keyboard alternative |

## Core rules

1. **Use native semantic controls—never non-semantic `<div>`/`<span>` click targets or unbound custom widgets.** Use native platform buttons, links, inputs, and dialogs first; roles and key listeners alone do not repair fake controls.
2. Composite widgets need a complete interaction contract: role/state/value, keyboard/controller input, focus entry/exit/restoration, activation/selection semantics, async behavior, and Escape/cancel behavior—not merely an ARIA role.
3. Every meaningful control has a persistent accessible name/label (never placeholder-only), visible focus or platform equivalent, and a complete keyboard/touch/controller/assistive path with scroll-inset compensation against sticky/fixed chrome (`WCAG 2.4.11`/`2.4.12`).
4. **Pre-mount live regions and manage dynamic focus deliberately:** mount live regions before text updates (on web: progressively enhance with `document.ariaNotify()`, never combine `aria-live` with `role="alert"`), guard split-text animations by hiding split spans and keeping one intact accessible/`sr-only` text node, and relocate focus cleanly on search submit, `"Load more"`, and item deletion—never drop focus to `<body>` or the top of the screen.
5. Test task completion—not just component presence—with keyboard only, screen reader where available, `200%` text scaling, `320px` reflow, dark/high contrast, reduced motion, reduced transparency, and touch/target constraints.
6. Never encode meaning by color alone; pair color with text, shape, icon, pattern, position, or state language.
7. Do not disable zoom/text scaling (`user-scalable=no`, `maximum-scale=1`) or block paste/password managers/autofill.
8. Motion, audio, flashing, vibration, and timed behavior need safe alternatives (`prefers-reduced-motion`, captions/transcripts, pause/stop controls).
9. Localization and accessibility overlap: expanded strings (`+50–100%` short labels), RTL/bidi, `IME` composition, scripts, and plural forms must not clip, reorder, or obscure interaction.
10. **Never ship Accessibility Overlay widgets (`accessiBe`, `AudioEye`, etc.) as a substitute for source-level remediation.** Overlays do not fix semantics, live regions, or keyboard/focus flows and provide zero WCAG 2.2 AA / EAA / ADA conformance.
11. For B2C digital products, e-commerce, banking, transport, or communications serving EU users (`EAA` / `EN 301 549`), surface or plan a public **Accessibility Statement** (conformance status, known limitations, tested assistive-tech matrix, and barrier-free feedback/escalation channel).

## Verification honesty

**Never claim an accessibility pass from automated scanners or static linters alone.** Empirical **W3C ACT** data shows automated scanners cover only **~31% of WCAG 2.2 A/AA criteria** and miss pre-mounted live-region silence, focus-on-delete / `"Load more"`, logical focus order, Focus Not Obscured (`2.4.11`), single-pointer drag alternatives (`2.5.7`), split-text screen-reader garbling, meaningful alt/error copy, and keyboard task completion—directly reinforcing **Golden Evidence Rule (`Rule #0.3`)**. Report each material claim as `rendered`, `static`, `model-judgment`, `not-checked`, or `waived`, naming tool, platform, input modality, viewport/device, theme/motion setting, and scope.

## Pre-submit checklist

- [ ] Native semantic primitives used first; zero non-semantic click-only containers, dead placeholder links, or third-party Accessibility Overlay widgets (`accessiBe`, `AudioEye`, etc.).
- [ ] Contrast meets `≥ 4.5:1` (normal text) and `≥ 3:1` (large text & non-text UI/focus) across light, dark, and hover/focus/disabled states.
- [ ] Target sizes meet `≥ 24×24px` web / `44pt` iOS / `48dp` Android; reflow holds at `320px` and text scaling holds at `200%`.
- [ ] Keyboard-only forward/reverse flow completes primary task with visible, unobstructed focus (`2.4.11`/`2.4.12` sticky-chrome scroll insets wired), proper dialog focus restoration, and deterministic focus relocation on `"Load more"` / item deletion.
- [ ] Live regions are pre-mounted (never conditionally mounted with text or pairing web `aria-live` + `role="alert"`), split-text animations expose one intact accessible/`sr-only` text node, every drag interaction has a single-pointer + keyboard alternative (`2.5.7`), and forms allow paste/autofill with linked inline errors.
- [ ] Reduced-motion, reduced-transparency, non-color state cues, and `EAA` / `EN 301 549` Accessibility Statement readiness (when in EU B2C scope) are addressed; report respects **Golden Evidence Rule (`Rule #0.3`)** and never equates automated zero (~31% W3C ACT ceiling) with full compliance.
