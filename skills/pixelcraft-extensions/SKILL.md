---
name: pixelcraft-extensions
description: Designs and verifies host-constrained extension and plugin interfaces. Use for browser extensions, Manifest V3 popups/options/side panels/content-script UI, Shadow DOM isolation, host-theme adaptation, permission UX, VS Code webviews and CSP, Raycast commands, Figma plugins/widgets, Office add-ins/task panes, embedded panels, and compact host-controlled UI where platform constraints shape layout, security, and visual design.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft extensions

Extension UI is embedded trust-sensitive UI. Respect the host's security model, theme, chrome, input conventions, and limited space. Do not import a full product shell or branding takeover into a popup, panel, webview, or plugin iframe.

## References

- Read [references/browser-extensions.md](references/browser-extensions.md) for MV3 popup/options/side panel/content-script UI, Shadow DOM, permissions, lifecycle, and browser constraints.
- Read [references/vscode-webviews.md](references/vscode-webviews.md) for VS Code webview isolation, `asWebviewUri`, CSP/nonces, theme variables, message passing, and editor UX.
- Read [references/raycast.md](references/raycast.md) for Raycast-native command UI, List/Grid/Detail/Form, ActionPanel, shortcuts, loading, and launcher constraints.
- Read [references/figma-office.md](references/figma-office.md) for Figma plugin iframe UI and Office task-pane/add-in constraints.

## Platform translation rules

1. Identify the surface type first: transient popup, persistent panel, embedded content UI, full options page, command palette item, canvas plugin, or host task pane.
2. Use host-native controls/tokens before custom branding. Match theme changes live rather than capturing a static palette.
3. Design for the actual viewport: narrow popup/panel, resizable webview/task pane, content-script overlay with unpredictable host CSS, or command-rendered native controls.
4. Make permissions contextual and reversible. Explain why each host/data permission is needed and provide degraded behavior when denied.
5. Treat security boundaries as design constraints: CSP, sandboxing, isolated worlds, postMessage validation, no remote code execution, no broad scraping by default.
6. Keep state truthful across lifecycle interrupts: popup close, host navigation, reload/update, workspace switch, document change, account/permission expiry.

## Hard rules

- Never inject visible content into arbitrary host pages before establishing origin/match scope and user intent.
- Never use broad host permissions because narrower APIs are harder.
- Never hardcode light colors or assume dark mode; read host theme variables/signals.
- Never rely on remote scripts or CSP bypasses in webviews/popups.
- Never use browser-extension popup lifetime as durable state storage.
- Never fake native launcher/editor behavior with unconstrained web UI when the platform supplies a structured component model.

## Pre-submit checklist

- [ ] correct surface type and host integration point chosen;
- [ ] permissions minimized, explained, versioned, and denied/error states designed;
- [ ] host light/dark/high-contrast theme and density respected;
- [ ] CSP/sandbox/origin/message validation constraints satisfied;
- [ ] keyboard/shortcut/focus behavior matches the host;
- [ ] resize/smallest width/height and panel collapse behavior verified;
- [ ] lifecycle interruption/update/reload states tested;
- [ ] screenshots or runtime inspection labeled by host/version/emulation status.
