# Slack Block Kit and Discord

Exact limits and component capabilities evolve. Verify against current official platform docs before shipping schema changes.

## Slack Block Kit

### Core payload limits and timeouts

| Constraint | Documented limit / rule |
|---|---|
| Blocks in one message | 50 |
| Blocks in a Modal or Home tab | 100 |
| `plain_text` / `mrkdwn` text object | 1–3,000 characters |
| `header` block `plain_text` | up to 150 characters |
| `button` label text | **up to 75 characters** |
| Section `fields` | up to 10 objects (2,000 chars each) |
| `block_id` / `action_id` | up to 255 characters; unique per message/view |
| **Interaction `ack()` timeout** | **Must return HTTP 200 within 3 seconds** (post slow work asynchronously via `response_url` or Web API) |

### Modern blocks (`rich_text`, native `table`, `header`) and AI Assistant surfaces

- Prefer **`rich_text`** blocks for structured nested lists, quotes, inline code, and styled text—avoiding `mrkdwn` escaping edge cases.
- Use Slack's native **`table` block** for compact tabular summaries instead of broken monospace ASCII tables.
- Use `header` (`plain_text`, <= 150 chars) for scannable card titles paired with concise `context` metadata.
- **Slack AI Assistants & Agents surfaces**: When building an app enabled as a Slack AI Assistant (split-pane DM/thread experience), use:
  - `assistant.threads.setTitle` (auto-name the thread from the user's question),
  - `assistant.threads.setStatus` (honest progress copy like `"Searching billing records…"`),
  - `assistant.threads.setSuggestedPrompts` (up to 4 concrete starter prompts),
  - native streaming via **`chat.startStream`**, **`chat.appendStream`**, and **`chat.stopStream`** instead of spamming `chat.update` rate limits, and
  - **`feedback_buttons`** context/action elements for thumbs-up/down evaluation hooks.

### Surface model and `mrkdwn` safety

- **Messages**: Persistent or ephemeral channel/DM payloads. Always include a concise top-level `text` field for push notifications, screen readers, and degraded clients.
- **Modals**: Focused bounded multi-field views (`views.open` requires a fresh `trigger_id` valid for 3 seconds). Never rebuild a full SaaS app inside chained modals.
- **Home tabs**: Persistent per-user workspace (`views.publish`); design explicit loading, empty, and error states.
- **`mrkdwn` escaping**: Slack `mrkdwn` is neither CommonMark nor HTML—escape `&`, `<`, and `>` on all untrusted user text before interpolating into `mrkdwn`, and never put secrets in `action_id`, `block_id`, or button `value`.

## Discord

### Legacy embeds vs Components V2

Documented legacy embed limits: title 256, description 4,096, 25 fields (name 256 / value 1,024), footer 2,048, author 256, combined text 6,000, max 10 embeds per message. Never split one logical response across 10 embeds.

**Components V2** is opt-in per message via flag `IS_COMPONENTS_V2 = 1 << 15` (`32768`). Setting this flag is irreversible for that message and replaces `content`/`embeds`/`poll`/`stickers` with up to **40 total components**:

- **Layout & display components**: `Container` (accent color, spoiler flag), `Section` (text + accessory), `Text Display`, `Media Gallery`, `Separator`, **`Thumbnail`** (type 11, Section accessory), and **`File`** (type 13, exposing uploaded `attachment://` files inline).
- **Interactive components**: `Action Row` holds up to 5 buttons **or** 1 select menu (`String`, `User`, `Role`, `Channel`, `Mentionable`); every interactive component needs a unique per-message `custom_id`.
- Use Components V2 when structured containers, inline files, and section thumbnails materially improve clarity; keep standard messages/embeds for simple bot responses needing legacy compatibility.

### Expanded Modals (2025–2026) and interaction timeouts

- **Expanded Modal components**: Discord modals are no longer limited to bare `TextInput` fields—modern modals support **`Label`** wrappers with descriptions, **Select Menus** (String/User/Role/Channel/Mentionable), **File Upload**, and **Radio / Checkbox** inputs alongside short/paragraph text inputs. Verify exact field limits and component type numbers against current Discord API docs before shipping.
- **Mandatory timing rules**:
  - **3-second initial acknowledgement**: Respond to every slash command, button, select, or modal submit within **3 seconds** (or immediately defer with `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` / `DEFERRED_UPDATE_MESSAGE`).
  - **15-minute interaction token expiry**: Webhook follow-ups and edits using the interaction token expire after **15 minutes**—design explicit expiration/disabled states or transition to channel/bot-token updates for longer workflows.
- Always enforce invoker ownership server-side and send private validation/permission errors as ephemeral replies (`EPHEMERAL = 1 << 6`).

### Discord Embedded App SDK (Activities)

When a rich interactive experience (multiplayer canvas, collaborative board, game, complex configurator) exceeds message components, launch an **Activity** inside Discord's iframe sandbox using **`@discord/embedded-app-sdk`**:

- Initialize `new DiscordSDK(clientId)`, await `discordSdk.ready()`, exchange the OAuth2 `code` on your backend server (never expose `client_secret` in the iframe), and call `discordSdk.commands.authenticate({ access_token })`.
- Route third-party external assets/APIs through Discord's URL proxy (`patchUrlMappings`) so CSP does not silently block fonts, images, or APIs.
- Design for variable embedded sizes (narrow PiP / voice tile, desktop panel, mobile portrait) and respect Discord channel participant presence honestly.

## Do/don't pairs

| Do | Don't |
|---|---|
| Ack Slack & Discord interactions within `< 2–3 s`, defer slow work with async progress status, and deduplicate `X-Slack-Retry-Num` / `event_id` / `interaction.id` idempotently | Wait on an LLM/DB call before HTTP 200 or execute duplicate mutations on webhook retries |
| Handle `message_changed` / `message_deleted` (`MESSAGE_UPDATE` / `MESSAGE_DELETE`) and return ephemeral usage guidance + pickers on invalid/missing command parameters | Crash when editing a deleted message or fail silently on incomplete slash/text commands |
| Stream Slack AI Assistant replies with `chat.startStream`/`appendStream`/`stopStream` | Hammer `chat.update` on every token until rate-limited |
| Use Slack native `table` and `rich_text` blocks + top-level fallback `text` | Render monospace ASCII tables that shatter on mobile |
| Use Discord Components V2 `Section` + `Thumbnail` / `File` intentionally | Enable `IS_COMPONENTS_V2` and still pass ignored `content` / `embeds` |
| Expire or disable Discord buttons after the 15-min token / task window | Leave dead buttons returning `"This interaction failed"` |

## Verification

Validate Block Kit / Discord JSON payloads before send, count UTF-8 characters accurately (especially localized labels approaching Slack's 75-char button limit), test `< 2–3 s` `ack` deferral, idempotent retry deduplication, edited/deleted message events, invalid-command guidance, and 15-minute expiry paths, and inspect desktop, mobile, light/dark themes, and fallback notifications (`rendered` where tested in real clients; `static` for JSON schema tests).
