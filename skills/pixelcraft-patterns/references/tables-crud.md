# Tables, lists, and CRUD

Dense operational UI succeeds through scanability, predictable editing, and safe recovery.

## Tables/lists

- Choose row identity and primary column deliberately; keep actions/context visible without mystery icons.
- Support keyboard/focus/selection semantics, stable sorting, column width behavior, empty/loading/error states, and responsive transformation.
- Virtualize large datasets only when needed and preserve focus/scroll/selection correctly.
- Never truncate essential unique identifiers without expansion/copy/access.

## Create/read/update/delete

| Action | Rules |
|---|---|
| create | sensible defaults, validation near fields, duplicate prevention, clear success/location |
| read/detail | preserve context/back state; distinguish missing vs no permission |
| update | concurrency/version conflict handling; explicit dirty/save state where platform expects it |
| delete | consequence-specific confirmation; undo/archive preferred when truthful |
| bulk | visible selection count/scope, filter-aware selection behavior, progress/partial failure report |

Import/export needs schema errors with row/column references, encoding/locale behavior, progress, cancellation, and no silent data loss.

## Dense selection and virtualization contract

Define selection behavior before implementation:

| Concern | Required rule |
|---|---|
| scope | distinguish row selection, page/viewport selection, filtered-set selection, and all-query selection |
| persistence | state whether selection survives sort/filter/pagination/virtualization; silent loss is a defect unless explicitly documented |
| feedback | show affected count/scope before destructive/bulk action and report partial success/failure afterward |
| keyboard/controller | provide row-level navigation/action path without forcing traversal through every cell |
| position orientation | virtualized/large collections preserve total count, approximate position, stable ordering, and scroll/focus restoration |
| removal | deleting the focused/selected row moves focus predictably to next/previous/context row rather than dropping it |
| permissions | rows/actions hidden by permission do not create false “select all” counts |
| reflow | priority columns remain visible; do not uniformly shrink every column until text/data are unreadable |

Virtualization is a rendering optimization, not permission to omit semantic rows, selection state, live count/status, keyboard range behavior, or focus restoration. If the platform cannot support both virtualization and required accessibility semantics, reduce rendered scale/page size or choose pagination rather than breaking operability.

## Verification

Test zero/one/many rows, long unbroken text, locale sorting/numeric formatting, mixed RTL, row selection by keyboard, focus after delete/dialog, refresh/back/deep link, concurrent edit conflict, failed partial bulk action, narrow screens, dark/high contrast, selection persistence across sort/filter/page changes, range/multi-selection semantics, screen-reader count/position exposure, and virtualization accessibility.
