---
name: pixelcraft-extensions
description: Designs and verifies host-constrained extension and plugin interfaces. Use for Chrome, Firefox, and Safari browser extensions (Manifest V3, WXT, Plasmo, CRXJS, Shadow DOM, side panels, DevTools), VS Code extensions (webviews, CSP, Custom Editors, Chat Participants, MCP), JetBrains/IntelliJ/Jewel plugins, Obsidian plugins, Raycast commands/AI tools, Figma plugins/widgets, Office add-ins (Unified Manifest, Fluent UI), Shopify App Bridge/Polaris, Atlassian Forge, and Notion/Linear integrations.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft extensions

Extension UI is embedded trust-sensitive UI. Respect the host's security model, threading rules, theme tokens, chrome, input conventions, and constrained viewport. Do not import a full standalone product shell or branding takeover into a popup, panel, webview, task pane, or plugin iframe.

## Surface craft

Use the host's smallest appropriate native surface: command or QuickPick for a quick action, TreeView or side panel for recurring context, Custom Editor/widget for document-bound state, and Webview/iframe only for needs native primitives cannot express. Preserve host tokens, zoom, and keyboard conventions, show the active object's context, and verify open/action/dismiss with focus restored.

## References

- Read [references/browser-extensions.md](references/browser-extensions.md) when building Chrome, Firefox, or Safari Manifest V3 extensions (WXT, Plasmo, CRXJS, popups, side panels, DevTools, Shadow DOM `rem` isolation, MV3 storage/alarms/offscreen).
- Read [references/vscode-webviews.md](references/vscode-webviews.md) when building VS Code extensions (native surface selection, Custom Editors, Chat Participants/LM Tools/MCP, webview CSP/nonces, `asWebviewUri`, `--vscode-*` tokens, Workspace Trust, `vscode.dev`).
- Read [references/raycast.md](references/raycast.md) when building Raycast extensions (`List`/`Grid`/`Detail`/`Form`, `ActionPanel`, `@raycast/utils`, `MenuBarExtra`, AI Extensions/Tools, no-view commands, macOS/Windows parity).
- Read [references/figma-office.md](references/figma-office.md) when building Figma plugins (`themeColors`, `dynamic-page`, Dev Mode/Code Connect), Figma Widgets (`useSyncedState`), or Microsoft Office add-ins (Unified Manifest, `Office.onReady`, Fluent UI v9, `displayDialogAsync` OAuth).
- Read [references/ide-and-saas-plugins.md](references/ide-and-saas-plugins.md) when building JetBrains Platform plugins (Kotlin UI DSL v2, Jewel, JCEF, EDT threading), Obsidian plugins, Shopify embedded apps (App Bridge v4 + Polaris), Atlassian Forge (UI Kit 2 vs Custom UI), or Notion/Linear integrations.

## Platform translation rules

1. Identify the surface type first: transient popup, persistent side panel, content-script Shadow DOM overlay, DevTools tab, native IDE tool window/editor, command palette/launcher, multiplayer canvas widget, or SaaS admin iframe.
2. Prefer host-native controls and live theme tokens (`--vscode-*`, `--figma-color-*`, Obsidian `--background-primary`, Polaris/App Bridge, Fluent UI v9, Jewel) before custom styling.
3. Design for the real viewport: 320 px popup/task pane, narrow sidebar, mobile Safari/Obsidian sheet, or hostile arbitrary web pages.
4. Minimize permissions and request optional scopes contextually at point of need, with truthful denied/restricted-mode fallback states.
5. Treat security and threading boundaries as UX constraints: CSP/nonces, isolated worlds, `postMessage` validation, OAuth dialog popups, session tokens, no remote code execution, and never blocking IDE UI threads.
6. Persist state cleanly across lifecycle interrupts: popup close, MV3 service-worker sleep, webview hide/reload, workspace trust change, and document switches.

## Hard rules

- Never inject visible content into arbitrary host pages before establishing match scope, Shadow DOM isolation, and user intent.
- Never use broad host permissions (`<all_urls>`, blanket egress) when `activeTab` or narrow scopes suffice.
- Never hardcode light-only colors or ignore host high-contrast / dark mode tokens.
- Never bypass CSP with `'unsafe-inline'` or remote scripts in webviews/popups, and never run third-party OAuth inside restricted Office/Shopify iframes.
- Never use transient popup lifetime, ephemeral MV3 service-worker memory, or `null`-origin `localStorage` as durable storage.
- Never fake native launcher/editor UI with unconstrained web overlays when the host provides structured components.

## Pre-submit checklist

- [ ] smallest appropriate native host surface chosen before falling back to Webview/iframe;
- [ ] permissions minimized, explained at point of need, and denied/restricted-mode states designed;
- [ ] host light, dark, and high-contrast themes plus font scaling respected live;
- [ ] CSP/nonce, sandbox, `postMessage` schema, OAuth/session-token, and threading rules satisfied;
- [ ] keyboard shortcuts, focus entry/exit, and dismissal match host conventions;
- [ ] narrowest viewport width/height and panel collapse verified;
- [ ] lifecycle interrupts (popup blur, worker sleep, panel reload, host switch) tested;
- [ ] verification claims labeled honestly (`rendered`, `static`, `not-checked`) with target host versions.
