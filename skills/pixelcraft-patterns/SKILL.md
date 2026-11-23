---
name: pixelcraft-patterns
description: Applies surface-independent product UX patterns without collapsing into generic templates. Use for dashboards/admin, e-commerce PLP/PDP/cart/checkout, editors/creative tools/canvas, chat/collaboration, auth/onboarding/account, marketing landing pages, settings/preferences, search/filtering, tables/lists/CRUD, workflow structure, navigation models, state coverage, and pattern-specific verification across any frontend stack.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft patterns

Patterns are starting hypotheses, not layouts to copy. Choose one from the user's task and constraints, adapt it to the direction card and platform idioms, and preserve the mandatory floor. Marketing/persuasion rules differ from operational product rules; never mix them unconsciously.

## References

- Read [references/pattern-selection.md](references/pattern-selection.md) before choosing workflow, navigation, search/filter, dense-table, or hybrid pattern structure.
- Read [references/dashboard-admin.md](references/dashboard-admin.md) for operational overview, monitoring, admin, metrics, and control surfaces.
- Read [references/commerce.md](references/commerce.md) for PLP, PDP, cart, checkout, merchandising, payment, and post-purchase flows.
- Read [references/creative-tools.md](references/creative-tools.md) for editors, canvas, inspector, timeline, tool switching, autosave, and creative work surfaces.
- Read [references/communication.md](references/communication.md) for chat, comments, collaboration, presence, notifications, and shared work.
- Read [references/auth-onboarding.md](references/auth-onboarding.md) for sign-in/up, recovery, permissions, onboarding, account lifecycle, and trust.
- Read [references/marketing.md](references/marketing.md) for landing pages and campaigns where distinctiveness/persuasion rules differ from app UI.
- Read [references/settings.md](references/settings.md) for settings, preferences, configuration, destructive actions, and system integration.
- Read [references/search-filtering.md](references/search-filtering.md) for query input, faceting, empty results, sorting, large result sets, and recovery.
- Read [references/tables-crud.md](references/tables-crud.md) for dense data tables, list/detail, creation/edit/delete, bulk actions, import/export, and validation.

## Selection protocol

1. Identify the user's primary job and frequency. High-frequency operation favors density, predictability, keyboard flow, and recovery; low-frequency persuasion favors narrative, orientation, and memory.
2. Choose a primary pattern per screen using the decision matrices in `references/pattern-selection.md`; record user/task evidence and the rejected alternative. Hybrid screens need explicit regions, not blended metaphors.
3. Inventory real content/data states before layout: zero/one/many/long/error/offline/permission/slow/conflict.
4. Map the pattern into platform idioms using the appropriate surface skill by name. Do not copy DOM assumptions into mobile, TUI, email, game, document, or spatial surfaces.
5. Apply the direction card after the workflow is sound. Distinctiveness must not obscure the primary task.
6. Verify with the state matrix, keyboard/input path, `pixelcraft-review`, and `pixelcraft-visual-qa` where rendering is possible.

## Universal pattern rules

| Concern | Rule |
|---|---|
| orientation | Users must know where they are, what changed, and what happens next. |
| progressive disclosure | Show the next decision, not every control; preserve access to advanced state. |
| undo/recovery | Prefer reversible actions; when impossible, explain consequences before commitment. |
| empty state | Teach the next useful action; never use decorative emptiness or dead-end copy. |
| loading | Preserve layout stability and communicate whether user input/data is safe. |
| errors | Put recovery near the failure, preserve user input, and distinguish system fault from user action. |
| density | Density is chosen by frequency and expertise, not by copying admin templates. |
| navigation | Back/escape/deep links/refresh must restore understandable state. |
| truthfulness | No fake metrics, activity, reviews, presence, screenshots, or personalization. |

## Pre-submit checklist

- [ ] correct primary pattern selected and hybrid boundaries explicit;
- [ ] first-use, returning-use, empty, error, loading, permission, and long-content states designed;
- [ ] destructive/irreversible actions use consequence-appropriate friction;
- [ ] keyboard/controller/touch path and focus restoration match the platform;
- [ ] copy names concrete user/domain objects rather than generic “items” or “data”;
- [ ] adaptation and localization stress cases use real or realistic content;
- [ ] visual distinctiveness supports rather than overrides task completion;
- [ ] evidence labels distinguish rendered behavior from static inference.
