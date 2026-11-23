#!/usr/bin/env bash
set -euo pipefail

repo="${PIXELCRAFT_REPO:-ThanhNguyxn07/Pixelcraft}"
ref="${PIXELCRAFT_REF:-main}"
archive="${PIXELCRAFT_ARCHIVE:-}"
agents_arg="agents"
skills_arg="all"
scope="project"
force=0
dry_run=0

usage() {
  cat <<'USAGE'
Usage: install.sh [--agent NAME] [--skills LIST|all] [--global] [--force] [--dry-run]

Install Pixelcraft without Node.js by downloading the GitHub source tarball and
copying self-contained skill folders into an agent skills directory.

Options:
  --agent NAME     claude, codex, agents, devin, cursor, gemini, copilot,
                   windsurf, opencode, kiro, or all. Comma-separated names allowed.
                   Default: agents.
  --skills LIST    Comma-separated skill names, or all. Default: all.
  --global         Install in the user-level skills directory.
  --project        Install in the current project (default).
  --force          Replace explicitly requested existing skills. Auto-added
                   core skills install only when missing.
  --dry-run        Print copies without writing files.
  --ref REF        Git branch, tag, or commit archive to download (default: main).
  --repo OWNER/REPO  GitHub repository (default: ThanhNguyxn07/Pixelcraft).
  --archive PATH   Use a local repository .tar.gz instead of downloading.

Example:
  curl -fsSL https://raw.githubusercontent.com/ThanhNguyxn07/Pixelcraft/main/install.sh | bash -s -- --agent claude --skills all

The script never uses sudo, refuses symlinked target/skill directories, and
skips existing skill directories unless --force is passed.
USAGE
}

die() {
  echo "install.sh: $*" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent)
      shift
      [[ $# -gt 0 ]] || die "--agent requires a value"
      agents_arg="$1"
      ;;
    --agent=*) agents_arg="${1#--agent=}" ;;
    --skills|--skill)
      shift
      [[ $# -gt 0 ]] || die "--skills requires a value"
      skills_arg="$1"
      ;;
    --skills=*|--skill=*) skills_arg="${1#*=}" ;;
    --global) scope="global" ;;
    --project) scope="project" ;;
    --force) force=1 ;;
    --dry-run) dry_run=1 ;;
    --ref)
      shift
      [[ $# -gt 0 ]] || die "--ref requires a value"
      ref="$1"
      ;;
    --ref=*) ref="${1#--ref=}" ;;
    --repo)
      shift
      [[ $# -gt 0 ]] || die "--repo requires a value"
      repo="$1"
      ;;
    --repo=*) repo="${1#--repo=}" ;;
    --archive)
      shift
      [[ $# -gt 0 ]] || die "--archive requires a value"
      archive="$1"
      ;;
    --archive=*) archive="${1#--archive=}" ;;
    -h|--help)
      usage
      exit 0
      ;;
    *) die "unknown option: $1" ;;
  esac
  shift
done

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

contains() {
  local needle="$1"
  shift
  local item
  for item in "$@"; do
    [[ "$item" == "$needle" ]] && return 0
  done
  return 1
}

canonical_agent() {
  local value
  value="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"
  case "$value" in
    claude-code) value="claude" ;;
    gemini-cli) value="gemini" ;;
    github-copilot) value="copilot" ;;
    open-code) value="opencode" ;;
  esac
  printf '%s' "$value"
}

valid_agent() {
  case "$1" in
    claude|codex|agents|devin|cursor|gemini|copilot|windsurf|opencode|kiro|all) return 0 ;;
    *) return 1 ;;
  esac
}

agents=()
all_agents=(claude codex agents devin cursor gemini copilot windsurf opencode kiro)
IFS=',' read -r -a raw_agents <<< "$agents_arg"
use_all_agents=0
for raw in ${raw_agents[@]+"${raw_agents[@]}"}; do
  raw="$(trim "$raw")"
  [[ -n "$raw" ]] || continue
  agent="$(canonical_agent "$raw")"
  valid_agent "$agent" || die "invalid agent '$raw'"
  if [[ "$agent" == "all" ]]; then
    use_all_agents=1
    break
  fi
  contains "$agent" ${agents[@]+"${agents[@]}"} || agents+=("$agent")
done
if (( use_all_agents )); then
  agents=(${all_agents[@]+"${all_agents[@]}"})
fi
(( ${#agents[@]} > 0 )) || die "at least one agent is required"

tmp="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp"
}
trap cleanup EXIT

bundle="$tmp/pixelcraft.tar.gz"
if [[ -n "$archive" ]]; then
  [[ -f "$archive" ]] || die "archive not found: $archive"
  cp "$archive" "$bundle"
else
  url="https://github.com/$repo/archive/$ref.tar.gz"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$bundle" || die "failed to download $url"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$url" -O "$bundle" || die "failed to download $url"
  else
    die "curl or wget is required"
  fi
fi

tar -xzf "$bundle" -C "$tmp" || die "failed to extract repository tarball"
source_root=""
if [[ -d "$tmp/skills" ]]; then
  source_root="$tmp"
else
  for dir in "$tmp"/*; do
    if [[ -d "$dir/skills" ]]; then
      source_root="$dir"
      break
    fi
  done
fi
[[ -n "$source_root" ]] || die "archive does not contain a skills directory"

available=()
shopt -s nullglob
for dir in "$source_root"/skills/*; do
  if [[ -f "$dir/SKILL.md" ]]; then
    available+=("$(basename "$dir")")
  fi
done
(( ${#available[@]} > 0 )) || die "no skills found in archive"

IFS=',' read -r -a raw_skills <<< "$skills_arg"
use_all_skills=0
parsed_skills=()
for raw in ${raw_skills[@]+"${raw_skills[@]}"}; do
  raw="$(trim "$raw")"
  [[ -n "$raw" ]] || continue
  if [[ "$raw" == "all" ]]; then
    use_all_skills=1
    break
  fi
  contains "$raw" ${available[@]+"${available[@]}"} || die "unknown skill '$raw'; available: ${available[*]}"
  contains "$raw" ${parsed_skills[@]+"${parsed_skills[@]}"} || parsed_skills+=("$raw")
done

selected=()
if (( use_all_skills )); then
  for name in ${available[@]+"${available[@]}"}; do
    selected+=("$name:explicit")
  done
else
  injected=()
  for core in pixelcraft pixelcraft-plan; do
    if contains "$core" ${available[@]+"${available[@]}"} && ! contains "$core" ${parsed_skills[@]+"${parsed_skills[@]}"}; then
      injected+=("$core")
    fi
  done
  if (( ${#injected[@]} > 0 )); then
    echo "note: including required core skill(s): ${injected[*]}"
    for name in ${injected[@]+"${injected[@]}"}; do
      selected+=("$name:auto")
    done
  fi
  for name in ${parsed_skills[@]+"${parsed_skills[@]}"}; do
    selected+=("$name:explicit")
  done
fi
(( ${#selected[@]} > 0 )) || die "at least one skill is required"

target_for() {
  local agent="$1"
  if [[ "$scope" == "project" ]]; then
    case "$agent" in
      claude) printf '%s/.claude/skills\n' "$PWD" ;;
      codex|agents|devin) printf '%s/.agents/skills\n' "$PWD" ;;
      cursor) printf '%s/.cursor/skills\n' "$PWD" ;;
      gemini) printf '%s/.gemini/skills\n' "$PWD" ;;
      copilot) printf '%s/.github/skills\n' "$PWD" ;;
      windsurf) printf '%s/.windsurf/skills\n' "$PWD" ;;
      kiro) printf '%s/.kiro/pixelcraft/skills\n' "$PWD" ;;
      opencode) printf '%s/.opencode/skills\n' "$PWD" ;;
    esac
  else
    case "$agent" in
      claude) printf '%s/.claude/skills\n' "$HOME" ;;
      codex|agents|devin) printf '%s/.agents/skills\n' "$HOME" ;;
      cursor) printf '%s/.cursor/skills\n' "$HOME" ;;
      gemini) printf '%s/.gemini/skills\n' "$HOME" ;;
      copilot) printf '%s/.copilot/skills\n' "$HOME" ;;
      windsurf) printf '%s/.codeium/windsurf/skills\n' "$HOME" ;;
      opencode) printf '%s/.config/opencode/skills\n' "$HOME" ;;
      kiro) printf '%s/.kiro/pixelcraft/skills\n' "$HOME" ;;
    esac
  fi
}

assert_target_path_safe() {
  local root="$1"
  local base="$PWD"
  if [[ "$scope" == "global" ]]; then
    base="$HOME"
  fi
  local prefix="$base/"
  [[ "$root" == "$prefix"* ]] || die "target skills directory is outside the expected scope: $root"
  local base_len="${#prefix}"
  local remainder="${root:$base_len}"
  local current="$base"
  local part
  while [[ -n "$remainder" ]]; do
    part="${remainder%%/*}"
    current="$current/$part"
    [[ ! -L "$current" ]] || die "target skills path component is a symlink: $current; refusing to install through it"
    [[ "$remainder" == */* ]] || break
    remainder="${remainder#*/}"
  done
}

copy_skill() {
  local name="$1"
  local root="$2"
  local auto="$3"
  local source="$source_root/skills/$name"
  local destination="$root/$name"

  [[ ! -L "$source" ]] || die "source skill directory is a symlink: $source; refusing to install through it"
  [[ ! -L "$root" ]] || die "target skills directory is a symlink: $root; refusing to install through it"

  local exists=0
  local is_link=0
  if [[ -e "$destination" || -L "$destination" ]]; then
    exists=1
    [[ -L "$destination" ]] && is_link=1
  fi

  if (( auto && exists )); then
    local kind="existing install"
    local prefix=""
    (( is_link )) && kind="existing symlink"
    (( dry_run )) && prefix="dry-run: "
    echo "${prefix}skipped auto-added $kind: $name -> $destination"
    return
  fi
  (( ! is_link )) || die "installed skill directory is a symlink: $destination; refusing to install through it"

  if (( dry_run )); then
    if (( exists && ! force )); then
      echo "dry-run: skipped existing $name -> $destination (use --force to replace)"
    else
      echo "dry-run: $name -> $destination"
    fi
    return
  fi

  mkdir -p "$root"
  [[ ! -L "$root" ]] || die "target skills directory is a symlink: $root; refusing to install through it"
  if (( exists && ! force )); then
    echo "skipped existing: $name -> $destination (use --force to replace)"
    return
  fi
  rm -rf "$destination"
  cp -R "$source" "$destination"
  echo "installed: $name -> $destination"
}

write_adapter_file() {
  local file="$1"
  shift
  local dir
  dir="$(dirname "$file")"
  assert_target_path_safe "$dir"
  [[ ! -L "$file" ]] || die "adapter output is a symlink: $file; refusing to install through it"
  if [[ -e "$file" && $force -eq 0 ]]; then
    local prefix=""
    (( dry_run )) && prefix="dry-run: "
    echo "${prefix}skipped existing adapter: $file (use --force to replace)"
    return
  fi
  if (( dry_run )); then
    echo "dry-run: adapter $file"
    return
  fi
  mkdir -p "$dir"
  assert_target_path_safe "$dir"
  printf '%s\n' "$@" > "$file"
  echo "installed adapter: $file"
}

workflow_task() {
  case "$1" in
    pixelcraft-plan) printf '%s' 'Run Pixelcraft step-zero planning before UI work' ;;
    pixelcraft-review) printf '%s' 'Audit or critique UI with Pixelcraft evidence rules' ;;
    pixelcraft-visual-qa) printf '%s' 'Capture and inspect rendered UI evidence' ;;
    pixelcraft-direction) printf '%s' 'Generate divergent visual directions' ;;
    *) printf '%s' 'Run the Pixelcraft orchestrator for UI design/build work' ;;
  esac
}

write_shell_adapters() {
  local agent="$1"
  local root="$2"
  local base action task
  case "$agent" in
    claude)
      base="${root%/skills}"
      for action in pixelcraft pixelcraft-plan pixelcraft-review pixelcraft-visual-qa; do
        task="$(workflow_task "$action")"
        write_adapter_file "$base/commands/$action.md" '---' "description: $task" '---' '' "$task. Read and follow the self-contained \`$action\` skill. Preserve user requirements, project conventions, accessibility, and evidence labels."
      done
      ;;
    cursor)
      base="${root%/skills}"
      write_adapter_file "$base/rules/pixelcraft.mdc" '---' 'description: Route UI design and review through Pixelcraft' 'alwaysApply: true' '---' '' '# Pixelcraft router' '' "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $root; do not inline large generated content."
      ;;
    copilot)
      base="${root%/skills}"
      write_adapter_file "$base/copilot-instructions.md" '# Pixelcraft router' '' "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $root; do not inline large generated content."
      write_adapter_file "$base/instructions/pixelcraft.instructions.md" '---' 'applyTo: "**/*.{html,css,scss,js,jsx,ts,tsx,vue,svelte,astro,py,rb,php,cs,java,kt,swift,dart,rs,go,lua,ex,exs,clj,cljs,elm,fs,scala}"' '---' '' 'When editing interface or user-facing behavior, follow copilot-instructions.md and read the matching Pixelcraft skill before implementation or review.'
      for action in pixelcraft-plan pixelcraft-review pixelcraft-visual-qa pixelcraft-direction; do
        task="$(workflow_task "$action")"
        write_adapter_file "$base/prompts/$action.prompt.md" '---' "description: $task" '---' '' "$task. Read and follow the self-contained \`$action\` skill. Preserve user requirements, project conventions, accessibility, and evidence labels."
      done
      ;;
    windsurf|kiro)
      if [[ "$agent" == "windsurf" ]]; then
        base="${root%/skills}"
      else
        base="${root%/pixelcraft/skills}"
      fi
      if [[ "$agent" == "windsurf" ]]; then
        write_adapter_file "$base/rules/pixelcraft.md" '# Pixelcraft router' '' "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $root."
        for action in pixelcraft-plan pixelcraft-review pixelcraft-visual-qa pixelcraft-direction; do
          task="$(workflow_task "$action")"
          write_adapter_file "$base/workflows/$action.md" "# $task" '' "1. Read the self-contained \`$action\` skill under $root." '2. Follow its workflow and references.' '3. Preserve user requirements, accessibility, and evidence labels.'
        done
      else
        write_adapter_file "$base/steering/pixelcraft.md" '# Pixelcraft steering' '' "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $root."
      fi
      ;;
  esac
}

targets=()
target_agents=()
for agent in ${agents[@]+"${agents[@]}"}; do
  target="$(target_for "$agent")"
  assert_target_path_safe "$target"
  if ! contains "$target" ${targets[@]+"${targets[@]}"}; then
    targets+=("$target")
    target_agents+=("$agent")
  fi
done

for index in "${!targets[@]}"; do
  target="${targets[$index]}"
  agent="${target_agents[$index]}"
  for entry in ${selected[@]+"${selected[@]}"}; do
    name="${entry%%:*}"
    auto=0
    [[ "${entry##*:}" == "auto" ]] && auto=1
    copy_skill "$name" "$target" "$auto"
  done
  write_shell_adapters "$agent" "$target"
done
