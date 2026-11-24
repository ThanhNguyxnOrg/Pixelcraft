# Scrollytelling accessibility and resilience

Interactive narratives and pinned visuals are progressive enhancements. Every reader—keyboard-only, screen-reader, reduced-motion, magnified, RTL, low-power, or fallback mode—must receive the complete argument and evidence without fighting the layout. For browser ARIA/CSS/reduced-motion implementation specifics, coordinate with `pixelcraft-web`.

## Accessibility & resilience contract

| Concern | Mandatory rule | Failure mode prevented |
|---|---|---|
| **Logical reading order** | Keep one coherent reading sequence across chapters even while a visual artifact remains pinned or sticky. | Screen readers and keyboard users jumping unpredictably between prose and detached visual regions |
| **Focus stability** | Keep focus indicators clearly visible and **never move focus programmatically** merely because a scroll threshold was crossed. | Disorienting keyboard/assistive-tech users mid-scroll |
| **Bypass & orientation** | Provide a table of contents with direct chapter links and a skip-narrative path past long pinned sequences. | Trapping users inside multi-screen visual corridors |
| **Reduced motion** | Under user reduced-motion preferences, render chapters in normal linear flow with discrete final/static visual states and zero parallax or scroll-scrubbing motion. | Motion sickness, vestibular triggers, and frozen blank opacity-0 sections |
| **Zoom & text expansion** | Support 200% text scaling, long localized strings, and RTL mirroring without clipping captions or colliding with pinned visuals. | Overlapping text or cropped headlines inside fixed-height scroll frames |
| **Media & audio safety** | Never autoplay audio; provide captions and transcripts for spoken narration, plus text/table alternatives (with units and sources) for every animated chart or diagram. | Inaccessible insight trapped inside visual transitions or muted video |
| **Input & history integrity** | Preserve platform scroll keys, scrollbar, touch momentum, and back/forward navigation at every point in the narrative. | Broken browser/app Back button or frozen keyboard scrolling |
| **Runtime failure fallback** | Ensure core headings, prose, and key static visuals remain readable if interactive scripting, animations, or 3D/GPU renderers fail to initialize. | Empty blank stages hiding the actual content |

## Do/don't pairs

| Do | Don't |
|---|---|
| Render content visible by default and enhance transitions progressively | Hide chapters at `opacity: 0` waiting for an animation engine to reveal them |
| Pair every animated chart state with a static text takeaway and data table | Communicate key numbers solely through scrub-triggered tooltips |
| Release sticky/pinned containers cleanly under reduced-motion or 200% zoom | Clip expanded prose behind `overflow: hidden` pinned frames |
| Let chapter links move focus cleanly only when explicitly activated by the user | Steal focus automatically on scroll intersection |

## Verification

Test with keyboard-only navigation (Tab, Space, PageDown, Home/End), reduced-motion enabled, 200% text scaling, short landscape viewports, narrow mobile widths, RTL layout, disabled/failed enhanced scripting, and screen-reader traversal through table of contents -> chapters -> data alternatives.
