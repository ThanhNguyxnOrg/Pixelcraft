// Files in public/ are served under the deploy base (/Pixelcraft/ on GitHub Pages), not the domain root.
export const publicUrl = (path: string) =>
  import.meta.env.BASE_URL + path.replace(/^\/+/, "");
