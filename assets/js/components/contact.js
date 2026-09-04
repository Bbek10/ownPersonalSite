/**
 * contact.js — contact rows: label + blurb on the left, icon in a soft well on
 * the right.
 */

import { el } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { linkAttrs } from "../lib/format.js";
import { EmptyState } from "./projects.js";

/**
 * @param {Object} params
 * @param {Array} params.contacts
 * @param {string} [params.base]
 * @returns {HTMLElement}
 */
export function Contact({ contacts = [], base }) {
  if (contacts.length === 0) return EmptyState("No contact links configured.");

  return el(
    "ul",
    { class: "stack" },
    contacts.map((entry) => el("li", {}, [ContactRow(entry, base)])),
  );
}

/**
 * @param {{label: string, blurb?: string, href: string, icon?: string}} entry
 * @param {string} [base]
 * @returns {HTMLElement}
 */
export function ContactRow(entry, base) {
  return el("a", { class: "row row--contact", ...linkAttrs(entry.href, base) }, [
    el("div", { class: "row__main row__main--stacked" }, [
      el("span", { class: "row__title", text: entry.label }),
      entry.blurb && el("span", { class: "row__blurb", text: entry.blurb }),
    ]),
    el("span", { class: "row__well", html: icon(entry.icon ?? "link", { size: 20 }) }),
  ]);
}
