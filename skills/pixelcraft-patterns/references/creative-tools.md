# Editors, creative tools, and canvas

Creative surfaces are instruments. Chrome must recede until needed while remaining discoverable and reversible.

## Core structure

- Preserve spatial stability of canvas/document, toolbars, inspector, layers/assets, timeline, and status.
- Tool state must be visible through cursor, selection, handles, inspector values, and mode-specific feedback.
- Use direct manipulation where appropriate, but every critical action needs a keyboard/menu/command-palette path.
- Autosave/history/conflict behavior must be explicit; never silently overwrite user work.

## Interaction rules

| Concern | Rule |
|---|---|
| selection | clear affine/hover/selection states; support multi-select semantics deliberately |
| zoom/pan | preserve focus center/content position; expose reset and current scale |
| drag | show constraints, snapping, preview, cancellation, and escape behavior |
| shortcuts | display in context; avoid browser/platform conflicts; support customization where expected |
| inspector | commit/validate numeric input predictably; preserve units and precision |
| canvas fallback | provide DOM/native alternative information and keyboard operations where possible |

## States

Untitled/new document, unsaved/autosaving/error, corrupt/missing asset, empty canvas, huge document performance, offline collaboration conflict, read-only/permission mode, undo/redo boundary, export progress/failure.

## Verification

Test precision input, IME composition, text scaling, zoomed-out legibility, color picker contrast, pointer capture interruption, keyboard-only duplication/deletion, long document virtualization/frame budget, reduced motion, and screen-reader access to object structure where the platform supports it.
