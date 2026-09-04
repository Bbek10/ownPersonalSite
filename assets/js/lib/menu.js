/**
 * menu.js — the two small behaviours the header needs.
 * ---------------------------------------------------------------------------
 * Kept out of the header component so that component stays a pure "data in,
 * markup out" function. Both functions here return a `stop()` so a caller can
 * tear the behaviour down (useful if you ever re-render the header).
 */

import { qsa } from "./dom.js";

/**
 * Wire up the mobile menu button: toggles a class on the header and keeps
 * `aria-expanded` in sync, closes on Escape, on outside click, and after any
 * nav link is followed.
 *
 * @param {HTMLElement} header  the <header> element
 * @returns {() => void} stop()
 */
export function initMenu(header) {
  const button = header.querySelector("[data-menu-button]");
  const panel = header.querySelector("[data-menu-panel]");
  if (!button || !panel) return () => {};

  const setOpen = (open) => {
    header.classList.toggle("is-menu-open", open);
    button.setAttribute("aria-expanded", String(open));
  };

  const onButtonClick = () => setOpen(!header.classList.contains("is-menu-open"));
  const onKeydown = (event) => {
    if (event.key === "Escape") setOpen(false);
  };
  const onDocumentClick = (event) => {
    if (!header.contains(event.target)) setOpen(false);
  };
  const onPanelClick = (event) => {
    if (event.target.closest("a")) setOpen(false);
  };

  button.addEventListener("click", onButtonClick);
  panel.addEventListener("click", onPanelClick);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onDocumentClick);

  return () => {
    button.removeEventListener("click", onButtonClick);
    panel.removeEventListener("click", onPanelClick);
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onDocumentClick);
  };
}

/**
 * Add `.is-scrolled` to the header once the page has moved off the top, which
 * is what fades in its bottom hairline.
 *
 * Implemented with a sentinel element and an IntersectionObserver instead of a
 * scroll handler: no listener firing on every frame, nothing to throttle.
 *
 * @param {HTMLElement} header
 * @returns {() => void} stop()
 */
export function initStickyBorder(header) {
  // A 1px marker at the very top of the document. While it is visible we are
  // at the top of the page; once it scrolls away, the header is "stuck".
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;";
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting),
    { threshold: 0 },
  );
  observer.observe(sentinel);

  return () => {
    observer.disconnect();
    sentinel.remove();
  };
}

/**
 * Mark the nav link whose section is currently on screen with `.is-active`.
 *
 * Uses IntersectionObserver rather than a scroll handler: the browser does the
 * measuring, so there is nothing to throttle. `rootMargin` shrinks the
 * viewport to a band across the upper-middle of the screen, which is what
 * makes the highlight change at a natural-feeling moment.
 *
 * @param {HTMLElement} header
 * @returns {() => void} stop()
 */
export function initActiveSection(header) {
  // Nav hrefs are rebased ("./#projects", "../../#projects"), so match on the
  // resolved URL: same page, and it has a fragment.
  const links = qsa('a[href*="#"]', header).filter((link) => {
    const url = new URL(link.href, location.href);
    return url.hash.length > 1 && url.pathname === location.pathname;
  });
  if (links.length === 0) return () => {};

  /** Map of section id → the nav links pointing at it. */
  const linksById = new Map();
  const sections = [];

  for (const link of links) {
    const id = new URL(link.href, location.href).hash.slice(1);
    const section = document.getElementById(id);
    if (!section) continue;
    if (!linksById.has(id)) {
      linksById.set(id, []);
      sections.push(section);
    }
    linksById.get(id).push(link);
  }

  if (sections.length === 0) return () => {};

  const setActive = (id) => {
    for (const [sectionId, group] of linksById) {
      for (const link of group) {
        link.classList.toggle("is-active", sectionId === id);
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // Of everything currently intersecting, highlight the topmost one.
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) setActive(visible[0].target.id);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}
