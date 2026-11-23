# Brand governance after generation

Use this reference once a brand direction or logo system exists. Generation is only the beginning: the identity must survive implementation, licensing review, localization, small sizes, accessibility constraints, and future contributors.

## Asset inventory and naming

Maintain an inventory of approved assets:

| Asset | Required metadata |
|---|---|
| primary logo/lockup | vector source, color modes, clearspace rule, minimum size, approved backgrounds |
| icon/mark/app/favicon | square artwork, source grid/geometry, raster sizes, small-size behavior |
| wordmark | custom lettering/font distinction, spacing rules, trademark/legal name distinction |
| color/type tokens | semantic roles, contrast pairings, licensing/source, fallback stacks |
| imagery/mascot/illustration | provenance/license, character construction rules, prohibited alterations |
| motion/audio/3D/social variants | duration/easing/static fallback, safe-area/crop behavior |

Use stable names that encode role/version/size/color mode, not meaningless export names such as `final-final2.png`. Keep editable/master source separate from generated export artifacts.

## Clearspace and minimum size

Define clearspace from a measurable feature of the mark (for example x-height, pixel unit, cap height, or glyph stroke module), not a vague “leave space.” Record separate minimum sizes for:

- full lockup;
- icon/mark alone;
- favicon/app-icon use;
- print/embroidered/etched or low-resolution contexts where relevant;
- reversed/monochrome versions.

Below minimum size, use the simplified/icon-only approved asset rather than scaling the full lockup until text disappears. Verify actual rendered pixels at 16/32/64 px where digital icons are used.

## Correct and incorrect use

Document concise rules with examples where possible:

- do not redraw, retype, stretch, crop, rotate, outline, shadow, gradient-fill randomly, animate destructively, or rearrange lockup geometry;
- do not place on low-contrast/busy imagery without an approved containment/background variant;
- do not recolor using arbitrary brand-adjacent values outside approved modes;
- do not use the mascot/character with inconsistent anatomy, expression, scale, or pixel/grid treatment;
- do not use pixel-art assets with fractional scaling, misaligned pixels, automatic smoothing artifacts, or mixed pixel sizes unless intentionally specified;
- do not let generated mockups become canonical source files.

Also document what is allowed: approved monochrome/reverse modes, partner lockup clearspace, localized/tagline lockups, motion behavior, and adaptation ownership.

## Legal, licensing, and provenance boundary

Record what is known and unknown:

- font licenses and redistribution rights;
- stock/image/illustration licenses;
- generated-asset provenance/tool constraints;
- trademark search/registration status;
- similarity risks discovered during review;
- ownership/assignment status of commissioned work;
- expiration/territory/channel restrictions.

Do not give legal advice or claim a mark is clear/registerable. Escalate trademark/legal clearance to qualified counsel or the project owner. Absence of a discovered conflict is not proof of legal availability.

## Accessibility and implementation checks

Before implementation use:

- verify approved foreground/background pairs by semantic role rather than logo color in isolation;
- ensure essential meaning does not depend solely on a color or decorative mascot detail;
- inspect reduced/monochrome/high-contrast/forced-color behavior;
- validate small-size legibility and pixel fidelity;
- check text expansion/localized tagline behavior;
- keep raster exports sharp at actual display density;
- ensure SVG/vector assets do not depend on missing fonts—outline or ship licensed fonts according to project/legal constraints.

## Governance workflow

1. Freeze the approved master/source version and record approval owner/date/scope.
2. Create implementation tokens/assets through controlled export rather than manual copying.
3. Validate small sizes, contrast pairs, dark/light modes, and prohibited-use rules.
4. Version changes and deprecate superseded exports explicitly.
5. Review use in real surfaces before broad rollout.
6. Revisit governance when product scope, licensing, trademark status, platforms, or identity strategy changes.

A brand without ownership/versioning quickly fragments into incompatible exports. Keep the system lightweight but explicit.
