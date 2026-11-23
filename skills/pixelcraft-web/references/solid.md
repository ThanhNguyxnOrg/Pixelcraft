# Solid / SolidStart

## Token mapping

Import generated CSS variables once at entry/root and consume semantic roles in CSS or style props:

```ts
import './tokens.css';
```

Fine-grained reactivity does not require fine-grained token duplication. Use typed constants only for names/roles, not copied raw colors.

## Layout and responsive idioms

Use CSS-first layout. `<Show>`, `<For>`, and `<Suspense>` control state rendering; they do not design layout. Solid's lack of VDOM means DOM structure and control flow are explicit—use that predictability rather than hiding conditionality inside broad wrappers.

## Typography/custom fonts

Load fonts in HTML entry/root route with explicit fallback behavior. Keep text as real DOM text; do not replace typography with canvas or SVG except for genuinely graphical content.

## Motion/reduced motion

Use CSS transitions/animations where possible. JS animation should be created inside lifecycle-aware code (`onMount`/`createEffect`) and honor `matchMedia('(prefers-reduced-motion: reduce)')`. Avoid retriggering effects because signals mutate too broadly.

## Accessibility specifics

Use native elements. Solid event/delegation patterns still require keyboard/focus semantics. `<For>` with keyed references preserves DOM identity; incorrect reuse can retain focus/selection in the wrong row. Manage focus when conditional branches mount/unmount controls.

## States idiom

Use resources: `resource.loading`, `resource.error`, `resource.latest`/`()` distinction, refetch/stale behavior, and mutation pending/rollback. Show empty and partial data explicitly. `<Suspense>` fallback should preserve structure rather than blanking a full route.

## Forms idiom

Use native forms where possible. Correct attributes (`for` in Solid is usually `for`/`htmlFor` depending version/plugin—follow project convention and generated DOM) must produce real label association. Server functions/actions need validation error shape and input preservation.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<A href="/invoice/42">View invoice</A>` | click-only `<div>` navigation |
| `<For each={items()}>{item => <Row item={item} />}</For>` with stable identity | index-only logic that reuses DOM/state incorrectly |
| narrow signal ownership near the state | one global mutable store with unclear invalidation |
| `createResource` state rendered explicitly | treating loading/error/empty as one falsey branch |
| cleanup animation/listener in `onCleanup` | assuming component teardown removes browser work automatically |

## Known traps

Signal dependency over-invalidation, destructuring props losing reactivity, DOM identity/focus reuse, SSR hydration mismatch, suspense layout collapse, hidden browser-only initialization, overuse of effects where derived state belongs.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Rendered browser inspection is still required for hierarchy, focus, and motion evidence.
