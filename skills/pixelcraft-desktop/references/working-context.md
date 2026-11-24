# Working context: linked panes, persistence, and multi-monitor safety

In desktop editors, debuggers, CAD tools, and inspectors, secondary panes exist to act on a specific subject in the primary canvas or source view. Never let a detached inspector or result pane leave its subject ambiguous.

## Linked source, canvas, & inspector context

- **Mark the active subject in both places**: a debugger marks the paused source line with an icon + highlight while the call-stack pane names the selected frame and file:line; a document inspector names the selected layer/node in its header while the canvas renders selection handles. Never rely on color alone—pair visual selection with a text label, icon, or breadcrumb.
- **Explicit empty & multi-selection states**: when nothing is selected, show document/page properties or a clear `"No item selected"` state rather than stale fields from the previous item. When N items are selected, show `"3 layers selected"`, display shared values, and label divergent fields `"Mixed"` rather than silently overwriting differing values on blur.
- **Bi-directional synchronization**: navigating to an error/search result focuses and scrolls the primary pane without stealing keyboard focus unintentionally; editing a property in the inspector updates the primary view with a single coherent undo step (`Cmd/Ctrl+Z`).

## Pane focus-ring traversal (`F6`)

Keyboard-only users must traverse major workspace regions without tabbing through 200 toolbar or tree items:

| Shortcut | Action |
|---|---|
| `F6` / `Shift+F6` (Windows/Linux) or `Ctrl+F6` / documented landmark key (macOS) | Cycle focus between primary landmark panes (Sidebar → Editor/Canvas → Inspector → Bottom Output/Console) while restoring the last focused item inside each pane. |
| `Escape` | Return focus from a secondary inspector, search bar, or quick-filter input back to the primary working canvas/editor without clearing the active selection. |
| `Cmd/Ctrl+B`, `Cmd/Ctrl+Alt+I`, etc. | Toggle sidebar/inspector visibility via discoverable menu commands so collapsed panes remain reachable when hidden. |

## Minimum-width disclosure fallback

Define a tested minimum window width (e.g., `720–900 px` logical) and split-pane minimum widths so panes cannot be dragged to an irreversible `0 px` slit:

- Below the multi-pane threshold, collapse the secondary inspector into a tab, slide-over drawer, or temporary sheet—preserving the active selection and keeping all inspector commands accessible in menus and the command palette.
- Provide a visible re-open button and menu toggle whenever a pane is collapsed; persist collapsed/expanded state independently of last known width so reopening restores a usable width.

## Workspace persistence & multi-monitor invalid-bounds clamping

Store workspace layout in a versioned schema (JSON/SQLite/Preferences) so future upgrades migrate cleanly without crashing:

```json
{
  "schemaVersion": 2,
  "window": { "width": 1280, "height": 800, "x": 120, "y": 80, "maximized": false, "displayId": "DELL-U2723QE" },
  "panes": { "sidebarOpen": true, "sidebarWidth": 260, "inspectorOpen": true, "inspectorWidth": 320, "activeTab": "properties" }
}
```

**Multi-monitor clamping rule**: users unplug external monitors, change DPI scaling, and rearrange displays. On restore (on X11/Windows/macOS where coordinates apply; on Wayland persist only `width`/`height`/maximized because Wayland disallows global positioning):

1. Enumerate all currently connected displays' **usable work areas** (excluding taskbar/dock/menu bar).
2. Verify that at least the window's titlebar drag band and a usable portion (e.g., ≥ `120×80 px`) intersect a connected display's work area.
3. If the saved bounds fall off-screen or exceed the current display's work area, clamp `width`/`height` to the primary display's work area and re-center the window—**never restore an unreachable off-screen window**.

## Do/don't pairs

| Do | Don't |
|---|---|
| Show selected object name/breadcrumb in the inspector header AND mark it on canvas | Leave stale fields in a detached inspector when selection clears |
| Support `F6`/`Shift+F6` pane hopping and `Esc` back to the canvas | Force keyboard users to `Tab` through 100 tree rows to reach the inspector |
| Clamp saved bounds against connected displays' visible work areas on launch | Restore `x: 2800, y: 100` onto an unplugged monitor leaving the app invisible |
| Collapse secondary inspector to a tab/drawer at minimum window width | Clip inspector controls off-screen or allow irreversible `0 px` split drags |
| Reopen last workspace with matching selection, scroll, and focus state | Reset split ratios and drop selection on every launch |

## Verification checks

Verify in a real running desktop app (`rendered`; static showcase screenshots never prove keyboard traversal, clamping, or restoration—label untested OSes `not-checked`):

1. Select an item, press `F6` to move to the inspector, edit a field, press `Esc` back to canvas, and undo (`Cmd/Ctrl+Z`): verify selection, focus ring, and undo agree (`rendered`).
2. Resize window down to minimum supported width, collapse and reopen the inspector, and verify no clipped controls or lost selection (`rendered`).
3. Move window to a secondary/high-DPI display (or edit persisted bounds to invalid coordinates `x: 9999`), relaunch, and verify clamping brings the window cleanly onto a visible work area (`rendered`).
