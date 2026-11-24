# Editors, creative tools, and canvas

Creative surfaces are precision instruments. Chrome must recede while work is in progress yet stay discoverable, spatially stable, and reversible. For transaction-stack undo/redo, named snapshots, and diff comparisons, pair with [history-diff-undo.md](history-diff-undo.md).

## Core workspace anatomy

- Preserve spatial stability across the primary canvas/document, tool rail, layer/outline tree, property inspector, timeline (if temporal), and status bar.
- Make active tool and mode unmistakable via cursor shape, selection bounds, transform handles, inspector readout, and status bar hints.
- Direct manipulation is primary, but every critical operation (select, nudge, group, align, duplicate, reorder, delete, zoom) must have a keyboard, menu, and command-palette path.

## Layers, multi-select inspectors, snapping, and version history

| Subsystem | Required UX behavior |
|---|---|
| **Layer tree & grouping** | Show hierarchy depth, type icon, visibility (eye), and lock toggles; support search/filter, collapse-all, keyboard tree navigation, and keyboard reorder alternatives alongside drag-and-drop. Locking prevents accidental canvas clicks while keeping the layer selectable in the tree to unlock. |
| **Mixed-value multi-select inspector** | When selected objects differ on a property (e.g., width, font size, fill), display a clear `"Mixed"` placeholder rather than the first item's value or `0`. Committing a new value applies to all selected items; leaving `"Mixed"` untouched preserves each object's distinct value. Support relative math inputs (`+8`, `*2`) where numeric precision matters. |
| **Snapping, guides, and grids** | Render distance/alignment smart guides only during active move/resize, respect user grid/unit settings (`px`, `mm`, `pt`), and provide a hold-modifier key to temporarily bypass snapping without flipping global settings. |
| **Zoom, pan, and viewport** | Zoom around the pointer or active selection center, expose exact zoom percentage with quick presets (`Fit`, `100%`, `Zoom to selection`), and keep thin strokes/handles crisp across zoom levels. |
| **Autosave & version history** | Persist continuous autosave locally/remotely with a calm sync status indicator, allow named manual checkpoints ("Before typography pass"), and preview historical snapshots read-only before restoring or duplicating. |

## State matrix

| State | Required behavior |
|---|---|
| Empty / untitled document | Ready-to-work canvas with clear primary creation action and unobtrusive template/import entry |
| Missing font or broken media asset | Render explicit fallback bounding box and non-destructive relink/substitute action; never silently flatten |
| Read-only / view-only permission | Switch cleanly to inspect/comment/export mode without dead disabled edit chrome cluttering the viewport |
| Large document performance | Virtualize layer trees, cull off-screen canvas geometry, and keep frame pacing steady during pan/zoom |
| Offline / conflict | Queue local edits safely, expose conflict status clearly, and let users duplicate or merge rather than overwriting |

## Do/don't pairs

| Do | Don't |
|---|---|
| Show `"Mixed"` in inspectors when multi-selected values differ | Overwrite differing widths/colors with the first selected item's value |
| Provide keyboard nudge, reorder, and layer actions alongside drag | Lock essential editing behind pointer-only drag handles |
| Allow holding a modifier key to temporarily override snapping | Force users into Preferences to disable snap for one nudge |
| Keep locked layers selectable in the layer panel to unlock | Make locked objects completely unreachable |

## Verification

Test numeric precision and unit rounding, IME text composition on canvas, mixed-value multi-select commits, pointer-capture interruption (Escape mid-drag), keyboard-only grouping/reordering/deletion, layer tree virtualization at 1,000+ nodes, high-DPI rendering, color-picker contrast, reduced motion, and accessible outline/tree alternatives.
