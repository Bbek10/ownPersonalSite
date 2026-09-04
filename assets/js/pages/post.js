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
const posts = data.allPosts();
const post = posts.find((entry) => entry.slug === slug);

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

  const nav = PostNav({ posts, slug, base });
  if (nav) mount("[data-mount='post-nav']", nav);

  // One source of truth for the title and description: the data file.
  document.title = `${post.title} · ${data.profile.name}`;
  const description = qs('meta[name="description"]');
  if (description && post.summary) description.setAttribute("content", post.summary);
}
