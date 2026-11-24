# Creative runtime integration for web

Use this when a web project combines DOM UI with animation, canvas, 3D, graphics, or media. Preserve the existing stack and make the creative runtime an isolated enhancement.

## React / Next.js boundary

- Keep SEO/content/stateful product UI server-rendered when possible.
- Place Motion, GSAP, R3F, PixiJS, and Web Audio code in narrow client components or routes that need them.
- Dynamically import heavyweight renderers and large scenes; render a meaningful poster/DOM fallback first.
- Avoid making a whole route client-only for one interactive canvas or animated CTA.
- Ensure SSR output does not depend on random/time/GPU values; initialize nondeterministic rendering after mount or seed it.
- Verify the exact React/Next router and library APIs for the installed versions.

## Ownership matrix

| Surface | Primary owner | Keep in DOM |
|---|---|---|
| UI state, layout/gesture | Motion for React or CSS | All controls and state labels |
| Choreographed timeline | GSAP | Text, navigation, form controls |
| 3D scene | Three.js/R3F/Spline | Product data, options, purchase/navigation |
| 2D GPU scene | PixiJS/Canvas/WebGL | Headings, CTA, instructions, accessible summaries |
| Audio/video | Web Audio/HTML media | Play/mute/pause, captions, transcript |

Avoid duplicate animation ownership on the same properties. Coordinate scroll engines with the one selected in the plan.

## Loading and failure states

- Load scene code/assets on demand and avoid blocking first content.
- Show a poster/placeholder with stable dimensions.
- Handle unsupported APIs, missing assets, network failure, context loss, and media playback rejection.
- Keep ordinary navigation and content functional if the effect fails.

## Route to specialized skills

Use pixelcraft-motion for complex timelines and UI choreography, pixelcraft-3d-web for 3D scenes/assets, pixelcraft-creative-code for GPU 2D/shaders, pixelcraft-scrollytelling for chapter-based narratives, and pixelcraft-audio-visual for sound/video-led experiences.
