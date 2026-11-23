# Chat, comments, and collaboration

Communication UI depends on sequence, authorship, timing, and trust. Visual flair must never obscure who said what or whether it was sent.

## Core rules

- Message hierarchy distinguishes author, time, body, attachments, reactions, edits/deletes, replies, and system events.
- Sending states are truthful: composing, queued/offline, sending, sent/delivered/read only when actually known.
- Presence/typing indicators must expire and degrade gracefully; never fabricate activity.
- Mentions/notifications need muting, escalation, and unread-state semantics that survive refresh.
- Attachments need filename/type/size/progress/error/removal and safe preview behavior.

## Collaboration states

Handle empty conversation, long threads, rapid incoming messages, scrollback loading, network interruption, duplicate submit, permission loss, moderation, edit/delete race, conflicting simultaneous editors, and accessibility announcements without overwhelming users.

## Composer

- Preserve drafts per conversation/context and warn before destructive discard.
- Enter/send behavior must match platform convention and multiline editing needs.
- Emoji/reactions are additive semantics, not replacements for accessible names/text.
- Paste/upload validation preserves typed content and reports rejected files concretely.

## Verification

Test screen-reader announce behavior for incoming content carefully, keyboard jump to unread/composer, RTL/LTR mixed text, emoji/ZWJ sequences, long unbroken strings, timestamp locale/timezone, image failure, dark mode, reduced motion, and offline queue recovery.
