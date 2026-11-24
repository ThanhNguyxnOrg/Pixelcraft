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

- Read [references/wcag22-checks.md](references/wcag22-checks.md) for the concrete WCAG 2.2 AA floor, APCA cross-reference, regulatory scope (EAA / EN 301 549 / ADA Title II), and pass/fail checks.
- Read [references/apg-patterns.md](references/apg-patterns.md) before implementing or reviewing native HTML primitives (`<dialog>`, Popover, `inert`, `<details name>`) or custom composite widgets.
- Read [references/platforms.md](references/platforms.md) when translating the floor to web, iOS, Android, Flutter/React Native/LynxJS, data apps, desktop/AccessKit, TUI, email, documents/PDF/UA, chat UI, extensions, spatial/XR, constrained/TV/wearables, or game UI.
- Read [references/motion-canvas.md](references/motion-canvas.md) when reviewing animation, reduced motion, prefers-reduced-transparency, flashing limits, custom cursor, canvas/WebGL DOM fallback, or audio/video captions.
- Read [references/verification.md](references/verification.md) before claiming compliance; separate static linters, browser-rendered automated scans, and manual assistive-tech verification.

## Numeric floor targets (WCAG 2.2 AA & platform baselines)

| Requirement | Mandatory floor target |
|---|---|
| Text & UI contrast | **≥ 4.5:1** normal text; **≥ 3:1** large text (≥ 18pt / 14pt bold) and non-text UI boundaries/focus indicators |
| Pointer / touch target size | **≥ 24×24 CSS px** web (WCAG 2.2 `2.5.8`); **≥ 44×44 pt** iOS; **≥ 48×48 dp** Android / Material |
| Text scaling & reflow | **200%** text zoom with zero clipping/overlap; **320 CSS px** reflow width without horizontal scrolling for primary reading/tasks |
| Focus visibility (WCAG 2.2 `2.4.11`) | Visible focus indicator on every interactive element, **never obscured** by sticky headers, toolbars, cookie banners, or floating footers |
| Dragging alternative (WCAG 2.2 `2.5.7`) | Every drag-and-drop, slider, or reorder interaction has a **single-pointer** (click/tap button) and keyboard alternative |

## Core rules

1. **Use native semantic controls—never `<div onClick>` / `<span onClick>` buttons.** Use `<button>`, `<a href>`, `<input>`, `<dialog>`, or native platform controls first; ARIA roles and keydown listeners do not repair a fake `div` button.
2. Composite widgets need a complete interaction contract: role/state/value, keyboard/controller input, focus entry/exit/restoration, activation/selection semantics, async behavior, and Escape/cancel behavior—not merely an ARIA role.
3. Every meaningful control has a persistent accessible name/label (never placeholder-only), visible focus or platform equivalent, and a complete keyboard/touch/controller/assistive path.
4. Test task completion—not just component presence—with keyboard only, screen reader where available, `200%` text scaling, `320px` reflow, dark/high contrast, reduced motion, and touch/target constraints.
5. Never encode meaning by color alone; pair color with text, shape, icon, pattern, position, or state language.
6. Do not disable zoom/text scaling (`user-scalable=no`, `maximum-scale=1`) or block paste/password managers/autofill.
7. Motion, audio, flashing, vibration, and timed behavior need safe alternatives (`prefers-reduced-motion`, captions/transcripts, pause/stop controls).
8. Localization and accessibility overlap: expanded strings, RTL/bidi, IMEs, scripts, and plural forms must not clip, reorder, or obscure interaction.

## Verification honesty

**Never claim an accessibility pass from `axe-core`, Lighthouse, or `eslint-plugin-jsx-a11y` alone.** Automated linters and DOM scanners catch only a fraction of WCAG 2.2 defects and cannot verify logical focus order, Focus Not Obscured (`2.4.11`), single-pointer drag alternatives (`2.5.7`), meaningful alt/error copy, or keyboard task completion. Report each material claim as `rendered`, `static`, `model-judgment`, `not-checked`, or `waived`, naming tool, platform, input modality, viewport/device, theme/motion setting, and scope.

## Pre-submit checklist

- [ ] Zero `<div onClick>`/`<span onClick>` fake buttons or `href="#"` interactive stubs; native semantic primitives used first.
- [ ] Contrast meets `≥ 4.5:1` (normal text) and `≥ 3:1` (large text & non-text UI/focus) across light, dark, and hover/focus/disabled states.
- [ ] Target sizes meet `≥ 24×24px` web / `44pt` iOS / `48dp` Android; reflow holds at `320px` and text scaling holds at `200%`.
- [ ] Keyboard-only Tab/Shift+Tab/Enter/Space/Escape flow completes primary task with visible, unobstructed focus (`2.4.11`) and proper dialog focus restoration.
- [ ] Every drag interaction has a single-pointer + keyboard alternative (`2.5.7`); forms allow paste/autofill and link inline errors via `aria-describedby`.
- [ ] Reduced-motion and non-color state cues are wired; report never equates zero `axe-core`/`eslint` warnings with full WCAG compliance.
