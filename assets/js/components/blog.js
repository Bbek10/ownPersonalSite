/**
 * blog.js — dated post rows, used in three places:
 *   • the teaser list on the home page          → PostList({ limit })
 *   • the full archive on /blog/                → PostArchive()
 *   • prev/next links at the foot of a post     → PostRow() directly
 *
 * Posts come from `allPosts()` in the data file, which has already sorted them
 * and filled in each `href`.
 */

import { el } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { formatDate, groupBy, isExternal, linkAttrs, take, yearOf } from "../lib/format.js";
import { EmptyState } from "./projects.js";

/**
 * A flat list of post rows.
 *
 * @param {Object} params
 * @param {Array}  params.posts     from allPosts()
 * @param {number} [params.limit]   max rows; omit for all
 * @param {string} [params.locale]
 * @param {string} [params.base]
 * @param {boolean} [params.withSummary]  show the one-line summary under the title
 * @returns {HTMLElement}
 */
export function PostList({ posts = [], limit, locale, base, withSummary = false }) {
  if (posts.length === 0) return EmptyState("No posts yet.");

  return el(
    "ul",
    { class: "stack" },
    take(posts, limit).map((post) =>
      el("li", {}, [PostRow(post, { locale, base, withSummary })]),
    ),
  );
}

/**
 * The full archive, split into a group per year.
 *
 * @param {Object} params  same as PostList
 * @returns {HTMLElement}
 */
export function PostArchive({ posts = [], locale, base }) {
  if (posts.length === 0) return EmptyState("No posts yet.");

  return el(
    "div",
    { class: "archive" },
    groupBy(posts, (post) => yearOf(post.date)).map(([year, group]) =>
      el("section", { class: "archive__year" }, [
        el("h2", { class: "archive__heading", text: year }),
        el(
          "ul",
          { class: "stack" },
          group.map((post) =>
            el("li", {}, [PostRow(post, { locale, base, withSummary: true })]),
          ),
        ),
      ]),
    ),
  );
}

/**
 * One post row: date, title (optionally with its summary), and a cue.
 *
 * @param {Object} post
 * @param {Object} [options]
 * @param {string} [options.locale]
 * @param {string} [options.base]
 * @param {boolean} [options.withSummary]
 * @param {string} [options.label]  overrides the date column (used for prev/next)
 * @returns {HTMLElement}
 */
export function PostRow(post, { locale, base, withSummary = false, label } = {}) {
  return el("a", { class: "row row--post", ...linkAttrs(post.href, base) }, [
    el("div", { class: "row__main" }, [
      label
        ? el("span", { class: "row__date", text: label })
        : // <time> keeps the machine-readable ISO value in the markup while
          // showing the friendly version.
          el("time", {
            class: "row__date",
            datetime: post.date,
            text: formatDate(post.date, locale),
          }),
      el("span", { class: "row__text" }, [
        el("span", { class: "row__title", text: post.title }),
        withSummary && post.summary && el("span", { class: "row__blurb", text: post.summary }),
      ]),
    ]),
    el("span", {
      class: "row__cue",
      html: icon(isExternal(post.href) ? "arrowUpRight" : "chevron", { size: 18 }),
    }),
  ]);
}
