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

## Theme tokens, Workspace Trust, and `vscode.dev` (web worker)

- **Live host themes**: Bind every surface, border, button, focus ring, and error state to VS Code CSS tokens (`--vscode-editor-background`, `--vscode-editor-foreground`, `--vscode-sideBar-background`, `--vscode-focusBorder`, `--vscode-button-background`, `--vscode-button-foreground`, `--vscode-input-background`, `--vscode-errorForeground`, `--vscode-font-family`, `--vscode-font-size`). Never hardcode light/dark hex colors; verify **High Contrast Dark** and **High Contrast Light** borders and focus rings.
- **Workspace Trust**: Check `vscode.workspace.isTrusted` and declare `capabilities.untrustedWorkspaces` in `package.json`. In Restricted Mode, disable code execution/terminal/local script features cleanly and explain *why* with a one-click link to manage trust.
- **`vscode.dev` / Browser Web Extensions**: If targeting `vscode.dev` or GitHub Codespaces web, set `"browser"` entrypoint in `package.json`, bundle for `webworker`, and replace Node `fs`/`child_process` calls with `vscode.workspace.fs` and browser `fetch` (respecting CORS).

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `TreeView`, `QuickPick`, `CustomEditor`, or `vscode.chat`/`vscode.lm` first | Build a heavy Webview for a simple list, form, or AI chat |
| Use `@vscode-elements/elements` or semantic HTML + `--vscode-*` vars | Add archived/deprecated `@vscode/webview-ui-toolkit` to new projects |
| Nonce scripts + `webview.cspSource` + `asWebviewUri` + validated `postMessage` | Allow `'unsafe-inline'` scripts or trust raw webview message payloads |
| Persist state with `getState()`/`setState()` + `WebviewPanelSerializer` | Enable `retainContextWhenHidden: true` everywhere by default |
| Check `vscode.workspace.isTrusted` and handle Restricted Mode visibly | Silently crash or execute workspace binaries in untrusted folders |

## Verification commands

```sh
npm run compile
npx @vscode/test-cli
```

Compilation and unit tests provide `static` evidence. Launch the **Extension Development Host** across Light, Dark, High Contrast themes, narrow sidebar widths, Restricted Workspace mode, and window reload (`Developer: Reload Window`) for `rendered` evidence.
