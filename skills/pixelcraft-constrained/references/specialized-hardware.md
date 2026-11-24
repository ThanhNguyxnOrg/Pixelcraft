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

### Public kiosks & lockdown
- **Session lifecycle**: non-audio-dependent attract screen, explicit Start/Cancel, timeout warning before clearing session, privacy wipe (clear autofill/cart/PII on end or timeout), receipt/printer/scanner jam recovery with staff-assist code.
- **Reach zones**: 2010 ADA Standards §308 unobstructed forward reach is commonly summarized as **15–48 inches** above finish floor (side-reach and obstruction rules differ—confirm mounting geometry and jurisdiction with compliance counsel; UI layout alone is not ADA certification).
- **OS kiosk lockdown**: lock production terminals via **Android Lock Task mode** (`DevicePolicyManager`), **iOS/iPadOS Single App Mode** (MDM / Guided Access), or **Windows Assigned Access** (Shell Launcher). Always include a documented technician escape path, watchdog auto-relaunch on crash, and deferred OS reboots outside active customer sessions.

## Embedded MCUs: LVGL v9, Slint MCU, `embedded-graphics`, TouchGFX, & Qt for MCUs

Measure real framebuffer bytes, SRAM/flash budget, DMA2D/GPU acceleration, worst-case input latency, and thermal limits before selecting a toolkit:

| Framework | Language | Rendering & footprint | Best fit |
|---|---|---|---|
| **LVGL v9** | C (C++/Rust/MicroPython bindings) | Retained `lv_obj_t` tree, partial draw buffers (`1/10` screen RAM), ~32–64 KB RAM floor | Broadest MCU/RTOS ecosystem (ESP32, STM32, Zephyr, NuttX) |
| **Slint MCU** | Rust (`#![no_std]`) / C++ + `.slint` DSL | Static-allocation declarative UI compiled ahead-of-time, line-by-line renderer | Safety/Rust teams sharing clean declarative UI across desktop + MCU |
| **`embedded-graphics`** | Rust (`#![no_std]`) | Zero-allocation immediate draw primitives (`DrawTarget`, bitmaps, mono fonts) | Ultra-tiny monochrome OLEDs, e-paper tags, bare-metal sensors (<16 KB RAM) |
| **TouchGFX** | C++ (STM32) | Hardware-accelerated STM32 Chrom-ART (DMA2D) / NeoChrom GPU | High-FPS 60fps appliance/medical displays on STM32 MCUs |
| **Qt for MCUs** | QML subset → C++ (`Qt Quick Ultralite`) | Static compiled QML engine with hardware acceleration | Teams standardizing on Qt/QML across Linux MPU and RTOS MCU product lines |

**LVGL v9 concrete idiom** (partial buffer, reusable `lv_style_t`, and `lv_group_t` for rotary encoder / physical keypad navigation):

```c
static lv_style_t style_focus;
lv_style_init(&style_focus);
lv_style_set_outline_width(&style_focus, 3);
lv_style_set_outline_color(&style_focus, lv_color_hex(0x0074CA));

lv_display_t *disp = lv_display_create(320, 240);
lv_display_set_buffers(disp, draw_buf1, draw_buf2, sizeof(draw_buf1), LV_DISPLAY_RENDER_MODE_PARTIAL);

lv_group_t *group = lv_group_create();
lv_obj_t *btn = lv_button_create(lv_screen_active());
lv_obj_add_style(btn, &style_focus, LV_STATE_FOCUSED);
lv_group_add_obj(group, btn); // binds rotary encoder / keypad focus
```

Subset embedded fonts to the exact required Unicode glyph ranges, pre-allocate styles/widgets outside frame ticks, and design monochrome/low-bit-depth screens with shape + inverse-video hierarchy rather than alpha shadows.

## Automotive: CarPlay, CarPlay Ultra, Android Auto, & AAOS

Driver distraction is a physical safety hazard—follow host template and distraction-optimization gates strictly.

### Apple CarPlay & CarPlay Ultra
- Build apps exclusively on Apple's category-entitled **CarPlay templates**: **`CPListTemplate`**, **`CPMapTemplate`**, **`CPTabBarTemplate`**, **`CPInformationTemplate`**, **`CPNowPlayingTemplate`**, **`CPGridTemplate`**. Never attempt arbitrary custom touch UI outside approved navigation/map drawing zones.
- **iOS 26 CarPlay widgets & Live Activities**: support compact, glanceable CarPlay widgets and Live Activities for non-distracting status updates (trip ETA, charging status, flight gate) with large high-contrast type and zero multi-step interaction.
- **CarPlay Ultra** (multi-screen vehicle integration spanning instrument cluster + center console + vehicle climate/controls): respect strict cluster glance budgets, day/night luminance parity, and OEM safety-critical indicator priority.

### Android Auto & Android Automotive OS (AAOS)
Distinguish **Android Auto** (phone projection) from **Android Automotive OS (AAOS)** (native Android running directly on vehicle head-unit hardware):

- **Car App Library task quota (Android Auto + AAOS third-party apps)**: the host enforces a maximum of **5 templates** in a task flow, and the 5th (terminal) template must be a documented terminal type (`NavigationTemplate`, `PaneTemplate`, `MessageTemplate`, `MediaPlaybackTemplate`, `SignInTemplate`, `LongMessageTemplate`). Exhausting the quota terminates the flow with an error.
- **AAOS Distraction Optimization (`CarUxRestrictionsManager`)**: native AAOS activities meant to remain visible while moving must declare `<meta-data android:name="distractionOptimized" android:value="true" />` and dynamically obey **`CarUxRestrictionsManager`** flags (`UX_RESTRICTIONS_NO_KEYBOARD`, `UX_RESTRICTIONS_LIMIT_STRING_LENGTH`, `UX_RESTRICTIONS_LIMIT_CONTENT`, `UX_RESTRICTIONS_NO_SETUP`) whenever the vehicle leaves Park (`P`).
- **Library boundary**: third-party app developers build on the **Car App Library** (`androidx.car.app`) for portability across Android Auto and AAOS; OEMs and bundled system apps use **`car-ui-library`** for vehicle-skinned native chrome.
- **Multi-zone / passenger displays**: isolate driver-safe distraction-optimized experiences from passenger or rear-seat entertainment zones—never allow passenger media/keyboard state to unlock driver screen restrictions.

## Shared hardware verification

Never certify hardware surfaces from desktop browser screenshots. Verify on target devices (`rendered`; label missing hardware or regulatory sign-off `not-checked`):
- e-ink ghosting, temperature effects, color Kaleido 3 / Gallery 3 refresh flashes, and sleep-screen truthfulness;
- POS dual-display privacy, EMV double-tap idempotency, offline queue replay, and ISA-101 alarm legibility + stale tag indicators;
- kiosk Lock Task / Assigned Access escape/crash-relaunch and physical ADA mounting reach;
- MCU RAM/flash high-water mark, worst-case frame/input latency, and rotary/keypad `lv_group_t` traversal;
- automotive parked vs driving `CarUxRestrictions` enforcement, day/night glare contrast, head-unit disconnect/reconnect, and CarPlay/Android Auto template quota checks.
