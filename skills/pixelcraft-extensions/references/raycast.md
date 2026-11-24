# Raycast extensions

Raycast compiles React declarations (`@raycast/api`) into **native launcher UI** (AppKit on macOS, native controls on Windows). Treat the API as a strict native design system—compose `List`, `Grid`, `Detail`, `Form`, `ActionPanel`, and `MenuBarExtra` rather than fighting the host with custom layout hacks.

## Core components, `@raycast/utils`, and ActionPanel ergonomics

- Prefer **`@raycast/utils`** hooks (`useCachedPromise`, `usePromise`, `useFetch`, `useForm`) so commands paint immediately from cache while revalidating, cancel stale async requests automatically, and format validation errors cleanly.
- Put the single highest-frequency action first inside `ActionPanel` (it automatically maps to `Enter`; the second action maps to `Cmd+Enter` / `Ctrl+Enter`), and group destructive actions in a bottom `ActionPanel.Section` with `Action.Style.Destructive` and `confirmAlert(...)`.

```tsx
import { Action, ActionPanel, Icon, List, Toast, confirmAlert, getPreferenceValues, showToast } from '@raycast/api';
import { useCachedPromise } from '@raycast/utils';
import { useState } from 'react';

interface Preferences {
  apiToken: string; // declared with "type": "password" in package.json
}

export default function SearchIssuesCommand() {
  const { apiToken } = getPreferenceValues<Preferences>();
  const [query, setQuery] = useState('');

  const { data = [], isLoading, error, revalidate } = useCachedPromise(
    async (q: string) => fetchIssues(apiToken, q),
    [query],
    { keepPreviousData: true, onError: (err) => showToast({ style: Toast.Style.Failure, title: 'Search failed', message: err.message }) },
  );

  return (
    <List isLoading={isLoading} onSearchTextChange={setQuery} searchBarPlaceholder="Filter issues…" throttle>
      {error && <List.EmptyView icon={Icon.ExclamationMark} title="Could not load issues" description={error.message} />}
      {!error && data.length === 0 && (
        <List.EmptyView icon={Icon.MagnifyingGlass} title="No matching issues" description="Try another search term or clear filters." />
      )}
      {data.map((issue) => (
        <List.Item
          key={issue.id}
          title={issue.title}
          subtitle={issue.key}
          accessories={[{ tag: issue.status }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={issue.url} />
              <Action.CopyToClipboard title="Copy Issue Key" content={issue.key} />
              <ActionPanel.Section>
                <Action
                  title="Archive Issue"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={async () => {
                    if (await confirmAlert({ title: `Archive ${issue.key}?` })) {
                      await archiveIssue(apiToken, issue.id);
                      revalidate();
                    }
                  }}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

## `MenuBarExtra`, no-view commands, storage, and AI Extensions/Tools

| Capability | API / manifest idiom | Concrete rule |
|---|---|---|
| **Menu bar item** | `<MenuBarExtra icon={...} title={...} isLoading={...}>` + `"interval": "5m"` | Keep refreshes lightweight and avoid launching noisy popups on background polls; show explicit error state inside the menu. |
| **No-view commands** | `"mode": "no-view"` in `package.json` | Perform instant single-shot tasks (toggle setting, copy formatted link) and close cleanly with `showHUD("Copied URL")` or `showToast(...)` on failure. |
| **Storage & secrets** | `getPreferenceValues()` (`"type": "password"`), `Cache`, `LocalStorage` | Store secrets only in password preferences or OAuth (`OAuth.PKCEClient`), use synchronous `Cache` for instant UI hydration, and async `LocalStorage` for durable per-device records. |
| **Raycast AI Extensions & Tools** | `AI.ask(...)`, `environment.canAccess(AI)`, `src/tools/*.ts` | Guard `AI.ask()` with `environment.canAccess(AI)` (Pro feature) and provide a graceful fallback. For **AI Tools** invoked by Raycast AI Chat / Quick AI, export a clear default function + `confirmation` callback for any mutating/external tool so users approve side effects before execution. |

## Cross-platform parity (macOS and Windows)

Raycast runs on both **macOS and Windows**. Unless your extension genuinely depends on macOS-only frameworks (`osascript`, AppleScript, `~/Library`, Spotlight), keep paths cross-platform (`os.homedir()`, `path.join`), avoid hardcoding `Cmd` in copy text (Raycast maps shortcut labels automatically), and set `"platforms": ["macOS", "Windows"]` (or `["macOS"]` explicitly when Apple-only) in `package.json`.

## Do/don't pairs

| Do | Don't |
|---|---|
| `useCachedPromise` + `throttle` on live search lists | Fire unthrottled fetches on every keystroke with blank flicker |
| Guard `AI.ask` with `environment.canAccess(AI)` and confirm mutating AI Tools | Crash non-Pro users or auto-delete records from an AI tool call |
| Store tokens in `password` preferences or `OAuth.PKCEClient` | Render API keys in plaintext `Form.TextField` or `Cache` |
| Declare `"platforms"` honestly and guard macOS-only shell commands | Invoke `osascript` unconditionally in a cross-platform extension |
| Group destructive actions at bottom of `ActionPanel` with `confirmAlert` | Put Delete as the first `Enter` action on a list row |

## Verification commands

```sh
npm run lint
npm run build
npm run dev
```

`npm run lint` and `npm run build` provide `static` evidence (manifest schema, TypeScript, Raycast ESLint rules). Launch inside Raycast (`npm run dev`) to verify fast paint, empty/error states, keyboard-only `ActionPanel` flow, dark/light icon contrast, `MenuBarExtra` updates, and Windows/macOS parity (`rendered` evidence).
