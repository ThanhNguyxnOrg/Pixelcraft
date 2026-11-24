# Smooth scrolling and Lenis

Smooth scrolling is optional. It changes input feel and browser behavior, so add it only when the brief requires a consistent inertial scroll treatment and normal native scroll remains available.

## Selection checks

- Confirm there is no existing smooth-scroll library or custom scroll container.
- Check keyboard, wheel, touch momentum, scrollbar dragging, anchor jumps, history restoration, focus scrolling, nested scroll regions, and reduced motion.
- Do not combine Lenis with Locomotive or another scroll controller.
- Verify compatibility with ScrollTrigger and the installed library versions before wiring them together.
- Disable or simplify it on reduced-motion, low-power, embedded, and constrained surfaces when needed.

## GSAP coordination pattern

The common integration pattern forwards Lenis scroll updates to ScrollTrigger and drives Lenis from the GSAP ticker, rather than running competing animation-frame loops. Treat this as a pattern to check against the installed Lenis/GSAP versions, not copy-paste code for every project.

- Use one clock/RAF owner.
- Remove ticker/listeners and destroy the Lenis instance on route/app teardown.
- Avoid disabling GSAP lag smoothing globally unless the verified integration requires it.
- Refresh ScrollTrigger only after meaningful layout changes.
- Preserve direct anchor navigation and normal browser scrolling when the script fails.

## Progressive fallback

The page must remain scrollable when JavaScript, the scroll runtime, or an integration fails. Do not hide the browser scrollbar or suppress wheel/touch input. Provide a clear preference for reduced motion and do not force a custom scroll feel on operational interfaces.

## Official references

- Lenis documentation: https://lenis.darkroom.engineering/
- Lenis repository: https://github.com/darkroomengineering/lenis
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
