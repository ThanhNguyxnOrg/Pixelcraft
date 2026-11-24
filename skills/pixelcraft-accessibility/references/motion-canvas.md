# Motion and canvas accessibility

## Motion

- Honor prefers-reduced-motion and platform equivalents. Replace large movement, zoom, parallax, spin, or auto-advance with stable state/fade/static content.
- Preserve feedback when movement is reduced; use a state label, icon, tone, or immediate visual change.
- Never require hovering to discover or activate an essential action.
- Pair pointer hover/drag/magnetic behavior with focus, keyboard, and touch alternatives.
- Keep focus when content is transformed or moved; restore focus when dialogs/overlays close.
- Avoid flashing and rapid alternating contrast. Give users control over long-running animation.

## Canvas and graphics

- Keep headings, instructions, controls, prices, labels, and key data in DOM.
- Provide an accessible name/description and a text/table summary for meaningful canvas information.
- Provide keyboard alternatives for interactive graphics and a static or simplified fallback.
- Do not communicate state only through color, sound, motion, or spatial position.
- Test zoom/text scaling and high contrast without clipping key content.

## Video/audio

- Captions for speech and meaningful audio; transcript where appropriate.
- Explicit pause/mute/stop for ambient or automatically starting media.
- Do not play audio without user intent.
