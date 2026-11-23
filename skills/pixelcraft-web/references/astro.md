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

Static rendering makes font loading visible immediately: use explicit font-face/head preload/fallback policy and subset scripts carefully. Do not load display fonts needed only in one island globally unless reuse justifies cost.

## Motion/reduced motion

Use CSS motion for static/semantic transitions. In client directives (`client:load`, `client:visible`, etc.), initialize JS motion only in the island and honor `prefers-reduced-motion`. Prefer `client:visible`/idle loading for nonessential animated/effects islands.

## Accessibility specifics

Static HTML must be correct before hydration. Islands need real controls, labels, focus behavior, and route/navigation semantics. View transitions must preserve focus/order and reduced-motion expectations. Do not use client directives to delay critical semantic content unnecessarily.

## States idiom

Static content has fewer runtime states by design; dynamic data states belong in server endpoints/islands. Render empty/error/loading explicitly in the island and make form submission progressively enhanced where possible. Content collections need empty/missing-draft/frontmatter validation behavior.

## Forms idiom

Native forms and server actions/endpoints can provide baseline behavior. Use labels/input types/autocomplete and preserve values across failed submission. Hydrated validation is enhancement, not the only path.

## Do/don't pairs

| Do | Don't |
|---|---|
| static article/navigation markup plus `<Search client:visible />` | hydrating the entire marketing/docs page because one control exists |
| `<a href="/docs/tokens">Design tokens</a>` | click-only navigation inside a framework island |
| scoped island for genuinely interactive visual effect | animated background island blocking primary content rendering |
| semantic heading/content order in `.astro` layout | relying on client JS to construct basic document structure |
| stable fallback sized like final island | blank layout-shifting island placeholder |

## Known traps

Too many client directives, duplicated framework renderers, island boundary duplication, stale static content mistaken for live state, view-transition focus loss, content collection schema drift, partial hydration hiding interaction cost, image/asset priority mistakes.

## Verification commands

```sh
npm run check
npm run build
npm run test -- --run
npx playwright test
```

Inspect generated HTML as static evidence and browser behavior/hydration as rendered evidence.
