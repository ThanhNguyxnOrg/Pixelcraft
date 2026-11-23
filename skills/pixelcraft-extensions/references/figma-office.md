# Figma plugins and Office add-ins

## Figma plugins

`figma.showUI(html, options)` creates an iframe-based modal/plugin UI. Relevant verified constraints: `visible` controls initial visibility, `width` defaults to 300 with a documented minimum around 70, and `figma.ui.resize(width, height)` can change dimensions later. Treat the iframe and sandbox/plugin controller as separate trusted boundaries; validate messages in both directions.

- Match Figma density, keyboard behavior, selection context, dark/light theme signals where exposed, and small-panel constraints.
- Make object selection/state explicit: nothing selected, unsupported mixed selection, missing permission/component/document change.
- Long operations need progress/cancellation because plugin execution is tied to document/user context.
- Do not mutate the canvas without clear user intent; destructive/bulk operations need scope preview and undo expectations.

## Office add-ins/task panes

Office task panes are embedded web applications running beside host documents. Use host-appropriate Fluent/platform conventions, theme tokens, responsive narrow widths, keyboard/focus behavior, and documented authentication/SSO/consent flows. Respect document-centric state: selection changes, file switching, coauthoring, offline mode, permission expiry, and host/version differences across Windows/Mac/web/mobile.

- Validate Office runtime APIs before use; label host/version fallback honestly.
- Never silently write into the document; preview insertion/range/format side effects.
- Preserve task-pane state through resize/hide/show without pretending it is persistent storage.
- Handle network, permission, expired token, unsupported host, and malformed document state as first-class UX.

## Verification

Test narrow/minimum width, resize, host dark/light theme, keyboard/screen reader, message spoofing/shape mismatch, permission denial, missing selection/document, long localized labels, offline/network interruption, update/reload lifecycle, and actual host versions rather than only browser-hosted UI.
