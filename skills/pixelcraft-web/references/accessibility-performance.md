# Audiovisual accessibility and performance

Pair these concrete browser media rules with [media-players.md](media-players.md) and `pixelcraft-accessibility` (`motion-canvas.md`).

## `<track>` & alternative media contract (WCAG 1.2.x)

| Track `kind` | Purpose | Required when |
|---|---|---|
| `kind="captions"` | Spoken dialogue **plus** meaningful non-speech sound cues (`[alarm beeps]`, `[music fades]`) | All prerecorded informative video with audio (WCAG 1.2.2); include `srclang`, `label`, and `default` where appropriate |
| `kind="descriptions"` | Text audio-description cues describing critical visual-only actions/charts | Informative video containing visual information not spoken in the audio track (WCAG 1.2.3 / 1.2.5) |
| `kind="subtitles"` | Translated dialogue for viewers who can hear the audio | Multilingual releases (does **not** replace `captions` for deaf/hard-of-hearing users) |
| `kind="chapters"` | Navigable WebVTT chapter markers | Long tutorials, talks, and podcasts for keyboard/scrubber navigation |

- Supply a readable text transcript adjacent to audio-only podcasts/clips (WCAG 1.2.1) and long-form videos so users can search, copy, and translate content.

## User control & WCAG 2.2.2 / 2.3.1 safety rules

- **No unmuted autoplay (WCAG 1.4.2)**: never autoplay audible media (>3s without an immediate pause/stop/mute control).
- **WCAG 2.2.2 (Pause, Stop, Hide)**: any moving, blinking, scrolling, or auto-updating content (ambient background video, marquees, canvas loops, carousels) that starts automatically, lasts **more than 5 seconds**, and appears alongside other content **must** expose a visible, keyboard-focusable Pause/Stop/Hide button—honoring `prefers-reduced-motion` is necessary but not sufficient for users who have not enabled OS reduced motion.
- **WCAG 2.3.1 (Three Flashes or Below Threshold)**: never render content that flashes **more than 3 times in any 1-second period** above general or saturated-red flash thresholds. Clamp audio-reactive luminance/opacity modulation (`audio-reactive.md`) and shader noise frequencies accordingly.
- **Keyboard & assistive tech parity**: Play/Pause, Seek, Mute/Volume, Captions toggle, and Fullscreen must be reachable by `Tab`, operable with `Space`/`Enter`/arrows, expose `aria-pressed` or live state labels, and keep visible focus rings.

```html
<!-- Ambient loop satisfying WCAG 2.2.2 (Pause control) + reduced motion -->
<figure class="ambient-stage">
  <video id="hero-loop" muted loop playsinline poster="/media/loop-poster.webp" aria-hidden="true">
    <source src="/media/loop.mp4" type='video/mp4; codecs="avc1.42E01E"' />
  </video>
  <button type="button" id="toggle-loop" aria-pressed="false" aria-controls="hero-loop">
    Pause background motion
  </button>
</figure>
```

## Performance & verification

- Record media transfer size, codec/decode cost, analyser/visualizer update rate, GPU frame time, memory, and device tier separately (`rendered`).
- Lazy-load below-fold media (`preload="none"` / `IntersectionObserver`), pause playback when offscreen or `document.hidden`, avoid per-frame allocations in audio visualizers, and test on mid-tier mobile or throttled network profiles (or mark device profiling `not-checked`).

Official guidance:
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C Making Audio and Video Media Accessible: https://www.w3.org/WAI/media/av/
