#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, 'skills');
const canonicalAgents = ['claude', 'codex', 'agents', 'devin', 'cursor', 'gemini', 'copilot', 'windsurf', 'opencode', 'kiro'];
const validAgents = [...canonicalAgents, 'all'];
const agentAliases = {
  'claude-code': 'claude',
  'gemini-cli': 'gemini',
  'github-copilot': 'copilot',
  'open-code': 'opencode',
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
  if (values.length === 0) throw new Error('add requires --agent');
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

Run with no arguments to start the interactive install wizard.

Commands:
  add <skill...|all> --agent <name|all> [--global] [--dry-run] [--force]
      Copy self-contained skill folders into one or more agent skills directories.
      Repeat --agent or use comma-separated names for multiple targets.
  list
      List skills bundled in this package.
  help, --help
      Show this help.

Agents: claude, codex, agents, devin, cursor, gemini, copilot, windsurf, opencode, kiro, all.
Aliases: claude-code, gemini-cli, github-copilot, open-code.

Options:
  --agent NAME   Target host. Required for non-interactive add.
  --global       Install in the user-level skills directory instead of the current project.
  --dry-run      Print destination copies without writing files.
  --force        Replace existing explicitly requested skill directories. Auto-added core skills install only when missing.

Symlink safety: installation refuses a symlinked target skills directory or skill
directory instead of replacing files outside the project.

Project locations: claude=.claude/skills; codex/agents/devin=.agents/skills;
cursor=.cursor/skills; gemini=.gemini/skills; copilot=.github/skills;
opencode=.opencode/skills. Windsurf receives .windsurf rules/workflows and Kiro
receives .kiro steering because those hosts use router formats rather than native
SKILL.md installation. Claude/Cursor/Copilot adapter commands and rules are written
alongside their skills. Universal .agents/skills remains available through the
agents target and as a compatibility path in several hosts.
Global locations: claude=~/.claude/skills; codex/agents/devin=~/.agents/skills;
cursor=~/.cursor/skills; gemini=~/.gemini/skills; copilot=~/.copilot/skills;
windsurf=~/.codeium/windsurf/skills plus memories/global_rules.md; opencode=~/.config/opencode/skills; kiro=~/.kiro.

Host behavior and global paths follow current public documentation where available.
They change quickly; verify current host documentation before depending on them in automation.`;
}

function parse(args) {
  const positional = [];
  const options = { global: false, dryRun: false, force: false, agents: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--global') options.global = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--agent') {
      index += 1;
      if (!args[index]) throw new Error('--agent requires a value');
      options.agents.push(args[index]);
    } else if (arg.startsWith('--agent=')) options.agents.push(arg.slice('--agent='.length));
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
    write('instructions/pixelcraft.instructions.md', `---\napplyTo: "**/*.{html,css,scss,js,jsx,ts,tsx,vue,svelte,astro,py,rb,php,cs,java,kt,swift,dart,rs,go,lua,ex,exs,clj,cljs,elm,fs,scala}"\n---\n\nWhen editing interface or user-facing behavior, follow \`copilot-instructions.md\` and read the matching Pixelcraft skill before implementation or review.\n`);
    for (const [command, skill, task] of adapterActions.slice(1)) write(`prompts/${command}.prompt.md`, commandText(skill, task));
  } else if (target.type === 'windsurf' || target.type === 'kiro') {
    const supportRoot = target.type === 'windsurf' ? path.join(base, 'skills') : path.join(base, 'pixelcraft', 'skills');
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
    console.log(`\nReady to install ${positional.join(', ')} for ${agents.join(', ')} in ${scope} scope.`);
    const confirm = (await ask('Continue? [Y/n]: ', 'y')).toLowerCase();
    if (confirm.startsWith('n')) throw new Error('installation cancelled');

    return {
      positional,
      options: { global: scope === 'global', dryRun: false, force: false, agents },
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
  if (command !== 'add') throw new Error(`unknown command: ${command}; run pixelcraft --help`);

  const { positional, options } = parse(rest);
  if (options.agents.length === 0) throw new Error('add requires --agent');
  runAdd({ positional, options });
}

main().catch((error) => {
  console.error(`pixelcraft: ${error.message}`);
  process.exit(1);
});
