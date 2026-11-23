# Polish checklist

Polish refines an accepted direction; do not use it to restart visual exploration.

## Alignment and spacing

- inspect optical alignment of icons/text/baselines/caps, not only numeric boxes;
- equalize outer content edges and intentional asymmetry; remove accidental 1–2px drift where units allow;
- verify spacing rhythm at empty/compact/long-content states;
- test narrow/wide/text-scaled/RTL/window-resize/safe-area/keyboard occlusion.

## States and interaction

- hover/focus/active/selected/disabled/pressed/visited where applicable;
- loading/success/error/empty/offline/permission/concurrency states;
- target size/hit area/focus visibility/keyboard and controller path;
- scroll restoration/back/escape/deep-link behavior.

## Copy and localization

- buttons are consequence verbs; errors explain recovery; empty states give useful action;
- scan truncation, capitalization, punctuation, plural/gender, mixed bidi, long compounds, numeric/date/locale formats;
- remove filler, blame, fake enthusiasm, and repeated vague links.

## Visual craft

- hierarchy survives squint/grayscale; no unintended color-only dependence;
- radius/elevation/border/shadow vary semantically rather than uniformly;
- image crop/provenance/alt treatment correct; icon optical sizes consistent;
- dark/light/high-contrast themes preserve semantic meaning and state visibility.

## Motion/performance

- motion has purpose, correct duration/easing/interruptibility, and reduced-motion equivalent;
- no layout shift, input blockage, scroll-jacking, or decorative animation noise;
- inspect actual assets/fonts/images and priority ordering, not just bundle size.

Every polish note still needs evidence and severity; most are P3 unless they impair use.
