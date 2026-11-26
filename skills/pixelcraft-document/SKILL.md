---
name: pixelcraft-document
description: Designs and verifies paginated documents, print output, reports, invoices, CVs, Office exports, and slide decks across web and document tooling. Use for print CSS, @page/paged media, page breaks, running headers/footers, physical units, bleed/prepress, PDF generation, Playwright PDF, Gotenberg, Paged.js, WeasyPrint, PrinceXML, Vivliostyle, React-PDF, pdf-lib, Typst, LaTeX, Quarto, PDF/UA, PDF.js, PptxGenJS, docx, ExcelJS, document typography, invoices/reports/CVs, Slidev/reveal.js/Marp/Touying presentations, projector legibility, and export verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft document

Documents are fixed-fragmentation interfaces. Screen scrolling assumptions do not apply: page size, margin boxes, breaks, running navigation, physical units, print color behavior, and final-file legibility are part of the design. Choose the renderer before writing print CSS because browser print, Playwright/Gotenberg, Paged.js, WeasyPrint, PrinceXML, Vivliostyle, React-PDF, Typst, and LaTeX implement different subsets.

## Surface craft

Build a reading sequence around repeated headers, explicit units and page boundaries, not screen-size sections. Keep related rows or notes together when pagination allows, and verify totals, source facts, selectable text and reading order in the final tagged/exported artifact. Check the actual zoom, grayscale or projector distance; do not flatten a useful document to slides-as-images.

## References

- Read [references/print-css.md](references/print-css.md) for `@page`, named pages, counters, margin boxes, `string-set`, `target-counter()`, footnotes, fragmentation, physical units, print color, bleed, and browser-support boundaries.
- Read [references/pdf-tools.md](references/pdf-tools.md) for Playwright PDF, Gotenberg, PrinceXML, Vivliostyle, Paged.js, WeasyPrint, React-PDF, `pdf-lib`, ReportLab/PDFKit, Typst, LaTeX, Quarto, and Office (`docx`/`python-docx`, ExcelJS/SheetJS) toolchains.
- Read [references/archetypes.md](references/archetypes.md) for invoice (including ZUGFeRD/Factur-X hybrid e-invoicing), report, CV/résumé, and PDF/UA tagging composition rules.
- Read [references/slides.md](references/slides.md) for Slidev, reveal.js, Marp, Touying/Polylux, Quarto RevealJS, Keynote-style slide craft, safe areas, type scale, and export verification.
- Read [references/pdfjs-and-pptx.md](references/pdfjs-and-pptx.md) when embedding client-side PDF viewers (`pdfjs-dist` worker, `TextLayer`, HiDPI transform, cancellation) or generating programmatic PowerPoint decks (`pptxgenjs`).

## Required workflow

1. **Define the artifact.** Identify final format (browser print, PDF file, print shop imposition, slide deck), page size/orientation, audience, reading distance, single/duplex use, locale, accessibility requirements, and distribution channel.
2. **Choose the rendering pipeline.** HTML/CSS when content is hypertext-like; React-PDF when React data components must emit controlled PDFs; Typst/LaTeX when programmatic typographic control matters; slides tooling when presentation state/navigation matters.
3. **Design the page system.** Cover/body/back matter, named pages, margins, columns, running headers/footers, numbering, captions, tables, figures, blank pages, and error/missing-data states.
4. **Control fragmentation.** Specify where breaks may/must happen before styling decoration. Tables, headings, figures, signatures, totals, and footnotes need explicit behavior.
5. **Use physical typography.** Set print body copy within **`9–12 pt`** (`1.35–1.5` leading, `45–75ch` measure) in explicit `pt`/`mm` units; verify script/font fallback, embedding/licensing, hyphenation, widows/orphans (`>= 2–3` lines), and color contrast on paper/projector.
6. **Verify the final artifact.** Cross-check all calculations/clauses against source data, rasterize/inspect representative pages at `100%` zoom + grayscale/physical print proof (`rendered`—screen HTML or `static` PDF byte checks never satisfy **Rule #0.3** alone).

## Anti-lazy-default & anti-slop guard

- **Never default to `window.print()`, raw browser screenshots, or unpaginated screen HTML** for paginated invoices, reports, contracts, books, or regulatory PDFs merely because HTML is familiar. Choose a dedicated pagination pipeline—**Typst**, **WeasyPrint**, **Quarto**, **React-PDF**, **PrinceXML / Vivliostyle**, **LaTeX**, or **Playwright PDF / Gotenberg** with explicit `@page` rules—that satisfies the required fragmentation, PDF/UA tagging, font embedding, and reproducibility contract.
- **Reject decorative template slop**: never ship stock-photo report covers, fake placeholder charts, rasterized slide-as-image exports, or generic corporate-blue styling detached from real source data.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| truthfulness & source cross-check | **Cross-check totals, subtotals, tax/line-item math, dates, legal clauses, and signature blocks directly against source data**; never invent invoice/report figures or silently round mismatched totals. |
| physical body scale & fragmentation | Keep print/PDF body typography in **`9–12 pt`**; enforce `thead { display: table-header-group }`, `h1, h2, h3 { break-after: avoid; break-inside: avoid }`, and `break-inside: avoid` on `tr`, figures, **signature blocks**, and **invoice totals** (never splitting totals or signatures onto an orphaned trailing page without context). |
| dual print profiles | Choose explicitly between **(A) Digital & Office Grayscale Proof** (`10–12mm` safe hardware margins, grayscale legibility without color ink, clickable TOC bookmarks, `PDF/UA` tags) and **(B) Commercial Prepress (`PDF/X-4`)** (`3mm` / `0.125"` bleed on all sides, `5mm` inner trim safety inset, `>= 300 effective DPI` photos, `FOGRA39`/`GRACoL` CMYK ICC, `TAC <= 300%`, and **body black text on single-plate `100% K` overprint `C0 M0 Y0 K100`**). |
| font subset & `ToUnicode` CMap | Verify via `pdffonts` (`emb=yes`, `uni=yes`) + `pdftotext` that subsetted fonts retain a valid `ToUnicode` CMap so copying Vietnamese, CJK, or ligatures (`fi`, `fl`) and running ATS/search parsers never yields tofu `□` or garbled bytes. |
| vector vs raster | Emit charts, diagrams, and logos as **strict vector SVG / PDF primitives**; reserve `>= 300 effective DPI` raster strictly for photographs or `100k+`-point dense heatmaps. |
| slide deck parity & speaker notes | Build on **Master Slide** layouts (`>= 24pt` room-projection body floor, `>= 18pt` dense leave-behind), include structured **speaker notes** when presenter delivery is in scope, embed/use universal fonts, keep `< 25–30 MB` email-safe deck size, emit native editable `.pptx` objects (never rasterized PNG slides), and verify **`PPTX <-> PDF` visual parity**. |
| accessibility & deliverable proofs | Ship `PDF/UA` tag trees (`H1`–`H6`, `Table`/`TH` scope, `Artifact` running headers/footers, `Figure` alt text) and deliver **representative rendered page captures (first, middle, last, multi-page table break, and edge-case long dynamic fields)** plus a **grayscale / physical print proof**. |

## Pre-submit checklist

- [ ] output profile explicit: **Digital/Office Grayscale (`PDF/UA`)** vs **Commercial Prepress (`PDF/X-4`, `3mm` bleed, `5mm` safety, `TAC <= 300%`, `100% K` body black)** vs **Slide Deck (`16:9`, `< 25–30 MB`)**;
- [ ] **`9–12 pt` print body typography**, **totals / line-item math / legal clauses / signature blocks cross-checked against source data**, `thead` repeat, and `break-after: avoid` / `break-inside: avoid` verified;
- [ ] `pdffonts` confirms `emb=yes` and `uni=yes` (`ToUnicode` CMap intact—Vietnamese/CJK/ligatures `fi`/`fl` copy cleanly with zero `□`);
- [ ] charts/logos are vector SVG/PDF primitives; slide decks enforce Master Slides, `>= 24pt` projection (`>= 18pt` leave-behind), **speaker notes** (when in scope), native editable `.pptx` primitives, and **`PPTX <-> PDF` parity**;
- [ ] **representative rendered page captures (first, middle, last, multi-page table break, edge-case long dynamic fields)** and **grayscale / physical print proof** inspected (`rendered`) alongside `check-pdf.mjs` (`--prepress` when print-targeted, `static`);
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-pdf.mjs`, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` page/slide proofs per `Rule #0.3`).
