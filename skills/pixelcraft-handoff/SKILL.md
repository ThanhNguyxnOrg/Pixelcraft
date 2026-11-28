---
name: pixelcraft-handoff
description: Translates approved designs, Figma MCP context, Code Connect bindings, Dev Mode specs, Penpot files, screenshots, approved AI-generated UI mockups (Mockup-First image-to-code), wireframes, and motion handoff prototypes into faithful, idiomatic implementation without losing existing architecture. Use for design-to-code, image-to-code, mockup-to-code, screenshot-to-code, variable-to-token mapping, existing-component reuse, missing-state resolution, cross-stack implementation, ambiguity handling, and visual-fidelity checking with pixelcraft-visual-qa.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft handoff

Design handoff is translation under uncertainty, not screenshot copying. Visual source material is evidence about intent; it is not automatically correct production architecture. Preserve existing components, tokens, state behavior, accessibility, localization, data contracts, and framework idioms before visual novelty.

**Approved-design rule:** when the user asks to implement an approved design, do not run divergence or change visual direction. Handoff preserves design intent. Divergence applies only to undecided parts such as missing states, missing breakpoints, unspecified behavior, token gaps, accessibility gaps, or regions explicitly labeled inspiration.

## References

- Read [references/design-translation.md](references/design-translation.md) for the translation contract, evidence hierarchy, component reuse, token mapping, stack-specific translation, missing states, `< 10m` clean-clone setup, license/account ownership handoff, and the visual-qa fidelity loop.
- Read [references/image-to-code.md](references/image-to-code.md) whenever the primary input is a **raster image**—an approved AI-generated UI mockup (Mockup-First track), product screenshot, static PNG/JPEG export, or hand wireframe without Figma/Penpot vector metadata (6-stage divide-and-conquer Layout Tree decomposition, AI-artifact stripping, semantic token/contrast extraction, icon/copy de-hallucination, state/responsive inference, and vision-guided self-correction).
- Read [references/motion-handoff.md](references/motion-handoff.md) when a design/prototype includes triggers, timing, easing, stagger, interruption, focus, or reduced-motion behavior.
- Read [references/fidelity-tolerance.md](references/fidelity-tolerance.md) before declaring acceptance tolerance, freezing fixtures, or interpreting visual diffs.

## Required workflow

1. **Establish the contract.** Record provenance/version/frame or asset, approval state, target stack, breakpoint/mode/locale/input, exact scope, deterministic fixture requirements, and region-aware acceptance tolerance.
2. **Inspect implementation first.** Inventory existing components/tokens/routes/state/data ownership. Reuse is the default; divergence from architecture must be justified.
3. **Gather structured evidence.** Prefer semantic variables, component metadata, variants, constraints, comments, and production mappings over screenshot inference; use screenshots as visual evidence rather than sole truth.
4. **Map before generating.** Match elements to existing components, variables, assets, and platform primitives. Resolve missing hover/focus/disabled/loading/empty/error/overflow/localization/`IME` states or label them assumptions.
5. **Translate idiomatically.** Map design variables into semantic project tokens through `pixelcraft-tokens`; implement in the actual target stack with stack-native isolated state previews (`#Preview`, `@Preview`, Widgetbook, QML/TUI fixtures, or component stories) rather than copying generated markup or absolute geometry.
6. **Verify fidelity & commercial handoff readiness.** Hand off rendered evidence to `pixelcraft-visual-qa` for screenshot/crop/overlay/diff comparison within declared tolerance; verify `< 10m` clean-clone setup, commercial asset license manifest, owner-level account/key boundaries, and post-launch regression baselines.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| evidence hierarchy | existing production behavior + semantic design metadata outrank generated code guesses; screenshots outrank nothing by themselves. |
| reuse | do not duplicate an existing component because a design tool emitted literal markup. |
| architecture | preserve framework conventions, state ownership, accessibility semantics, routing, data loading, and localization. |
| ambiguity | unknown interaction/state/token meaning is a question or explicit assumption—not silent invention. |
| fidelity | visual similarity never excuses broken keyboard behavior, contrast, overflow, empty/error/loading states, or content scaling. |
| privacy/security & ownership | zero hardcoded secrets; client/owner holds root billing & admin for DNS, store accounts, analytics/error DSNs, and signing keys; commercial licenses verified for fonts/icons/media. |
| anti-slop | do not flatten design into static absolute positioning, rasterize text, copy placeholder copy, or mimic visual noise without semantic structure. |

## Pre-submit checklist

- [ ] exact frame/component/version and target breakpoint/mode are recorded;
- [ ] existing component/token reuse decisions and semantic variable/mode mappings are documented;
- [ ] missing hover/focus/disabled/loading/error/empty/overflow/`IME` states are resolved (with stack-native isolated previews where supported) or labeled assumptions;
- [ ] reproducible `< 10m` clean-clone setup (lockfile, `.env.example`/config stub, strict active-language checks) verified;
- [ ] commercial license manifest (fonts, icon packs, stock/3D/audio rights) and owner-level account/key transfer boundaries (DNS, Store accounts, DSNs, signing certs) documented;
- [ ] rendered output compared at target sizes via `pixelcraft-visual-qa` with frozen post-launch regression baseline and declared region tolerances;
- [ ] intentional deviations and residual uncertainty are reported with honest evidence labels.
