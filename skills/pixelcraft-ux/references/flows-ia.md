# Flows, JTBD, and information architecture

Evidence: recognition-over-recall and cognitive-load principles plus platform conventions.

## JTBD frame

Write: “When `<situation>`, `<actor>` wants to `<progress>` so `<outcome>`, despite `<constraint>`.” Add frequency, urgency, expertise, device/input, locale, accessibility need, and emotional/stakes context. Do not confuse persona demographics with causal context.

## Task analysis

| Column | Required detail |
|---|---|
| trigger | what starts the task; every entry point |
| goal state | observable success, not UI submission |
| steps | user decision/action, system work, handoff/wait |
| knowledge | what must be remembered vs recognized |
| failure | validation/network/permission/interruption/ambiguity |
| recovery | undo/retry/edit/cancel/support path |

Remove or automate steps before optimizing their visual design. Smart defaults must be reversible and visible.

## Flow shape

- Count real decision/action steps, not screen count. A one-screen overloaded form can be worse than a short sequence.
- Keep depth shallow for high-frequency tasks; use progressive disclosure only when the hidden choice is genuinely secondary.
- Preserve orientation: current position, progress certainty, completion consequence, escape/back behavior.
- Branch only when answers change later questions. Do not gate optional enhancement behind mandatory account creation or irrelevant choices.
- End with confirmation that states what happened, what happens next, and the useful next action—not a dead end.

## IA checks

- Group by user task/domain object, not internal org chart or implementation modules.
- Labels must be mutually exclusive at the same level; avoid catch-all “More/Other” unless genuinely necessary.
- Search, browse, filters, recent items, and saved state serve different recall/recognition modes; choose intentionally.
- Deep links must restore entity, filter/tab/pane, scroll anchor, permission state, and meaningful not-found/error behavior.
- Every entry point—notification, QR, email, search result, share sheet, CLI/docs link—lands in context rather than dumping users at home.

## Platform navigation

- Honor platform back: browser history, Android predictive back, iOS edge swipe/navigation back, desktop Escape/close semantics. Never trap or silently discard work.
- Restore scroll/pagination/selection when returning; reset only when context changed or stale state is unsafe.
- Desktop/web productivity: document keyboard shortcuts, focus behavior, modified-state semantics, and conflict handling.
- Mobile: account for one-hand reach, edge gestures, bottom-sheet dismissal, keyboard occlusion, and interruption by calls/notifications.
- TUI/game/controller: publish navigation model and focus order; do not depend on pointer-only mental models.
