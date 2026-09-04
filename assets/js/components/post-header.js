/**
 * post-header.js — the masthead of a single post page (title, date, summary,
 * reading time, tags) and the prev/next block at its foot.
 *
 * Everything except the prose body is derived from the post's entry in
 * site.data.js, so a post page's HTML only ever contains the writing.
 */

import { el } from "../lib/dom.js";
import { formatDate, neighbours, readingMinutes } from "../lib/format.js";
import { PostRow } from "./blog.js";

/**
 * @param {Object} params
 * @param {Object} params.post          the entry from allPosts()
 * @param {string} [params.locale]
 * @param {number} [params.minutes]     reading time; omit to hide it
 * @returns {HTMLElement}
 */
export function PostHeader({ post, locale, minutes }) {
  return el("header", { class: "post__header" }, [
    el("div", { class: "post__meta" }, [
      el("time", { datetime: post.date, text: formatDate(post.date, locale) }),
      minutes && el("span", { class: "post__dot", text: "·", "aria-hidden": "true" }),
      minutes && el("span", { text: `${minutes} min read` }),
    ]),
    el("h1", { class: "post__title", text: post.title }),
    post.summary && el("p", { class: "post__summary", text: post.summary }),
    post.tags?.length &&
      el(
        "ul",
        { class: "card__tags" },
        post.tags.map((tag) => el("li", { class: "tag", text: tag })),
      ),
  ]);
}

/**
 * Prev/next navigation, built from the post's position in the list.
 * Renders nothing when a post has no neighbours (a one-post blog).
 *
 * @param {Object} params
 * @param {Array}  params.posts   from allPosts(), newest first
 * @param {string} params.slug
 * @param {string} [params.base]
 * @returns {HTMLElement|null}
 */
export function PostNav({ posts, slug, base }) {
  const { newer, older } = neighbours(posts, slug);
  if (!newer && !older) return null;

  return el("nav", { class: "post__nav", "aria-label": "More posts" }, [
    newer && PostRow(newer, { base, label: "Newer" }),
    older && PostRow(older, { base, label: "Older" }),
  ]);
}
