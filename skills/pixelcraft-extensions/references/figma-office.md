# Figma plugins/widgets and Office add-ins

## Figma plugins

Figma plugins split execution between a **main sandbox thread** (accessing the Figma document API, no browser DOM) and an optional **UI iframe** (`null` origin, no cookies or `localStorage`).

- **Theme adaptation**: Pass `{ themeColors: true }` to `figma.showUI(...)` and style with Figma's native CSS custom properties (`--figma-color-bg`, `--figma-color-bg-secondary`, `--figma-color-text`, `--figma-color-border`, `--figma-color-bg-brand`, `--figma-color-text-onbrand`) so the plugin adapts automatically to Figma light and dark themes.
- **Mandatory dynamic page access**: Declare `"documentAccess": "dynamic-page"` in `manifest.json` and use **async** page/node APIs (`await figma.getNodeByIdAsync(id)`, `await figma.loadAllPagesAsync()`, `await figma.currentPage.loadAsync()`) instead of deprecated sync APIs.
- **Network & storage boundaries**: Declare exact hosts in `manifest.json` `networkAccess.allowedDomains` (use `["none"]` if offline). Store persistent settings in `figma.clientStorage.getAsync/setAsync` rather than browser `localStorage` (which throws in the `null`-origin iframe). Validate every `postMessage` payload shape in both directions.
- **Dev Mode & Code Connect**: For inspect/code-generation workflows, add `"dev"` to `editorType`, branch on `figma.mode === 'inspect'` or `figma.codegen.on('generate', ...)`, and use `@figma/code-connect` when mapping design-system components directly to repository code.

```ts
// Figma plugin main controller (code.ts) — dynamic-page async safe
figma.showUI(__html__, { width: 320, height: 420, themeColors: true });

figma.ui.onmessage = async (msg: unknown) => {
  if (!msg || typeof msg !== 'object' || !('type' in msg)) return;
  if (msg.type === 'inspect-selection') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.ui.postMessage({ type: 'empty', reason: 'Select at least one layer.' });
      return;
    }
    const items = await Promise.all(
      selection.map(async (node) => ({ id: node.id, name: node.name, kind: node.type })),
    );
    figma.ui.postMessage({ type: 'selection', items });
  }
};
```

## Figma widgets (multiplayer canvas objects)

Use a **Figma Widget** (`figma.widget`) when the UI belongs **directly on the FigJam or Figma canvas** shared synchronously across all collaborators (voting boards, status cards, sprint checklists, live embeds), rather than a single-user floating plugin modal:

- Build UI declaratively with `figma.widget` primitives (`AutoLayout`, `Text`, `Input`, `SVG`, `Frame`), store shared multiplayer state in **`useSyncedState`** and **`useSyncedMap`** (never module globals!), expose toolbar controls with **`usePropertyMenu`**, and wrap async work or temporary helper iframes in **`waitForTask(...)`**.

```tsx
const { widget } = figma;
const { AutoLayout, Text, useSyncedState, usePropertyMenu } = widget;

function DecisionCard() {
  const [status, setStatus] = useSyncedState<'Open' | 'Approved'>('status', 'Open');
  const [votes, setVotes] = useSyncedState<number>('votes', 0);

  usePropertyMenu(
    [{ itemType: 'action', propertyName: 'toggle', tooltip: 'Toggle status' }],
    ({ propertyName }) => {
      if (propertyName === 'toggle') setStatus(status === 'Open' ? 'Approved' : 'Open');
    },
  );

  return (
    <AutoLayout direction="vertical" spacing={8} padding={16} cornerRadius={8} fill="#FFFFFF" stroke="#D4D4D8">
      <Text fontSize={14} fontWeight={600}>Status: {status}</Text>
      <AutoLayout padding={{ vertical: 6, horizontal: 10 }} cornerRadius={6} fill="#0074CA" onClick={() => setVotes(votes + 1)}>
        <Text fill="#FFFFFF" fontSize={12}>Upvote ({votes})</Text>
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(DecisionCard);
```

## Microsoft Office add-ins (Word, Excel, PowerPoint, Outlook)

- **Unified Manifest for Microsoft 365**: Prefer the **Unified Manifest (`manifest.json`)** for new M365 add-ins targeting Outlook, Teams, M365 Copilot, and supported Office hosts (use legacy XML manifest only where older desktop Office versions require it).
- **Host lifecycle & Requirement Sets**: Wrap initialization in `Office.onReady()`, always verify API support via `Office.context.requirements.isSetSupported('ExcelApi', '1.14')` before calling newer APIs, and batch reads/writes cleanly around `await context.sync()` (avoid calling `context.sync()` inside loops!).
- **Fluent UI v9 & host theme**: Use **`@fluentui/react-components`** (`FluentProvider`) adapted to `Office.context.officeTheme` (`bodyBackgroundColor`, `bodyForegroundColor`) inside narrow resizable task panes (320 px default width).
- **Mandatory OAuth dialog**: Never run third-party OAuth inside the task-pane iframe (blocked by `X-Frame-Options` and third-party cookie restrictions). Always launch **`Office.context.ui.displayDialogAsync(authUrl, { height: 60, width: 35 })`** and receive results via `DialogMessageReceived` (or use **Nested App Authentication (NAA)** for Microsoft Entra ID SSO).

```ts
// Office Excel add-in: Office.onReady + Requirement Set guard + batched context.sync()
Office.onReady(async (info) => {
  if (info.host !== Office.HostType.Excel) return;
  if (!Office.context.requirements.isSetSupported('ExcelApi', '1.14')) {
    renderUnsupportedHostNotice('Requires Excel API 1.14 or newer.');
    return;
  }
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load(['address', 'values']);
    await context.sync();
    renderSelectionPreview(range.address, range.values);
  });
});
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `figma.showUI(__html__, { themeColors: true })` + `--figma-color-*` | Hardcode white plugin backgrounds that blind users in Figma dark mode |
| `"documentAccess": "dynamic-page"` + async `getNodeByIdAsync` | Call deprecated sync `figma.getNodeById` / `root.findAll` |
| `figma.clientStorage` in Figma plugins & `useSyncedState` in Widgets | Call `window.localStorage` inside a `null`-origin Figma plugin iframe |
| `Office.context.ui.displayDialogAsync` (or NAA) for Office OAuth | Redirect the Office task-pane iframe directly to an IdP login page |
| Check `isSetSupported(...)` and batch operations before `context.sync()` | Call `await context.sync()` inside a 500-row loop |

## Verification commands

```sh
npm run build
npx office-addin-manifest validate manifest.json
```

Build and manifest validation are `static` evidence. Test Figma plugins/widgets inside real Figma Desktop + Browser (light/dark, empty selection, mixed selection, dynamic multi-page docs) and Office add-ins across Windows, macOS, and Office on the Web task panes (`rendered` evidence).
