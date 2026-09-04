/**
 * footer.js — copyright line, optional note, and small icon links.
 * Shared by every page.
 */

import { el } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { linkAttrs } from "../lib/format.js";

/**
 * @param {Object} params
 * @param {{copyright: string, note?: string, links?: Array}} params.footer
 * @param {string} [params.base]
 * @returns {HTMLElement}
 */
export function Footer({ footer, base }) {
  return el("div", { class: "container site-footer__inner" }, [
    el("p", { class: "site-footer__line", text: footer.copyright }),
    footer.note && el("p", { class: "site-footer__note", text: footer.note }),

    footer.links?.length &&
      el(
        "ul",
        { class: "site-footer__links" },
        footer.links.map((link) =>
          el("li", {}, [
            el(
              "a",
              {
                class: "site-footer__link",
                ...linkAttrs(link.href, base),
                // The icon is decorative, so the accessible name comes from here.
                "aria-label": link.label,
                title: link.label,
              },
              [el("span", { html: icon(link.icon ?? "link", { size: 18 }) })],
            ),
          ]),
        ),
      ),
  ]);
}
