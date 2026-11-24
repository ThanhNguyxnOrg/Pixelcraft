# Document, print, and slide capture

HTML or Typst source inspection is `static`; final document QA requires inspecting the compiled PDF or exported slide deck (`rendered`) after pagination, font subsetting, and rasterization.

## Rasterize pages for visual inspection

Render every representative page (cover, dense text, wide table, multi-page break, chart/diagram, final page) to PNG at `150 DPI` for layout review and `300 DPI` for fine print typography and hairlines:

```bash
# Poppler: rasterize all pages to PNG
pdftoppm -png -r 150 output.pdf qa-pages/page
pdftoppm -png -r 300 -f 1 -l 2 output.pdf qa-pages/print-check

# MuPDF alternative (fast, cross-platform)
mutool draw -r 150 -o qa-pages/page-%d.png output.pdf

# Inspect embedded raster images and resolution
pdfimages -list output.pdf
```

Check every rasterized page for orphaned headings, broken table headers across page splits, clipped margins/bleed, ink bleed onto dark areas, and unexpected font fallback.

## Reading order, fonts, and PDF/UA / PDF/A validation

```bash
# Verify selectable text and logical reading order (catch garbled multi-column extraction)
pdftotext output.pdf - | head -n 80

# Verify page geometry, title, and PDF tagging metadata
pdfinfo output.pdf
pdfinfo -struct output.pdf | head -n 60

# Verify every typeface is embedded (never unembedded system substitution)
pdffonts output.pdf

# Validate PDF/A archival or PDF/UA accessibility compliance when veraPDF is installed
verapdf --flavour 2b output.pdf
verapdf --flavour ua1 output.pdf
```

- `pdftotext` returning empty text or scrambled column order is a `P0`/`P1` defect (rasterized text or broken reading order).
- `pdffonts` showing `emb: no` for non-standard fonts means target viewers may substitute metrics and break pagination.

## Slide decks (Slidev / Marp / PptxGenJS)

Export slides to PNG/PDF in the actual presentation aspect ratio (`16:9` default, or `4:3` when specified):

```bash
# Slidev slide PNG/PDF export
npx slidev export --format png --output qa-slides/
npx slidev export --format pdf --output deck.pdf

# Marp CLI export
npx @marp-team/marp-cli slides.md --images png -o qa-slides/slide.png
npx @marp-team/marp-cli slides.md --pdf -o deck.pdf
```

Inspect exported slides at thumbnail scale and full-room viewing distance:

- **Projector contrast:** low-contrast muted gray text (`< 4.5:1`) and thin 1px hairlines wash out on lit conference projectors; test high-contrast legibility.
- **Density & overflow:** verify zero clipped bullets, overlapping footers/page numbers, or unreadable tiny code/chart labels (`≥ 18–24 pt` equivalent body text on slides).
- **Color & monochrome print:** test grayscale/print preview for documents expected to be printed on office laser printers.

## Evidence checklist

- [ ] compiled PDF/slide artifact rasterized at `150–300 DPI` and visually inspected (`rendered`);
- [ ] `pdftotext` reading order and selectable text verified (`rendered`);
- [ ] `pdffonts` confirms all custom fonts embedded (`static`/`rendered`);
- [ ] `pdfinfo` / `verapdf` PDF/UA or PDF/A check run where in scope, or labeled `not-checked`;
- [ ] page breaks, running headers/footers, bleed/safe margins, and grayscale/projector contrast checked.
