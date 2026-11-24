## Summary

- What changed and why?
- Which skills, scripts, evals, docs, or website sections are affected?

## Architecture & Rules Checklist

- [ ] Followed `docs/ARCHITECTURE.md` (no skill renames, loop reorders, or React/Tailwind assumptions in core skills)
- [ ] Read `docs/DESIGN-RATIONALE.md` before changing any behavioral rule
- [ ] All skill folders remain self-contained (no cross-skill relative links; portable frontmatter only; `SKILL.md` <= 500 lines)
- [ ] All scripts are zero-dependency Node.js >= 18 `.mjs` supporting `--help`
- [ ] Every verification claim below carries an explicit evidence label (`rendered`, `static`, `model-judgment`, `not-checked`, `waived`)

## Verification

| Check | Status | Evidence label | Notes |
|---|---|---|---|
| `npm test` | | `static` | |
| `node bin/pixelcraft.mjs add all --agent all --dry-run` | | `static` | |
| `npm --prefix website run sync && npm --prefix website run build && npm --prefix website test` | | `static` | |
| Rendered capture / Playwright QA (if UI changed) | | `rendered` / `not-checked` | |
