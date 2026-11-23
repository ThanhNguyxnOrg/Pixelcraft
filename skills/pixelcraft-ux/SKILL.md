---
name: pixelcraft-ux
description: Designs rigorous user experience before and during implementation. Use for task analysis, JTBD, user flows, information architecture, navigation, forms, validation, empty/error/loading/offline states, feedback timing, perceived performance, cognitive-load reduction, localization-ready UX, UX writing, and interaction recovery across any frontend stack.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft UX

UX precedes styling. Establish user intent, task sequence, state coverage, and recovery before choosing components or visual decoration.

## References

- Read [references/flows-ia.md](references/flows-ia.md) for JTBD, task analysis, flow shape, IA depth, entry points, deep links, and navigation conventions.
- Read [references/cognitive-walkthrough.md](references/cognitive-walkthrough.md) when judging first-use learnability or step-by-step task completion.
- Read [references/usability-testing.md](references/usability-testing.md) when behavioral uncertainty requires real-user evidence rather than inspection.
- Read [references/state-matrix.md](references/state-matrix.md) whenever data, network, permission, input, or async behavior exists.
- Read [references/forms.md](references/forms.md) for labels, validation, input preservation, autofill, paste, mobile keyboards, redundant entry, authentication, and error recovery.
- Read [references/feedback-performance.md](references/feedback-performance.md) for response-time limits, undo/destructive behavior, loading strategy, and perceived performance.
- Read [references/i18n.md](references/i18n.md) before layout/copy for multilingual, RTL, locale-format, name/address, plural/gender, or IME contexts.
- Read [references/locale-test-matrix.md](references/locale-test-matrix.md) when selecting concrete locales, scripts, fixtures, and rendering evidence for international verification.
- Read [references/ux-writing.md](references/ux-writing.md) for microcopy, actions, errors, empty states, and tone by mode.
- Read [references/laws.md](references/laws.md) when applying Hick, Fitts, Jakob, Doherty, recognition-over-recall, and cognitive-load evidence.

## Required sequence

1. **Define job:** actor, triggering situation, desired outcome, constraints, success signal, frequency, expertise, locale/accessibility needs.
2. **Map task:** current steps, decision points, interruptions, handoffs, errors, and recovery. Remove steps before decorating them.
3. **Walk the task:** use the cognitive-walkthrough contract for first-use intent, visibility, association, and feedback; escalate behavioral uncertainty to real-user evidence instead of inventing validation.
4. **Shape flow/IA:** minimize depth and ambiguous branches; preserve context; make entry/deep-link state explicit.
5. **Complete state matrix:** do not implement only the happy path.
6. **Design interaction copy and feedback:** action language, timing, progress, undo/recovery.
7. **Reduce cognitive load:** smart defaults, recognition, progressive disclosure, grouped decisions.
8. **Validate against platform conventions:** back/escape, scroll restoration, shortcuts, gestures, focus/controller behavior.
9. **Record unresolved UX risks** with evidence labels in the final Pixelcraft report.

## Non-negotiable checks

- Do not ask for information already available, inferable, previously entered, or low-value at the moment of use.
- Preserve user input across validation, navigation, authentication expiry, network failure, and accidental refresh where feasible.
- Every destructive action provides proportional undo, confirmation, or explicit irreversibility friction.
- Every async action exposes pending/success/failure/cancellation/retry semantics.
- Navigation state survives back/forward, refresh, deep link, logout/login, and app relaunch as appropriate.
- Primary tasks are operable without hover, memory of hidden commands, perfect network, or precise pointer control.
- Copy names the user's goal and next action; never blame the user.
