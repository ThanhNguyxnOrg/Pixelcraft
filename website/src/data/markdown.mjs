import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Render repository Markdown without allowing executable HTML or URL schemes.
 * @param {string} source
 */
export function renderSkillMarkdown(source) {
  return sanitizeHtml(marked.parse(source, { async: false }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      code: ["class"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
  });
}
