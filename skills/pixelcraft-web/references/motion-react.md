# Motion (`motion/react` & vanilla `motion`)

Use Motion for component-level state transitions, gestures, layout animation, presence, spring physics, and lightweight WAAPI-accelerated scroll/view animations.

## Package & entry-point rules

- **Modern package**: install **`motion`** (replacing legacy `framer-motion`). Import React APIs from **`'motion/react'`** in `'use client'` modules, or **`'motion/react-client'`** when rendering simple motion elements inside Next.js / React Server Components without adding `'use client'` to a whole page. Confirm the installed package in `package.json` before editing an existing repo.
- **Bundle reduction (`LazyMotion` + `motion/react-m`)**: wrap your app or feature root in `<LazyMotion features={domAnimation} strict>` (or `domMax` when drag/layout projections are required) and import **`import * as m from 'motion/react-m'`** (`<m.div>`) instead of full `motion.div` to cut initial runtime size from ~34 KB to ~4.6 KB.
- **Non-React stacks (Vue, Svelte, Astro, Lit, server-rendered HTML)**: use vanilla **`motion`** (`animate`, `scroll`, `inView`, `spring`) built directly on Web Animations API / ScrollTimeline with minimal overhead.

## Good fit vs boundaries

- **Use Motion** when component state drives animation, items move between layouts (`layout` / `layoutId`), dialogs/drawers need exit presence (`AnimatePresence`), or drag/pan/tap spring physics carry meaning.
- **Use CSS** for simple hover/focus/opacity transitions and native `<dialog>`/`[popover]` `@starting-style` reveals.
- **Use GSAP** (`gsap.md`) for multi-beat choreographed timelines, complex pinned ScrollTrigger sequences, and SplitText/DrawSVG/MorphSVG work.
- Never animate the same `transform`/style property with Motion and GSAP concurrently. Keep semantic state and focus restoration in application/DOM logic, never tied to animation completion alone.

## Reduced-motion, layout, and presence rules

- **Critical `MotionConfig` trap**: `<MotionConfig reducedMotion="user">` disables declarative `animate`/`whileHover`/`whileInView` transform animations, **but it does NOT disable `MotionValue`-driven styles** (`useScroll`, `useTransform`, `useSpring`, `useMotionValue`). Always read **`useReducedMotion()`** explicitly to bypass springs, parallax, or transform `MotionValue`s when reduced motion is requested.
- **Layout animations without text distortion**: use **`layout="position"`** on cards/headers containing text so elements translate smoothly without non-uniform scale stretching; wrap sibling components that affect each other's layout (accordions, tab underlines with shared `layoutId`) inside **`<LayoutGroup>`**.
- **Presence & focus**: give direct children of **`<AnimatePresence mode="popLayout" | "wait">`** stable `key`s, and restore keyboard focus immediately on close rather than leaving focus trapped inside an exiting node.
- **Logical direction**: use logical origin (`transformOrigin: 'inline-start'` or directional CSS variables) instead of physical left/right so RTL progress indicators grow from the start edge.

```tsx
'use client';
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion, useScroll, useSpring } from 'motion/react';
import * as m from 'motion/react-m';

export function ScrollMeter() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32 });

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <m.div
          role="progressbar"
          aria-label="Reading progress"
          style={{
            position: 'fixed',
            insetBlockStart: 0,
            insetInline: 0,
            blockSize: '2px',
            background: 'var(--semantic-color-action)',
            transformOrigin: 'inline-start',
            // Explicitly bypass spring/transform MotionValue when reduced motion is enabled
            scaleX: prefersReduced ? scrollYProgress : smoothScaleX,
          }}
        />
      </MotionConfig>
    </LazyMotion>
  );
}
```

```tsx
// AnimatePresence + LayoutGroup + layout="position" (prevents text stretch)
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

<LayoutGroup>
  <AnimatePresence mode="popLayout">
    {items.map((item) => (
      <motion.li
        key={item.id}
        layout="position"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {item.label}
      </motion.li>
    ))}
  </AnimatePresence>
</LayoutGroup>
```

```ts
// Non-React vanilla Motion (Astro / Svelte / Vue / HTML): WAAPI-backed with reduced-motion guard
import { animate, inView } from 'motion';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stop = inView('.feature-row', (el) => {
  if (reduced) return;
  animate(el, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35 });
});
// Cleanup: stop();
```

## Official references

- Motion documentation: https://motion.dev/docs
- Motion for React: https://motion.dev/docs/react
- LazyMotion bundle reduction: https://motion.dev/docs/react-reduce-bundle-size
- Vanilla Motion (`animate`/`scroll`/`inView`): https://motion.dev/docs/quick-start
