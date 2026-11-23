# Browser extensions (Manifest V3)

Verified core integration points: `action.default_popup` for transient popup UI, `options_ui.page` for settings, `side_panel.default_path` plus the `sidePanel` permission for persistent panel UI, `background.service_worker` for event handling, and `content_scripts` matches/js/css or scripting injection for page context UI.

## Surface selection

| Surface | Use | Constraints |
|---|---|---|
| popup | quick status/action | ephemeral, narrow, closes on focus loss; no durable state assumption |
| side panel | persistent companion workflow | resizable/narrow; requires `sidePanel`; user controls side/pinning |
| options page | deep configuration | full document but browser settings context; deep-link/dirty state matter |
| content UI | contextual page augmentation | hostile/unknown CSS/layout; must not break host page |

## Content-script UI isolation

Attach a host element and use Shadow DOM for UI where supported. Load styles into the shadow root rather than relying on page globals. Reset inheritance deliberately: color scheme, font, line-height, box-sizing, direction. Use semantic HTML inside the shadow root because isolation does not create accessibility automatically. Never let host CSS selectors or extension CSS leak unintentionally; test on dense, dark, RTL, zoomed, and highly customized pages.

## Permissions UX

- Prefer `activeTab`/user invocation over broad `<all_urls>` host access when the task allows.
- Explain optional permissions at the moment of need; provide visible denied/skipped behavior.
- Version sensitive behavior in onboarding/release notes; trust erosion is a UX defect.
- Site access controls differ by browser; test Chromium and Firefox/mobile support honestly rather than claiming parity.

## State/lifecycle

Popup closure is not logout/submission. Persist state through extension storage/message passing deliberately. Service workers are event-driven and can restart; no hidden dependence on in-memory timers/state. Tab navigation/reload/frame changes must not duplicate injected UI.

## Verification

Test minimum popup width/height, side-panel resizing, zoom/text scaling, dark/light host theme, keyboard focus trap/escape, screen-reader names, content-script Shadow DOM isolation, denied permission, service-worker restart, extension update/reload, target-page navigation, CSP errors, and browser differences.
