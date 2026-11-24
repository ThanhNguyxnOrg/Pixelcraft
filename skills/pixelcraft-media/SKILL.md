---
name: pixelcraft-media
description: Designs and verifies social cards, Open Graph/Twitter images, YouTube thumbnails, repository banners, SVG posters, video frames, and motion graphics for external platforms. Use for OG/social preview generation, 1200×630 cards, GitHub 1280×640 previews, Bluesky/Discord/WhatsApp/Slack/Telegram embeds, 16:9/9:16/1:1 media, platform safe zones, thumbnail legibility, Satori/@vercel/og/ImageResponse, Takumi, Resvg, Sharp, SVG banners, Remotion, Motion Canvas, Revideo, FFmpeg, dotLottie/Rive export, caching, and truthfulness review.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft media

Media assets are constrained interfaces viewed outside your product. Platform cropping, compression, overlay UI, dark/light contexts, feed scale, caching, and screen density are part of the design. A beautiful full-size export that is illegible as a thumbnail is failed media.

## Surface craft

Design the focal subject and minimum readable message for the smallest real crop, then place secondary text inside a measured safe zone. Inspect platform recompression, dark/light surroundings and the static first frame/poster. Never promise thumbnail legibility from the full-size canvas.

## References

- Read [references/social-cards.md](references/social-cards.md) for OG/platform dimensions (YouTube thumbnails, GitHub, Bluesky, Mastodon, Discord, Slack, WhatsApp, Telegram, iMessage, X/LinkedIn), safe areas, crop behavior, thumbnail legibility, metadata, caching, and validation.
- Read [references/og-generation.md](references/og-generation.md) for Satori, `@vercel/og`, Next.js `ImageResponse`, Takumi, `@resvg/resvg-js`, Sharp, `@napi-rs/canvas`/`skia-canvas`, and Playwright HTML-to-screenshot OG pipelines.
- Read [references/banners-video.md](references/banners-video.md) for SVG banners/posters, Remotion v4+, Motion Canvas, Revideo, FFmpeg export pipelines, `dotLottie`/Rive vector exports, aspect-ratio variants, captions, and export verification.

For browser audio/video players and Web Audio DSP (`hls.js`, Shaka, Vidstack, Media Chrome, Video.js, Tone.js), use the `pixelcraft-web` skill.

## Required workflow

1. **Define placement.** Identify exact platforms/clients, card type, feed context, static or animated media, localization, accessibility/caption requirements, cache/update cadence, and whether clicks are expected.
2. **Choose frame and safe area.** Start from the platform table; preserve critical content inside conservative central regions. Never assume one crop fits every client.
3. **Reduce the message.** Use the minimum truthful content: product/name, one concrete promise or artifact, recognizable visual evidence. Remove anything unreadable at thumbnail scale.
4. **Implement with renderer constraints.** Static SVG/PNG generation, browser capture, Satori/ImageResponse, Remotion, or Motion Canvas each impose different layout/font/security limits.
5. **Verify in context.** Inspect at actual pixel size, scaled thumbnail, dark/light embed context, compression, crop variants, screen reader/alt metadata where applicable, and platform preview/debugger when available.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| truthfulness | No invented user counts, screenshots, awards, logos, testimonials, benchmarks, or product capabilities. |
| legibility | Text must survive thumbnail scale and platform compression; if a detail cannot be read, remove or enlarge it. |
| safe area | Essential text/logos never touch edges or platform overlay/crop zones. |
| renderer truth | Do not use unsupported CSS/font/asset behavior because browser JSX looks similar. Validate the actual renderer/version. |
| accessibility | Provide meaningful alt text/link context where platforms support it; video needs captions/subtitles and must not autoplay sound by default. |
| cache awareness | Social platforms cache aggressively. Use validation/cache-busting/deployment sequencing consciously. |
| anti-slop | Avoid purple-blue gradients, floating browser chrome mockups, generic rocket/sparkle art, unreadable code screenshots, and badge clutter unrelated to the subject. |

## Pre-submit checklist

- [ ] target platforms/card types/frame ratios/safe zones are explicit;
- [ ] core message is readable at actual thumbnail size;
- [ ] text contrast is checked against real background/compression;
- [ ] fonts are licensed/embedded/loaded in the format required by the renderer;
- [ ] generated image/video dimensions, file type, and file size match the target;
- [ ] absolute metadata URLs and cache behavior are correct;
- [ ] alt/caption/accessibility path exists where the platform supports it;
- [ ] final evidence states which platform previews were actually inspected versus `not-checked`.
