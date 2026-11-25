# E-ink, POS, industrial HMI, kiosks, embedded MCUs, and automotive surfaces

## E-ink / electronic paper & color EPD specifics

E-ink is a stateful, reflective, bistable display—never treat it as a slow LCD:

- **Refresh & waveform modes**: full refreshes invert/flash to clear ghosting; fast partial modes (**Boox EPD** `Speed` / `A2` / `X` vs crisp `Normal` / `Regal`) reduce latency at the cost of lower grayscale fidelity and accumulated ghosting. Switch to fast mode only during brief pan/zoom or typing, then trigger a clean `Regal`/full refresh on stop—and expose a manual full-refresh action.
- **Color e-ink physics**:
  - **Kaleido 3 (e.g., Kindle Colorsoft, Boox Color)**: passive color filter array over a 300 PPI B&W panel yields **~150 PPI color** with a noticeably darker white point and muted pastel gamut. Keep small body text pure crisp black-on-white; reserve color for high-contrast highlights, tags, and coarse charts.
  - **Gallery 3 (e.g., reMarkable Paper Pro)**: multi-pigment capsules deliver richer color at higher native resolution, but full color transitions require noticeably slower multi-stage flashes. Batch updates tightly and avoid continuous hover/scroll repaints.
- **Dithering & anti-patterns**: apply intentional ordered or Floyd-Steinberg dithering for photography/illustrations; avoid subtle gray gradients, animated spinners, smooth momentum scrolling (prefer crisp pagination), and live per-second counters. Remember the last rendered frame persists when the device sleeps—display honest timestamped status (`Updated 14:20`, not `Live`).

## POS, industrial HMI (ISA-101), & kiosk lockdown

### Point-of-Sale (POS)
- **Dual cashier + customer displays**: show itemized totals, discounts, tax, and clear tap/insert prompts on the customer-facing display while keeping staff-only overrides, PIN fields, and back-office actions strictly on the cashier screen.
- **EMV / NFC tap idempotency**: attach an idempotency key to every card-present authorization and lock the payment state machine while awaiting terminal response so a network timeout or double-tap **never** double-charges a customer.
- **Fixed muscle-memory grids**: keep high-frequency item/tender buttons in deterministic, fixed screen positions—never dynamically reorder cashier grids by "trending" or recent popularity.
- **Offline store-and-forward**: visibly badge queued offline orders (`Offline queue: 3 pending`), enforce configured offline floor limits, and reconcile cleanly upon reconnect.

### Industrial HMI (**ISA-101 High-Performance HMI**)
- **Muted normal state**: render normal operating equipment, pipes, and backgrounds in low-saturation neutral grays—**never** bright animated 3D gradients or saturated green pumps everywhere (which obscure real faults).
- **Reserved alarm colors + redundant encoding**: reserve high-chroma red, amber/yellow, and cyan strictly for active abnormal/alarm priorities, always paired with a unique geometric shape, priority number (`P1`/`P2`), and concise text so color-blind operators recognize severity instantly under harsh plant lighting.
- **Physical E-stop supersedes software**: software "Stop" controls assist normal sequencing only; never label or rely on a touchscreen button as a safety-rated emergency stop (E-stop).
- **Stale / bad-quality telemetry**: when a PLC/OPC-UA/Modbus tag loses communication or exceeds freshness TTL, immediately replace normal numeric values with a distinct bad-quality state (dashed frame, `?` / `STALE`, last-good timestamp)—never leave frozen stale readings styled as live normal state.

### Public kiosks (`ADA §308 / §707` & `EN 301 549`) & terminal reliability
- **Wheelchair reach (`38–122 cm` / `15–48"`) & Reachability Mode**: place all interactive controls within **`38–122 cm` (`15–48"`)** above the finished floor, **OR** render a persistent, high-contrast **"Lower Screen / Reachability Mode"** button anchored inside the bottom reach zone that shifts upper interactive controls down into reach.
- **Touch target floor & tactile audio-jack navigation**: size touch buttons **`>= 60×60 px` (`12–15 mm` physical)** with generous spacing against Parallax/gloved taps; support **tactile keypad / `3.5 mm` audio-jack spoken navigation** (`ADA §707` / `EN 301 549`) and **automatically reset audio volume, speech rate, and UI language to default** at the end of every customer session.
- **Idle timeout (`30–60 s`) + `"Still there?"` countdown (`WCAG 2.2.1`) & PII wipe**: after `30–60 s` of inactivity, display an accessible **`"Still there?"` countdown modal** (`>= 20 s` to extend session); if unanswered or when a user taps `Finish`/`Cancel`, **atomically purge all PII, auth tokens, form inputs, cached receipts, and cart state** before returning to the non-audio-dependent attract loop.
- **Hardware telemetry & `72 h+` soak gate**: monitor receipt-printer **paper-low / cover-open / cutter-jam** states (degrading gracefully to SMS/QR digital receipt or queued offline print rather than freezing checkout), lock OS chrome (`LockTask` / `Single App Mode` / `Assigned Access`), and pass a **`72 h+` continuous automated session-loop soak test** with zero heap/DOM/WebGL memory leaks.

## Embedded MCUs: LVGL v9, Slint MCU, `embedded-graphics`, TouchGFX, & Qt for MCUs

Measure real framebuffer bytes, **compile-time static `Flash` / `SRAM` budgets**, DMA2D/GPU acceleration, worst-case input latency, and thermal limits before selecting a toolkit:

| Framework | Language | Rendering & footprint | Best fit |
|---|---|---|---|
| **LVGL v9** | C (C++/Rust/MicroPython bindings) | Retained `lv_obj_t` tree, partial draw buffers (`1/10` screen RAM), ~32–64 KB RAM floor | Broadest MCU/RTOS ecosystem (ESP32, STM32, Zephyr, NuttX) |
| **Slint MCU** | Rust (`#![no_std]`) / C++ + `.slint` DSL | Static-allocation declarative UI compiled ahead-of-time, line-by-line renderer | Safety/Rust teams sharing clean declarative UI across desktop + MCU |
| **`embedded-graphics`** | Rust (`#![no_std]`) | Zero-allocation immediate draw primitives (`DrawTarget`, bitmaps, mono fonts) | Ultra-tiny monochrome OLEDs, e-paper tags, bare-metal sensors (<16 KB RAM) |
| **TouchGFX** | C++ (STM32) | Hardware-accelerated STM32 Chrom-ART (DMA2D) / NeoChrom GPU | High-FPS 60fps appliance/medical displays on STM32 MCUs |
| **Qt for MCUs** | QML subset → C++ (`Qt Quick Ultralite`) | Static compiled QML engine with hardware acceleration | Teams standardizing on Qt/QML across Linux MPU and RTOS MCU product lines |

**LVGL v9 concrete idiom** (double-buffered DMA, reusable static `lv_style_t`, and `lv_group_t` for rotary encoder / physical keypad navigation):

```c
static lv_style_t style_focus;
lv_style_init(&style_focus);
lv_style_set_outline_width(&style_focus, 3);
lv_style_set_outline_color(&style_focus, lv_color_hex(0x0074CA));

lv_display_t *disp = lv_display_create(320, 240);
/* Synchronize double-buffered DMA flush to panel VSYNC / Tearing-Effect (TE) pin */
lv_display_set_buffers(disp, draw_buf1, draw_buf2, sizeof(draw_buf1), LV_DISPLAY_RENDER_MODE_PARTIAL);

lv_group_t *group = lv_group_create();
lv_obj_t *btn = lv_button_create(lv_screen_active());
lv_obj_add_style(btn, &style_focus, LV_STATE_FOCUSED);
lv_group_add_obj(group, btn); // binds rotary encoder / debounced physical keypad focus
```

MCU & E-Ink engineering gates:
- **`0` runtime heap fragmentation**: allocate widgets, glyph bitmaps, and framebuffers statically at boot/compile time (`LV_STDLIB_BUILTIN` fixed pool or `#![no_std]` static structs)—never `malloc`/`free` dynamically per frame.
- **Tear-free `VSYNC` / `TE` double-buffered DMA**: synchronize SPI/RGB/MIPI-DSI DMA buffer swaps to the panel's hardware **Tearing-Effect (`TE`)** or **`VSYNC`** interrupt so horizontal motion never shears diagonally.
- **Physical button & rotary debounce (`15–30 ms`)**: apply hardware RC or deterministic **`15–30 ms` software state-machine debounce** on tactile switches and quadrature encoders so contact bounce never double-submits confirmations; on `1-bit`/`4-bit` E-Ink, use pure black-on-white crisp bitmap/hinted typography without gradient soup.

## Automotive IVI: CarPlay, Android Auto, AAOS (`NHTSA` / `ISO 15005`)

Driver distraction is a physical safety hazard—enforce **NHTSA Visual-Manual Guidelines** and **ISO 15005** glance budgets strictly:

- **Glance & target floor**: every driving-accessible task must complete within **`< 2.0 s` per single glance** and **`< 12.0 s` cumulative glance time**, using physical touch targets **`>= 15×15 mm`** with high-contrast labels (`>= 4.5:1`–`7:1` under direct sunlight).
- **`speed > 0` motion interlocks**: the instant vehicle speed leaves `0` / `Park`, **lock complex QWERTY typing, long-list scrolling, settings setup, and video playback** (`CarUxRestrictionsManager`), handing off seamlessly to **voice (`PTT`) and steering-wheel switches** without losing context.
- **Instant zero-flash Day <-> Night tunnel switch**: pre-load both Day and Night token palettes in GPU/RAM so entering or exiting a dark highway tunnel switches themes in **`1` frame with zero white-screen flash** (never reload stylesheets or flash `#FFFFFF` into a night-adapted driver's eyes!).

### Apple CarPlay & CarPlay Ultra
- Build apps exclusively on Apple's category-entitled **CarPlay templates** (**`CPListTemplate`**, **`CPMapTemplate`**, **`CPTabBarTemplate`**, **`CPInformationTemplate`**, **`CPNowPlayingTemplate`**, **`CPGridTemplate`**) plus iOS 26 glanceable CarPlay widgets/Live Activities.
- **CarPlay Ultra** (instrument cluster + center console): respect strict cluster glance budgets, instant Day/Night luminance parity, and OEM telltale priority.

### Android Auto & Android Automotive OS (AAOS)
- **Car App Library (`androidx.car.app`) 5-template task quota**: cap flows at **5 templates**, ending on a documented terminal template (`NavigationTemplate`, `PaneTemplate`, `MessageTemplate`, `MediaPlaybackTemplate`, `SignInTemplate`, `LongMessageTemplate`).
- **AAOS Distraction Optimization (`CarUxRestrictionsManager`)**: declare `<meta-data android:name="distractionOptimized" android:value="true" />` and obey `UX_RESTRICTIONS_NO_KEYBOARD`, `UX_RESTRICTIONS_LIMIT_STRING_LENGTH`, `UX_RESTRICTIONS_LIMIT_CONTENT`, and `UX_RESTRICTIONS_NO_SETUP` live; keep passenger-zone screens strictly isolated from the driver display.

## Shared hardware verification

Never certify hardware surfaces from desktop browser screenshots. Verify on target devices (`rendered`; label missing hardware or regulatory sign-off `not-checked`):
- E-Ink partial vs full waveform schedule, `1-bit`/`4-bit` pure B&W crispness, and sleep-screen timestamp honesty;
- POS/Kiosk `38–122 cm` reachability mode, `>= 60×60 px` (`12–15 mm`) targets, audio-jack volume reset, `30–60 s` `"Still there?"` PII purge, printer paper-low/offline queue, and `72 h+` soak memory stability;
- MCU static `Flash`/`SRAM` map (`0` runtime heap churn), `VSYNC`/`TE` DMA tear check, and `15–30 ms` button debounce;
- Automotive `< 2.0 s` single / `< 12.0 s` cumulative glance timing, `>= 15×15 mm` targets, `speed > 0` `CarUxRestrictions` lockouts, and zero-flash tunnel Day <-> Night transitions.
