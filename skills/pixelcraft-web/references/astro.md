# Astro

## Token mapping

Import generated CSS variables in a shared layout or global stylesheet:

```astro
---
import '../styles/tokens.css';
---
```

Use semantic variables in static CSS and pass only semantic names/roles into hydrated islands. Do not ship tokens repeatedly inside every island bundle.

## Layout and responsive idioms

Astro's strength is content-first static rendering with selective islands. Keep navigation/article/content composition server-rendered; use framework islands only where interaction is required. Layouts own shell structure; pages own content. Use CSS grid/container queries/measure rather than hydrating layout that does not need JS.

## Typography/custom fonts

Static rendering makes font loading visible immediately. Use the **Astro Fonts API** (`fonts` in `astro.config.mjs` with `fontProviders` + `<Font cssVariable="--font-display" preload />` in `<head>`) when on Astro 5.7+ for automatic self-hosting, metric-adjusted fallbacks, and subsetting; otherwise configure explicit `@font-face` + preload/fallback policy. Do not load display fonts needed only on one route globally unless reuse justifies cost.

## Motion/reduced motion

Use CSS motion for static/semantic transitions. For client-side view transitions in Astro 5, import **`<ClientRouter />`** from `'astro:transitions'` (replacing the deprecated `<ViewTransitions />`), honor `prefers-reduced-motion`, and re-initialize any non-island listeners on `astro:page-load`. In framework islands (`client:load`, `client:visible`, `client:idle`), honor `prefers-reduced-motion` and prefer `client:visible`/`client:idle` for nonessential animated islands.

## Accessibility specifics

Static HTML must be correct before hydration. Islands need real controls, labels, focus behavior, and route/navigation semantics. `<ClientRouter />` transitions must preserve focus, route announcements, and reduced-motion expectations. Do not use client directives to delay critical semantic content unnecessarily.

## States idiom

Static content has fewer runtime states by design; dynamic user/live data belongs in **Server Islands** (`server:defer`) or client islands. Always provide a sized `slot="fallback"` on `server:defer` components so streaming personalized regions (cart badge, user greeting, live price) do not cause CLS. Render empty/error/loading explicitly inside islands and server-island error paths.

## Forms idiom

Use **Astro Actions** (`src/actions/index.ts`, `defineAction` + Zod validation) paired with standard HTML `<form method="POST" action={actions.subscribe}>` for progressively enhanced submissions that work without client JS, then enhance optionally on the client with `actions.subscribe(formData)` and `isInputError(error)`. Always preserve entered values on validation failure and associate errors next to fields.

## Astro 5 architecture idioms

- **Content Layer API (`src/content.config.ts`)**: define collections at `src/content.config.ts` (moved from legacy `src/content/config.ts`) using `loader: glob({ pattern: '**/*.md', base: './src/content/docs' })` or `file(...)` plus `z.object(...)` schemas. Load entries with `getCollection()` and render Markdown/MDX with standalone `render(entry)` from `'astro:content'`.
- **Server Islands (`server:defer`)**: keep the outer page statically cached at the CDN while deferring small dynamic `.astro` components to render on demand with a fixed-height `slot="fallback"`.
- **Typed environment variables (`astro:env`)**: declare public/secret schema in `astro.config.mjs` (`env.schema`) and import from `astro:env/client` or `astro:env/server` instead of raw `import.meta.env` casts.

```ts
// src/content.config.ts (Astro 5 Content Layer)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({ title: z.string(), publishedAt: z.coerce.date(), draft: z.boolean().default(false) }),
});

export const collections = { guides };
```

```ts
// src/actions/index.ts (Astro Actions)
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({ email: z.string().email(), message: z.string().min(10) }),
    handler: async ({ email, message }) => ({ ok: true, email, length: message.length }),
  }),
};
```

```astro
---
import { ClientRouter } from 'astro:transitions';
import { actions } from 'astro:actions';
import CartCount from '../components/CartCount.astro';
---
<head>
  <ClientRouter />
</head>
<header>
  <CartCount server:defer>
    <span slot="fallback" class="badge-placeholder" aria-busy="true">—</span>
  </CartCount>
</header>
<form method="POST" action={actions.contact}>...</form>
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Static article/navigation markup plus `<Search client:visible />` or `<CartCount server:defer>` | Hydrating the entire marketing/docs page or disabling static caching for one dynamic badge |
| `src/content.config.ts` with `loader: glob(...)` and `render(entry)` | Legacy `src/content/config.ts` with `type: 'content'` and `entry.render()` in Astro 5 |
| `<ClientRouter />` from `'astro:transitions'` | Deprecated `<ViewTransitions />` |
| `defineAction` + `<form method="POST" action={actions.x}>` for forms | Hand-rolled untyped `/api/*.ts` endpoints without progressive fallback |
| `astro:env/server` for secrets and `astro:env/client` for public config | Reading unvalidated `import.meta.env` keys across client/server boundaries |
| Stable `slot="fallback"` sized like the resolved island | Blank layout-shifting fallback on `server:defer` or `client:visible` |

## Known traps

Putting Content Layer config in legacy `src/content/config.ts`, forgetting `slot="fallback"` sizing on `server:defer` islands, attaching DOM scripts on `DOMContentLoaded` instead of `astro:page-load` when `<ClientRouter />` is active, too many `client:load` directives, duplicated framework renderers, leaking server env vars into client islands.

## Verification commands

```sh
npx astro check
npm run build
npm run test -- --run
npx playwright test
```

Inspect generated HTML and `astro check` as `static` evidence, and verify hydration, Server Island fallback stability, and `<ClientRouter />` focus behavior in a real browser (`rendered`).
