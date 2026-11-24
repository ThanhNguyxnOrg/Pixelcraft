# Reference inspection protocol

## Three-stage inspection

1. **Listing:** capture project title, gallery, award/category/date, listed tags, creator, and project link. Label all technology tags gallery-tagged.
2. **Detail page:** capture project description, screenshots/sections, judge/category metadata, technology tags, and attribution. Label project/agency claims metadata-reported.
3. **Live project:** inspect a small number of meaningful routes/states on desktop and mobile where public access permits. Record observed controls, motion, media, input behavior, and visible failure/fallback paths.

## Markup/resource inspection

When allowed, inspect public HTML, CSS, module/resource URLs, and browser-observable runtime. Record only what is actually exposed:
- script and stylesheet URLs;
- framework markers or module/chunk names;
- Canvas/WebGL/WebGPU/video/audio presence;
- reduced-motion declarations;
- scroll libraries or custom input handling;
- loaded media and asset formats.

A canvas tag does not by itself prove WebGL. A script filename does not prove that a function is active. A string in a bundle may be dead code. Use runtime interaction evidence for claims about visible behavior.

## Worked examples from the 2026-11-24 research pass

### TWO26 STUDIO — Awwwards Site of the Day

- Award page: https://www.awwwards.com/sites/two26-studio
- Live project: https://two26.studio/
- Gallery tags included GSAP, React, Webflow, animation, scrolling, and illustration. These are gallery-tagged.
- Public markup exposed GSAP 3.15.0 and plugin resource names including SplitText, ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, CustomEase, and CustomBounce, plus Lenis 1.1.20. This is markup-observed for the inspected page as served on 2026-11-24; do not treat these versions as current package recommendations.
- Live inspection observed magnetic CTA movement, character/line reveals, SVG wipe behavior, staggered card/modal transitions, and scroll-responsive marquee behavior on the inspected project.
- The example is DOM/SVG/CSS/GSAP-led; it is not evidence that every award-level page needs 3D.

### ORYZO AI — CSS Design Awards

- Award detail: https://www.cssdesignawards.com/sites/oryzo-ai/49111
- Live project: https://oryzo.ai/
- CSSDA listed animated, scroll, and WebGL tags; label those gallery-tagged.
- The inspected HTML exposed an Astro module, six canvas elements, three video elements, and Vimeo player resources. This is markup-observed. The inspected response did not establish which 3D engine, if any, powered each canvas; keep that engine unknown unless separately verified.

### A DAY — Seasons of Youth, FWA

- FWA entry: https://thefwa.com/w/a-day-seasons-of-youth
- Live project: https://aday.daikifujita.com/
- FWA describes a one-day story across four seasons; label that metadata-reported.
- The inspected HTML exposed a canvas and preloaded scene chunks with a Three-related module name. This is markup-observed, not a claim about all runtime behavior or performance.

## Report limits

Record the route, viewport, browser/device, date, access method, and states actually tested. If bot protection, authentication, geographic gating, unsupported media, or incomplete source blocks an inspection, report that boundary; never work around it.
