---
name: pixelcraft-ux
description: Designs rigorous user experience before and during implementation across any frontend stack. Use for task analysis, JTBD, user flows, information architecture, navigation, forms, passkeys, validation, empty/error/loading/offline and AI/streaming states, feedback timing, perceived performance, cognitive-load reduction, cognitive walkthrough, usability testing, localization-ready UX (i18n, RTL), UX writing, and interaction recovery.
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
3. **Diverge IA & workflow (greenfield / redesign):** before locking one layout or navigation pattern, compare **2–3 competing flow/IA shapes** (e.g., master-detail workbench vs. stepped drawer vs. inline ledger; single-screen workspace vs. tabbed routes) against step count, context preservation, and recovery cost. Record why the rejected shapes lost. Skip only when existing product IA or an approved spec fixes the flow.
4. **Walk the task:** use the cognitive-walkthrough contract for first-use intent, visibility, association, and feedback; escalate behavioral uncertainty to real-user evidence instead of inventing validation.
5. **Complete the mandatory core state matrix:** do not build only the happy path. Explicitly specify and wire every applicable core state: **empty** (first-use + no-results), **loading** (stable skeleton/progress without layout shift), **error** (cause + preserved input + recovery action), **disabled** (why disabled + how to unlock), **offline / degraded network**, **permission / unauthorized**, **long-content / overflow / extreme counts**, and **AI / streaming** (pending, partial tokens, abort/stop, citation provenance, side-effect approval).
6. **Design interaction copy and feedback:** concrete domain verbs, response-time budgets, progress, undo/recovery; zero AI marketing clichés (`references/ux-writing.md`).
7. **Reduce cognitive load:** smart defaults, recognition over recall, progressive disclosure, grouped decisions.
8. **Apply logical layout & locale resilience by default:** use logical directional properties (`inline-start`/`inline-end`, leading/trailing) and locale-aware number/date/currency/plural formatting **even on English-first apps** so future translation, expansion, or RTL never requires a structural rewrite.
9. **Validate against platform conventions & record risks:** back/escape, scroll restoration, shortcuts, gestures, focus/controller behavior, and unresolved UX risks with evidence labels.

## Non-negotiable checks & anti-slop guard

- Do not ask for information already available, inferable, previously entered, or low-value at the moment of use.
- Preserve user input across validation, navigation, authentication expiry, network failure, and accidental refresh where feasible.
- Every destructive action provides proportional undo, confirmation, or explicit irreversibility friction.
- Every async action exposes pending/success/failure/cancellation/retry semantics.
- Navigation state survives back/forward, refresh, deep link, logout/login, and app relaunch as appropriate.
- Primary tasks are operable without hover, memory of hidden commands, perfect network, or precise pointer control.
- **Anti-slop UX guard:** never ship a happy-path-only wireframe, dead-end `"No items yet"` empty state, `"Oops! Something went wrong"` error toast, vague `"Submit"`/`"Learn more"` buttons, AI hype microcopy, or half-wired forms that wipe entered values on validation failure.

## Pre-submit checklist

- [ ] 2–3 competing IA/workflow shapes compared and recorded for undecided greenfield/redesign flows (or existing/approved IA cited).
- [ ] All applicable core states specified and wired: `empty`, `loading`, `error`, `disabled`, `offline`, `permission`, `long-content`, and `AI/streaming`.
- [ ] User input preserved across errors and retries; destructive actions have proportionate undo or confirmation.
- [ ] Logical layout direction (`inline-start`/leading) and locale-aware date/number/plural formatting applied even on English-first apps.
- [ ] All CTAs, headings, errors, and empty states use concrete domain nouns/verbs with zero AI marketing clichés or fake proof.
- [ ] Primary task verified without hover, via keyboard/platform back-escape, and labeled honestly (`rendered`, `static`, `model-judgment`, or `not-checked`).
