/**
 * pages/home.js — entry point for `/index.html`.
 * ---------------------------------------------------------------------------
 * Builds the sections named in `layout` (site.data.js) and mounts them.
 *
 * To add a section: write a component that returns a Node, register it in
 * SECTION_COMPONENTS below, then add an entry to `layout`.
 */

import { initShell } from "../app.js";
import { el, mount } from "../lib/dom.js";
import { Hero } from "../components/hero.js";
import { Section } from "../components/section.js";
import { Projects } from "../components/projects.js";
import { PostList } from "../components/blog.js";
import { Contact } from "../components/contact.js";

/**
 * Registry: layout `component` name → builder.
 * Each builder gets `(entry, context)` where `entry` is the layout object (so
 * it can carry per-section options such as `limit`) and `context` is
 * `{ data, base }`. Each returns a Node.
 *
 * `hero` is the one section without the Section chrome — it has its own
 * heading treatment.
 */
const SECTION_COMPONENTS = {
  hero: (_entry, { data }) => Hero({ profile: data.profile }),

  projects: (entry, { data, base }) =>
    Section({
      ...entry,
      base,
      body: Projects({ projects: data.projects, base }),
    }),

  blog: (entry, { data, base }) =>
    Section({
      ...entry,
      base,
      body: PostList({
        posts: data.allPosts(),
        limit: entry.limit,
        locale: data.settings.dateLocale,
        base,
      }),
    }),

  contact: (entry, { data, base }) =>
    Section({
      ...entry,
      base,
      body: Contact({ contacts: data.contacts, base }),
    }),
};

/**
 * Build every section named in `layout`, skipping (with a warning) any entry
 * whose component isn't registered — a typo should never blank the page.
 *
 * @param {{data: Object, base: string}} context
 * @returns {DocumentFragment}
 */
function buildSections(context) {
  const fragment = document.createDocumentFragment();

  for (const entry of context.data.layout) {
    const build = SECTION_COMPONENTS[entry.component];
    if (!build) {
      console.warn(`[home] unknown section component: "${entry.component}"`);
      continue;
    }
    fragment.append(build(entry, context));
  }

  return fragment;
}

// ── Render ────────────────────────────────────────────────────────────────
const context = initShell();
mount("[data-mount='sections']", el("div", { class: "sections" }, [buildSections(context)]));
