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
| Slack | 1200×630 | 1.91:1; `< 1 MB` fast crawl | unfurls `og:title`/`og:description`/`og:image` (PNG/JPEG safest); supports `twitter:label1`/`twitter:data1` metadata rows |
| **Zalo** (chat & Official Account) | 1200×630 | 1.91:1; **`< 300 KB–500 KB`**, PNG/JPEG | Zalo link crawler caches `og:image` aggressively, requires fast public HTTPS TTFB (`< 2 s`), and frequently drops `svg`/`webp` or oversized PNGs—keep copy in the **center `1000×500` safe zone** so 1:1 / mobile chat list crops survive |
| WhatsApp | 1200×630 (or 1:1) | **strict `< 300 KB`** (target `< 200 KB`) | exceeding ~300 KB or slow TTFB causes WhatsApp to drop the thumbnail silently; declare `og:image:width`, `og:image:height`, `og:image:type`, and serve optimized **JPEG or indexed PNG** |
| Telegram | 1200×630 | 1.91:1; `< 1 MB` | uses `og:image` + `twitter:card="summary_large_image"`; refresh stale caches with `@WebpageBot` |
| iMessage / Apple Rich Links | 1200×630 | 1.91:1; `< 1 MB` PNG/JPEG | Apple `LPLinkMetadata` requires `og:image` (`>= 300px` wide so it does not collapse to a small icon; SVG `og:image` is ignored) plus `apple-touch-icon` |
| GitHub repository social preview | 1280×640 rec.; 640×320 min | exactly 2:1; PNG/JPG/GIF under 1 MB | upload in Settings → General → Social preview; keep essential content inside the central `1000×500` safe zone |
| Video / presentation landscape | 1920×1080 | 16:9 | standard video/slide frame; inset edges 5–10% |
| Vertical short video (`Reels / TikTok / Shorts`) | 1080×1920 | 9:16 | strict UI exclusion margins: **`top >= 150–220 px`**, **`bottom >= 320–420 px`**, **`right >= 120–160 px`** |
| Square feed / thumbnail fallback | 1080×1080 or 1200×1200 | 1:1 | use only when the platform/card type favors square |

## Safe-area & `9:16` exclusion-zone geometry

No single rectangle is universally safe. Lock layout guides to exact pixel coordinates:

1. **`1200×630` (`1.91:1`) universal OG safe zone (`1000×500` center box)**: inset at least **`100 px` left/right and `65 px` top/bottom** (`1000×500` inner box) so X (`2:1` `1200×600`), LinkedIn (`1200×627`), iMessage rounded bubbles, Slack, and Zalo mobile previews never clip headlines or brand marks;
2. **`1080×1920` (`9:16`) Reels / TikTok / YouTube Shorts exclusion zones**: host chrome covers three edges simultaneously—keep all headlines, speaker faces, and burned-in captions strictly clear of:
   - **`top >= 150–220 px`** (status bar, notch, search/live header),
   - **`bottom >= 320–420 px`** (account handle, expandable multi-line caption, audio marquee, shop/CTA pill, scrub bar),
   - **`right >= 120–160 px`** (vertical avatar, like, comment, bookmark, and share icon rail), plus `>= 60 px` left margin;
3. **YouTube `1280×720` thumbnails**: leave the bottom-right `~260×110 px` clear of words or faces for the duration timestamp badge;
4. export a crop & overlay contact sheet (`1200×630` + `1000×500` box, `2:1`, `9:16` UI mask, and `25%` thumbnail scale) rather than inspecting only the raw 100% canvas.

## Thumbnail legibility

Design at final dimensions, then verify scaled down:

- one short headline or product name (typically <= 6–8 words);
- test readability at **25–33% display size** (and ~160px width for YouTube/mobile feeds);
- prefer high x-height, sturdy weight, generous tracking, and strong foreground/background contrast;
- avoid thin strokes, dense code screenshots, tiny chart axes, busy textures behind text, and legal footnotes;
- use one dominant visual anchor: real product detail, simplified diagram, decisive metric, or recognizable mark;
- test light and dark host feed backgrounds so transparent PNG edges never halo or vanish.

## Metadata, format fallbacks, byte budgets, and delivery

- **Absolute `https://` + PNG/JPEG `og:image` compatibility**: **never point `og:image` or `twitter:image` at an `.svg`** (all major social/chat crawlers reject SVG for security), and **prefer optimized `.png` or `.jpg` over `.webp`/`.avif`** for `og:image` because Zalo, older Outlook/Slack unfurlers, LinkedIn edge scrapers, and enterprise link-preview proxies still drop WebP/AVIF thumbnails silently;
- include `og:title`, `og:description`, `og:image`, `og:image:secure_url`, `og:image:width` (`1200`), `og:image:height` (`630`), `og:image:type` (`image/png` or `image/jpeg`), `og:image:alt`, `twitter:card="summary_large_image"`, and `twitter:image:alt`;
- keep **WhatsApp / Zalo** OG assets **`< 200–300 KB`** (`< 1 MB` across Slack/iMessage/X/LinkedIn/Bluesky) with crawler response **`< 1.5–2.0 s`** (no auth wall, `robots.txt` block on `/og/*`, or slow cold-start timeouts);
- cache-bust via versioned path/query (`/og/v2/post-slug.png`) when updating artwork because Zalo, LinkedIn, Telegram (`@WebpageBot`), Slack, and iMessage cache unfurls aggressively.

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
