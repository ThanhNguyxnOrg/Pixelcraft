# Design token tooling and Figma Code Connect pipeline

Use Pixelcraft's bundled `scripts/export-tokens.mjs` for lightweight zero-dependency DTCG exports, and step up to **Style Dictionary v4**, **Tokens Studio**, and **Figma Variables + Code Connect** when a multi-platform design system needs CI pipelines, Figma sync, and Dev Mode component mapping.

## Tooling decision matrix

| Tool | Role | Best fit | Primary trade-off |
|---|---|---|---|
| **Style Dictionary (v4+)** | Multi-platform token compiler (CSS, SCSS, Tailwind, Swift, Kotlin/Compose, Android XML) | Production multi-platform design systems consuming W3C DTCG JSON | Do not mix DTCG (`$value`/`$type`) and legacy (`value`/`type`) syntax inside the same Style Dictionary instance |
| **Tokens Studio (`@tokens-studio/sd-transforms`)** | Figma plugin + Style Dictionary transform bridge | Teams authoring multi-theme token sets in Figma and syncing via Git PRs | Requires `@tokens-studio/sd-transforms` preprocessor to normalize Tokens Studio math/composite tokens for Style Dictionary |
| **Figma Variables (REST / Plugin API)** | Native Figma variable collections and modes (Light/Dark/Brand/Density) | Direct variable-to-DTCG export and mode parity | Variable modes are tier-gated by Figma plan; map semantic collections cleanly to DTCG modes |
| **Figma Code Connect (`@figma/code-connect`)** | Maps Figma component variants to real production code snippets in Dev Mode & MCP | Preventing design-to-code drift across React, HTML/Web Components, SwiftUI, and Jetpack Compose | Requires maintaining `*.figma.tsx` / `*.figma.ts` mappings alongside component prop changes in CI |

## Verified implementation idioms

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

### Figma Code Connect (`*.figma.tsx`)

- Map Figma component properties explicitly with `figma.enum`, `figma.boolean`, `figma.string`, and `figma.children` so Dev Mode and AI tools emit real, type-checked component calls instead of raw CSS/div reconstructions.

```tsx
// Button.figma.tsx
import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'https://www.figma.com/file/FILE_KEY/DesignSystem?node-id=1:2', {
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

- Treat compiled platform outputs (`dist/tokens.css`, `Tokens.swift`, `Tokens.kt`) as **generated build artifacts**—never hand-edit them.
- Run token schema validation, broken-reference checks, and `figma connect parse` in CI so renaming a token or component prop breaks the build immediately rather than silently drifting in Figma.

## Do/don't pairs

| Do | Don't |
|---|---|
| Stick to one format (`$value`/`$type` DTCG) per Style Dictionary v4 instance | Mix legacy `value`/`type` and DTCG `$value`/`$type` in the same SD build |
| Enable `outputReferences` to preserve semantic-to-primitive CSS var chains | Flatten every semantic token to raw hex and lose runtime theme overrides |
| Co-locate `*.figma.tsx` Code Connect files next to components and check them in CI | Leave Code Connect snippets stale after renaming component props |
| Register `@tokens-studio/sd-transforms` when compiling Tokens Studio exports | Feed raw Tokens Studio math expressions into plain Style Dictionary without transforms |

## Verification commands

```sh
npx style-dictionary build
npx figma connect parse
```

Verify generated CSS/Swift/Kotlin artifacts (`static`) and confirm theme-mode overrides resolve without broken `var(--*)` references in a real browser (`rendered`).
