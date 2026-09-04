/**
 * pages/post.js — entry point for every `/blog/<slug>/index.html`.
 * ---------------------------------------------------------------------------
 * A post page's HTML contains only the writing. This module supplies
 * everything around it, looked up from the post's entry in site.data.js:
 *
 *   • the header — title, date, summary, tags, reading time
 *   • the prev/next links at the foot
 *   • the <title> and meta description
 *
 * The page identifies itself with `data-post="<slug>"` on the <article>. If
 * that slug isn't in the data file, the page says so in place of the header
 * rather than failing silently — which is exactly the reminder you want when
 * you've copied the template and not yet registered the post.
 */

import { initShell } from "../app.js";
import { mount, qs } from "../lib/dom.js";
import { readingMinutes } from "../lib/format.js";
import { PostHeader, PostNav } from "../components/post-header.js";
import { EmptyState } from "../components/projects.js";

const { data, base } = initShell();

const article = qs("[data-post]");
const slug = article?.dataset.post;

// Two lists, deliberately: a draft's own page must still render (that is the
// point of a draft), but prev/next may only ever walk published posts.
const published = data.allPosts();
const post = data.allPosts({ includeDrafts: true }).find((entry) => entry.slug === slug);

if (!post) {
  console.warn(`[post] "${slug}" is not registered in site.data.js`);
  mount(
    "[data-mount='post-header']",
    EmptyState(`This post ("${slug}") isn't listed in site.data.js yet.`),
  );
} else {
  // Reading time is measured from the prose actually on the page, so it stays
  // right as you edit without anything to update by hand.
  const minutes = data.settings.showReadingTime
    ? readingMinutes(qs(".prose")?.textContent ?? "")
    : null;

  mount(
    "[data-mount='post-header']",
    PostHeader({ post, locale: data.settings.dateLocale, minutes }),
  );

  // A draft has no place in the published sequence, so it gets no prev/next.
  const nav = post.draft ? null : PostNav({ posts: published, slug, base });
  if (nav) mount("[data-mount='post-nav']", nav);

  // One source of truth for the title and description: the data file.
  document.title = `${post.draft ? "[Draft] " : ""}${post.title} · ${data.profile.name}`;
  const description = qs('meta[name="description"]');
  if (description && post.summary) description.setAttribute("content", post.summary);

  // Ask search engines to leave an unpublished post alone. Anyone with the URL
  // can still read it — this is a "not finished", not a secret.
  if (post.draft) {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.append(robots);
  }
}
