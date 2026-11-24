# Angular

## Token mapping

Import generated CSS variables in the global stylesheet configured in `angular.json` (`styles` array) or via SCSS `@use`—never legacy SCSS `@import`—and expose semantic roles through design-system components rather than copying values into component decorators:

```scss
// styles.scss
@use './tokens';
```

(Plain CSS files can still use standard CSS `@import './tokens.css';`.) Angular component encapsulation is useful for state variants, not a substitute for global semantic token ownership.

## Layout and responsive idioms

Use route-level layouts/components plus CSS grid/flex/container queries. Angular CDK layout utilities can help but should not hide simple CSS. Standalone components are the default in Angular 19+; avoid deep wrapper hierarchies that exist only for styling.

## Typography/custom fonts

Load fonts globally with preload/fallback policy. Use typographic classes/component roles rather than inline repeated typography. Verify text scaling because enterprise density often encourages fixed-height clipping.

## Motion/reduced motion

Do not add new dependencies on the deprecated `@angular/animations` DSL. Use native CSS transitions/animations (with `@starting-style` where supported) paired with Angular 20.2+ **`animate.enter`** and **`animate.leave`** bindings to animate mounting/unmounting nodes cleanly while letting CSS `@media (prefers-reduced-motion: no-preference)` govern motion:

```html
@if (panelOpen()) {
  <aside class="drawer" animate.enter="drawer-enter" animate.leave="drawer-leave">
    ...
  </aside>
}
```

Keep animations interruptible and honor `prefers-reduced-motion` in both CSS and any imperative Web Animations API calls.

## Accessibility specifics

Prefer native HTML controls or Angular CDK/Material components with correct configuration. CDK a11y tools (`FocusTrap`, `LiveAnnouncer`, `FocusKeyManager`) must be wired and tested; importing them is not evidence. Route focus/heading management is application responsibility. Reactive forms still require visible persistent labels and accessible error association.

## States idiom

Model async state explicitly with signals and resources: loading, refreshing, loaded-empty, loaded-partial, error, offline/stale, mutation pending, rollback. Do not unwrap async values into blank undefined states. HTTP interceptors must not swallow user-facing error context.

## Forms idiom

Reactive forms provide validation timing/control state (`touched`, `dirty`, `invalid`, async pending) while UX copy/recovery still must be designed. Use correct native input attributes (`autocomplete`, `inputmode`), preserve form model/input after submit failure, and expose a validation summary for complex flows.

## Angular 19–21 Signals, Zoneless, Resources, and Hydration idioms

- **Signals & two-way binding**: prefer `signal()`, `computed()`, `linkedSignal()` (writable derived state that resets when its source changes), `input()`, `output()`, and **`model()`** (for two-way `[(value)]` signal bindings) over manual RxJS `BehaviorSubject` boilerplate for synchronous UI state.
- **Async resources**: use **`httpResource()`** (reactive signal-backed `HttpClient` GET requests with `.value()`, `.isLoading()`, `.error()`, `.reload()` and automatic cancellation on param change) and **`rxResource()`** (when bridging existing RxJS streams) rather than manual `subscribe()` effects.
- **NgRx SignalStore (`@ngrx/signals`)**: for multi-feature shared state, prefer `signalStore(withState(...), withComputed(...), withMethods(...))` over heavy action/reducer boilerplate unless strict event-sourced DevTools auditing is required.
- **Control flow, `@let`, and Incremental Hydration**: use `@if`, `@for (item of items(); track item.id)`, `@switch`, template-local **`@let total = subtotal() + tax();`**, and **`@defer (on viewport; hydrate on interaction)`** (with `withIncrementalHydration()` in `provideClientHydration(...)`) so non-critical islands stay SSR HTML until needed.
- **Zoneless change detection**: enable `provideZonelessChangeDetection()` in `bootstrapApplication` for new apps (default in Angular 21+); never mutate plain non-signal fields and expect templates to update.

```ts
import { Component, httpResource, model, signal } from '@angular/core';

@Component({
  selector: 'app-invoice-list',
  template: `
    @let res = invoices;
    @if (res.isLoading()) {
      <p role="status" aria-busy="true">Loading invoices…</p>
    } @else if (res.error()) {
      <p role="alert">Could not load invoices. <button type="button" (click)="res.reload()">Retry</button></p>
    } @else {
      @for (inv of res.value() ?? []; track inv.id) {
        <a [routerLink]="['/invoice', inv.id]">{{ inv.number }}</a>
      } @empty {
        <p>No invoices match "{{ query() }}".</p>
      }
    }
  `,
})
export class InvoiceListComponent {
  readonly query = model('');
  readonly invoices = httpResource<Invoice[]>(() => `/api/invoices?q=${encodeURIComponent(this.query())}`);
}
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `<a [routerLink]="['/invoice', id]">View invoice</a>` | `<div (click)="router.navigate(['/invoice', id])">View invoice</div>` |
| CSS transitions + `animate.enter` / `animate.leave` gated by `prefers-reduced-motion` | Introducing deprecated `@angular/animations` triggers in new components |
| `@use './tokens';` in SCSS and semantic CSS custom properties | Legacy SCSS `@import` or copying hex constants into component styles |
| `httpResource` / `rxResource` + `@for (...; track item.id)` + `@empty` | Manual `subscribe()` in `ngOnInit` without teardown or missing empty/error branches |
| `@defer (on viewport; hydrate on interaction)` for heavy secondary widgets | Eagerly hydrating every below-the-fold chart/widget on initial load |
| Validation after blur/submit using control state (`touched`) | Marking untouched fields red on initial render |

## Known traps

Mutating plain properties under zoneless change detection, introducing deprecated `@angular/animations` or Karma in new Angular 20/21 apps, subscription leaks, missing `track` keys in `@for`, focus traps that never release, enterprise fixed-density clipping, Angular Material defaults mistaken for project direction.

## Verification commands

Use the project's configured test runner (Vitest via `@angular/build:unit-test` in Angular 20/21+; check `angular.json` before assuming Karma):

```sh
npm run lint
npx ng test --watch=false
npm run build
npx playwright test
```

Use browser/device inspection for actual rendering and interaction evidence (`rendered`); unit tests and builds are `static` or DOM-harness evidence.
