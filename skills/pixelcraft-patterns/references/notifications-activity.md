# Notifications, inbox triage, and live activity feeds

Notification surfaces govern user attention. Noisy, ungrouped alerts train users to ignore critical events; over-aggressive live updates break reading flow.

## Notification center and inbox triage

Design an in-app notification center as a triage queue, not an infinite dump of chronological log lines:

- **Clear tabs / filters**: Separate `Unread` vs `All` (and high-signal buckets such as `Mentions`, `Assigned`, `Approvals`, or `Archived`) so users reach actionable items in one step.
- **Event batching & grouping**: Collapse bursts on the same object ("Alex, Priya, and 4 others commented on PR #412") with expandable detail instead of emitting 6 identical rows.
- **Direct triage actions**: Provide keyboard and pointer actions on each row: mark read/unread, archive/done, **snooze** (with explicit wake time and timezone), and mute this thread/object.
- **Safe bulk triage**: Pair `Mark all as read` (and `Archive all read`) with an immediate **Undo** affordance or explicit count confirmation when affecting unread items across pages so one misclick never wipes a morning's triage queue.
- **Deep-link accuracy**: Clicking a notification navigates straight to the exact comment, diff hunk, or approval step, marks the item read (with option to keep unread), and preserves Back navigation to the inbox.

## Channel × event preference matrix

Users need predictable control over *what* interrupts them and *where*:

| Event category | In-app | Email digest / instant | Push / mobile | Webhook / Slack |
|---|---|---|---|---|
| Security & billing alerts | Always on (locked) | Always on (locked) | Optional | Optional |
| Direct mentions & approvals | On | Instant / fallback if offline | On | Optional |
| Watched object comments | On | Hourly/daily digest | Off | Optional |
| Workspace announcements | On | Weekly digest | Off | Off |

- Clearly mark mandatory security/billing alerts as locked so users understand why they cannot be muted.
- Offer **digest cadence** (instant, hourly, daily, weekly), **smart presence suppression** (skip email/push if already active in-app), and **quiet hours / Do Not Disturb** respecting the user's timezone.

## Live activity feeds (zero scroll-jump contract)

- **Never yank scroll position**: When a user has scrolled down or is reading an activity stream, buffer incoming real-time items above the fold behind a calm **`N new updates`** pill button rather than injecting rows that push content downward.
- **Coherent event grammar**: Format every feed entry consistently (`Actor` + `verb` + `object link` + concise change preview + `relative/exact timestamp`).
- **Grouping & filtering**: Let operators filter by actor, event type, or date range and collapse noisy automated/bot churn separately from human edits.
- **Connection honesty**: Distinguish live streaming, paused, reconnecting, and offline states without flashing distracting badges.

## State matrix

| State | Required behavior |
|---|---|
| Inbox zero (caught up) | Calm confirmation state with quick link to `Archived` or `Notification settings`; never invent fake tips |
| Snoozed item wakes up | Re-enters top of `Unread` clearly labeled `"Snoozed until 9:00 AM"` |
| Target object deleted or access revoked | Show clear tombstone ("This issue is no longer accessible") and allow archiving the notification cleanly |
| Burst of 50+ events | Batch by object/actor and throttle badge/screen-reader announcements rather than firing 50 chimes or live-region alerts |
| Mark-all-read misclick | Show timed `Undo` banner restoring exact prior unread flags |

## Do/don't pairs

| Do | Don't |
|---|---|
| Show a non-jumping `"3 new items"` pill while scrolled in a feed | Prepend live rows that shift reading position mid-paragraph |
| Provide `Undo` after `Mark all as read` | Permanently clear 40 unread items on one accidental click |
| Offer a structured Channel × Event matrix with digest & quiet hours | Give only one global "Enable emails" checkbox |
| Batch repeated comments on the same thread into one grouped item | Flood the bell menu with 18 separate rows for one conversation |

## Verification

Test unread badge synchronization across tabs/devices, keyboard triage (`j`/`k`/archive/snooze/undo), batch grouping under event bursts, live feed scroll stability when scrolled down, deleted/unauthorized notification targets, timezone-aware snooze/quiet hours, screen-reader announcement restraint, and narrow mobile inbox layout.
