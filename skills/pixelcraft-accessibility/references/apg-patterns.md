# ARIA APG pattern matrix

Use native platform semantics first. This matrix applies when a custom or composite widget is genuinely necessary. ARIA APG patterns are interaction contracts: role alone is never enough without keyboard behavior, focus management, state exposure, and accessible naming.

## Native HTML replacements (prefer before custom ARIA)

Modern HTML eliminates whole classes of brittle ARIA focus-trap and state-sync bugs—use these natively where target browser baselines support them:

| Native HTML primitive | Replaces | Built-in accessibility & keyboard behavior | Guardrail |
|---|---|---|---|
| `<dialog>` + `showModal()` | Custom `role="dialog"` + JS focus-trap | Top-layer stacking, automatic background inerting, `Esc` cancel, focus restoration to invoker on close | Still provide an accessible label (`aria-labelledby` pointing to heading) and visible Close control |
| Popover API (`popover="auto"` / `popover="hint"`) | Custom click-outside dropdowns, tooltips, non-modal overlays | Light-dismiss (`Esc` / outside click), top-layer placement, automatic `aria-expanded` / `aria-details` linkage with invoker | Use `popover="hint"` for non-interactive hover/focus tooltips that should not close open `auto` popovers |
| Invoker Commands (`commandfor` + `command`) | Custom `onclick` + manual `aria-controls` / `aria-expanded` wiring | Declarative button invocation (`command="show-modal"`, `close`, `toggle-popover`) with native semantics and less JS | Feature-check or progressively enhance on older browsers lacking Invoker Commands |
| `inert` attribute | Manual `tabindex="-1"` loops + `aria-hidden="true"` on siblings | Atomically removes subtree from tab order, pointer hit-testing, and accessibility tree | Never set `inert` on an ancestor of the active modal/focus target |
| Exclusive `<details name="group">` | Custom JS accordion (`aria-expanded`, `aria-controls`) | Native disclosure semantics, keyboard toggle, and single-open group coordination via shared `name` | Use CSS `::details-content` + `interpolate-size` for optional smooth transitions; keep headings semantic |
| Customizable `<select>` (`appearance: base-select`) | Custom `role="listbox"` / `combobox` replacements for styled selects | Keeps native keyboard navigation, typeahead, form submission, mobile pickers, and screen-reader announcements while allowing custom option markup | Treat as progressive enhancement; native `<select>` remains fully operable where unsupported |

## Core matrix

| Pattern | Required behavior highlights | Common failure |
|---|---|---|
| button/link | correct native element; activation keys/platform equivalents; disabled state meaningful | `div` with click handler; link used for action or button used for navigation |
| dialog/modal | labelled; focus moves inside deliberately; tab cycles or platform-equivalent containment; escape/close behavior; focus restored on close | background still reachable; focus lost to body; close button unnamed; nested modal confusion |
| non-modal dialog/popover | discoverable trigger relationship; does not steal focus unexpectedly; dismiss behavior and collision/overflow handling | autoclose loses input; focus jumps without cause; screen-reader order unrelated |
| menu/menubar | roving tabindex or platform equivalent; arrow/home/end keys; typeahead where specified; escape returns focus | menu items only clickable; focus/activation order mismatched; hidden menu remains focusable |
| tabs | tab list semantics; selected state; declared manual or automatic activation; panel association. Automatic: arrows move focus and select. Manual: arrows move focus only; Enter/Space activates. | behavior inconsistent with the declared activation mode; visual active class only; hidden panels readable |
| accordion/disclosure | button controls region; expanded state; keyboard activation; content order logical | heading and button compete; no state exposure; hidden content focusable |
| combobox/autocomplete | input labelled; popup relationship; expanded state; active descendant or real focus model; arrow/enter/escape behavior; async/empty/error status | selecting on every keystroke; no result count/status; focus trapped; paste/IME broken |
| listbox/select | orientation-aware arrow behavior; selection state; typeahead where appropriate; multi-select semantics | active option visual only; selection committed without confirmation contrary to platform norm |
| grid/table interactive | grid semantics only when cell-level interaction requires it; row/column navigation; selection; editable cell behavior; escape/revert | semantic table converted unnecessarily; keyboard model undocumented; focus disappears on sort/filter |
| tooltip | supplementary nonessential content; trigger focus/hover behavior; escape dismissal; no interactive content unless pattern differs | essential error/help only in tooltip; tooltip appears but is not exposed/dismissible |
| alert/status/live region | correct urgency; concise text; no focus theft; repeated updates controlled | every validation keystroke announced; decorative loading noise; duplicate announcements |
| carousel | slide controls named; rotation pausable; focus/reading order coherent; reduced-motion behavior | auto-advance steals context; hidden slides focusable; dots have no labels |
| tree view | hierarchical roles/states; arrow/expand/collapse/typeahead behavior; selection vs expansion distinct | chevron only mouse; nested levels flatten visually for assistive tech |
| drag/drop | drag state plus keyboard/single-pointer alternative; drop target descriptors; cancel behavior | dragging is sole path; target size/precision too demanding; no announcement of result |

## Real-world screen reader, live-region, and semantic traps

Automated accessibility scanners routinely report `0` issues on interfaces that are completely silent, garbled, or broken in real screen readers. Apply these rules across platforms (HTML/DOM examples below are web translations; use native equivalents such as `UIAccessibility.post` on iOS or live-region / announcement semantics on Android):

### Live regions & `document.ariaNotify()` (web progressive enhancement)

- **Pre-mount live regions before text changes:** live regions (`role="status"` / `aria-live="polite"` on web; persistent announcement nodes in cross-platform UI trees) **MUST already be mounted in the DOM/tree *before* message text is injected or updated**. Conditionally mounting container + message together (e.g., `{count && <div role="status">{count} results</div>}`) stays completely silent in screen readers while automated scanners report `0` issues.
- **Hide visually with clip-based `sr-only`, never `display: none` or `hidden`:** hiding a live region with `display: none`, `visibility: hidden`, or the HTML `hidden` attribute removes it from the accessibility tree so updates are never announced.
- **Never combine `aria-live` with `role="alert"` (web):** `role="alert"` already implies `aria-live="assertive"` and `aria-atomic="true"`; adding an explicit `aria-live` attribute alongside `role="alert"` causes double-speaking in iOS VoiceOver.
- **Progressively enhance with `document.ariaNotify()` (Baseline 2026, web):** on web runtimes supporting `document.ariaNotify(message, { priority })`, prefer it for imperative status announcements to avoid DOM-mutation timing bugs, while keeping a pre-mounted live-region fallback for older browsers and assistive technologies:

```js
// Web progressive enhancement: ariaNotify (Baseline 2026) + pre-mounted live-region fallback
function announceStatus(message, { priority = 'normal', fallbackRegion } = {}) {
  if (typeof document.ariaNotify === 'function') {
    document.ariaNotify(message, { priority });
    return;
  }
  if (!fallbackRegion) return;
  fallbackRegion.textContent = '';
  requestAnimationFrame(() => { fallbackRegion.textContent = message; });
}
```

### Focus vs. Announce decision table

| Dynamic interaction | Focus behavior | Announcement / status behavior | Never do |
|---|---|---|---|
| **Filter-as-you-type** | Keep focus inside the filter input | Tell users upfront (`"Results filter as you type"`) and announce a debounced count (`"12 results"`) via a pre-mounted polite status region or `ariaNotify` | Never put `aria-live` on the entire results list (causes noisy re-reading on every keystroke) |
| **Explicit Search submit** | Move focus deliberately to the results heading (`tabindex="-1"` on web or platform focus target) that states the result count (`"18 results for 'invoices'"`) | Focused heading announces context and count cleanly | Never leave focus stranded on the submit button with silent below-fold updates |
| **`"Load more"` button** (especially final page when button disappears) | Move focus to the **first newly loaded item** (or appended batch heading) *before* removing the `"Load more"` button | Announce loaded count (`"Loaded 10 more items, 30 of 30 shown"`) | Never remove the focused `"Load more"` button before relocating focus |
| **Deleting a list / table item** | Move focus deterministically to the **next item**, **previous item** (if deleting the last row), or **list heading / empty-state action** (if deleting the final item) | Announce deletion (`"Deleted 'Q3 Draft'"` + undo cue if reversible) | Never let focus drop to `<body>` or reset to top of screen |

### Split-text animation & semantic HTML traps

- **Split-text animation screen-reader guard:** animated headlines split into per-word or per-character `<span>`s (web) or separate animated text runs (native) cause screen readers to spell or pause awkwardly across every fragment. Mark the split visual spans `aria-hidden="true"` (web) / exclude from accessibility tree (native) and render **one intact `sr-only` / accessible text node** with the complete string inside the heading.
- **Semantic HTML traps (web translations):**
  - Always use real `<a href="...">` for navigation links and real `<img>` (with meaningful or empty `alt=""`) for images—never click-handled `<div>`/`<span>` links or CSS `background-image` for meaningful visual content.
  - Never add `role="grid"` to a data `<table>` solely to make rows clickable—`role="grid"` forces 2D spreadsheet arrow-key interaction and breaks standard table reading; instead place a real link/button inside the primary cell (or use a stretched-link pattern).
  - Never wrap `<figure>` inside `<a>` (breaks phrasing/grouping semantics across browsers and screen readers); place the link on the title, image, or inside `<figcaption>`.
  - Watch CSS `display: flex`, `display: grid`, or `display: contents` on `<table>`, `<tr>`, `<td>`, `<th>`, or lists (`<ul>`/`<ol>`), which strips native table/list semantics in Safari/WebKit's accessibility tree; preserve native table `display` values or verify WebKit AX roles explicitly.

## Implementation checklist

For each composite widget:

1. Write the interaction contract before coding: keys/input methods, focus model, selection/activation model, escape/cancel behavior, async behavior, empty/error states.
2. Use the platform-native equivalent if it exists and can meet the requirement.
3. Assign name/role/value/state through the platform accessibility API; do not use ARIA roles that conflict with native semantics.
4. Keep DOM/tree order aligned with visual and interaction order unless deviation is deliberate and announced.
5. Implement keyboard/controller behavior before visual polish.
6. Manage focus deterministically: opening, closing, deleting the focused node, validation failure, async refresh, and route transition.
7. Expose state changes and status messages without stealing focus.
8. Test with keyboard only and at least one real screen-reader/platform pairing when available; otherwise label manual behavior `not-checked`.
9. Test text scaling, RTL, high contrast/forced colors, reduced motion, and touch/target behavior.
10. Document exceptions and platform deviations; do not copy web key bindings blindly into native, terminal, game, or spatial surfaces.

## Red flags requiring redesign

- ARIA is being used to repair an element that should have been native.
- Keyboard behavior exists but focus is invisible or clipped.
- The component works only when visual layout matches exactly.
- Async loading leaves focus on a removed element.
- Screen-reader announcements are noisy enough that users cannot complete the form.
- Keyboard and pointer selection models diverge without intentional design.
- Hidden content remains interactive or visible content is missing from the accessibility tree.

## Verification evidence

Report pattern verification by task, not component presence: “Completed date selection using keyboard only in dialog; focus returned to trigger” is evidence. “Added `role=dialog`” is implementation detail and proves nothing by itself.
