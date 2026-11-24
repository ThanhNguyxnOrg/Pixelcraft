# Scheduling, calendars, Gantt timelines, and Kanban boards

Temporal planning and workflow-board UIs break when timezone ambiguity, recurrence side effects, or drag-only manipulation trap users.

## Calendars, scheduling, and booking

- **Timezone and DST clarity**: Always display the active timezone abbreviation and UTC offset (`America/Los_Angeles (UTC-7)`), show dual-timezone hints when scheduling across participants, and handle Daylight Saving Time spring-forward (nonexistent hour) and fall-back (ambiguous repeated hour) explicitly rather than shifting slots silently.
- **Recurrence edit scopes**: Whenever editing or deleting a recurring event, require an explicit scope choice: **`This event only`**, **`This and following events`**, or **`All events in series`**, clearly noting whether attendee RSVP statuses or exceptions will reset.
- **Availability pickers & booking slots**: Distinguish busy, tentative, out-of-office, buffer time, and working hours using pattern/label plus color (never color alone). Handle slot-taken race conditions gracefully on confirm by refreshing nearby slots while keeping the invitee's form inputs intact.
- **Dense overlap & multi-day spans**: Cap stacked overlapping events with a clear `+N more` overflow popover and preserve multi-day all-day bars across week boundaries.

## Gantt and roadmap timelines

- Keep the left **task hierarchy tree** row-aligned with the right **time grid** across vertical scrolling, resizing, and collapsible parent summaries.
- Render **dependency connectors** (Finish-to-Start, Start-to-Start) cleanly without spaghetti overlaps; highlight critical-path impact or constraint violations when a user moves a predecessor past a dependent date.
- Provide zoom granularity toggles (`Day`, `Week`, `Month`, `Quarter`), a visible **`Today` marker** with one-click jump-to-today, and keyboard/inspector date editing so precise schedule changes never depend solely on dragging bar edges.

## Kanban boards and WCAG 2.5.7 compliance

- **Column & swimlane clarity**: Show column name, current item count, and optional **WIP (Work-In-Progress) limit** (`4 / 3` with distinct warning icon + text, never red color alone). Support optional horizontal swimlanes (by assignee, priority, or epic) with collapse controls.
- **Mandatory single-pointer & keyboard card movement (WCAG 2.5.7 Dragging Movements)**: Drag-and-drop between columns or ranks is an accelerator, never the sole mechanism. Every card must also offer a single-click/tap and keyboard alternative:
  - Card action menu (`Move to column…`, `Move up`, `Move down`, `Move to top/bottom`), AND/OR
  - Keyboard lift-and-move mode (`Space` to grab, `Arrow` keys to choose column/rank with live-region announcement, `Space`/`Enter` to drop, `Escape` to cancel).
- **Large boards & narrow screens**: Virtualize tall columns, keep column headers sticky, and collapse multi-column desktop boards into a column-tab or swipeable single-column view with an explicit column picker on narrow viewports.

## State matrix

| State | Required behavior |
|---|---|
| Booking slot race condition | Explain that the slot was just claimed, refresh open times, and keep user's name/notes intact |
| Recurring event exception edited | Display clear indicator that the occurrence is detached from the series |
| WIP limit exceeded | Warn visibly with count + icon + policy behavior (soft warning vs hard block explained clearly) |
| Drag cancelled (`Escape` / drop outside) | Return card or timeline bar cleanly to exact origin with zero phantom mutation |
| Empty column / empty day | Show clean drop target + contextual `+ Add` action without collapsing column identity |

## Do/don't pairs

| Do | Don't |
|---|---|
| Ask `This event` / `This and following` / `All events` on recurring edits | Silently overwrite a whole year of meetings on one edit |
| Provide menu + keyboard `Move to column…` on every Kanban card | Require mouse drag-and-drop as the only way to change card status |
| Display explicit timezone and handle DST transitions visibly | Render bare `"2:00 PM"` for cross-timezone bookings |
| Align Gantt task rows with keyboard-editable start/end date inputs | Force pixel-accurate mouse dragging on a 6-month zoomed bar |

## Verification

Test timezone switching and DST boundary dates, recurring-event edit/delete scopes, concurrent booking conflicts, Kanban keyboard lift/move and single-pointer menu alternatives (WCAG 2.5.7), WIP limit overflow cues without color alone, Gantt tree-to-timeline scroll sync, horizontal overflow on narrow screens, and reduced-motion drag feedback.
