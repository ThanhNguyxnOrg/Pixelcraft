# Print CSS and CSS Paged Media

Browser print engines implement only part of CSS Paged Media. Chromium 131+ supports CSS `@page` margin boxes, whereas Firefox and Safari still lag; dedicated paged-media engines (PrinceXML, WeasyPrint, Vivliostyle, Paged.js) implement the deeper specification. Validate every feature in the actual renderer before depending on it.

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
| standard size/orientation | `size: letter landscape;` | verify automatic orientation inversion per renderer |
| page margins | `margin: 18mm 15mm;` | physical margin inside paper edge |
| named pages | `page: invoice;` + `@page invoice` | assign from an element; renderer support is not universal |
| pseudo pages | `@page :first`, `:left`, `:right`, `:blank` | essential for duplex/book layouts; test in target engine |
| page counter | `counter(page)` | current page number inside `@page` margin boxes |
| total counter | `counter(pages)` | total page count inside `@page` margin boxes |
| margin boxes | `@bottom-right { content: counter(page) " / " counter(pages); }` | supported in Chromium 131+, PrinceXML, WeasyPrint, Vivliostyle, and Paged.js; Firefox/Safari still lag |

Margin boxes include `@top-left`, `@top-center`, `@top-right`, `@bottom-left`, `@bottom-center`, `@bottom-right`, and side margin boxes. Chromium 131+ (including Playwright/Puppeteer and Gotenberg Chromium) supports CSS `@page` margin boxes, while Firefox and Safari still lack full margin-box support. Do not rely on `@page` margin boxes for cross-browser native `window.print()`; use them confidently in controlled Chromium PDF pipelines, PrinceXML, WeasyPrint, Vivliostyle, or Paged.js.

## Modern CSS Paged Media idioms

These rules work in dedicated paged-media engines (PrinceXML, WeasyPrint, Vivliostyle, and partially Paged.js); native browser print does not support them reliably:

```css
/* 1. Dynamic running section headers via string-set + string() */
h1.chapter-title {
  string-set: chapter content(text);
}

@page {
  @top-center {
    content: string(chapter, first); /* first | start | last | first-except */
    font-size: 8.5pt;
    color: #4b5563;
  }
}

/* 2. Automatic Table of Contents dot leaders and target page numbers */
nav.toc a::after {
  content: " " leader('.') " " target-counter(attr(href url), page);
  font-variant-numeric: tabular-nums;
}

/* 3. True paged-media footnotes */
@page {
  @footnote {
    border-top: 0.5pt solid #9ca3af;
    padding-top: 3mm;
    margin-top: 4mm;
  }
}

span.fn {
  float: footnote;
  font-size: 8.5pt;
}

::footnote-call {
  content: counter(footnote);
  vertical-align: super;
  font-size: 75%;
}

::footnote-marker {
  content: counter(footnote) ". ";
}
```

Test `string()` edge cases on pages without headings, verify `target-counter()` resolves across multi-pass renders, and keep footnote density bounded so footnote blocks do not push body paragraphs into infinite page loops.

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

Use `mm`, `cm`, `in`, and `pt` for print-critical dimensions. Use `px` only for hairline rules or screen-first components whose conversion is intentional. Body copy for ordinary print often starts around 9–11pt depending on typeface, measure, and audience; legal/compact tables may go smaller only when tested at 100%. Verify x-height, paper, contrast, and reader needs rather than copying arbitrary numbers.

Design a type system:

- measure: often 60–90 characters for prose, narrower for dense reference matter;
- leading: enough for script/ascenders/diacritics; CJK/Indic/Arabic text may need different metrics;
- hyphenation/line breaking: language-dependent (`lang` attribute required for `hyphens: auto`) and renderer-dependent;
- font embedding/license: verify embedding rights and glyph coverage;
- fallback: test Latin diacritics, CJK, RTL, Indic shaping, symbols, emoji, and numeric styles actually used.

## Print color and backgrounds

Browsers may omit backgrounds by default to save ink. `-webkit-print-color-adjust: exact` / standard `print-color-adjust: exact` preserves backgrounds in Chromium and Safari when user settings allow, but users can still override print dialogs. Do not rely on background color alone for meaning.

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

Support for `bleed` and `marks` is renderer-specific (supported by PrinceXML, WeasyPrint, Vivliostyle, and Paged.js) and absent from ordinary browser print. In Typst, do not assume a universal `#set page(bleed: ...)` flag across versions—verify the pinned Typst release or prepress package, or expand page dimensions explicitly with trim offsets (see `references/pdf-tools.md`). For print-shop output, confirm required bleed (often 3mm / 0.125in), color profile (CMYK/ICC), imposition, crop/registration marks, DPI, and PDF/X expectations with the printer instead of guessing.

## Browser print limitations

Native cross-browser `window.print()` is suitable for simple documents, but still has gaps:

- `@page` margin boxes work in Chromium 131+, while Firefox and Safari still lag;
- inconsistent named-page, `:blank`, and counter behavior across engines;
- no cross-browser support for `string-set`, `target-counter()`, `leader()`, or `@footnote` / `float: footnote`;
- page background and header/footer toggles remain under end-user print-dialog control;
- no reliable crop marks/bleed or PDF/A / PDF/X prepress profiles.

Use browser print when the user invokes print directly and simple pagination is acceptable. Use Playwright/Gotenberg, PrinceXML, Vivliostyle, Paged.js, WeasyPrint, Typst, LaTeX, or React-PDF when exact pagination is a product requirement.

## Verification protocol

1. Print-preview or generate PDF with real content length distribution.
2. Inspect every page at 100% zoom and physically printed scale when possible (`rendered`).
3. Test first/middle/last page, blank pages, duplex left/right, repeated table headers, footnotes, figures, and totals.
4. Text-select/search/extract output (`pdftotext`). Invisible vector text or rasterized type is an accessibility failure unless explicitly accepted.
5. Compare light/dark/backgrounds-disabled/grayscale outputs.
6. Label unavailable verification `not-checked`; do not infer correct pagination from screen layout.
