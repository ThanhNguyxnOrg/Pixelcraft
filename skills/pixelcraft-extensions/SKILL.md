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

- **Chrome Web Store MV3 #1 Rejection Gate — Zero Remotely Hosted Code (`RHC`) & Safari packaging**: bundle 100% of executable JS/WASM inside the signed extension archive (zero remote `<script>`, `import("https://...")`, `eval()`, `new Function()`, or remote script strings); when Safari is in scope, package and verify the **Safari Web Extension macOS/iOS Xcode app-wrapper** (`xcrun safari-web-extension-converter`, native messaging/permission parity, and mobile Safari sheet sizing).
- **Ephemeral MV3 Service Workers & Webview `getState`/`setState` persistence**: persist MV3 state in `chrome.storage.session` / `chrome.storage.local` + `chrome.alarms` (never global RAM variables or `setInterval`), and serialize IDE/plugin **Webview state when hidden** (`acquireVsCodeApi().getState()` / `setState()` + `WebviewPanelSerializer`—avoiding `retainContextWhenHidden` RAM bloat unless strictly required).
- **Shadow DOM isolation & hostile-CSS host page testing**: wrap injected content-script UI in **Shadow DOM** (`all: initial` + `px`-normalized reset because `rem` resolves against the host's `<html>`!), **call `e.stopPropagation()` on `keydown`, `keyup`, and `keypress`** inside extension inputs (preserving `Escape` dismiss), and **test content scripts on hostile-CSS host pages** (aggressive `* { box-sizing: content-box !important }`, `z-index: 2147483647` overlays, `html { font-size: 62.5% }`, strict host CSPs, and dark/light mismatch).
- **Host startup (`< 50 ms`), `"*"` activation ban & remote/virtual workspaces**: **ban `"activationEvents": ["*"]`** in VS Code `package.json`, keep JetBrains/Obsidian startup off the UI/EDT thread, and declare/verify **remote & virtual workspace support** (**SSH Remote, GitHub Codespaces, Dev Containers, WSL, and `vscode.dev` `workspace.fs` URIs**—never assuming local POSIX `fs` paths).
- **Strict `OAuth 2.0 + PKCE (S256)` & OS `SecretStorage`**: authenticate public extension/plugin clients via **Authorization Code + PKCE (`S256`)** and store tokens in OS-encrypted **`context.secrets` (`SecretStorage`)** or `chrome.storage.session`—**never embed a `client_secret` inside distributed extension code**.
- **Mid-session host theme & locale hot-switching**: consume `--vscode-*`, `--figma-color-*`, Obsidian `--background-primary`, Polaris/App Bridge, Fluent UI v9, Raycast, and Jewel tokens across Light, Dark, and High-Contrast modes, and **hot-switch both host theme AND locale mid-session without requiring an extension reload or losing input state**.

## Anti-lazy-default & anti-slop guard

- **Smallest native host primitive first**: never reach for a heavy Webview, JCEF browser, or custom iframe when a host-native command, QuickPick, status-bar item, TreeView, Raycast `List`/`Detail`/`Form`, Atlassian Forge UI Kit 2 component, or Polaris/Fluent primitive solves the workflow cleanly.
- **Reject standalone SaaS shell slop**: never cram a full marketing hero, multi-level marketing nav bar, or brand-takeover theme into a 320 px browser popup, IDE side panel, Office task pane, or Figma plugin frame.

## Pre-submit checklist

- [ ] smallest appropriate native host surface chosen before falling back to Webview/iframe;
- [ ] **MV3 Zero RHC verified** (zero remote `<script>`, `eval`, `new Function`), ephemeral worker state in `chrome.storage.*`/`chrome.alarms`, `activeTab`/optional permissions scoped, and **Safari Web Extension macOS/iOS app-wrapper packaging** verified when Safari is in scope;
- [ ] content-script UI isolated in **Shadow DOM** (`px`-safe reset + `keydown`/`keyup`/`keypress` `stopPropagation()`) and **tested against hostile-CSS host pages** (`html { font-size: 62.5% }`, max `z-index`, aggressive resets, strict CSP);
- [ ] VS Code `package.json` contains **zero `"activationEvents": ["*"]`** (`< 50 ms` lazy activation), **Webview state persists when hidden (`getState`/`setState`)**, **remote/virtual workspaces (SSH / Codespaces / WSL / `workspace.fs`)** work cleanly, and JetBrains/IDE work stays off the EDT;
- [ ] auth uses **`OAuth 2.0 + PKCE (S256)`** + **`context.secrets` / session tokens** with **zero embedded `client_secret`**;
- [ ] **mid-session host theme (Light/Dark/High-Contrast) & locale hot-switching** without reload, narrow `320 px` viewports, and focus restoration verified (`rendered` vs `static` vs `not-checked`);
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, host extension/plugin tests, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).
