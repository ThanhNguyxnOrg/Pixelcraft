# Chat, comments, and collaboration

Communication UI depends on sequence, authorship, timing, and trust. Visual flair must never obscure who said what, which thread it belongs to, or whether it was delivered.

> **Cross-skill boundary:** This reference covers human-to-human in-app messaging, comments, and collaborative threads. Both **hosted messaging bots/mini apps** (Slack, Discord, Telegram, WhatsApp, Teams, LINE, WeChat, Zalo) **and in-app AI/agentic chat workspaces** (streaming traces, tool cards, citations, approval gates) route to `pixelcraft-chat-ui` alongside `pixelcraft-patterns`. Cross-app notification centers and activity feeds are detailed in [notifications-activity.md](notifications-activity.md).

## Message hierarchy and threading models

Choose one explicit threading model per surface and keep reply ancestry legible:

| Threading model | Best for | Required cues |
|---|---|---|
| Quote / inline reply | Fast chat rooms, mobile messaging | Compact quoted snippet that jumps to original message; handle deleted parent gracefully |
| Side-panel / sub-thread | Team channels, document comments | Reply count + participant avatars + last-reply timestamp on parent; explicit "Also send to channel" toggle when needed |
| Topic-scoped thread list | Support tickets, issue discussions, async forums | Subject title, resolution/status badge, participant list, clear open vs resolved filter |

- Distinguish author, role/badge, relative + exact hover/focus timestamp (with timezone awareness), body, attachments, reactions, edited/deleted markers, and system events.
- Delivery states must stay truthful: composing, queued offline, sending, sent, delivered/read only when actually verified by the backend.
- Expire presence and typing indicators automatically on timeout or disconnect; never fabricate online dots.

## Unread dividers, search, pins, and triage

- **Unread divider**: Anchor a visible "New messages" divider at the last-read watermark without jumping scroll position unexpectedly while the user is reading history. Offer a floating "Jump to unread / latest" pill and a keyboard-accessible "Mark as read" action.
- **Message search & pins**: Search results must show surrounding snippet context, author, channel, and date, and jumping to a match must temporarily highlight the target message and provide a "Back to latest" return cue. Keep pinned messages inspectable in a dedicated drawer/banner without cluttering the stream.
- **Notification triage**: Expose per-channel/thread mute, mentions-only, and follow/unfollow controls right in the conversation header so busy threads do not force users to mute the entire app.

## Composer and collaboration states

- Preserve unsent drafts per conversation/thread across navigation and reloads; warn before discarding attachments or long drafts.
- Match Enter vs Shift+Enter / Cmd+Enter behavior to platform convention and document it subtly near the send control.
- Show attachment filename, MIME/type, size, upload progress, cancel/retry, and safe preview/download handling; keep typed text intact if an upload fails validation.
- Handle empty rooms, rapid message bursts, scrollback pagination without scroll-jump, offline send queues, duplicate-click idempotency, permission revocation mid-thread, and moderated/deleted messages cleanly.

## Do/don't pairs

| Do | Don't |
|---|---|
| Anchor an unread divider and show a non-jumping "N new messages" pill | Yank the viewport to the bottom while a user reads older messages |
| Persist drafts per channel and thread across switches | Wipe a typed reply when switching rooms to copy a link |
| Keep deleted parent messages as a clear tombstone in active threads | Break thread ancestry or orphan replies silently |
| Expose per-thread mute / mentions-only controls inline | Force all-or-nothing app-wide notification muting |

## Verification

Test live-region politeness (do not read every burst message aloud automatically), keyboard jump between unread/messages/composer, mixed RTL/LTR text, emoji/ZWJ sequences, unbroken URLs, timezone/DST timestamps, failed image previews, offline queue flush and retry, permission loss, and reduced motion.
