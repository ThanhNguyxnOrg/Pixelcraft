# Enterprise data tables, grids, virtualization, spreadsheets, and schedulers

Do not render 5,000 DOM table rows or hand-roll Excel-style cell editing, column pinning, and timezone-aware scheduling. Choose between headless tables, enterprise grids, spreadsheet engines, virtualizers, and calendar schedulers by data scale, editing density, and license budget.

## Architecture decision matrix

| Need | Tools | Rendering / model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Headless data tables** | **TanStack Table (v8)** | Framework-agnostic headless state (React, Vue, Solid, Svelte, Angular) | Custom-styled SaaS tables, full design-system control, server-side sort/filter/page | You own markup, sticky headers, keyboard grid nav, and virtualization wiring |
| **Enterprise data grids** | **AG Grid (v33+)**, **MUI X Data Grid** | Virtualized rows + columns, cell editors, tree data, pivoting | Finance, ops, ERP, BI dashboards needing 100k+ rows, grouping, and Excel export | Commercial license for Enterprise/Pro features (pivoting, row grouping, range selection) |
| **Spreadsheet UI** | **Handsontable** | Formula engine (HyperFormula), cell ranges, clipboard matrix | Financial modeling, bulk tabular editing with Excel copy/paste & formulas | Commercial license for non-evaluation use; heavier than standard tables |
| **List & table virtualization** | **TanStack Virtual (v3)**, **React Virtuoso**, **react-window** | Windowed DOM recycling | Long feeds, chat logs, 10k+ row headless tables (`TanStack Table + TanStack Virtual`) | Dynamic row heights require `measureElement`; native `Ctrl+F` search cannot see unmounted rows |
| **Calendars & schedulers** | **FullCalendar (v6/v7)**, **Bryntum**, **DayPilot**, **vis-timeline** | Time-grid / resource-timeline views | **FullCalendar**: event calendars & schedules; **Bryntum/DayPilot**: heavy Gantt/resource-allocation planning; **vis-timeline**: lightweight timeline visualization | Resource timeline/Gantt views are commercial in FullCalendar/Bryntum/DayPilot |

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

## Enterprise data grids (AG Grid v33+ / MUI X Data Grid)

- **AG Grid v33+ module registration**: register only needed feature modules via `ModuleRegistry.registerModules([ClientSideRowModelModule, ...])` for tree-shaking—`AllCommunityModule` is convenient for prototyping but disables tree-shaking.
- **Theming API**: customize themes via `themeQuartz.withParams({ spacing, accentColor })` passed to `<AgGridReact theme={myTheme} />` instead of legacy CSS theme imports.
- **Stable row updates**: pass `getRowId={({ data }) => data.id}` so streaming/realtime transactions update cells in place without resetting focus, scroll, or selection.

```tsx
import { ClientSideRowModelModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const gridTheme = themeQuartz.withParams({ spacing: 8, accentColor: '#0f4c81' });

<AgGridReact
  theme={gridTheme}
  rowData={rows}
  columnDefs={colDefs}
  getRowId={({ data }) => data.id}
/>
```

## Calendars, schedulers, and timelines

- **FullCalendar v7 vs v6**: verify the installed major—v7 consolidates plugin imports under `@fullcalendar/react/*` (`@fullcalendar/react/daygrid`, `@fullcalendar/react/interaction`), removes `@fullcalendar/core` as a peer dependency, and requires `temporal-polyfill`.
- **Timezone safety**: always configure `timeZone` explicitly (e.g., `'UTC'` or an IANA zone like `'America/New_York'`). Because native JS `Date` objects only represent local or UTC time, read `info.dateStr` (ISO string) or UTC methods in callbacks rather than `.toString()` when using a named timezone.
- **Accessible view fallback**: calendars and timelines with dense drag-to-reschedule interactions must provide a list/agenda view (`listPlugin`) and keyboard/click edit modal (WCAG 2.1.1 & 2.5.7).

## Data table & grid accessibility rules

- Use native `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`, and `aria-sort="ascending" | "descending" | "none"` for read-only/sortable tables.
- Reserve `role="grid"` with roving `tabindex` and arrow-key cell navigation for interactive/editable data grids; always set `aria-rowcount` and `aria-rowindex` (and `aria-colcount`/`aria-colindex`) on virtualized tables so screen readers know the true dataset size.
- Use `font-variant-numeric: tabular-nums` and logical end-alignment for numeric/currency columns.

## Do/don't pairs

| Do | Don't |
|---|---|
| Pass `getRowId: (row) => row.id` in TanStack Table and AG Grid | Key row selection or live updates by row index |
| Attach both `data-index` and `ref={virtualizer.measureElement}` for variable heights | Hardcode a single fixed row height on multi-line wrapping rows |
| Register granular AG Grid v33 modules + `themeQuartz.withParams()` | Bundle `AllCommunityModule` blindly in production or mix legacy CSS themes |
| Set `aria-rowcount` and `aria-rowindex` on virtualized tables | Hide total row count from assistive technologies |
| Use `info.dateStr` / explicit IANA `timeZone` and provide an agenda/list view | Assume browser-local `Date.toString()` matches the calendar's configured timezone |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify bundle size of grid/calendar chunks (`static`), and test 10k-row scroll smoothness, column resize, keyboard navigation, and timezone DST boundary rendering in a real browser (`rendered`).
