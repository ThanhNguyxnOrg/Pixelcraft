#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');

function help() {
  return `Usage: node scripts/build-adapters.mjs [--out DIR]

Generate dependency-free agent adapter distribution fragments from skills/.
The output is a build artifact in dist/ and is not a second source of truth.

Options:
  --out DIR   Output directory (default: dist)
  --help      Show this help
`;
}

function parse(args) {
  const options = { out: 'dist', help: false, explicitOut: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--out') { options.out = args[++index]; options.explicitOut = true; }
    else if (arg.startsWith('--out=')) { options.out = arg.slice(6); options.explicitOut = true; }
    else throw new Error(`unknown option: ${arg}`);
  }
  return options;
}

function frontmatterValue(text, key) {
  const match = new RegExp(`^${key}:[ \\t]*(?:["']?)(.+?)(?:["']?)$`, 'm').exec(text);
  return match ? match[1].trim() : '';
}

function catalog() {
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
    .map((entry) => {
      const text = fs.readFileSync(path.join(skillsRoot, entry.name, 'SKILL.md'), 'utf8');
      return { name: entry.name, description: frontmatterValue(text, 'description') };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);
}

function copySkill(name, destinationRoot) {
  fs.cpSync(path.join(skillsRoot, name), path.join(destinationRoot, name), { recursive: true });
}

function copyAllSkills(skills, fragmentRoot, relativeSkillsDir) {
  const destination = path.join(fragmentRoot, ...relativeSkillsDir.split('/'));
  fs.mkdirSync(destination, { recursive: true });
  for (const skill of skills) copySkill(skill.name, destination);
}

function skillList(skills, basePath) {
  return skills.map((skill) => `- \`${skill.name}\` — read \`${basePath}/${skill.name}/SKILL.md\` when its trigger matches.`).join('\n');
}

const routingText = `Use Pixelcraft for any request to design, build, redesign, review, audit, polish, or visually verify a user interface. Start with \`pixelcraft-plan\` before implementation, use the \`pixelcraft\` orchestrator for routing, choose the matching platform/pattern skills, and finish with \`pixelcraft-review\` plus \`pixelcraft-visual-qa\` when rendered verification is possible. Preserve the user's explicit brief, existing project design system, platform conventions, accessibility floor, and evidence labels.`;

function cursorRule(skills) {
  return `---
description: Route UI design, implementation, review, and visual QA through Pixelcraft skills
alwaysApply: true
---

# Pixelcraft router

${routingText}

Do not inline or copy the skill bodies into prompts. Open the relevant self-contained skill under \`.cursor/skills/\`:

${skillList(skills, '.cursor/skills')}
`;
}

function copilotInstructions(skills) {
  return `# Pixelcraft router

${routingText}

The complete skills are installed under \`.github/skills/\`. Read the relevant \`SKILL.md\` instead of assuming framework defaults or inlining this catalog:

${skillList(skills, '.github/skills')}
`;
}

function copilotPathInstructions() {
  return `---
applyTo: "**/*.{html,css,scss,js,jsx,ts,tsx,vue,svelte,astro,py,rb,php,cs,java,kt,swift,dart,rs,go,lua,ex,exs,clj,cljs,elm,fs,scala}"
---

When editing interface, styling, navigation, interaction, or user-facing copy in these files, follow the Pixelcraft routing instructions in \`.github/copilot-instructions.md\` and read the matching skill under \`.github/skills/\` before implementation or review.
`;
}

function windsurfRule(skills) {
  return `# Pixelcraft router

${routingText}

Rules stay deliberately small. Read the authoritative self-contained skill under \`.windsurf/skills/\` before detailed work; do not inline large generated content here:

${skillList(skills, '.windsurf/skills')}
`;
}

function kiroSteering(skills) {
  return `# Pixelcraft steering

${routingText}

Treat this file as a router only. Read the matching self-contained \`SKILL.md\` under \`.kiro/pixelcraft/skills/\` before detailed implementation:

${skillList(skills, '.kiro/pixelcraft/skills')}
`;
}

const actions = [
  ['pixelcraft', 'pixelcraft', 'Run the Pixelcraft orchestrator for UI design/build work'],
  ['pixelcraft-plan', 'pixelcraft-plan', 'Run Pixelcraft step-zero planning before UI work'],
  ['pixelcraft-review', 'pixelcraft-review', 'Audit or critique UI with Pixelcraft evidence rules'],
  ['pixelcraft-visual-qa', 'pixelcraft-visual-qa', 'Capture and inspect rendered UI evidence'],
  ['pixelcraft-direction', 'pixelcraft-direction', 'Generate divergent visual directions'],
];

function commandBody(skill, task) {
  return `${task}. Read and follow the self-contained \`${skill}\` skill available in this workspace or user installation. Do not substitute generic framework defaults; preserve the user's brief, existing design system, platform conventions, accessibility requirements, and evidence labels.`;
}

function claudeCommand(skill, task) {
  return `---
description: ${task}
---

${commandBody(skill, task)}
`;
}

function copilotPrompt(skill, task) {
  return `---
description: ${task}
---

${commandBody(skill, task)}
`;
}

function windsurfWorkflow(name, skill, task) {
  return `# ${name}

${task}.

## Steps

1. Read the self-contained \`${skill}\` skill from the installed Pixelcraft distribution or source checkout.
2. Follow its workflow exactly, including referenced files when they match the task.
3. Keep user requirements, existing project conventions, accessibility, and verification evidence ahead of generic model taste.
4. Report what was rendered, statically checked, not checked, or waived using the skill's evidence labels.
`;
}

const markerName = '.pixelcraft-dist';

function comparisonPath(file) {
  let current = path.resolve(file);
  const missing = [];
  while (!fs.existsSync(current)) {
    missing.push(path.basename(current));
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  let real = fs.realpathSync(current);
  for (let index = missing.length - 1; index >= 0; index -= 1) real = path.join(real, missing[index]);
  return process.platform === 'win32' || process.platform === 'darwin' ? real.toLowerCase() : real;
}

function sameOrInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function prepareOutput(dist) {
  let stat = null;
  try {
    stat = fs.lstatSync(dist);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (stat?.isSymbolicLink()) throw new Error(`refusing output directory symlink: ${dist}`);
  if (stat && !stat.isDirectory()) throw new Error(`output path is not a directory: ${dist}`);
  if (stat) {
    const entries = fs.readdirSync(dist);
    if (entries.length > 0 && !entries.includes(markerName)) throw new Error(`refusing to clear non-empty output directory without ${markerName}: ${dist}`);
    fs.rmSync(dist, { recursive: true, force: true });
  }
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(path.join(dist, markerName), 'generated by scripts/build-adapters.mjs; safe to replace\n');
}

function build() {
  const options = parse(process.argv.slice(2));
  if (options.help) {
    console.log(help());
    return;
  }
  const skills = catalog();
  if (!skills.length) throw new Error('no skills found under skills/');
  if (!String(options.out ?? '').trim()) throw new Error('--out must not be empty');
  const dist = path.resolve(root, options.out);
  const compareDist = comparisonPath(dist);
  const compareRoot = comparisonPath(root);
  const compareSkills = comparisonPath(skillsRoot);
  if (sameOrInside(compareDist, compareRoot)) throw new Error(`refusing to remove repository root or ancestor: ${dist}`);
  if (sameOrInside(compareSkills, compareDist)) throw new Error(`refusing output inside canonical skills directory: ${dist}`);
  const insideDefault = sameOrInside(comparisonPath(path.join(root, 'dist')), compareDist);
  if (!insideDefault && !options.explicitOut) throw new Error(`refusing implicit output outside dist/: ${dist}`);
  prepareOutput(dist);

  const fragments = {
    claude: '.claude/skills',
    codex: '.agents/skills',
    cursor: '.cursor/skills',
    gemini: '.gemini/skills',
    copilot: '.github/skills',
    opencode: '.opencode/skills',
    devin: '.agents/skills',
  };
  for (const [agent, relative] of Object.entries(fragments)) copyAllSkills(skills, path.join(dist, agent), relative);
  copyAllSkills(skills, path.join(dist, 'windsurf'), '.windsurf/skills');
  copyAllSkills(skills, path.join(dist, 'kiro'), '.kiro/pixelcraft/skills');

  for (const [command, skill, task] of actions.slice(0, 4)) {
    write(path.join(dist, 'claude/.claude/commands', `${command}.md`), claudeCommand(skill, task));
  }

  write(path.join(dist, 'cursor/.cursor/rules/pixelcraft.mdc'), cursorRule(skills));

  write(path.join(dist, 'copilot/.github/copilot-instructions.md'), copilotInstructions(skills));
  write(path.join(dist, 'copilot/.github/instructions/pixelcraft.instructions.md'), copilotPathInstructions());
  for (const [command, skill, task] of actions.slice(1)) {
    write(path.join(dist, 'copilot/.github/prompts', `${command}.prompt.md`), copilotPrompt(skill, task));
  }

  write(path.join(dist, 'windsurf/.windsurf/rules/pixelcraft.md'), windsurfRule(skills));
  for (const [command, skill, task] of actions.slice(1)) {
    write(path.join(dist, 'windsurf/.windsurf/workflows', `${command}.md`), windsurfWorkflow(command, skill, task));
  }

  write(path.join(dist, 'kiro/.kiro/steering/pixelcraft.md'), kiroSteering(skills));

  const manifest = {
    source: 'skills/',
    generatedBy: 'scripts/build-adapters.mjs',
    layout: 'each agent directory is a copyable project-root fragment',
    agents: Object.keys(fragments).concat('windsurf', 'kiro').sort(),
    skills: skills.map((skill) => skill.name),
  };
  write(path.join(dist, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  write(path.join(dist, 'README.md'), `# Pixelcraft adapter distribution

Generated from \`skills/\` by \`node scripts/build-adapters.mjs\`. Do not edit this output manually.

Each agent directory is a project-root fragment. Copy its hidden dot-directories into a project, or unpack the release archive and copy only the fragment for the agent you use. Router/rules files intentionally point to the self-contained skills instead of inlining them.
`);

  console.log(`built adapters: ${Object.keys(fragments).concat('windsurf', 'kiro').sort().join(', ')}`);
  console.log(`skills copied: ${skills.length}`);
  console.log(`output: ${dist}`);
}

try {
  build();
} catch (error) {
  console.error(`build-adapters: ${error.message}`);
  process.exit(1);
}
