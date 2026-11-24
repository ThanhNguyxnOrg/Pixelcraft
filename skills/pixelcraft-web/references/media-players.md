# Audio and video player engineering

Choose a media playback library by **streaming protocol (MP4/WebM vs HLS/DASH/MoQ), DRM requirement, custom UI ownership, and audio DSP/waveform needs**. Pair this reference with [video-media.md](video-media.md), [audio-reactive.md](audio-reactive.md), and [accessibility-performance.md](accessibility-performance.md). Never autoplay unmuted audio, and always include synchronized captions (`<track kind="captions">`) and keyboard-accessible controls (WCAG 1.2.2 & 2.1.1).

## Player & audio engine decision matrix

| Category | Tools | Protocols / model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Modern accessible player UI** | **Vidstack** (`@vidstack/react`, Web Components), **Media Chrome** (`media-chrome`), **Mux Player** (`@mux/mux-player`) | Composable `<media-player>` / Web Components wrapping native `<video>`, `hls.js`, DASH, captions, ARIA, and Media Session | Custom-branded or turnkey accessible video/audio players across React, Vue, Svelte, Astro, or vanilla HTML | **Mux Player** ties to Mux delivery; **Media Chrome** gives full chrome ownership while delegating streaming engine (`<hls-video>`) |
| **Adaptive streaming engines** | **`hls.js`** (v1.7+), **Shaka Player** (v5+), **`dash.js`** | `hls.js`: HLS via MSE / iOS 17.1+ `ManagedMediaSource`; **Shaka**: DASH + HLS + MoQ + DRM (Widevine/FairPlay/PlayReady); **`dash.js`**: MPEG-DASH reference | Production adaptive-bitrate video/live streaming; Shaka when DRM or multi-protocol DASH+HLS is required | Safari/iOS needs careful `ManagedMediaSource` vs native HLS handling (AirPlay/FairPlay/older iOS < 17.1) |
| **Classic plugin-based player** | **Video.js** | Skinned `<video>` + VHS adaptive engine + broad ad/analytics plugin ecosystem | Existing enterprise/media sites reliant on Video.js IMA/analytics plugins | Heavier CSS/plugin footprint than Vidstack or Media Chrome |
| **Waveform audio UI** | **`wavesurfer.js`** (v7+) | `<audio>` MediaElement (default) or WebAudio backend + Canvas waveform | Podcasts, voice notes, audio editors, music previews | Decoding multi-hour files client-side burns RAM/CPU unless you pass pre-computed `peaks` + `duration` |
| **Game / UI sound effects** | **`Howler.js`** | Web Audio API with HTML5 Audio fallback + audio sprites | UI sound effects, game SFX, pooled spatial/layered playback | Not an adaptive streaming video/podcast player |
| **Interactive synthesis & DSP** | **`Tone.js`** (v15+) | Web Audio API graph, `Tone.Transport` scheduler, synths & effects | Web synthesizers, DAWs, generative/interactive music tools | Requires `await Tone.start()` inside a user gesture (`click`/`keydown`) before scheduling audio |

## Verified implementation idioms

### Media Chrome & Vidstack (framework-agnostic accessible chrome)

- **Media Chrome**: compose semantic Web Component controls (`<media-controller>`, `<media-play-button>`, `<media-time-range>`, `<media-captions-button>`, `<media-fullscreen-button>`) around any `<video>` or `<hls-video>` element—works identically in React, Vue, Svelte, Astro, Rails, or plain HTML and styles via CSS custom properties (`--media-control-background`, `--media-accent-color`).
- **Vidstack**: use `<MediaPlayer>` + `<MediaProvider>` + `<DefaultVideoLayout>` (or headless `<Controls>`) for built-in HLS integration, keyboard shortcuts, caption styling, thumbnail scrubbers, and Media Session wiring.

```html
<!-- Media Chrome: custom-styled accessible player over semantic <video> -->
<media-controller style="--media-accent-color: var(--semantic-color-action);">
  <video slot="media" src="/media/talk.mp4" poster="/media/talk-poster.webp" playsinline crossorigin>
    <track kind="captions" src="/media/talk.en.vtt" srclang="en" label="English" default />
  </video>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-time-range></media-time-range>
    <media-time-display showduration></media-time-display>
    <media-mute-button></media-mute-button>
    <media-captions-button></media-captions-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

### `hls.js` + iOS 17.1+ `ManagedMediaSource` vs native HLS fallback

- Starting with **iOS/iPadOS 17.1**, Safari supports **`ManagedMediaSource` (MMS)**, so modern `hls.js` (`Hls.isSupported()`) can run MSE-style adaptive streaming on iPhone/iPad as well as desktop browsers!
- **Nuance**: keep the native `video.canPlayType('application/vnd.apple.mpegurl')` branch for **iOS < 17.1** and whenever **FairPlay DRM** or native **AirPlay** takes priority (note that `ManagedMediaSource` disables AirPlay unless you either prefer native HLS on Safari or attach a fallback `<source>`).
- Throttle `hls.recoverMediaError()` on fatal `MEDIA_ERROR` (e.g., 5-second cooldown) to avoid infinite reload loops, and always call `hls.destroy()` on unmount.

```ts
import Hls from 'hls.js';

export function attachHls(video: HTMLVideoElement, manifestUrl: string, preferNativeAppleHls = false) {
  const canPlayNative = Boolean(video.canPlayType('application/vnd.apple.mpegurl'));

  if (!preferNativeAppleHls && Hls.isSupported()) {
    const hls = new Hls();
    let lastRecoverAt = 0;
    hls.on(Hls.Events.ERROR, (_evt, data) => {
      if (data.fatal && data.type === Hls.ErrorTypes.MEDIA_ERROR && Date.now() - lastRecoverAt > 5000) {
        lastRecoverAt = Date.now();
        hls.recoverMediaError();
      }
    });
    hls.loadSource(manifestUrl);
    hls.attachMedia(video);
    return () => hls.destroy();
  }

  if (canPlayNative) {
    video.src = manifestUrl;
  }
  return () => {
    video.removeAttribute('src');
    video.load();
  };
}
```

### Shaka Player (v5+), `wavesurfer.js` (v7+), and `Tone.js` (v15+)

- **Shaka Player**: call `shaka.polyfill.installAll()` once, check `shaka.Player.isBrowserSupported()` (and `await shaka.Player.probeSupport()` when DRM/codecs are mandatory), attach with `await player.attach(video)`, and call `await player.destroy()` on unmount.
- **`wavesurfer.js`**: for long podcasts or streaming audio, pass **both** pre-computed `peaks` and `duration` to `WaveSurfer.create({ container, url, peaks, duration })` so the waveform renders immediately without decoding a 90-minute file into RAM. Call `wavesurfer.destroy()` on unmount.
- **`Tone.js`**: never schedule or trigger audio on mount—call `await Tone.start()` inside a user `click` or `keydown` handler first, and call `.dispose()` on synths/effects when unmounting.

## Media accessibility & Media Session rules

- **Captions & transcripts**: attach `<track kind="captions" src="...vtt" srclang="en" label="English" default>` and follow WCAG 1.2.2 / 2.2.2 / 2.3.1 in [accessibility-performance.md](accessibility-performance.md).
- **Keyboard & OS controls**: verify Play/Pause, Seek (`ArrowLeft`/`ArrowRight`), Volume, Mute, Captions toggle, and Fullscreen are keyboard-operable with visible focus rings, and populate `navigator.mediaSession.metadata` + action handlers for lock-screen/hardware media keys where appropriate.

## Do/don't pairs

| Do | Don't |
|---|---|
| Choose **Vidstack**, **Media Chrome**, or **Mux Player** for modern accessible player UI | Reach for stale unmaintained player skins or build mouse-only custom scrubbers |
| Handle both `Hls.isSupported()` (MSE + iOS 17.1+ `ManagedMediaSource`) and native Apple HLS fallback | Assume iOS never supports `hls.js`, or omit native fallback for older iOS / AirPlay / FairPlay |
| Throttle `hls.recoverMediaError()` and call `hls.destroy()` / `player.destroy()` / `wavesurfer.destroy()` / `synth.dispose()` on unmount | Leak media buffers, MSE decoders, or Web Audio nodes across route changes |
| Supply pre-computed `peaks` + `duration` to `wavesurfer.js` for long audio files | Force the browser to download and decode a 90-minute audio file just to draw a waveform |
| Unlock Web Audio with `await Tone.start()` inside a `click`/`keydown` listener | Call `triggerAttackRelease()` on mount while `AudioContext` is suspended |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify player chunk lazy-loading (`static`), and test Safari/iOS/Chromium HLS fallback, caption toggle, keyboard scrubbing, user-gesture audio unlock, and unmount cleanup in real browsers (`rendered`).
