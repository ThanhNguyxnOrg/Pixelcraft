---
name: pixelcraft-patterns
description: Applies surface-independent product UX patterns without collapsing into generic templates. Use for dashboards/admin, e-commerce PLP/PDP/cart/checkout, SaaS billing/paywalls/usage metering, multi-tenant RBAC/SSO/audit logs, notifications/inbox/activity feeds, calendars/scheduling/Gantt/Kanban, undo/version history/diff viewers, editors/creative tools, chat/collaboration, auth/passkeys/onboarding, marketing/editorial composition, scrollytelling, settings, search/filtering, dense tables/CRUD, command palettes (Cmd+K), embedded AI/copilot UX, and offline-first sync/conflict resolution across any frontend stack.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft patterns

Patterns are starting hypotheses, not layouts to copy. Choose one from the user's task and constraints, adapt it to the direction card and platform idioms, and preserve the mandatory floor. Marketing/persuasion rules differ from operational product rules; never mix them unconsciously.

## References

- Read [references/pattern-selection.md](references/pattern-selection.md) before choosing workflow, navigation, search/filter, dense-table, or hybrid pattern structure.
- Read [references/dashboard-admin.md](references/dashboard-admin.md) when designing operational overview, monitoring, admin, triage queues, and drill-down control surfaces.
- Read [references/commerce.md](references/commerce.md) when designing retail PLP, PDP, cart, checkout, payment errors, and post-purchase flows.
- Read [references/billing-paywalls.md](references/billing-paywalls.md) when designing SaaS pricing tables, proration previews, soft/hard paywalls, usage meters, dunning banners, or self-serve cancellation.
- Read [references/multi-tenant-rbac.md](references/multi-tenant-rbac.md) when designing workspace/tenant switchers, RBAC/ABAC permission editors, SSO/SCIM admin setup, API keys/webhooks, or diffable audit logs.
- Read [references/notifications-activity.md](references/notifications-activity.md) when designing notification centers, inbox triage (snooze/archive/undo), channel × event preference matrices, or live activity feeds.
- Read [references/scheduling-kanban.md](references/scheduling-kanban.md) when designing calendars, booking pickers, recurrence/DST handling, Gantt timelines, or Kanban boards with WIP limits and WCAG 2.5.7 non-drag moves.
- Read [references/history-diff-undo.md](references/history-diff-undo.md) when designing atomic undo/redo stacks, multiplayer per-user undo, named version snapshots, or code/rich-text/JSON diff viewers.
- Read [references/ai-and-offline-patterns.md](references/ai-and-offline-patterns.md) when designing embedded in-app AI workflows (hybrid search, NL-to-filter, inline diffs, approval gates) or offline-first sync status, outboxes, and conflict resolution.
- Read [references/creative-tools.md](references/creative-tools.md) when designing editors, canvases, layer trees, mixed-value multi-select inspectors, snapping/guides, and creative workspaces.
- Read [references/communication.md](references/communication.md) when designing human-to-human in-app chat, threads, unread dividers, pins, and collaboration surfaces.
- Read [references/auth-onboarding.md](references/auth-onboarding.md) when designing sign-in/up, passkeys, OTP/magic links, enterprise SSO discovery, progressive onboarding checklists, and account lifecycle.
- Read [references/marketing.md](references/marketing.md) when designing conversion architecture, proof, trust rules, and persuasion surfaces.
- Read [references/creative-web-composition.md](references/creative-web-composition.md) when designing art-directed editorial rhythm, case studies, interactive showcases, and expressive section composition.
- Read [references/narrative-systems.md](references/narrative-systems.md) when designing multi-chapter scrollytelling outlines, narrative models, and chapter state contracts.
- Read [references/scroll-implementation.md](references/scroll-implementation.md) when choosing scroll-coupled vs stepped progression models and bounded pinning rules.
- Read [references/accessibility-resilience.md](references/accessibility-resilience.md) when ensuring scrollytelling focus stability, reduced-motion linear fallback, and zoom/RTL resilience.
- Read [references/settings.md](references/settings.md) when designing settings, org/workspace/user inheritance, sticky dirty-save bars, and type-to-confirm danger zones.
- Read [references/search-filtering.md](references/search-filtering.md) when designing query inputs, faceting, empty-result diagnosis, sorting, and large-result recovery.
- Read [references/tables-crud.md](references/tables-crud.md) when designing dense operational tables, list/detail, CRUD, bulk actions, selection contracts, and import/export.
- Read [references/command-workspace.md](references/command-workspace.md) when designing surface-independent command palettes (`Cmd+K`/`Ctrl+K`), keyboard-first navigation, optimistic UI with rollback/undo, master-detail split panes, and density modes.

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
- [ ] first-use, returning-use, empty, error, loading, permission, conflict, and long-content states designed;
- [ ] destructive/irreversible actions use consequence-appropriate friction;
- [ ] keyboard/controller/touch path and focus restoration match the platform;
- [ ] copy names concrete user/domain objects rather than generic "items" or "data";
- [ ] adaptation and localization stress cases use real or realistic content;
- [ ] visual distinctiveness supports rather than overrides task completion;
- [ ] evidence labels distinguish `rendered` behavior from `static` inspection or `model-judgment`.
