# Design token tooling and Figma Code Connect pipeline

Use Pixelcraft's bundled `scripts/export-tokens.mjs` for lightweight zero-dependency DTCG exports, and step up to **Terrazzo**, **Style Dictionary v4**, **Tokens Studio**, and **Figma Variables + MCP Server + Code Connect** when a multi-platform design system needs DTCG Resolver builds, CI pipelines, live design-context reads, and Dev Mode component mapping.

## Tooling decision matrix

| Tool | Role | Best fit | Primary trade-off |
|---|---|---|---|
| **Terrazzo (`@terrazzo/cli`)** | Native W3C DTCG 2025.10 + Resolver compiler (`terrazzo.config.ts`) with CSS, Tailwind, Swift, JS/TS plugins | Teams adopting DTCG 2025.10 + `*.resolver.json` directly with strict spec validation and OKLCH color handling | Newer plugin ecosystem than Style Dictionary; verify custom platform targets before migrating |
| **Style Dictionary (v4+)** | Multi-platform token compiler (CSS, SCSS, Tailwind, Swift, Kotlin/Compose, Android XML) | Production multi-platform design systems consuming W3C DTCG JSON with rich custom transforms | Do not mix DTCG (`$value`/`$type`) and legacy (`value`/`type`) syntax inside the same Style Dictionary instance |
| **Tokens Studio (`@tokens-studio/sd-transforms`)** | Figma plugin + Style Dictionary transform bridge | Teams authoring multi-theme token sets in Figma and syncing via Git PRs | Requires `@tokens-studio/sd-transforms` preprocessor to normalize Tokens Studio math/composite tokens for Style Dictionary |
| **Figma Variables (REST / Plugin API)** | Native Figma variable collections and modes (Light/Dark/Brand/Density) | Direct variable-to-DTCG export and mode parity | Variable modes are tier-gated by Figma plan; map semantic collections cleanly to DTCG Resolver contexts |
| **Figma MCP Server** | Streams live Figma frame structure, variable definitions (`get_variable_defs`), screenshots, and Code Connect maps directly into coding agents | Reducing manual handoff drift by grounding agents in exact variables and bound component snippets | Requires authenticated Figma desktop/remote MCP server; still verify rendered output and missing states in code |
| **Figma Code Connect (`@figma/code-connect`)** | Maps Figma component variants to real production code snippets in Dev Mode & Figma MCP | Preventing design-to-code drift across React (`*.figma.tsx`), HTML/Web Components (`*.figma.ts`), SwiftUI (`*.figma.swift`), and Jetpack Compose (`*.figma.kt`) | Requires maintaining mapping files alongside component prop/parameter changes in CI |

## Verified implementation idioms

### Terrazzo (DTCG 2025.10 + Resolver)

Use `terrazzo.config.ts` to compile `*.resolver.json` or `*.tokens.json` with first-class DTCG validation and multi-mode CSS/JS/Swift plugins:

```ts
// terrazzo.config.ts
import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';
import js from '@terrazzo/plugin-js';

export default defineConfig({
  tokens: ['./tokens/design-system.resolver.json'],
  outDir: './dist/tokens/',
  plugins: [
    css({
      filename: 'tokens.css',
      modeSelectors: [
        { mode: 'dark', selectors: ['[data-theme="dark"]'] },
        { mode: 'high-contrast', selectors: ['[data-contrast="more"]'] },
      ],
    }),
    js({ js: 'tokens.js', dts: 'tokens.d.ts' }),
  ],
});
```

### Style Dictionary v4 (DTCG + semantic `outputReferences`)

- Use `outputReferences: true` (or a predicate function `(token, { dictionary, usesDtcg }) => boolean`) in `css/variables` so semantic CSS variables preserve `var(--primitive)` references rather than flattening every token to hardcoded hex values.

```js
// style-dictionary.config.mjs
import { formats, transformGroups } from 'style-dictionary/enums';

export default {
  source: ['tokens/**/*.tokens.json'],
  usesDtcg: true,
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      files: [
        {
          destination: 'dist/tokens.css',
          format: formats.cssVariables,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};
```

### Figma Code Connect (`*.figma.tsx`, HTML, SwiftUI, Compose)

- Use modern Figma `/design/` URLs (not legacy `/file/` URLs) and map component properties explicitly with `figma.enum`, `figma.boolean`, `figma.string`, and `figma.children` so Dev Mode and Figma MCP emit real, type-checked component calls instead of raw div/CSS reconstructions.
- Author platform-native bindings alongside each stack's components: `*.figma.tsx` (React), `*.figma.ts` with `@figma/code-connect/html` (HTML / Web Components / Angular / Vue), `*.figma.swift` (`FigmaConnect` protocol for SwiftUI), and `*.figma.kt` (`@FigmaConnect` annotation for Jetpack Compose).

```tsx
// Button.figma.tsx
import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'https://www.figma.com/design/FILE_KEY/DesignSystem?node-id=1-2', {
  props: {
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    disabled: figma.boolean('Disabled'),
    children: figma.children('Label'),
  },
  example: ({ size, disabled, children }) => (
    <Button size={size} disabled={disabled}>
      {children}
    </Button>
  ),
});
```

## Pipeline governance rules

- Treat compiled platform outputs (`dist/tokens.css`, `Tokens.swift`, `Tokens.kt`, `tokens.d.ts`) as **generated build artifacts**—never hand-edit them.
- Run token schema validation, broken-reference checks, `$deprecated` audit warnings, and `figma connect parse` in CI so renaming a token or component prop breaks the build immediately rather than silently drifting in Figma.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use Terrazzo or Style Dictionary v4 with `usesDtcg: true` for DTCG 2025.10 builds | Mix legacy `value`/`type` and DTCG `$value`/`$type` in the same compiler instance |
| Enable `outputReferences` to preserve semantic-to-primitive CSS var chains | Flatten every semantic token to raw hex and lose runtime theme overrides |
| Use `/design/` URLs and co-locate Code Connect files (`*.figma.tsx`/`.ts`/`.swift`/`.kt`) checked in CI | Leave Code Connect snippets stale after renaming component props or rely on `/file/` URLs |
| Read bound variables and component mappings via Figma MCP Server during handoff | Visually eyeball hex values from screenshots when Figma Variables exist |
| Register `@tokens-studio/sd-transforms` when compiling Tokens Studio exports | Feed raw Tokens Studio math expressions into plain Style Dictionary without transforms |

## Verification commands

```sh
npx tz build                  # Terrazzo DTCG / Resolver build + lint
npx style-dictionary build    # Style Dictionary v4 build
npx figma connect parse       # Validate Code Connect mappings without publishing
```

Verify generated CSS/TS/Swift/Kotlin/XML/XAML/Rust artifacts (`static`) and confirm theme-mode overrides resolve without broken `var(--*)` references in a real browser or native runtime (`rendered`).
