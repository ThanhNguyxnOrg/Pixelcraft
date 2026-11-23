# Telegram, Zalo, WhatsApp, and Microsoft Teams

## Telegram bots and Mini Apps

Documented exact constraints:

| Constraint | Current documented limit/behavior |
|---|---|
| text message length | 1–4096 characters after entity parsing |
| media caption length | 0–1024 characters after entity parsing |
| inline keyboard button `callback_data` | 1–64 bytes |
| formatting entity nesting | entities may nest only under Telegram's documented restrictions; blockquotes cannot be nested |

Telegram supports explicit entities, Markdown-style parsing, or HTML-style parsing. Prefer explicit entities for machine-generated/localized text because they avoid delimiter escaping ambiguity. Escape user input if a parse mode is used.

Keyboard model:

- **inline keyboards** attach to a message and are appropriate for actions tied to that message;
- **reply keyboards** replace the user's keyboard/input area and are appropriate for repeated constrained input, but they occupy persistent UI and must be removable;
- callback buttons carry opaque data; never trust the client-supplied user/chat/context without server-side validation;
- URL/deep-link buttons must be clearly labeled by destination.

Mini App rules:

- choose keyboard-button versus inline-button launch based on data flow: keyboard-button Mini Apps can use `Telegram.WebApp.sendData` for a service-message response; inline-button Mini Apps receive a `query_id` flow for messages on the user's behalf;
- validate `initData` server-side using the documented bot-token HMAC validation. Never trust client-supplied user identity directly;
- consume `themeParams` rather than forcing a fixed light/dark palette;
- track viewport expansion/stable size and safe-area/content-safe-area insets; do not put controls under Telegram chrome;
- use `MainButton` for the single primary next action and `BackButton` for platform navigation instead of duplicating both in-page;
- test collapse/expand, viewport changes, theme switch, haptic availability, lifecycle suspension, and versioned API feature detection.

## Zalo Mini Apps and ZaUI

Current documented basics:

- ZaUI components are derived from Zalo's official ZDS design system;
- the React component package is installed as `zmp-ui` (`npm install zmp-ui`);
- import the package stylesheet such as `zmp-ui/zaui.css` or component-level stylesheets according to the installed version;
- the `App` container supplies shared context/theme, with documented `"light"` and `"dark"` theme values.

Design rules:

- follow platform navigation/header/page primitives before inventing custom chrome;
- design for phone-width embedded use, intermittent connectivity, Vietnamese text length/tone marks, and host-controlled safe areas;
- use official components for inputs/pickers/sheets where possible because they carry platform behavior;
- verify current package/runtime versions and host API availability rather than relying on community tutorials;
- handle login/permission denial and expired session explicitly.

Some Zalo documentation is primarily Vietnamese. Keep implementation artifacts in English when required by the project, but preserve exact API/component names unchanged.

## WhatsApp interactive messages

Documented constraints include:

| Constraint | Current documented behavior |
|---|---|
| list message | menu of up to 10 options |
| reply button message | up to 3 options/buttons |
| section title | maximum 24 characters when multiple sections are used |
| row title | maximum 24 characters |
| row description | maximum 72 characters |
| interactive delivery window | list/reply buttons generally cannot be proactive notifications; use within the documented 24-hour user-message window unless using an approved template/Flow path |

Rules:

- use reply buttons for 1–3 immediate mutually exclusive decisions;
- use lists for bounded larger choices, not deep browsing;
- write labels that fit the host truncation limits and remain distinguishable when truncated;
- do not encode state in user-visible text; validate webhook payloads server-side;
- account for unsupported platforms/clients and template fallback;
- do not use marketing pressure or ambiguous confirmation in a high-trust messaging surface;
- preserve message ordering/idempotency because users can reopen earlier interactions.

## Microsoft Teams Adaptive Cards

Current Microsoft agent-design documentation lists Teams desktop/web/mobile and Microsoft Copilot Chat at Adaptive Cards schema **1.5**, Dynamics 365 live chat at 1.5, Bot Framework Web Chat at 1.6 with `Action.Execute` unsupported, and Outlook Actionable Messages on a separate 1.0–1.2 track. Verify before release because host support changes.

Rules:

- set the card `version` deliberately and test in the real target host, not only the designer;
- HostConfig controls spacing/fonts/colors/actions/interactivity; Teams/host styling is not yours to override arbitrarily;
- prefer `Action.Execute` where supported for a unified invoke model, but verify host support and provide appropriate fallback behavior;
- use inputs only when the interaction truly requires structured data; validate server-side because client input is not trustworthy;
- use `refresh`/card update semantics deliberately so cards reflect completed/expired state;
- keep cards narrow-friendly; Teams mobile reflow can reorder/stack visual assumptions;
- provide meaningful `speak`/text equivalents for important visual content where the schema supports them;
- never assume full CSS, arbitrary HTML, or web-like layout control exists inside Adaptive Cards.
