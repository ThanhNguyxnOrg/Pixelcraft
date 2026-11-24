# Video and media experiences

## Media decision

Use a standard HTML video element when the user needs to watch a clip. Use video texture only when mapping video onto scene geometry materially improves the experience. Use WebCodecs only for a specific decode/encode pipeline requirement after compatibility and maintenance checks.

## Delivery

- Start with a poster and explicit dimensions/aspect ratio to prevent layout shift.
- Use responsive encodes, suitable codecs/bitrates, and adaptive delivery when the context warrants it.
- Defer below-fold or interaction-triggered media.
- Keep captions/transcripts available for informative audio and never communicate essential data only through moving frames.
- Honor autoplay policy; use muted inline autoplay only when appropriate and always provide controls/pause.
- Pause when hidden/offscreen and avoid decoding video just to animate a static decoration.

## Video texture

- Handle play rejection, decode stalls, cross-origin texture constraints, context loss, and resource disposal.
- Keep a normal video/poster fallback for devices without the required GPU path.
- Measure decode and scene-rendering cost separately.
- Avoid rendering high-resolution video into multiple passes by default.

Official docs:
- HTMLVideoElement: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
- WebCodecs: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API
