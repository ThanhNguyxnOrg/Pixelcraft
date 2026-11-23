---
name: pixelcraft-accessibility
description: Applies and verifies the accessibility floor across platforms. Use when designing or reviewing UI for WCAG 2.2 AA, semantic structure, keyboard/focus operability, contrast, target size, screen readers, Dynamic Type/text scaling, reduced motion, dragging alternatives, redundant entry, accessible authentication, high contrast, subtitles, controller remapping, TUI/email/game accessibility, or platform-specific assistive technology behavior.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft accessibility

Accessibility is a floor built during design, not a final repair pass. Meet the platform's native expectations first; use custom behavior only when native semantics cannot express the interaction.

## References

- Read [references/wcag22-checks.md](references/wcag22-checks.md) for the concrete WCAG 2.2 AA floor and pass/fail checks.
- Read [references/apg-patterns.md](references/apg-patterns.md) before implementing or reviewing custom dialogs, menus, tabs, comboboxes, disclosures, grids, tooltips, carousels, live regions, trees, or drag/drop.
- Read [references/platforms.md](references/platforms.md) when translating the floor to web, iOS, Android, Flutter/React Native, data apps, desktop, TUI, email, or game UI.
- Read [references/verification.md](references/verification.md) before claiming compliance; separate automated evidence from manual judgment.

## Core rules

1. Use native semantic controls before custom widgets. Accessibility labels and keyboard handlers do not repair a fundamentally wrong element/control.
2. Composite widgets need a complete interaction contract: role/state/value, keyboard/controller input, focus entry/exit/restoration, activation/selection semantics, async behavior, and escape/cancel behavior—not merely an ARIA role.
3. Every meaningful control has a persistent name/label, role/state/value where applicable, visible focus or platform equivalent, and a complete keyboard/touch/controller/assistive path.
4. Test task completion—not just component presence—with keyboard only, screen reader where available, text scaling, dark/high contrast, reduced motion, narrow viewport/small window, and touch/target constraints.
5. Never encode meaning by color alone; pair color with text, shape, icon, pattern, position, or state language.
6. Do not disable zoom/text scaling or block paste/password managers/autofill.
7. Motion, audio, flashing, vibration, and timed behavior need safe alternatives and user control.
8. Localization and accessibility overlap: expanded strings, RTL/bidi, IMEs, scripts, and plural forms must not clip, reorder, or obscure interaction.

## Verification honesty

WCAG conformance cannot be proven by one automated scan. Report each material claim as `rendered`, `static`, `model-judgment`, `not-checked`, or `waived`, including tool, platform, input modality, viewport/device, theme/motion setting, and scope. A missing automated violation is not evidence of accessibility.
