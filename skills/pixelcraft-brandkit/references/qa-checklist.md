# Brandkit QA checklist

Run this self-critique before selecting or delivering an image. Do not claim visual verification unless the generated output was actually inspected. Use the Pixelcraft evidence labels: `rendered`, `static`, `model-judgment`, `not-checked`, or `waived`.

## Strategy and divergence

- Does the board visually argue why the brand exists?
- Are category, audience, promise, trust level, and core metaphor legible in the system?
- Were 2–3 meaningfully different brand worlds considered before generation?
- Is there one strong ownable idea rather than a collage of effects?
- Is the chosen direction consistent with the user's fixed assets and requested scope?

## Logo consistency

- Is the exact same mark repeated across cover, applications, badge/icon/pattern, and detail panels?
- Is it simple, memorable, symbolic, scalable, ownable, balanced, and connected to strategy?
- Does it remain readable at the smallest panel size?
- Is there no accidental variant, copied famous mark, clipart behavior, meaningless sparkle, random animal, fake crest, or unjustified lightning bolt?
- For an existing logo: was it reused without redesign or reinterpretation?

## Text and legibility

- Is text sparse: brand name, at most one tagline, optional URL/command, 2–5 labels/chips?
- Is every visible line large enough to read at final output size?
- Is there no lorem ipsum, long paragraph, dense menu, fake tiny body copy, or unreadable texture-text?
- Is the tagline short and specific rather than corporate/inspirational filler?
- Are exact spelling, capitalization, punctuation, and the user's brand name correct?

## Palette discipline

- Is there one dominant palette with base, primary accent, optional secondary accent, and neutrals?
- Do accents repeat coherently across panels?
- Is there no random rainbow, cheap neon, or default purple-blue AI glow unless explicitly appropriate?
- Are supplied brand colors preserved exactly where required?
- Can the selected palette/type be translated into DTCG tokens through `pixelcraft-tokens` for implementation?

## Layout and composition

- Does the requested grid (`3×3`, `2×3`, `2×2`, `1×3`, `4×2`, or custom) match the brief?
- Are gutters consistent, alignment exact, and negative space intentional?
- Does the board have rhythm across quiet/functional/emotional/technical/atmospheric/detail panels rather than equal loudness?
- Are panels adapted to square/portrait/wide canvases without stretching?
- Is there one clear anchor/cover panel?

## Image, mockup, and detail quality

- Are images art-directed and tied to palette/metaphor?
- Are mockups minimal, believable identity applications rather than feature demos?
- Is there no generic stock people/office/robot imagery or unrelated scene?
- Are premium details—page numbers, rules, construction lines, texture, browser chrome—restrained rather than decorative noise?
- Does the result reward close inspection?

## Reference and copying check

- Were inspiration references used only for rhythm, grid, spacing, density, type scale, image treatment, and system behavior?
- Is there no copied exact logo, brand name, composition, slogan, or unique visual asset?
- Were user-owned identity assets treated as authoritative source material?
- Is anything suspiciously similar to a known brand? If yes, regenerate or revise.

## Size and output honesty

- Does actual output match requested width × height, ratio, or orientation?
- If exact dimensions were unsupported, was the closest ratio used and the limitation explained?
- Is actual output size reported rather than unsupported dimensions promised?
- Was the user consulted when cropping/resizing/composition materially changed the result?

## Anti-generic reject list

Reject or revise if the output contains random floating icons, generic startup gradients, overdesigned logos, meaningless blobs, messy collages, fake tiny UI, inconsistent marks, too many colors, cheap neon, stock-template boards, corporate PowerPoint behavior, or soulless SaaS dashboards. Make it quieter, sharper, and more intentional.

## Logo concept and small-size critique

- Is the mark appropriate, distinctive/memorable, and simple rather than overloaded with explanation?
- Was the silhouette tested solid black at thumbnail size before detail was added?
- Does the mark survive monochrome/reversed output and removal of gradients/texture?
- Were rendered 16/32/64 px outputs inspected on light and dark backgrounds?
- Does the app/favicon/icon crop avoid nonessential text and preserve one focal metaphor?
- For a mascot: are personality adjectives explicit; does posture/expression match them; is the character consistent rather than redrawn per panel?
- For pixel art: is every cell integer-aligned; are palette steps/curated colors deliberate; is there no blur, stray antialiasing, random noise, or accidental near-duplicate color?
- Is there a sanctioned small-size reduction rather than a shrunken master file?

## Final output standard

The image must look like a premium identity deck, senior designer's presentation board, brand-system case study, visual launch direction, or professional logo concept board. It should be clean, strategic, symbolic, minimal, coherent, premium, art-directed, implementation-friendly, and stronger than ordinary AI-generated brand visuals.

## Delivery report

Include: selected concept; rejected alternatives; actual output size; evidence label; what was inspected; unresolved issues; whether palette/type should be exported as tokens for implementation.
