# Video and media experiences

For adaptive streaming (`hls.js`, Shaka Player, `dash.js`), DRM, and accessible player UI suites (Vidstack, Media Chrome, Mux Player, Video.js), read [media-players.md](media-players.md).

## Media decision

Use a standard HTML `<video>` element when the user needs to watch a clip. Use a WebGL/WebGPU video texture only when mapping video onto 3D/shader geometry materially improves the experience. Use WebCodecs only for frame-level decode/encode pipelines (browser video editors, custom muxers) after checking codec and cross-browser support.

## Delivery & codec `<source>` ordering

- Start with a `poster` and explicit `width`/`height` (or CSS `aspect-ratio`) to prevent layout shift.
- Order `<source>` tags from **most efficient modern codec to widest fallback** with explicit `codecs` parameters so browsers pick the best hardware-decoded stream without probing every file: **AV1** (`av01`) → **HEVC** (`hvc1` for Safari/Apple hardware decode) or **VP9** (`vp09`) → **H.264** (`avc1` universal fallback).
- Defer below-fold or interaction-triggered media (`preload="none"` or `"metadata"`).
- Require synchronized captions (`<track kind="captions">`) for prerecorded informative video (WCAG 1.2.2; see [accessibility-performance.md](accessibility-performance.md)).
- Honor autoplay policy: ambient video must be `muted playsinline`, skip/pause under `prefers-reduced-motion: reduce`, and always expose a visible pause control (WCAG 2.2.2).

```html
<video
  width="1280"
  height="720"
  poster="/media/preview-poster.webp"
  preload="metadata"
  playsinline
  controls
>
  <source src="/media/demo-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
  <source src="/media/demo-hevc.mp4" type='video/mp4; codecs="hvc1.1.6.L93.B0"' />
  <source src="/media/demo-vp9.webm" type='video/webm; codecs="vp09.00.41.08"' />
  <source src="/media/demo-h264.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
  <track kind="captions" src="/media/demo.en.vtt" srclang="en" label="English" default />
</video>
```

## Video textures & `requestVideoFrameCallback`

When uploading `<video>` frames to Canvas 2D, WebGL, or WebGPU textures, prefer **`video.requestVideoFrameCallback()`** (with a `requestAnimationFrame` fallback) so textures only re-upload when a **new decoded video frame arrives** instead of uploading duplicate 24/30 fps frames at 60/120 Hz:

```ts
let handle = 0;
let cancelled = false;

function scheduleFrame(video: HTMLVideoElement, uploadTexture: () => void) {
  if (cancelled) return;
  if ('requestVideoFrameCallback' in video) {
    handle = video.requestVideoFrameCallback(() => {
      uploadTexture();
      scheduleFrame(video, uploadTexture);
    });
  } else {
    handle = requestAnimationFrame(() => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) uploadTexture();
      scheduleFrame(video, uploadTexture);
    });
  }
}

// Teardown:
// cancelled = true;
// if ('cancelVideoFrameCallback' in video) video.cancelVideoFrameCallback(handle);
// else cancelAnimationFrame(handle);
```

- Set `video.crossOrigin = 'anonymous'` (with matching CORS headers on the media host) before uploading to WebGL/WebGPU textures, handle play promise rejections and decode stalls, and dispose GPU textures on unmount.
- Keep a static poster or normal `<video>` fallback when GPU contexts fail.

Official docs:
- HTMLVideoElement: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
- `requestVideoFrameCallback`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback
- WebCodecs: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API
