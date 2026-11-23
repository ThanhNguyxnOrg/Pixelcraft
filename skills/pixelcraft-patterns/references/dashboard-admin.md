# Dashboard and admin

Dashboards are operational instruments, not metric collages. Start from decisions: what should the user notice, decide, or do next?

## Structure

- Lead with status/outliers/actions, not vanity charts.
- Group by decision or operational object; label time range, freshness, source, and permissions.
- Make every metric answer a question. If no action or understanding follows, remove or demote it.
- Preserve drill-down context: filters, time range, selection, scroll, and back navigation.
- Use overview → inspect → act progression rather than modal cascades.

## States

| State | Required behavior |
|---|---|
| no data yet | explain setup/next action without fake sparklines |
| partial/permission-limited | show scope honestly; do not imply empty means zero events |
| stale/offline | timestamp and preserve last known data as stale |
| overload | prioritize alerts and aggregation; avoid endless equal-weight cards |
| error | identify affected source and retry path without discarding user filters |

## Do / don't

- **Do** use dense, scanable tables/lists for high-frequency operators; **don't** force everything into identical cards.
- **Do** make thresholds and comparison baselines explicit; **don't** color numbers red/green without meaning or colorblind-safe redundancy.
- **Do** keep destructive/admin actions permission-aware and auditable; **don't** hide them behind ambiguous icon buttons.

## Verification

Test slow queries, zero rows, one row, thousands of rows, stale cache, failed source, denied permission, long names, numeric formatting/locale, keyboard focus, and narrow-width restructure. Measure chart rendering cost with real cardinality.
