# Evidence-labeled report template

Use this structure for substantial UI creation or review. Compress it for tiny changes, but never omit unverified floor risks.

```markdown
## Pixelcraft report

**Direction selected:** <name> — <one-sentence rationale>.
**Rejected directions:** <names> — <why each lost, terse>.
**Surface/mode:** <stack/render surface/input modality>; <Persuade/Operate/Read/Experience/Play/Communicate>.

### Implemented
- <user-visible change and files/surface affected>

### Verification
| Claim | Evidence label | Method/scope | Result |
|---|---|---|---|
| Floor: accessibility | rendered/static/model-judgment/not-checked/waived | <tool, viewport, locale, input path> | <pass/issue/unknown> |
| Floor: states | ... | ... | ... |
| Distinctive intent | ... | ... | ... |

### Not checked / waived
- `<label>` <item> — reason and consequence.

### Open risks
- <risk, affected user/context, suggested next check>
```

## Rules

- Use only the five canonical labels: `rendered`, `static`, `model-judgment`, `not-checked`, `waived`.
- `rendered` requires actual rendered evidence; code inspection is `static` even when the code obviously encodes the behavior.
- State scope: viewport/device/window, orientation, locale/script/direction, input modality, theme/contrast/motion setting, and dataset size when relevant.
- Do not enumerate every floor item mechanically if unchanged. Group passed items only when the method truly covers them.
- Never hide a material unknown in prose. Put it in “Not checked / waived.”
