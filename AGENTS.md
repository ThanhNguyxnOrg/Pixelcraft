# Rules for agents editing Pixelcraft

1. Follow `docs/ARCHITECTURE.md` exactly. Do not rename skills, reorder the Pixelcraft loop, weaken the authority order, or assume React/Tailwind.
2. Every skill is self-contained under `skills/<name>/`. Refer to other skills only by exact skill name in prose; never use a relative link that crosses a skill boundary.
3. `SKILL.md` frontmatter must contain only portable fields: `name`, `description`, optional `license`, optional `metadata`. Folder name and `name` must match lowercase-hyphen form and be at most 64 characters.
4. Descriptions must be third person, state what the skill does and when to use it, include concrete trigger words, and stay under 1024 characters.
5. Keep `SKILL.md` bodies at or below 300 lines where possible and never above 500. Put depth in `references/*.md`, one level deep, linked with a one-line “read when” trigger.
6. Write imperative, concrete, checkable guidance. Delete generic advice that competent models already know. Prefer tables, checklists, do/don't pairs, and target-idiom examples.
7. Before changing a rule, read `docs/DESIGN-RATIONALE.md`; keep guidance original, concrete, and free of citation-registry bookkeeping.
8. Scripts must be Node.js >= 18, zero-dependency `.mjs` files and must support `node <script> --help`.
9. Never dictate appearance through the floor. Truthfulness, accessibility, localization, state coverage, responsiveness, performance, coherence, distinctiveness, and verifiability are mandatory; heroes, cards, colors, fonts, and layout shapes are not.
10. Every compliance or verification claim must carry an evidence label: `rendered`, `static`, `model-judgment`, `not-checked`, or `waived`.
11. Do not invent user facts, testimonials, metrics, logos, images, or citations. Mark missing material visibly or ask for it.
12. Run `npm run validate` and the installer dry-run smoke test before committing changes to skills or tooling. Keep commits logical and do not push unless explicitly asked.
