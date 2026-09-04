/**
 * section.js — the wrapper every content section shares: an <h2> heading, an
 * optional "see all" link, and a body.
 *
 * Having one wrapper means heading size, spacing and anchor behaviour are
 * defined once. Sections only have to produce their own body.
 */

import { el } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { linkAttrs } from "../lib/format.js";

/**
 * @param {Object} params
 * @param {string} params.id            anchor target, e.g. "projects"
 * @param {string} params.heading       visible <h2> text
 * @param {{label: string, href: string}} [params.action]  optional top-right link
 * @param {string} [params.base]
 * @param {Node} params.body            the section's content
 * @returns {HTMLElement}
 */
export function Section({ id, heading, action, base, body }) {
  const headingId = `${id}-heading`;

  return el("section", { class: "section container", id, "aria-labelledby": headingId }, [
    el("div", { class: "section__head" }, [
      el("h2", { class: "section__title", id: headingId, text: heading }),
      action &&
        el("a", { class: "section__action", ...linkAttrs(action.href, base) }, [
          el("span", { text: action.label }),
          el("span", { class: "section__action-icon", html: icon("chevron", { size: 16 }) }),
        ]),
    ]),
    body,
  ]);
}
