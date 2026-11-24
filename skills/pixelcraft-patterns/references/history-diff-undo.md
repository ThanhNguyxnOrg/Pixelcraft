# History, undo/redo stacks, version snapshots, and diff viewers

Users explore confidently only when mistakes are cheap to inspect and reverse. Treat undo, version history, and diffs as first-class operational workflows rather than afterthought utilities.

## Atomic undo/redo transaction stacks

- **Group by user intent, not raw events**: Coalesce rapid character typing, continuous slider drags, and multi-object drags into single atomic undo transactions (commit on pointer-up, pause boundary, or discrete command) so one `Undo` reverses the whole intent rather than 1 pixel or 1 keystroke.
- **Label the action**: Where menus, tooltips, or command palettes expose undo/redo, name the transaction (`Undo Move 3 layers`, `Redo Change status`) and disable controls cleanly at stack boundaries.
- **Multiplayer per-user undo**: In collaborative documents (CRDT / OT), `Undo` must reverse **only the local user's own operations** without wiping another collaborator's intervening edits. When a collaborator has modified or deleted the same target, resolve cleanly via CRDT semantics or inform the user why the operation cannot be undone cleanly.
- **Selection & scroll restoration**: Undoing a delete or move should restore focus/selection to the affected object and bring it into view if off-screen.

## Version history and named snapshots

- Separate **automatic checkpoints** (grouped by time window and author so history is not cluttered with 400 tiny autosaves) from **named manual snapshots** ("Q3 pricing sign-off", "Pre-migration baseline") with optional filter "Named versions only".
- **Preview before restore**: Opening any historical version enters an unmistakable **read-only preview state** (banner showing timestamp, author, and diff summary) with non-destructive options: **`Restore this version`** (creating a *new* head revision so current work is still recoverable in history) or **`Duplicate as new copy`**.
- Never destroy the current head silently when restoring an older snapshot—restoration itself must be undoable.

## Diff viewers (code, rich text, and structured config/JSON)

Choose representation and controls to match the artifact being compared:

| Artifact type | Primary diff modes | Required UX cues |
|---|---|---|
| **Code & plain text** | Unified (inline) + Split (side-by-side) toggle, syntax highlighting, word/character intraline emphasis | Line numbers for old/new sides, expandable unchanged-context folds (`Show 20 more lines`), whitespace-ignore toggle, jump-to-next/prev hunk (`n`/`p`) |
| **Rich text / documents** | Tracked-changes inline view + margin attribution cards + clean "Preview final" toggle | Author attribution, timestamp, per-change `Accept` / `Reject` plus bulk actions, clear formatting-change vs text-change markers |
| **JSON / YAML / config / tables** | Semantic key-path diff (ignoring harmless key order) + raw text toggle | Highlight added, removed, and changed keys with old -> new values, type-change callouts (`"42"` string -> `42` number), sensitive-value redaction |

- **Colorblind-safe diff encoding**: Never rely on green/red background tint alone—always combine `+` / `-` / `~` markers, strikethrough or underline accents, explicit accessible labels (`Added line`, `Removed line`), and high-contrast intraline highlights in both light and dark modes.

## State matrix

| State | Required behavior |
|---|---|
| Large diff (> 2,000 changed lines or binary file) | Render file/section index first, collapse huge/generated files with explicit "Load diff" opt-in, and show size/metadata or visual side-by-side compare for images/binaries |
| Identical revisions | State `"No differences between these versions"` (and note if whitespace-only changes are hidden) |
| Multiplayer undo conflict | Undo only local ops; surface clear notice if remote edits superseded the target |
| Restoring an old snapshot | Append as a new latest revision with audit attribution so the prior state stays recoverable |

## Do/don't pairs

| Do | Don't |
|---|---|
| Coalesce a drag or typing burst into one atomic Undo step | Require 45 presses of `Cmd+Z` to undo one slider drag |
| Scope multiplayer `Undo` strictly to the local user's edits | Revert a teammate's concurrent paragraph when pressing `Cmd+Z` |
| Preview version snapshots read-only and restore as a new revision | Overwrite history destructively with zero path back |
| Encode diffs with `+`/`-` symbols, intraline marks, and ARIA cues | Distinguish additions and deletions solely with faint red/green backgrounds |

## Verification

Test transaction coalescing during drags/typing, keyboard `Undo`/`Redo` stack limits and focus restoration, two-client concurrent undo behavior, named snapshot creation and non-destructive restore, unified vs split diff switching on narrow viewports, colorblind/monochrome diff legibility, large-file collapse performance, and screen-reader traversal of diff hunks.
