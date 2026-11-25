# VS Code extensions and webviews

Always choose the **smallest native VS Code UI surface** before creating a Webview. Native surfaces inherit keyboard navigation, screen-reader accessibility, themes, zoom, and low memory usage automatically.

## Surface decision matrix

| Surface | API | Best fit |
|---|---|---|
| **QuickPick / InputBox** | `vscode.window.showQuickPick` / `showInputBox` | Fast keyboard-driven commands, multi-step prompts, pickers |
| **TreeView** | `vscode.window.createTreeView` + `TreeDataProvider` | Hierarchical explorers, resource lists, status trees in Activity/Side Bar |
| **StatusBar / CodeLens / InlayHints** | `createStatusBarItem`, `registerCodeLensProvider` | Ambient status indicators and inline contextual actions above symbols |
| **Custom Editors** | `CustomTextEditorProvider` / `CustomEditorProvider` | Visual/binary editors backed by real workspace files with native Save, Undo/Redo, and dirty tab state |
| **Notebook Renderers** | `contributes.notebookRenderers` | Custom rich MIME outputs inside Jupyter/VS Code notebooks |
| **Chat Participants, LM Tools & MCP** | `vscode.chat.createChatParticipant`, `vscode.lm.registerTool`, `vscode.lm.registerMcpServerDefinitionProvider` | Native AI chat extensions, agent tools, and MCP servers—prefer these over building a custom chat Webview |
| **WebviewView / WebviewPanel** | `WebviewViewProvider` / `createWebviewPanel` | Rich bespoke visualizers, diagrams, or domain UIs native primitives cannot express |

## Security, CSP/nonce, `asWebviewUri`, and state persistence

- **Deprecated toolkit warning**: **`@vscode/webview-ui-toolkit` is archived and deprecated.** Use **`@vscode-elements/elements`** (community-maintained Web Components matching VS Code styling) or semantic HTML styled directly with VS Code's `--vscode-*` CSS custom properties.
- Never hardcode `vscode-resource:` paths, never disable CSP or load remote CDN scripts, and restrict `localResourceRoots` to the extension's `dist/` (or media) directory.
- Prefer **`acquireVsCodeApi().getState()` / `setState()`** + **`WebviewPanelSerializer`** over blindly enabling `retainContextWhenHidden: true` (which keeps an entire background Chromium frame resident in memory even when the tab is hidden).

```ts
// Extension host: strict CSP + nonce + asWebviewUri + serializer
import * as vscode from 'vscode';
import crypto from 'node:crypto';

export function buildWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const nonce = crypto.randomBytes(16).toString('base64');
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.css'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${styleUri}" />
</head>
<body>
  <main id="app"></main>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

// Register serializer so panels survive VS Code reloads cleanly:
context.subscriptions.push(
  vscode.window.registerWebviewPanelSerializer('pixelcraft.inspector', {
    async deserializeWebviewPanel(panel: vscode.WebviewPanel, state: unknown) {
      panel.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
      };
      panel.webview.html = buildWebviewHtml(panel.webview, context.extensionUri);
      panel.webview.postMessage({ type: 'restore', state });
    },
  }),
);
```

```ts
// Webview script: persist lightweight UI state without retainContextWhenHidden
const vscodeApi = acquireVsCodeApi<{ selectedId?: string }>();
const restored = vscodeApi.getState() ?? {};

function selectItem(selectedId: string) {
  vscodeApi.setState({ ...vscodeApi.getState(), selectedId });
  vscodeApi.postMessage({ type: 'select', selectedId }); // validate schema on extension host
}
```

## Activation budget (`< 50 ms`), PKCE + `SecretStorage`, Theme tokens, and Workspace Trust

- **Ban `"activationEvents": ["*"]` (`< 50 ms` activation budget)**: never wake your extension on every VS Code launch! VS Code `>= 1.74` automatically activates extensions from `contributes.commands`, `contributes.views`, `contributes.customEditors`, and `contributes.languages`. Use narrow `onLanguage:...` or `workspaceContains:...` triggers only when needed, bundle the extension entrypoint into a single file (`esbuild` / `rolldown`), and keep `activate()` synchronous work **`< 50 ms`** (check `Developer: Show Running Extensions`).
- **OAuth 2.0 + PKCE (`S256`) & OS `SecretStorage` (`context.secrets`)**: prefer built-in `vscode.authentication.getSession(providerId, scopes, { createIfNone: true })` or run **OAuth 2.0 Authorization Code + PKCE (`S256`)** via `vscode.env.openExternal` + `vscode.window.registerUriHandler`—**never bundle a `client_secret` in the `.vsix`** and store refresh/API tokens strictly inside OS-keychain-backed **`await context.secrets.store(key, token)`** (never plaintext `globalState` or `settings.json`!).
- **Live host themes**: Bind every surface, border, button, focus ring, and error state to VS Code CSS tokens (`--vscode-editor-background`, `--vscode-editor-foreground`, `--vscode-sideBar-background`, `--vscode-focusBorder`, `--vscode-button-background`, `--vscode-button-foreground`, `--vscode-input-background`, `--vscode-errorForeground`, `--vscode-font-family`, `--vscode-font-size`). Verify **High Contrast Dark** and **High Contrast Light** borders and focus rings.
- **Workspace Trust**: Check `vscode.workspace.isTrusted` and declare `capabilities.untrustedWorkspaces` in `package.json`. In Restricted Mode, disable code execution/terminal/local script features cleanly and explain *why* with a one-click link to manage trust.
- **`vscode.dev` / Browser Web Extensions**: If targeting `vscode.dev` or GitHub Codespaces web, set `"browser"` entrypoint in `package.json`, bundle for `webworker`, and replace Node `fs`/`child_process` calls with `vscode.workspace.fs` and browser `fetch` (respecting CORS).

## Do/don't pairs

| Do | Don't |
|---|---|
| Rely on implicit `contributes.*` activation and keep `activate()` `< 50 ms` | Put `"activationEvents": ["*"]` in `package.json` or run heavy startup scans |
| Authenticate via `vscode.authentication` or **OAuth 2.0 + PKCE (`S256`)** + `context.secrets` | Embed `client_secret` in `.vsix` or store credentials in `globalState` / `settings.json` |
| Use `TreeView`, `QuickPick`, `CustomEditor`, or `vscode.chat`/`vscode.lm` first | Build a heavy Webview for a simple list, form, or AI chat |
| Use `@vscode-elements/elements` or semantic HTML + `--vscode-*` vars | Add archived/deprecated `@vscode/webview-ui-toolkit` to new projects |
| Nonce scripts + `webview.cspSource` + `asWebviewUri` + `WebviewPanelSerializer` | Allow `'unsafe-inline'` scripts or enable `retainContextWhenHidden: true` everywhere |

## Verification commands

```sh
npm run compile
npx @vscode/test-cli
```

Inspect `package.json` for zero `"activationEvents": ["*"]` and zero embedded secrets (`static`), then launch the **Extension Development Host** to verify `< 50 ms` startup in `Developer: Show Running Extensions`, PKCE/`SecretStorage` sign-in, Light/Dark/High-Contrast themes, Restricted Workspace mode, and window reload (`rendered`).
