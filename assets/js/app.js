/**
 * app.js — the shell shared by every page.
 * ---------------------------------------------------------------------------
 * Each page's entry module (pages/*.js) calls `initShell()` first to get the
 * header, footer and header behaviours, then renders its own body.
 *
 * The one piece of per-page state is `base`: how deep this page sits below the
 * site root. It is declared once in the page's HTML —
 *
 *     <html lang="en" data-base="../../">
 *
 * — and everything that builds a link reads it from here, so no component ever
 * has to know where it is being rendered.
 */

import site from "./data/site.data.js";
import { mount } from "./lib/dom.js";
import { initActiveSection, initMenu, initStickyBorder } from "./lib/menu.js";
import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";

/**
 * Read this page's base prefix from <html data-base>. Defaults to "./" so a
 * page that forgets the attribute still works from the site root.
 *
 * @returns {string}
 */
export function getBase() {
  return document.documentElement.dataset.base || "./";
}

/**
 * Render the header and footer and attach the header behaviours.
 *
 * @param {Object} [options]
 * @param {Object} [options.data=site]
 * @returns {{base: string, data: Object, teardown: () => void}}
 */
export function initShell({ data = site } = {}) {
  const base = getBase();

  const headerHost = mount(
    "[data-mount='header']",
    Header({ profile: data.profile, nav: data.nav, base }),
  );
  mount("[data-mount='footer']", Footer({ footer: data.footer, base }));

  // Behaviours return teardown functions; collect them so a caller can detach.
  const stops = [];
  if (headerHost) {
    const header = headerHost.closest("header") ?? headerHost;
    stops.push(initMenu(header));
    stops.push(initStickyBorder(header));
    // Only the home page has in-page sections to track.
    if (data.settings?.highlightActiveNav) stops.push(initActiveSection(header));
  }

  return {
    base,
    data,
    teardown: () => {
      while (stops.length) stops.pop()();
    },
  };
}
