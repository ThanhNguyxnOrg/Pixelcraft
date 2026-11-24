# Motion for React

Use Motion for React for component-level state transitions, gestures, layout animation, presence, and spring interactions. The current Motion documentation uses the Motion package and React entry point; confirm the installed package/API before editing an existing app.

## Good fit

- A component animates when application state changes.
- A card/list item moves between layouts while preserving identity.
- A dialog or route section enters/leaves with presence handling.
- Drag, pan, hover, focus, and tap gestures are central to the interaction.
- A spring model communicates physical settling rather than a long authored sequence.

## Boundaries

- Use CSS for simple transitions and platform-native transitions where appropriate.
- Use GSAP for deeply choreographed timelines, complex scroll sequences, and plugin-led SVG/path work.
- Do not animate the same transform/style property with Motion and GSAP concurrently.
- Keep semantic state in React/application logic, not in animation progress alone.
- Ensure exit animations never leave focus inside removed content or delay navigation unexpectedly.

## Implementation checklist

- Use stable component keys so presence/layout identity is correct.
- Make reduced-motion behavior explicit with the installed Motion API and project preference hook.
- Keep event handlers deterministic; cancel drag/animation when the component unmounts or pointer is cancelled.
- Check layout animation against dynamic text, RTL, image loading, and narrow viewports.
- Do not wrap an entire application tree in a client-only boundary for one animated component.
- Verify focus order, keyboard activation, and touch behavior independent of hover.

```tsx
// Zero-rerender scroll progress + reduced-motion boundary
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';

export function ScrollMeter() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32 });
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="fixed inset-x-0 top-0 h-0.5 origin-left" style={{ scaleX }} />
    </MotionConfig>
  );
}
```

## Official references

- Motion documentation: https://motion.dev/docs
- Motion for React: https://motion.dev/docs/react
- React gestures: https://motion.dev/docs/react-gestures
