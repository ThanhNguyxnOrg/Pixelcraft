# Telegram, Zalo, WhatsApp, Teams, LINE, and WeChat

Verify exact schema versions and host API availability against current official docs before releasing; mobile and business super-app runtimes update rapidly.

## Telegram Bots and Mini Apps (Bot API 8.x–9.x)

| Constraint | Documented limit / rule |
|---|---|
| Text message length | 1–4,096 characters after entity parsing |
| Media caption length | 0–1,024 characters after entity parsing |
| Inline button `callback_data` | **1–64 UTF-8 bytes** (CJK/Vietnamese/emoji take 2–4 bytes each—measure byte length, never JS `.length`) |
| Callback acknowledgement | **Always call `answerCallbackQuery`** on every inline tap to dismiss the client loading spinner |
| Entity nesting | Respect Telegram nesting rules; blockquotes cannot nest; prefer explicit entities or escaped HTML |

- **Keyboards**: Attach inline keyboards to message-scoped actions; make reply keyboards `one_time_keyboard` or explicitly removable so they do not hijack the composer indefinitely.
- **Mini App (`Telegram.WebApp`) modern capabilities (Bot API 8.0–9.x)**:
  - Use **`MainButton`** (primary action) paired with **`SecondaryButton`** (secondary/cancel action) and **`BackButton`** instead of duplicating fixed bottom bars inside the WebView.
  - Honor safe areas using **`--tg-safe-area-inset-top/bottom/left/right`** and **`--tg-content-safe-area-inset-*`** CSS variables, especially when using **`requestFullscreen()` / `exitFullscreen()`** on mobile.
  - Feature-detect **`addToHomeScreen()`**, **`BiometricManager`** (auth gate with graceful fallback), **`CloudStorage` / `SecureStorage`** (bot-scoped client persistence), and **Telegram Stars** digital goods checkout via `openInvoice(url)` (currency `XTR`).
  - Always verify **`initData`** HMAC signature server-side with the bot token; never trust client-provided `initDataUnsafe` user IDs for authorization. Bind UI colors to `themeParams` rather than hardcoding a single theme.

## Zalo Mini Apps, ZaUI, and Zalo OA (ZNS)

- Configure pages, header style, status bar, and safe areas in **`app-config.json`**, use **`zmp-ui`** (`zmp-ui/zaui.css` + `<App theme="light" | "dark">`) for ZDS-compliant components, and access host APIs through **`zmp-sdk`** (`authorize`, `getUserInfo`, `openChat`, `getStorage`/`setStorage`, `getSystemInfo`).
- Design for embedded Vietnamese phone viewports (account for stacked diacritics and line height), intermittent mobile networks, permission-denial recovery, and server-side token exchange.
- For proactive business notifications outside active user chat sessions, use approved **Zalo OA / ZNS (Zalo Notification Service)** transactional templates with parameterized fields rather than unauthorized free-form pushes.

## WhatsApp Business Interactive Messages and Flows

| Constraint | Documented limit |
|---|---|
| Interactive body text | up to **1,024 characters** |
| Reply buttons | up to 3 buttons, **max 20 characters per title** |
| List message | up to 10 rows total; section & row title **max 24 chars**, description **max 72 chars** |
| CTA URL button (`cta_url`) | single external link button with explicit display text (max 20 chars) |
| Carousel templates | pre-approved multi-card media templates with identical button count/types across every card |
| Service window | Interactive list/reply messages require an open 24-hour user-initiated window; proactive outreach requires approved templates or Flows |

- **WhatsApp Flows (JSON multi-screen forms)**: Use Flows for structured appointment booking, lead capture, or checkout instead of forcing 8 back-and-forth text turns. Define typed `screens` (`Form`, `TextInput`, `Dropdown`, `DatePicker`, `Footer` with `data_exchange` or `complete`), implement **RSA-OAEP + AES-GCM payload encryption/decryption** on your data-exchange endpoint, return clear field-level validation errors on the active screen, and test narrow truncation on 20-char button labels.

## Microsoft Teams Adaptive Cards, Dialogs, and Teams AI Library

- Teams desktop/web/mobile and Microsoft Copilot Chat target **Adaptive Cards schema 1.5** (supporting **`Carousel`**, **`CodeBlock`**, and **`Chart.*`** elements where host-verified—always test in the actual target client, not just the web designer, because Outlook Actionable Messages and Bot Framework Web Chat diverge).
- Use **`Action.Execute`** with `refresh` payloads so cards transition cleanly from actionable to completed/expired state across channel viewers, provide concise `speak` text, and respect HostConfig rather than fighting Teams typography or dark/high-contrast themes.
- **Teams AI Library**: For LLM agents in Teams, use native streaming responses (`streamer.emit(...)`), **`setGeneratedByAI` / AI disclosure badges**, sensitivity labels, inline numbered citations, and feedback-loop buttons.
- **Teams Dialogs (Task Modules) & Tabs**: Use `@microsoft/teams-js` (`dialog.url.open` / `app.notifySuccess`) for complex multi-step forms or auth popups that exceed Adaptive Card input limits.

## LINE LIFF and Flex Messages

- **Flex Messages**: Compose rich cards via JSON `bubble` (single card with `header`, `hero`, `body`, `footer` boxes) or `carousel` (up to 12 horizontally scrollable bubbles). Every Flex Message **must include a concise `altText`** (max 400 chars) shown in chat lists, push notifications, and unsupported clients.
- **Quick Replies**: Attach up to 13 transient action chips (`message`, `postback`, `datetimepicker`, `camera`, `location`) at the bottom of a message for single-tap next replies; they disappear once tapped.
- **LIFF SDK v2**: Initialize with `await liff.init({ liffId })`, verify `liff.getIDToken()` server-side against LINE's verify endpoint (never trust decoded JWTs unverified), respect configured sheet height (`compact`, `tall`, `full`), check `liff.isInClient()` before calling `liff.sendMessages()` or `liff.closeWindow()`, and provide a clean browser fallback when opened outside LINE.

## WeChat Mini Program (`WXML` / `WXSS` / `wx.*`)

- Build layouts in **`WXML`** and **`WXSS`** using responsive **`rpx`** units (750 rpx = screen width), calculate custom navigation bar clearance from **`wx.getMenuButtonBoundingClientRect()`** and `wx.getWindowInfo()` safe-area insets so controls never collide with WeChat's floating capsule button.
- Authenticate via `wx.login()` -> send ephemeral `code` to your server -> exchange via `code2Session` (never expose `AppSecret` in Mini Program code); handle `wx.requestPayment` failures/cancellations idempotently.
- Respect hard **2 MB main-package size budgets** via `subpackages` lazy loading, and use **Official Account / Subscription Message templates** strictly with explicit user opt-in (`wx.requestSubscribeMessage`) and truthful transactional content.

## Cross-platform bot webhook & interaction reliability (`Slack`, `Discord`, `Telegram`, `Zalo`, `WhatsApp`, `Teams`, `LINE`, `WeChat`)

- **Fast webhook `ack` (`< 2–3 s`) + async progress state**: acknowledge every incoming webhook, slash command, button tap, or callback query within **`< 2–3 s`** (`HTTP 200`, `deferReply`, `answerCallbackQuery`, or `Action.Execute` interim card), push heavy LLM/API work to an async queue, and update the placeholder message in place with progress/results so host timeouts never show `"This interaction failed"`.
- **Idempotent event deduplication**: messaging hosts retry webhooks on transient `5xx` or slow edges (`X-Slack-Retry-Num`, Telegram `update_id`, WhatsApp `messages[].id`, LINE `webhookEventId`, WeChat `MsgId`). Deduplicate on a short-TTL idempotency key before executing mutations or sending replies so users never get double-charged or duplicate bot messages.
- **Edited & deleted message handling**: subscribe to `message_changed`/`edited_message` and `message_deleted`/recall events—abort in-flight generations for deleted prompts, avoid crashing when editing/replying to a user-deleted message (`400 message to edit not found`), and clearly mark or refresh bot answers when the source prompt was edited.
- **Invalid command & missing-parameter guidance**: when a slash/text command has malformed syntax or missing required arguments, reply ephemerally with concise usage examples, valid option chips/buttons, or pre-filled modal/Flow launchers—never dump raw parser tracebacks or stay silent.

## Do/don't pairs

| Do | Don't |
|---|---|
| Return webhook `ack` in `< 2–3 s` + async progress state and deduplicate `update_id` / `webhookEventId` / `MsgId` idempotently | Run a `12 s` synchronous LLM call inside the webhook handler or execute duplicate mutations on host retries |
| Handle edited/deleted user messages gracefully and show actionable usage examples + quick-reply pickers on invalid/incomplete commands | Crash on `message not found` when a user deletes a prompt or fail silently on missing command parameters |
| Measure UTF-8 bytes for Telegram's 64-byte `callback_data` and always call `answerCallbackQuery` | Check `.length` on multibyte strings or leave Telegram buttons spinning |
| Validate `initData` HMAC (Telegram), `getIDToken()` (LINE), and `wx.login` code (WeChat) server-side | Trust client-passed user IDs from Mini App JS globals |
| Use WhatsApp Flows (with RSA/AES data-exchange encryption) for multi-field collection | Force 10 sequential free-text chat turns for a booking form |
| Provide mandatory `altText` (LINE Flex), `speak` (Teams), and safe-area insets (Telegram/WeChat/Zalo) | Assume rich cards render identically in push notifications or fullscreen notches |
| Keep Teams Adaptive Cards narrow-friendly and verified on mobile + high contrast | Rely solely on the desktop Adaptive Card designer preview |
