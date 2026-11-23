# Pattern decision matrices

Use this reference before applying any named product pattern. Patterns encode recurring behavior, but the correct choice depends on task frequency, object count, risk, collaboration, input modality, and recovery cost. Do not pick a pattern because it is visually familiar.

## Workflow structure matrix

| User/task shape | Prefer | Avoid or constrain | Required behavior |
|---|---|---|---|
| short infrequent linear task | single page or one-step flow | unnecessary wizard | visible submit/review behavior; preserve input |
| infrequent high-consequence branching task | guided stepper/wizard | hidden branching logic | progress truthfully shown; back/edit/resume; validation before irreversible commitment |
| expert repeated data entry | dense editable table/form or command workflow | forced stepper per item | keyboard flow, defaults, duplicate/copy, batch validation, undo |
| exploratory decision | comparison matrix/list-detail/filterable collection | forced linear narrative | stable comparison attributes, save/share state, reversible exploration |
| ongoing monitoring | dashboard/instrument panel | marketing-style narrative cards | freshness/source/state; alarm hierarchy; drill-down without losing overview |
| collaborative artifact | persistent canvas/document plus presence/history | isolated modal-per-action editing | ownership/conflict/restore/version behavior |
| import/migration | staged preview → validate → commit → recover | direct blind commit | mapping memory, partial failure semantics, rollback/report |
| setup/configuration | sensible defaults plus progressive advanced controls | expose every option at once | impact/copy validation, reset/undo, dependency explanation |

## Navigation matrix

| Content/device shape | Prefer | Caveat |
|---|---|---|
| few top-level tasks, frequent switching | persistent tab/segment/rail according to platform | do not hide primary task behind generic menu |
| deep hierarchical object space | tree/sidebar plus breadcrumb/location | keyboard/tree semantics and state restoration required |
| large flat searchable corpus | list/index/search-first navigation | result state, sort/filter persistence, empty recovery |
| focused creation/editing | full-screen/split workspace with explicit exit | escape/back/dirty-state protection |
| companion/reference material | inspector/panel/popover chosen by frequency and screen size | focus order, occlusion, resize behavior |
| mobile compact flow | bottom/top native navigation or stacked push idioms | do not copy desktop sidebar/menubar literally |

## Search/filter decision rules

Choose the lightest control that matches user knowledge:

| User knowledge/data shape | Pattern |
|---|---|
| knows exact object/name | direct search with keyboard submission/paste/clear |
| knows attributes, not exact name | faceted/filterable list with visible applied filters |
| compares few items | sortable table/list or comparison view |
| explores broad domain | grouped navigation plus search, not a blank search box alone |
| frequent expert retrieval | saved filters/views/history/command syntax only after basic UI works |

Mandatory recovery behavior: distinguish no matches, permission-hidden data, invalid query, network failure, stale response, and indexing delay. Empty state must offer concrete recovery in order of likelihood: remove/loosen filter, correct spelling, broaden scope, clear query, inspect permissions/indexing status, or create/import the missing object. Never write only “No results found.”

## Dense table/list decision rules

Use a dense table when users scan aligned attributes, compare rows, or perform repeated expert work. Use list/cards when object identity/media/content matters more than column comparison.

Required dense-table semantics:

- stable ordering and visible sort/filter state;
- row selection model documented: single/multiple/range/all-visible/all-query;
- selection survives or intentionally resets across sort/filter/page/virtualization—do not silently lose it;
- bulk actions show affected count/scope and handle partial permission/failure;
- keyboard/controller navigation does not require traversing every cell when row-level actions exist;
- virtualized rows preserve total-count/position orientation and focus restoration;
- resize/reflow chooses priority columns rather than uniform compression;
- empty/loading/error/permission/offline states remain inside table context;
- row deletion/focus removal restores focus predictably.

Do not virtualize away accessibility or selection semantics. Do not use pagination merely because rendering was not designed; choose pagination/infinite/loading behavior based on object count, comparison needs, shareability, and platform norms.

## Hybrid boundary rule

A screen may combine patterns only when each region has a dominant job and boundary: overview vs detail, browse vs edit, monitoring vs investigation, conversation vs artifact. Name the primary pattern per region and verify focus/order/back behavior across boundaries. Do not blend dashboard cards, wizard steps, canvas tools, and marketing persuasion into one undifferentiated surface.

## Pattern selection record

Before implementation, record:

```markdown
| Screen/region | Primary pattern | User/task evidence | Rejected alternative | Recovery risk | Verification required |
|---|---|---|---|---|---|
```

A missing record means the pattern is probably inherited from a template rather than chosen.
