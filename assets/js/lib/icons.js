/**
 * icons.js — inline SVG icons.
 * ---------------------------------------------------------------------------
 * Hand-drawn, generic shapes on a 24×24 grid with a 1.7px stroke. Keeping them
 * inline means no icon font, no sprite sheet and no network request, and they
 * inherit `currentColor` so they always match their surrounding text.
 *
 * To add one: draw it on the same 24×24 grid, add it to ICON_PATHS, then refer
 * to it by key from site.data.js.
 */

/** Every icon body, minus the wrapping <svg> element. */
const ICON_PATHS = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  chat: '<path d="M20 15a2.5 2.5 0 0 1-2.5 2.5H9L4.5 21V6.5A2.5 2.5 0 0 1 7 4h10.5A2.5 2.5 0 0 1 20 6.5z"/>',
  code: '<path d="m9 8-5 4 5 4"/><path d="m15 8 5 4-5 4"/>',
  rss: '<path d="M5 12a7 7 0 0 1 7 7"/><path d="M5 6a13 13 0 0 1 13 13"/><circle cx="5.6" cy="18.4" r="1.4" fill="currentColor" stroke="none"/>',
  link: '<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.3 1.3"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
  coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  /** Row affordances. */
  chevron: '<path d="m9.5 6 6 6-6 6"/>',
  arrowUpRight: '<path d="M8 16 16 8"/><path d="M9.5 8H16v6.5"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  close: '<path d="m6 6 12 12"/><path d="m18 6-12 12"/>',
};

/**
 * Return an icon as an SVG markup string.
 * Unknown keys return an empty string rather than throwing — a missing icon
 * should never take the page down.
 *
 * @param {keyof typeof ICON_PATHS} name
 * @param {Object} [options]
 * @param {number} [options.size=20]
 * @param {string} [options.className="icon"]
 * @returns {string} SVG markup, safe to pass to `el(..., { html })`
 */
export function icon(name, { size = 20, className = "icon" } = {}) {
  const body = ICON_PATHS[name];
  if (!body) {
    console.warn(`[icons] unknown icon: ${name}`);
    return "";
  }

  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** The list of valid icon keys — handy when validating the data file. */
export const iconNames = Object.keys(ICON_PATHS);
