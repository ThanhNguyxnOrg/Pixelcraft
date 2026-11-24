---
name: pixelcraft-chat-ui
description: Designs and verifies conversational interfaces across two tracks—(A) host-constrained messaging platforms and mini apps (Slack Block Kit/AI Assistants, Discord Components V2/Activities, Telegram Bots/Mini Apps, Zalo Mini Apps/ZNS, WhatsApp Interactive Messages/Flows, Microsoft Teams Adaptive Cards/AI Library, LINE LIFF/Flex Messages, WeChat Mini Program) and (B) app-owned AI and agentic chat workspaces (Vercel AI SDK UI, assistant-ui, CopilotKit v2, AG-UI, MCP Apps/MCP-UI, OpenAI Apps SDK, Google A2UI, LangGraph useStream, streaming traces, branching, split artifacts, and approval gates).
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft chat UI

Conversational interfaces fall into two distinct architectural tracks. Identify which track you are building first so you neither force web-app chrome into a host-constrained messaging payload nor under-design an app-owned AI workbench:

- **Track A — Host-constrained Messaging & Mini Apps**: Slack, Discord, Telegram, Zalo, WhatsApp, Microsoft Teams, LINE, and WeChat. The host controls typography, spacing, theme, accessibility tree, notifications, and hard payload/timeout limits. Reduce every turn to the smallest actionable native primitive and preserve plain-text fallback.
- **Track B — App-owned AI & Agentic Chat Workspaces**: Custom web, desktop, or mobile AI assistants, copilots, and multi-agent workbenches. You own scroll physics, streaming Markdown stability, collapsible tool/reasoning traces, conversation branching, split artifact panes, citations, and human-in-the-loop approval gates.

## Surface craft

Let the message carry the essential meaning as scannable text, then offer the next relevant native action. For Track A, verify interaction acknowledgements (3 s windows), expired or duplicate taps, byte/character budgets, and plain-text fallback on degraded clients. For Track B, verify scroll-yield when the user scrolls up mid-stream, `Stop` abort integrity, collapsed traces, and idempotent approval cards. Never mistake fake typing theater, decorative blocks, or emoji bullet spam for usable interaction.

## References

- Read [references/slack-discord.md](references/slack-discord.md) when building Slack Block Kit (including AI Assistant streaming surfaces, `table`/`rich_text` blocks) or Discord embeds, Components V2, expanded Modals, and Embedded Activities.
- Read [references/mobile-business-platforms.md](references/mobile-business-platforms.md) when building Telegram Bots/Mini Apps (Bot API 8.x–9.x), Zalo Mini Apps/ZNS, WhatsApp Interactive Messages & Flows, Microsoft Teams Adaptive Cards/AI Library, LINE LIFF/Flex Messages, or WeChat Mini Programs.
- Read [references/conversation-design.md](references/conversation-design.md) when designing progressive disclosure, ephemeral vs persistent state, idempotent interaction lifecycles, plain-text fallbacks, and privacy/anti-slop rules across any chat surface.
- Read [references/agentic-workspace.md](references/agentic-workspace.md) when designing app-owned AI workspaces: streaming scroll-yield, tool/reasoning traces, approval gates, split artifact panes, branching/edit-and-fork, multimodal/voice/`@`-mentions, resumable runs, context transparency, and streaming Markdown/XSS safety.
- Read [references/ai-ui-libraries.md](references/ai-ui-libraries.md) when implementing AI frontend SDKs and protocols: Vercel AI SDK v5/v6 (React, Vue, Svelte, Angular), `assistant-ui`, CopilotKit v2, AG-UI, MCP Apps/MCP-UI, OpenAI Apps SDK (`window.openai`), Google A2UI, AI Elements/prompt-kit, or LangGraph `useStream`.

## Required workflow

1. **Select track and surface.** Track A (channel, DM, ephemeral reply, thread, modal, Home tab, mini app, Flow, Adaptive Card) or Track B (standalone workspace, side-panel copilot, embedded MCP/Apps widget). Capabilities, timeouts, and privacy rules differ sharply.
2. **Define the conversational job.** Separate immediate answer, supporting evidence/trace, primary action, confirmation/approval gate, and persistent audit state.
3. **Choose native primitives or typed SDK parts.** On Track A, use host-native buttons/selects/cards/Flows instead of ASCII tables or screenshots. On Track B, render structured typed parts (`text`, `reasoning`, `tool-*`, `source-*`) rather than overloading flat strings.
4. **Budget limits and latency.** Count exact UTF-8 bytes/characters, component caps, and ack timeouts (Track A) or streaming render/context-window/resume lifecycles (Track B).
5. **Preserve fallback and recovery.** Guarantee plain-text fallback, idempotent server-side authorization, preserved failed drafts, and clear stopped/expired/unauthorized states.
6. **Verify on real targets.** Inspect desktop/mobile, light/dark, narrow viewports (`390px`), keyboard/screen-reader narration, localization expansion, offline/retry, and abort/expiry paths. Label gaps honestly as `not-checked`.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| platform truth | Verify limits, component flags, and SDK versions against current official docs; never copy stale blog limits or deprecated v4/tuple idioms. |
| progressive disclosure | Lead with the answer and primary action; collapse multi-step traces or move deep detail into threads, modals, mini apps, or split artifacts. |
| state integrity | Separate ephemeral/private errors from persistent/shared channel records; never leak private context into shared rooms. |
| action safety | Destructive, financial, or external side effects require explicit human approval, server-side authorization, and idempotency against double-taps/replays. |
| accessibility | Name every control by outcome (`Approve invoice #1042`); never rely on color/emoji alone or put `aria-live="assertive"` on token-by-token text nodes. |
| privacy & security | Validate webhook signatures, `initData` HMAC, ID tokens, and callback payloads server-side; sanitize streamed Markdown/HTML against XSS. |
| anti-slop | Reject fake typing delays, fabricated "thinking…" steps, wall-of-text replies, emoji bullet spam, dead buttons, and cheerful filler before the answer. |

## Pre-submit checklist

- [ ] Track A host/schema versions or Track B SDK/protocol versions are explicitly verified;
- [ ] payload limits, UTF-8 byte bounds, and 3 s ack / resume lifecycles are respected;
- [ ] rich cards degrade cleanly to plain-text fallback, and streamed Markdown closes fences safely without XSS;
- [ ] loading, streaming, stopped, expired, retry, unauthorized, and already-completed states are handled;
- [ ] callback payloads, tokens, and tool approvals are validated server-side and idempotent;
- [ ] light/dark, mobile/desktop, scroll-yield, and keyboard paths are verified (`rendered`) or explicitly labeled `not-checked`.
