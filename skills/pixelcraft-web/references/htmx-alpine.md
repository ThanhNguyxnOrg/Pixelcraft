# htmx + Alpine.js

## Token mapping

Import generated CSS variables in the base template. Because htmx swaps server-generated fragments, semantic CSS must apply consistently to both full pages and partial responses. Alpine state should reference semantic classes rather than embedding ad hoc hex/style values.

## Layout and responsive idioms

Server-driven hypermedia is a feature: design coherent full pages first, then partial enhancement. Use CSS for layout. htmx targets/swaps must preserve shell structure, scroll behavior, focus, headings, and meaningful URLs where appropriate. Alpine belongs to local interaction state, not application architecture by accident.

## Typography/custom fonts

Load fonts once in the base template. Partial responses inherit them; do not inject duplicate font/link tags through fragments. Maintain reading measure in server templates regardless of enhancement.

## Motion/reduced motion

Use CSS transitions/classes for swap/settle states. htmx transition behavior and Alpine `x-transition` must respect `prefers-reduced-motion`. Avoid animating replacement in a way that hides content reordering or focus jumps.

## Accessibility specifics

Fragments must contain valid, complete semantics in context: labels, headings, buttons/links, live regions where needed. Manage focus after `hx-swap`, especially when replacing the triggering element. Use `hx-boost`/links/forms to preserve baseline navigation. Alpine `x-cloak` avoids flash-of-uninitialized behavior but must not hide content permanently if JS fails.

## States idiom

Use htmx indicator classes/request lifecycle to expose pending state; return real error/status fragments from the server. Include empty/no-result/partial/error states in fragment templates. Preserve input on validation failure. Out-of-band swaps need clear ownership and no duplicated IDs.

## Forms idiom

Native form semantics are the baseline. `hx-post`/`hx-put` enhance rather than replace valid action/method behavior where feasible. Correct labels/autocomplete/inputmode remain server template responsibilities. Validation timing belongs server-side plus careful local hints; don't validate every keystroke.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<a href="/invoices" hx-boost>Invoices</a>` | `<span hx-get="/invoices">Invoices</span>` pretending to be navigation |
| render validation fragment with preserved values | returning only `422` with a generic toast |
| explicit `hx-target`/`hx-swap` ownership | replacing large page regions because targeting was never designed |
| visible `htmx-indicator` plus duplicate-submit protection | silent background mutation with no pending state |
| stable ID ownership across full/partial render | duplicated IDs after fragment insertion |

## Known traps

Invalid nested/interleaved HTML after swaps, focus disappearing with replaced trigger, duplicated IDs/live regions, hidden state divergence between URL and DOM, overuse of polling, Alpine x-data scope confusion, CSP/inline-script restrictions, no-JS baseline accidentally broken.

## Verification commands

```sh
# use the owning server framework's test command
npm run test -- --run 2>/dev/null || true
npx playwright test
```

Test both no-JS/full-page behavior and enhanced fragment behavior; they are separate evidence.
