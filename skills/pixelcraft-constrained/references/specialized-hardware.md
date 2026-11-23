# E-ink, kiosk, embedded, and automotive surfaces

## E-ink / electronic paper

E-ink is a stateful low-power display, not a slow LCD. Design around refresh physics:

- full refreshes flash/invert and clear ghosting; partial refreshes are faster but accumulate artifacts;
- animation/video/scrolling are usually inappropriate or severely constrained;
- use high-contrast shapes/text and avoid relying on subtle grayscale;
- minimize repaints by batching state changes and refreshing only dirty regions where supported;
- represent progress/state persistently because the screen remains visible while powered down or asleep;
- test ghosting, temperature effects, grayscale banding, touch latency, and actual partial/full refresh behavior on target hardware.

Good patterns: page-like reading, static dashboards, large status/QR surfaces, explicit refresh action, and pagination instead of smooth scroll. Bad patterns: flashing loading spinners, hover effects, drag scrolling, low-contrast gray text, constant percent/fps counters, and decorative shadows requiring many gray levels.

## Kiosk and self-service hardware

Kiosks are public physical systems. Model the entire session, not just screens:

- **attract loop:** explain value/action without sound dependence; never trap a user in passive loop content;
- **session start/end:** clear confirmation, cancellation, receipt/print path, privacy reset, and timeout behavior;
- **timeouts:** warn before ending, preserve accessibility needs, and never erase payment/identity state without explicit safe reset;
- **reach zones:** place frequent/primary controls in comfortable central/lower reach; avoid requiring simultaneous far-apart actions;
- **privacy:** mask sensitive input, prevent shoulder-surfable summaries, clear autofill/session data, and avoid public audio by default;
- **failure:** paper jam/payment/network/scanner failure needs plain-language recovery and staff/support path;
- **environment:** glare, noise, wet/gloved hands, cleaning damage, camera/keyboard occlusion, and unstable mounting matter.

The 2010 ADA Standards section 308 reach-range guidance is commonly summarized for unobstructed forward reach as **48 inches maximum** and **15 inches minimum** above the finish floor, with separate side-reach/obstruction rules. Confirm jurisdiction, mounting geometry, obstruction depth, operable-part exemptions, and current legal interpretation with compliance counsel—do not treat screen layout alone as ADA certification.

## Embedded, LVGL, and low-resolution displays

Memory and frame budgets are configuration/platform-specific; measure the actual framebuffer, display driver, heap, DMA/cache behavior, font bitmaps, image decoders, theme, and widget tree instead of copying generic numbers.

Rules:

- establish hard budgets: RAM/flash/framebuffer bytes, target fps, worst-case input latency, boot time, power/thermal limit;
- use dirty-region/partial refresh where supported;
- preload/reuse objects/styles rather than allocating per frame;
- compress/pre-scale images and subset fonts to required glyphs;
- use coarse visual hierarchy: position, size, contrast, inverse video, icons—not subtle shadows/gradients;
- design for monochrome/low color depth with redundant shape/text encoding;
- avoid alpha blending/rotation/anti-aliasing assumptions until profiled;
- display state honestly when sensors are stale/disconnected/failing.

For tiny OLED/monochrome displays, think in glyphs and bitmap rows. Text width, clipping, inverse pixels, blinking cadence, and burn-in mitigation are design decisions. Do not render scaled-down desktop layouts.

## Automotive: CarPlay and Android Auto

Automotive interfaces are template constrained because driver distraction is a safety issue.

Verified Android constraint: the host limits the number of templates in a task to a maximum of **five**, and the last template must be one of the documented terminal types such as `NavigationTemplate`, `PaneTemplate`, `MessageTemplate`, `MediaPlaybackTemplate`, `SignInTemplate`, or `LongMessageTemplate`. Exhausting the quota can show an error and close the app. Refreshes/back/reset operations have special rules—read the current official page before designing flows.

Rules:

- use CarPlay/Android Auto template APIs for supported app categories; do not build arbitrary custom driver UI outside them;
- reduce decisions while driving; postpone complex setup to parked/phone context where required;
- prefer voice/system controls and large glanceable rows over custom gestures/text entry;
- never require reading long passages, precision touch, scrolling dense lists, or visual attention away from the road;
- preserve state across head-unit disconnect/reconnect and audio interruption;
- use driver-distraction/quality review criteria as release gates, not optional polish;
- distinguish Android Auto phone projection from Android Automotive OS vehicle integration;
- test daylight/night contrast, glare, audio mixing, voice recognition failure, parked versus driving state, and OEM screen/input differences.

## Shared hardware verification

Do not certify from screenshots. Measure real input latency, refresh artifacts, legibility in environment lighting, physical reach, thermal/power behavior, timeout recovery, reset privacy, and failure handling. Label missing hardware/compliance verification `not-checked`.
