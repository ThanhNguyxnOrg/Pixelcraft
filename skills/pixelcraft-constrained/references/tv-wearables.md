# TV, console, and wearable interfaces

## TV/console fundamentals

Verified constraints:

- Android frames TV as a typical **3 meter / 10 foot** lean-back surface.
- Android TV layout guidance says to design at **MDPI 960×540** so proportional scaling can target HD/4K; assets should aim for 1080p.
- For overscan safety, Android recommends keeping important elements inside about a **5% margin**: 48dp left/right and 27dp top/bottom at the 960×540 baseline. Background art may extend beyond the safe area.
- Apple's current typography table lists tvOS default text size **29pt** and minimum **23pt**; watchOS default **16pt** and minimum **12pt**. Treat platform guidance as minimum legibility input, not proof.

TV rules:

- use sparse hierarchy, large targets, high contrast, and visible focus state;
- reduce reading volume; move detail into a focused panel/modal only when necessary;
- design horizontal rows/grids around directional scanning, not pointer hover;
- instant feedback on every D-pad press; long latency without focus movement feels broken;
- remember row/column position when returning from detail/playback;
- never use tiny web-style tooltips, hover-only affordance, right-click menus, or dense tables.

## D-pad spatial navigation and focus engines

Model focus as explicit state:

| State | Required behavior |
|---|---|
| initial entry | predictable useful default, not arbitrary first DOM node |
| directional move | choose nearest meaningful candidate in direction with hysteresis/dead-zone handling |
| boundary | either stop visibly, wrap intentionally, or move to adjacent region/chrome consistently |
| content refresh | preserve focus object identity; if removed, choose logical fallback |
| modal/overlay | contain focus while open and restore invoking focus on close |
| disabled/hidden | remove from navigation order without causing a jump |
| scroll container | focus movement scrolls enough to reveal target without overshooting |

Directional navigation algorithms typically score candidates using primary-axis distance, orthogonal alignment/overlap, and penalties for backwards/offset movement. Tune for large tiles and rows; pure geometric nearest-neighbor often jumps unexpectedly. Test fastest repeated input, held-down repeat, diagonal pads/joysticks, empty rows, asynchronous insertion, and focus while scrolling.

## tvOS

Use the platform focus model rather than manual coordinate hacks. In SwiftUI/UIKit, make focus eligibility and focus guides explicit where layout geometry is ambiguous. Respect system focus appearance/parallax/material behavior instead of replacing it with a subtle outline. Verify:

- initial focus and focus restoration after playback/detail/modal;
- focus engine behavior in grids/shelves with asynchronous images;
- Siri Remote directional swipe/click repeat behavior;
- legibility at distance and reduced-motion/high-contrast settings;
- Top Shelf/preview imagery as a separate constrained surface.

## Android TV / Leanback / Compose for TV

Use Compose for TV/`androidx.tv` or Leanback patterns according to project generation. Do not reuse touch-first Compose components unchanged. Verify focusable/clickable semantics, D-pad directional propagation, focus restoration in lazy rows/lists, immersive playback chrome, and key-event handling. Use Android's baseline safe-area/type guidance and test actual TV DPI rather than phone emulation.

## Console/game UI

Treat controller input as continuous focus/state input rather than emulating a mouse. Account for stick dead zones, repeated navigation acceleration, focus audio/haptics, safe display area settings, platform certification requirements, and interrupted gameplay. Do not confuse decorative diegetic UI with usable system-critical navigation.

## webOS and Tizen

Both commonly use web technology but are still remote-controlled TV surfaces. Browser engine/version varies by model/year; feature-detect and test target hardware. Use spatial navigation/focus management appropriate to the platform/runtime, respect remote key events/back behavior, avoid hover-dependent UI, bundle assets deliberately, and measure memory/CPU on low-end televisions. Do not assume modern desktop Chromium parity.

## watchOS and Wear OS

Wearables are glance/interruption surfaces. The correct unit is often a complication, tile, notification, or single-screen action—not an app screen hierarchy.

Rules:

- optimize for glance duration and ambient/always-on behavior;
- put one primary piece of information/action per screen;
- prefer system typography/components and high contrast;
- support round displays: keep critical content away from clipped corners/edges and test circular masks;
- use Digital Crown/rotating bezel/scroll semantics where available instead of tiny touch targets;
- design touch targets for a moving wrist/finger, not precise pointer input;
- handle raise-to-wake, offline sync, sensor delay, permission denial, and phone-companion dependency;
- use complications/tiles for current state; do not fake live data when refresh is budgeted/deferred.

Apple's typography table gives watchOS default/minimum 16/12pt; use it as a floor and prefer larger for critical glance content. Wear OS guidance emphasizes glanceable Tiles/complications and Material behavior—verify current official docs because APIs evolve quickly.

## Verification matrix

- physical distance/angle/lighting or faithful TV setup;
- fastest/slowest input repeat and accidental double input;
- round/square/overscan variants;
- focus path screen recording or explicit state log;
- reduced motion/high contrast/text scaling;
- low memory/CPU/network interruption;
- real hardware or `not-checked` label.
