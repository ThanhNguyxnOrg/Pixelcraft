#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ansiRe = /\x1b(?:\[[0-?]*[ -/]*[@-~]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[@-Z\\-_])/g;

function help() {
  return `Usage: node check-tui.mjs [--cols N] [--json] (--input FILE | -- <cmd ...>)

Inspect captured TUI output or execute a terminal command under NO_COLOR=1 and a non-TTY pipe.
Verifies zero ANSI escape leakage under NO_COLOR=1, visible line widths within --cols,
clean terminal teardown sequences, and zero exit status.

Options:
  --cols N       Maximum visible column width (default: 80)
  --input FILE   Inspect captured output file instead of executing a command
  --json         Print machine-readable JSON output
  -- <cmd ...>   Execute command with NO_COLOR=1, FORCE_COLOR=0, TERM=dumb, COLUMNS=<cols>
  --help         Show this help`;
}

function isWideCodePoint(cp) {
  return (cp >= 0x1100 && cp <= 0x115f)
    || cp === 0x2329 || cp === 0x232a
    || (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f)
    || (cp >= 0xac00 && cp <= 0xd7a3)
    || (cp >= 0xf900 && cp <= 0xfaff)
    || (cp >= 0xfe10 && cp <= 0xfe19)
    || (cp >= 0xfe30 && cp <= 0xfe6f)
    || (cp >= 0xff00 && cp <= 0xff60)
    || (cp >= 0xffe0 && cp <= 0xffe6)
    || (cp >= 0x1f300 && cp <= 0x1faff)
    || (cp >= 0x20000 && cp <= 0x2fffd)
    || (cp >= 0x30000 && cp <= 0x3fffd);
}

function visibleWidth(line) {
  const stripped = line.replace(ansiRe, '').replace(/\r/g, '');
  let width = 0;
  for (const ch of stripped) {
    if (/\p{Mark}/u.test(ch)) continue;
    const cp = ch.codePointAt(0);
    if (cp === 0x200d || (cp >= 0xfe00 && cp <= 0xfe0f)) continue;
    width += ch === '\t' ? 4 : isWideCodePoint(cp) ? 2 : 1;
  }
  return width;
}

function parseCli(args) {
  const out = { help: false, json: false, cols: 80, input: '', cmd: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') {
      out.cmd = args.slice(i + 1);
      break;
    }
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--json') out.json = true;
    else if (arg === '--cols') {
      if (!args[i + 1]) throw new Error('--cols requires a positive integer');
      out.cols = Number(args[++i]);
    } else if (arg.startsWith('--cols=')) out.cols = Number(arg.slice('--cols='.length));
    else if (arg === '--input') {
      if (!args[i + 1]) throw new Error('--input requires a file path');
      out.input = args[++i];
    } else if (arg.startsWith('--input=')) out.input = arg.slice('--input='.length);
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else if (!out.input) out.input = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  if (!Number.isSafeInteger(out.cols) || out.cols < 1) {
    throw new Error('--cols must be a positive integer');
  }
  return out;
}

function analyzeOutput(text, cols, exitCode, execError, signal) {
  const findings = [];
  if (execError) {
    findings.push({
      rule: 'command-exec-error',
      severity: 'P0',
      line: 1,
      message: `Command failed to execute: ${execError}`,
      fix: 'Verify the binary path and runtime dependencies.',
    });
  } else if (signal || (exitCode !== null && exitCode !== 0)) {
    findings.push({
      rule: 'nonzero-exit',
      severity: 'P0',
      line: 1,
      message: signal ? `Process terminated by signal ${signal}.` : `Process exited with non-zero code ${exitCode}.`,
      fix: 'Ensure clean non-TTY execution and error teardown without crashing.',
    });
  }

  // Unclosed alternate screen or cursor hide teardown leaks
  const altEnter = (text.match(/\x1b\[\?1049h/g) || []).length;
  const altExit = (text.match(/\x1b\[\?1049l/g) || []).length;
  if (altEnter > altExit) {
    findings.push({
      rule: 'teardown-leak',
      severity: 'P0',
      line: 1,
      message: 'Alternate screen buffer entered (\\x1b[?1049h) without matching exit (\\x1b[?1049l).',
      fix: 'Restore the primary screen buffer on normal exit, errors, and SIGINT/SIGTERM.',
    });
  }
  const cursorHide = (text.match(/\x1b\[\?25l/g) || []).length;
  const cursorShow = (text.match(/\x1b\[\?25h/g) || []).length;
  if (cursorHide > cursorShow) {
    findings.push({
      rule: 'teardown-leak',
      severity: 'P0',
      line: 1,
      message: 'Cursor hidden (\\x1b[?25l) without matching restore (\\x1b[?25h).',
      fix: 'Always restore cursor visibility in terminal teardown handlers.',
    });
  }

  const lines = text.split(/\r?\n/);
  let ansiCount = 0;
  let firstAnsiLine = 0;
  let maxWidth = 0;
  const overflowLines = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const matches = line.match(ansiRe);
    if (matches) {
      ansiCount += matches.length;
      if (!firstAnsiLine) firstAnsiLine = lineNum;
    }
    const width = visibleWidth(line);
    if (width > maxWidth) maxWidth = width;
    if (width > cols) overflowLines.push({ line: lineNum, width });
  });

  if (ansiCount > 0) {
    findings.push({
      rule: 'ansi-leak-no-color',
      severity: 'P1',
      line: firstAnsiLine,
      message: `Detected ${ansiCount} ANSI escape sequence(s) under NO_COLOR=1 / non-TTY pipe (first on line ${firstAnsiLine}).`,
      fix: 'Honor NO_COLOR and non-TTY stdout by omitting ANSI SGR/control escape codes.',
    });
  }

  if (overflowLines.length > 0) {
    const first = overflowLines[0];
    findings.push({
      rule: 'line-overflow',
      severity: 'P1',
      line: first.line,
      message: `${overflowLines.length} line(s) exceed ${cols} visible columns (max ${maxWidth} cols; first on line ${first.line} at ${first.width} cols).`,
      fix: `Wrap or truncate TUI output to fit within ${cols} columns cleanly.`,
    });
  }

  return {
    lineCount: lines.length,
    maxWidth,
    ansiMatches: ansiCount,
    overflowCount: overflowLines.length,
    findings,
  };
}

function main() {
  const cli = parseCli(process.argv.slice(2));
  if (cli.help) {
    console.log(help());
    return;
  }
  if (!cli.input && cli.cmd.length === 0) {
    throw new Error('provide --input <file> or -- <cmd ...>; see --help');
  }
  if (cli.input && cli.cmd.length > 0) {
    throw new Error('specify either --input <file> or -- <cmd ...>, not both');
  }

  let mode = 'input';
  let label = 'static';
  let text = '';
  let exitCode = 0;
  let execError = null;
  let signal = null;

  if (cli.cmd.length > 0) {
    mode = 'command';
    label = 'rendered';
    const result = spawnSync(cli.cmd[0], cli.cmd.slice(1), {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
      env: {
        ...process.env,
        NO_COLOR: '1',
        FORCE_COLOR: '0',
        TERM: 'dumb',
        COLUMNS: String(cli.cols),
      },
    });
    text = `${result.stdout || ''}${result.stderr || ''}`;
    exitCode = result.status;
    execError = result.error ? result.error.message : null;
    signal = result.signal || null;
  } else {
    const file = path.resolve(cli.input);
    if (!fs.existsSync(file)) throw new Error(`input file not found: ${cli.input}`);
    text = fs.readFileSync(file, 'utf8');
  }

  const analysis = analyzeOutput(text, cli.cols, exitCode, execError, signal);
  const report = {
    mode,
    target: mode === 'command' ? cli.cmd.join(' ') : cli.input,
    label,
    cols: cli.cols,
    exitCode,
    ...analysis,
    pass: analysis.findings.length === 0,
  };

  if (cli.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`check-tui [${report.label}] (${report.mode}, cols=${report.cols}): ${report.pass ? 'PASS' : 'FAIL'} (maxWidth=${report.maxWidth}, ansi=${report.ansiMatches}, exit=${report.exitCode})`);
    for (const f of report.findings) {
      console.log(`  ${f.severity} line ${f.line} ${f.rule} — ${f.message}\n    fix: ${f.fix}`);
    }
  }
  if (!report.pass) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`check-tui: ${error.message}`);
  process.exit(1);
}
