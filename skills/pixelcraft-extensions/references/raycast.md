# Raycast extensions

Raycast renders a React declaration into native launcher UI. The API is a design system, not arbitrary HTML/CSS: use `List`, `Grid`, `Detail`, `Form`, and `ActionPanel` rather than fighting the host.

## Idioms

- Render quickly; use `isLoading` on top-level components while data loads.
- Choose List for dense repeated items, Grid for visual artifacts, Detail for inspection, Form for creation/input.
- Put contextual operations in `ActionPanel` and group them in semantic sections. Primary/secondary action order matters because default keyboard shortcuts derive from it.
- Keyboard-first means every essential operation has an action/shortcut; do not rely on hover or visual-only affordances.
- Use accessories, icons, subtitles, keywords, filtering, sections, and empty views to communicate structure instead of custom layout.

## UX constraints

Launcher commands are brief and interruptible. Preserve query/filter state where expected, make errors retryable, use toast/alert appropriate to severity, and cache only with explicit staleness semantics. Authentication/preferences need clear setup and recovery; secrets belong in supported preference/storage mechanisms, not copied into plaintext UI.

## Verification

Test empty/loading/error/offline/permission states, long titles/subtitles, dynamic filtering, keyboard-only invocation of every action, shortcut conflicts, theme/icon readability, large result sets, cancellation of stale requests, and behavior when the command is repeatedly launched or the item selection changes during async work.
