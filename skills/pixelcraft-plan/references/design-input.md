# Design input intake

Use this reference whenever UI work begins from Figma, screenshots, mockups, prototypes, existing UI, brand boards, or supplied visual references. The planning question is not only “what does it look like?” but “what authority does this artifact have?”

## 1. Inventory every source separately

Do not collapse all visuals into “the design.” Record each artifact independently:

| Source type | Default classification | Planning treatment |
|---|---|---|
| approved Figma frame/component/prototype | specification for the approved scope | preserve visual intent; decide whether handoff translation is required |
| unapproved/exploratory Figma | candidate or inspiration | do not implement literally until approval state is resolved |
| screenshot of desired result | specification only for visible/static aspects | missing states/behavior remain assumptions |
| screenshot of existing UI | evidence of current behavior | inventory before redesign; do not confuse with desired direction |
| sketch/mockup/image-model board | inspiration unless user says approved | extract constraints/motifs; divergence may still be required |
| brand guidelines/tokens/assets | constraint or authority | preserve within stated scope; verify version and usage rights |
| competitor/reference site/app | inspiration only unless explicitly approved as specification | analyze mechanisms; never copy protected/unique design |
| existing production component library | implementation authority | reuse before redesign |

The user's explicit statement outranks the defaults. “Implement this approved design” means specification; “like this” or “inspired by” means inspiration. Ask only when the difference materially changes whether divergence or handoff should run.

## 2. Record provenance and version

For each artifact record what is knowable without ceremony:

- owner/author/source URL or file path;
- Figma file/page/frame/component/node ID and library version where applicable;
- screenshot/mockup file, capture date, device/browser scale, commit/version of the app shown;
- approval state and who approved it;
- target platform, breakpoint/orientation/density/input modality;
- theme/mode/locale/text direction represented;
- confidentiality/licensing/usage constraints;
- exact scope: whole surface, region, component, state, or style only.

Missing provenance is a planning risk, not permission to treat pixels as complete truth.

## 3. Assess completeness

Use this matrix before deciding implementation readiness:

| Dimension | Questions |
|---|---|
| structure | Are layout, navigation, hierarchy, and component boundaries visible or specified? |
| breakpoints | Are narrow/wide/resize/orientation behaviors provided? Which are assumptions? |
| states | Are hover/focus/disabled/loading/empty/error/offline/permission/validation covered? |
| content | Is copy/data/media real, placeholder, missing, legally approved, and localized? |
| tokens | Are color/type/spacing/elevation/motion values semantic, documented, or only pixels? |
| interaction | Are flows, gestures, keyboard behavior, routing, mutation, undo/error recovery defined? |
| accessibility | Are contrast, focus, labels, target size, reduced motion, scaling/reflow specified or left to implementation? |
| assets | Are exports/licenses/source files available, or must assets be recreated/omitted? |
| architecture | Does the source reveal data ownership, existing component reuse, platform constraints, or only appearance? |

Mark each dimension `specified`, `partial`, `missing`, or `not applicable`. Do not implement destructive/legal/security behavior from inference.

## 4. Record assumptions and contradiction policy

Every inferred item must be either confirmed or written as an explicit assumption with scope and consequence. An approved design decides visual intent within its approved scope, but it does not silently override the accessibility floor, platform or legal requirements, existing semantic tokens/components, data ownership, security/privacy constraints, or architecture. Resolve conflicts through existing components and platform idioms where possible. If fidelity truly requires breaking one of those constraints, record the conflict in the plan and escalate for an explicit user override rather than treating the newer artifact as higher authority. Preserve the losing rationale in the plan so later agents do not resurrect it.

## 5. Decide whether handoff is needed

Use `pixelcraft-handoff` when all are true:

1. the artifact is a specification for implementation, not merely inspiration;
2. visual direction is approved or fixed enough that divergence would violate intent;
3. translation requires semantic mapping into existing components/tokens/architecture or across a nontrivial stack.

Do not use handoff for open-ended redesign, early visual exploration, or inspiration-only references. Use partial handoff when only some regions are approved; undecided regions still go through direction/UX divergence.

Write the result into `.pixelcraft/plan.md`: artifact inventory, classification, provenance/version, represented breakpoints/modes, missing dimensions, assumptions, required approval questions, handoff decision, and visual-fidelity evidence needed.
