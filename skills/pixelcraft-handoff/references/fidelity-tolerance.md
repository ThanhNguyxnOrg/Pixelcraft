# Fidelity tolerance schema

Use this reference before comparing an implementation with an approved design. Declare tolerances before looking at the diff; otherwise every difference becomes either noise or a taste argument.

## Compare only normalized inputs

Before measurement:

- same source version/frame/component and approval state;
- same breakpoint/orientation/density/theme/mode/locale/direction;
- same viewport dimensions and device scale factor;
- same data fixture and time-dependent state;
- same fonts/assets or explicitly documented substitutions;
- same scroll position and capture crop;
- animations frozen at a deterministic state or replaced by reduced/static equivalents.

If these cannot be matched, label the comparison partial rather than inflating tolerance until nothing can fail.

## Region classes

Assign each visual region a class before diffing:

| Class | Examples | Comparison posture |
|---|---|---|
| critical geometry | navigation shell, form controls, primary content boundaries, touch targets, focus rings | strict offset/size/clipping checks |
| text and typography | headings, body copy, labels, numerals | font/shaping/measurement comparison; exact pixels not required across rasterizers |
| color/theme | semantic surfaces, accents, state colors, focus/selection | compare sampled role values and contrast behavior, not isolated pixels |
| asset/media | icons, illustrations, product imagery | compare placement/crop/aspect/provenance; dynamic compression noise may be tolerated |
| dynamic content | timestamps, avatars, random ordering, ads, live data, localization expansions | freeze fixture or mark exempt with reason |
| decorative noise | grain, shadows, shader texture, motion blur | compare presence/intent; broad tolerance unless it harms legibility |
| platform chrome | scrollbars, status bars, native picker chrome, window controls | normalize/exclude unless product controls it |

## Tolerance record

```markdown
| Region | Class | Max x/y offset | Max size delta | Color/alpha tolerance | Clipping/overlap | Contrast/state rule | Exemptions |
|---|---|---:|---:|---:|---|---|---|
| header nav | critical geometry | 1px | 1px | semantic exact or documented rounding | none allowed | focus visible; no overlap | none |
| hero illustration | asset/media | 2px | 2% | perceptual/asset compression | crop must match intent | no text contrast loss | compression noise |
```

Use measurements appropriate to the surface: CSS px, dp/pt/sp, terminal cells, print units, texture coordinates, or physical-window pixels. State the unit. Do not copy web pixel tolerances into native/print/game contexts.

## Hard failures independent of tolerance

Tolerance never excuses:

- clipped/truncated essential text or control labels;
- invisible/obscured focus or missing keyboard/controller path;
- contrast/state failure, color-only meaning, or wrong semantic exposure;
- control overlap, accidental horizontal scrolling, unsafe-area/system-chrome collision;
- missing required state, mode, locale, breakpoint, or input modality;
- wrong content/provenance, invented assets, or placeholder copy presented as final;
- broken layout constraints hidden by scaling/cropping the capture;
- intentional deviation that was never recorded/approved.

## Diff interpretation procedure

1. normalize scale/viewport/fixture;
2. compare full-frame geometry first, then high-value crops;
3. inspect alignment edges and clipping boundaries before aggregate color difference;
4. classify every meaningful difference by cause: layout geometry, typography/rasterization, color/theme, asset rendering, dynamic content, state mismatch, accessibility regression, platform idiomatic adaptation, or intentional deviation;
5. repair semantic/accessibility/state defects before pixel geometry;
6. rerun only affected comparisons and preserve artifacts/version metadata.

A low pixel difference is not fidelity if behavior or meaning changed. A high pixel difference is not automatically failure if fonts rasterize differently or a deliberate platform adaptation was approved.

## Deterministic fixture requirements

For repeatable handoff verification, maintain fixture descriptions in the project where feasible:

```markdown
| Fixture | Data/time/locale/theme/viewport/network/input | Expected end state |
|---|---|---|
| checkout-error | expired card fixture; frozen timestamp; en-LTR; light; 390×844; offline then online; keyboard/touch | preserved inputs, field error, summary focus, retry enabled |
```

Freeze clocks, random seeds, ordering, feature flags, permissions, network responses, and user state where the stack permits. Use synthetic/redacted data. A fixture that cannot be reproduced by another agent is documentation, not a deterministic verification fixture.
