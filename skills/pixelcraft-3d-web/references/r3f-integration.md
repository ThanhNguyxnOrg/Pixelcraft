# React Three Fiber integration

Use R3F as a renderer within the existing React application, not as an alternate application architecture. Keep the DOM/scene boundary explicit.

## Component boundaries

- Place the Canvas in a narrow client-side component when using server-rendered React/Next.js.
- Keep SEO text, headings, buttons, pricing, product options, and accessible descriptions outside the Canvas.
- Load scene code and large assets only on routes/regions that need them.
- Keep state that changes every frame in refs/mutable objects; do not set React state on every useFrame tick.
- Use memoized geometries/materials where appropriate and dispose resources when ownership ends.
- Avoid recreating loaders, geometries, material instances, and callbacks in render loops.

## Frame lifecycle

Use the R3F frame loop for per-frame updates. Use demand rendering when scene state is mostly static and explicitly invalidate after meaningful changes. Pause or lower work while hidden/offscreen. Do not run an independent requestAnimationFrame loop alongside the renderer without a measured reason.

## Interaction

- Keep camera controls and object manipulation bounded and resettable.
- Map pointer/touch interactions to a meaningful DOM control or keyboard path where the scene is interactive.
- Ensure hit targets are large enough and do not rely on hover-only object affordances.
- Handle pointer cancellation, resize, session changes, and lost context.

## SSR and hydration

Do not instantiate WebGL during server render. Use the framework's client boundary/dynamic loading pattern for the installed router/framework. Avoid hydration-dependent random values in the initial scene; seed them or initialize after mount. Keep the server-rendered fallback useful if the Canvas cannot initialize.

## Official references

- R3F docs: https://r3f.docs.pmnd.rs/
- R3F hooks: https://r3f.docs.pmnd.rs/api/hooks
- Next.js lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
