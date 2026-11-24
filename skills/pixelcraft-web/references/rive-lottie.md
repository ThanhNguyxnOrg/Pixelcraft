# Rive and Lottie selection

## Choose by behavior

| Need | Choose | Why |
|---|---|---|
| Interactive character/icon with inputs, transitions, and multiple named states | Rive | State-machine behavior is authored as a coherent interactive asset |
| Mostly one-shot or looped vector illustration | Lottie/dotLottie | Timeline playback is sufficient |
| UI state, selection, validation, focus, or form feedback | DOM/native UI state | Assistive tech and application state need semantic controls |
| Complex scroll choreography or path movement | GSAP/native scroll APIs | Timeline/scroll ownership is easier to inspect in code |

## Integration requirements

- Keep the application state machine authoritative; the animation reflects it and never becomes the only source of truth.
- Provide text/DOM state names where the animation meaning matters.
- Load files on demand, cache appropriately, and release observers/players on unmount.
- Stop or pause hidden/offscreen loops and honor reduced motion.
- Test fallback when runtime/player fails and when the asset is unavailable.
- Check asset source, embedded fonts/images, licenses, export compatibility, and runtime cost.
- Avoid autoplaying complex mascots in task-dense product surfaces.

## Official references

- Rive docs: https://rive.app/docs/
- Rive web runtimes: https://rive.app/docs/runtimes/web
- LottieFiles developers: https://developers.lottiefiles.com/
