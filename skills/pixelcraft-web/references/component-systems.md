# Component systems and UI libraries

Choose a component system by **code ownership, visual distinctiveness, accessibility burden, and framework fit**—never by popularity alone. Do not install two competing component libraries in the same application surface.

## Three architectural models

| Model | Examples | Customization & brand control | Accessibility ownership | Upgrade & maintenance cost | Best fit |
|---|---|---|---|---|---|
| **Headless primitives** | **Base UI** (`@base-ui/react`), **Radix UI** (`radix-ui`), React Aria Components, Ark UI, Kobalte, Corvu, Reka UI, Bits UI, Headless UI, Ariakit | Full (zero opinionated CSS) | Library handles WAI-ARIA, keyboard, focus, roving tabindex | Low API churn; you own all styling | Custom design systems, distinctive brand products |
| **Source-first (copy-own)** | `shadcn/ui` (Radix or Base UI), `shadcn-svelte`, `shadcn-vue`, **Park UI** (Ark UI + Panda/Tailwind) | Full (source lives in your repo) | Delegated to underlying headless primitives (Base UI / Radix / Ark / Bits / Reka) | Manual diffing for upstream updates; zero version lock-in | Teams wanting fast velocity + full code ownership |
| **Styled & enterprise suites** | MUI, Ant Design, Mantine, Chakra UI v3, **Nuxt UI v3/v4**, HeroUI, Fluent UI, **React Spectrum S2**, Carbon, Vuetify, PrimeVue, Angular Material | Medium (theme tokens/overrides; fighting defaults is expensive) | Built-in per vendor spec | Package upgrades; larger baseline bundle | Internal tools, enterprise suites, ecosystems matching that design language |

## Headless primitives comparison

| Library | Maintainer / Core | DOM composition idiom | Frameworks | Standout strength |
|---|---|---|---|---|
| **Base UI (`@base-ui/react`)** | MUI team (incl. Radix & Floating UI authors) | Explicit `render` prop (nestable) + `Positioner` CSS vars (`--anchor-width`, `--available-height`) | React | Predictable `render` API without fragile `asChild` ref-merging; strong RTL & active v1+ maintenance (renamed from `@base-ui-components/react`) |
| **Radix UI (`radix-ui`)** | WorkOS | `asChild` (`Slot`) prop merging | React | Mature, widely deployed; unified `radix-ui` package replaces dozens of separate `@radix-ui/react-*` installs |
| **React Aria Components** | Adobe | Render props + `data-*` states (`data-entering`/`data-exiting`) + `--trigger-width` | React | Gold-standard WAI-ARIA, i18n, date/number/RTL, and screen-reader testing; underpins **React Spectrum S2** (`@react-spectrum/s2`) |
| **Ark UI** | Chakra team (Zag.js state machines) | `asChild` + `RootProvider` (`lazyMount`/`unmountOnExit`) | React, Vue, Solid, Svelte | Single state-machine mental model across 4 major frameworks; powers **Park UI** |
| **Kobalte & Corvu** | Solid OSS | Fine-grained Solid signals + `as` polymorphic prop (`Kobalte`) / specialized drawers & popovers (`Corvu`) | Solid | Idiomatic zero-VDOM accessible primitives built directly for Solid/SolidStart |
| **Headless UI** | Tailwind Labs | Render props + `data-*` state attributes | React, Vue | Minimal API surface for common disclosure/dialog/menu/combobox patterns |
| **Ariakit** | OSS | Polymorphic `render` prop | React | Low-level composability for complex composite widgets (menubars, grids, nested menus) |

```tsx
// Base UI (@base-ui/react): explicit `render` prop avoids hidden ref/event merging surprises
import { Menu } from '@base-ui/react/menu';

<Menu.Trigger render={<button type="button" className="btn-trigger" />}>
  Actions
</Menu.Trigger>

// Radix UI (unified `radix-ui` package): `asChild` merges props/refs onto a single ref-accepting child
import { Dialog } from 'radix-ui';

<Dialog.Trigger asChild>
  <button type="button" className="btn-trigger">Open</button>
</Dialog.Trigger>
```

## Positioning: Floating UI vs native browser primitives

- Prefer **native HTML primitives** when target browser support allows: `[popover]` + CSS Anchor Positioning (`anchor-name`, `position-anchor`, `position-try-fallbacks`, plus `margin: 0` reset) for top-layer tooltips/menus, **Invoker Commands** (`<button commandfor="id" command="toggle-popover">`) for zero-JS declarative triggers, and **Customizable `<select>`** (`@supports (appearance: base-select)` + `::picker(select)`) for styled dropdowns that keep native keyboard, form, and accessibility semantics.
- Use **Floating UI** (`@floating-ui/dom` for positioning only, or `@floating-ui/react` which adds `useClick`, `useDismiss`, `useRole`, `useInteractions`, and `FloatingFocusManager`) when you need virtual reference elements (cursor-following tooltips, text-selection popovers), custom collision boundaries, or legacy browser parity.
- **Critical `autoUpdate` lifecycle rule**: pass `whileElementsMounted: autoUpdate` to `useFloating()` **only** when the floating element is conditionally mounted/unmounted; if hidden via CSS (`display: none`), call `autoUpdate` inside an effect keyed on `isOpen` and return its cleanup function to avoid leaking scroll/resize listeners.

## Ecosystem map by framework

| Framework | Headless / Source-first | Styled / Enterprise suites |
|---|---|---|
| **React** | **Base UI (`@base-ui/react`)**, **Radix UI (`radix-ui`)**, React Aria, Ark UI, Ariakit, **`shadcn/ui`** (supports both Radix & Base UI), **Park UI** | MUI, Ant Design, Mantine, Chakra UI v3, HeroUI; Enterprise: Fluent UI, **React Spectrum S2 (`@react-spectrum/s2`)**, IBM Carbon |
| **Vue / Nuxt** | Reka UI (successor to Radix Vue), Ark UI, Headless UI, `shadcn-vue`, **Park UI** | **Nuxt UI v3/v4** (Reka UI + Tailwind Variants), Vuetify, PrimeVue, Quasar, Element Plus, Naive UI |
| **Solid** | **Kobalte**, **Corvu**, **Ark UI**, **Park UI** | Solid UI / Kobalte-based design-system kits |
| **Svelte** | Bits UI, Melt UI, Ark UI, `shadcn-svelte` | Skeleton |
| **Angular** | Angular CDK (`@angular/cdk`), Spartan | Angular Material, PrimeNG, NG-ZORRO |

Verify current major versions and framework compatibility (e.g., React 19 ref-as-prop, Svelte 5 runes, Tailwind v4) against official docs before adopting.

## Component contract rules

- **Controlled and uncontrolled parity**: support both `value` + `onValueChange` (controlled) and `defaultValue` (uncontrolled) on reusable inputs/tabs/dialogs; never switch between modes mid-lifecycle.
- **Compound components over prop explosion**: expose composable parts (`Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Close`) instead of 30 boolean/config props on one monolith.
- **Portal, inert, and focus restoration**: overlays rendered in portals must trap/scope focus while modal, mark background inert, close on `Escape`, and restore focus to the exact trigger on close.
- **Deterministic SSR IDs**: generate `aria-controls` / `aria-labelledby` IDs with framework primitives (`useId()`, `$props.id()`, `createUniqueId()`), never `Math.random()` or module-level counters that cause hydration mismatches.
- **Token boundary**: map design tokens into the library's theme/CSS-variable layer rather than writing `!important` overrides against vendor class names.

## Do/don't pairs

| Do | Don't |
|---|---|
| Wrap headless or styled primitives behind thin project-owned semantic wrappers (`Button`, `Dialog`) | Import raw third-party component internals in 100 feature files with ad-hoc overrides |
| Use current package names (`@base-ui/react`, unified `radix-ui`, `reka-ui`, `@react-spectrum/s2`) | Install deprecated `@base-ui-components/react`, `radix-vue`, or 20 mismatched `@radix-ui/react-*` versions |
| Pick one model (e.g., Base UI / Kobalte / Reka UI + semantic tokens) consistently per app | Mix MUI, Ant Design, and Radix portals on the same route (conflicting z-index/focus/CSS resets) |
| Keep semantic `<button>` / `<a>` elements when using `asChild` or `render` | Pass a non-interactive `<div>` into a trigger without keyboard/role semantics |
| Strip unused library theme layers and tree-shake icons/components | Ship a full enterprise suite CSS bundle just for one date picker |
