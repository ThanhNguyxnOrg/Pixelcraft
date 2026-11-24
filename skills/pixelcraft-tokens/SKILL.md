---
name: pixelcraft-tokens
description: Creates, resolves, and exports cross-platform design tokens in the W3C Design Tokens Community Group (DTCG) 2025.10 format and DTCG Resolver specification. Use when defining OKLCH color ramps, type, spacing, radius, motion, elevation, theme, dark-mode, semantic, component, or multi-platform token systems; wiring Style Dictionary, Terrazzo, Tokens Studio, Figma Variables, or Code Connect pipelines; or exporting tokens across 19 formats including CSS, Tailwind, SCSS, TypeScript, Swift, Kotlin, Android XML, Dart, Python, Qt, Textual, XAML, Rust, Go Lip Gloss, Godot, Unity USS, Slint, GTK4, and Typst.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft tokens

Tokens are design decisions in portable form. They encode hierarchy and semantic intent; they are not a dump of raw constants.

## Reference and tools

- Read [references/format.md](references/format.md) when authoring DTCG 2025.10 structure, `$extends`/`$root`/`$deprecated`, references, or DTCG Resolver (`*.resolver.json`) modes and themes.
- Read [references/theme-presets.md](references/theme-presets.md) when designing light/dark/high-contrast modes, `light-dark()`, `prefers-reduced-transparency`, forced-colors behavior, anti-FOUC theme initialization, or DTCG mode overrides.
- Read [references/state-tokens.md](references/state-tokens.md) whenever defining interactive control states or validating state coverage across modes.
- Read [references/governance.md](references/governance.md) before renaming, removing, versioning, deprecating (`$deprecated`), or meaningfully redefining tokens.
- Read [references/adoption.md](references/adoption.md) when migrating consumers, inventorying hardcoded values, or improving documentation/usage of an existing system.
- Read [references/token-tooling.md](references/token-tooling.md) when setting up Terrazzo, Style Dictionary v4, Tokens Studio transforms, Figma Variables, Figma MCP Server, or Figma Code Connect mappings.
- Use [assets/tokens.example.json](assets/tokens.example.json) as the canonical small example and [assets/tokens.modes.example.json](assets/tokens.modes.example.json) for mode overrides.
- Run `node scripts/export-tokens.mjs --help` for exporter usage. The exporter supports all 19 formats: `css`, `tailwind`, `scss`, `ts`, `swift`, `kotlin`, `android-xml`, `dart`, `python`, `qt`, `textual`, `xaml`, `rust`, `go-lipgloss`, `godot`, `unity-uss`, `slint`, `gtk4`, and `typst`.

## Token tiers

1. **Primitive** — raw scales: hue ramps, spacing base, font families, durations. Names describe measurement (`color.blue.500`), not use.
2. **Semantic** — intent: `color.surface`, `color.ink.muted`, `color.action.primary`, `space.control.inline`, `motion.feedback.fast`. Product logic consumes these.
3. **Component** — scoped overrides only when a component truly needs them: `component.button.primary.background`. Do not duplicate every semantic token.

Consumers should use the highest meaningful tier. Component code should almost never consume primitives directly.

## Authoring rules

- Inherit the existing project token system when present. Extend semantic gaps rather than replacing names impulsively.
- Use DTCG `$type`, `$value`, `$description`, and `$extensions` deliberately; avoid tool-specific fields outside `$extensions`.
- Use references such as `{color.brand}` so semantic and component tokens preserve relationships.
- Encode mode/theme as explicit alternate semantic values or files. Do not implement dark mode by global inversion.
- Include state roles: hover, active, focus, selected, disabled, destructive, success, warning, info.
- Include density-aware spacing only when the product actually supports density modes; otherwise prefer one coherent rhythm.
- Tokenize motion intent (`duration.feedback-fast`, `easing.standard`) rather than implementation property names.
- Keep platform units out of semantic meaning. Exporters translate dimension units; `px` in DTCG input does not mean every platform should use pixels conceptually.
- **Ban Tailwind arbitrary-value sprawl:** never scatter magic literals like `bg-[#1f2937]`, `text-[#64748b]`, `p-[13px]`, or `rounded-[14px]` across components—promote recurring values into semantic tokens exposed via CSS custom properties / Tailwind `@theme`.
- **Ban untouched `shadcn/ui` default `:root` zinc tokens:** treat starter-kit CSS variables as a schema scaffold, not a finished palette; author surface, ink, border, accent, radius, and type tokens from the committed direction card unless the existing brownfield app explicitly locks the zinc theme.

## Validation checklist

Before implementation or export:

- [ ] every reference resolves and has no cycle;
- [ ] contrast pairs are defined by role (`≥ 4.5:1` text / `≥ 3:1` UI), not guessed later;
- [ ] focus/selection/disabled states exist and realistic combinations such as invalid+focus or selected+disabled are covered;
- [ ] state behavior is validated across supported modes rather than only in the base theme;
- [ ] ownership, deprecation, rollback, and consumer-impact notes exist for breaking or behavioral changes;
- [ ] dark/high-contrast behavior is explicit or marked absent;
- [ ] type roles cover display/body/UI/data/caption and required script fallbacks;
- [ ] localization expansion and directionality do not depend on fixed widths;
- [ ] anti-slop token check: zero Tailwind arbitrary-value sprawl (`bg-[#...]`, `p-[13px]`), zero untouched `shadcn/ui` default zinc `:root` tokens on greenfield/redesign work, and zero raw hex leaks in components;
- [ ] every generated platform artifact is treated as output, not edited by hand.

The bundled exporter is intentionally small and zero-dependency. It validates the subset it emits; use a dedicated DTCG compiler for advanced spec features or production edge cases.
