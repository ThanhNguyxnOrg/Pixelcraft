---
name: pixelcraft-chat-ui
description: Designs and verifies conversational and messaging-platform interfaces across Slack Block Kit, Discord components/embeds/modals, Telegram bots and Mini Apps, Zalo Mini Apps/ZaUI, WhatsApp interactive messages, and Microsoft Teams Adaptive Cards. Use for bot responses, chat cards, keyboards, modals, interactive buttons/selects/lists, messaging mini apps, chat-safe formatting, conversation flows, ephemeral versus persistent state, fallback text, messaging accessibility, and platform payload-limit compliance.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft chat UI

Messaging interfaces are constrained embedded surfaces. The host controls typography, spacing, theme, chrome, input modality, accessibility tree, scrolling, notifications, and often whether content is persistent or ephemeral. Do not paste a web dashboard into chat: reduce the decision to the smallest actionable conversational unit.

## References

- Read [references/slack-discord.md](references/slack-discord.md) for Slack Block Kit surfaces/limits/mrkdwn and Discord embeds, Components V2, buttons/selects/modals.
- Read [references/mobile-business-platforms.md](references/mobile-business-platforms.md) for Telegram bots/Mini Apps, Zalo Mini Apps/ZaUI, WhatsApp interactive messages, and Teams Adaptive Cards.
- Read [references/conversation-design.md](references/conversation-design.md) for progressive disclosure, fallback text, ephemeral state, confirmations, accessibility, localization, privacy, and anti-slop conversation patterns.

## Required workflow

1. **Identify host and surface.** Message/channel, direct message, ephemeral response, thread, modal, home tab, mini app, card refresh, notification, or bot command response. Platform capabilities and privacy differ by surface.
2. **Define the conversational job.** What decision/action must happen here? Separate immediate answer, evidence/detail, action, confirmation, and audit/persistent state.
3. **Choose native primitives.** Prefer host-native buttons/selects/cards/keyboards/templates over simulated markup or screenshots; they carry platform input/accessibility semantics.
4. **Budget payload and attention.** Count documented character/block/component limits before composing. Design truncation and continuation rather than failure at the boundary.
5. **Preserve fallback meaning.** Every rich card/keyboard/component needs plain-text or degraded-client semantics, interaction failure handling, timeout/expiry behavior, and idempotent actions.
6. **Verify in real clients.** Inspect narrow/wide, light/dark, desktop/mobile, accessibility narration where available, localization expansion, denied permissions, offline/interaction retry, and unsupported-client fallback.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| platform truth | Validate limits and component behavior against current official documentation; do not rely on stale blog tables. |
| progressive disclosure | Lead with the answer and primary action; hide detail behind expandable/thread/modal/mini-app paths instead of dumping everything. |
| state integrity | Distinguish ephemeral/private state from persistent/shared state. Never expose private draft/error context in a public channel by accident. |
| action safety | Destructive/irreversible actions need confirmation, clear consequences, authorization checks server-side, and idempotency. |
| accessibility | Controls need meaningful labels; color/icon-only status, emoji-only semantics, screenshots of text, and keyboard-only input with no alternative are failures. |
| privacy | Treat chat payloads, callback data, deep links, mini-app init data, and interaction tokens as security-sensitive; validate server-side. |
| anti-slop | No wall-of-text bot replies, emoji bullet spam, fake typing theater, repeated “I’m sorry” loops, dead buttons, or cards whose only action is a generic external link. |

## Pre-submit checklist

- [ ] exact host/surface/schema/component versions are identified;
- [ ] documented limits are counted and cited in implementation notes where they constrain design;
- [ ] content remains understandable when rich rendering/components are unavailable;
- [ ] interaction expiry, retry, loading, error, unauthorized, and already-completed states exist;
- [ ] callback payloads are validated server-side and actions are idempotent;
- [ ] light/dark/mobile/desktop/narrow clients were inspected or labeled `not-checked`;
- [ ] persistent versus ephemeral visibility is correct;
- [ ] destructive actions require appropriate confirmation and authorization.
