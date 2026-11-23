# Qwik

## Token mapping

Import generated CSS variables in global/root styling and consume semantic variables in component CSS. Qwik's resumability favors small serialized state; keep token names static rather than generating dynamic unbounded style objects per interaction.

## Layout and responsive idioms

Use standard HTML/CSS first. Qwik components should remain small and lazily resumable; visual composition does not require hydration. Route layouts in Qwik City own persistent shell structure. Avoid putting large nonserializable objects into component state/props.

## Typography/custom fonts

Load fonts in document head/root layout with subset/fallback policy. Resumable HTML means typography can render before JS; preserve that advantage rather than delaying text behind client bootstrap.

## Motion/reduced motion

Use CSS where possible. Event handlers are lazy-loaded in Qwik, so motion tied to interaction can remain local through `$`/`useVisibleTask$` patterns. Honor `prefers-reduced-motion`; do not use visible-task initialization for content that can be static.

## Accessibility specifics

Resumability is not accessibility by itself. Initial HTML needs correct semantics, labels, landmarks, and focus order. Manage focus after lazy interaction, route transition, deletion, and dialog close. Anchor/button distinction remains mandatory.

## States idiom

Use `routeLoader$`, `routeAction$`, server state, resource tracking, and explicit pending/error/empty branches. Because Qwik serializes state into HTML, avoid secrets/nonserializable values and preserve input/error state across action failure.

## Forms idiom

Qwik City actions can progressively enhance forms. Use native labels/types/autocomplete/inputmode and return field errors without discarding values. Avoid converting every input into eager client-controlled state when native form semantics suffice.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<Link href="/invoice/42">View invoice</Link>` | click-only div calling navigation |
| local lazy handler `onClick$` for the control that needs it | eager global hydration mental model copied from SPA frameworks |
| serializable action state/error shape | storing class instances/functions/secrets in UI state |
| stable static layout before interaction | blank shell waiting for lazy behavior that content does not need |
| `useVisibleTask$` only for browser-visible side effects | running browser-only assumptions during SSR |

## Known traps

Serialization boundary violations, overuse of visible tasks, accidentally losing resumability benefits through broad client state, lazy focus management gaps, stale route data, confusing optimizer errors, CSS duplication across lazy chunks.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Inspect initial HTML before JS as well as post-interaction browser state; both are distinct evidence.
