#!/usr/bin/env node
/**
 * new-post.mjs — scaffold a new post.
 * ---------------------------------------------------------------------------
 * Usage:
 *   node tools/new-post.mjs "Flattening a flat network: my first four VLANs"
 *   node tools/new-post.mjs "A title" --slug custom-slug --date 2026-09-01
 *
 * What it does:
 *   1. copies blog/_template/ to blog/<slug>/
 *   2. sets data-post="<slug>" and the <title> in the copy
 *   3. prints the entry to paste into `posts` in assets/js/data/site.data.js
 *
 * It deliberately does NOT edit the data file itself. Rewriting source with a
 * script is how you end up with mangled comments; pasting five lines is
 * cheaper than debugging that.
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Turn a title into a URL-safe slug.
 *
 * @param {string} title
 * @returns {string}
 */
function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD") // split accents off their letters
    .replace(/[̀-ͯ]/g, "") // …and drop them
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Today as `YYYY-MM-DD`, in UTC to match how dates are stored. */
const today = () => new Date().toISOString().slice(0, 10);

/**
 * Read `--flag value` pairs out of argv.
 *
 * @param {string[]} argv
 * @returns {{title: string, flags: Record<string, string>}}
 */
function parseArgs(argv) {
  const flags = {};
  const rest = [];

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      flags[argv[i].slice(2)] = argv[i + 1];
      i += 1;
    } else {
      rest.push(argv[i]);
    }
  }

  return { title: rest.join(" "), flags };
}

/** True if the path already exists. */
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const { title, flags } = parseArgs(process.argv.slice(2));

  if (!title) {
    console.error('Usage: node tools/new-post.mjs "Post title" [--slug x] [--date YYYY-MM-DD]');
    process.exitCode = 1;
    return;
  }

  const slug = flags.slug ?? slugify(title);
  const date = flags.date ?? today();
  const dir = resolve(ROOT, "blog", slug);

  if (await exists(dir)) {
    console.error(`✗ blog/${slug}/ already exists — pick another slug.`);
    process.exitCode = 1;
    return;
  }

  const template = await readFile(resolve(ROOT, "blog/_template/index.html"), "utf8");

  const page = template
    .replace('data-post="REPLACE-WITH-SLUG"', `data-post="${slug}"`)
    // Strip the template's explanatory comment from the real post.
    .replace(/<!--\s*\n\s*POST TEMPLATE[\s\S]*?-->\n/, "")
    .replace(
      /<title>.*?<\/title>/,
      `<title>${title.replace(/&/g, "&amp;").replace(/</g, "&lt;")} · Nodes &amp; Wires</title>`,
    );

  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), page, "utf8");

  console.log(`✓ created blog/${slug}/index.html\n`);
  console.log("Now add this to `posts` in assets/js/data/site.data.js:\n");
  console.log(`  {
    slug: "${slug}",
    date: "${date}",
    title: ${JSON.stringify(title)},
    summary: "",
    tags: [],
  },`);
}

main().catch((error) => {
  console.error("✗ failed:", error.message);
  process.exitCode = 1;
});
