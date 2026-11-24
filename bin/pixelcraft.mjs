#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, 'skills');
const canonicalAgents = ['claude', 'codex', 'agents', 'devin', 'cursor', 'gemini', 'copilot', 'windsurf', 'opencode', 'kiro', 'cline', 'roo', 'droid', 'antigravity'];
const validAgents = [...canonicalAgents, 'all'];
const agentAliases = {
  'claude-code': 'claude',
  'gemini-cli': 'gemini',
  'github-copilot': 'copilot',
  'open-code': 'opencode',
  'roo-code': 'roo',
  factory: 'droid',
  amp: 'agents',
  zed: 'agents',
  goose: 'agents',
};

function skillNames() {
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort();
}

function canonicalAgent(name) {
  const normalized = name.trim().toLowerCase();
  return agentAliases[normalized] || normalized;
}

function expandAgents(input) {
  const values = (Array.isArray(input) ? input : [input])
    .flatMap((value) => String(value).split(/[\s,]+/))
    .filter(Boolean)
    .map(canonicalAgent);
  if (values.length === 0) throw new Error('command requires --agent');
  const unknown = values.filter((name) => !validAgents.includes(name));
  if (unknown.length) throw new Error(`invalid agent '${unknown.join(', ')}'; expected one of ${validAgents.join(', ')}`);
  if (values.includes('all')) return canonicalAgents;
  return [...new Set(values)];
}

function targetsFor(agentInput, globalInstall) {
  const home = os.homedir();
  const project = {
    claude: { root: '.claude/skills', type: 'skills' },
    codex: { root: '.agents/skills', type: 'skills' },
    agents: { root: '.agents/skills', type: 'skills' },
    devin: { root: '.agents/skills', type: 'skills' },
    cursor: { root: '.cursor/skills', type: 'skills' },
    gemini: { root: '.gemini/skills', type: 'skills' },
    copilot: { root: '.github/skills', type: 'skills' },
    windsurf: { root: '.windsurf', type: 'windsurf' },
    opencode: { root: '.opencode/skills', type: 'skills' },
    kiro: { root: '.kiro', type: 'kiro' },
    cline: { root: '.cline/skills', type: 'skills' },
    roo: { root: '.roo/skills', type: 'skills' },
    droid: { root: '.factory/skills', type: 'skills' },
    antigravity: { root: '.agents/skills', type: 'skills' },
  };
  const globalMap = {
    claude: { root: path.join(home, '.claude/skills'), type: 'skills' },
    codex: { root: path.join(home, '.agents/skills'), type: 'skills' },
    agents: { root: path.join(home, '.agents/skills'), type: 'skills' },
    devin: { root: path.join(home, '.agents/skills'), type: 'skills' },
    cursor: { root: path.join(home, '.cursor/skills'), type: 'skills' },
    gemini: { root: path.join(home, '.gemini/skills'), type: 'skills' },
    copilot: { root: path.join(home, '.copilot/skills'), type: 'skills' },
    windsurf: { root: path.join(home, '.codeium/windsurf'), type: 'windsurf' },
    opencode: { root: path.join(home, '.config/opencode/skills'), type: 'skills' },
    kiro: { root: path.join(home, '.kiro'), type: 'kiro' },
    cline: { root: path.join(home, '.cline/skills'), type: 'skills' },
    roo: { root: path.join(home, '.roo/skills'), type: 'skills' },
    droid: { root: path.join(home, '.factory/skills'), type: 'skills' },
    antigravity: { root: path.join(home, '.gemini/config/skills'), type: 'skills' },
  };
  const map = globalInstall ? globalMap : project;
  const seen = new Set();
  const targets = [];
  for (const agent of expandAgents(agentInput)) {
    const spec = map[agent];
    const key = `${spec.type}:${spec.root}`;
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push({ agent, type: spec.type, root: path.resolve(process.cwd(), spec.root), global: globalInstall });
  }
  return targets;
}

function help() {
  return `Usage: pixelcraft [command] [options]

Install from npm: npm i -g @thanhnguyxn/pixelcraft
Run with no arguments to start the interactive install wizard.

Commands:
  add <skill...|all> --agent <name|all> [--global] [--dry-run] [--force] [--docs-mcp]
      Copy self-contained skill folders into one or more agent skills directories.
      Repeat --agent or use comma-separated names for multiple targets.
  remove <skill...|all> --agent <name|all> [--global] [--dry-run]
      Safely remove installed Pixelcraft skill folders (refuses symlinks and non-Pixelcraft folders).
  doctor [--agent <name|all>] [--global]
      Verify Node.js version and inspect installed Pixelcraft skill directories for missing core skills or stale/incomplete installs.
  init-router [--dir <path>] [--write <file>]
      Detect repository tech stack from manifests and print (or upsert via --write) a managed Pixelcraft routing block for AGENTS.md/CLAUDE.md/GEMINI.md.
  check <target> [--json] [--fail-on <p0|p1|p2|any>]
      Run bundled verification scripts against <target> (slop-scan for UI source, check-contrast for DTCG token JSON, check-pdf for PDFs, with check-email hint for email markup).
  list
      List skills bundled in this package.
  help, --help
      Show this help.

Agents: ${validAgents.join(', ')}.
Aliases: ${Object.keys(agentAliases).join(', ')}.

Options:
  --agent NAME        Target host. Required for non-interactive add and remove.
  --global            Use the user-level skills directory instead of the current project.
  --dry-run           Print planned changes without modifying files.
  --docs-mcp          Print optional Context7 setup guidance without configuring any host.
  --force             Replace existing explicitly requested skill directories. Auto-added core skills install only when missing.
  --dir PATH          Repository directory to inspect for init-router (default: current directory).
  --write FILE        Upsert a managed Pixelcraft routing block into FILE for init-router.
  --json              Emit machine-readable JSON output from check.
  --fail-on LEVEL     Exit non-zero from check when findings meet p0|p1|p2|any.

Symlink safety: installation and removal refuse a symlinked target skills directory or skill
directory instead of modifying files outside the project.

Project locations: claude=.claude/skills; codex/agents/devin/antigravity=.agents/skills;
cursor=.cursor/skills; gemini=.gemini/skills; copilot=.github/skills;
windsurf=.windsurf/skills; opencode=.opencode/skills; kiro=.kiro/skills;
cline=.cline/skills; roo=.roo/skills; droid=.factory/skills. Windsurf and Kiro
get native skills and router files. Claude/Cursor/Copilot adapter commands and
rules are written alongside their skills. Universal .agents/skills remains
available through the agents target and as a compatibility path in several hosts.
Global locations: claude=~/.claude/skills; codex/agents/devin=~/.agents/skills;
cursor=~/.cursor/skills; gemini=~/.gemini/skills; copilot=~/.copilot/skills;
windsurf=~/.codeium/windsurf/skills plus memories/global_rules.md;
opencode=~/.config/opencode/skills; kiro=~/.kiro/skills; cline=~/.cline/skills;
roo=~/.roo/skills; droid=~/.factory/skills; antigravity=~/.gemini/config/skills.

Host behavior and global paths follow current public documentation where available.
They change quickly; verify current host documentation before depending on them in automation.`;
}

function parse(args) {
  const positional = [];
  const options = { global: false, dryRun: false, force: false, json: false, agents: [], dir: '', write: '', failOn: '' };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--global') options.global = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--docs-mcp') options.docsMcp = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--agent') {
      index += 1;
      if (!args[index]) throw new Error('--agent requires a value');
      options.agents.push(args[index]);
    } else if (arg.startsWith('--agent=')) options.agents.push(arg.slice('--agent='.length));
    else if (arg === '--dir') {
      index += 1;
      if (!args[index]) throw new Error('--dir requires a value');
      options.dir = args[index];
    } else if (arg.startsWith('--dir=')) options.dir = arg.slice('--dir='.length);
    else if (arg === '--write') {
      index += 1;
      if (!args[index]) throw new Error('--write requires a value');
      options.write = args[index];
    } else if (arg.startsWith('--write=')) options.write = arg.slice('--write='.length);
    else if (arg === '--fail-on') {
      index += 1;
      if (!args[index]) throw new Error('--fail-on requires a value');
      options.failOn = args[index];
    } else if (arg.startsWith('--fail-on=')) options.failOn = arg.slice('--fail-on='.length);
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { positional, options };
}

function lstatIfExists(file) {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function assertNotSymlink(file, label) {
  if (lstatIfExists(file)?.isSymbolicLink()) throw new Error(`${label} is a symlink: ${file}; refusing to install through it`);
}

function assertInstallPathSafe(target, boundary, label) {
  const base = path.resolve(boundary);
  const destination = path.resolve(target);
  const relative = path.relative(base, destination);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`${label} is outside the install scope: ${target}`);
  assertNotSymlink(base, label);
  let current = base;
  if (relative) {
    for (const part of relative.split(path.sep).filter(Boolean)) {
      current = path.join(current, part);
      assertNotSymlink(current, label);
    }
  }
}

function copySkill(name, destinationRoot, dryRun, { force = false, auto = false, boundary = process.cwd() } = {}) {
  const source = path.join(skillsRoot, name);
  const destination = path.join(destinationRoot, name);
  assertNotSymlink(source, 'source skill directory');
  assertInstallPathSafe(destinationRoot, boundary, 'target skills path component');
  const destinationStat = lstatIfExists(destination);
  const exists = destinationStat !== null;
  if (auto && exists) {
    const kind = destinationStat.isSymbolicLink() ? 'existing symlink' : 'existing install';
    console.log(`${dryRun ? 'dry-run: ' : ''}skipped auto-added ${kind}: ${name} -> ${destination}`);
    return;
  }
  if (destinationStat?.isSymbolicLink()) throw new Error(`installed skill directory is a symlink: ${destination}; refusing to install through it`);
  if (dryRun) {
    if (exists && !force) console.log(`dry-run: skipped existing ${name} -> ${destination} (use --force to replace)`);
    else console.log(`dry-run: ${name} -> ${destination}`);
    return;
  }
  fs.mkdirSync(destinationRoot, { recursive: true });
  assertInstallPathSafe(destinationRoot, boundary, 'target skills path component');
  if (exists && !force) {
    console.log(`skipped existing: ${name} -> ${destination} (use --force to replace)`);
    return;
  }
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
  console.log(`installed: ${name} -> ${destination}`);
}

function selectSkills(positional, available) {
  const requested = positional.includes('all') ? available : positional;
  const unknown = requested.filter((name) => !available.includes(name));
  if (unknown.length) throw new Error(`unknown skill(s): ${unknown.join(', ')}; available: ${available.join(', ')}`);

  let selected = requested.map((name) => ({ name, auto: false }));
  if (!positional.includes('all')) {
    const required = ['pixelcraft', 'pixelcraft-plan'].filter((name) => available.includes(name));
    const injected = required.filter((name) => !requested.includes(name));
    if (injected.length) {
      selected = [...injected.map((name) => ({ name, auto: true })), ...selected];
      console.log(`note: including required core skill(s): ${injected.join(', ')}`);
    }
  }
  return selected;
}

const adapterActions = [
  ['pixelcraft', 'pixelcraft', 'Run the Pixelcraft orchestrator for UI design/build work'],
  ['pixelcraft-plan', 'pixelcraft-plan', 'Run Pixelcraft step-zero planning before UI work'],
  ['pixelcraft-review', 'pixelcraft-review', 'Audit or critique UI with Pixelcraft evidence rules'],
  ['pixelcraft-visual-qa', 'pixelcraft-visual-qa', 'Capture and inspect rendered UI evidence'],
  ['pixelcraft-direction', 'pixelcraft-direction', 'Generate divergent visual directions'],
];

function adapterIntro(skillsPath) {
  return `Use Pixelcraft for any request to design, build, redesign, review, audit, polish, or visually verify a user interface. Start with \`pixelcraft-plan\` before implementation, use the \`pixelcraft\` orchestrator for routing, choose the matching platform/pattern skills, and finish with \`pixelcraft-review\` plus \`pixelcraft-visual-qa\` when rendered verification is possible.\n\nDo not inline skill bodies here. Read the matching self-contained skill under \`${skillsPath}\`:\n\n${skillNames().map((name) => `- \`${name}\` — \`${skillsPath}/${name}/SKILL.md\``).join('\n')}\n`;
}

function commandText(skill, task) {
  return `---\ndescription: ${task}\n---\n\n${task}. Read and follow the self-contained \`${skill}\` skill available in this workspace or user installation. Preserve the user's brief, existing design system, platform conventions, accessibility requirements, and evidence labels.\n`;
}

function workflowText(skill, task) {
  return `# ${task}\n\n1. Read the self-contained \`${skill}\` skill from the installed Pixelcraft distribution or source checkout.\n2. Follow its workflow, including referenced files when they match the task.\n3. Preserve user requirements, project conventions, accessibility, and evidence labels.\n4. Report rendered/static/not-checked/waived verification honestly.\n`;
}

const managedStart = '<!-- pixelcraft:start -->';
const managedEnd = '<!-- pixelcraft:end -->';

function managedUpsert(existing, content) {
  const block = `${managedStart}\n${content.trimEnd()}\n${managedEnd}`;
  const pattern = new RegExp(`${managedStart}[\\s\\S]*?${managedEnd}`);
  if (pattern.test(existing)) return existing.replace(pattern, block);
  if (existing.includes(managedStart)) throw new Error(`managed Pixelcraft block is missing its end marker: fix the file before installing`);
  return existing ? `${existing.trimEnd()}\n\n${block}\n` : `${block}\n`;
}

function assertAdapterPathSafe(file, boundary) {
  assertInstallPathSafe(file, boundary, 'adapter path component');
}

function writeAdapterFile(file, content, dryRun, force, boundary = process.cwd(), managed = false) {
  assertAdapterPathSafe(file, boundary);
  const exists = lstatIfExists(file) !== null;
  if (dryRun) {
    console.log(`dry-run: ${managed ? 'managed adapter' : exists && !force ? 'skipped existing adapter' : 'adapter'} ${file}${!managed && exists && !force ? ' (use --force to replace)' : ''}`);
    return;
  }
  if (!managed && exists && !force) {
    console.log(`skipped existing adapter: ${file} (use --force to replace)`);
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  assertAdapterPathSafe(file, boundary);
  const output = managed ? managedUpsert(exists ? fs.readFileSync(file, 'utf8') : '', content) : content;
  fs.writeFileSync(file, output);
  console.log(`installed adapter: ${file}`);
}

function writeAgentAdapters(target, dryRun, force, selected) {
  const base = target.type === 'skills' ? path.dirname(target.root) : target.root;
  const displayRoot = target.global ? target.root.replace(os.homedir(), '~') : path.relative(process.cwd(), target.root);
  const boundary = target.global ? os.homedir() : process.cwd();
  const file = (relative) => path.join(base, ...relative.split('/'));
  const write = (relative, content, managed = false) => writeAdapterFile(file(relative), content, dryRun, force, boundary, managed);
  if (target.agent === 'claude') {
    for (const [command, skill, task] of adapterActions.slice(0, 4)) write(`commands/${command}.md`, commandText(skill, task));
  } else if (target.agent === 'cursor') {
    write('rules/pixelcraft.mdc', `---\ndescription: Route UI design and review through Pixelcraft\nalwaysApply: true\n---\n\n# Pixelcraft router\n\n${adapterIntro(displayRoot)}`);
  } else if (target.agent === 'copilot') {
    write('copilot-instructions.md', `# Pixelcraft router\n\n${adapterIntro(displayRoot)}`, true);
    write('instructions/pixelcraft.instructions.md', `---\napplyTo: "**/*.{html,css,scss,less,pcss,js,jsx,ts,tsx,vue,svelte,astro,mdx,razor,heex,erb,templ,twig,mjml,typ,tex,qmd,py,rb,php,cs,java,kt,swift,dart,rs,go,zig,lua,ex,exs,clj,cljs,elm,fs,scala,cpp,h,glsl,wgsl,qml,xaml,axaml,fxml,blp,slint,ets,uxml,uss,gd,tscn,tcss,qss,r,jl}"\n---\n\nWhen editing interface or user-facing behavior, follow \`copilot-instructions.md\` and read the matching Pixelcraft skill before implementation or review.\n`);
    for (const [command, skill, task] of adapterActions.slice(1)) write(`prompts/${command}.prompt.md`, commandText(skill, task));
  } else if (target.type === 'windsurf' || target.type === 'kiro') {
    const supportRoot = path.join(base, 'skills');
    assertAdapterPathSafe(path.join(supportRoot, 'probe'), boundary);
    for (const entry of selected) copySkill(entry.name, supportRoot, dryRun, { force: force && !entry.auto, auto: entry.auto, boundary });
    const displaySupport = target.global ? supportRoot.replace(os.homedir(), '~') : path.relative(process.cwd(), supportRoot);
    if (target.type === 'windsurf') {
      write(target.global ? 'memories/global_rules.md' : 'rules/pixelcraft.md', `# Pixelcraft router\n\n${adapterIntro(displaySupport)}`, target.global);
      for (const [command, skill, task] of adapterActions.slice(1)) write(`workflows/${command}.md`, workflowText(skill, task));
    } else {
      write('steering/pixelcraft.md', `# Pixelcraft steering\n\n${adapterIntro(displaySupport)}`);
    }
  }
}

function skillsDirForTarget(target) {
  return target.type === 'skills' ? target.root : path.join(target.root, 'skills');
}

function runAdd({ positional, options }) {
  if (positional.length === 0) throw new Error('add requires at least one skill name or all');
  const available = skillNames();
  const selected = selectSkills(positional, available);
  const targets = targetsFor(options.agents, options.global);
  for (const target of targets) {
    if (target.type === 'skills') {
      for (const entry of selected) {
        copySkill(entry.name, target.root, options.dryRun, { force: options.force && !entry.auto, auto: entry.auto, boundary: target.global ? os.homedir() : process.cwd() });
      }
    }
    writeAgentAdapters(target, options.dryRun, options.force, selected);
  }
  if (options.docsMcp) {
    console.log(`Optional docs MCP for ${expandAgents(options.agents).join(', ')}: follow the Context7 instructions for your host at https://github.com/upstash/context7#readme. Pixelcraft does not configure MCP or request credentials. If unavailable or unsupported, use versioned official docs and the package registry.`);
  }
}

function runRemove({ positional, options }) {
  if (positional.length === 0) throw new Error('remove requires at least one skill name or all');
  if (options.agents.length === 0) throw new Error('remove requires --agent');
  const removeAll = positional.includes('all');
  const available = new Set(skillNames());
  if (!removeAll) {
    for (const name of positional) {
      if (!/^pixelcraft(?:-[a-z0-9]+)*$/.test(name)) {
        throw new Error(`refusing to remove non-Pixelcraft skill name '${name}'`);
      }
    }
  }
  const targets = targetsFor(options.agents, options.global);
  for (const target of targets) {
    const dir = skillsDirForTarget(target);
    const boundary = target.global ? os.homedir() : process.cwd();
    assertInstallPathSafe(dir, boundary, 'target skills path component');
    const dirStat = lstatIfExists(dir);
    if (!dirStat) {
      console.log(`${options.dryRun ? 'dry-run: ' : ''}no skills directory at ${dir}`);
      continue;
    }
    if (!dirStat.isDirectory()) throw new Error(`target skills path is not a directory: ${dir}`);

    let names;
    if (removeAll) {
      names = fs.readdirSync(dir).filter((entry) => /^pixelcraft(?:-[a-z0-9]+)*$/.test(entry)).sort();
      if (names.length === 0) {
        console.log(`${options.dryRun ? 'dry-run: ' : ''}no Pixelcraft skills installed in ${dir}`);
        continue;
      }
    } else {
      names = [...new Set(positional)];
    }

    for (const name of names) {
      const dest = path.join(dir, name);
      const stat = lstatIfExists(dest);
      if (!stat) {
        console.log(`${options.dryRun ? 'dry-run: ' : ''}not installed: ${name} (${dir})`);
        continue;
      }
      if (stat.isSymbolicLink()) {
        throw new Error(`installed skill directory is a symlink: ${dest}; refusing to remove`);
      }
      if (!stat.isDirectory()) {
        throw new Error(`refusing to remove non-directory path: ${dest}`);
      }
      if (!available.has(name) && !fs.existsSync(path.join(dest, 'SKILL.md'))) {
        throw new Error(`refusing to remove folder without SKILL.md: ${dest}`);
      }
      if (options.dryRun) {
        console.log(`dry-run: remove ${name} <- ${dest}`);
      } else {
        fs.rmSync(dest, { recursive: true, force: true });
        console.log(`removed: ${name} <- ${dest}`);
      }
    }
  }
}

function runDoctor({ options }) {
  const available = skillNames();
  const availableSet = new Set(available);
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  const issues = [];
  console.log(`Pixelcraft doctor`);
  console.log(`Node.js: v${process.versions.node} (${nodeMajor >= 18 ? 'ok' : 'FAIL: requires >= 18'})`);
  console.log(`Bundled skills: ${available.length}`);
  if (nodeMajor < 18) issues.push(`Node.js >= 18 is required (found v${process.versions.node})`);

  const targets = targetsFor(options.agents.length ? options.agents : ['all'], options.global);
  const seenDirs = new Set();
  let installedRoots = 0;

  for (const target of targets) {
    const dir = skillsDirForTarget(target);
    if (seenDirs.has(dir)) continue;
    seenDirs.add(dir);
    const stat = lstatIfExists(dir);
    if (!stat) continue;
    if (stat.isSymbolicLink()) {
      issues.push(`${dir}: skills directory is a symlink`);
      console.log(`  WARN ${dir}: symlinked skills directory`);
      continue;
    }
    if (!stat.isDirectory()) continue;

    const installed = fs.readdirSync(dir).filter((name) => name.startsWith('pixelcraft')).sort();
    if (installed.length === 0) continue;
    installedRoots += 1;

    const rootIssues = [];
    for (const core of ['pixelcraft', 'pixelcraft-plan']) {
      if (availableSet.has(core) && !installed.includes(core)) {
        rootIssues.push(`missing required core skill '${core}'`);
      }
    }
    for (const name of installed) {
      const full = path.join(dir, name);
      const entryStat = lstatIfExists(full);
      if (entryStat?.isSymbolicLink()) {
        rootIssues.push(`'${name}' is a symlink`);
        continue;
      }
      if (!entryStat?.isDirectory() || !fs.existsSync(path.join(full, 'SKILL.md'))) {
        rootIssues.push(`'${name}' is incomplete (missing SKILL.md)`);
        continue;
      }
      if (!availableSet.has(name)) {
        rootIssues.push(`'${name}' is not in the bundled Pixelcraft skill set (stale or unknown)`);
        continue;
      }
      const bundledRefs = path.join(skillsRoot, name, 'references');
      if (fs.existsSync(bundledRefs)) {
        const expectedRefs = fs.readdirSync(bundledRefs).filter((f) => f.endsWith('.md'));
        const installedRefsDir = path.join(full, 'references');
        const missingRefs = expectedRefs.filter((f) => !fs.existsSync(path.join(installedRefsDir, f)));
        if (missingRefs.length) {
          rootIssues.push(`'${name}' is stale/incomplete (missing ${missingRefs.length} reference file(s): ${missingRefs.slice(0, 3).join(', ')})`);
        }
      }
    }

    const display = target.global ? dir.replace(os.homedir(), '~') : path.relative(process.cwd(), dir) || '.';
    if (rootIssues.length === 0) {
      console.log(`  OK   ${display}: ${installed.length} skill(s) installed and healthy`);
    } else {
      console.log(`  FAIL ${display}: ${installed.length} skill(s), ${rootIssues.length} issue(s)`);
      for (const msg of rootIssues) {
        console.log(`       - ${msg}`);
        issues.push(`${display}: ${msg}`);
      }
    }
  }

  if (installedRoots === 0) {
    console.log(`No Pixelcraft installations found in ${options.global ? 'global' : 'project'} agent directories.`);
  }
  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

function readTextSafe(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function detectRepoStack(dir) {
  const detected = [];
  const skills = new Set(['pixelcraft-plan', 'pixelcraft']);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const names = new Set(entries.map((e) => e.name));
  const filesByExt = (ext) => entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(ext)).map((e) => e.name);
  const hasDirExt = (ext) => entries.some((e) => e.isDirectory() && e.name.toLowerCase().endsWith(ext));

  if (names.has('Cargo.toml')) {
    const cargo = readTextSafe(path.join(dir, 'Cargo.toml'));
    const tags = [];
    if (/\b(?:ratatui|crossterm)\b/i.test(cargo)) { tags.push('Rust TUI'); skills.add('pixelcraft-tui'); }
    if (/\b(?:gpui|egui|eframe|iced|slint|tauri|gtk4)\b/i.test(cargo)) { tags.push('Rust Desktop'); skills.add('pixelcraft-desktop'); }
    if (/\bbevy\b/i.test(cargo)) { tags.push('Bevy'); skills.add('pixelcraft-game-ui'); }
    if (/\b(?:leptos|yew|dioxus)\b/i.test(cargo)) { tags.push('Rust Web'); skills.add('pixelcraft-web'); }
    detected.push(`Cargo.toml (${tags.length ? tags.join(', ') : 'Rust'})`);
  }
  if (names.has('Package.swift') || hasDirExt('.xcodeproj') || hasDirExt('.xcworkspace')) {
    detected.push('Swift / Apple manifest (SwiftUI / UIKit / AppKit)');
    skills.add('pixelcraft-mobile');
    skills.add('pixelcraft-desktop');
  }
  if (names.has('build.gradle') || names.has('build.gradle.kts')) {
    const gradle = readTextSafe(path.join(dir, names.has('build.gradle.kts') ? 'build.gradle.kts' : 'build.gradle'));
    detected.push(`Gradle (${/compose|android/i.test(gradle) ? 'Android / Jetpack Compose' : 'JVM / Kotlin'})`);
    if (/compose|android/i.test(gradle)) skills.add('pixelcraft-mobile');
    else skills.add('pixelcraft-desktop');
  }
  if (names.has('pubspec.yaml')) {
    detected.push('pubspec.yaml (Flutter / Dart)');
    skills.add('pixelcraft-mobile');
  }
  if (names.has('go.mod')) {
    const gomod = readTextSafe(path.join(dir, 'go.mod'));
    const tags = [];
    if (/bubbletea|lipgloss/i.test(gomod)) { tags.push('Bubble Tea / Lip Gloss'); skills.add('pixelcraft-tui'); }
    if (/ebiten/i.test(gomod)) { tags.push('Ebitengine'); skills.add('pixelcraft-game-ui'); }
    if (/fyne|wails|gioui/i.test(gomod)) { tags.push('Go Desktop'); skills.add('pixelcraft-desktop'); }
    if (/templ/i.test(gomod)) { tags.push('templ Web'); skills.add('pixelcraft-web'); }
    detected.push(`go.mod (${tags.length ? tags.join(', ') : 'Go'})`);
  }
  if (names.has('pyproject.toml') || names.has('requirements.txt')) {
    const py = `${readTextSafe(path.join(dir, 'pyproject.toml'))}\n${readTextSafe(path.join(dir, 'requirements.txt'))}`;
    const tags = [];
    if (/\b(?:textual|rich)\b/i.test(py)) { tags.push('Textual/Rich'); skills.add('pixelcraft-tui'); }
    if (/\b(?:streamlit|gradio|marimo|dash|panel|nicegui|reflex|shiny)\b/i.test(py)) { tags.push('Python Data App'); skills.add('pixelcraft-data-apps'); }
    if (/\b(?:pyside6|pyqt6|pyside2|pyqt5|pygobject)\b/i.test(py)) { tags.push('Python Desktop'); skills.add('pixelcraft-desktop'); }
    if (/\b(?:flet|kivy)\b/i.test(py)) { tags.push('Python Mobile'); skills.add('pixelcraft-mobile'); }
    if (/\b(?:django|fastapi|flask)\b/i.test(py)) { tags.push('Python Web'); skills.add('pixelcraft-web'); }
    detected.push(`Python manifest (${tags.length ? tags.join(', ') : 'Python'})`);
  }
  if (names.has('composer.json')) {
    detected.push('composer.json (PHP / Laravel / Symfony)');
    skills.add('pixelcraft-web');
  }
  if (names.has('Gemfile')) {
    detected.push('Gemfile (Ruby / Rails)');
    skills.add('pixelcraft-web');
  }
  if (names.has('mix.exs')) {
    const mix = readTextSafe(path.join(dir, 'mix.exs'));
    detected.push('mix.exs (Elixir / Phoenix)');
    skills.add('pixelcraft-web');
    if (/live_view_native/i.test(mix)) skills.add('pixelcraft-mobile');
  }
  const csprojs = filesByExt('.csproj');
  if (csprojs.length) {
    const combined = csprojs.map((f) => readTextSafe(path.join(dir, f))).join('\n');
    const tags = [];
    if (/Avalonia|UseWPF|UseWinUI|Microsoft\.WindowsAppSDK/i.test(combined)) { tags.push('.NET Desktop'); skills.add('pixelcraft-desktop'); }
    if (/UseMaui|Microsoft\.Maui/i.test(combined)) { tags.push('.NET MAUI'); skills.add('pixelcraft-mobile'); }
    if (/MonoGame/i.test(combined)) { tags.push('MonoGame'); skills.add('pixelcraft-game-ui'); }
    if (/Blazor|Microsoft\.NET\.Sdk\.Web|Razor/i.test(combined)) { tags.push('Blazor/Razor'); skills.add('pixelcraft-web'); }
    detected.push(`${csprojs[0]} (${tags.length ? tags.join(', ') : 'C# / .NET'})`);
  }
  if (names.has('package.json')) {
    const pkgText = readTextSafe(path.join(dir, 'package.json'));
    const tags = [];
    if (/"(?:react|next|vue|nuxt|svelte|solid-js|@angular\/core|astro|@builder\.io\/qwik|htmx\.org|lit|preact|hono)"/i.test(pkgText)) {
      tags.push('Web'); skills.add('pixelcraft-web');
    }
    if (/"(?:react-native|expo|@lynx-js\/|@ionic\/)"/i.test(pkgText)) {
      tags.push('Mobile'); skills.add('pixelcraft-mobile');
    }
    if (/"(?:electron|@tauri-apps\/)"/i.test(pkgText)) {
      tags.push('Desktop'); skills.add('pixelcraft-desktop');
    }
    if (/"ink"/i.test(pkgText)) { tags.push('Ink TUI'); skills.add('pixelcraft-tui'); }
    if (/"(?:mjml|@react-email\/|maizzle)"/i.test(pkgText)) { tags.push('Email'); skills.add('pixelcraft-email'); }
    if (/"(?:@raycast\/api|@types\/vscode)"/i.test(pkgText)) { tags.push('Extension'); skills.add('pixelcraft-extensions'); }
    detected.push(`package.json (${tags.length ? tags.join(', ') : 'JS/TS'})`);
    if (tags.length === 0) skills.add('pixelcraft-web');
  }
  if (names.has('project.godot')) {
    detected.push('project.godot (Godot Engine)');
    skills.add('pixelcraft-game-ui');
  }
  if (filesByExt('.typ').length > 0) {
    detected.push('*.typ (Typst document)');
    skills.add('pixelcraft-document');
  }
  if (filesByExt('.mjml').length > 0) {
    detected.push('*.mjml (MJML email)');
    skills.add('pixelcraft-email');
  }

  skills.add('pixelcraft-review');
  skills.add('pixelcraft-visual-qa');
  return { detected, skills: [...skills] };
}

function runInitRouter({ options }) {
  const dir = path.resolve(process.cwd(), options.dir || '.');
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(`--dir must point to an existing directory: ${dir}`);
  }
  const { detected, skills } = detectRepoStack(dir);
  const stackSummary = detected.length
    ? detected.map((item) => `- ${item}`).join('\n')
    : '- No stack manifest detected at repository root (inspect subdirectories during `pixelcraft-plan`).';
  const content = [
    '## Pixelcraft UI routing',
    '',
    'For any request to design, build, redesign, review, audit, or verify UI in this repository, follow the Pixelcraft loop:',
    '1. Start with `pixelcraft-plan` (read repo conventions first) and `pixelcraft` for routing.',
    '2. Respect authority order: explicit user brief > existing project design system/conventions > platform conventions & accessibility floor > Pixelcraft guidance > model taste.',
    '3. Verify changes with `pixelcraft-review` and `pixelcraft-visual-qa` using explicit evidence labels (`rendered`, `static`, `model-judgment`, `not-checked`, `waived`).',
    '',
    'Detected stack manifests:',
    stackSummary,
    '',
    `Recommended skills: ${skills.map((s) => `\`${s}\``).join(', ')}.`,
  ].join('\n');

  if (options.write) {
    const outFile = path.resolve(process.cwd(), options.write);
    assertNotSymlink(outFile, 'router output file');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const existing = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
    const updated = managedUpsert(existing, content);
    fs.writeFileSync(outFile, updated);
    console.log(`updated router: ${outFile}`);
  } else {
    console.log(`${managedStart}\n${content}\n${managedEnd}`);
  }
}

function runCheck({ positional, options }) {
  if (positional.length !== 1) throw new Error('check requires exactly one target file or directory');
  const target = path.resolve(process.cwd(), positional[0]);
  if (!fs.existsSync(target)) throw new Error(`target not found: ${positional[0]}`);
  const stat = fs.statSync(target);
  const ext = stat.isFile() ? path.extname(target).toLowerCase() : '';

  const qaDir = path.join(skillsRoot, 'pixelcraft-visual-qa/scripts');
  const reviewDir = path.join(skillsRoot, 'pixelcraft-review/scripts');

  const dispatch = (scriptPath, scriptArgs) => {
    const res = spawnSync(process.execPath, [scriptPath, ...scriptArgs], { encoding: 'utf8' });
    if (res.stdout) process.stdout.write(res.stdout);
    if (res.stderr) process.stderr.write(res.stderr);
    process.exitCode = res.status ?? 1;
  };

  if (ext === '.pdf') {
    const args = [target];
    if (options.json) args.push('--json');
    dispatch(path.join(qaDir, 'check-pdf.mjs'), args);
    return;
  }

  if (ext === '.json') {
    const raw = readTextSafe(target);
    if (/"\$(?:value|type)"/.test(raw)) {
      const args = [target];
      if (options.json) args.push('--json');
      dispatch(path.join(qaDir, 'check-contrast.mjs'), args);
      return;
    }
    throw new Error(`${positional[0]} is JSON but does not look like a DTCG tokens file (missing "$value" or "$type")`);
  }

  const args = [target];
  if (options.json) args.push('--json');
  if (options.failOn) args.push('--fail-on', options.failOn);
  dispatch(path.join(reviewDir, 'slop-scan.mjs'), args);

  if (stat.isFile()) {
    const isMjml = ext === '.mjml';
    const isEmailHtml = ext === '.html' && (
      /email|newsletter|receipt|digest|mail/i.test(path.basename(target))
      || /<mjml\b|urn:schemas-microsoft-com:vml|mso-/i.test(readTextSafe(target))
    );
    if (isMjml || isEmailHtml) {
      const hint = `note: for email-specific checks (102 KB Gmail clip, Outlook CSS, plaintext parity), also run: node skills/pixelcraft-visual-qa/scripts/check-email.mjs ${positional[0]}`;
      if (options.json) console.error(hint);
      else console.log(hint);
    }
  }
}

function numberedSelection(answer, names) {
  const tokens = answer.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) throw new Error('empty selection');
  return [...new Set(tokens.map((token) => {
    if (/^\d+$/.test(token)) {
      const index = Number(token) - 1;
      if (!names[index]) throw new Error(`selection ${token} is outside the numbered list`);
      return names[index];
    }
    return token.toLowerCase();
  }))];
}

function createPrompter() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const eof = Symbol('eof');
  const lines = [];
  const waiters = [];
  rl.on('line', (line) => {
    if (waiters.length) waiters.shift()(line);
    else lines.push(line);
  });
  rl.on('close', () => {
    while (waiters.length) waiters.shift()(eof);
  });
  return {
    async question(text) {
      process.stdout.write(text);
      if (lines.length) return lines.shift();
      const answer = await new Promise((resolve) => waiters.push(resolve));
      if (answer === eof) throw new Error('input ended before the wizard completed');
      return answer;
    },
    close() {
      rl.close();
    },
  };
}

async function wizard() {
  const available = skillNames();
  const prompter = createPrompter();
  try {
    console.log('Pixelcraft interactive installer\n');
    console.log('Agents:');
    canonicalAgents.forEach((name, index) => console.log(`  ${index + 1}) ${name}`));
    console.log(`  ${canonicalAgents.length + 1}) all`);
    const ask = async (question, fallback) => {
      const answer = (await prompter.question(question)).trim();
      return answer || fallback;
    };

    const agentAnswer = await ask(`Choose agent(s) by number/name, comma-separated [1]: `, '1');
    const agents = numberedSelection(agentAnswer, [...canonicalAgents, 'all']);

    const allAnswer = (await ask('Install all skills? [Y/n]: ', 'y')).toLowerCase();
    let positional = ['all'];
    if (allAnswer.startsWith('n')) {
      console.log('Skills:');
      available.forEach((name, index) => console.log(`  ${index + 1}) ${name}`));
      const skillAnswer = await ask('Choose skills by number/name, comma-separated [1]: ', '1');
      positional = numberedSelection(skillAnswer, available);
    }

    const scope = (await ask('Scope: project or global? [project]: ', 'project')).toLowerCase();
    if (scope !== 'project' && scope !== 'global') throw new Error(`scope must be project or global, got '${scope}'`);
    const docsMcp = /^(y|yes)$/i.test(await ask('Show optional Context7 docs MCP setup guidance? [y/N]: ', 'n'));
    console.log(`\nReady to install ${positional.join(', ')} for ${agents.join(', ')} in ${scope} scope.`);
    const confirm = (await ask('Continue? [Y/n]: ', 'y')).toLowerCase();
    if (confirm.startsWith('n')) throw new Error('installation cancelled');

    return {
      positional,
      options: { global: scope === 'global', dryRun: false, force: false, agents, docsMcp },
    };
  } finally {
    prompter.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
    console.log(help());
    return;
  }
  if (args.length === 0) {
    if (!process.stdin.isTTY) {
      console.log(help());
      return;
    }
    runAdd(await wizard());
    return;
  }

  const [command, ...rest] = args;
  if (command === 'list') {
    for (const name of skillNames()) console.log(name);
    return;
  }
  if (command === 'add') {
    const { positional, options } = parse(rest);
    if (options.agents.length === 0) throw new Error('add requires --agent');
    runAdd({ positional, options });
    return;
  }
  if (command === 'remove') {
    const { positional, options } = parse(rest);
    runRemove({ positional, options });
    return;
  }
  if (command === 'doctor') {
    const { options } = parse(rest);
    runDoctor({ options });
    return;
  }
  if (command === 'init-router') {
    const { options } = parse(rest);
    runInitRouter({ options });
    return;
  }
  if (command === 'check') {
    const { positional, options } = parse(rest);
    runCheck({ positional, options });
    return;
  }
  throw new Error(`unknown command: ${command}; run pixelcraft --help`);
}

main().catch((error) => {
  console.error(`pixelcraft: ${error.message}`);
  process.exit(1);
});
