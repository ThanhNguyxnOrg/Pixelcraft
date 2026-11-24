---
name: pixelcraft-audio-visual
description: Builds audio-reactive visuals, interactive sound experiences, video-led storytelling, media textures, and generative audiovisual interfaces with Web Audio, AudioWorklet, Canvas, WebGL, and web video APIs. Use for music visualizers, sound-reactive particles, immersive media, synchronized video/graphics, audio controls, or media-performance and autoplay work.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft audio visual

Treat sound and motion as optional media behaviors with explicit user control. The interface must remain understandable when muted, autoplay is blocked, audio is unavailable, media fails, or reduced motion is enabled.

## References

- Read [references/audio-reactive.md](references/audio-reactive.md) for analysis, visualizers, frequency mapping, and AudioWorklet.
- Read [references/video-media.md](references/video-media.md) for video backgrounds, textures, synchronized scenes, streaming, and WebCodecs.
- Read [references/accessibility-performance.md](references/accessibility-performance.md) for autoplay, mute/pause, captions, reduced motion, and CPU/GPU budgets.

## Workflow

1. Decide whether audio/video conveys essential content, supports a story, or is decorative. Essential speech needs captions/transcript; decorative media must be optional.
2. Obtain user intent before starting sound. Never assume autoplay with sound is acceptable; default to muted or user-initiated playback.
3. Separate media transport state (loading, ready, playing, paused, ended, error) from visual animation state. Show controls and failures.
4. Build silent/static representation first. Audio analysis and video texture are progressive enhancements.
5. Use an analyser/worklet only for a meaningful need. Keep heavy DSP off the main thread when appropriate.
6. Synchronize to media time or audio analysis, not independent timers that drift. Clamp delta after pause/background.
7. Pause/release resources when hidden/offscreen/unmounted; recover from denied permissions, device changes, interruption, decode/render failure.
8. Verify captions, keyboard, mute/pause/stop, reduced motion, low-power devices, and no-audio path.

## Rules

- Never hide meaning in sound, color, flashing, or motion alone.
- Provide pause/stop for long-running ambient or automatically starting media.
- Honor autoplay rules and preserve a clear user gesture path.
- Avoid high-contrast flashing or rapid oscillation.
- Compress media, use posters and lazy loading; avoid downloading full media before needed.
- Feature-detect WebCodecs, AudioWorklet, and GPU APIs; provide fallbacks.
- Do not record microphone input or upload user media without explicit consent and purpose.
- Use named visual/media states rather than scattered booleans and unbounded callbacks.

## Completion contract

Report media controls, autoplay behavior, muted/static fallback, captions/transcript, lifecycle cleanup, supported APIs, and measured device evidence. Label untested browsers/media paths not-checked.
