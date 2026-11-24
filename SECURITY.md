# Security Policy

## Supported Versions

Security fixes apply to the latest release on the `main` branch (`0.1.x`).

## Scope

Pixelcraft is a portable Agent Skills pack with zero-dependency Node.js, Bash, and PowerShell installers plus static verification scripts. Security-relevant areas include:

- **Installers (`bin/pixelcraft.mjs`, `install.sh`, `install.ps1`):** path traversal, symlink/reparse-point handling, archive extraction safety, unintended overwrites, or command injection.
- **Verification scripts (`skills/*/scripts/*.mjs`):** local file server boundaries in `shoot.mjs` / `style-inventory.mjs` (dot-segment refusal, root scoping), archive/JSON parsing, and subprocess handling in `check-tui.mjs`.
- **Showcase website (`website/`):** static server (`serve.mjs`) path confinement and client-side XSS.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for suspected security vulnerabilities.

1. Use [GitHub Private Vulnerability Reporting](https://github.com/ThanhNguyxnOrg/Pixelcraft/security/advisories/new) on `ThanhNguyxnOrg/Pixelcraft` (preferred), or contact the maintainers via the organization profile.
2. Include the affected file/command, reproduction steps, environment details (OS, Node/shell version), and impact.
3. We aim to acknowledge reports within **72 hours** and share a remediation timeline or fix plan once confirmed.

## Installer Safety Guarantees

- Installers never invoke `sudo` or request privilege escalation.
- Installers default to **project scope** and refuse symlinked or reparse-point target skill directories.
- Existing skill folders are skipped unless `--force` (`-Force`) is explicitly passed for requested skills.
- Use `--dry-run` (`-DryRun`) before writing files and pin `--ref <tag|commit-sha>` in automated setups.
