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

- Read [references/social-cards.md](references/social-cards.md) for OG/platform dimensions (**Zalo**, Slack, iMessage, X, LinkedIn, WhatsApp, Discord, Telegram, Bluesky, YouTube, GitHub), the `1200×630` (`1000×500` safe zone) unfurl matrix, `1080×1920` (`9:16`) Reels/TikTok/Shorts pixel exclusion zones, JPEG/PNG unfurler fallbacks, and caching.
- Read [references/og-generation.md](references/og-generation.md) for Satori, `@vercel/og`, Next.js `ImageResponse`, Takumi, `@resvg/resvg-js`, Sharp, `@napi-rs/canvas`/`skia-canvas`, and Playwright HTML-to-screenshot OG pipelines.
- Read [references/banners-video.md](references/banners-video.md) for SVG banners/posters, Remotion v4+, Motion Canvas, Revideo, `0.0s` legible poster frames, FFmpeg (`-14 LUFS` loudness, `yuv420p`, `+faststart`), `dotLottie`/Rive vector exports, and `SRT`/`VTT` + burned-in captions.

For browser audio/video players and Web Audio DSP (`hls.js`, Shaka, Vidstack, Media Chrome, Video.js, Tone.js), use the `pixelcraft-web` skill.

## Required workflow

1. **Define placement.** Identify exact platforms/unfurlers, card type, feed context, static or animated media, localization, caption requirements, cache/update cadence, and click intent.
2. **Lock frame and pixel safe zones.** Keep `1200×630` (`1.91:1`) headlines/logos inside the **center `1000×500` safe box**, and keep `1080×1920` (`9:16`) vertical video copy clear of **`top >= 150–220 px`, `bottom >= 320–420 px`, and `right >= 120–160 px`** host UI rails.
3. **Reduce the message.** Use the minimum truthful content (`<= 6–8` words): product/name, one concrete claim or artifact, and recognizable visual evidence legible at `25%` thumbnail scale.
4. **Ship unfurler-safe formats & `0.0s` video posters.** Serve absolute `https://` **PNG or JPEG** (`< 300 KB` for WhatsApp/Zalo, `< 1 MB` general, fast crawl TTFB) because SVG (`og:image`) is rejected universally and WebP still fails in legacy enterprise/chat unfurlers; render a legible **`0.0s` poster frame** and normalize social/web audio to **`-14 LUFS` (`-1.5 dBTP`)**.
5. **Verify in context.** Inspect at 100%, `25–33%` thumbnail scale, dark/light feed surrounds, crop overlays, `ffprobe` metadata (`static`), and rendered frames (`rendered`).

## Non-negotiable rules

| Concern | Rule |
|---|---|
| truthfulness | No invented user counts, screenshots, awards, logos, testimonials, benchmarks, or product capabilities. |
| unfurler compatibility | Use `1200×630` (`1.91:1`, center **`1000×500` safe zone**), absolute `https://`, fast crawl response (`< 300 KB` WhatsApp/Zalo, `< 1 MB` Slack/iMessage/X/LinkedIn), and **PNG/JPEG `og:image`** (never SVG; avoid WebP-only `og:image` where chat unfurlers drop it). |
| `9:16` vertical exclusion zones | On `1080×1920` Reels/TikTok/Shorts, keep all titles, faces, and open captions clear of **`top >= 150–220 px`**, **`bottom >= 320–420 px`** (caption/CTA drawer), and **`right >= 120–160 px`** (like/comment/share rail). |
| `0.0s` poster, captions & `-14 LUFS` | Frame `0` (`0.0s`) must render a legible poster immediately (never `opacity={0}` black frames); pair muted autoplay video with **burned-in safe-zone captions or synced `SRT`/`VTT`**, and normalize web/social audio to **`loudnorm=I=-14:TP=-1.5:LRA=11`** (`-16 LUFS` for podcasts only). |
| anti-slop | Avoid purple-blue gradients, floating browser chrome mockups, generic rocket/sparkle art, unreadable code screenshots, and badge clutter unrelated to the subject. |

## Pre-submit checklist

- [ ] `1200×630` (`1000×500` center safe zone) or `1080×1920` (`top >= 150–220 px`, `bottom >= 320–420 px`, `right >= 120–160 px` clear) geometry verified;
- [ ] `og:image` uses absolute `https://`, **PNG/JPEG** unfurler-safe format, and `< 300 KB` (WhatsApp/Zalo) / `< 1 MB` byte budget with versioned cache-busting URL;
- [ ] core headline (`<= 6–8` words) survives `25–33%` thumbnail scale on both light and dark feed backgrounds;
- [ ] video exports render a legible **`0.0s` poster frame**, `yuv420p` + `+faststart`, **`-14 LUFS` (`-1.5 dBTP`)** audio, and **burned-in / `SRT` / `VTT` captions**;
- [ ] `ffprobe`/byte checks (`static`) separated honestly from rendered thumbnail/frame inspection (`rendered`) and untested platform crawlers (`not-checked`).
