# GSAP implementation guide

Use GSAP when a timeline, coordinated sequence, SVG/plugin capability, or scroll choreography materially improves the interaction. It is not the default for every hover or state change.

## Ownership and setup

- Register only the plugins used by the affected route/component.
- Check the installed GSAP version and exact plugin availability before relying on a plugin or API. Do not infer license/plan access from an old tutorial.
- Keep one animation system as the owner of a given element/property. Avoid GSAP and Motion both writing transform on the same node.
- Scope selectors and timelines to the component. Prefer a scoped context or the project's maintained React integration rather than global queries that survive route changes.
- Revert the context/kill timelines and ScrollTriggers on teardown. Rebuild measurements after font/image/content changes where appropriate.

## Timeline composition

Use labels for semantic beats such as intro, reveal, detail, exit. Keep a master timeline small and compose section-level timelines; do not build one giant timeline for an entire application.

| Tool | Use |
|---|---|
| gsap.timeline | Ordered or overlapping sequence with labels and explicit ownership |
| ScrollTrigger | Progress-linked scenes, pinning, scrub, snap, enter/leave callbacks |
| SplitText | Headline/short editorial text sequencing while preserving a semantic source |
| DrawSVGPlugin | SVG stroke drawing when the path itself communicates progress |
| MotionPathPlugin | Movement along a meaningful SVG/path geometry |
| CustomEase | A project-specific motion character reused through semantic tokens |
| matchMedia | Responsive and reduced-motion-specific animation variants |

A plugin's presence in a bundle is not proof that a given interaction uses it. Verify the route and state.

## ScrollTrigger rules

- Use normal document flow and native scroll. Pin only when a persistent artifact needs chapter context.
- Define trigger/start/end in content terms and test fast/reverse scroll, scrollbar drag, resize, short viewport height, and late media.
- Avoid pinned nested scrollers and multiple competing smooth-scroll systems.
- Refresh only after layout-affecting content is ready; do not call refresh on every frame.
- Do not make core content unreachable if ScrollTrigger fails or reduced motion is enabled.

## React lifecycle

- Initialize in an effect or the project's documented GSAP React integration.
- Scope selectors under a component root.
- Revert all created animations and triggers in cleanup.
- Avoid recreating timelines on every state render; depend on stable inputs and explicitly rebuild when content changes.
- Test React Strict Mode mount/cleanup/remount behavior in development.
- Do not use a global query that accidentally animates another instance of a repeated component.

```ts
// Scoped GSAP + matchMedia cleanup (safe under React Strict Mode)
const mm = gsap.matchMedia();
const ctx = gsap.context(() => {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.chapter-item', {
      y: 24,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
    });
  });
}, rootRef);

// Cleanup: ctx.revert(); mm.revert();
```

## Official references

- GSAP docs: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- DrawSVGPlugin: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
- MotionPathPlugin: https://gsap.com/docs/v3/Plugins/MotionPathPlugin/
- React guidance: https://gsap.com/resources/React/
