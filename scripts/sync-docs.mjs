#!/usr/bin/env node
/**
 * Synchronizes live repository metrics (skills, references, scripts, token formats,
 * slop-scan rules, eval guides/cases/fixtures, gallery exhibits, and package version)
 * across README.md, docs, and manifest files.
 *
 * Modes:
 *   --check        Verify all tracked docs and manifests match live repo state (default)
 *   --write        Update tracked docs and manifests in place
 *   --json         Print collected live metrics (and drift list in --check mode) as JSON
 *   --root <dir>   Inspect/update a specific repository checkout (default: this repo)
 *   --help         Show usage
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function help() {
  return `Usage: node scripts/sync-docs.mjs [--check | --write] [--json] [--root <dir>]

Zero-dependency documentation and metadata drift checker / auto-synchronizer.
Collects live counts from package.json, skills/, evals/, bin/pixelcraft.mjs,
and website/public/gallery/, then verifies or updates README.md, evals/README.md,
docs/ARCHITECTURE.md, docs/INSTALL.md, website/README.md, and version manifests.

Options:
  --check       Fail with exit 1 if any tracked file drifts from live repo state (default)
  --write       Rewrite drifted counts and manifest versions in place
  --json        Emit machine-readable JSON output
  --root DIR    Target repository root directory (default: current Pixelcraft checkout)
  --help        Show this help`;
}

function parseArgs(argv) {
  const opts = {
    mode: 'check',
    json: false,
    help: false,
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--check') opts.mode = 'check';
    else if (arg === '--write') opts.mode = 'write';
    else if (arg === '--json') opts.json = true;
    else if (arg === '--root') {
      if (!argv[i + 1]) throw new Error('--root requires a directory path');
      opts.root = path.resolve(argv[++i]);
    } else if (arg.startsWith('--root=')) {
      opts.root = path.resolve(arg.slice('--root='.length));
    } else {
      throw new Error(`unknown option: ${arg}`);
    }
  }
  return opts;
}

function readUtf8(file) {
  return fs.readFileSync(file, 'utf8');
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && predicate(e.name))
    .map((e) => e.name)
    .sort();
}

export function collectRepoMetrics(root) {
  const pkg = JSON.parse(readUtf8(path.join(root, 'package.json')));
  const skillsRoot = path.join(root, 'skills');
  const skillNames = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsRoot, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort();

  let references = 0;
  let scripts = 0;
  for (const name of skillNames) {
    references += listFiles(path.join(skillsRoot, name, 'references'), (f) => f.endsWith('.md')).length;
    scripts += listFiles(path.join(skillsRoot, name, 'scripts'), (f) => f.endsWith('.mjs')).length;
  }

  const exporterSource = readUtf8(path.join(root, 'skills/pixelcraft-tokens/scripts/export-tokens.mjs'));
  const formatsMatch = exporterSource.match(/const\s+formats\s*=\s*\[([\s\S]*?)\];/);
  if (!formatsMatch) throw new Error('Could not parse const formats = [...] from export-tokens.mjs');
  const tokenFormats = [...formatsMatch[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]);

  const slopSource = readUtf8(path.join(root, 'skills/pixelcraft-review/scripts/slop-scan.mjs'));
  const scanRules = [...new Set([...slopSource.matchAll(/\badd\(\s*['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]))].sort();
  const extsMatch = slopSource.match(/const\s+exts\s*=\s*new\s+Set\(\[([\s\S]*?)\]\);/);
  const scanExtensionCount = extsMatch
    ? [...extsMatch[1].matchAll(/['"]\.[a-z0-9]+['"]/gi)].length
    : 0;

  const cliSource = readUtf8(path.join(root, 'bin/pixelcraft.mjs'));
  const agentsMatch = cliSource.match(/const\s+canonicalAgents\s*=\s*\[([^\]]+)\]/);
  const canonicalAgents = agentsMatch
    ? [...agentsMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])
    : [];

  const evalDir = path.join(root, 'evals');
  const evalGuideFiles = listFiles(evalDir, (f) => f.startsWith('pixelcraft') && f.endsWith('.md'));
  let evalCases = 0;
  for (const f of evalGuideFiles) {
    const content = readUtf8(path.join(evalDir, f));
    evalCases += (content.match(/^## Case\b/gm) || []).length;
  }
  const evalFixtures = listFiles(path.join(evalDir, 'fixtures'), (f) => f.endsWith('.json')).length;

  const galleryRoot = path.join(root, 'website/public/gallery');
  let galleryExhibits = 0;
  if (fs.existsSync(galleryRoot)) {
    galleryExhibits = fs
      .readdirSync(galleryRoot, { withFileTypes: true })
      .filter(
        (e) =>
          e.isDirectory() &&
          fs.existsSync(path.join(galleryRoot, e.name, 'before.html')) &&
          fs.existsSync(path.join(galleryRoot, e.name, 'after.html')),
      ).length;
  }

  return {
    version: pkg.version,
    skills: skillNames.length,
    references,
    scripts,
    tokenFormats,
    tokenFormatCount: tokenFormats.length,
    scanRules,
    scanRuleCount: scanRules.length,
    scanExtensionCount,
    canonicalAgents,
    agentTargetCount: canonicalAgents.length,
    evalGuides: evalGuideFiles.length,
    evalCases,
    evalFixtures,
    galleryExhibits,
  };
}

function applyReplacements(content, rules) {
  let next = content;
  for (const [pattern, replacement] of rules) {
    next = next.replace(pattern, replacement);
  }
  return next;
}

function updateJsonVersion(raw, version, keyPath = ['version']) {
  const data = JSON.parse(raw);
  let target = data;
  for (let i = 0; i < keyPath.length - 1; i += 1) {
    target = target?.[keyPath[i]];
  }
  if (!target || typeof target !== 'object') return raw;
  if (target[keyPath[keyPath.length - 1]] === version) return raw;
  target[keyPath[keyPath.length - 1]] = version;
  return `${JSON.stringify(data, null, 2)}\n`;
}

export function syncDocs(root, mode = 'check') {
  const m = collectRepoMetrics(root);
  const formatBackticks = m.tokenFormats.map((f) => `\`${f}\``).join(', ');
  const galleryWebpCount = m.galleryExhibits * 2;

  const transforms = [
    {
      relPath: 'README.md',
      transform: (raw) =>
        applyReplacements(raw, [
          [/skills-\d+-00b894\.svg" alt="\d+ Skills"/g, `skills-${m.skills}-00b894.svg" alt="${m.skills} Skills"`],
          [/references-\d+-0984e3\.svg" alt="\d+ References"/g, `references-${m.references}-0984e3.svg" alt="${m.references} References"`],
          [
            /QA_%26_token_CLIs-\d+-6c5ce7\.svg" alt="\d+ Zero-Dependency CLIs"/g,
            `QA_%26_token_CLIs-${m.scripts}-6c5ce7.svg" alt="${m.scripts} Zero-Dependency CLIs"`,
          ],
          [
            /and \d+ zero-dependency verification CLIs/g,
            `and ${m.scripts} zero-dependency verification CLIs`,
          ],
          [
            /showcase & \d+ before\/after proof exhibits/g,
            `showcase & ${m.galleryExhibits} before/after proof exhibits`,
          ],
          [/token exporters \(\d+ targets\)/g, `token exporters (${m.tokenFormatCount} targets)`],
          [/backed by \d+ zero-dependency Node\.js scripts/g, `backed by ${m.scripts} zero-dependency Node.js scripts`],
          [/^## The \d+ skills$/gm, `## The ${m.skills} skills`],
          [/multi-platform export \(\*\*\d+ targets\*\*\)/g, `multi-platform export (**${m.tokenFormatCount} targets**)`],
          [/# list all \d+ skills/g, `# list all ${m.skills} skills`],
          [/^### \d+ zero-dependency QA & token scripts$/gm, `### ${m.scripts} zero-dependency QA & token scripts`],
          [/\(\d+\+? UI extensions;/g, `(${m.scanExtensionCount} UI extensions;`],
          [
            /across \*\*\d+ targets\*\*: [^\n]+ \(`--format all`\)/g,
            `across **${m.tokenFormatCount} targets**: ${formatBackticks} (\`--format all\`)`,
          ],
          [/# validate \d+ skills,/g, `# validate ${m.skills} skills,`],
          [/\(\d+ JSON fixtures\)/g, `(${m.evalFixtures} JSON fixtures)`],
          [
            /^skills\/\s+\d+ self-contained Agent Skills \(\d+ reference docs, \d+ zero-dep CLIs\)$/gm,
            `skills/                      ${m.skills} self-contained Agent Skills (${m.references} reference docs, ${m.scripts} zero-dep CLIs)`,
          ],
          [
            /^evals\/\s+\d+ behavioral eval guides \+ \d+ machine-readable JSON fixtures$/gm,
            `evals/                       ${m.evalGuides} behavioral eval guides + ${m.evalFixtures} machine-readable JSON fixtures`,
          ],
          [
            /showcase \+ \d+-exhibit multi-stack gallery/g,
            `showcase + ${m.galleryExhibits}-exhibit multi-stack gallery`,
          ],
          [/shipped \d+-fixture offline harness/g, `shipped ${m.evalFixtures}-fixture offline harness`],
          [/alongside the \d+ showcase exhibits/g, `alongside the ${m.galleryExhibits} showcase exhibits`],
        ]),
    },
    {
      relPath: 'evals/README.md',
      transform: (raw) =>
        applyReplacements(raw, [
          [/all \d+ Pixelcraft skills/g, `all ${m.skills} Pixelcraft skills`],
          [
            /\(\d+ fixtures covering all \d+ skills,/g,
            `(${m.evalFixtures} fixtures covering all ${m.skills} skills,`,
          ],
        ]),
    },
    {
      relPath: 'docs/ARCHITECTURE.md',
      transform: (raw) =>
        applyReplacements(raw, [
          [
            /# \d+ behavioural eval guides \+ \d+ multi-language JSON fixtures \(\d+\/\d+ skills\)/g,
            `# ${m.evalGuides} behavioural eval guides + ${m.evalFixtures} multi-language JSON fixtures (${m.evalGuides}/${m.skills} skills)`,
          ],
        ]),
    },
    {
      relPath: 'docs/INSTALL.md',
      transform: (raw) =>
        applyReplacements(raw, [
          [/# Install all \d+ skills for one agent/g, `# Install all ${m.skills} skills for one agent`],
        ]),
    },
    {
      relPath: 'website/README.md',
      transform: (raw) =>
        applyReplacements(raw, [
          [/\*\*\d+ multi-stack proof exhibits:\*\*/g, `**${m.galleryExhibits} multi-stack proof exhibits:**`],
          [/recapture all \d+ WebP assets/g, `recapture all ${galleryWebpCount} WebP assets`],
        ]),
    },
    {
      relPath: 'website/package.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: 'website/package-lock.json',
      transform: (raw) => {
        let next = updateJsonVersion(raw, m.version, ['version']);
        next = updateJsonVersion(next, m.version, ['packages', '', 'version']);
        return next;
      },
    },
    {
      relPath: 'website/src/generated/repo-meta.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: 'plugin.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: 'gemini-extension.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: '.claude-plugin/plugin.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: '.claude-plugin/marketplace.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['plugins', 0, 'version']),
    },
    {
      relPath: '.cursor-plugin/plugin.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: '.cursor-plugin/marketplace.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['metadata', 'version']),
    },
    {
      relPath: '.antigravity-plugin/plugin.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: '.codex-plugin/plugin.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
    {
      relPath: '.github/plugin/marketplace.json',
      transform: (raw) => {
        let next = updateJsonVersion(raw, m.version, ['metadata', 'version']);
        next = updateJsonVersion(next, m.version, ['plugins', 0, 'version']);
        return next;
      },
    },
    {
      relPath: '.devin-plugin/plugin.json',
      transform: (raw) => updateJsonVersion(raw, m.version, ['version']),
    },
  ];

  const drifted = [];
  const updated = [];

  for (const item of transforms) {
    const abs = path.join(root, item.relPath);
    if (!fs.existsSync(abs)) continue;
    const before = readUtf8(abs);
    const after = item.transform(before);
    if (after !== before) {
      if (mode === 'write') {
        fs.writeFileSync(abs, after, 'utf8');
        updated.push(item.relPath);
      } else {
        drifted.push(item.relPath);
      }
    }
  }

  return { metrics: m, drifted, updated };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(help());
    return;
  }
  const result = syncDocs(opts.root, opts.mode);
  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (opts.mode === 'write') {
    const list = result.updated.length ? result.updated.join(', ') : 'none (already synced)';
    console.log(
      `sync-docs [write]: updated ${result.updated.length} file(s): ${list} ` +
        `(v${result.metrics.version}, ${result.metrics.skills} skills, ${result.metrics.references} refs, ` +
        `${result.metrics.scripts} scripts, ${result.metrics.tokenFormatCount} token targets, ` +
        `${result.metrics.evalFixtures} fixtures, ${result.metrics.galleryExhibits} exhibits)`,
    );
  } else if (result.drifted.length > 0) {
    console.error(
      `sync-docs [check]: FAIL — stale counts/versions found in: ${result.drifted.join(', ')}\n` +
        `Run "npm run sync:docs" to synchronize docs and manifests automatically.`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `sync-docs [check]: PASS — all docs & manifests match live repo state ` +
        `(v${result.metrics.version}, ${result.metrics.skills} skills, ${result.metrics.references} refs, ` +
        `${result.metrics.scripts} scripts, ${result.metrics.tokenFormatCount} token targets, ` +
        `${result.metrics.evalFixtures} fixtures, ${result.metrics.galleryExhibits} exhibits).`,
    );
  }
}

const isEntrypoint =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  try {
    main();
  } catch (error) {
    console.error(`sync-docs: ${error.message}`);
    process.exit(1);
  }
}
