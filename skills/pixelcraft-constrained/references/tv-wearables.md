# TV, console, and wearable interfaces

## TV & 10-foot fundamentals

Verified baseline constraints:
- **Viewing distance**: typical **3 meter / 10-foot** lean-back surface.
- **Android TV layout baseline**: design at **MDPI 960×540** so proportional scaling targets HD/4K cleanly; author bitmap art at 1080p+. Keep essential UI inside a **5% overscan safe margin** (`48 dp` left/right, `27 dp` top/bottom at 960×540); background art may bleed to edge.
- **Typography floors**: Apple's typography table lists tvOS default **29 pt** (minimum **23 pt**) and watchOS default **16 pt** (minimum **12 pt**). Treat minimums as floors—prefer larger sizes for critical glance labels.

TV rules:
- Use sparse hierarchy, large focusable tiles, unmistakable high-contrast focus state, and instant response on every D-pad press.
- Move metadata into a focused preview panel rather than cramming paragraphs onto every grid card.
- Remember exact rail/item position when returning from detail or video playback.
- Never ship hover-only menus, tiny tooltips, right-click triggers, or dense multi-column desktop tables.

## D-pad spatial navigation & focus engines

| Focus state | Required behavior |
|---|---|
| **Initial entry** | Predictable useful default (resume watching / primary rail), never an arbitrary hidden top-left node. |
| **Directional move** | Score candidates by primary-axis distance + orthogonal overlap with dead-zone handling—pure Euclidean nearest-neighbor jumps erratically across mixed-height rails. |
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

Wearables are **2–5 second glance** and quick-action surfaces. Prefer a complication, Tile, or Smart Stack widget over burying glanceable status inside deep app navigation.

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
- Support Digital Crown input (**`.digitalCrownRotation(...)`**) and **Double Tap** primary gestures (**`.handGestureShortcut(.primaryAction)`**).
- Read **`@Environment(\.isLuminanceReduced)`** for Always-On Display: dim saturated fills, pause per-second animations/timers, and keep the critical value readable at low power.
- On **watchOS 26**, verify **Liquid Glass** toolbar/pill controls remain sharp on small round-cornered OLED screens under Reduce Transparency and wrist-glare conditions.

## Verification matrix

Verify on real hardware or faithful device emulators (`rendered`; label untested hardware `not-checked`):
- 10-foot viewing distance, ambient glare, and 5% TV overscan margins;
- rapid held-down D-pad repeat, diagonal stick input, empty rows, and focus restoration after Back/playback;
- circular mask clipping on round Wear OS watches, Always-On `isLuminanceReduced`, and Digital Crown / rotary bezel scrolling;
- Roku texture-memory caps, Tizen `registerKey` remote transport keys, and low-RAM smart TV scroll frame pacing;
- reduced motion, high contrast, text scaling, and offline/phone-companion disconnect recovery.
