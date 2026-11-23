# Repetition history

Use this reference before direction generation and during review. Its purpose is to prevent unrelated outputs from converging on the same composition, palette, typography, motion, imagery, and copy formulas. It is not a ban on coherent design-system reuse inside one product.

## Location and privacy

Use `.pixelcraft/history.json` in the user's project when writable. Do not commit it unless the user asks; it may reveal project strategy or unreleased surfaces. If the file cannot be written, keep the same structure in `.pixelcraft/plan.md` or the final report for the current run.

## Canonical format

```json
{
  "version": 1,
  "entries": [
    {
      "date": "2026-01-01",
      "project": "optional-project-name",
      "surface": "marketing-home",
      "mode": "Persuade",
      "direction": "blueprint-instrument",
      "axes": {
        "composition": "technical-grid",
        "type": "mono-serif-contrast",
        "color": "paper-cobalt-signal-red",
        "material": "flat-print",
        "motion": "measurement-snap",
        "imagery": "annotated-diagram",
        "density": "high",
        "copy": "specification-led"
      },
      "signature": "measurement-scale-navigation",
      "fingerprint": "stable-short-hash-of-normalized-axes",
      "selected": true,
      "rejectedReason": "",
      "notes": "optional"
    }
  ]
}
```

Record rejected candidates only when their signatures are strong enough that seeing them again would be useful. Do not fill the ledger with every discarded sketch.

## Normalization

Use stable lowercase hyphenated labels rather than prose paragraphs:

- composition family (`centered-hero-cards`, `editorial-grid`, `instrument-panel`, `split-narrative`);
- type voice (`neo-grotesk-sans`, `editorial-serif-display`, `terminal-mono`, `script-accent`);
- color posture (`paper-ink-signal`, `dark-neon`, `muted-earth`, `system-monochrome`);
- material (`flat-print`, `glass-depth`, `paper-texture`, `industrial-metal`, `pixel-grid`);
- motion behavior (`none`, `measurement-snap`, `scroll-narrative`, `spring-playful`, `shader-ambient`);
- imagery/material source (`diagram`, `product-macro`, `archive-photo`, `generated-abstract`, `icon-only`);
- density (`low`, `medium`, `high`, `mixed`);
- copy formula (`benefit-superlative`, `specification-led`, `documentary`, `conversation`, `sparse-label`).

The fingerprint may be a stable short hash of normalized axes. Never use screenshots, proprietary copy, or secrets as the fingerprint.

## Recall procedure

Before scoring directions:

1. read entries for this project and nearby unrelated projects when the user permits;
2. group repeated composition families, type voices, color postures, motion behavior, signature shapes, and copy formulas;
3. distinguish intentional product-system continuity from accidental repetition;
4. penalize candidates repeating a recent fingerprint unless the brief explicitly asks for continuity;
5. force at least one axis family to change materially when a repeat is selected for a valid reason;
6. record the final selected direction and meaningful rejected near-misses.

## Review use

During review, compare the implementation rather than only the proposal. Agents often propose diversity and then collapse back to default cards during implementation. A repetition finding should name the repeated axes and evidence, not merely say “looks generic.”

## Limits

History detects recurrence, not quality. A repeated system may be correct within one product suite; a never-used composition may still be wrong. Use history as a divergence constraint alongside task fit, accessibility, platform conventions, and content truth.
