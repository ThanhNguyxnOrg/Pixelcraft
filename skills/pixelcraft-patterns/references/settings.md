# Settings and preferences

Settings are high-trust operational surfaces. Predictability beats visual novelty.

## Organization

- Group by user goal or system object, not implementation module.
- Put dangerous/irreversible actions in clearly separated zones with explicit consequences.
- Explain current value, scope (user/workspace/system), default, restart/sync behavior, and permission requirements.
- Search should jump to settings without hiding context or permission state.
- Prefer inline editing with clear commit/cancel over implicit destructive autosave for risky values.

## Controls

Use the control matching the choice: radio for few mutually exclusive visible options, select for many, checkbox for independent binary, toggle only for immediate persistent preference where platform convention supports it, segmented control sparingly. Never use visual toggles without accessible state/text.

## States

Loading schema, missing permission, sync conflict, validation error, unsaved changes, applying/restart required, unknown/default inherited value, offline, failed destructive action, audit confirmation.

## Verification

Test refresh/back/deep link, unsaved-change warning, multi-window conflict, validation with preserved input, keyboard/tab order, focus after save/error, long localized labels, narrow layout, reduced motion, high contrast, and irreversible-action copy. Confirm actual persistence rather than only UI state.
