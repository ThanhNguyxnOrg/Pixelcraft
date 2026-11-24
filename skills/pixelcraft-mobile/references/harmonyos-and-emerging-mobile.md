# HarmonyOS ArkUI, Elixir LiveView Native, Taro, & uni-app

Use this reference for **HarmonyOS NEXT (ArkUI / ArkTS)**, **Elixir LiveView Native** (server-driven native SwiftUI / Jetpack Compose), and cross-mini-app/mobile frameworks (**Taro**, **uni-app**). Never collapse distinct platform navigation, safe areas, or input models into lowest-common-denominator web-style markup.

## HarmonyOS ArkUI / ArkTS

Build HarmonyOS NEXT interfaces with **State Management V2** (`@ComponentV2`, `@Local`, `@Param`, `@Event`, `@Computed`), semantic resource bundles, and multi-device breakpoints (phone, foldable, tablet, 2-in-1):

- **State V2**: prefer `@ComponentV2` with `@Local` (internal mutable state), `@Param` (parent-owned read-only input), and `@Event` callbacks over legacy V1 `@State`/`@Prop`/`@Link` where the project targets API 12+.
- **Tokens & dark mode**: store all semantic colors, dimensions, and localized strings in `resources/base/element/*.json` with matching `resources/dark/element/color.json` overrides and reference them via **`$r('app.color.*')`**, `$r('app.float.*')`, and `$r('app.string.*')`—never hardcode light-only hex values.
- **Responsive layout**: compose adaptive grids with **`GridRow` / `GridCol`** (`xs`, `sm`, `md`, `lg` breakpoints) and `Navigation` (`NavigationMode.Auto`) so phone single-column flows expand cleanly into split panes on foldables and tablets.
- **Font scaling, safe areas, & Accessibility Kit**: express text sizes in `fp` (honoring system `fontSizeScale`), avoid clipping by letting horizontal rows wrap or stack under large font scales, apply `.expandSafeArea(...)` deliberately for full-bleed backdrops while keeping primary actions inside safe bounds, and wire HarmonyOS Accessibility Kit attributes (`.accessibilityText(...)`, `.accessibilityDescription(...)`, `.accessibilityGroup(true)`, `.accessibilityLevel('yes' | 'no')`).

```ts
// HarmonyOS ArkTS (API 12+ State V2 + GridRow/GridCol + semantic $r tokens + Accessibility Kit)
@Entry
@ComponentV2
struct InvoiceSummaryPage {
  @Local activeFilter: string = 'unpaid';

  build() {
    Column({ space: 12 }) {
      GridRow({
        columns: { sm: 4, md: 8, lg: 12 },
        gutter: { x: 12, y: 12 },
      }) {
        GridCol({ span: { sm: 4, md: 4, lg: 6 } }) {
          InvoiceMetricCard({
            label: $r('app.string.overdue_total'),
            amount: '¥18,400',
            onSelect: () => { this.activeFilter = 'overdue'; },
          })
        }
      }
      .padding({ left: 16, right: 16 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.semantic_surface'))
  }
}

@ComponentV2
struct InvoiceMetricCard {
  @Param @Require label: ResourceStr;
  @Param @Require amount: string;
  @Event onSelect: () => void = () => {};

  build() {
    Column({ space: 6 }) {
      Text(this.label).fontSize(14).fontColor($r('app.color.semantic_text_muted'))
      Text(this.amount).fontSize(24).fontWeight(FontWeight.SemiBold).fontColor($r('app.color.semantic_text'))
    }
    .width('100%')
    .padding(16)
    .borderRadius(12)
    .backgroundColor($r('app.color.semantic_surface_raised'))
    .accessibilityGroup(true)
    .accessibilityText($r('app.string.overdue_card_a11y'))
    .onClick(() => this.onSelect())
  }
}
```

## Elixir LiveView Native

**LiveView Native** renders genuine **SwiftUI** (`.swiftui.heex` / `~LVN`) and **Jetpack Compose** (`.jetpack.heex`) native controls driven by Phoenix LiveView server state over WebSockets:

- **Platform-idiomatic templates**: keep domain logic in the Phoenix LiveView module, but author distinct `.swiftui.heex` (SwiftUI `List`, `NavigationLink`, `ToolbarItem`, `.sheet`) and `.jetpack.heex` (Material 3 `Scaffold`, `TopAppBar`, `LazyColumn`) templates plus platform `LiveViewNative.Stylesheet` token rules—never force identical web-div markup onto both platforms.
- **Explicit network & offline boundary**: because events round-trip to the Phoenix server over a WebSocket, design visible reconnecting/offline states, prevent duplicate submits during latency, and **do not choose LiveView Native** for offline-first field apps, continuous 60–120 FPS gesture/canvas tools, or zero-latency local editing (choose native SwiftUI/Compose, KMP, or Flutter instead).

```heex
<%# lib/my_app_web/live/invoices_live.swiftui.heex %>
<List>
  <Section>
    <Text template="header">Open invoices</Text>
    <%= for invoice <- @invoices do %>
      <HStack class="row-padding">
        <VStack alignment="leading">
          <Text class="row-title"><%= invoice.client %></Text>
          <Text class="row-meta"><%= invoice.due_date %></Text>
        </VStack>
        <Spacer />
        <Text class="row-amount"><%= invoice.total %></Text>
      </HStack>
    <% end %>
  </Section>
</List>
```

## Taro & uni-app (cross-mini-app & mobile)

Use **Taro** (React/Vue/Solid over mini-programs, H5, RN, HarmonyOS) or **uni-app / uni-app x** (Vue/UTS over WeChat/Alipay/ByteDance mini-programs, iOS, Android, HarmonyOS) when multi-super-app distribution is an explicit product requirement:

- **Safe areas & mini-program capsule geometry**: query system window/capsule metrics (`Taro.getWindowInfo()` / `Taro.getMenuButtonBoundingClientRect()` or `uni.getWindowInfo()` + `env(safe-area-inset-bottom)`) whenever building a custom navigation bar so titles and action buttons never collide with the host mini-program's floating capsule menu or home indicator.
- **Platform conditional compilation (no lowest-common-denominator UX)**: branch platform-specific navigation, payment, share sheets, and pickers explicitly—`// #ifdef MP-WEIXIN` / `// #ifdef APP-PLUS` / `// #ifdef HARMONY` in **uni-app**, or `process.env.TARO_ENV` and `.weapp.tsx` / `.rn.tsx` / `.h5.tsx` file extensions in **Taro**.
- **Mini-program budgets & `setData` discipline**: keep the main package under the host super-app limit (typically 2 MB) using subpackages (`subPackages`), avoid pushing giant arrays through `setData` on scroll/input ticks, and verify accessibility focus/font scaling on real host clients rather than browser H5 preview alone.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use HarmonyOS `@ComponentV2`, `@Local`/`@Param`, `GridRow`/`GridCol`, and `$r('app.color.*')` | Hardcode hex colors and fixed phone widths that clip on HarmonyOS foldables and dark mode |
| Write separate `.swiftui.heex` and `.jetpack.heex` templates in LiveView Native with explicit offline banners | Treat LiveView Native as an offline-first architecture or force identical layouts across iOS and Android |
| Compute mini-program capsule bounds (`getMenuButtonBoundingClientRect`) and use `#ifdef` / `.weapp` platform branches in Taro/uni-app | Hardcode a 44px top header that collides with WeChat's capsule button or ship unsplit >2 MB mini-program main packages |
| Test real DevEco/Xcode/Android/WeChat DevTools builds and label untested hosts `not-checked` | Rely solely on an H5 web browser preview to verify HarmonyOS, LiveView Native, or mini-program behavior |

## Verification commands

```sh
# HarmonyOS ArkTS (DevEco / hvigor):
hvigorw assembleHap

# Elixir LiveView Native:
mix test

# Taro (target-specific build):
npm run build:weapp
```

CLI builds and `mix test` are `static` / logic evidence. Inspect running apps in HarmonyOS DevEco Previewer/Emulator (dark mode, foldable breakpoints, font scale, ScreenReader), iOS Simulator / Android Emulator (LiveView Native reconnects + native navigation), and WeChat DevTools / physical devices (Taro/uni-app capsule alignment and subpackage size) for `rendered` evidence; label untested hosts `not-checked`.
