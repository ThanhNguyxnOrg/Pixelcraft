---
name: pixelcraft-scrollytelling
description: Designs scroll-driven narratives and chapter-based interactive web stories with pinned scenes, horizontal journeys, timelines, maps, product storytelling, and progressive motion. Use for immersive landing pages, editorial narratives, launches, long-form visual stories, scroll-linked explainers, and scene transitions that remain navigable and accessible.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft scrollytelling

Scrollytelling is content architecture synchronized to a user's position, not a technique for taking control of scrolling. The document must remain understandable, navigable, and useful when animation is unavailable or skipped.

## References

- Read [references/narrative-systems.md](references/narrative-systems.md) for story arc, chapters, interaction model, and pacing.
- Read [references/scroll-implementation.md](references/scroll-implementation.md) for sticky/pinned scenes, timelines, horizontal tracks, progress, and history.
- Read [references/accessibility-resilience.md](references/accessibility-resilience.md) before shipping keyboard, touch, reduced-motion, deep-link, and recovery behavior.

## Workflow

1. Define the story claim and user takeaway. Write the content sequence as a plain linear outline first.
2. Separate narrative structure from animation: chapter IDs, headings, source content, key state, progress, and navigation must exist without a scene.
3. Choose synchronization: native scroll-driven CSS/ScrollTimeline for simple progress, IntersectionObserver for threshold entry, GSAP ScrollTrigger for complex choreography, or sticky layout with state changes.
4. Use normal document flow by default. Pin only one meaningful artifact at a time; keep chapter text/progress available.
5. Add real anchor navigation and support history, direct links, back/forward, and refresh.
6. Test rapid/reverse scroll, scrollbar dragging, keyboard PageUp/PageDown, touch momentum, resize, font load, and late media.
7. Build a static chapter path and reduced-motion version. Verify the full story without animation.

## Narrative patterns

- **Artifact + annotations:** one persistent product/map/image with chapters explaining regions.
- **Journey:** route or sequence with origin, milestones, progress, and end.
- **Time sequence:** day/season/history where time changes material rather than only color.
- **Transformation:** before/after or input/output with labeled, reversible intermediate states.
- **Guided exploration:** user-controlled scenes, checkpoints, and return/reset.
- **Data narrative:** one evidence claim per chapter, with source/context and no animation hiding values.

## Guardrails

- Never trap scroll, invert direction, hide the scrollbar, hijack wheel/touch, or require exact pixel positions.
- Do not hide copy on small overscroll or lose it on reverse scroll.
- Pinning needs an obvious end, normal-flow restoration, focus order, and short-height protection.
- Keep linear reading, direct chapter links, and meaningful progress labels.
- Do not auto-advance or play sound without consent and pause/stop controls.
- On mobile, replace complex pins with sequential cards, controlled steps, or static illustration plus chapters.
- Retain units, source, uncertainty, and text/table access outside data visualizations.
- Respect reduced motion, zoom/text scaling, RTL, keyboard, touch, screen readers, and no-JS content as applicable.

## Completion contract

Report linear story outline, chapter/deep-link model, scroll synchronization, mobile/reduced-motion equivalent, history behavior, and actual input/resize evidence.
