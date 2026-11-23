# Print CSS and CSS Paged Media

Browser print engines implement only part of CSS Paged Media. Paged.js and WeasyPrint implement more. Validate every feature in the actual renderer before depending on it.

## Core `@page` model

```css
@page {
  size: A4 portrait;
  margin: 18mm 16mm 20mm 16mm;
}

@page cover {
  margin: 0;
  background: #102033;
}

.cover-page {
  page: cover;
}
```

Useful forms:

| Feature | Example | Notes |
|---|---|---|
| explicit dimensions | `size: 210mm 297mm;` | width then height |
| standard size/orientation | `size: letter landscape;` | support varies for automatic orientation inversion |
| page margins | `margin: 18mm 15mm;` | physical margin inside paper edge |
| named pages | `page: invoice;` + `@page invoice` | assign from an element; renderer support is not universal |
| pseudo pages | `@page :first`, `:left`, `:right`, `:blank` | support varies; important for duplex/book layouts |
| page counter | `counter(page)` | current page number where counters are supported |
| total counter | `counter(pages)` | total page count where supported |
| margin boxes | `@bottom-right { content: counter(page); }` | essential for running headers/footers, but not broadly supported by native browser print |

Margin boxes include `@top-left`, `@top-center`, `@top-right`, `@bottom-left`, `@bottom-center`, `@bottom-right`, and side margin boxes in the specification. Chromium/native print does not expose the full margin-box model; do not write production headers/footers assuming it. Use Paged.js/WeasyPrint/print-engine verification.

## Fragmentation control

Use modern properties plus legacy aliases only when needed by the target renderer:

```css
h2, h3 {
  break-after: avoid;
  break-inside: avoid;
}

figure, .signature-block, .total-row {
  break-inside: avoid;
}

section.chapter {
  break-before: page;
}

table {
  break-inside: auto;
}
```

| Property | Meaning | Design rule |
|---|---|---|
| `break-before: page` | force a break before the element | use for chapters/major sections, not every card |
| `break-after: avoid` | prevent a break immediately after | essential for headings before content |
| `break-inside: avoid` | keep a box together where possible | use for figures/signatures/totals, not entire long tables |
| `orphans` | minimum lines left at bottom | set deliberately; initial/support behavior varies |
| `widows` | minimum lines carried to next page | pair with orphans and inspect real text lengths |

Tables need separate rules: repeat `<thead>` where the renderer supports it, avoid breaking rows (`tr { break-inside: avoid; }`), and never apply `break-inside: avoid` to a table taller than one page.

## Physical units and typography

Exact relationships in CSS print:

```text
1in = 25.4mm = 72pt = 96 CSS px
```

Use `mm`, `cm`, `in`, and `pt` for print-critical dimensions. Use `px` only for hairline rules or screen-first components whose conversion is intentional. Body copy for ordinary print often starts around 9–11pt depending on typeface, measure, and audience; legal/compact tables may go smaller only when tested at 100%. Do not copy these numbers as a rule—verify x-height, paper, contrast, and reader needs.

Design a type system:

- measure: often 60–90 characters for prose, narrower for dense reference matter;
- leading: enough for script/ascenders/diacritics; CJK/Indic/Arabic text may need different metrics;
- hyphenation/line breaking: language-dependent and renderer-dependent;
- font embedding/license: verify embedding rights and glyph coverage;
- fallback: test Latin diacritics, CJK, RTL, Indic shaping, symbols, emoji, and numeric styles actually used.

## Print color and backgrounds

Browsers may omit backgrounds by default to save ink. Chromium-family print supports the nonstandard-but-widely-used `-webkit-print-color-adjust: exact` / standard `print-color-adjust: exact`, but users and print settings can still alter output. Do not rely on background color alone for meaning.

Rules:

- foreground/background contrast must remain sufficient on white paper if backgrounds are dropped;
- avoid full-bleed dark backgrounds unless the artifact truly requires them; ink cost and printer margins matter;
- test grayscale because office printers often default to monochrome;
- use patterns/line styles as redundant differentiation in charts/tables;
- never use color-only red/green semantics.

## Bleed, trim, and printer marks

Professional print artifacts use bleed so color/images extend beyond trim:

```css
@page {
  size: 210mm 297mm;
  bleed: 3mm;
  marks: crop cross;
}
```

Support for `bleed` and `marks` is renderer-specific and generally absent from ordinary browser print. Typst supports page `bleed` directly and defines a PDF `TrimBox` when nonzero. For print-shop output, confirm required bleed (often 3mm/0.125in but not universal), color profile, imposition, crop/registration marks, DPI, and PDF/X expectations with the printer instead of guessing.

## Browser print limitations

Native browser printing is suitable for simple documents, but historically lacks much of the advanced model:

- limited/no support for arbitrary margin boxes;
- inconsistent named-page and counter behavior;
- limited footnotes/running strings/leaders/bookmarks;
- page background/user print settings outside app control;
- no reliable crop marks/bleed.

Use the browser when the user controls print invocation and simple pagination is acceptable. Use Paged.js/WeasyPrint/Typst/LaTeX/React-PDF when exact pagination is a product requirement.

## Verification protocol

1. Print-preview or generate PDF with real content length distribution.
2. Inspect every page at 100% zoom and physically printed scale when possible.
3. Test first/middle/last page, blank pages, duplex left/right, repeated table headers, footnotes, figures, and totals.
4. Text-select/search/extract output. Invisible vector text or rasterized type is an accessibility failure unless explicitly accepted.
5. Compare light/dark/backgrounds-disabled/grayscale outputs.
6. Label unavailable verification `not-checked`; do not infer correct pagination from browser layout.
