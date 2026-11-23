---
name: pixelcraft-handoff
description: Translates approved designs, Figma selections, screenshots, mockups, and design-system artifacts into faithful implementation without losing existing architecture. Use for design-to-code translation, variable-to-token mapping, existing-component reuse, missing-state resolution, cross-stack implementation, ambiguity handling, and visual-fidelity checking with pixelcraft-visual-qa.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft handoff

Design handoff is translation under uncertainty, not screenshot copying. Visual source material is evidence about intent; it is not automatically correct production architecture. Preserve existing components, tokens, state behavior, accessibility, localization, data contracts, and framework idioms before visual novelty.

**Approved-design rule:** when the user asks to implement an approved design, do not run divergence or change visual direction. Handoff preserves design intent. Divergence applies only to undecided parts such as missing states, missing breakpoints, unspecified behavior, token gaps, accessibility gaps, or regions explicitly labeled inspiration.

## References

- Read [references/design-translation.md](references/design-translation.md) for the translation contract, evidence hierarchy, component reuse, token mapping, stack-specific translation, missing states, accessibility preservation, and the visual-qa fidelity loop.
- Read [references/fidelity-tolerance.md](references/fidelity-tolerance.md) before declaring acceptance tolerance, freezing fixtures, or interpreting visual diffs.

## Required workflow

1. **Establish the contract.** Record provenance/version/frame or asset, approval state, target stack, breakpoint/mode/locale/input, exact scope, deterministic fixture requirements, and region-aware acceptance tolerance.
2. **Inspect implementation first.** Inventory existing components/tokens/routes/state/data ownership. Reuse is the default; divergence from architecture must be justified.
3. **Gather structured evidence.** Prefer semantic variables, component metadata, variants, constraints, comments, and production mappings over screenshot inference; use screenshots as visual evidence rather than sole truth.
4. **Map before generating.** Match elements to existing components, variables, assets, and platform primitives. Resolve missing hover/focus/disabled/loading/empty/error/overflow/localization states or label them assumptions.
5. **Translate idiomatically.** Map design variables into semantic project tokens through `pixelcraft-tokens`; implement in the actual target stack rather than copying generated markup or absolute geometry.
6. **Verify fidelity.** Hand off rendered evidence to `pixelcraft-visual-qa` for screenshot/crop/overlay/diff comparison within a declared tolerance; repair meaningful divergence and report residual uncertainty.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| evidence hierarchy | existing production behavior + semantic design metadata outrank generated code guesses; screenshots outrank nothing by themselves. |
| reuse | do not duplicate an existing component because Figma output emitted literal markup. |
| architecture | preserve framework conventions, state ownership, accessibility semantics, routing, data loading, and localization. |
| ambiguity | unknown interaction/state/token meaning is a question or explicit assumption—not silent invention. |
| fidelity | visual similarity never excuses broken keyboard behavior, contrast, overflow, empty/error/loading states, or content scaling. |
| privacy/security | do not expose proprietary design files, assets, tokens, or MCP endpoints beyond the intended client/session. |
| anti-slop | do not flatten design into static absolute positioning, rasterize text, copy placeholder copy, or mimic visual noise without semantic structure. |

## Pre-submit checklist

- [ ] exact frame/component/version and target breakpoint/mode are recorded;
- [ ] existing component/token reuse decisions are documented;
- [ ] semantic variables/modes map to project tokens or deliberate overrides;
- [ ] missing hover/focus/disabled/loading/error/empty/overflow states are resolved or labeled assumptions;
- [ ] implementation uses real data/state behavior rather than static screenshot structure;
- [ ] rendered output was compared at target sizes using the `pixelcraft-visual-qa` skill where available, with normalized fixture/scale and declared region tolerances;
- [ ] intentional deviations and residual uncertainty are reported.
