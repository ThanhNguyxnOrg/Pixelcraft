# VS Code webviews

Webviews are isolated embedded documents inside the editor. Treat them as application UI constrained by VS Code security and theme systems.

## Security/resource rules

- Convert local resources with `webview.asWebviewUri`; do not hardcode legacy `vscode-resource:` paths.
- Use `webview.cspSource` in the Content Security Policy and nonce scripts/styles rather than broad unsafe directives.
- Enable scripts only when needed and constrain `localResourceRoots` to the smallest workspace/extension directories.
- Validate every `postMessage` payload by type/schema/origin context. Treat webview input as untrusted.
- Do not use remote scripts/CDNs as a shortcut around CSP or offline behavior.

## Theme integration

VS Code exposes theme colors as CSS variables in webviews. Use variables such as `--vscode-editor-background`, `--vscode-editor-foreground`, `--vscode-focusBorder`, `--vscode-button-background`, `--vscode-button-foreground`, `--vscode-input-background`, `--vscode-errorForeground`, and font-family/size variables where appropriate. Test themes rather than hardcoding light/dark detection. Respect high-contrast borders/focus and editor font scaling.

## Editor UX

- Choose webview panel vs sidebar/tree/custom editor based on workflow persistence and document ownership.
- Preserve view state across reveal/hide deliberately; document the cost of `retainContextWhenHidden` rather than enabling it blindly.
- Keyboard focus must enter/leave the webview without trapping users; command palette/menu paths remain available.
- Match editor density, iconography, terminology, split behavior, and workspace trust expectations.

## Verification

Inspect narrow sidebar width, split/editor resize, light/dark/high-contrast themes, font scaling, keyboard/screen-reader path, CSP console errors, offline behavior, workspace trust restricted mode, window reload, serialization/restoration, message schema errors, and Linux/macOS/Windows/web differences where claimed.
