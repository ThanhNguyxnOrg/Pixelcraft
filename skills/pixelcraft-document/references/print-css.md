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
h1, h2, h3 {
  break-after: avoid;
  break-inside: avoid;
}

thead {
  display: table-header-group; /* repeat column headers at the top of every split page */
}

tfoot {
  display: table-footer-group;
}

tr, figure, .signature-block, .total-row {
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
| `break-inside: avoid` | keep a box together where possible | use for `tr`/figures/signatures/totals, never entire multi-page tables |
| `thead { display: table-header-group }` | repeat table header across page breaks | mandatory on multi-page financial, audit, and line-item tables |
| `orphans` / `widows` | minimum lines at bottom / carried to next page | set `orphans: 3; widows: 3;` and inspect real paragraph lengths |

## Physical units and typography

Exact relationships in CSS print:

```text
1in = 25.4mm = 72pt = 96 CSS px
```

Use `mm`, `cm`, `in`, and `pt` for print-critical dimensions. Use `px` only for hairline rules or screen-first components whose conversion is intentional. Body copy for ordinary print often starts around 9–11pt depending on typeface, measure, and audience; legal/compact tables may go smaller only when tested at 100%. Verify x-height, paper, contrast, and reader needs rather than copying arbitrary numbers.

Design a type system:

- measure: often 60–90 characters for prose, narrower for dense reference matter;
- leading: enough for script/ascenders/diacritics; CJK/Indic/Arabic/Vietnamese stacked diacritics need generous leading;
- hyphenation/line breaking: language-dependent (`lang` attribute required for `hyphens: auto`) and renderer-dependent;
- font embedding, `ToUnicode` CMap, and license: verify `pdffonts` (`emb=yes`, `uni=yes`) so ligatures (`fi`, `fl`), Vietnamese, and CJK copy cleanly without `□` tofu.

## Dual print profiles: Office Grayscale vs Commercial Prepress (`PDF/X-4`)

Select and design against the exact target print profile rather than mixing screen RGB habits with print-shop assumptions:

| Dimension | Profile A — Digital & Office Grayscale Proof | Profile B — Commercial Prepress (`PDF/X-4`) |
|---|---|---|
| **Margins & bleed** | **`10–12mm` minimum safe outer margin** (office laser/inkjet unprintable gripper edge); `0mm` bleed | **`3mm` (`0.125"`) bleed on all 4 sides** (`TrimBox` + `BleedBox`) + **`5mm` inner trim safety inset** for all live text/logos |
| **Color & ink budget** | sRGB with `-webkit-print-color-adjust: exact` / `print-color-adjust: exact`, **verified in grayscale** and with backgrounds disabled (`>= 4.5:1` contrast on white paper; patterns/direct labels distinguish red vs green series without color ink) | Target CMYK ICC output intent (e.g. `FOGRA39` / `ISO Coated v2` or `GRACoL 2013`), **Total Area Coverage `TAC <= 300%`**; **body black text (`< 18–24pt`) strictly `100% K` overprint (`C0 M0 Y0 K100`)**—never 4-plate rich black (`C60 M40 Y40 K100`), which ghosts/halos from press plate misregistration |
| **Graphics & DPI** | Strict vector SVG/PDF primitives for charts/logos; `150–300 DPI` photos | Strict vector SVG/PDF primitives for charts/logos/type; **`>= 300 effective DPI` at final printed dimensions** for continuous-tone photography |
| **Navigation & compliance** | Clickable TOC outline/bookmarks, hyperlinks, and **`PDF/UA-1` / `PDF/UA-2`** tag tree | **`PDF/X-4`** output intent, crop/registration marks outside bleed box (`marks: crop cross`), embedded fonts (`100%` subset/full), flattened or `PDF/X-4` live transparency per print shop spec |

```css
/* Commercial Prepress (@page in PrinceXML / WeasyPrint / Vivliostyle) */
@page {
  size: 210mm 297mm;
  margin: 16mm; /* >= 5mm trim safety inset strictly respected */
  bleed: 3mm;
  marks: crop cross;
}
```

Support for `bleed`, `marks`, and `cmyk()` / ICC profiles is renderer-specific (PrinceXML, WeasyPrint, Vivliostyle) and absent from native browser print. In Typst, verify pinned version flags or expand page dimensions (`width: 210mm + 6mm, height: 297mm + 6mm`) with explicit trim marks (see [pdf-tools.md](pdf-tools.md)).

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
