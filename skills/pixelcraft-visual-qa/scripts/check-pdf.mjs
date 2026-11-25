#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function help() {
  return `Usage: node check-pdf.mjs <file.pdf> [--prepress] [--json]

Zero-dependency static binary PDF inspector. Verifies the %PDF- header, file size,
page count heuristic (/Type /Page), PDF/UA structure markers (/StructTreeRoot,
/MarkInfo, /Lang, /Title), font embedding (/FontFile, /FontFile2, /FontFile3),
subset/CID text extraction maps (/ToUnicode CMap), and optional commercial prepress
PDF/X markers (/TrimBox, /BleedBox, /OutputIntents).
Always reports honest "static" evidence labeling.

Options:
  --prepress   Enforce commercial print prepress gates (/TrimBox, /BleedBox, /OutputIntents, /ToUnicode)
  --json       Print machine-readable JSON output
  --help       Show this help`;
}

function parseCli(args) {
  const out = { help: false, json: false, prepress: false, input: '' };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--json') out.json = true;
    else if (arg === '--prepress') out.prepress = true;
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else if (!out.input) out.input = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return out;
}

function inspectPdf(buffer, { prepress = false } = {}) {
  const findings = [];
  const add = (rule, severity, message, fix) => {
    findings.push({ rule, severity, message, fix });
  };

  const fileSizeBytes = buffer.length;
  const raw = buffer.toString('latin1');
  const headerMatch = /^%PDF-(\d+\.\d+)/.exec(raw);
  const validHeader = Boolean(headerMatch);
  const pdfVersion = headerMatch ? headerMatch[1] : null;
  const hasEof = /%%EOF\b/.test(raw);

  if (!validHeader) {
    add('invalid-pdf-header', 'P0', 'File does not start with a valid %PDF-<major>.<minor> header.',
      'Ensure the export produced a valid binary PDF document.');
  }
  if (validHeader && !hasEof) {
    add('truncated-pdf', 'P1', 'Missing %%EOF trailer marker; PDF may be truncated.',
      'Re-export the PDF and verify the writer flushed cleanly.');
  }

  const pageObjects = (raw.match(/\/Type\s*\/Page\b(?!s)/g) || []).length;
  const countMatches = [...raw.matchAll(/\/Type\s*\/Pages\b[\s\S]{0,200}?\/Count\s+(\d+)/g)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));
  const pagesTreeCount = countMatches.length ? Math.max(...countMatches) : 0;
  const pageCount = pageObjects > 0 ? pageObjects : pagesTreeCount;

  if (validHeader && pageCount === 0) {
    add('no-pages-detected', 'P1', 'No /Type /Page objects detected in PDF.',
      'Verify the PDF generator emitted at least one page.');
  }

  const structTreeRoot = /\/StructTreeRoot\b/.test(raw);
  const markInfo = /\/MarkInfo\b/.test(raw);
  const lang = /\/Lang\s*(?:\([^)]+\)|<[0-9a-fA-F]+>)/.test(raw);
  const title = /\/Title\s*(?:\([^)]+\)|<[0-9a-fA-F]+>)|<dc:title\b/i.test(raw);
  const fontFileCount = (raw.match(/\/FontFile(?:2|3)?\b/g) || []).length;
  const embeddedFonts = fontFileCount > 0;
  const toUnicodeCMap = /\/ToUnicode\b/.test(raw);
  const cidOrSubsetFonts = /\/Subtype\s*\/Type0\b|\/Encoding\s*\/Identity-[HV]\b|\/BaseFont\s*\/[A-Z]{6}\+/.test(raw);
  const trimBox = /\/TrimBox\b/.test(raw);
  const bleedBox = /\/BleedBox\b/.test(raw);
  const outputIntents = /\/OutputIntents\b|\/GTS_PDFX\b/.test(raw);
  const compressedObjectStreams = /\/ObjStm\b/.test(raw);

  if (validHeader) {
    if (!structTreeRoot) {
      add('missing-struct-tree', 'P1', 'Missing /StructTreeRoot (tagged PDF structure tree for PDF/UA accessibility).',
        'Enable tagged PDF output (e.g. Typst PDF/UA, WeasyPrint/Chromium tagged PDF, or LaTeX tagpdf) so reading order and headings are exposed to assistive technology.');
    }
    if (!markInfo) {
      add('missing-mark-info', 'P2', 'Missing /MarkInfo dictionary indicating tagged PDF conformance.',
        'Emit /MarkInfo << /Marked true >> in the PDF catalog.');
    }
    if (!lang) {
      add('missing-pdf-lang', 'P1', 'Missing document language /Lang metadata.',
        'Set document language metadata (e.g. Typst #set text(lang: "en"), HTML <html lang="en">, or PDF catalog /Lang).');
    }
    if (!title) {
      add('missing-pdf-title', 'P2', 'Missing document /Title metadata.',
        'Set document title metadata so PDF viewers and screen readers announce a clear title.');
    }
    if (!embeddedFonts) {
      add('unembedded-fonts', 'P1', 'No embedded font stream markers (/FontFile, /FontFile2, /FontFile3) detected.',
        'Subset and embed all fonts in the PDF so typography does not silently substitute on other machines.');
    } else if ((cidOrSubsetFonts || prepress) && !toUnicodeCMap && !compressedObjectStreams) {
      add('missing-tounicode-cmap', 'P1', 'Embedded subset/CID font detected without a /ToUnicode CMap stream; copying text (especially diacritics, ligatures, or CJK) or running ATS/search extraction may yield tofu (□) or garbled bytes.',
        'Configure the PDF exporter to emit /ToUnicode CMap tables for all subsetted fonts and verify with pdffonts (uni=yes).');
    }

    if (prepress && !compressedObjectStreams) {
      if (!trimBox) {
        add('missing-trim-box', 'P1', 'Missing /TrimBox page geometry required for commercial print trimming.',
          'Define finished trim dimensions (/TrimBox) in your PDF/X prepress export.');
      }
      if (!bleedBox) {
        add('missing-bleed-box', 'P1', 'Missing /BleedBox (typically 3mm / 0.125in beyond TrimBox) required for edge-to-edge commercial printing.',
          'Export with 3mm (0.125in) bleed (/BleedBox) on all sides so guillotine trim variance never leaves white slivers.');
      }
      if (!outputIntents) {
        add('missing-output-intent', 'P1', 'Missing /OutputIntents calibrated CMYK profile dictionary for PDF/X prepress.',
          'Embed a target CMYK ICC OutputIntent (e.g. Coated FOGRA39 / GRACoL, PDF/X-4) and keep body black text on 100% K.');
      }
    }
  }

  return {
    validHeader,
    pdfVersion,
    hasEof,
    fileSizeBytes,
    pageCount,
    prepressChecked: prepress,
    markers: {
      structTreeRoot,
      markInfo,
      lang,
      title,
      embeddedFonts,
      embeddedFontStreams: fontFileCount,
      toUnicodeCMap,
      trimBox,
      bleedBox,
      outputIntents,
      compressedObjectStreams,
    },
    findings,
  };
}

function main() {
  const cli = parseCli(process.argv.slice(2));
  if (cli.help) {
    console.log(help());
    return;
  }
  if (!cli.input) throw new Error('provide a PDF file to inspect; see --help');
  const file = path.resolve(cli.input);
  if (!fs.existsSync(file)) throw new Error(`PDF file not found: ${cli.input}`);
  const buffer = fs.readFileSync(file);
  const result = inspectPdf(buffer, { prepress: cli.prepress });

  const note = result.markers.compressedObjectStreams
    ? 'Static binary PDF inspection only; /ObjStm compressed object streams are present and may hide uncompressed markers. Verify visual pagination and accessibility tags with a rendered PDF viewer/rasterizer.'
    : 'Static binary PDF inspection only; verify visual pagination, margins, grayscale legibility, clipping, and reading order by rasterizing pages (e.g. pdftoppm) and inspecting rendered output.';

  const report = {
    file: cli.input,
    label: 'static',
    note,
    ...result,
    pass: result.findings.length === 0,
  };

  if (cli.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`check-pdf [${report.label}]: ${report.pass ? 'PASS' : 'FAIL'} (PDF ${report.pdfVersion || 'invalid'}, ${report.fileSizeBytes} bytes, ~${report.pageCount} page(s)${cli.prepress ? ', prepress' : ''})`);
    console.log(`  markers: StructTreeRoot=${report.markers.structTreeRoot} MarkInfo=${report.markers.markInfo} Lang=${report.markers.lang} Title=${report.markers.title} EmbeddedFonts=${report.markers.embeddedFonts} ToUnicode=${report.markers.toUnicodeCMap} TrimBox=${report.markers.trimBox} BleedBox=${report.markers.bleedBox} OutputIntents=${report.markers.outputIntents}`);
    for (const f of report.findings) {
      console.log(`  ${f.severity} ${f.rule} — ${f.message}\n    fix: ${f.fix}`);
    }
    console.log(`note: ${report.note}`);
  }
  if (!report.pass) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`check-pdf: ${error.message}`);
  process.exit(1);
}
