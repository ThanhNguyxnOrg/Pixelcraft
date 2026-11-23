---
name: pixelcraft-document
description: Designs and verifies paginated documents, print output, reports, invoices, CVs, and slide decks across web and document tooling. Use for print CSS, @page/paged media, page breaks, running headers/footers, physical units, bleed/prepress, PDF generation, Paged.js, WeasyPrint, React-PDF, Typst, LaTeX, document typography, invoices/reports/CVs, Slidev/reveal.js/Marp presentations, slide composition, projector legibility, and print/export verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft document

Documents are fixed-fragmentation interfaces. Screen scrolling assumptions do not apply: page size, margin boxes, breaks, running navigation, physical units, print color behavior, and final-file legibility are part of the design. Choose the renderer before writing print CSS because browser print, Paged.js, WeasyPrint, React-PDF, Typst, and LaTeX implement different subsets.

## References

- Read [references/print-css.md](references/print-css.md) for `@page`, named pages, counters, margin boxes, fragmentation, physical units, print color, bleed, and browser-support boundaries.
- Read [references/pdf-tools.md](references/pdf-tools.md) for Paged.js, WeasyPrint, React-PDF, Typst, and LaTeX selection plus exact integration constraints.
- Read [references/archetypes.md](references/archetypes.md) for invoice, report, and CV/résumé composition rules.
- Read [references/slides.md](references/slides.md) for Slidev, reveal.js, Marp, Keynote-style slide craft, safe areas, type scale, and export verification.

## Required workflow

1. **Define the artifact.** Identify final format (browser print, PDF file, print shop imposition, slide deck), page size/orientation, audience, reading distance, single/duplex use, locale, accessibility requirements, and distribution channel.
2. **Choose the rendering pipeline.** HTML/CSS when content is hypertext-like; React-PDF when React data components must emit controlled PDFs; Typst/LaTeX when programmatic typographic control matters; slides tooling when presentation state/navigation matters.
3. **Design the page system.** Cover/body/back matter, named pages, margins, columns, running headers/footers, numbering, captions, tables, figures, blank pages, and error/missing-data states.
4. **Control fragmentation.** Specify where breaks may/must happen before styling decoration. Tables, headings, figures, signatures, totals, and footnotes need explicit behavior.
5. **Use physical typography.** Set real type sizes/leading/measure in pt/mm; verify script/font fallback, embedding/licensing, hyphenation, widows/orphans, and color contrast on paper/projector.
6. **Verify the final artifact.** Inspect the actual PDF/print preview/slides at 100% and final size. Screen HTML is not evidence of correct pagination.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| truthfulness | Totals, dates, references, legal text, names, and page numbers must be data-driven or explicitly marked draft/placeholder; never invent invoice/report content. |
| fragmentation | No orphan headings, split signature blocks, dangling table headers, clipped footnotes, or totals separated from the rows they summarize unless intentional and labeled. |
| physical correctness | Use mm/pt/in for print dimensions; CSS px are screen abstraction, not print measurements. |
| legibility | Body text must remain readable at final size; slides must be legible from the back of the room, not merely on the author's monitor. |
| accessibility | PDF/export needs document structure, meaningful reading order, text alternatives for images/charts, selectable text where possible, and sufficient contrast. |
| renderer awareness | Do not claim support for margin boxes, footnotes, bleed, grid, or font behavior without checking the chosen renderer. |
| anti-slop | Avoid decorative report templates, fake charts, stock-photo covers, dense wall-of-text slides, and generic blue corporate styling detached from content. |

## Pre-submit checklist

- [ ] output medium, renderer, page size/orientation, locale, and duplex/bleed requirements are explicit;
- [ ] named pages/page numbering/running headers/footers behave correctly;
- [ ] break rules tested with short/long/missing data and repeated tables/figures;
- [ ] fonts are embedded/licensed and fallback behavior inspected;
- [ ] contrast/background behavior tested in print/PDF/projector output;
- [ ] actual generated artifact inspected at 100% and final size;
- [ ] accessibility/reading order/text extraction checked or labeled `not-checked`;
- [ ] document/slide content is truthful, necessary, and free of template filler.
