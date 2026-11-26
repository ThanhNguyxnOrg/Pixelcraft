#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateEvidence } from '../skills/pixelcraft-visual-qa/scripts/finish-gate.mjs';

function help() {
  return `Usage: node scripts/run-evals.mjs [--json]

Zero-dependency offline deterministic evaluation harness for Pixelcraft.
Validates all evals/*.md guides and evals/fixtures/*.json fixtures, reports
language/ecosystem and surface coverage statistics (JS/TS vs Non-JS/TS vs Mixed),
and runs deterministic contract checks against slop-scan, export-tokens,
finish-gate, check-contrast, check-email, check-tui, and check-pdf.

Options:
  --json   Print machine-readable JSON report
  --help   Show this help`;
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(help());
  process.exit(0);
}
const jsonOut = args.includes('--json');
for (const arg of args) {
  if (arg !== '--json') {
    console.error(`run-evals: unknown option '${arg}'`);
    process.exit(1);
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const evalsRoot = path.join(root, 'evals');
const fixturesRoot = path.join(evalsRoot, 'fixtures');
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isNonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

function listSkills() {
  return new Set(
    fs.readdirSync(skillsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsRoot, e.name, 'SKILL.md')))
      .map((e) => e.name),
  );
}

function classifyEcosystem(fixture) {
  const haystack = [
    fixture.id,
    fixture.title,
    fixture.contextSnapshot?.platform || '',
    fixture.contextSnapshot?.surface || '',
  ].join(' ');

  const hasNonJs = /\b(swift|swiftui|uikit|appkit|kotlin|jetpack compose|compose|flutter|dart|harmonyos|arkui|arkts|rust|ratatui|gpui|egui|bevy|typst|go\b|bubble tea|lip gloss|ebitengine|godot|gdscript|python|marimo|pyside|pyqt|qt|tkinter|streamlit|gradio|textual|rich|c\+\+|juce|c#|\.net|avalonia|wpf|winui|maui|php|laravel|filament|livewire|ruby|rails|viewcomponent|phlex|elixir|phoenix|liveview|mjml|print css|pdf|tvos|visionos|unity|unreal|love2d|monogame|cocoa)\b/i.test(haystack);
  const hasJsTs = /\b(javascript|typescript|react|next\.js|nextjs|vue|nuxt|svelte|solid|angular|astro|qwik|node|vite|tailwind|css-in-js|gsap|three\.js|r3f|babylon|pixi|playcanvas|mapbox|maplibre|tip-?tap|prosemirror|monaco|codemirror|tanstack|ag grid|electron|tauri|lynxjs|maizzle|react email|ink\b|vscode|webview|chrome mv3|browser extension|raycast|pdf\.js|pptxgenjs|pwa|html5|webxr|spa)\b/i.test(haystack);

  if (hasNonJs && !hasJsTs) return 'non-js';
  if (hasJsTs && !hasNonJs) return 'js-ts';
  return 'mixed';
}

function checkGuides() {
  const errors = [];
  let guideCount = 0;
  let totalCases = 0;
  for (const entry of fs.readdirSync(evalsRoot, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'README.md') continue;
    guideCount += 1;
    const text = fs.readFileSync(path.join(evalsRoot, entry.name), 'utf8');
    const headings = [...text.matchAll(/^##\s+Case\b.*$/gm)].map((m) => m[0]);
    if (headings.length === 0) {
      errors.push(`evals/${entry.name}: missing ## Case headings`);
      continue;
    }
    totalCases += headings.length;
    headings.forEach((heading, idx) => {
      const m = /^##\s+Case\s+(\d+)\s+—\s+\S/.exec(heading);
      if (!m) {
        errors.push(`evals/${entry.name}: unnumbered or malformed case heading '${heading}'`);
      } else if (Number(m[1]) !== idx + 1) {
        errors.push(`evals/${entry.name}: expected Case ${idx + 1}, got '${heading}'`);
      }
    });
  }
  return { guideCount, totalCases, errors };
}

function checkFixtures(skillNames) {
  const errors = [];
  const fixtures = [];
  const seenIds = new Set();
  const byEcosystem = { 'non-js': 0, 'js-ts': 0, mixed: 0 };
  const bySkill = {};
  const byMode = {};

  for (const entry of fs.readdirSync(fixturesRoot, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const rel = `evals/fixtures/${entry.name}`;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(fixturesRoot, entry.name), 'utf8'));
    } catch (err) {
      errors.push(`${rel}: invalid JSON (${err.message})`);
      continue;
    }

    if (data.schemaVersion !== 1) errors.push(`${rel}: schemaVersion must be 1`);
    if (!isNonEmpty(data.id) || !namePattern.test(data.id) || data.id !== path.basename(entry.name, '.json')) {
      errors.push(`${rel}: invalid or mismatched id '${data.id}'`);
    } else if (seenIds.has(data.id)) {
      errors.push(`${rel}: duplicate id '${data.id}'`);
    } else {
      seenIds.add(data.id);
    }
    if (!isNonEmpty(data.skill) || !skillNames.has(data.skill)) {
      errors.push(`${rel}: unknown skill '${data.skill}'`);
    }
    if (!isNonEmpty(data.title)) errors.push(`${rel}: missing title`);
    if (!isNonEmpty(data.prompt)) errors.push(`${rel}: missing prompt`);
    if (!data.contextSnapshot || typeof data.contextSnapshot !== 'object') {
      errors.push(`${rel}: missing contextSnapshot`);
    } else {
      for (const k of ['surface', 'platform', 'mode']) {
        if (!isNonEmpty(data.contextSnapshot[k])) errors.push(`${rel}: missing contextSnapshot.${k}`);
      }
      if (!Array.isArray(data.contextSnapshot.states) || !data.contextSnapshot.states.length) {
        errors.push(`${rel}: contextSnapshot.states must be nonempty`);
      }
      if (!Array.isArray(data.contextSnapshot.constraints) || !data.contextSnapshot.constraints.length) {
        errors.push(`${rel}: contextSnapshot.constraints must be nonempty`);
      }
    }
    if (!Array.isArray(data.expectedRouting) || !data.expectedRouting.length) {
      errors.push(`${rel}: expectedRouting must be nonempty`);
    } else {
      const owners = [data.skill, ...data.expectedRouting.filter((x) => isNonEmpty(x) && skillNames.has(x))];
      for (const item of data.expectedRouting) {
        if (/^pixelcraft(?:-[a-z0-9]+)*$/.test(item) && !skillNames.has(item)) {
          errors.push(`${rel}: expectedRouting references unknown skill '${item}'`);
        } else if (typeof item === 'string' && item.startsWith('references/')) {
          const ok = owners.some((owner) => owner && fs.existsSync(path.join(skillsRoot, owner, item)));
          if (!ok) errors.push(`${rel}: expectedRouting references missing file '${item}'`);
        }
      }
    }
    if (!Array.isArray(data.forbiddenBehaviors) || !data.forbiddenBehaviors.length) {
      errors.push(`${rel}: forbiddenBehaviors must be nonempty`);
    }
    if (!Array.isArray(data.rubricDimensions) || !data.rubricDimensions.length) {
      errors.push(`${rel}: rubricDimensions must be nonempty`);
    }
    if (!Array.isArray(data.negativeControls) || !data.negativeControls.length) {
      errors.push(`${rel}: negativeControls must be nonempty`);
    }
    if (!data.baseline || !isNonEmpty(data.baseline.withoutSkill) || !isNonEmpty(data.baseline.withSkill)) {
      errors.push(`${rel}: baseline.withoutSkill and baseline.withSkill required`);
    }

    const eco = classifyEcosystem(data);
    byEcosystem[eco] += 1;
    bySkill[data.skill] = (bySkill[data.skill] || 0) + 1;
    const mode = data.contextSnapshot?.mode || 'unknown';
    byMode[mode] = (byMode[mode] || 0) + 1;
    fixtures.push({ id: data.id, skill: data.skill, ecosystem: eco, mode });
  }

  return { count: fixtures.length, byEcosystem, bySkill, byMode, errors };
}

function runNode(scriptRel, scriptArgs) {
  return spawnSync(process.execPath, [path.join(root, scriptRel), ...scriptArgs], { encoding: 'utf8' });
}

function runContractChecks() {
  const checks = [];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-evals-'));
  const record = (name, label, fn) => {
    try {
      const detail = fn();
      checks.push({ name, label, pass: true, detail });
    } catch (error) {
      checks.push({ name, label, pass: false, detail: error.message });
    }
  };
  const expect = (cond, msg) => {
    if (!cond) throw new Error(msg);
  };

  try {
    // 1. slop-scan contract
    record('slop-scan', 'static', () => {
      const clean = runNode('skills/pixelcraft-review/scripts/slop-scan.mjs', [
        path.join(root, 'skills/pixelcraft-review/scripts/fixtures/clean.html'), '--json', '--fail-on', 'any',
      ]);
      expect(clean.status === 0, `clean.html failed: ${clean.stderr}`);
      expect(JSON.parse(clean.stdout).score === 0, 'clean.html score should be 0');

      const slop = runNode('skills/pixelcraft-review/scripts/slop-scan.mjs', [
        path.join(root, 'skills/pixelcraft-review/scripts/fixtures/slop.html'), '--json', '--fail-on', 'p0',
      ]);
      expect(slop.status === 1, 'slop.html must exit 1 under --fail-on p0');
      expect(JSON.parse(slop.stdout).score === 40, 'slop.html score should remain 40');

      const kt = path.join(tmp, 'Check.kt');
      fs.writeFileSync(kt, 'Text("Price", fontSize = 14.dp)\n');
      const ktRes = runNode('skills/pixelcraft-review/scripts/slop-scan.mjs', [kt, '--json', '--fail-on', 'p1']);
      expect(ktRes.status === 1, 'Compose .dp fontSize must fail under --fail-on p1');
      expect(JSON.parse(ktRes.stdout).findings.some((f) => f.rule === 'compose-dp-font-size'), 'missing compose-dp-font-size');
      return 'clean.html=0, slop.html=40, Compose .dp caught under --fail-on p1';
    });

    // 2. export-tokens contract
    record('export-tokens', 'static', () => {
      const outDir = path.join(tmp, 'tokens-out');
      const res = runNode('skills/pixelcraft-tokens/scripts/export-tokens.mjs', [
        path.join(root, 'skills/pixelcraft-tokens/assets/tokens.example.json'), '--format', 'all', '--out-dir', outDir,
      ]);
      expect(res.status === 0, `export-tokens failed: ${res.stderr}`);
      const written = fs.readdirSync(outDir);
      expect(written.length === 19, `expected 19 token format files, got ${written.length}`);
      expect(written.includes('tokens-gtk4.css') && written.includes('tokens.typ') && written.includes('tokens.slint'), 'missing new non-JS token outputs');
      return '19/19 DTCG token target formats emitted cleanly';
    });

    // 3. finish-gate contract
    record('finish-gate', 'static', () => {
      const ev = (artifact, extra = {}) => ({
        result: 'pass', label: 'rendered', method: 'harness', expected: 'ok', observed: 'ok', artifact, ...extra,
      });
      const valid = {
        schemaVersion: 1, surface: 'responsive-web', target: '/', revision: 'eval', task: 'submit', fixture: 'local',
        applicability: { error: true, empty: true, loading: true, theme: { applies: false, reason: 'Single static theme configured' }, 'reduced-motion': { applies: false, reason: 'No CSS or JS animations present' }, 'reflow-320': true },
        layoutMatrix: { 'layout-landscape': { width: 844, height: 390 }, 'layout-short-height': { width: 1280, height: 480 } },
        checks: {
          outcome: ev('o.png', { assertion: 'saved' }),
          input: ev('i.png', { modality: 'keyboard', focus: 'ring visible' }),
          'width-390': ev('w390.png', { width: 390 }),
          'width-768': ev('w768.png', { width: 768 }),
          'width-1440': ev('w1440.png', { width: 1440 }),
          'layout-landscape': ev('land.png', { width: 844, height: 390 }),
          'layout-short-height': ev('short.png', { width: 1280, height: 480 }),
          'reflow-320': ev('r320.png', { width: 320 }),
          error: ev('err.png'), empty: ev('emp.png'), loading: ev('load.png'),
        },
        rounds: [],
      };
      const has = () => true;
      expect(evaluateEvidence(valid, has).status === 'PASS', 'valid manifest should PASS');
      const dup = evaluateEvidence({ ...valid, checks: { ...valid.checks, 'width-768': ev('w390.png', { width: 768 }) } }, has);
      expect(dup.status === 'NOT CHECKED', 'duplicate viewport artifact should be rejected');
      const lazy = evaluateEvidence({ ...valid, applicability: { ...valid.applicability, theme: { applies: false, reason: 'n/a' } } }, has);
      expect(lazy.status === 'NOT CHECKED', 'lazy n/a core floor reason should be rejected');
      return 'valid PASS, duplicate artifact rejected, lazy core-floor excuse rejected';
    });

    // 4. check-contrast contract
    record('check-contrast', 'static', () => {
      const ok = runNode('skills/pixelcraft-visual-qa/scripts/check-contrast.mjs', [
        path.join(root, 'skills/pixelcraft-tokens/assets/tokens.example.json'), '--json',
      ]);
      expect(ok.status === 0, `check-contrast failed on example tokens: ${ok.stderr}`);
      const parsed = JSON.parse(ok.stdout);
      expect(parsed.pass === true && parsed.label === 'static', 'contrast example should pass with static label');
      return `${parsed.totalPairs} auto-detected pairs verified (WCAG 2.2 + APCA Lc)`;
    });

    // 5. check-email contract
    record('check-email', 'static', () => {
      const html = path.join(tmp, 'mail.html');
      const txt = path.join(tmp, 'mail.txt');
      fs.writeFileSync(html, '<!doctype html><html lang="en"><head><title>Receipt</title></head><body><table role="presentation"><tr><td>Order confirmed at <a href="https://example.com/1">portal</a>.</td></tr></table></body></html>');
      fs.writeFileSync(txt, 'Order confirmed: https://example.com/1\n');
      const ok = runNode('skills/pixelcraft-visual-qa/scripts/check-email.mjs', [html, '--plaintext', txt, '--json']);
      expect(ok.status === 0 && JSON.parse(ok.stdout).pass === true, 'valid email should pass');
      const bad = path.join(tmp, 'bad-mail.html');
      fs.writeFileSync(bad, '<html><body><div style="display: flex"><img src="a.png"></div></body></html>');
      const fail = runNode('skills/pixelcraft-visual-qa/scripts/check-email.mjs', [bad, '--json']);
      expect(fail.status === 1, 'unsafe email should fail');
      return 'clean email + plaintext PASS; Outlook-unsafe CSS + missing alt FAIL';
    });

    // 6. check-tui contract
    record('check-tui', 'rendered', () => {
      const ok = runNode('skills/pixelcraft-visual-qa/scripts/check-tui.mjs', [
        '--cols', '80', '--json', '--', process.execPath, '-e', 'console.log("OK billing 12ms");',
      ]);
      expect(ok.status === 0 && JSON.parse(ok.stdout).label === 'rendered', 'clean TUI command should pass');
      const bad = runNode('skills/pixelcraft-visual-qa/scripts/check-tui.mjs', [
        '--cols', '20', '--json', '--', process.execPath, '-e', 'console.log("\\x1b[31m" + "A".repeat(30) + "\\x1b[0m");',
      ]);
      expect(bad.status === 1, 'ANSI leak + overflow should fail');
      return 'NO_COLOR=1 clean command PASS; ANSI leak + overflow FAIL';
    });

    // 7. check-pdf contract
    record('check-pdf', 'static', () => {
      const good = path.join(tmp, 'ok.pdf');
      fs.writeFileSync(good, Buffer.from('%PDF-1.7\n1 0 obj << /Type /Page /StructTreeRoot 2 0 R /MarkInfo << /Marked true >> /Lang (en) /Title (Invoice) /FontFile2 3 0 R >> endobj\n%%EOF\n', 'latin1'));
      const ok = runNode('skills/pixelcraft-visual-qa/scripts/check-pdf.mjs', [good, '--json']);
      expect(ok.status === 0 && JSON.parse(ok.stdout).pass === true, 'tagged PDF should pass');
      const bad = path.join(tmp, 'bad.pdf');
      fs.writeFileSync(bad, Buffer.from('%PDF-1.4\n1 0 obj << /Type /Page >> endobj\n%%EOF\n', 'latin1'));
      const fail = runNode('skills/pixelcraft-visual-qa/scripts/check-pdf.mjs', [bad, '--json']);
      expect(fail.status === 1, 'untagged PDF should fail');
      return 'tagged PDF with embedded font PASS; untagged PDF FAIL';
    });

    // 8. check-acceptance contract
    record('check-acceptance', 'static', () => {
      const accFile = path.join(tmp, 'acceptance.json');
      const init = runNode('skills/pixelcraft-review/scripts/check-acceptance.mjs', ['--init', 'desktop', '--out', accFile]);
      expect(init.status === 0, `check-acceptance --init failed: ${init.stderr}`);
      const pending = runNode('skills/pixelcraft-review/scripts/check-acceptance.mjs', [accFile, '--json']);
      expect(pending.status === 1 && JSON.parse(pending.stdout).grade === 'FAIL', 'unwalked checklist must exit 1 FAIL');
      const doc = JSON.parse(fs.readFileSync(accFile, 'utf8'));
      doc.target = 'Northwind Studio Desktop v1.2';
      doc.sowThresholds = {
        devicesAndEnvironments: 'macOS 15 arm64 + Windows 11 24H2 @ 100%/150%/200% DPI',
        numericBudgets: 'Cold start < 500ms, idle CPU < 0.5%, 30m RAM < 180 MB',
      };
      for (const sec of [doc.baseline, doc.surfaceMatrix, doc.platformGates]) {
        for (const item of Object.values(sec)) {
          item.result = 'pass';
          item.label = item.requiresRendered ? 'rendered' : 'static';
          item.evidence = item.requiresRendered
            ? 'qa/desktop-100-200dpi-dark.png + Activity Monitor 30m trace + VoiceOver/NVDA log'
            : 'cargo clippy -- -D warnings + cargo audit + slop-scan score 0';
        }
      }
      fs.writeFileSync(accFile, JSON.stringify(doc, null, 2));
      const clean = runNode('skills/pixelcraft-review/scripts/check-acceptance.mjs', [accFile, '--json']);
      expect(clean.status === 0 && JSON.parse(clean.stdout).grade === 'PASS_STUDIO_10K_20K', 'completed checklist should exit 0 PASS_STUDIO_10K_20K');
      return '14-platform checklist init=FAIL(exit 1) -> Rule #0.3 verified -> PASS_STUDIO_10K_20K(exit 0)';
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  return checks;
}

const skillNames = listSkills();
const guides = checkGuides();
const fixtures = checkFixtures(skillNames);
const contracts = runContractChecks();
const failedContracts = contracts.filter((c) => !c.pass);
const totalErrors = guides.errors.length + fixtures.errors.length + failedContracts.length;

const pct = (n, total) => (total ? `${((n / total) * 100).toFixed(1)}%` : '0.0%');
const report = {
  label: 'static',
  pass: totalErrors === 0,
  guides: {
    count: guides.guideCount,
    totalCases: guides.totalCases,
    errors: guides.errors,
  },
  fixtures: {
    count: fixtures.count,
    coverage: {
      nonJs: { count: fixtures.byEcosystem['non-js'], share: pct(fixtures.byEcosystem['non-js'], fixtures.count) },
      jsTs: { count: fixtures.byEcosystem['js-ts'], share: pct(fixtures.byEcosystem['js-ts'], fixtures.count) },
      mixed: { count: fixtures.byEcosystem.mixed, share: pct(fixtures.byEcosystem.mixed, fixtures.count) },
    },
    bySkill: Object.fromEntries(Object.entries(fixtures.bySkill).sort(([a], [b]) => a.localeCompare(b))),
    byMode: Object.fromEntries(Object.entries(fixtures.byMode).sort(([a], [b]) => a.localeCompare(b))),
    errors: fixtures.errors,
  },
  contracts,
};

if (jsonOut) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Pixelcraft Offline Eval Harness [static + live CLI contracts]`);
  console.log(`Guides:   ${guides.guideCount} skill eval guides (${guides.totalCases} numbered cases), ${guides.errors.length} error(s)`);
  console.log(`Fixtures: ${fixtures.count} JSON fixtures, ${fixtures.errors.length} error(s)`);
  console.log(`Ecosystem coverage:`);
  console.log(`  - Non-JS/TS: ${report.fixtures.coverage.nonJs.count} (${report.fixtures.coverage.nonJs.share})`);
  console.log(`  - JS/TS:     ${report.fixtures.coverage.jsTs.count} (${report.fixtures.coverage.jsTs.share})`);
  console.log(`  - Mixed:     ${report.fixtures.coverage.mixed.count} (${report.fixtures.coverage.mixed.share})`);
  console.log(`  - Skills covered: ${Object.keys(report.fixtures.bySkill).length}/${skillNames.size}`);
  console.log(`Deterministic tool contracts:`);
  for (const c of contracts) {
    console.log(`  ${c.pass ? 'PASS' : 'FAIL'} [${c.label}] ${c.name} — ${c.detail}`);
  }
  for (const err of [...guides.errors, ...fixtures.errors]) {
    console.error(`ERROR: ${err}`);
  }
}

if (!report.pass) process.exit(1);
