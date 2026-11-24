# Dashboard and admin

Dashboards are operational instruments, not metric collages. Start from decisions: what must the operator notice, diagnose, or act on next?

> **Cross-skill boundary:** This reference governs operational workspace structure, triage flows, drill-down context, and admin action safety. For chart selection, perceptual encoding, axes/baselines, colorblind-safe palettes, sparklines, and analytical table typography, coordinate with `pixelcraft-dataviz`. For multi-tenant permissions and audit trails, see [multi-tenant-rbac.md](multi-tenant-rbac.md).

## Structure and operational hierarchy

- **Lead with exceptions and actions**: Put system health, SLA breaches, failed jobs, and pending approvals ahead of historical vanity totals.
- **Group by operational object or workflow**, not by chart widget type. State time range, timezone, freshness timestamp, data source, and permission scope once per coherent region.
- **Overview -> Inspect -> Act**: Open object details in a side inspector, split pane, or dedicated drill-down view that preserves active filters, sort order, selection, and scroll position on back navigation rather than stacking nested modals.
- **Match density to operator frequency**: High-frequency operations consoles favor dense tables, compact status rails, and keyboard shortcuts; periodic executive summaries favor fewer, higher-signal comparisons.

## State matrix

| State | Required behavior |
|---|---|
| No data yet (unconfigured) | Explain setup/integration step clearly without fake sparklines or placeholder numbers |
| Partial / permission-limited | State scope restriction explicitly ("Showing 2 of 6 regions you can access"); never let missing access look like zero activity |
| Stale / degraded feed | Timestamp last successful sync, label cached metrics as stale, and keep inspection usable while retrying |
| Alert overload | Aggregate by root cause/severity, expose pause/acknowledge/filter controls, and avoid equal-weight card walls |
| Source/query failure | Isolate error copy and `Retry` to the failing widget while keeping healthy panels and active filters intact |

## Do/don't pairs

| Do | Don't |
|---|---|
| Dense scanable tables and exception queues for daily operators | Equal-height 4-card KPI mosaics regardless of priority |
| Explicit thresholds, baselines, and redundant icon/text status | Color-only red/green numbers without period or unit context |
| Permission-aware admin actions with audit logging and clear labels | Destructive actions hidden behind unlabeled icon buttons |
| Preserve active filters and time range across drill-down and Back | Reset date range to "Last 7 days" every time an operator closes a detail drawer |

## Verification

Test slow queries, zero rows, one row, thousands of rows, partial source failure, stale cache timestamps, denied permissions, long entity names, locale/tabular numeric formatting, keyboard focus across filter -> table -> inspector, and narrow-viewport reflow. Measure rendering cost with realistic cardinality.
