/**
 * header.js — the sticky top bar, shared by every page: status pill on the
 * left, nav on the right, collapsing into a dropdown panel on narrow screens.
 *
 * Pure: takes data, returns a detached node. Behaviour is attached separately
 * by app.js via lib/menu.js.
 */

import { el } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { linkAttrs } from "../lib/format.js";

/**
 * @param {Object} params
 * @param {Object} params.profile  see site.data.js
 * @param {Array}  params.nav      [{ label, href }]
 * @param {string} [params.base]   page depth prefix, e.g. "../../"
 * @returns {HTMLElement}
 */
export function Header({ profile, nav = [], base }) {
  /** Fresh nodes each call: an element can only live in one place in the DOM. */
  const navLinks = () =>
    nav.map((item) =>
      el("a", { class: "site-nav__link", ...linkAttrs(item.href, base), text: item.label }),
    );

  return el("div", { class: "container site-header__inner" }, [
    // ── Left: status pill (or just the name if `status` is null). Always
    //    links home, which is the behaviour people expect of a masthead. ──
    el("a", { class: "site-header__brand", ...linkAttrs("/", base) }, [
      profile.status &&
        el("span", {
          class: `status-dot status-dot--${profile.status.tone ?? "online"}`,
          "aria-hidden": "true",
        }),
      el("span", {
        class: "site-header__brand-text",
        text: profile.status?.label ?? profile.name,
      }),
    ]),

    // ── Right: the same links twice — once inline for wide screens, once in
    //    the dropdown panel for narrow ones. Duplicating the markup is far
    //    less fragile than moving nodes between containers on resize; CSS
    //    shows exactly one of them at a time. ─────────────────────────────
    el("nav", { class: "site-nav", "aria-label": "Main" }, [
      el("div", { class: "site-nav__inline" }, navLinks()),

      el(
        "button",
        {
          class: "site-nav__toggle",
          type: "button",
          "aria-expanded": "false",
          "aria-controls": "menu-panel",
          "aria-label": "Menu",
          dataset: { menuButton: "" },
        },
        [
          el("span", { class: "site-nav__toggle-icon", html: icon("menu") }),
          el("span", {
            class: "site-nav__toggle-icon site-nav__toggle-icon--close",
            html: icon("close"),
          }),
        ],
      ),

      el(
        "div",
        { class: "site-nav__panel", id: "menu-panel", dataset: { menuPanel: "" } },
        navLinks(),
      ),
    ]),
  ]);
}
