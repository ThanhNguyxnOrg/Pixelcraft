# Unity UI Toolkit

Evidence: current Unity docs confirm USS custom properties use `--name` and `var(--name)` with optional defaults.

## Token mapping

Use USS variables/selectors as the semantic token layer:

```css
:root {
  --semantic-color-action: rgb(0, 116, 202);
}
.primary-action { background-color: var(--semantic-color-action); }
```

Map generated colors/units once. VisualTreeAsset/USS/C# style overrides should consume named classes/variables rather than scattering inline styles.

## Layout and responsive idioms

Use UXML hierarchy, flexbox-like layout semantics, percentage/min/max sizing, safe-area/container logic at runtime, aspect-ratio awareness, scaling modes, and device/platform target matrices. Separate HUD overlay, menu screens, world-space UI, and editor UI constraints.

## Typography/custom fonts

Configure font assets/TextCore assets and localization glyph coverage deliberately. Verify dynamic text scaling, fallback glyphs, SDf/atlas memory, line breaking, truncation, and expansion. Fixed-size labels are a localization hazard.

## Motion/reduced motion

Use UI Toolkit transitions/animation or runtime animation intentionally. Unity lacks one universal cross-platform reduced-motion guarantee; expose accessibility/game setting and map platform capabilities where available. Do not hide critical state behind animation completion.

## Accessibility specifics

Focus/navigation behavior depends on runtime/input system/version. Define focus order/navigation explicitly, use real buttons/labels where available, verify controller/keyboard traversal, screen-reader/platform integration honestly, colorblind-safe states, subtitles/captions, remapping, and scalable HUD/text options.

## States idiom

Model menu/HUD states explicitly: loading/connecting/error/empty inventory/permission/pause/offline/reconnect/death/respawn/optimistic purchase/cancellation. Runtime gameplay interruption is normal. Preserve navigation focus after modal/popup/scene transitions.

## Forms idiom

Game UI forms (login/search/settings/create/loadout) need correct virtual keyboard/platform input integration, validation timing, paste/text entry constraints, focus order, input preservation, and error recovery. Never require cognitive-memory authentication patterns or block manager/paste equivalents where platform permits.

## Do/don't pairs

| Do | Don't |
|---|---|
| USS semantic custom properties | hard-coded inline colors throughout UXML/C# |
| explicit focus restore after popup close | focus disappearing into hidden visual element |
| safe-area/aspect matrix verification | designing only in editor 16:9 preview |
| real localized/glyph-covered font assets | missing glyph boxes in CJK/Arabic/localized builds |
| text/icon/shape redundancy for critical state | color-only enemy/ally/rarity coding |

## Known traps

Editor-vs-runtime rendering mismatch, USS feature subset differences from browser CSS, atlas/glyph memory cost, focus navigation gaps, input system conflicts, safe-area/device variation, localization expansion clipping, scene unload/lifecycle state loss, certification constraints discovered late.

## Verification commands

```sh
# project dependent
Unity -batchmode -projectPath . -runTests -testPlatform EditMode 2>/dev/null || true
Unity -batchmode -projectPath . -runTests -testPlatform PlayMode 2>/dev/null || true
```

Use playmode/device screenshots, UI Builder plus runtime inspection, controller-only navigation, resolution/aspect/safe-area matrix, localization pseudo-text/glyph tests, accessibility settings, and platform validation checklists where available.
