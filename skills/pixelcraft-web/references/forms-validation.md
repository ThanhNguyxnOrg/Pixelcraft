# Form frameworks and schema validation

Pair this engineering reference with `pixelcraft-ux` (`forms.md`) for UX rules. Choose a form framework by **rendering model (progressive server actions vs client SPA), framework ecosystem, and field-array/async-validation complexity**.

## Form framework decision matrix

| Library | Frameworks | Validation & schema model | Best fit |
|---|---|---|---|
| **TanStack Form (v1)** | React, Vue, Solid, Svelte, Angular, Lit | Native **Standard Schema** (`Zod v3.24+/v4`, `Valibot`, `ArkType`, `Effect/Schema`) with `onBlur`/`onSubmit` + `onChangeAsyncDebounceMs` | Multi-framework or deeply typed TypeScript apps with nested/async validation |
| **React Hook Form (v7/v8)** | React | `@hookform/resolvers` (v5+ for Zod v4; `zodResolver`, `valibotResolver`, `yupResolver`, `ajvResolver`) | Client-heavy React forms needing minimal re-renders via uncontrolled `register()` |
| **Conform** | React (Next.js Server Actions, React Router v7) | `@conform-to/zod/v4` (`parseWithZod` / `getZodConstraint`) or `@conform-to/valibot` | Server-first forms requiring progressive enhancement, `FormData`, and auto-wired ARIA (`getFormProps`/`getInputProps`) |
| **SvelteKit Superforms** | Svelte 5 / SvelteKit 2 | `superValidate(zod4(schema))` / Valibot / ArkType adapters | Progressive SvelteKit `+page.server.ts` forms with full typed client/server sync and tainted-state guards |
| **Modular Forms** | Solid, Qwik, Preact | Fine-grained signals + Valibot / Zod adapters | Zero-VDOM and resumable frameworks where tiny bundle size and signal-level updates matter |
| **VeeValidate (v4)** | Vue 3 | `toTypedSchema(zod/valibot/yup)` + Composition API `useForm` / `defineField` | Vue 3 apps needing typed Composition API bindings and repeatable `useFieldArray` |
| **Formik** | React (legacy) | Yup / custom validate | Maintenance of existing codebases only; prefer TanStack Form, RHF, or Conform for greenfield |

## Schema libraries, Standard Schema, and Zod v4 migration

Prefer **Standard Schema** (`standard-schema.dev` v1) compatible validators so form and server layers share one schema without custom glue:

- **Zod v4 (`zod` / `zod/v4-mini`)**: major perf and bundle improvements. Use top-level string format validators (**`z.email()`**, `z.url()`, `z.uuid()`) instead of deprecated `z.string().email()`, import **`zod/v4-mini`** (`z.string().check(z.minLength(3))`) when minimal client bundle size matters, and align adapters (**`@hookform/resolvers` v5+** for RHF and **`@conform-to/zod/v4`** for Conform—do not mix Zod v3 adapters with Zod v4 schemas).
- **Valibot**: modular tree-shakeable functions—strong default when client bundle budget is tight.
- **ArkType**: high-performance TypeScript-syntax runtime validation for dense/complex objects.
- **Ajv**: JSON Schema (Draft 2020-12) compliance when schemas are language-agnostic or contract-driven.
- **Yup**: legacy ecosystems already standardized on it.

## Verified implementation patterns

```tsx
// TanStack Form: validate onBlur/onSubmit (not premature first-keystroke), wire label + aria-describedby
import { useId } from 'react';
import { z } from 'zod';

const usernameSchema = z.string().min(3, 'Enter at least 3 characters');

<form.Field
  name="username"
  validators={{
    onBlur: usernameSchema,
    onSubmit: usernameSchema,
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: ({ value, fieldApi }) => {
      if (!fieldApi.state.meta.isTouched) return undefined;
      return checkUsernameAvailable(value).then((ok) => (ok ? undefined : 'Username is already taken'));
    },
  }}
>
  {(field) => {
    const inputId = useId();
    const errorId = `${inputId}-error`;
    const showError =
      (field.state.meta.isTouched || form.state.isSubmitted) && field.state.meta.errors.length > 0;
    const errorText = showError
      ? typeof field.state.meta.errors[0] === 'string'
        ? field.state.meta.errors[0]
        : field.state.meta.errors[0]?.message
      : undefined;

    return (
      <div>
        <label htmlFor={inputId}>Username</label>
        <input
          id={inputId}
          name={field.name}
          value={field.state.value}
          autoComplete="username"
          aria-invalid={showError || undefined}
          aria-describedby={errorText ? errorId : undefined}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        {errorText && (
          <p id={errorId} role="alert">
            {errorText}
          </p>
        )}
      </div>
    );
  }}
</form.Field>
```

```tsx
// React Hook Form: preserve record `id` with `keyName` and never use array `index` as key
const { fields } = useFieldArray({ control, name: 'items', keyName: 'key' });
// Render with key={field.key} (RHF v8 uses `field.key` by default; v7 defaults to `field.id`)
```

```ts
// Conform + Zod v4 + Next.js Server Action: single schema validates both client & server
'use server';
import { parseWithZod } from '@conform-to/zod/v4';
import { z } from 'zod';

const profileSchema = z.object({ email: z.email('Enter a valid email address') });

export async function saveProfile(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: profileSchema });
  if (submission.status !== 'success') return submission.reply();
  // persist and redirect or return clean status
}
```

## Multi-step, validation timing, server errors, and draft recovery

- **Inline validation timing ("reward early, punish late")**: do not show red error messages on the first keystroke while a user is still typing a valid value (empirical HCI evidence: Seckler et al., CHI '14). Trigger initial field errors on `onBlur` or submit, only render `role="alert"` after `isTouched` or submission, and clear errors promptly once the field becomes valid.
- **Multi-step wizards**: keep one typed parent schema (or per-step sub-schemas merged on final submit); validate only the active step on `Next`, allow stepping backward without losing values, and mirror step progress in URL/state.
- **Server validation errors**: map field-level backend errors back to their exact field (`setError` in RHF, `submission.reply({ fieldErrors })` in Conform, `setError` in Superforms) and focus the first invalid field or error summary while preserving every entered value.
- **Async validation**: always debounce (`300–500 ms`), cancel stale in-flight checks (`AbortSignal` / request token), and show pending state without blocking unrelated fields.
- **Autosave & draft recovery**: debounce draft writes to `IndexedDB`/Dexie (or `sessionStorage` for tiny non-sensitive drafts), clear the draft on confirmed submit, and offer explicit `Restore draft` / `Discard` when reloading an unfinished form.

## Do/don't pairs

| Do | Don't |
|---|---|
| Gate `role="alert"` on `isTouched \|\| isSubmitted` and bind `aria-describedby` to the error ID | Fire `onChange` errors on keystroke 1 or leave errors unlinked from the input |
| Key `useFieldArray` rows by generated `field.key` / `field.id` (`keyName: 'key'` if records have `id`) | Key repeatable form rows by array `index` (corrupts values on delete/reorder) |
| Match Zod v4 with `z.email()`, `@hookform/resolvers` v5+, and `@conform-to/zod/v4` | Mix Zod v4 schemas into outdated Zod v3 resolver subpaths |
| Share one Standard Schema between client form validation and server action/endpoint | Duplicate regexes manually in client inputs and backend handlers |
| Use `defineField` in VeeValidate v4 to bind `aria-invalid` dynamically from field state | Use deprecated `defineComponentBinds` or omit `aria-invalid` / `aria-describedby` |
| Debounce async validators (`300–500 ms`) and ignore stale responses | Fire an API check on every keystroke without debounce or race protection |
