import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Render repository Markdown without allowing executable HTML or URL schemes.
 * @param {string} source
 */
export function renderSkillMarkdown(source) {
  return sanitizeHtml(marked.parse(source, { async: false }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "input"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      code: ["class"],
      img: ["src", "alt", "width", "height", "loading"],
      input: ["type", "disabled", "checked"],
    },
    // Preserve Marked's read-only task states, never arbitrary form controls.
    exclusiveFilter: ({ tag, attribs }) =>
      tag === "input" &&
      (attribs.type !== "checkbox" || !Object.hasOwn(attribs, "disabled")),
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
  });
}
