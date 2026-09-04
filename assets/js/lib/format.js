/**
 * format.js — small pure helpers for turning data into display strings.
 * No DOM access: every function here is trivially testable on its own.
 */

/**
 * Format an ISO date (`YYYY-MM-DD`) for display, e.g. "19 Aug 2026".
 * Returns the input untouched if it isn't a parseable date, so a typo in the
 * data file degrades to visible text instead of "Invalid Date".
 *
 * @param {string} iso
 * @param {string} [locale="en-GB"]
 * @returns {string}
 */
export function formatDate(iso, locale = "en-GB") {
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return String(iso ?? "");

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // pin to UTC so the date never shifts by a day
  }).format(date);
}

/** The year of an ISO date, as a string. Used to group the blog archive. */
export function yearOf(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.valueOf()) ? "—" : String(date.getUTCFullYear());
}

/* ==========================================================================
   Links
   --------------------------------------------------------------------------
   Every href in site.data.js is written SITE-ROOT-RELATIVE ("/blog/", "/#projects").
   Each page declares how deep it sits via `data-base` on <html>:

     /index.html              → data-base="./"
     /blog/index.html         → data-base="../"
     /blog/some-post/index.html → data-base="../../"

   resolveHref() rewrites "/x" to "<base>x", which means the whole site works
   unchanged from a domain root, from a subpath (GitHub Pages project sites),
   and straight off the filesystem. Nothing has to be configured per host.
   ========================================================================== */

/**
 * Resolve a data-file href against the current page's base.
 *
 * @param {string} href
 * @param {string} [base="./"]
 * @returns {string}
 */
export function resolveHref(href, base = "./") {
  if (!href) return href;
  // Absolute URLs and non-http schemes (mailto:, tel:) pass through untouched.
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return href;
  // Site-root-relative → rebase.
  if (href.startsWith("/")) return base + href.slice(1);
  // Bare fragments and already-relative paths are left alone.
  return href;
}

/**
 * Is this link leaving the site? Decides the ↗ cue and target/rel attributes.
 *
 * @param {string} href
 * @returns {boolean}
 */
export function isExternal(href) {
  if (!href) return false;
  if (!/^https?:\/\//i.test(href)) return false;
  if (typeof location === "undefined") return true;
  try {
    return new URL(href).host !== location.host;
  } catch {
    return false;
  }
}

/**
 * Build the attributes an anchor needs.
 * `rel="noopener"` is not optional on target="_blank" links — without it the
 * opened page can reach back through window.opener.
 *
 * @param {string} href
 * @param {string} [base]
 * @returns {{href: string, target?: string, rel?: string}}
 */
export function linkAttrs(href, base) {
  const attrs = { href: resolveHref(href, base) };
  if (isExternal(href)) {
    attrs.target = "_blank";
    attrs.rel = "noopener noreferrer";
  }
  return attrs;
}

/* ==========================================================================
   Collections
   ========================================================================== */

/**
 * Sort a list of `{ date }` objects newest first, without mutating the input.
 *
 * @template {{date: string}} T
 * @param {T[]} items
 * @returns {T[]}
 */
export function byNewest(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Take the first `n` items. `n = 0` or undefined means "all of them", which is
 * why `limit` can simply be left out of a layout entry.
 *
 * @template T
 * @param {T[]} items
 * @param {number} [n]
 * @returns {T[]}
 */
export function take(items, n) {
  return n ? items.slice(0, n) : items;
}

/**
 * Group items into `[key, items[]]` pairs, preserving the input order within
 * each group. Used to split the blog archive by year.
 *
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string} keyOf
 * @returns {[string, T[]][]}
 */
export function groupBy(items, keyOf) {
  const groups = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()];
}

/**
 * Find the entries either side of `slug` in a list, for prev/next post links.
 * The list is expected to be in display order (newest first), so "previous"
 * means the newer post.
 *
 * @template {{slug?: string}} T
 * @param {T[]} items
 * @param {string} slug
 * @returns {{current: T|null, newer: T|null, older: T|null}}
 */
export function neighbours(items, slug) {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { current: null, newer: null, older: null };
  return {
    current: items[index],
    newer: items[index - 1] ?? null,
    older: items[index + 1] ?? null,
  };
}

/* ==========================================================================
   Text
   ========================================================================== */

/**
 * Derive up to two initials from a name, for the fallback avatar monogram.
 *
 * @param {string} name
 * @returns {string}
 */
export function initialsOf(name = "") {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Rough reading time in minutes, at 200 words per minute, floored at 1.
 * Called with the post body's text content, so it stays accurate as you edit
 * a post without anything to update by hand.
 *
 * @param {string} text
 * @returns {number}
 */
export function readingMinutes(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Turn a string into a stable hue (0–359), so each generated project cover
 * gets its own colour with nothing to configure.
 *
 * @param {string} input
 * @returns {number}
 */
export function hueFrom(input = "") {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 360;
  }
  return hash;
}
