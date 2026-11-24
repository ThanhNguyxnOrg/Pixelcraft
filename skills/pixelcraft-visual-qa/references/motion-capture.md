# Motion capture and verification

A screenshot is one frame, not proof that motion works. For a motion task, capture visual milestones, active animations, and the transition between states under both default and reduced-motion modes.

## Capture plan

- Record target route, build/revision, viewport, DPR, browser, input modality, state, and reduced-motion setting.
- Capture named timeline milestones: initial, mid-transition, settled/completed state, interrupted/closed state, and reduced-motion fallback.
- Record a screen video or interaction trace when timing, scrub, hover, drag, or route transitions matter.
- Test fast/reverse scroll, scrollbar drag, anchor navigation, resizing, font/image load, tab hide/show, route unmount, and reduced motion.
- Repeat with keyboard and touch; do not report pointer-only evidence as full interaction coverage.
- Check zero hidden copy, lost focus, layout shift, input blocking, or orphaned looping animations after navigation.

## Concrete Playwright / Chromium capture commands

```js
// Record video + Playwright trace + inspect Web Animations + verify reduced motion
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: 'visual-qa/videos', size: { width: 1280, height: 720 } },
});
await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });

// Inspect active animations (catch stuck loops or non-compositor transitions)
const running = await page.evaluate(() =>
  document.getAnimations().map((a) => ({
    name: a.animationName || a.transitionProperty || a.id,
    playState: a.playState,
    duration: a.effect?.getTiming().duration,
  }))
);

// Verify reduced-motion path explicitly
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.screenshot({ path: 'visual-qa/reduced-motion.png' });

await context.tracing.stop({ path: 'visual-qa/motion-trace.zip' });
await context.close(); // flushes recorded video file
```

For Chromium DevTools main-thread/compositor frame traces, wrap the interaction with `browser.startTracing(page, { path: 'visual-qa/perf-trace.json', screenshots: true })` and `await browser.stopTracing()`.

### Extract transition frames with FFmpeg

Convert recorded video into numbered PNG frames to inspect easing continuity, mid-flight clipping, and focus-ring stability:

```bash
mkdir -p visual-qa/frames
ffmpeg -i visual-qa/videos/transition.webm -vf "fps=12" visual-qa/frames/frame-%03d.png
```

## Determinism

- Freeze random seeds and virtual clocks when possible.
- Use stable content/fixtures and wait for `document.fonts.ready` and media decode before capturing.
- Keep capture scale and viewport identical for before/after comparisons.
- Store screenshots, videos, and traces alongside an evidence manifest, redact sensitive content, and name the exact tested state.

## Evidence label

Mark actual screen recording, extracted frames, or browser trace output `rendered`; source inspection `static`; visual taste comments `model-judgment`; inaccessible devices `not-checked`.
