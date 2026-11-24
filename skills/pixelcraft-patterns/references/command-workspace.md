# Command-first and high-velocity workspace patterns

Use this reference for expert operational web and desktop workspaces where repeat users prioritize speed, keyboard muscle memory, low perceived latency, and dense scanability over marketing whitespace.

## Command palette (`Cmd+K` / `Ctrl+K`)

Treat the command palette as a global action router, not a passive search box:

| Requirement | Concrete rule |
|---|---|
| Invocation | Bind `Meta+K` (macOS) and `Control+K` (Windows/Linux) plus a visible clickable trigger showing the platform-appropriate shortcut hint. |
| Scope & actions | Support both navigation (`Go to…`) and direct parameterized actions (`Assign…`, `Change status…`, `Export…`), with recent items shown before typing. |
| Semantics & focus | Use a modal dialog containing a `combobox` input + `listbox` results with `aria-activedescendant`; `ArrowUp`/`ArrowDown` moves selection, `Enter` executes, `Escape` closes and restores focus to the exact prior element. |
| Empty & failure | Show actionable fallback when zero commands match (clear filter or jump to full search); never trap focus or leave stale async results after a newer query resolves. |

## Keyboard-first navigation

- Suppress single-key shortcuts (`j`, `k`, `c`, `/`, `?`) whenever focus is inside `<input>`, `<textarea>`, `<select>`, `[contenteditable]`, or during IME composition (`event.isComposing`).
- Provide a discoverable `?` shortcut cheat-sheet dialog grouped by context (Global, List, Editor).
- Support `Cmd/Ctrl+Enter` to submit inline composers and `Escape` to cancel edits cleanly without losing unsaved drafts silently.
- Use roving `tabindex` (`0` on active item, `-1` on siblings) in dense lists, toolbars, and tablists so `Tab` moves between regions rather than stepping through 200 rows.

```ts
function isTypingTarget(e: KeyboardEvent): boolean {
  if (e.isComposing) return true;
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  return Boolean(el.closest('input, textarea, select, [contenteditable="true"]'));
}
```

## Optimistic UI, rollback, and undo

- Apply low-risk, reversible mutations (status toggle, star, archive, reorder, inline rename) immediately in the UI using a client mutation ID / idempotency key.
- Show a subtle non-blocking pending state only if the request exceeds ~300 ms; never block the entire screen with a modal spinner for a single-row edit.
- On server failure, roll back the optimistic state deterministically, preserve user input, and surface an inline or toast error with a one-click `Retry`.
- For destructive-feeling but reversible actions (archive, bulk delete to trash), pair immediate removal with a timed `Undo` toast (`role="status"`) rather than an intrusive confirmation modal; reserve confirmation dialogs for irreversible actions.
- Match skeleton loader geometry to the exact loaded row/card heights so layout shift (`CLS`) stays near zero.

## Master-detail split panes and intentional density

- Offer semantic density modes (`compact`, `comfortable`, `spacious`) driven by spacing/row-height tokens rather than arbitrary per-component overrides.
- Persist active filters, sort order, selected tab, and open detail ID in URL search parameters so refresh, back/forward, and link sharing restore the exact workspace state.
- Make resizable pane splitters keyboard-operable (`role="separator"`, `aria-valuenow`, Arrow keys) with clamped min/max widths and a single-column stack on narrow viewports.

## Do/don't pairs

| Do | Don't |
|---|---|
| Restore focus to the triggering row/button after closing the command palette | Drop focus to `document.body` on `Escape` |
| Gate single-key hotkeys on `!isTypingTarget(e)` | Hijack `j`/`k`/`/` while the user is typing in a search field or IME |
| Sync filter/sort/selection state into URL params | Reset filters to defaults on browser refresh or Back |
| Roll back optimistic state with preserved input and `Retry` | Silently swallow failed mutations leaving stale UI pretending success |
