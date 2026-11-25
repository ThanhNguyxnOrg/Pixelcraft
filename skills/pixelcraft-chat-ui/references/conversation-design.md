# Conversation design for structured messaging

A chat UI is a sequence of turns with memory, context collapse, permission boundaries, and unreliable attention. Rich components do not remove the need for conversational design.

## Progressive disclosure

Structure each response:

1. **answer/status** — one concise statement of what happened or what is needed;
2. **primary action** — at most one obvious next step where possible;
3. **supporting evidence** — compact facts/diff/log excerpt;
4. **detail path** — thread, modal, expand, mini app, external link, or follow-up command.

Do not reverse this order. A stack trace before the answer forces every reader to parse detail irrelevant to most turns.

Use continuation deliberately: “3 of 12 failing checks shown” plus an inspect action is better than truncating silently. Never hide a blocking error below decoration.

## Ephemeral versus persistent

| State/content | Correct surface |
|---|---|
| private validation error or permission explanation | ephemeral interaction response/direct surface |
| shared decision/result/audit trail | persistent channel/card state |
| transient progress | updateable response or clearly temporary status |
| sensitive draft/input | private modal/mini-app surface with explicit submission |
| expired interaction | disabled/replaced persistent state plus ephemeral explanation |

Do not leak private errors into public channels, but do not hide shared outcomes in ephemeral messages where collaborators need the record.

## Interaction lifecycle

Every action needs states for:

- ready/available;
- loading/acknowledged;
- success/completed;
- validation failure;
- unauthorized;
- expired/stale;
- retryable backend failure;
- already completed by someone else;
- partial completion/rollback where applicable.

Actions must be idempotent. A double tap, retried webhook, or reopened old card must not duplicate purchases, approvals, deployments, or destructive operations. Server-side authorization is mandatory even when the host hides a control.

## Fallback text and degraded clients

Rich rendering is optional context, not the sole carrier of meaning. Provide concise fallback text that answers:

- what happened;
- which object/thread it concerns;
- what action is available;
- where to inspect detail.

Fallback must not expose secrets or rely on callback internals. Test plain-text notifications/accessibility extraction/screen readers where available.

## Accessibility and inclusion

- label controls by outcome and object (`Approve invoice #1042`);
- avoid emoji/color-only severity and repeated decorative emoji bullets;
- preserve reading order: answer before metadata/actions;
- use plain language and concrete error recovery;
- account for localized text expansion/contraction and non-Latin scripts;
- do not use ASCII tables that collapse in proportional/mobile clients;
- avoid time-only urgency (“soon”)—use absolute time plus relative context where useful.

## Recovery, `429` rate limits, and warm human escalation

- **3-part error recovery (*What failed · Why · Next action*)**: replace vague `"Something went wrong"` banners with concrete actionable copy (*"Invoice lookup failed · Warehouse timed out after 15 s · Retry query or narrow date range"*) preserving the user's draft.
- **`429` rate-limit countdown & queue**: when quota or burst limits trip, display the exact `Retry-After` countdown (`Rate limit reached — sending queued prompt in 12s`) with a `Cancel queued send` button rather than dropping the user's message.
- **Warm human-support escalation**: never trap frustrated or out-of-policy users in a bot loop ("I didn't understand that" × 3). Offer a visible **Talk to a human** handoff that transfers a **structured conversation summary, entity IDs, and failed tool traces** directly to the support agent so the customer **never repeats themselves**, displaying real queue/SLA status.

## Privacy, retention disclosure, and security

- validate interaction signatures/tokens and mini-app initialization data server-side;
- scope callback data/opaque IDs and expire them;
- redact secrets and personal data from logs/cards/fallbacks, and block untrusted Markdown `<img>` URLs from auto-fetching (`CSP img-src` allowlist / click-to-load);
- disclose **data retention & model-training policy** plainly in workspace chrome/settings and provide a working **Delete Thread** action that purges conversation state and uploaded files;
- use `Before -> After` confirmation cards for irreversible/shared actions (`Approve once` / `Edit` / `Reject`);
- never ask for passwords/tokens in chat input unless the platform explicitly provides an encrypted secret modal/flow.

## Anti-slop warnings

Reject cheerful filler before the answer, fake typing delays, repeated apologies, dead-end “OK” buttons, raw JSON tool-approval dumps, emoji spam, undocumented truncation, cold bot-to-human transfers that lose history, and “AI assistant” personas that obscure system state. The interface should sound like a competent tool: direct, contextual, reversible, and honest.
