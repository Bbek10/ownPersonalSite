# Nodes & Wires

A small, static, light-themed personal site: home page, blog archive, and one
page per post. No frameworks, no build step, no dependencies, no tracking.

All code, styling and copy here is original. The placeholder content is about a
homelab — swap it for your own.

---

## Run it

ES modules must be served over http, not opened from disk:

```bash
python3 -m http.server 8000     # then http://localhost:8000
# or: npx serve .
```

## Deploy it

There is nothing to build — publish the folder as-is. GitHub Pages, Netlify,
Cloudflare Pages and any static host all work, at a domain root or in a
subpath, with no configuration. `404.html` is picked up automatically by most
of them.

---

## Pages

```
/                     home — hero, projects, latest posts, contact
/blog/                every post, grouped by year
/blog/<slug>/         one post
/blog/_template/      copy this to start a new post
/404.html             unknown paths
```

### Adding a post

```bash
node tools/new-post.mjs "Your post title"
```

That copies the template to `blog/<slug>/`, wires up the slug, and prints a
five-line entry to paste into `posts` in `assets/js/data/site.data.js`. Write
the prose inside `<div class="prose">` — everything else on the page (title,
date, summary, tags, reading time, prev/next links) is generated from that data
entry. Doing it by hand instead of with the script is just those two steps in
the other order.

A post hosted somewhere else needs no page at all: give its entry an `href` and
it renders as an external link, ↗ cue and all.

---

## The one file you'll actually edit

**`assets/js/data/site.data.js`** holds every piece of content:

| Export      | What it controls                                                     |
| ----------- | -------------------------------------------------------------------- |
| `profile`   | name, status pill, bio, avatar (or the generated monogram)           |
| `nav`       | header links, on every page                                          |
| `projects`  | project cards — title, blurb, link, cover, tags, `featured`          |
| `posts`     | the post registry — slug, date, title, summary, tags                 |
| `contacts`  | contact rows — label, blurb, link, icon key                          |
| `footer`    | copyright, note, icon links                                          |
| `layout`    | **which home-page sections render, and in what order**               |
| `settings`  | date locale, post sorting, active-nav highlight, reading time on/off |

---

## Structure

```
index.html                     landmarks + mount points
blog/…                         one folder per post
404.html
assets/
  css/
    main.css                   entry point; @imports everything below
    tokens.css                 ← all colours, sizes, spacing, motion
    base.css                   reset + bare element defaults
    layout.css                 page shell, column width, grids
    components/                one file per component, named like the JS
  js/
    app.js                     shared shell: header, footer, behaviours
    pages/home.js              ← entry for /
    pages/blog.js              ← entry for /blog/
    pages/post.js              ← entry for every post page
    data/site.data.js          ← all content
    lib/
      dom.js                   el() / mount() — the whole "framework", ~60 lines
      format.js                dates, links, grouping, reading time (all pure)
      icons.js                 inline SVG icon set
      menu.js                  mobile menu, sticky border, active-nav highlight
    components/                header, hero, section, projects, blog, contact,
                               post-header, footer
tools/new-post.mjs             post scaffolder
```

### The three rules that keep it maintainable

1. **Components are pure.** Each takes data and returns a detached DOM node.
   They never query the document, never mutate global state, never reach into
   each other. Only `app.js` and the page entries touch the real page.
2. **Every visual value is a token.** Component CSS only ever references
   `var(--…)` from `tokens.css`. Change the palette in one place.
3. **Links are written site-root-relative.** In the data file you write
   `/blog/`, never `../../blog/`. Each page declares its depth once —
   `<html data-base="../../">` — and `resolveHref()` rebases every link. This
   is why the same files work at a domain root, in a GitHub Pages subpath, and
   straight off the filesystem.

---

## Common edits

**Restyle everything** — `assets/css/tokens.css`. Start with `--c-accent` and
`--c-bg`; the rest derives from them.

**Add a project card** — append to `projects`. Leave `cover: null` and a
gradient plate is generated from a hash of the title, so a card looks
intentional before you have artwork.

**Add a home-page section** — write `assets/js/components/thing.js` returning a
node, add `assets/css/components/thing.css` (plus an `@import` in `main.css`),
register it in `SECTION_COMPONENTS` in `pages/home.js`, then add an entry to
`layout`.

**Add an icon** — draw it on a 24×24 grid, add the path to `ICON_PATHS` in
`lib/icons.js`, refer to it by key from the data file.

**Use a real avatar** — set `profile.avatar` to an image URL or a local path.

---

## Notes

- External links get `target="_blank"` + `rel="noopener noreferrer"` and a ↗
  cue automatically; internal ones get a chevron. `lib/format.js` decides.
- Reading time is measured from the prose on the page, so it stays correct as
  you edit.
- `prefers-reduced-motion` is respected; scroll effects use
  `IntersectionObserver`, so there are no scroll listeners to throttle.
- Failures degrade rather than blanking the page: an unknown section name, an
  unknown icon key, or a post page whose slug isn't registered all log a
  warning and keep rendering.
- Post pages need JavaScript for their header and navigation; the prose itself
  is plain HTML in the file, so it is readable and indexable either way.
