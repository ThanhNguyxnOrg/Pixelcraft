# TV, console, and wearable interfaces

## TV & 10-foot fundamentals

Verified baseline constraints:
- **Viewing distance**: typical **3 meter / 10-foot** lean-back surface.
- **Overscan safe zones (`5%` / `10%`)**: keep interactive chrome inside the **`5%` action-safe inset** (`48 dp` L/R, `27 dp` T/B at `960×540` MDPI; `96 px` / `54 px` at `1080p`) and critical typography/logos inside the **`10%` title-safe inset** where legacy broadcast overscan or curved bezels apply; background art may bleed edge-to-edge.
- **Typography floors**: Apple's typography table lists tvOS default **29 pt** (minimum **23 pt**) and watchOS default **16 pt** (minimum **12 pt**). Treat minimums as floors—prefer larger sizes for critical glance labels.
- **QR Code / `RFC 8628` OAuth 2.0 Device Authorization Grant**: **never force users to peck a 32-character email + password on an on-screen TV remote keyboard** as the primary login! Render a scannable **QR code + short activation URL & 6–8 char user code (`RFC 8628`)** polling in the background, keeping on-screen keyboard entry strictly as a secondary fallback.

TV rules:
- Pair every focused tile with an unmistakable **focus halo** (**`scale(1.04–1.08)`** transform + `>= 3:1` high-contrast border/ring + elevation shadow; drop scale to `1.0` with thicker ring under `prefers-reduced-motion`).
- Move metadata into a focused preview panel rather than cramming paragraphs onto every grid card.
- Remember exact rail/item position when returning from detail or video playback.
- Never ship hover-only menus, tiny tooltips, right-click triggers, or dense multi-column desktop tables.

## D-pad spatial navigation & focus engines

| Focus state | Required behavior |
|---|---|
| **Initial entry** | Predictable useful default (resume watching / primary rail), never an arbitrary hidden top-left node. |
| **Directional move & column memory** | Build a deterministic **4-way (`Up/Down/Left/Right`) spatial graph** with **column-index / horizontal-coordinate memory across vertical rows** (pressing `Down` from column 4 into a 2-item hero banner and `Down` again restores column 4 in the next rail rather than resetting to column 1!). |
| **Boundary** | Stop visibly, wrap only when intentional, or transition predictably to sidebar/top navigation chrome. |
| **Content refresh** | Preserve focused item by stable ID; if removed, move to nearest neighbor—never drop focus to `null`. |
| **Modal / overlay** | Trap focus inside the modal while open and restore focus to the invoking trigger on `Back`. |
| **Scroll container** | Scroll smoothly enough to reveal focused card and context without overshooting or fighting fast held-down key repeats. |

## TV platforms & concrete idioms

### Roku BrightScript / SceneGraph
- Compose rails and grids with virtualized SceneGraph nodes (**`RowList`**, **`MarkupGrid`**) rather than manually instantiating hundreds of `Poster`/`Group` nodes.
- Handle D-pad, `back`, `options` (`*`), and playback transport keys explicitly in **`onKeyEvent(key as String, press as Boolean) as Boolean`**, returning `true` only when consumed so unhandled `back` presses bubble cleanly:

```brightscript
function onKeyEvent(key as String, press as Boolean) as Boolean
  if not press then return false
  if key = "options"
    showOptionsDialog()
    return true
  else if key = "back" and m.optionsDialog.visible
    hideOptionsDialog()
    return true
  end if
  return false
end function
```

- **Strict texture/RAM budgets**: low-end Roku sticks enforce tight graphics-memory caps. Request appropriately sized poster bitmaps (`loadWidth`/`loadHeight`, `loadDisplayMode="scaleToFit"`), unload off-screen art, and profile texture memory in Roku's BrightScript debug console.

### Compose for TV (`androidx.tv:tv-material`) & Leanback
- For new Android TV / Google TV apps, use **Compose for TV** (`androidx.tv:tv-material`: `Card`, `StandardCardContainer`, `Carousel`, `NavigationDrawer`, `Surface` with focus border/glow) and **`Modifier.focusRestorer()`** on lazy rails so returning from detail restores the exact focused card. **Leanback** (`androidx.leanback`) is legacy/maintenance—keep only in existing View-based apps.

```kotlin
val rowRequester = remember { FocusRequester() }
LazyRow(
  modifier = Modifier.focusRestorer { rowRequester },
  horizontalArrangement = Arrangement.spacedBy(20.dp),
) {
  itemsIndexed(titles, key = { _, item -> item.id }) { index, item ->
    Card(
      onClick = { onSelect(item) },
      modifier = if (index == 0) Modifier.focusRequester(rowRequester) else Modifier,
    ) { PosterTile(item) }
  }
}
```

### tvOS (26)
- Drive focus declaratively in SwiftUI with **`@FocusState`**, **`.focusSection()`** (bridging sparse regions across gaps), **`.prefersDefaultFocus(_:in:)`**, and **`.onMoveCommand`**—never hack manual coordinates.
- On **tvOS 26**, apply **Liquid Glass** (`.glassEffect`) only to floating chrome/transport controls over artwork or video, verifying 10-foot contrast under Reduce Transparency and Increase Contrast; preserve system focus elevation/scale unless replaced with an equally unmistakable highlight.

```swift
@FocusState private var focusedID: String?
@Namespace private var heroScope

HStack(spacing: 32) {
  ForEach(items) { item in
    Button { play(item) } label: { PosterCard(item: item) }
      .focused($focusedID, equals: item.id)
      .prefersDefaultFocus(item.id == items.first?.id, in: heroScope)
  }
}
.focusSection()
.focusScope(heroScope)
```

### Fire TV / Vega OS, React Native TV, LightningJS, webOS, & Tizen
- **Fire TV / Vega OS**: Fire TV spans Android-based Fire OS **and** Linux-based **Vega OS** (built around React Native for Vega / Kepler SDK). Verify the target Fire TV hardware/OS generation before assuming Android Compose/Leanback availability.
- **React Native TV & LightningJS**: use **`react-native-tvos`** (`TVFocusGuideView`, `hasTVPreferredFocus`, `nextFocusUp/Down/Left/Right`) for React Native TV targets, or **LightningJS / Lightning 3** (WebGL canvas renderer) on memory-constrained smart TVs and set-top boxes where DOM reflows drop frames.
- **LG webOS & Samsung Tizen**: on LG webOS, prefer **Enact** (`@enact/sandstone` + `@enact/spotlight` spatial focus engine). On Samsung Tizen, explicitly register hardware remote keys via **`tizen.tvinputdevice.registerKey('MediaPlayPause')`** (and color/channel keys)—unregistered keys never fire JS `keydown` events! Never assume desktop Chromium CSS/RAM parity on multi-year smart TV web engines.

### Console / game UI
Treat gamepads as continuous directional/stick input with explicit dead zones, held-stick acceleration, audio/haptic focus cues, console safe-area settings, and platform certification checklists (TRCs/XRs/Lotcheck)—never force virtual mouse cursors for core menus.

## Wearables: Compose for Wear OS & watchOS

Wearables are **`<= 2–3 second` single-glance** micro-task surfaces:
- **True `#000000` OLED canvas & `< 15–20%` AOD On-Pixel Ratio (`OPR`)**: render backgrounds as pure `#000000` so unlit OLED pixels draw zero current and blend seamlessly into watch bezels; in Always-On / ambient mode (`isLuminanceReduced`), strip filled cards to outlines/text so **`< 15–20%` of pixels remain lit**, preventing burn-in and battery drain.
- **One primary CTA per screen**: cap every screen at **`1` primary action** (`EdgeButton` or bottom pill) plus optional cancel/secondary action; expose rotary **Crown / Bezel scrolling with crisp haptic detents**. Prefer a complication, Tile, or Smart Stack widget over deep app navigation.

### Compose for Wear OS Material 3 Expressive (Wear OS 5 / 6)
- Build screens on **`AppScaffold`** + **`ScreenScaffold`** + **`TimeText`** (curved top clock), **`TransformingLazyColumn`** (automatically scales/morphs items around circular bezels), and **`EdgeButton`** (bezel-hugging curved bottom primary action).
- Bind rotating crown/bezel scrolling via **`Modifier.rotaryScrollable`** (with `RotaryScrollableDefaults.behavior(scrollableState)` and haptic detents), and adopt **Horologist** helpers where audio/media/layout utilities apply.
- Surface at-a-glance content via **Tiles (`ProtoLayout`)** and build watch faces strictly in declarative **Watch Face Format (WFF)** XML (mandatory on modern Wear OS—legacy Kotlin canvas watch faces are deprecated).

```kotlin
ScreenScaffold(scrollState = listState) {
  TransformingLazyColumn(
    state = listState,
    modifier = Modifier.rotaryScrollable(
      behavior = RotaryScrollableDefaults.behavior(listState),
      focusRequester = focusRequester,
    ),
  ) {
    items(items, key = { it.id }) { item -> TaskChip(item) }
    item { EdgeButton(onClick = onStart) { Text("Start") } }
  }
}
```

### watchOS (10–26)
- Design around **Smart Stack** widgets (`WidgetKit`) and full-screen vertical paging (**`.tabViewStyle(.verticalPage)`**) rather than cramped multi-button grids.
- Support Digital Crown input (**`.digitalCrownRotation(...)`** with haptic detents) and **Double Tap** primary gestures (**`.handGestureShortcut(.primaryAction)`**).
- Read **`@Environment(\.isLuminanceReduced)`** for Always-On Display: enforce `< 15–20%` OPR on `#000000`, pause sub-minute animations/timers, and keep the critical value readable at low power.
- On **watchOS 26**, verify **Liquid Glass** toolbar/pill controls remain sharp on small round-cornered OLED screens under Reduce Transparency and wrist-glare conditions.

## Verification matrix

Verify on real hardware or faithful device emulators (`rendered`; label untested hardware `not-checked`):
- 10-foot viewing distance, `5%` action / `10%` title overscan safe zones, `scale 1.04–1.08` focus halo, and **`RFC 8628` QR Device Authorization** sign-in;
- 4-way D-pad **column-index memory across vertical rows**, rapid held-down repeat, empty rows, and focus restoration after `Back`/playback;
- Wearables `#000000` OLED canvas, **`< 15–20%` AOD On-Pixel Ratio**, `<= 2–3 s` single-CTA task completion, circular mask clipping, and Crown/bezel haptic detents;
- Roku texture-memory caps, Tizen `registerKey` remote transport keys, and low-RAM smart TV scroll frame pacing;
- reduced motion, high contrast, text scaling, and offline/phone-companion disconnect recovery.
