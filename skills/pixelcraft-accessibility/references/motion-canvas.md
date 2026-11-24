# Motion, canvas, and media accessibility

## Motion and flashing thresholds

- **Reduced motion (`prefers-reduced-motion: reduce` / OS Reduce Motion):** replace large spatial movement, zoom, parallax, spin, or auto-advance with an instant state change or short opacity crossfade. Preserve functional feedback (state label, icon, tone, focus ring)—never delete confirmation when reducing motion.
- **WCAG 2.2.2 Pause, Stop, Hide (`> 5 s`):** any automatically starting moving, blinking, scrolling, or auto-updating content that lasts longer than 5 seconds and appears alongside other content must provide a keyboard-operable **Pause, Stop, or Hide** mechanism (unless essential).
- **WCAG 2.3.1 Three Flashes or Below Threshold (`≤ 3 flashes/s`):** never flash any visual area more than three times in any one-second period (or stay strictly below WCAG general-flash and saturated-red flash thresholds).
- **Reduced transparency (`prefers-reduced-transparency: reduce`):** any translucent glass or blur overlay sitting over moving video, WebGL, or complex imagery must switch to an opaque high-contrast surface token so background movement never bleeds through text.
- **Input parity:** never require hover, drag, or custom-cursor precision to discover or activate an essential action; pair every pointer interaction with focus, keyboard, and touch alternatives.

## Canvas and WebGL DOM fallback

Pixels painted onto `<canvas>` (2D, PixiJS, Three.js, WebGL/WebGPU) are invisible to screen readers, search-in-page, translation tools, and keyboard navigation unless backed by real DOM:

- Keep primary headings, prices, instructions, and primary action controls in ordinary semantic DOM—never bake readable UI copy exclusively into shaders or canvas textures.
- Provide fallback DOM inside `<canvas>` (or an adjacent visually structured summary/data table) with `role="img"` / `aria-label` for non-interactive scenes, or real focusable `<button>` / data controls synchronized with canvas hit regions for interactive scenes:

```html
<figure class="scene-shell">
  <canvas id="orbit-canvas" width="960" height="540"
          role="img" aria-labelledby="orbit-title" aria-describedby="orbit-summary">
    <!-- Accessible fallback DOM exposed to assistive technology and no-WebGL contexts -->
    <p id="orbit-summary">Interactive 3D view of Sensor Node X2 showing intake vent, optical port, and battery latch.</p>
  </canvas>
  <figcaption id="orbit-title">Sensor Node X2 assembly</figcaption>
  <div class="scene-controls" role="group" aria-label="Viewpoint controls">
    <button type="button" data-view="front">Front view</button>
    <button type="button" data-view="ports">Port detail</button>
    <button type="button" aria-pressed="false" data-action="pause">Pause rotation</button>
  </div>
</figure>
```

- **Overlay `inert` background handling:** when a modal dialog or inspector opens above an interactive canvas or WebGL scene, apply `inert` to the background canvas shell (or use `<dialog showModal()>`) so Tab focus, keyboard shortcuts, and screen-reader virtual cursors cannot fall into obscured scene controls behind the overlay; restore focus to the trigger on close.
- **Static & failure fallback:** provide a crisp static poster/SVG or structured table when WebGL context is lost, GPU acceleration is disabled, or `prefers-reduced-motion: reduce` is active.

## Video and audio

- Include `<track kind="captions">` for speech and meaningful non-speech sound cues, `<track kind="descriptions">` (or synced audio description) when visual-only information is essential, and a text transcript for informational recordings:

```html
<video controls preload="metadata" poster="/media/demo-poster.webp">
  <source src="/media/demo.mp4" type="video/mp4">
  <track kind="captions" src="/media/demo-en.vtt" srclang="en" label="English" default>
  <track kind="descriptions" src="/media/demo-desc-en.vtt" srclang="en" label="Audio descriptions">
</video>
```

- Never autoplay audio without explicit user intent; ambient muted background video must pause under `prefers-reduced-motion: reduce` and expose a visible, keyboard-reachable Pause/Play control whenever playback exceeds 5 seconds.
- Preserve native or accessible custom controls with visible focus, `≥ 24×24` CSS px (`44pt`/`48dp` touch) targets, and `Label in Name` parity.

## Verification checklist

- Emulate `prefers-reduced-motion: reduce` and `prefers-reduced-transparency: reduce` and confirm every state change and glass overlay stays clear (`rendered`).
- Disable WebGL / force context loss (`WEBGL_lose_context`) and confirm fallback DOM/poster communicates core content (`rendered`).
- Open any overlay above canvas/video and Tab through the page to confirm `inert` / `showModal()` traps focus cleanly (`rendered`).
- Verify `<track kind="captions">` renders readable captions at 200% zoom and no content flashes `> 3/s` or animates unpausably `> 5s` (`rendered`).
