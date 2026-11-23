# Slack Block Kit and Discord

Exact limits change. Use these as implementation constraints only after checking current official platform documentation.

## Slack Block Kit

Documented core limits:

| Constraint | Current documented limit |
|---|---:|
| blocks in one message | 50 |
| blocks in a modal or Home tab | 100 |
| `plain_text`/`mrkdwn` text object | 1–3000 characters |
| section `fields` | up to 10 text objects |
| text in each section field | up to 2000 characters |
| `block_id` | up to 255 characters and should be unique per message iteration |

### Surface model

- **Messages** are persistent or ephemeral channel/DM payloads composed from `blocks`.
- **Modals** are focused task surfaces opened through interactions and represented as views. Use them for bounded multi-field input; do not recreate an entire app in a modal.
- **Home tabs** are persistent per-user app surfaces. Treat them as application UI with loading/empty/error states rather than as a giant message.
- **Workflows/canvas/lists** have different capabilities; do not assume every block/element is legal on every surface. Check the block reference's surface compatibility.

### mrkdwn

Slack `mrkdwn` is not standard Markdown and not HTML. Key consequences:

- use Slack syntax for links/mentions/date formatting rather than pasting HTML or CommonMark assumptions;
- escape `&`, `<`, and `>` when interpolating untrusted plain text;
- `plain_text` and `mrkdwn` differ in emoji/verbatim/linkification behavior;
- never concatenate user input directly into control markup without escaping;
- test multiline text because Slack line wrapping/list indentation is platform-controlled.

### Slack UX rules

- use section/context/actions/divider/input blocks for semantic structure rather than ASCII tables;
- put the primary action in a native button/select; links are secondary;
- label buttons by outcome (`Approve request`, not `OK`);
- use stable `action_id`/`block_id` values for interaction routing, but do not put secrets in them;
- acknowledge interaction quickly and update/respond asynchronously where needed;
- design already-handled/expired interaction states because messages can outlive the action validity or backend state.

## Discord

### Embeds and legacy messages

Documented embed limits include:

| Embed field | Limit |
|---|---:|
| title | 256 characters |
| description | 4096 characters |
| fields per embed | 25 |
| field name | 256 characters |
| field value | 1024 characters |
| footer text | 2048 characters |
| author name | 256 characters |
| combined title/description/field/footer/author text | 6000 characters |
| embeds per message | 10 |

Use embeds for structured display, not interactive control. Do not split one logical answer across ten embeds merely because the API allows it; attention cost matters more than payload capacity.

### Components V2

Components V2 is opt-in per message with the `IS_COMPONENTS_V2` flag `1 << 15` (`32768`). Current official docs state that setting it is irreversible for that message and changes the payload model:

- `content` and `embeds` no longer work;
- attachments must be exposed through components;
- `poll` and `stickers` are disabled;
- messages allow up to 40 total components.

Core layout rules:

- an Action Row can contain up to 5 contextually grouped buttons **or** one select component;
- Text Display, Media Gallery, Section, Separator, and Container compose static structure;
- interactive components need unique per-message `custom_id` values;
- Text Input is modal-only. Modal examples document `max_length` up to 4000 for paragraph input, but validate exact field-level constraints in the current reference before depending on them.

Components V2 is not automatically “better.” Use it when layout control/content structure justifies losing content/embed compatibility. Legacy components remain appropriate for simple bot actions.

### Discord UX rules

- use ephemeral interaction responses for private validation/errors when the surface supports them;
- defer/update deliberately for slow work; communicate progress without fake certainty;
- use buttons for a small number of mutually visible actions and selects for larger bounded choices;
- use modals only for structured input that cannot be represented as a select/button;
- handle component ownership: decide whether any user or only the invoker can act, enforce server-side, and explain unauthorized interaction ephemerally;
- expire or disable stale actions by editing the message where appropriate.

## Shared verification

- validate generated JSON schemas client-side before send where possible;
- count Unicode characters/bytes according to the platform definition, not JavaScript string assumptions alone;
- inspect desktop/mobile compactness, dark/light themes, long usernames/localized strings, screen-reader output where accessible, and permission-denied interactions;
- keep a plain-text summary or fallback path for clients/automation that cannot render the rich surface.
