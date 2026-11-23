# Social cards, frames, and platform safe zones

Platform behavior changes often and varies by client. Treat dimensions below as production baselines, then validate with current platform documentation/debuggers before release. Do not copy third-party size lists as immutable truth.

## Working size table

| Placement | Working frame | Ratio / constraint | Practical guidance |
|---|---:|---|---|
| Open Graph default | 1200×630 | 1.91:1 | safest general `og:image` baseline; PNG/JPEG/WebP depending platform support |
| Facebook/Meta link preview | 1200×630 baseline | about 1.91:1 | use absolute HTTPS URL; inspect Sharing Debugger/cache behavior |
| LinkedIn link preview | 1200×627 baseline | close to 1.91:1 | minor crop difference means edge text is unsafe |
| X/Twitter large card | 1200×600 baseline | 2:1 target | supply accurate `twitter:card`/image metadata; verify current card type |
| square thumbnail fallback | 1200×1200 or platform-specific square | 1:1 | use only when platform/card type explicitly favors square |
| GitHub repository social preview | 1280×640 recommended; 640×320 minimum | exactly 2:1; PNG/JPG/GIF under 1 MB | upload in repository Settings → General → Social preview; keep essential content in a conservative central safe area |
| video/presentation landscape | 1920×1080 | 16:9 | standard video/slide frame; edges still need inset |
| vertical short video/story | 1080×1920 | 9:16 | platform UI overlays top/bottom/side; use platform-specific safe templates |
| square feed/video | 1080×1080 | 1:1 | validate feed crop and compression |

File-size/type limits are platform-specific. GitHub's documented repository preview rules are the most concrete here: recommended 1280×640, minimum 640×320, PNG/JPG/GIF, under 1 MB. For other platforms, confirm current crawler/card documentation instead of inventing exact cache or file-size guarantees.

## Safe-area design

No single rectangle is universally safe. Apply layered protection:

1. keep logos/text at least 5% of frame width/height away from edges;
2. keep essential content inside the central horizontal band for landscape cards;
3. for GitHub's 2:1 preview, treat the central region—approximately the middle half of width and height—as the must-survive zone and inspect actual shares;
4. for vertical video, consult current platform UI overlays because buttons/captions/progress bars cover different regions;
5. export crop/contact-sheet variants rather than inspecting only the master frame.

Never put critical meaning in corners. Corners are the first casualty of cropping, overlay badges, player chrome, rounded masks, and compression artifacts.

## Thumbnail legibility

Design at final dimensions but inspect scaled down. Practical rules:

- one short headline or product name; usually fewer than ~8 words unless the brand requires more;
- minimum effective type size is whatever remains readable at feed scale—test at 25–33% display size, not just 100%;
- prefer high x-height, sturdy weight, generous letterspacing, and strong contrast;
- avoid thin strokes, dense code/screenshots, small chart axes, texture behind text, and multi-line legal copy;
- use one dominant visual anchor: product artifact, diagram, mark, number, or distinctive composition;
- test light/dark feed backgrounds because transparent PNG edges/halos can fail.

## Metadata and delivery

- use absolute HTTPS URLs for `og:image`/Twitter metadata;
- include accurate `og:title`, `og:description`, canonical URL, image dimensions/alt metadata where supported;
- ensure crawler access: no authentication, robots block, broken redirect, intermittent certificate, or hotlink protection;
- serve correct content type/cache headers and keep the URL stable when appropriate;
- social platforms cache aggressively. Debugging/refresh tools and deployment sequencing matter; changing pixels at the same URL may not propagate immediately;
- localization needs separate metadata/assets only when the platform/link resolution can actually select them.

## Composition patterns

Useful patterns:

- **artifact-first:** product screenshot/interface detail cropped intentionally and enlarged;
- **statement-first:** short claim/name in editorial typography with one supporting visual motif;
- **system-first:** diagram/map/flow simplified to one readable idea;
- **identity-first:** strong logo/wordmark only when recognition already exists.

Anti-slop pattern: centered logo over gradient, floating glass browser frame, random sparkle/rocket, fake user avatars, “Do more with less” copy, tiny feature checklist, and unrelated stock imagery. Distinctiveness should come from the subject's real material and disciplined scale contrast.

## Verification matrix

- inspect exported file dimensions/type/bytes;
- inspect at 100%, feed scale, and mobile density;
- inspect light/dark feed backgrounds;
- test crawler/debugger/share preview when available;
- verify compression/crop in target client or label it `not-checked`;
- confirm alt text/metadata/link destination;
- retain source file/export preset for repeatable updates.
