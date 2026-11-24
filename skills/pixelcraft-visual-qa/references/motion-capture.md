# Motion capture and verification

A screenshot is one frame, not proof that motion works. For a motion task, capture both visual states and the transition between them.

## Capture plan

- Record target route, build/revision, viewport, DPR, browser, input modality, state, and reduced-motion setting.
- Capture named timeline milestones: initial, key reveal, interactive state, completed state, interrupted/closed state, and fallback.
- Record a screen video or interaction trace when timing, scrub, hover, drag, or route transitions matter.
- Test fast/reverse scroll, scrollbar drag, anchor navigation, resizing, font/image load, tab hide/show, route unmount, and reduced motion.
- Repeat with keyboard and touch; do not report pointer-only evidence as full interaction coverage.
- Check no hidden copy, lost focus, layout shift, input blocking, or stale animation after navigation.

## Determinism

- Freeze random seeds and time when possible.
- Use stable content/fixtures and wait for fonts/media to settle before capturing.
- Keep capture scale and viewport identical for before/after.
- Store screenshots/video/traces alongside an evidence manifest, redact sensitive content, and name the exact tested state.

## Evidence label

Mark actual screen recording/browser output rendered; source inspection static; visual taste comments model-judgment; inaccessible devices not-checked.
