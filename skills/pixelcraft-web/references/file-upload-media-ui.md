# File upload, drag-and-drop media, and client image pipeline UI

File upload is an error-prone, long-running interaction—not a bare `<input type="file">`. Design for **resumable progress, honest validation, keyboard/screen-reader access, clipboard paste, and memory-safe client previews**.

## Tooling decision matrix

| Tool | Best fit | Built-in resumable (tus) / S3 | Primary trade-off |
|---|---|---|---|
| **Uppy** (`@uppy/core`, `@uppy/tus`, `@uppy/aws-s3`, `@uppy/dashboard`) | Production multi-file uploads, large video/PDFs needing pause/resume (`tus`), S3 multipart, webcam/cloud pickers | Yes | Larger bundle if importing full Dashboard + remote plugins; call `uppy.clear()` to reset and `uppy.destroy()` on unmount |
| **FilePond** | Polished single/multi-image uploads with built-in EXIF rotation, crop, resize, and async previews | Via adapter | Plugin licensing/ecosystem smaller than Uppy for cloud pickers |
| **react-dropzone** (or native `<input type="file">`) | Lightweight headless drop zones where you own 100% of upload state and styling | No (bring your own XHR/fetch/tus) | You must implement progress, retry, cancellation, and preview cleanup yourself |
| **File System Access API** (`showOpenFilePicker`, `showSaveFilePicker`) | Desktop-class local file editors (audio/video/code/design tools) | N/A (local disk) | Chromium-first; always feature-detect and fall back to `<input type="file">` + `<a download>` for Safari/Firefox |

## Verified implementation idioms

### Uppy restrictions & lifecycle

- Configure `restrictions` (`maxFileSize`, `maxTotalFileSize`, `maxNumberOfFiles`, `allowedFileTypes`) upfront so users get immediate feedback before uploading gigabytes.
- **Security rule**: Uppy's `allowedFileTypes` uses browser `File.type` and filename extensions—treat it as **client UX guidance only**, never authoritative server validation.
- Call `uppy.clear()` to reset between uploads and `uppy.destroy()` on component unmount (cancels active uploads and removes listeners).

```ts
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

const uppy = new Uppy({
  restrictions: {
    maxFileSize: 50 * 1024 * 1024,
    maxNumberOfFiles: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
}).use(Tus, { endpoint: '/api/uploads/tus' });

// Cleanup on unmount:
// uppy.destroy();
```

### Previews, clipboard paste, and client-side image compression

- **Revoke object URLs**: every `URL.createObjectURL(file)` preview **must** be paired with `URL.revokeObjectURL(url)` on file removal or unmount to prevent multi-hundred-megabyte memory leaks.
- **Clipboard & drag-drop ergonomics**: support `paste` events (`clipboardData.items`) for screenshots in chat/ticket/editor surfaces, highlight the drop target cleanly on `dragenter`/`dragleave` (using a depth counter or `relatedTarget` check so child elements do not flicker), and always keep a real focusable `<button>` / `<input type="file">` trigger for keyboard and screen-reader users (WCAG 2.1.1 & 2.5.7).
- **Client-side resize/compress**: when resizing large camera photos before upload, run `createImageBitmap()` + `OffscreenCanvas.convertToBlob({ type: 'image/webp', quality: 0.85 })` inside a Web Worker so the UI stays responsive.

## Required upload states

Every upload surface must handle: **idle (limits stated upfront)**, **drag-over highlight**, **invalid type/size rejection (specific reason)**, **uploading (per-file progress + cancel)**, **paused/offline (resumable retry)**, **error (retry without re-picking file)**, and **complete (remove/replace action)**.

## Do/don't pairs

| Do | Don't |
|---|---|
| State max file size and accepted formats visibly before selection | Reject a 120 MB upload only after a 3-minute transfer completes |
| Call `URL.revokeObjectURL(url)` when previews unmount or are removed | Leak blob URLs across repeated file selections |
| Keep a keyboard-focusable file picker trigger alongside drag-and-drop | Build a drag-only dropzone unreachable by keyboard or screen readers |
| Use `uppy.clear()` for resets and `uppy.destroy()` on unmount | Leave active upload XHR/tus tasks running after route navigation |
| Enforce authoritative MIME/magic-byte checks on the server | Trust client `allowedFileTypes` or `<input accept>` as security |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify file-picker keyboard activation, invalid-type rejection copy, progress/cancel/retry states, and `revokeObjectURL` cleanup in a real browser (`rendered`).
