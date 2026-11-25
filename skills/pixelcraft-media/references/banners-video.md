# SVG banners, programmatic video, and vector motion export

Vector banners, video loops, and motion graphics are consumed through crops, scaling, platform recompression, and host UI overlays outside the author's control. Build deterministically from real content and inspect the exported artifact.

## SVG banners and posters

SVG is ideal for deterministic banners because it is scalable, inspectable, and diffable—but it is not automatically accessible or portable.

Rules:

- set an explicit `viewBox` plus width/height and export mapping;
- include `<title>` and `<desc>` when SVG is inline in HTML; raster exports need platform alt text instead;
- do not assume viewer fonts—embed/convert text deliberately or export with bundled licensed fonts;
- verify text wrapping manually because ordinary SVG `<text>` does not reflow like HTML;
- strip scripts, foreignObject, and untrusted external URLs from crawler-facing or user-supplied SVG;
- test light and dark embedding contexts (`prefers-color-scheme` or solid backing) so transparent art never disappears or halos.

For repository banners/docs, export PNG/WebP fallbacks where inline SVG is blocked, preserving the source SVG and exact export command.

## Aspect-ratio variants

Design a system rather than center-cropping one master:

| Ratio | Typical frame | Role & mandatory safe inset |
|---|---:|---|
| 16:9 | 1920×1080 or 1280×720 | presentation, YouTube, landscape video, docs (`5–10%` edge inset; YouTube bottom-right duration badge clear) |
| 1:1 | 1080×1080 | square feed/embed (`>= 80 px` edge inset) |
| 9:16 | 1080×1920 | Reels / TikTok / Shorts: keep titles, faces, and burned-in captions clear of **`top >= 150–220 px`**, **`bottom >= 320–420 px`**, and **`right >= 120–160 px`** (`>= 60 px` left) |
| 1.91:1 / 2:1 | 1200×630 / 1280×640 | universal OG (`1000×500` center safe zone) / GitHub social preview |

Recompose hierarchy per ratio: never center-crop a `16:9` master into `9:16`—vertical feeds require stacking subject + open captions inside the `top 220 px .. bottom 1500 px`, `left 60 px .. right 920 px` clear corridor so TikTok/Reels/Shorts chrome never occludes copy.

## Remotion (v4+)

Remotion renders deterministic video from React components using frame-driven state (`useCurrentFrame()`, `useVideoConfig()`, `spring()`, `interpolate()`).

```tsx
import { Composition, OffthreadVideo, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', { weights: ['600', '700'], subsets: ['latin'] });

export const Root = () => (
  <Composition
    id="ReleaseHighlight"
    component={ReleaseHighlight}
    durationInFrames={180}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: 'Pixelcraft v2', clip: staticFile('demo.mp4') }}
  />
);
```

Remotion v4+ production rules:

- **`<OffthreadVideo>` vs `<Video>`**: prefer `<OffthreadVideo>` during headless/server renders—it decodes exact frames via native FFmpeg outside Chromium's `<video>` element, preventing dropped frames, seek drift, and browser codec mismatches; use `<Video>` primarily inside interactive browser `<Player>` previews.
- **Interactive preview (`@remotion/player`)**: embed `<Player>` in web apps for real-time parameter previewing and scrubbing without invoking server rendering on every edit.
- **Cloud rendering**: scale batch/user-generated exports with **Remotion Lambda** (AWS Lambda distributed chunk rendering) or **Remotion Cloud Run** rather than blocking web request threads.
- **Official v4 packages**: use `@remotion/transitions` (`<TransitionSeries>`), `@remotion/captions` (SRT/WebVTT parsing + timed captions), and `@remotion/google-fonts` (deterministic font loading before frame 0).
- Derive every pixel strictly from `frame` and props; never use `Date.now()`, `Math.random()` without `random(seed)`, or unawaited CSS transitions (`transition: all`) which desync during frame-by-frame capture.

## Motion Canvas and Revideo

**Motion Canvas** uses generator-based TypeScript scenes with a visual timeline editor; **Revideo** is the maintained headless-first fork of Motion Canvas built for CLI/server-side programmatic rendering, parameterized scenes, audio tracks, and cloud video pipelines.

```tsx
import { makeScene2D, Txt } from '@motion-canvas/2d';
import { createRef, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  // Frame 0 (0.0s) MUST render a legible title/poster immediately when autoplay is disabled
  view.add(
    <>
      <Txt ref={title} fill="#f8fafc" fontSize={84} y={-26} opacity={1}>Pixelcraft v2</Txt>
      <Txt ref={subtitle} fill="#94a3b8" fontSize={36} y={42} opacity={0}>Studio-Grade Motion</Txt>
    </>,
  );
  yield* waitFor(0.2);
  yield* subtitle().opacity(1, 0.45);
  yield* waitFor(1.2);
});
```

- Pick **Motion Canvas** for author-driven visual editing and technical explainer animations; pick **Revideo** (`@revideo/2d`, `@revideo/core`, `@revideo/renderer`) when you need headless CI/server video generation from the same generator paradigm;
- **Never start frame `0` (`0.0s`) empty or at `opacity={0}`**: paused embeds, reduced-motion fallbacks, and social feed scrubbers display `0.0s` whenever no external poster overrides it—render a legible title/poster state at `0.0s` before secondary transitions;
- use signals/layout references rather than visual guesses, pin project resolution/fps, and verify fonts in both editor and headless render.

## FFmpeg export pipeline

Standardize web and social video exports with explicit pixel format, container atom ordering, codec budget, loudness normalization, and caption tracks:

```sh
# 1. Universal H.264 MP4 (Safari/QuickTime/iOS safe + fast web start + -14 LUFS social/web loudness)
ffmpeg -i input.mov -i captions.vtt \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 160k -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
  -c:s mov_text -metadata:s:s:0 language=eng \
  -movflags +faststart output.mp4

# 2. Compact web loop replacing heavy animated GIFs (VP9 WebM + H.264 MP4 fallback)
ffmpeg -i source.mov -an -c:v libvpx-vp9 -crf 32 -b:v 0 -pix_fmt yuv420p loop.webm
ffmpeg -i source.mov -an -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart loop.mp4
```

Critical FFmpeg rules:

- **`-pix_fmt yuv420p` is mandatory for H.264 compatibility**: default `yuv444p` / 10-bit output renders black or fails to open in Safari, QuickTime, and iOS;
- **`-movflags +faststart`**: relocates the MP4 `moov` atom to the start of the file so browsers begin playback immediately instead of downloading the entire file first;
- **Codec ladder**: use H.264 (`libx264`, `-crf 18–23`) as the universal baseline; add VP9 (`libvpx-vp9`) or AV1 (`libsvtav1`) `<source>` variants for bandwidth-heavy loops where target decoders support them;
- **Audio loudness (`loudnorm`)**: normalize social and web video feeds (YouTube, Reels, TikTok, Shorts, X, LinkedIn) to `loudnorm=I=-14:TP=-1.5:LRA=11` (`-14 LUFS` integrated loudness, `-1.5 dBTP` true-peak ceiling); use `-16 LUFS` only for Apple Podcasts and spoken-word mobile audio;
- **Captions**: mux WebVTT/SRT soft tracks (`-c:s mov_text` for MP4) AND keep burned-in open captions inside vertical/feed safe zones for muted social autoplay;
- **MP4/WebM loops over heavy GIFs**: replace multi-megabyte GIFs with muted looping `<video autoplay loop muted playsinline poster="first-frame.webp">` (typically 5–10× smaller with full 24-bit color and 60 fps); use GIF only on surfaces that disallow video embeds.

## Lottie (`dotLottie`) and Rive vector export pipelines

- **Lottie (`dotLottie`, `.lottie`)**: package JSON animations + bitmap assets/themes into a compressed `.lottie` archive rather than shipping bloated raw `.json`. Strip unsupported After Effects expressions, merge/track-matte glitches, and verify playback in the exact target player (`@lottiefiles/dotlottie-web`, iOS/Android native).
- **Rive (`.riv`)**: export compact binary `.riv` files with explicit artboard bounds, state-machine inputs, embedded fonts (or vector outlines), and a static reduced-motion state/poster image. Never hide critical UI copy exclusively inside opaque vector animation files without accessible text equivalents.

## Captions, sound, and export verification

- Never rely on sound for essential meaning; avoid flashing/strobing luminance changes (>3 flashes/sec);
- keep burned-in captions inside platform safe zones and supply sidecar WebVTT/SRT where supported;
- inspect exported `ffprobe` metadata (dimensions, `pix_fmt`, fps, duration, codecs, bitrate, audio sample rate, byte size) (`static`) and inspect first/middle/last frames plus key transitions on light/dark backgrounds and mobile feed scale (`rendered`);
- reject endless floating gradients, fake tilted UI fly-throughs, sparkles replacing substance, and unreadable kinetic typography.
