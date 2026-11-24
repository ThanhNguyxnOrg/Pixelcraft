# Styling and CSS ecosystem

Select the styling layer by runtime model, React Server Components (RSC) compatibility, theming contract, and team ownership—not habit. For Tailwind v4 CSS-first `@theme inline` rules, read [tailwind.md](tailwind.md); for pure native HTML/CSS features (`@layer`, Popover, Anchor Positioning, `@starting-style`, `oklch`), read [html-css.md](html-css.md).

## Architecture decision matrix

| Model | Representative tools | Build-time CSS | RSC-safe | Best fit | Primary trade-off |
|---|---|---|---|---|---|
| Native CSS & Modules | CSS Modules, **Lightning CSS**, PostCSS | Yes | Yes | Any framework, minimal tooling, long-lived apps | Manual token/variant ergonomics unless paired with CVA |
| Preprocessors | Sass/SCSS (`@use`/`@forward`), Less | Yes | Yes | Existing SCSS/Bootstrap/Carbon codebases | Largely superseded by native CSS nesting, custom properties, and `@layer` for greenfield work |
| Utility / Token CSS | Tailwind CSS v4, UnoCSS, Open Props, Bootstrap, Bulma | Yes | Yes | Rapid composition, multi-surface products, server-rendered apps | Requires strict semantic token bridge to avoid utility soup |
| Zero-runtime CSS-in-TS | Panda CSS, vanilla-extract, **Pigment CSS**, Linaria (WyW-in-JS) | Yes | Yes | Type-safe design systems, strict token contracts, RSC apps (Pigment CSS for MUI v6/v7 RSC migrations) | Static-extraction constraints (no arbitrary runtime expressions) |
| Compiled Atomic JS | StyleX (`@stylexjs/stylex`), **Tamagui Web** | Yes | Yes | Meta-scale deterministic atomic CSS (StyleX); shared React Web + React Native UI with optimizing extraction (Tamagui) | Strict compiler/file rules and bundler plugin setup |
| Runtime CSS-in-JS | Emotion, styled-components | No (runtime injection) | No (`'use client'` + registry required) | Legacy React SPAs or MUI v5 / Chakra v2 maintenance | Serialization, hydration, and RSC overhead; avoid for new RSC apps |

Never stack two competing styling paradigms in the same surface (for example, Bootstrap + Tailwind or Emotion + Panda CSS) unless executing an explicit incremental migration behind `@layer`.

## Zero-runtime build-time CSS-in-TS

### Panda CSS

Panda CSS statically analyzes source files at build time and emits atomic CSS. Any value Panda cannot resolve statically produces a class name with **no emitted CSS** (silent failure).

- **Static extraction rule**: never pass runtime variables, dynamic object keys, spreads, or template literals (`red.${shade}`) into `css()`. Both branches of a ternary must be literal token values.
- **Dynamic values**: map runtime choices to precomputed `css()` objects, use `cva`/`sva` recipes, or declare `staticCss` in `defineConfig()` for dynamic recipe variants.
- **Theming**: define semantic tokens with `{ base, _dark }` conditions instead of runtime theme-switching Context.
- **Multi-part components**: use `sva()` and always list `slots` explicitly so typos fail at compile time instead of creating silent extra slots.

```ts
// panda.config.ts (excerpt)
semanticTokens: {
  colors: {
    bg: {
      canvas: { value: { base: '#ffffff', _dark: '#0a0a0a' } },
      subtle: { value: { base: '#f5f5f5', _dark: '#1a1a1a' } },
    },
  },
},
staticCss: {
  recipes: {
    button: [{ size: ['sm', 'md'] }, { variant: ['*'] }],
  },
}
```

```tsx
import { css, sva } from '../styled-system/css';

// Both ternary branches are statically extractable literals
const labelClass = css({ color: isActive ? 'text.default' : 'text.muted' });

// Multi-slot recipe with explicit slots
const card = sva({
  slots: ['root', 'title', 'body'],
  base: {
    root: { rounded: 'lg', borderWidth: '1px', p: '4' },
    title: { fontWeight: 'semibold', mb: '2' },
    body: { color: 'text.muted' },
  },
  variants: {
    size: {
      sm: { root: { p: '3' }, title: { fontSize: 'sm' } },
      md: { root: { p: '4' }, title: { fontSize: 'md' } },
    },
  },
  defaultVariants: { size: 'md' },
});
```

### vanilla-extract

Styles live in `*.css.ts` files compiled to static `.css` bundles with locally scoped class names and CSS variables.

- **Code-split themes**: define a contract with `createThemeContract({ ...null })` and implement separate bundles with `createTheme(vars, values)`.
- **Component variants**: use `@vanilla-extract/recipes` (`recipe` + `RecipeVariants<typeof button>`) for typed variant matrices.
- **Atomic utilities**: use `@vanilla-extract/sprinkles` (`defineProperties` + `createSprinkles`). Always assign each `defineProperties(...)` call to a variable before passing it into `createSprinkles(...)`—inlining breaks TypeScript inference.
- **Runtime dynamic values**: use `assignInlineVars` from `@vanilla-extract/dynamic` to bind runtime props to typed CSS custom properties.

```ts
// theme.css.ts
import { createThemeContract, createTheme, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

export const vars = createThemeContract({
  color: { brand: null, surface: null },
  font: { body: null },
});

export const lightTheme = createTheme(vars, {
  color: { brand: '#0f4c81', surface: '#ffffff' },
  font: { body: 'system-ui, sans-serif' },
});

export const container = style({
  background: vars.color.surface,
  fontFamily: vars.font.body,
  paddingInline: '1rem',
});

export const button = recipe({
  base: { fontFamily: vars.font.body, borderRadius: '6px' },
  variants: {
    tone: {
      brand: { background: vars.color.brand, color: '#ffffff' },
      surface: { background: vars.color.surface, color: vars.color.brand },
    },
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
```

```tsx
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { container, vars } from './theme.css';

<section className={container} style={assignInlineVars(vars, { color: { brand, surface }, font: { body } })} />
```

### Pigment CSS & Linaria (WyW-in-JS)

- **Pigment CSS (`@pigment-css/react`)**: build-time CSS-in-JS (built on WyW-in-JS) designed as an RSC-compatible migration target for Emotion/MUI teams (`styled`, `css`, `variants`, theme CSS variables). Dynamic styles must use `variants` or CSS custom properties rather than arbitrary runtime functions.
- **Linaria (`@linaria/core`, `@linaria/react`, `@wyw-in-js/vite`)**: extracts tagged template literals to static CSS and compiles dynamic prop interpolations into CSS custom properties applied via inline `style`. Any custom component wrapped with `styled(CustomCard)` that uses dynamic interpolations **must accept and forward both `className` and `style`**; dropping `style` silently breaks dynamic variables.

## Atomic CSS compilers

### StyleX (`@stylexjs/stylex`)

StyleX compiles co-located JS style objects into collision-free atomic CSS where last-applied style always wins deterministically.

- **Strict variable file rule**: `stylex.defineVars()` and `stylex.defineConsts()` **must** live in `*.stylex.ts` / `*.stylex.js` files as **named exports only** (no default exports and no other exports in that file). Keys starting with `--` emit unhashed custom property names.
- **Theming & composition**: apply themes created with `stylex.createTheme(vars, overrides)` directly alongside style objects inside `stylex.props(darkTheme, styles.root, isCompact && styles.compact)`.

```ts
// tokens.stylex.ts (named exports only)
import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  text: '#111827',
  surface: '#ffffff',
  '--brand-accent': '#0f4c81',
});
```

```tsx
import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';

const darkTheme = stylex.createTheme(colors, {
  text: '#f9fafb',
  surface: '#0b0f14',
  '--brand-accent': '#60a5fa',
});

const styles = stylex.create({
  card: { backgroundColor: colors.surface, color: colors.text, padding: '16px' },
});

<article {...stylex.props(isDark && darkTheme, styles.card)} />
```

### Tamagui Web (`@tamagui/core` / `tamagui`)

Choose **Tamagui** when sharing styled primitives and design tokens across **React Web and React Native / Expo** (not for web-only projects where Tailwind v4, CSS Modules, or Panda CSS are simpler). Enable the build-time optimizing compiler (`@tamagui/vite-plugin` or `@tamagui/next-plugin`) so static style props flatten into atomic CSS classes and `<div>`/`<span>` tags instead of runtime style objects, and define tokens/themes centrally in `tamagui.config.ts`.

### UnoCSS

UnoCSS is an on-demand atomic CSS engine configured in `uno.config.ts`.

- Use `presetWind4()` for Tailwind v4-compatible utilities, `shortcuts` for repeated semantic patterns, and `@unocss/transformer-directives` when CSS `@apply` / directives are needed.
- Because UnoCSS extracts utilities statically, declare runtime-constructed class names in `safelist` (either static arrays or a `(context) => ...` function reading `context.theme`).

```ts
// uno.config.ts
import { defineConfig, presetWind4, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [presetWind4()],
  transformers: [transformerDirectives()],
  shortcuts: {
    'btn-primary': 'px-4 py-2 rounded-md font-medium bg-action text-on-action',
  },
  safelist: [
    (ctx) => Object.keys(ctx.theme.colors || {}).map((c) => `bg-${c}-500`),
  ],
});
```

## Component variant & recipe APIs

When styling with Tailwind, UnoCSS, or CSS Modules, manage multi-axis component variants with a typed variant builder instead of nested template-string conditionals.

| Tool | Best fit | Built-in `tailwind-merge` | Multi-slot support |
|---|---|---|---|
| CVA (`class-variance-authority` v0.7 / `cva` v1) | Single-element primitives, CSS Modules, Tailwind | Via `defineConfig` (v1) or wrapper `cn()` (v0.7) | No (compose separate `cva` calls) |
| Tailwind Variants (`tailwind-variants`) | Multi-part Tailwind components (cards, modals, inputs) | Yes (`twMerge: true` + `createTV`) | First-class `slots` and `compoundSlots` |

- **CVA conflict resolution**: plain `cva` concatenates class strings without resolving conflicting Tailwind utilities. In `cva` v1 (`cva` package), import `defineConfig` from **`'cva'`** and wire `twMerge` (use `tailwind-merge` v3+ with Tailwind v4); in `class-variance-authority` v0.7, wrap the output in `cn(buttonVariants(...), className)`.

```ts
// cva v1 (cva.config.ts)
import { defineConfig } from 'cva';
import { twMerge } from 'tailwind-merge';

export const { cva, cx: cn } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});
```

```ts
// tailwind-variants with custom token merge config + slots
import { createTV } from 'tailwind-variants';

export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: { spacing: ['gap-grid'] },
    },
  },
});

export const card = tv({
  slots: { base: 'rounded-xl p-4', header: 'font-semibold' },
  variants: { elevated: { true: {}, false: {} } },
  compoundSlots: [{ elevated: true, slots: ['base'], class: 'shadow-lg' }],
});
```

## CSS Modules, Lightning CSS, preprocessors, and token libraries

- **Lightning CSS + CSS Modules**: enable `css: { transformer: 'lightningcss' }` (and `build: { cssMinify: 'lightningcss' }`) in Vite for Rust-native CSS Modules, nesting, modern color/media-query lowering, vendor prefixing, and minification without a heavy PostCSS plugin chain:

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  css: { transformer: 'lightningcss' },
  build: { cssMinify: 'lightningcss' },
});
```

- **Sass / SCSS**: in existing SCSS codebases, use `@use` and `@forward` with explicit namespaces; do not add new legacy `@import` chains (deprecated in Dart Sass). Never use Sass `$variables` for runtime theme switching—emit CSS custom properties instead.
- **Open Props**: import only the packs you use (`@import "open-props/easings";`, `@import "open-props/sizes";`) or wire `postcss-jit-props` so unused custom properties are tree-shaken out of the production stylesheet.
- **Bootstrap / Bulma**: when maintaining apps built on them, override semantic Sass/CSS variables at the theme layer rather than fighting framework specificity with `!important` or layering Tailwind on top.

## Runtime CSS-in-JS (Emotion, styled-components)

- **RSC boundary**: Emotion and styled-components rely on React Context and runtime `<style>` insertion. They cannot execute inside React Server Components without `'use client'` boundaries and an SSR style registry (`useServerInsertedHTML` in Next.js App Router).
- **Decision rule**: keep runtime CSS-in-JS only when extending an existing Emotion/styled-components codebase or a component library that mandates it. For greenfield RSC/SSR apps, choose CSS Modules + Lightning CSS, Tailwind v4, Panda CSS, vanilla-extract, Pigment CSS, or StyleX.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use literal tokens, `cva`/`sva`, or `staticCss` in Panda CSS | Pass `css({ color: \`red.${shade}\` })` or runtime spreads into Panda `css()` |
| Put `stylex.defineVars()` in `*.stylex.ts` as named exports only | Export components or default exports from a `*.stylex.ts` token file |
| Define `defineProperties()` variables before `createSprinkles()` | Inline `defineProperties()` calls inside `createSprinkles()` |
| Forward both `className` and `style` into Linaria `styled(Custom)` targets | Forward only `className` and silently drop dynamic CSS variables |
| Import `defineConfig` from `'cva'` (v1) and wire `twMerge` (v3 for Tailwind v4) | Import non-existent `'cva/config'` or concatenate conflicting Tailwind utilities |
| Enable `css: { transformer: 'lightningcss' }` in Vite for CSS Modules & native CSS | Add Sass + 6 PostCSS plugins solely for CSS nesting and autoprefixer |
| Use `postcss-jit-props` or selective `@import` packs with Open Props | Ship the entire unshaken Open Props bundle when using five tokens |
| Use Sass `@use`/`@forward` + CSS custom properties for runtime themes | Write new `@import` chains or bake dark mode into static Sass `$vars` |

## Verification commands

```sh
npm run build
```

Inspect the built `.css` output (`static`) to confirm zero-runtime classes and custom properties were actually emitted (catching Panda/UnoCSS/Tamagui extraction misses), and verify computed styles across light/dark themes and component variants in a real browser (`rendered`).
