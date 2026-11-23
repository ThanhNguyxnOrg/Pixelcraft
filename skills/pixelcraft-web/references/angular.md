# Angular

## Token mapping

Import generated CSS variables in global styles and expose semantic roles through design-system components rather than copying values into decorators:

```scss
@import './tokens.css';
```

Angular component encapsulation is useful for state variants, not a substitute for global semantic token ownership.

## Layout and responsive idioms

Use route-level layouts/components plus CSS grid/flex/container queries. Angular CDK layout utilities can help but should not hide simple CSS. Standalone components/imports make ownership explicit; avoid deep wrapper hierarchies that exist only for styling.

## Typography/custom fonts

Load fonts globally with preload/fallback policy. Use typographic classes/component roles rather than inline repeated typography. Verify text scaling because enterprise density often encourages fixed-height clipping.

## Motion/reduced motion

Angular animations (`@angular/animations`) should encode meaningful state transitions. Use the platform/browser reduction signal through CSS media queries or runtime service reading `matchMedia`; do not build motion assuming every user sees it. Keep animations interruptible.

## Accessibility specifics

Prefer native HTML controls or Angular CDK/Material components with correct configuration. CDK a11y tools (focus trap, live announcer, list key manager, a11y module) must be wired correctly; importing them is not evidence. Route focus/heading management is application responsibility. Reactive forms still require visible persistent labels and accessible error association.

## States idiom

Model async state explicitly with signals/observables: loading, refreshing, loaded-empty, loaded-partial, error, offline/stale, mutation pending, rollback. Do not unwrap async values into blank undefined states. HTTP interceptors must not swallow user-facing error context.

## Forms idiom

Reactive forms provide validation timing/control state (`touched`, `dirty`, `invalid`, async pending) but UX copy/recovery still must be designed. Use correct native input attributes/autocomplete/inputmode. Preserve form model/input after submit failure and expose validation summary for complex flows.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<a [routerLink]="['/invoice', id]">View invoice</a>` | `<div (click)="router.navigate(['/invoice', id])">View invoice</div>` |
| `cdkFocusInitial`/explicit focus strategy in dialog | autofocusing the first field regardless of task/safety |
| semantic token-backed component variants | copying hex constants into each component stylesheet |
| validation after blur/submit using control state | marking untouched fields red on initial render |
| typed error state rendered adjacent to control | toast-only validation feedback that disappears before correction |

## Known traps

Change-detection misunderstanding, subscription leaks, stale async state, zoneless/signal migration confusion, deep provider hierarchy hiding ownership, focus traps that never release, enterprise fixed-density clipping, Angular Material defaults mistaken for project direction.

## Verification commands

```sh
npm run lint
npm run test -- --watch=false
npm run build
npx playwright test
npx ng test --watch=false 2>/dev/null || true
```

Use browser/device inspection for actual rendering and interaction evidence.
