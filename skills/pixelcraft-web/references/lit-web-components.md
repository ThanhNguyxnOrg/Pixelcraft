# Lit / Web Components

## Token mapping

Import generated CSS variables globally and consume them inside shadow DOM:

```css
:host { color: var(--semantic-color-foreground); }
button { background: var(--semantic-color-action); }
```

CSS custom properties pierce shadow boundaries; raw global selectors do not. Use `::part()` deliberately for documented customization rather than leaking internals.

## Layout and responsive idioms

Treat components as interoperable leaf/regional primitives. The page owns broad layout; components own internal structure. Use shadow DOM slots intentionally for composition and document slot expectations. Container queries are useful where supported; otherwise expose size/density variants explicitly.

## Typography/custom fonts

Fonts may inherit into shadow DOM but font loading remains document responsibility. Define typography through inherited/custom properties and do not hard-code one app's font inside reusable components. Document required CSS variables/parts.

## Motion/reduced motion

Keep animation local and purpose-driven. Read `matchMedia` inside the component or inherit a semantic reduced-motion flag; never force consumers into motion they cannot control. Cleanup event listeners/timers/observers in `disconnectedCallback`.

## Accessibility specifics

Shadow DOM does not automatically connect labels/IDs across boundaries. Use native elements inside shadow DOM, delegate focus where appropriate (`delegatesFocus` only with care), expose states/roles/ARIA deliberately, and test accessibility tree/focus order in real browsers. Form-associated custom elements require ElementInternals/form participation when acting as inputs.

## States idiom

Reflect meaningful public state through attributes/properties only when styling/interop requires it. Render loading/empty/error/disabled/invalid internally with stable layout and expose events rather than expecting parents to inspect internals. Preserve user input internally and externally across failed submission.

## Forms idiom

Native form controls inside shadow DOM do not automatically participate exactly like normal page inputs in every scenario. Use form-associated custom element APIs where needed, implement validation/value/reset/disabled semantics, and document constraints. Never let shadow boundary hide missing labels.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<button part="button">` or documented parts for customization | forcing consumers to reach into shadow internals |
| semantic custom property fallback `var(--pc-action, var(--semantic-color-action))` | hard-coding app-specific hex inside reusable component |
| `disconnectedCallback() { this.observer?.disconnect(); }` | leaking observers/listeners after removal |
| dispatch clear typed events such as `pc-change` | mutating parent/global state as hidden coupling |
| native `<input>`/ElementInternals when form behavior matters | div-based fake input with decorative shadow styling |

## Known traps

ARIA/label boundary issues, focus delegation confusion, duplicate IDs across shadow/light DOM, style encapsulation mistaken for token architecture, CSS part API sprawl, form participation gaps, SSR/declarative shadow DOM support differences, event composition/retargeting surprises.

## Verification commands

```sh
npm run test -- --run
npm run build
npx playwright test
npx web-test-runner 2>/dev/null || true
```

Test in real browsers because shadow DOM behavior and accessibility trees differ from shallow unit rendering.
