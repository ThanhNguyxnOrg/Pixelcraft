#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const evalsRoot = path.join(root, 'evals');
const errors = [];
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const yamlPlainStartPattern = /^[-?:,\[\]{}#&*!|>'"%@`]/;

function fail(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function quoteCanOpen(text, index) {
  if (index === 0) return true;
  let previous = index - 1;
  while (previous >= 0 && /\s/.test(text[previous])) previous--;
  return previous < 0 || '{[,:'.includes(text[previous]);
}

function stripYamlComment(raw) {
  let quote = null;
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (quote === '"') {
      if (char === '\\') i++;
      else if (char === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && raw[i + 1] === "'") i++;
      else if (char === "'") quote = null;
      continue;
    }
    if ((char === '"' || char === "'") && quoteCanOpen(raw, i)) {
      quote = char;
      continue;
    }
    if (char === '#' && (i === 0 || /\s/.test(raw[i - 1]))) return raw.slice(0, i).trimEnd();
  }
  return raw.trimEnd();
}

function indentationWidth(line) {
  return /^ */.exec(line)[0].length;
}

function parseBlockHeader(value) {
  const match = /^([|>])((?:[+-]?[1-9]?|[1-9]?[+-]?))$/.exec(value);
  if (!match) return /^[|>]/.test(value) ? { invalid: true } : null;
  const suffix = match[2];
  const explicitIndent = /[1-9]/.exec(suffix);
  return {
    style: match[1],
    chomp: suffix.includes('-') ? '-' : suffix.includes('+') ? '+' : '',
    indent: explicitIndent ? Number(explicitIndent[0]) : 0
  };
}

function foldBlockLines(lines) {
  let output = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    output += line;
    if (i === lines.length - 1) break;
    const next = lines[i + 1];
    const foldable = line && next && !/^\s/.test(line) && !/^\s/.test(next);
    if (foldable) output += ' ';
    else if (!(line === '' && next !== '' && i > 0)) output += '\n';
  }
  return output;
}

function applyChomp(body, lineCount, chomp) {
  if (!lineCount) return '';
  if (chomp === '-') return body.replace(/\n+$/g, '');
  if (chomp === '+') return `${body}\n`;
  return `${body.replace(/\n+$/g, '')}\n`;
}

function readBlockScalar(lines, start, end, header) {
  let indent = header.indent;
  if (!indent) {
    for (let probe = start + 1; probe < end; probe++) {
      if (!lines[probe].trim()) continue;
      indent = indentationWidth(lines[probe]) || 1;
      break;
    }
    if (!indent) indent = 1;
  }

  const content = [];
  let index = start + 1;
  for (; index < end; index++) {
    const line = lines[index];
    if (!line.trim()) {
      content.push('');
      continue;
    }
    if (indentationWidth(line) < indent) break;
    content.push(line.slice(indent));
  }
  const body = header.style === '|' ? content.join('\n') : foldBlockLines(content);
  return { value: applyChomp(body, content.length, header.chomp), nextIndex: index };
}

function validatePlainScalar(value, label) {
  if (value.includes(': ')) return `unquoted scalar for ${label} contains ': '; quote it for strict YAML loaders`;
  if (yamlPlainStartPattern.test(value)) return `unquoted scalar for ${label} starts with YAML-special character '${value[0]}'; quote it for strict YAML loaders`;
  return null;
}

function findQuoteEnd(text, start, quote) {
  for (let i = start + 1; i < text.length; i++) {
    const char = text[i];
    if (quote === '"' && char === '\\') {
      i++;
      continue;
    }
    if (quote === "'" && char === "'" && text[i + 1] === "'") {
      i++;
      continue;
    }
    if (char === quote) return i;
  }
  return -1;
}

function validateQuotedScalar(value, label) {
  const end = findQuoteEnd(value, 0, value[0]);
  if (end === -1) return { error: `unterminated quoted scalar for ${label}` };
  if (value.slice(end + 1).trim()) return { error: `unexpected content after quoted scalar for ${label}` };
  return { kind: 'scalar', value: value.slice(1, end) };
}

function splitFlowEntries(inner, label) {
  const parts = [];
  let start = 0;
  let quote = null;
  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    if (quote === '"') {
      if (char === '\\') i++;
      else if (char === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && inner[i + 1] === "'") i++;
      else if (char === "'") quote = null;
      continue;
    }
    if ((char === '"' || char === "'") && quoteCanOpen(inner, i)) {
      quote = char;
      continue;
    }
    if ('{}[]'.includes(char)) return { error: `nested flow collections in ${label} are outside the supported frontmatter subset` };
    if (char === ',') {
      parts.push(inner.slice(start, i));
      start = i + 1;
    }
  }
  if (quote) return { error: `unterminated quoted scalar in flow mapping for ${label}` };
  parts.push(inner.slice(start));
  return { parts };
}

function splitFlowPair(part) {
  const index = part.indexOf(':');
  if (index === -1) return null;
  return { keyText: part.slice(0, index), valueText: part.slice(index + 1) };
}

function parseFlowScalar(text, label) {
  const trimmed = text.trim();
  if (!trimmed) return { error: `missing scalar value in flow mapping for ${label}` };
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) return validateQuotedScalar(trimmed, label);
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return { error: `nested flow collections in ${label} are outside the supported frontmatter subset` };
  const problem = validatePlainScalar(trimmed, label);
  if (problem) return { error: problem };
  return { kind: 'scalar', value: trimmed };
}

function parseFlowMapping(value, key) {
  if (!value.endsWith('}')) return { error: `unterminated inline flow mapping for ${key}` };
  const inner = value.slice(1, -1);
  if (!inner.trim()) return { kind: 'mapping', value };
  const split = splitFlowEntries(inner, key);
  if (split.error) return { error: split.error };
  const keys = new Set();
  for (const part of split.parts) {
    if (!part.trim()) return { error: `empty entry in flow mapping for ${key}` };
    const pair = splitFlowPair(part);
    if (!pair || (pair.valueText && !/^[ \t]/.test(pair.valueText))) return { error: `flow mapping entry for ${key} is not a simple key: value pair` };
    const entryKey = pair.keyText.trim();
    if (!/^[A-Za-z0-9_-]+$/.test(entryKey)) return { error: `flow mapping key '${entryKey}' in ${key} is outside the supported frontmatter subset` };
    if (keys.has(entryKey)) return { error: `duplicate key '${entryKey}' in flow mapping for ${key}` };
    keys.add(entryKey);
    const scalar = parseFlowScalar(pair.valueText, `${key}.${entryKey}`);
    if (scalar.error) return { error: scalar.error };
  }
  return { kind: 'mapping', value };
}

function parseInlineValue(value, key) {
  if (value.startsWith('"') || value.startsWith("'")) return validateQuotedScalar(value, key);
  if (value.startsWith('{')) return parseFlowMapping(value, key);
  if (value.startsWith('[')) return { kind: 'sequence', value };
  const problem = validatePlainScalar(value, key);
  if (problem) return { error: problem };
  return { kind: 'scalar', value };
}

function parseNestedScalar(value, label) {
  if (value.startsWith('{') || value.startsWith('[')) return { error: `collection value for ${label} is outside the supported frontmatter subset` };
  if (value.startsWith('"') || value.startsWith("'")) return validateQuotedScalar(value, label);
  const problem = validatePlainScalar(value, label);
  if (problem) return { error: problem };
  return { kind: 'scalar', value };
}

function readBlockMapping(lines, start, end, parentKey) {
  let expectedIndent = 0;
  let entries = 0;
  const seen = new Set();
  let index = start + 1;
  for (; index < end; index++) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (line.includes('\t')) return { error: 'frontmatter contains a tab character' };
    const indent = indentationWidth(line);
    if (indent === 0) break;
    if (!expectedIndent) expectedIndent = indent;
    if (indent !== expectedIndent) return { error: `content deeper than one level or inconsistently indented in block mapping for ${parentKey} is outside the supported frontmatter subset` };

    const childLine = line.slice(indent);
    if (/^-($|\s)/.test(childLine)) return { error: 'block sequences are outside the supported frontmatter subset' };
    const match = /^([A-Za-z0-9_-]+):(?:[ \t]*(.*))?$/.exec(childLine);
    if (!match) return { error: `unparseable nested mapping line: ${childLine}` };
    const [, childKey, raw = ''] = match;
    if (seen.has(childKey)) return { error: `duplicate nested key in block mapping for ${parentKey}: ${childKey}` };
    seen.add(childKey);
    const value = stripYamlComment(raw).trim();
    if (!value) return { error: `nested value for ${parentKey}.${childKey} must be a single-line scalar` };
    const parsed = parseNestedScalar(value, `${parentKey}.${childKey}`);
    if (parsed.error) return { error: parsed.error };
    entries++;
  }
  if (!entries) return { error: `block mapping for ${parentKey} has no entries` };
  return { nextIndex: index };
}

function scalarKindError(key) {
  return `${key} must be a scalar string (plain, quoted, or block scalar)`;
}

function isBlankOrComment(line) {
  return !line.trim() || line.trimStart().startsWith('#');
}

function parseFrontmatter(file, text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { error: 'missing opening frontmatter delimiter' };
  const end = lines.findIndex((line, index) => index > 0 && line === '---');
  if (end === -1) return { error: 'missing closing frontmatter delimiter' };

  const data = {};
  const seen = new Set();
  for (let index = 1; index < end; index++) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (line.includes('\t')) return { error: 'frontmatter contains a tab character' };
    if (indentationWidth(line) > 0) return { error: `indented frontmatter line has no owning block or mapping: ${line.trim()}` };
    const match = /^([A-Za-z0-9_-]+):(?:[ \t]*(.*))?$/.exec(line);
    if (!match) return { error: `unparseable frontmatter line: ${line}` };
    const [, key, raw = ''] = match;
    if (seen.has(key)) return { error: `duplicate frontmatter key: ${key}` };
    seen.add(key);
    const requiresScalar = key === 'name' || key === 'description';
    const value = stripYamlComment(raw).trim();
    const block = parseBlockHeader(value);
    if (block?.invalid) return { error: `invalid block scalar header for ${key}` };
    if (block) {
      const scalar = readBlockScalar(lines, index, end, block);
      data[key] = scalar.value;
      index = scalar.nextIndex - 1;
      continue;
    }

    if (!value) {
      let probe = index + 1;
      while (probe < end && isBlankOrComment(lines[probe])) probe++;
      if (probe < end && indentationWidth(lines[probe]) > 0) {
        if (/^-($|\s)/.test(lines[probe].trimStart())) {
          if (requiresScalar) return { error: scalarKindError(key) };
          return { error: 'block sequences are outside the supported frontmatter subset' };
        }
        if (requiresScalar) return { error: scalarKindError(key) };
        if (key !== 'metadata') return { error: `block mappings are only supported for metadata; ${key} must use a scalar value` };
        const mapping = readBlockMapping(lines, index, end, key);
        if (mapping.error) return { error: mapping.error };
        data[key] = '';
        index = mapping.nextIndex - 1;
      } else {
        if (requiresScalar) return { error: scalarKindError(key) };
        data[key] = '';
      }
      continue;
    }

    const parsed = parseInlineValue(value, key);
    if (parsed.error) return { error: parsed.error };
    if (requiresScalar && parsed.kind !== 'scalar') return { error: scalarKindError(key) };
    if (parsed.kind === 'sequence') return { error: 'flow sequences are outside the supported frontmatter subset' };
    if (parsed.kind === 'mapping' && key !== 'metadata') return { error: `flow mappings are only supported for metadata; ${key} must use a scalar value` };
    data[key] = parsed.value;
  }
  return { data, bodyLines: lines.slice(end + 1) };
}

function stripCode(text) {
  return text.replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
}

function checkLinks(file, skillDir, skillName, text) {
  const visible = stripCode(text);
  const linkPattern = /\[[^\]\n]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of visible.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    target = decodeURIComponent(target.split('#')[0].split('?')[0]);
    if (!target) continue;
    const resolved = path.resolve(skillDir, target);
    const relToSkills = path.relative(skillsRoot, resolved);
    if (!relToSkills.startsWith('..') && !path.isAbsolute(relToSkills)) {
      const owner = relToSkills.split(path.sep)[0];
      if (owner !== skillName) fail(file, `cross-skill relative link to ${target}`);
    }
    if (!fs.existsSync(resolved)) fail(file, `broken relative link: ${match[1]}`);
  }
}

function checkScriptHelp(file) {
  const result = spawnSync(process.execPath, [file, '--help'], { encoding: 'utf8' });
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.error || result.status !== 0 || !/usage|help/i.test(output)) {
    fail(file, `script does not exit successfully with a usage/help response for --help`);
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkStringArray(file, value, field) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(file, `${field} must be a nonempty array`);
    return;
  }
  for (const [index, item] of value.entries()) {
    if (!isNonEmptyString(item)) fail(file, `${field}[${index}] must be a nonempty string`);
  }
}

function checkEvalFixture(file, skillNames, seenIds) {
  let fixture;
  try {
    fixture = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(file, `invalid JSON: ${error.message}`);
    return;
  }
  if (!fixture || Array.isArray(fixture) || typeof fixture !== 'object') {
    fail(file, 'fixture root must be a JSON object');
    return;
  }

  if (fixture.schemaVersion !== 1) fail(file, 'schemaVersion must be 1');
  if (!isNonEmptyString(fixture.id)) fail(file, 'id must be a nonempty string');
  else {
    if (!namePattern.test(fixture.id)) fail(file, `id is not valid lowercase-hyphen: ${fixture.id}`);
    if (fixture.id !== path.basename(file, '.json')) fail(file, `id (${fixture.id}) must match filename`);
    if (seenIds.has(fixture.id)) fail(file, `duplicate fixture id: ${fixture.id}`);
    seenIds.add(fixture.id);
  }
  if (!isNonEmptyString(fixture.skill)) fail(file, 'skill must be a nonempty string');
  else if (!skillNames.has(fixture.skill)) fail(file, `fixture references unknown skill: ${fixture.skill}`);
  if (!isNonEmptyString(fixture.title)) fail(file, 'title must be a nonempty string');
  if (!isNonEmptyString(fixture.prompt)) fail(file, 'prompt must be a nonempty string');

  const context = fixture.contextSnapshot;
  if (!context || Array.isArray(context) || typeof context !== 'object') {
    fail(file, 'contextSnapshot must be an object');
  } else {
    for (const key of ['surface', 'platform', 'mode']) {
      if (!isNonEmptyString(context[key])) fail(file, `contextSnapshot.${key} must be a nonempty string`);
    }
    checkStringArray(file, context.states, 'contextSnapshot.states');
    checkStringArray(file, context.constraints, 'contextSnapshot.constraints');
  }

  checkStringArray(file, fixture.expectedRouting, 'expectedRouting');
  checkStringArray(file, fixture.forbiddenBehaviors, 'forbiddenBehaviors');

  if (!Array.isArray(fixture.rubricDimensions) || fixture.rubricDimensions.length === 0) {
    fail(file, 'rubricDimensions must be a nonempty array');
  } else {
    for (const [index, item] of fixture.rubricDimensions.entries()) {
      if (!item || Array.isArray(item) || typeof item !== 'object') {
        fail(file, `rubricDimensions[${index}] must be an object`);
        continue;
      }
      for (const key of ['dimension', 'pass', 'fail']) {
        if (!isNonEmptyString(item[key])) fail(file, `rubricDimensions[${index}].${key} must be a nonempty string`);
      }
    }
  }

  if (!Array.isArray(fixture.negativeControls) || fixture.negativeControls.length === 0) {
    fail(file, 'negativeControls must be a nonempty array');
  } else {
    for (const [index, item] of fixture.negativeControls.entries()) {
      if (!item || Array.isArray(item) || typeof item !== 'object') {
        fail(file, `negativeControls[${index}] must be an object`);
        continue;
      }
      for (const key of ['name', 'input', 'mustNot']) {
        if (!isNonEmptyString(item[key])) fail(file, `negativeControls[${index}].${key} must be a nonempty string`);
      }
    }
  }

  const baseline = fixture.baseline;
  if (!baseline || Array.isArray(baseline) || typeof baseline !== 'object') {
    fail(file, 'baseline must be an object');
  } else {
    for (const key of ['withoutSkill', 'withSkill']) {
      if (!isNonEmptyString(baseline[key])) fail(file, `baseline.${key} must be a nonempty string`);
    }
  }
}

function checkEvalFixtures(skillNames) {
  const fixturesRoot = path.join(evalsRoot, 'fixtures');
  if (!fs.existsSync(fixturesRoot)) return;
  const seenIds = new Set();
  for (const entry of fs.readdirSync(fixturesRoot, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    checkEvalFixture(path.join(fixturesRoot, entry.name), skillNames, seenIds);
  }
}

if (!fs.existsSync(skillsRoot)) {
  console.error('skills/ directory not found');
  process.exit(1);
}

const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

if (skillDirs.length === 0) errors.push('skills/: no skills found');

for (const entry of skillDirs) {
  const skillName = entry.name;
  const skillDir = path.join(skillsRoot, skillName);
  const file = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(file)) {
    fail(file, 'missing SKILL.md');
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(file, text);
  if (parsed.error) {
    fail(file, parsed.error);
    continue;
  }
  const { data, bodyLines } = parsed;
  if (!namePattern.test(skillName) || skillName.length > 64) fail(file, `folder name is not valid lowercase-hyphen <=64 chars: ${skillName}`);
  if (data.name !== skillName) fail(file, `frontmatter name (${data.name || 'missing'}) does not equal folder name (${skillName})`);
  if (!data.description || !data.description.trim()) fail(file, 'description is missing or empty');
  else if (data.description.length > 1024) fail(file, `description is ${data.description.length} characters; limit is 1024`);
  if (bodyLines.length > 500) fail(file, `body has ${bodyLines.length} lines; limit is 500`);
  checkLinks(file, skillDir, skillName, text);

  const evalFile = path.join(evalsRoot, `${skillName}.md`);
  if (!fs.existsSync(evalFile)) {
    fail(evalFile, `missing evaluation file for ${skillName}`);
  } else {
    const evalText = fs.readFileSync(evalFile, 'utf8');
    if (!/^##\s+Case\b/m.test(evalText)) fail(evalFile, 'missing at least one `## Case` evaluation prompt');
  }

  const scriptsDir = path.join(skillDir, 'scripts');
  if (fs.existsSync(scriptsDir)) {
    for (const script of fs.readdirSync(scriptsDir).filter((name) => name.endsWith('.mjs')).sort()) {
      checkScriptHelp(path.join(scriptsDir, script));
    }
  }
}

checkEvalFixtures(new Set(skillDirs.map((entry) => entry.name)));

if (errors.length) {
  console.error(`Skill validation failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Skill validation passed: ${skillDirs.length} skill${skillDirs.length === 1 ? '' : 's'} checked.`);
