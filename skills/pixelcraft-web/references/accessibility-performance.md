# Audiovisual accessibility and performance

## User control

- Do not autoplay audible media.
- Provide visible play/pause, mute/unmute, stop, and replay where relevant.
- Make current playback state understandable to keyboard and assistive technology.
- Synchronized captions are required for both spoken dialogue **and** meaningful non-speech audio (alarms, status cues, sound effects) in informative synchronized media; provide a transcript for audio-only or long-form media as well.
- Important information must remain available in text and must not depend on hearing, seeing animation, or perceiving color.

## Motion and sensory safety

- Respect reduced motion and expose a static/simplified visual mode.
- Avoid flashing, rapid alternating contrast, large involuntary camera movement, and full-screen repetitive motion.
- Pause when the page is hidden or the user pauses.
- Let users opt out of sound-reactive effects.

## Performance

Record media transfer, decode, analysis, renderer frame time, memory, and device conditions separately. Lazy-load media, use posters, adapt resolution, cap visualizer update rate, and avoid per-frame allocations. Verify on a mid-tier mobile device and a lower-power path when relevant.

Official guidance:
- WCAG: https://www.w3.org/WAI/standards-guidelines/wcag/
- Media accessibility: https://www.w3.org/WAI/media/av/
