# Enterprise data tables, grids, virtualization, spreadsheets, and schedulers

Do not render 5,000 DOM table rows or hand-roll Excel-style cell editing, column pinning, and timezone-aware scheduling. Choose between headless tables, enterprise grids, spreadsheet engines, virtualizers, and calendar schedulers by data scale, editing density, and license budget.

## Architecture decision matrix

| Need | Tools | Rendering / model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Headless data tables** | **TanStack Table (v8)** | Framework-agnostic headless state (React, Vue, Solid, Svelte, Angular) | Custom-styled SaaS tables, full design-system control, server-side sort/filter/page | You own markup, sticky headers, keyboard grid nav, and virtualization wiring |
| **Enterprise data grids** | **AG Grid (v33+)**, **MUI X Data Grid**, **Glide Data Grid** | Virtualized DOM (AG Grid, MUI X) or Canvas 2D (Glide) | AG Grid/MUI X: 100k+ rows, grouping, inline editing, Excel export; **Glide Data Grid**: millions of cells at 60fps | Commercial licenses for Pro/Enterprise tiers; Canvas grids like Glide require explicit accessibility/DOM overlay discipline |
| **Spreadsheet UI** | **Handsontable**, **Univer** | Formula engine (HyperFormula / Univer Sheets), cell ranges, clipboard matrix | Financial modeling, bulk tabular editing with Excel copy/paste & formulas (**Univer** is Apache-2.0 open-source core) | Heavier than standard tables; commercial licenses for Handsontable / Univer Pro plugins |
| **List & table virtualization** | **TanStack Virtual (v3)**, **React Virtuoso**, **react-window** | Windowed DOM recycling | Long feeds, chat logs, 10k+ row headless tables (`TanStack Table + TanStack Virtual`) | Dynamic row heights require `measureElement`; native `Ctrl+F` search cannot see unmounted rows |
| **Calendars & schedulers** | **FullCalendar (v6/v7)**, **Schedule-X**, **Bryntum**, **DayPilot**, **vis-timeline** | Time-grid / resource-timeline views | **Schedule-X**: modern open-source React/Vue/Angular/Svelte calendar; **FullCalendar**: mature calendar ecosystem; **Bryntum/DayPilot**: heavy Gantt/resource planning; **vis-timeline**: lightweight timeline | Resource timeline/Gantt views are commercial in FullCalendar/Bryntum/DayPilot |

## Headless tables + virtualization (TanStack Table v8 + TanStack Virtual v3)

- **Stable IDs & references**: always supply `getRowId: (row) => row.id` so row selection, expansion, and inline editing stay bound to record IDs rather than row indices. Memoize `columns` and `data` (never pass `data ?? []` inline every render).
- **Server-side mode**: set `manualSorting: true`, `manualFiltering: true`, `manualPagination: true`, pass `rowCount` (or `pageCount`), and omit client-only row models (`getSortedRowModel`, `getPaginationRowModel`).
- **Dynamic-height virtualization**: when using `useVirtualizer` with variable row heights, attach **both** `data-index={virtualRow.index}` and `ref={virtualizer.measureElement}` on every rendered row.

```tsx
// TanStack Table v8 (server-side sorting & pagination)
const table = useReactTable({
  data,
  columns,
  getRowId: (row) => row.uuid,
  getCoreRowModel: getCoreRowModel(),
  manualSorting: true,
  manualPagination: true,
  rowCount: query.data?.totalCount,
  state: { sorting, pagination },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
});
```

```tsx
// TanStack Virtual v3 dynamic measurement
<div
  key={virtualRow.key}
  data-index={virtualRow.index}
  ref={virtualizer.measureElement}
  style={{ transform: `translateY(${virtualRow.start}px)` }}
>
  {renderRow(rows[virtualRow.index])}
</div>
```

## Enterprise data grids (AG Grid v33+, MUI X Data Grid, Glide Data Grid)

### AG Grid v33+

- **Module registration**: register only needed feature modules via `ModuleRegistry.registerModules([ClientSideRowModelModule, ...])` for tree-shaking—`AllCommunityModule` is convenient for prototyping but disables tree-shaking.
- **Theming API**: customize themes via `themeQuartz.withParams({ spacing, accentColor })` referencing semantic CSS variables (never hardcoded hex literals) passed to `<AgGridReact theme={myTheme} />` instead of legacy CSS theme imports.
- **Stable row updates**: pass `getRowId={({ data }) => data.id}` so streaming/realtime transactions update cells in place without resetting focus, scroll, or selection.

```tsx
import { ClientSideRowModelModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const gridTheme = themeQuartz.withParams({
  spacing: 8,
  accentColor: 'var(--semantic-color-action)',
  backgroundColor: 'var(--semantic-color-background)',
  foregroundColor: 'var(--semantic-color-foreground)',
});

<AgGridReact
  theme={gridTheme}
  rowData={rows}
  columnDefs={colDefs}
  getRowId={({ data }) => data.id}
/>
```

### MUI X Data Grid (`@mui/x-data-grid`)

- Bind `getRowId={(row) => row.uuid}` when records do not have an `id` field, and keep `columns` referentially stable (defined outside render or memoized) so cell editors and focus do not reset.
- For server-backed datasets, set `paginationMode="server"`, `sortingMode="server"`, `filterMode="server"`, and `rowCount={totalRows}` (pass `-1` when unknown), plus `loading={isFetching}` and explicit `slots={{ noRowsOverlay, loadingOverlay }}`.
- For inline editing, implement `processRowUpdate={async (nextRow, prevRow) => ...}` paired with `onProcessRowUpdateError` so failed server saves roll back cleanly and announce the error.

```tsx
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

<DataGrid
  rows={rows}
  columns={columns}
  getRowId={(row) => row.uuid}
  rowCount={totalCount}
  paginationMode="server"
  sortingMode="server"
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  loading={isFetching}
  processRowUpdate={saveRowMutation}
  onProcessRowUpdateError={showRowError}
/>
```

### Glide Data Grid & Univer

- **Glide Data Grid**: draws cells to Canvas 2D with DOM portals for active cell editors; ideal for 100k–1M+ cell sheets, but verify keyboard navigation, clipboard copy/paste, and screen-reader export/alternative view because canvas pixels are not automatically exposed to assistive tech.
- **Univer**: modular open-source spreadsheet/workbook engine (`@univerjs/presets`) when Excel-grade formulas, formatting, and multi-sheet workbooks are required without Handsontable's commercial license.

## Calendars, schedulers, and timelines

- **FullCalendar v7 vs v6**: verify the installed major—v7 consolidates plugin imports under `@fullcalendar/react/*` (`@fullcalendar/react/daygrid`, `@fullcalendar/react/interaction`), removes `@fullcalendar/core` as a peer dependency, and requires `temporal-polyfill`.
- **Schedule-X**: lightweight open-source alternative (`@schedule-x/calendar` + framework wrappers) with Temporal-first APIs (`Temporal.ZonedDateTime` / `PlainDate`), clean CSS variable theming, and Day/Week/Month views out of the box.
- **Timezone safety**: always configure `timeZone` explicitly (e.g., `'UTC'` or an IANA zone like `'America/New_York'`). Because native JS `Date` objects only represent local or UTC time, read `info.dateStr` (ISO string) or `Temporal.ZonedDateTime` rather than `.toString()` when using a named timezone.
- **Accessible view fallback**: calendars and timelines with dense drag-to-reschedule interactions must provide a list/agenda view (`listPlugin` / list mode) and keyboard/click edit modal (WCAG 2.1.1 & 2.5.7).

## Data table & grid accessibility rules

- Use native `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`, and `aria-sort="ascending" | "descending" | "none"` for read-only/sortable tables.
- Reserve `role="grid"` with roving `tabindex` and arrow-key cell navigation for interactive/editable data grids; always set `aria-rowcount` and `aria-rowindex` (and `aria-colcount`/`aria-colindex`) on virtualized tables so screen readers know the true dataset size.
- Use `font-variant-numeric: tabular-nums` and logical end-alignment for numeric/currency columns.

## Do/don't pairs

| Do | Don't |
|---|---|
| Pass `getRowId` in TanStack Table, AG Grid, and MUI X Data Grid | Key row selection or live updates by row index |
| Attach both `data-index` and `ref={virtualizer.measureElement}` for variable heights | Hardcode a single fixed row height on multi-line wrapping rows |
| Register granular AG Grid v33 modules + `themeQuartz.withParams()` using semantic CSS vars | Hardcode hex values in grid themes or bundle `AllCommunityModule` blindly |
| Pair MUI X `processRowUpdate` with `onProcessRowUpdateError` and server-side modes | Mutate local rows optimistically without rollback or ship 50k rows to client pagination |
| Set `aria-rowcount` and `aria-rowindex` on virtualized tables | Hide total row count from assistive technologies |
| Use `info.dateStr` / `Temporal.ZonedDateTime` + explicit IANA `timeZone` + agenda/list view | Assume browser-local `Date.toString()` matches the calendar's configured timezone |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify bundle size of grid/calendar chunks (`static`), and test 10k-row scroll smoothness, column resize, inline edit rollback, keyboard navigation, and timezone DST boundary rendering in a real browser (`rendered`).
