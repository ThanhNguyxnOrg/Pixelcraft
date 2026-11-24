#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function help() {
  return `Usage: node check-pdf.mjs <file.pdf> [--json]

Zero-dependency static binary PDF inspector. Verifies the %PDF- header, file size,
page count heuristic (/Type /Page), PDF/UA structure markers (/StructTreeRoot,
/MarkInfo, /Lang, /Title), and font embedding markers (/FontFile, /FontFile2, /FontFile3).
Always reports honest "static" evidence labeling.

Options:
  --json   Print machine-readable JSON output
  --help   Show this help`;
}

function parseCli(args) {
  const out = { help: false, json: false, input: '' };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--json') out.json = true;
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else if (!out.input) out.input = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return out;
}

function inspectPdf(buffer) {
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
    }
  }

  return {
    validHeader,
    pdfVersion,
    hasEof,
    fileSizeBytes,
    pageCount,
    markers: {
      structTreeRoot,
      markInfo,
      lang,
      title,
      embeddedFonts,
      embeddedFontStreams: fontFileCount,
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
  const result = inspectPdf(buffer);

  const note = result.markers.compressedObjectStreams
    ? 'Static binary PDF inspection only; /ObjStm compressed object streams are present and may hide uncompressed markers. Verify visual pagination and accessibility tags with a rendered PDF viewer/rasterizer.'
    : 'Static binary PDF inspection only; verify visual pagination, margins, clipping, and reading order by rasterizing pages (e.g. pdftoppm) and inspecting rendered output.';

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
    console.log(`check-pdf [${report.label}]: ${report.pass ? 'PASS' : 'FAIL'} (PDF ${report.pdfVersion || 'invalid'}, ${report.fileSizeBytes} bytes, ~${report.pageCount} page(s))`);
    console.log(`  markers: StructTreeRoot=${report.markers.structTreeRoot} MarkInfo=${report.markers.markInfo} Lang=${report.markers.lang} Title=${report.markers.title} EmbeddedFonts=${report.markers.embeddedFonts}`);
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
