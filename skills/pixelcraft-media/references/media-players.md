# Audio and video player engineering

Choose a media playback library by **streaming protocol (MP4/WebM vs HLS/DASH/MoQ), DRM requirement, custom UI ownership, and audio DSP/waveform needs**. Never autoplay unmuted audio, and always include captions (`<track kind="captions">`) and accessible keyboard controls (WCAG 1.2.2 & 2.1.1).

## Player & audio engine decision matrix

| Category | Tools | Protocols / model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Adaptive streaming engines** | **hls.js** (v1.7+), **Shaka Player** (v5+), **dash.js** | **hls.js**: HLS (MSE); **Shaka**: DASH + HLS + MoQ + DRM (Widevine/FairPlay/PlayReady); **dash.js**: MPEG-DASH reference | Production adaptive-bitrate video/live streaming; Shaka when DRM or multi-protocol DASH+HLS is required | Safari/iOS supports native HLS without MSE (`canPlayType('application/vnd.apple.mpegurl')`)—must branch cleanly |
| **Turnkey video player UI** | **Video.js**, **Plyr** | Wraps `<video>` / HLS / DASH with skinned controls, captions, plugins | Content/course/marketing sites needing accessible themed player chrome quickly | Heavier CSS/plugin footprint than building custom controls over a native `<video>` + `hls.js` |
| **Waveform audio UI** | **wavesurfer.js** (v7+) | `<audio>` MediaElement (default) or WebAudio backend + Canvas waveform | Podcasts, voice notes, audio editors, music previews | Decoding multi-hour files client-side burns RAM/CPU unless you pass pre-computed `peaks` + `duration` |
| **Game / UI sound effects** | **Howler.js** | Web Audio API with HTML5 Audio fallback + audio sprites | UI sound effects, game SFX, pooled spatial/layered playback | Not an adaptive streaming video/podcast player |
| **Interactive synthesis & DSP** | **Tone.js** (v15+) | Web Audio API graph, `Tone.Transport` scheduler, synths & effects | Web synthesizers, DAWs, generative/interactive music tools | Requires `await Tone.start()` inside a user gesture (`click`/`keydown`) before scheduling audio |

## Verified implementation idioms

### hls.js (Safari native fallback + fatal recovery + cleanup)

- Check `Hls.isSupported()` first; on Safari/iOS without MSE, fall back to `video.canPlayType('application/vnd.apple.mpegurl')` and assign `video.src` directly.
- Throttle `hls.recoverMediaError()` on fatal `MEDIA_ERROR` (e.g., 5-second cooldown) to avoid infinite reload loops, and always call `hls.destroy()` on unmount.

```ts
import Hls from 'hls.js';

export function attachHls(video: HTMLVideoElement, manifestUrl: string) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(manifestUrl);
    hls.attachMedia(video);
    return () => hls.destroy();
  }
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = manifestUrl;
  }
  return () => {
    video.removeAttribute('src');
    video.load();
  };
}
```

### Shaka Player (v5+)

- Call `shaka.polyfill.installAll()` once, verify `shaka.Player.isBrowserSupported()` (and `await shaka.Player.probeSupport()` when DRM/codecs are mandatory), attach with `await player.attach(video)`, and call `await player.destroy()` on unmount.

### wavesurfer.js (large files without client decode spikes)

- For long podcasts or streaming audio, pass **both** pre-computed `peaks` and `duration` to `WaveSurfer.create({ container, url, peaks, duration })` so the waveform renders instantly without downloading and decoding the entire audio file into memory. Always call `wavesurfer.destroy()` on unmount.

### Tone.js (user-gesture unlock & disposal)

- Never schedule or trigger audio on page load—browsers suspend `AudioContext` until a user gesture. Call `await Tone.start()` inside a `click` or `keydown` handler first, and call `.dispose()` on synths/effects when unmounting.

## Media accessibility & UX rules

- **Captions & transcripts**: attach `<track kind="captions" src="...vtt" srclang="en" label="English" default>` (and audio descriptions where visual-only information is critical).
- **No unmuted autoplay**: if ambient video autoplays, set `muted playsInline`, honor `prefers-reduced-motion`, and provide a visible pause control.
- **Keyboard & media session**: ensure Play/Pause, Seek (`ArrowLeft`/`ArrowRight`), Volume, Mute, Captions toggle, and Fullscreen are keyboard-operable with visible focus rings, and wire `navigator.mediaSession.metadata` for lock-screen/OS controls where appropriate.

## Do/don't pairs

| Do | Don't |
|---|---|
| Branch `Hls.isSupported()` with `video.canPlayType('application/vnd.apple.mpegurl')` fallback | Assume `hls.js` works on iOS Safari where MSE is unavailable |
| Call `hls.destroy()`, `player.destroy()`, `wavesurfer.destroy()`, and `synth.dispose()` on unmount | Leak media buffers, MSE decoders, or Web Audio nodes across route changes |
| Supply pre-computed `peaks` + `duration` to `wavesurfer.js` for long audio files | Force the browser to download and decode a 90-minute MP3 just to draw a waveform |
| Unlock Web Audio with `await Tone.start()` inside a `click`/`keydown` listener | Call `triggerAttackRelease()` on mount while `AudioContext` is suspended |
| Provide `<track kind="captions">` and keyboard-accessible controls | Ship muted-less autoplay or mouse-only custom scrubbers |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify player chunk lazy-loading (`static`), and test Safari/Chromium playback fallback, caption toggle, keyboard scrubbing, user-gesture audio unlock, and unmount cleanup in real browsers (`rendered`).
