#!/usr/bin/env node
/**
 * build-feed.mjs — generate feed.xml from the post registry.
 * ---------------------------------------------------------------------------
 * Usage:  node tools/build-feed.mjs
 *
 * Reads `posts`, `profile` and `settings` straight out of site.data.js — the
 * same file the pages use — so the feed can never drift from the site. Run it
 * after adding a post and commit the result; there is no server involved.
 *
 * Set `settings.siteUrl` before the first run: a feed needs absolute URLs.
 */

import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import site from "../assets/js/data/site.data.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Escape the five characters that are not safe as XML text. */
const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** RFC 822 date, which is what RSS wants (ISO 8601 is not valid here). */
const rfc822 = (iso) => new Date(iso).toUTCString();

/**
 * Absolute URL for a post: an entry with its own `href` is hosted elsewhere
 * and keeps that URL; everything else lives under /blog/<slug>/.
 */
const urlFor = (post, base) =>
  /^https?:\/\//i.test(post.href ?? "") ? post.href : `${base}/blog/${post.slug}/`;

function buildFeed() {
  const { profile, settings } = site;
  const base = settings.siteUrl.replace(/\/$/, "");
  const posts = site.allPosts();

  const items = posts
    .map((post) => {
      const url = urlFor(post, base);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(profile.name)}</title>
    <link>${escapeXml(base)}/</link>
    <description>${escapeXml(settings.description ?? profile.bio ?? "")}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(posts[0]?.date ?? new Date())}</lastBuildDate>
    <atom:link href="${escapeXml(base)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

const out = resolve(ROOT, "feed.xml");
await writeFile(out, buildFeed(), "utf8");
console.log(`✓ wrote feed.xml (${site.allPosts().length} posts)`);
if (site.settings.siteUrl.includes("example.com")) {
  console.warn("! settings.siteUrl is still the placeholder — set it before publishing.");
}
