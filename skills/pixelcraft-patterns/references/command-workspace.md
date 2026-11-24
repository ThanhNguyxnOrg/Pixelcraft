# Command-first and high-velocity workspace patterns

Use this reference for expert operational workspaces across **web, desktop, mobile, and terminal (TUI)** surfaces where repeat users prioritize speed, keyboard muscle memory, low perceived latency, and dense scanability over marketing whitespace.

## Command palette (`Cmd+K` / `Ctrl+K`)

Treat the command palette as a global action router, not merely a passive search input:

| Requirement | Surface-independent rule |
|---|---|
| **Invocation** | Bind the platform's primary command shortcut (`Cmd+K` on macOS, `Ctrl+K` on Windows/Linux/TUI, or prominent search/command button on touch/mobile) plus a visible clickable trigger showing the active shortcut hint. |
| **Scope & parameterized actions** | Support both navigation (`Go to…`) and direct parameterized actions (`Assign to…`, `Change status…`, `Export…`), displaying recent items before the user types. |
| **Selection & focus restoration** | Expose a modal/overlay list with keyboard selection (`Up`/`Down`), execution (`Enter`), and dismissal (`Escape`) that **restores focus to the exact prior element or pane**. |
| **Async freshness & empty recovery** | Cancel or ignore stale async query responses so slower earlier results never overwrite newer input; offer actionable fallback when zero commands match (clear filter or jump to full search). |

## Keyboard-first navigation and input-suppression contract

Single-key shortcuts (`j`/`k` navigate, `c` create, `/` search, `?` help) dramatically accelerate triage, but they become destructive if fired while editing text. Enforce this surface-independent **input-suppression contract** before dispatching any unmodified single-key hotkey:

1. **Active text input guard**: Suppress when focus is inside any text entry control, editable document region, or combo/select search input.
2. **IME composition guard**: Suppress during active CJK/dead-key IME composition so intermediate keystrokes never trigger commands.
3. **Modal scope guard**: Suppress background workspace hotkeys whenever a blocking dialog, confirmation sheet, or command palette is open.
4. **Modifier clarity**: Keep chords consistent (`Cmd/Ctrl+Enter` to submit inline composers, `Escape` to cancel edits cleanly without losing drafts silently, `?` for a context-grouped shortcut cheat sheet).
5. **Composite region navigation**: Use single-tab-stop composite navigation inside dense lists, toolbars, and tab bars (arrow keys move internally; `Tab` moves between major panes).

### Platform mapping

| Surface | Palette invocation & focus | Single-key suppression & pane navigation |
|---|---|---|
| **Web (`pixelcraft-web`)** | `Meta+K` / `Control+K`; dialog + `combobox`/`listbox` + `aria-activedescendant`; restore focus on `Escape` | Check `event.isComposing` and whether target is inside `input`, `textarea`, `select`, or `[contenteditable]`; roving `tabindex` (`0` / `-1`) |
| **Desktop (`pixelcraft-desktop`)** | Native menu/command bar (`Cmd+K` macOS, `Ctrl+K`/`Ctrl+Shift+P` Win/Linux); restore first-responder/focus ring | Respect OS text-field responder and IME marked-text state; native `NSSplitView`/WinUI/Qt splitters with keyboard resize |
| **Mobile (`pixelcraft-mobile`)** | Persistent quick-action/search bar + hardware keyboard `Cmd+K` on iPadOS/Android tablets | Offer thumb-reachable action sheets and swipe shortcuts alongside external keyboard shortcuts |
| **Terminal (`pixelcraft-tui`)** | `Ctrl+P` / `Ctrl+K` / `:` command mode overlay; restore active pane focus | Separate normal navigation mode from insert/input focus; never shadow terminal escape sequences unintentionally |

## Optimistic UI, rollback, and undo

- Apply low-risk, reversible mutations (status toggle, star, archive, reorder, inline rename) immediately using a client mutation ID / idempotency key.
- Surface a subtle non-blocking pending cue only when the request exceeds ~300 ms; never block the workspace with a modal spinner for a single-row mutation.
- On server failure, roll back the optimistic state deterministically, preserve user input, and surface an inline or toast error with one-action `Retry`.
- Pair reversible destructive-feeling actions (archive, move to trash) with an immediate timed `Undo` notification rather than a blocking confirmation dialog; reserve confirmation modals for irreversible mutations.
- Match loading-placeholder geometry to loaded row/card heights so layout never shifts when data resolves.

## Master-detail split panes and intentional density

- Drive density modes (`compact`, `comfortable`, `spacious`) from semantic spacing and row-height tokens rather than one-off component overrides.
- Persist active filters, sort order, selected tab, and open detail identifier in shareable route/navigation state so reload, Back/Forward, and deep links restore exact context.
- Keep resizable pane splitters operable via both pointer and keyboard (with clamped min/max widths) and collapse gracefully into stacked navigation on narrow viewports.

## Do/don't pairs

| Do | Don't |
|---|---|
| Restore focus to the exact triggering row or button when closing the palette | Drop focus to the window root on `Escape` |
| Suppress single-key hotkeys during text editing and IME composition | Hijack `j`, `k`, or `/` while a user types in a search box or CJK IME |
| Persist filter, sort, and detail selection in navigation/URL state | Reset workspace filters to defaults on Back or reload |
| Roll back failed optimistic writes with preserved input and `Retry` | Leave stale optimistic UI pretending a failed mutation succeeded |
