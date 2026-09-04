/**
 * projects.js — the project grid and the card inside it.
 *
 * A card with an `href` renders as an <a> (the whole card is clickable); one
 * without renders as an <article>. That choice is made once, in `cardTag`.
 */

import { el } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { hueFrom, isExternal, linkAttrs } from "../lib/format.js";

/**
 * @param {Object} params
 * @param {Array} params.projects
 * @param {string} [params.base]
 * @returns {HTMLElement} the grid (pass it to Section as `body`)
 */
export function Projects({ projects = [], base }) {
  if (projects.length === 0) return EmptyState("No projects listed yet.");
  return el(
    "div",
    { class: "grid-cards" },
    projects.map((project) => ProjectCard(project, base)),
  );
}

/**
 * A single project card.
 *
 * @param {Object} project  see the `projects` docs in site.data.js
 * @param {string} [base]
 * @returns {HTMLElement}
 */
export function ProjectCard(project, base) {
  const { tag, attrs } = cardTag(project.href, base);

  return el(tag, { class: `card${project.featured ? " is-featured" : ""}`, ...attrs }, [
    Cover(project),
    el("div", { class: "card__body" }, [
      el("div", { class: "card__title-row" }, [
        el("h3", { class: "card__title", text: project.title }),
        project.href &&
          el("span", {
            class: "card__cue",
            html: icon(isExternal(project.href) ? "arrowUpRight" : "chevron", { size: 16 }),
          }),
      ]),
      project.blurb && el("p", { class: "card__blurb", text: project.blurb }),
      project.tags?.length &&
        el(
          "ul",
          { class: "card__tags" },
          project.tags.map((tagText) => el("li", { class: "tag", text: tagText })),
        ),
    ]),
  ]);
}

/**
 * Decide the element and attributes for the card wrapper.
 * Pure helper, so the branch is testable and the component body stays flat.
 *
 * @param {string|undefined} href
 * @param {string} [base]
 * @returns {{tag: string, attrs: Object}}
 */
function cardTag(href, base) {
  return href ? { tag: "a", attrs: linkAttrs(href, base) } : { tag: "article", attrs: {} };
}

/**
 * Cover image, or a generated gradient plate with the project name on it.
 * The hue is derived from the title, so every card gets a distinct but stable
 * colour with nothing to configure.
 *
 * @param {Object} project
 * @returns {HTMLElement}
 */
function Cover(project) {
  if (project.cover) {
    return el("div", { class: "card__cover" }, [
      el("img", { src: project.cover, alt: "", loading: "lazy", decoding: "async" }),
    ]);
  }

  return el(
    "div",
    {
      class: "card__cover card__cover--generated",
      "aria-hidden": "true",
      // Inline custom property only: the CSS still owns the gradient itself.
      style: `--cover-hue: ${hueFrom(project.title ?? "")}`,
    },
    [el("span", { class: "card__cover-text", text: project.coverText ?? project.title })],
  );
}

/**
 * Shared "nothing here" message, so every list renders empty the same way.
 *
 * @param {string} message
 * @returns {HTMLElement}
 */
export function EmptyState(message) {
  return el("p", { class: "empty-state", text: message });
}
