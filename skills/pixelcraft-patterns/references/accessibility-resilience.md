# Scrollytelling accessibility and resilience

- Maintain one logical DOM reading order even when a sticky visual remains in place.
- Provide a table of contents/direct chapter links and allow the user to bypass the narrative scene.
- Keep keyboard scroll keys, scrollbar, touch momentum, and browser history intact.
- Make focus visible and never move focus because a scroll threshold was crossed.
- Under reduced motion, render all chapters in normal flow and show final/static visuals.
- Do not auto-play audio. Provide transcript/captions for spoken content.
- Keep charts/data values available as text or tables with units and sources.
- Ensure long text, zoom, 200% text scale, RTL, and narrow layouts do not depend on pin geometry.
- Test disabled JavaScript or runtime failure where the project requires progressive enhancement.
- Treat the pinned scene as an enhancement; it must not hide the core message.
