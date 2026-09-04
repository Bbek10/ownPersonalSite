/**
 * hero.js — avatar, name and bio at the top of the page.
 *
 * If `profile.avatar` is null the component draws a monogram tile instead, so
 * the site looks finished before you have an image ready.
 */

import { el } from "../lib/dom.js";
import { initialsOf } from "../lib/format.js";

/**
 * @param {Object} params
 * @param {Object} params.profile
 * @returns {HTMLElement}
 */
export function Hero({ profile }) {
  return el("section", { class: "hero container", "aria-labelledby": "hero-name" }, [
    Avatar(profile),
    el("h1", { class: "hero__name", id: "hero-name", text: profile.name }),
    profile.bio && el("p", { class: "hero__bio", text: profile.bio }),
  ]);
}

/**
 * Avatar tile — a real image when one is configured, a monogram otherwise.
 * Split out because it is the only branch in this component.
 *
 * @param {Object} profile
 * @returns {HTMLElement}
 */
function Avatar(profile) {
  if (profile.avatar) {
    return el("img", {
      class: "hero__avatar",
      src: profile.avatar,
      // Decorative: the name is right underneath in the <h1>.
      alt: "",
      width: 112,
      height: 112,
      loading: "eager",
      decoding: "async",
    });
  }

  return el("div", {
    class: "hero__avatar hero__avatar--monogram",
    "aria-hidden": "true",
    text: profile.initials || initialsOf(profile.name),
  });
}
