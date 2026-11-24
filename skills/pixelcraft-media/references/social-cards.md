# Social cards, frames, and platform safe zones

Platform behavior changes frequently and varies by client. Treat dimensions and constraints below as production baselines, then validate with current platform debuggers/previews before release.

## Working size table

| Placement | Working frame | Ratio / constraint | Practical guidance |
|---|---:|---|---|
| Open Graph default (`og:image`) | 1200×630 | 1.91:1 | safest general baseline; PNG/JPEG/WebP depending on client support |
| YouTube thumbnail | 1280×720 | 16:9; JPG/PNG/WebP under 2 MB | keep critical text/faces out of the **bottom-right duration timestamp overlay zone** (~20% width × 15% height); validate legibility at mobile feed width (~160px) |
| X / Twitter large card | 1200×600 (or 1200×630) | 2:1 / 1.91:1; under 5 MB | set `twitter:card="summary_large_image"` + `twitter:image:alt`; verify crop at 2:1 |
| Facebook / Meta & LinkedIn | 1200×630 / 1200×627 | ~1.91:1 | use absolute HTTPS URL; minor vertical crop difference makes edge text unsafe |
| Bluesky | 1200×630 | 1.91:1; blob limit ~1 MB | AT Protocol card crawler fetches `og:image` and re-encodes to JPEG/WebP; requires public unauthenticated fetch |
| Mastodon / Fediverse | 1200×630 | 1.91:1 | federated instances crawl/cache independently and crop across web/Ivory/Elk clients; set `og:image:alt` and optional `fediverse:creator` |
| Discord | 1200×630 | 1.91:1 | include `twitter:card="summary_large_image"`—without it Discord often shrinks `og:image` to a small right-aligned square thumbnail; `<meta name="theme-color">` sets the embed accent stripe |
| Slack | 1200×630 | 1.91:1 | unfurls `og:title`/`og:description`/`og:image`; supports `twitter:label1`/`twitter:data1` metadata rows |
| WhatsApp | 1200×630 (or 1:1) | **strict < 300 KB** (target < 200 KB) | exceeding ~300 KB or slow TTFB causes WhatsApp to drop the thumbnail silently; declare `og:image:width`, `og:image:height`, `og:image:type`, and serve optimized JPEG/WebP/palette PNG |
| Telegram | 1200×630 | 1.91:1 | uses `og:image` + `twitter:card="summary_large_image"`; refresh stale caches with `@WebpageBot` |
| iMessage / Apple Rich Links | 1200×630 | 1.91:1 | Apple `LPLinkMetadata` prefers `og:image` (>= 300px wide so it does not collapse to a small icon) plus `apple-touch-icon` fallback |
| GitHub repository social preview | 1280×640 rec.; 640×320 min | exactly 2:1; PNG/JPG/GIF under 1 MB | upload in Settings → General → Social preview; keep essential content inside the central safe zone |
| Video / presentation landscape | 1920×1080 | 16:9 | standard video/slide frame; inset edges 5–10% |
| Vertical short video / story | 1080×1920 | 9:16 | platform UI buttons/captions cover right/bottom/top edges; use platform safe overlays |
| Square feed / thumbnail fallback | 1080×1080 or 1200×1200 | 1:1 | use only when the platform/card type favors square |

## Safe-area design

No single rectangle is universally safe. Apply layered protection:

1. keep logos and text at least 5–8% of frame width/height away from edges;
2. for **YouTube thumbnails**, leave the bottom-right corner clear of headlines, numbers, or focal expressions so the duration badge never covers them;
3. for **GitHub's 2:1 preview**, treat the central band (middle ~60% width/height) as the must-survive zone;
4. for **vertical 9:16 video**, keep headlines and captions out of the top ~15%, bottom ~20–25%, and right ~15% interaction column;
5. export a crop contact sheet (1.91:1, 2:1, 16:9, 1:1, and 25% thumbnail scale) rather than inspecting only the 100% master.

Never place critical meaning in corners—corners are the first casualty of rounded masks, crop variations, duration badges, and compression.

## Thumbnail legibility

Design at final dimensions, then verify scaled down:

- one short headline or product name (typically <= 6–8 words);
- test readability at **25–33% display size** (and ~160px width for YouTube/mobile feeds);
- prefer high x-height, sturdy weight, generous tracking, and strong foreground/background contrast;
- avoid thin strokes, dense code screenshots, tiny chart axes, busy textures behind text, and legal footnotes;
- use one dominant visual anchor: real product detail, simplified diagram, decisive metric, or recognizable mark;
- test light and dark host feed backgrounds so transparent PNG edges never halo or vanish.

## Metadata, byte budgets, and delivery

- use absolute HTTPS URLs for `og:image` and `twitter:image`;
- include `og:title`, `og:description`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, `twitter:card="summary_large_image"`, and `twitter:image:alt`;
- keep WhatsApp/messenger-targeted OG assets **under 200–300 KB** (prefer JPEG/WebP or indexed PNG when photography or gradients are present);
- ensure crawler access: no auth wall, robots block, redirect loops, slow SSR generation (>3s timeouts drop previews in WhatsApp/Slack/Discord), or hotlink protection;
- cache-bust via versioned query/path hash (`/og/v2/post-slug.png`) when updating artwork because social crawlers cache URLs aggressively.

## Composition patterns

- **artifact-first:** real product interface cropped intentionally and enlarged;
- **statement-first:** short claim/name in editorial typography with one supporting visual motif;
- **system-first:** architecture/flow diagram simplified to one readable idea;
- **identity-first:** bold mark/wordmark only when audience recognition already exists.

Anti-slop: centered logo over purple-blue gradient, floating glass browser chrome, random rocket/sparkle clip art, fake avatars, tiny feature checklists, and unrelated stock photos.

## Verification matrix

- inspect exported file dimensions, MIME type, and exact byte count against target caps (WhatsApp <300 KB, GitHub <1 MB, YouTube <2 MB) (`static`);
- inspect at 100%, 25–33% thumbnail scale, and light/dark feed backgrounds (`rendered`);
- verify YouTube bottom-right safe zone and 2:1 / 1.91:1 / 1:1 crop overlays (`rendered`);
- test target crawler/debugger previews (or explicitly label uninspected platforms `not-checked`);
- confirm `og:image:alt`, `twitter:card`, absolute HTTPS URLs, and reproducible export preset (`static`).
