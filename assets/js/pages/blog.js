/**
 * pages/blog.js — entry point for `/blog/index.html`.
 * Renders the full archive, grouped by year.
 */

import { initShell } from "../app.js";
import { mount } from "../lib/dom.js";
import { PostArchive } from "../components/blog.js";

const { data, base } = initShell();

mount(
  "[data-mount='archive']",
  PostArchive({
    posts: data.allPosts(),
    locale: data.settings.dateLocale,
    base,
  }),
);
