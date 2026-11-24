[CmdletBinding()]
param(
  [string[]]$Agent = @('agents'),
  [string[]]$Skill = @('all'),
  [switch]$Global,
  [switch]$Force,
  [switch]$DryRun,
  [switch]$DocsMcp,
  [string]$Ref = 'main',
  [string]$Repo = 'ThanhNguyxnOrg/Pixelcraft',
  [string]$Archive
)

& {
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$canonicalAgents = @('claude', 'codex', 'agents', 'devin', 'cursor', 'gemini', 'copilot', 'windsurf', 'opencode', 'kiro', 'cline', 'roo', 'droid', 'antigravity')
$validAgents = $canonicalAgents + @('all')

function ConvertTo-CanonicalAgent([string]$Name) {
  $value = $Name.Trim().ToLowerInvariant()
  switch ($value) {
    'claude-code' { return 'claude' }
    'gemini-cli' { return 'gemini' }
    'github-copilot' { return 'copilot' }
    'open-code' { return 'opencode' }
    'roo-code' { return 'roo' }
    'factory' { return 'droid' }
    { $_ -in @('amp', 'zed', 'goose') } { return 'agents' }
    default { return $value }
  }
}

function Test-AnyPath([string]$Path) {
  $item = Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
  return ($null -ne $item)
}

function Test-ReparsePoint([string]$Path) {
  $item = Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
  return ($null -ne $item -and [bool]($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint))
}

function Assert-TargetPathSafe([string]$DestinationRoot, [bool]$GlobalScope) {
  $base = if ($GlobalScope) { [System.Environment]::GetFolderPath('UserProfile') } else { (Get-Location).Path }
  $rootFull = [System.IO.Path]::GetFullPath($DestinationRoot)
  $baseFull = [System.IO.Path]::GetFullPath($base)
  $separator = [string][System.IO.Path]::DirectorySeparatorChar
  $prefix = $baseFull
  if (-not $prefix.EndsWith($separator)) { $prefix += $separator }
  if (-not $rootFull.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "target skills directory is outside the expected scope: $DestinationRoot"
  }
  $relative = $rootFull.Substring($prefix.Length)
  $current = $baseFull
  foreach ($part in ($relative -split '[\\/]+')) {
    if ([string]::IsNullOrWhiteSpace($part)) { continue }
    $current = Join-Path $current $part
    if (Test-ReparsePoint $current) {
      throw "target skills path component is a symlink or reparse point: $current; refusing to install through it"
    }
  }
}

function Get-TargetRoot([string]$Name, [bool]$GlobalScope) {
  $homeDir = [System.Environment]::GetFolderPath('UserProfile')
  if ($GlobalScope) {
    if ($Name -eq 'claude') { return (Join-Path $homeDir '.claude/skills') }
    if ($Name -in @('codex', 'agents', 'devin')) { return (Join-Path $homeDir '.agents/skills') }
    if ($Name -eq 'cursor') { return (Join-Path $homeDir '.cursor/skills') }
    if ($Name -eq 'gemini') { return (Join-Path $homeDir '.gemini/skills') }
    if ($Name -eq 'copilot') { return (Join-Path $homeDir '.copilot/skills') }
    if ($Name -eq 'windsurf') { return (Join-Path $homeDir '.codeium/windsurf/skills') }
    if ($Name -eq 'opencode') { return (Join-Path $homeDir '.config/opencode/skills') }
    if ($Name -eq 'kiro') { return (Join-Path $homeDir '.kiro/skills') }
    if ($Name -eq 'cline') { return (Join-Path $homeDir '.cline/skills') }
    if ($Name -eq 'roo') { return (Join-Path $homeDir '.roo/skills') }
    if ($Name -eq 'droid') { return (Join-Path $homeDir '.factory/skills') }
    if ($Name -eq 'antigravity') { return (Join-Path $homeDir '.gemini/config/skills') }
  } else {
    $base = (Get-Location).Path
    if ($Name -eq 'claude') { return (Join-Path $base '.claude/skills') }
    if ($Name -in @('codex', 'agents', 'devin', 'antigravity')) { return (Join-Path $base '.agents/skills') }
    if ($Name -eq 'cursor') { return (Join-Path $base '.cursor/skills') }
    if ($Name -eq 'gemini') { return (Join-Path $base '.gemini/skills') }
    if ($Name -eq 'copilot') { return (Join-Path $base '.github/skills') }
    if ($Name -eq 'windsurf') { return (Join-Path $base '.windsurf/skills') }
    if ($Name -eq 'opencode') { return (Join-Path $base '.opencode/skills') }
    if ($Name -eq 'kiro') { return (Join-Path $base '.kiro/skills') }
    if ($Name -eq 'cline') { return (Join-Path $base '.cline/skills') }
    if ($Name -eq 'roo') { return (Join-Path $base '.roo/skills') }
    if ($Name -eq 'droid') { return (Join-Path $base '.factory/skills') }
  }
  throw "invalid agent '$Name'"
}

function Get-WorkflowTask([string]$Name) {
  switch ($Name) {
    'pixelcraft-plan' { return 'Run Pixelcraft step-zero planning before UI work' }
    'pixelcraft-review' { return 'Audit or critique UI with Pixelcraft evidence rules' }
    'pixelcraft-visual-qa' { return 'Capture and inspect rendered UI evidence' }
    'pixelcraft-direction' { return 'Generate divergent visual directions' }
    default { return 'Run the Pixelcraft orchestrator for UI design/build work' }
  }
}

function Get-DisplaySkillRoot([string]$SkillRoot) {
  $full = [System.IO.Path]::GetFullPath($SkillRoot)
  if ($Global) {
    $homeFull = [System.IO.Path]::GetFullPath([System.Environment]::GetFolderPath('UserProfile')).TrimEnd('\', '/')
    if ($full.StartsWith($homeFull, [System.StringComparison]::OrdinalIgnoreCase)) {
      return ('~' + $full.Substring($homeFull.Length)).Replace('\', '/')
    }
    return $full.Replace('\', '/')
  }
  $cwdFull = [System.IO.Path]::GetFullPath((Get-Location).Path).TrimEnd('\', '/')
  $prefix = $cwdFull + [System.IO.Path]::DirectorySeparatorChar
  if ($full.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $full.Substring($prefix.Length).Replace('\', '/')
  }
  return $full.Replace('\', '/')
}

function Write-AdapterFile([string]$Path, [string[]]$Lines, [switch]$Managed) {
  $parent = Split-Path -Parent $Path
  Assert-TargetPathSafe $parent ([bool]$Global)
  if (Test-ReparsePoint $Path) { throw "adapter output is a symlink or reparse point: $Path; refusing to install through it" }
  $exists = Test-AnyPath $Path
  if (-not $Managed -and $exists -and -not $Force) {
    $prefix = if ($DryRun) { 'dry-run: ' } else { '' }
    Write-Host "${prefix}skipped existing adapter: $Path (use -Force to replace)"
    return
  }
  if ($DryRun) {
    $kind = if ($Managed) { 'managed adapter' } else { 'adapter' }
    Write-Host "dry-run: $kind $Path"
    return
  }
  if (-not (Test-AnyPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  Assert-TargetPathSafe $parent ([bool]$Global)
  if ($Managed) {
    $startMarker = '<!-- pixelcraft:start -->'
    $endMarker = '<!-- pixelcraft:end -->'
    $block = "$startMarker`n$($Lines -join "`n")`n$endMarker"
    $existing = if ($exists) { [System.IO.File]::ReadAllText($Path) } else { '' }
    $pattern = '(?s)<!-- pixelcraft:start -->.*?<!-- pixelcraft:end -->'
    if ([regex]::IsMatch($existing, $pattern)) {
      $output = [regex]::Replace($existing, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $block }, 1)
    } elseif ($existing.Contains($startMarker)) {
      throw "managed Pixelcraft block is missing its end marker: fix $Path before installing"
    } elseif ([string]::IsNullOrWhiteSpace($existing)) {
      $output = "$block`n"
    } else {
      $output = "$($existing.TrimEnd())`n`n$block`n"
    }
    [System.IO.File]::WriteAllText($Path, $output, [System.Text.UTF8Encoding]::new($false))
  } else {
    Set-Content -LiteralPath $Path -Value $Lines -Encoding UTF8
  }
  Write-Host "installed adapter: $Path"
}

function Write-PixelcraftAdapter([string]$AgentName, [string]$SkillRoot) {
  $base = Split-Path -Parent $SkillRoot
  $displayRoot = Get-DisplaySkillRoot $SkillRoot
  $workflowActions = @(
    @{ Name = 'pixelcraft-plan'; Task = (Get-WorkflowTask 'pixelcraft-plan') },
    @{ Name = 'pixelcraft-review'; Task = (Get-WorkflowTask 'pixelcraft-review') },
    @{ Name = 'pixelcraft-visual-qa'; Task = (Get-WorkflowTask 'pixelcraft-visual-qa') },
    @{ Name = 'pixelcraft-direction'; Task = (Get-WorkflowTask 'pixelcraft-direction') }
  )
  if ($AgentName -eq 'claude') {
    $commandActions = @(
      @{ Name = 'pixelcraft'; Task = (Get-WorkflowTask 'pixelcraft') },
      @{ Name = 'pixelcraft-plan'; Task = (Get-WorkflowTask 'pixelcraft-plan') },
      @{ Name = 'pixelcraft-review'; Task = (Get-WorkflowTask 'pixelcraft-review') },
      @{ Name = 'pixelcraft-visual-qa'; Task = (Get-WorkflowTask 'pixelcraft-visual-qa') }
    )
    foreach ($action in $commandActions) {
      Write-AdapterFile (Join-Path $base ("commands/$($action.Name).md")) @('---', "description: $($action.Task)", '---', '', "$($action.Task). Read and follow the self-contained $($action.Name) skill. Preserve user requirements, project conventions, accessibility, and evidence labels.")
    }
  } elseif ($AgentName -eq 'cursor') {
    Write-AdapterFile (Join-Path $base 'rules/pixelcraft.mdc') @('---', 'description: Route UI design and review through Pixelcraft', 'alwaysApply: true', '---', '', '# Pixelcraft router', '', "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $displayRoot; do not inline large generated content.")
  } elseif ($AgentName -eq 'copilot') {
    Write-AdapterFile (Join-Path $base 'copilot-instructions.md') @('# Pixelcraft router', '', "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $displayRoot; do not inline large generated content.") -Managed
    Write-AdapterFile (Join-Path $base 'instructions/pixelcraft.instructions.md') @('---', 'applyTo: "**/*.{html,css,scss,js,jsx,ts,tsx,vue,svelte,astro,mdx,razor,heex,erb,templ,mjml,typ,tex,py,rb,php,cs,java,kt,swift,dart,rs,go,lua,ex,exs,clj,cljs,elm,fs,scala,cpp,h,glsl,wgsl,qml,xaml,uxml,uss,gd,tscn,tcss,qss,r,jl}"', '---', '', 'When editing interface or user-facing behavior, follow copilot-instructions.md and read the matching Pixelcraft skill before implementation or review.')
    foreach ($action in $workflowActions) {
      Write-AdapterFile (Join-Path $base ("prompts/$($action.Name).prompt.md")) @('---', "description: $($action.Task)", '---', '', "$($action.Task). Read and follow the self-contained $($action.Name) skill. Preserve user requirements, project conventions, accessibility, and evidence labels.")
    }
  } elseif ($AgentName -eq 'windsurf') {
    if ($Global) {
      Write-AdapterFile (Join-Path $base 'memories/global_rules.md') @('# Pixelcraft router', '', "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $displayRoot.") -Managed
    } else {
      Write-AdapterFile (Join-Path $base 'rules/pixelcraft.md') @('# Pixelcraft router', '', "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $displayRoot.")
    }
    foreach ($action in $workflowActions) {
      Write-AdapterFile (Join-Path $base ("workflows/$($action.Name).md")) @("# $($action.Task)", '', "1. Read the self-contained $($action.Name) skill under $displayRoot.", '2. Follow its workflow and references.', '3. Preserve user requirements, accessibility, and evidence labels.')
    }
  } elseif ($AgentName -eq 'kiro') {
    Write-AdapterFile (Join-Path $base 'steering/pixelcraft.md') @('# Pixelcraft steering', '', "Use Pixelcraft for interface design, implementation, review, and visual QA. Start with pixelcraft-plan and read the matching self-contained skill under $displayRoot.")
  }
}

$agents = @()
foreach ($raw in ($Agent | ForEach-Object { $_ -split '[,\s]+' })) {
  if ([string]::IsNullOrWhiteSpace($raw)) { continue }
  $name = ConvertTo-CanonicalAgent $raw
  if ($validAgents -notcontains $name) { throw "invalid agent '$raw'; expected one of $($validAgents -join ', ')" }
  if ($name -eq 'all') {
    $agents = $canonicalAgents
    break
  }
  if ($agents -notcontains $name) { $agents += $name }
}
if ($agents.Count -eq 0) { throw 'at least one agent is required' }

$tmpRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('pixelcraft-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmpRoot -Force | Out-Null

try {
  $zipPath = Join-Path $tmpRoot 'pixelcraft.zip'
  if ($Archive) {
    if (-not (Test-Path -LiteralPath $Archive -PathType Leaf)) { throw "archive not found: $Archive" }
    Copy-Item -LiteralPath $Archive -Destination $zipPath
  } else {
    $uri = "https://github.com/$Repo/archive/$Ref.zip"
    Invoke-WebRequest -Uri $uri -OutFile $zipPath -UseBasicParsing
  }

  Expand-Archive -LiteralPath $zipPath -DestinationPath $tmpRoot -Force
  if (Test-Path -LiteralPath (Join-Path $tmpRoot 'skills') -PathType Container) {
    $sourceRoot = Get-Item -LiteralPath $tmpRoot
  } else {
    $sourceRoot = Get-ChildItem -LiteralPath $tmpRoot -Directory |
      Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'skills') -PathType Container } |
      Select-Object -First 1
  }
  if ($null -eq $sourceRoot) { throw 'archive does not contain a skills directory' }
  $skillsRoot = Join-Path $sourceRoot.FullName 'skills'

  $available = @()
  Get-ChildItem -LiteralPath $skillsRoot -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') -PathType Leaf } |
    Sort-Object Name |
    ForEach-Object { $available += $_.Name }
  if ($available.Count -eq 0) { throw 'no skills found in archive' }

  $requested = @()
  $useAll = $false
  foreach ($raw in ($Skill | ForEach-Object { $_ -split '[,\s]+' })) {
    if ([string]::IsNullOrWhiteSpace($raw)) { continue }
    $name = $raw.Trim()
    if ($name -ieq 'all') {
      $useAll = $true
      break
    }
    if ($available -notcontains $name) { throw "unknown skill '$name'; available: $($available -join ', ')" }
    if ($requested -notcontains $name) { $requested += $name }
  }

  $selected = @()
  if ($useAll) {
    foreach ($name in $available) { $selected += [pscustomobject]@{ Name = $name; Auto = $false } }
  } else {
    $injected = @()
    foreach ($core in @('pixelcraft', 'pixelcraft-plan')) {
      if (($available -contains $core) -and ($requested -notcontains $core)) { $injected += $core }
    }
    if ($injected.Count -gt 0) {
      Write-Host "note: including required core skill(s): $($injected -join ', ')"
      foreach ($name in $injected) { $selected += [pscustomobject]@{ Name = $name; Auto = $true } }
    }
    foreach ($name in $requested) { $selected += [pscustomobject]@{ Name = $name; Auto = $false } }
  }
  if ($selected.Count -eq 0) { throw 'at least one skill is required' }

  $copySkill = {
    param([string]$Name, [string]$DestinationRoot, [bool]$IsAuto)
    $source = Join-Path $skillsRoot $Name
    $destination = Join-Path $DestinationRoot $Name

    if (Test-ReparsePoint $source) { throw "source skill directory is a symlink: $source; refusing to install through it" }
    if (Test-ReparsePoint $DestinationRoot) { throw "target skills directory is a symlink: $DestinationRoot; refusing to install through it" }

    $exists = Test-AnyPath $destination
    $isLink = Test-ReparsePoint $destination
    if ($IsAuto -and $exists) {
      $kind = if ($isLink) { 'existing symlink' } else { 'existing install' }
      $prefix = if ($DryRun) { 'dry-run: ' } else { '' }
      Write-Host "${prefix}skipped auto-added ${kind}: $Name -> $destination"
      return
    }
    if ($isLink) { throw "installed skill directory is a symlink: $destination; refusing to install through it" }

    if ($DryRun) {
      if ($exists -and -not $Force) {
        Write-Host "dry-run: skipped existing $Name -> $destination (use -Force to replace)"
      } else {
        Write-Host "dry-run: $Name -> $destination"
      }
      return
    }

    if (-not (Test-AnyPath $DestinationRoot)) { New-Item -ItemType Directory -Path $DestinationRoot -Force | Out-Null }
    if (Test-ReparsePoint $DestinationRoot) { throw "target skills directory is a symlink: $DestinationRoot; refusing to install through it" }
    if ($exists -and -not $Force) {
      Write-Host "skipped existing: $Name -> $destination (use -Force to replace)"
      return
    }
    if ($exists) { Remove-Item -LiteralPath $destination -Recurse -Force }
    Copy-Item -LiteralPath $source -Destination $destination -Recurse
    Write-Host "installed: $Name -> $destination"
  }

  $targets = @()
  $targetAgents = @()
  foreach ($name in $agents) {
    $target = Get-TargetRoot $name ([bool]$Global)
    Assert-TargetPathSafe $target ([bool]$Global)
    if ($targets -notcontains $target) {
      $targets += $target
      $targetAgents += $name
    }
  }

  for ($index = 0; $index -lt $targets.Count; $index += 1) {
    $target = $targets[$index]
    $agentName = $targetAgents[$index]
    foreach ($entry in $selected) {
      & $copySkill ($entry.Name) $target ($entry.Auto)
    }
    Write-PixelcraftAdapter $agentName $target
  }
  if ($DocsMcp) {
    Write-Output 'Optional Context7 docs MCP: follow the instructions for your host at https://github.com/upstash/context7#readme. Pixelcraft does not configure MCP or request credentials. If unavailable, use versioned official docs and the package registry.'
  }
} finally {
  Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
}
}
