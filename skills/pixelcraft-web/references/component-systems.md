# Component systems and UI libraries

Choose a component system by **code ownership, visual distinctiveness, accessibility burden, and framework fit**—never by popularity alone. Do not install two competing component libraries in the same application surface.

## Three architectural models

| Model | Examples | Customization & brand control | Accessibility ownership | Upgrade & maintenance cost | Best fit |
|---|---|---|---|---|---|
| **Headless primitives** | Base UI, Radix UI, React Aria Components, Ark UI, Headless UI, Ariakit | Full (zero opinionated CSS) | Library handles WAI-ARIA, keyboard, focus, roving tabindex | Low API churn; you own all styling | Custom design systems, distinctive brand products |
| **Source-first (copy-own)** | shadcn/ui, shadcn-svelte, shadcn-vue | Full (source lives in your repo) | Delegated to underlying headless primitives (Base UI / Radix / Bits UI) | Manual diffing for upstream updates; zero version lock-in | Teams wanting fast velocity + full code ownership |
| **Styled & enterprise suites** | MUI, Ant Design, Mantine, Chakra UI, HeroUI, Fluent UI, Spectrum, Carbon, Vuetify, PrimeVue, Angular Material | Medium (theme tokens/overrides; fighting defaults is expensive) | Built-in per vendor spec | Package upgrades; larger baseline bundle | Internal tools, enterprise suites, ecosystems matching that design language |

## Headless primitives comparison

| Library | Maintainer / Core | DOM composition idiom | Frameworks | Standout strength |
|---|---|---|---|---|
| **Base UI** | MUI team (incl. Radix & Floating UI authors) | Explicit `render` prop (nestable) + `Positioner` CSS vars (`--anchor-width`, `--available-height`) | React | Predictable `render` API without fragile `asChild` ref-merging; strong RTL & active v1+ maintenance |
| **Radix UI** | WorkOS | `asChild` (`Slot`) prop merging | React | Mature, widely deployed; powers classic `shadcn/ui` codebases |
| **React Aria Components** | Adobe | Render props + `data-*` states (`data-entering`/`data-exiting`) + `--trigger-width` | React | Gold-standard WAI-ARIA, i18n, date/number/RTL, and screen-reader testing |
| **Ark UI** | Chakra team (Zag.js state machines) | `asChild` + `RootProvider` (`lazyMount`/`unmountOnExit`) | React, Vue, Solid, Svelte | Single state-machine mental model across 4 major frameworks |
| **Headless UI** | Tailwind Labs | Render props + `data-*` state attributes | React, Vue | Minimal API surface for common disclosure/dialog/menu/combobox patterns |
| **Ariakit** | OSS | Polymorphic `render` prop | React | Low-level composability for complex composite widgets (menubars, grids, nested menus) |

```tsx
// Base UI: explicit `render` prop avoids hidden ref/event merging surprises
<Menu.Trigger render={<button type="button" className="btn-trigger" />}>
  Actions
</Menu.Trigger>

// Radix UI: `asChild` merges props/refs onto a single child that forwards refs
<Dialog.Trigger asChild>
  <button type="button" className="btn-trigger">Open</button>
</Dialog.Trigger>
```

## Positioning: Floating UI vs native browser primitives

- Prefer **native HTML primitives** when target browser support allows: `[popover]` + CSS Anchor Positioning (`anchor-name`, `position-anchor`, `position-try-fallbacks`) for top-layer tooltips/menus, **Invoker Commands** (`<button commandfor="id" command="toggle-popover">`) for zero-JS declarative triggers, and **Customizable `<select>`** (`@supports (appearance: base-select)` + `::picker(select)`) for styled dropdowns that keep native keyboard, form, and accessibility semantics.
- Use **Floating UI** (`@floating-ui/dom` for positioning only, or `@floating-ui/react` which adds `useClick`, `useDismiss`, `useRole`, `useInteractions`, and `FloatingFocusManager`) when you need virtual reference elements (cursor-following tooltips, text-selection popovers), custom collision boundaries, or legacy browser parity.
- **Critical `autoUpdate` lifecycle rule**: pass `whileElementsMounted: autoUpdate` to `useFloating()` **only** when the floating element is conditionally mounted/unmounted; if hidden via CSS (`display: none`), call `autoUpdate` inside an effect keyed on `isOpen` and return its cleanup function to avoid leaking scroll/resize listeners.

## Ecosystem map by framework

| Framework | Headless / Source-first | Styled / Enterprise suites |
|---|---|---|
| **React** | Base UI, Radix UI, React Aria, Ark UI, Ariakit, `shadcn/ui` | MUI, Ant Design, Mantine, Chakra UI v3, HeroUI; Enterprise: Fluent UI, Adobe Spectrum, IBM Carbon |
| **Vue** | Reka UI / Radix Vue, Ark UI, Headless UI, `shadcn-vue` | Vuetify, PrimeVue, Quasar, Element Plus, Naive UI |
| **Angular** | Angular CDK (`@angular/cdk`), Spartan | Angular Material, PrimeNG, NG-ZORRO |
| **Svelte** | Bits UI, Melt UI, `shadcn-svelte` | Skeleton |

Verify current major versions and framework compatibility (e.g., React 19 ref-as-prop, Svelte 5 runes, Tailwind v4) against official docs before adopting.

## Component contract rules

- **Controlled and uncontrolled parity**: support both `value` + `onValueChange` (controlled) and `defaultValue` (uncontrolled) on reusable inputs/tabs/dialogs; never switch between modes mid-lifecycle.
- **Compound components over prop explosion**: expose composable parts (`Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Close`) instead of 30 boolean/config props on one monolith.
- **Portal, inert, and focus restoration**: overlays rendered in portals must trap/scope focus while modal, mark background inert, close on `Escape`, and restore focus to the exact trigger on close.
- **Deterministic SSR IDs**: generate `aria-controls` / `aria-labelledby` IDs with framework primitives (`useId()`), never `Math.random()` or module-level counters that cause hydration mismatches.
- **Token boundary**: map design tokens into the library's theme/CSS-variable layer rather than writing `!important` overrides against vendor class names.

## Do/don't pairs

| Do | Don't |
|---|---|
| Wrap headless or styled primitives behind thin project-owned semantic wrappers (`Button`, `Dialog`) | Import raw third-party component internals in 100 feature files with ad-hoc overrides |
| Pick one model (e.g., Base UI + Tailwind tokens) consistently per app | Mix MUI, Ant Design, and Radix portals on the same route (conflicting z-index/focus/CSS resets) |
| Keep semantic `<button>` / `<a>` elements when using `asChild` or `render` | Pass a non-interactive `<div>` into a trigger without keyboard/role semantics |
| Strip unused library theme layers and tree-shake icons/components | Ship a full enterprise suite CSS bundle just for one date picker |
