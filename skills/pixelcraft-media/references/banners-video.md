# SVG banners and motion media

Vector banners and video frames share one problem: they are consumed through crops, scaling, compression, and platform UI outside the author's control. Build from real content and validate the exported artifact.

## SVG banners and posters

SVG is ideal for deterministic banners because it is scalable, inspectable, and diffable—but it is not automatically accessible or portable.

Rules:

- use a correct `viewBox` and explicit width/height/export mapping;
- include `<title>` and `<desc>` when SVG is inline in HTML; raster exports need platform alt text instead;
- do not assume viewer fonts. Embed/convert text deliberately or ship/export with licensed font assets;
- verify text wrapping yourself—ordinary SVG text does not flow like HTML;
- avoid external images/fonts/scripts in untrusted or crawler-facing SVG; SVG can carry active content depending on serving context;
- sanitize user-controlled SVG before serving it;
- simplify paths enough for file size but preserve sharp edges at target scale;
- test light/dark embedding contexts; transparent art can disappear or halo.

For repository banners/docs, export PNG/WebP fallbacks where inline SVG is not supported. Preserve the source SVG and exact export preset.

## Aspect-ratio variants

Design a system, not one cropped master:

| Ratio | Typical frame | Role |
|---|---:|---|
| 16:9 | 1920×1080 or 1280×720 | presentation, landscape video, docs |
| 1:1 | 1080×1080 | square feed/embed |
| 9:16 | 1080×1920 | story/short vertical video |
| 2:1 | 1280×640 | GitHub social-preview baseline |

Recompose hierarchy for each ratio: square favors centered single-anchor compositions; vertical needs stacked hierarchy and platform-overlay awareness; landscape supports lateral sequencing. Do not blindly center-crop every frame.

## Remotion

Remotion renders videos from React components using frames and composition metadata. Core shape:

```jsx
import { Composition } from 'remotion';

export const Root = () => (
  <Composition
    id="LaunchCard"
    component={LaunchCard}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: 'Pixelcraft' }}
  />
);
```

Inside a component use hooks/utilities such as `useCurrentFrame()`, `useVideoConfig()`, `spring()`, `interpolate()`, `Sequence`, `Img`, `Audio`, `Video`/`OffthreadVideo`, and `staticFile()` according to the installed version. Render locally/CI through the documented CLI or `renderMedia()` programmatic API.

Rules:

- derive every visual state deterministically from frame/config/props;
- pin `fps`, duration, dimensions, and output codec/container;
- use `calculateMetadata` when dimensions/duration depend on props/data;
- avoid browser-only APIs/random time/network state unless explicitly controlled;
- preload or bundle fonts/assets; do not depend on unstable remote media;
- test audio sync, dropped frames, alpha/transparent output, color space, and render concurrency;
- keep captions as timed data rather than burned-in decoration only; supply caption files where platform supports them.

## Motion Canvas

Motion Canvas uses generator-based TypeScript scenes and a visual editor/player model. Typical scene style:

```tsx
import { makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  view.add(<Txt ref={title} fill="white" fontSize={96}>Pixelcraft</Txt>);
  yield* title().opacity(1, 0.5);
  yield* waitFor(1);
});
```

Exact imports/animation helpers depend on version. Rules:

- use signals/layout references rather than visual guesses for alignment;
- treat project settings (resolution/framerate/duration) as the artifact contract;
- verify fonts in both editor preview and final render;
- test deterministic output by rerendering the same revision;
- use motion to establish object constancy or sequence—not constant floating decoration.

## Captions, sound, and accessibility

- never rely on sound for essential meaning;
- provide captions/subtitles where the platform supports them; burned-in text must remain inside safe zones;
- avoid flashing/strobing content and rapid full-screen luminance changes;
- preserve color-independent meaning and sufficient contrast;
- provide meaningful title/alt/context where the host platform supports it;
- respect reduced-motion expectations in embeds and avoid autoplay sound.

## Export verification

- inspect exact dimensions/frame rate/duration/codec/container/file size/audio sample rate;
- inspect first/middle/last frames and motion-critical transitions;
- test on device/feed scale and in light/dark contexts;
- validate transparency/background behavior;
- compare audio loudness/sync when audio exists;
- test compression artifacts in the target platform or label platform verification `not-checked`;
- keep deterministic seeds/settings and source assets under version control where licensing permits.

## Anti-slop warnings

Reject endless floating gradients, fake product UI flying in depth without purpose, particles/sparkles replacing content, unreadable kinetic typography, cinematic trailers for mundane documentation updates, and logo animations with no information value. Motion should answer: what changed, where did it come from, what should the viewer understand next?
