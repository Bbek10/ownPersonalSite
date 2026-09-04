/**
 * site.data.js — ALL editable content lives here.
 * ---------------------------------------------------------------------------
 * This is the file you open to update the site. Nothing in here knows anything
 * about HTML; the components in ../components/ decide how each shape is drawn.
 *
 * HREF CONVENTION: internal links are written site-root-relative ("/blog/",
 * "/#projects"). Each page declares its depth with `data-base` on <html> and
 * lib/format.js rebases them, so the same data works from a domain root, a
 * subpath, or the filesystem. Never write "../.." in this file.
 *
 * The content below is placeholder text about a homelab / home network.
 * Replace it with your own; the structure is what matters.
 */

/** Site-wide settings and the identity block at the top of the home page. */
export const profile = {
  name: "Nodes & Wires",
  /** Small label + dot in the header. Set `status: null` to hide it. */
  status: { label: "Rack is up", tone: "online" },
  /** Shown under the name. Keep it to two or three lines. */
  bio: "Notes from a small homelab: a couple of low-power nodes, too many VLANs, and a habit of self-hosting things that already exist. Mostly here to write down what I broke and how I fixed it.",
  /** Optional. Any square image URL, or null for the generated monogram. */
  avatar: null,
  /** Used for the monogram when `avatar` is null. */
  initials: "NW",
};

/** Links in the sticky header, on every page. */
export const nav = [
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Projects. Each card is one object.
 *
 *  title     — the headline on the card
 *  blurb     — one sentence, no full stop needed
 *  href      — where the card links (omit for a non-clickable card)
 *  cover     — image URL, or null to use the generated gradient placeholder
 *  coverText — the big text drawn on the generated placeholder
 *  tags      — optional short labels
 *  featured  — true makes the card span both grid columns
 */
export const projects = [
  {
    title: "rack.local",
    blurb: "Two mini PCs and a NAS running everything I used to pay for",
    href: "#",
    cover: null,
    coverText: "rack.local",
    tags: ["Proxmox", "ZFS"],
    featured: true,
  },
  {
    title: "netmap",
    blurb: "A one-page diagram of every VLAN, generated from the firewall config",
    href: "#",
    cover: null,
    coverText: "netmap",
    tags: ["OPNsense"],
  },
  {
    title: "quiet-dns",
    blurb: "DNS-over-TLS resolver with per-VLAN blocklists and pretty graphs",
    href: "#",
    cover: null,
    coverText: "quiet-dns",
    tags: ["Unbound"],
  },
  {
    title: "backup-owl",
    blurb: "Nightly restic snapshots that shout at me when a job goes missing",
    href: "#",
    cover: null,
    coverText: "backup-owl",
    tags: ["restic"],
  },
];

/**
 * Blog index.
 * ---------------------------------------------------------------------------
 * One entry per post. This array is the ONLY place a post is registered — the
 * home page teaser list, /blog/, and the prev/next links on a post page all
 * read from it.
 *
 *   slug    — folder name under /blog/. `href` is derived from it.
 *   date    — ISO `YYYY-MM-DD`
 *   title   — shown in lists and as the <h1> on the post page
 *   summary — one line, shown on /blog/ and in the post header
 *   tags    — optional
 *   href    — set it explicitly ONLY for a post hosted elsewhere; an external
 *             URL automatically gets the ↗ cue and opens in a new tab.
 *
 * Adding a post is two steps:
 *   1. copy blog/_template/ to blog/<slug>/ and write the prose
 *   2. add an entry here
 */
export const posts = [
  {
    draft: true, // placeholder — delete this line to publish
    slug: "first-four-vlans",
    date: "2026-08-19",
    title: "Flattening a flat network: my first four VLANs",
    summary:
      "Splitting one trusting /24 into management, trusted, IoT and guest — and the three things that broke immediately",
    tags: ["network"],
  },
  {
    draft: true, // placeholder — delete this line to publish
    slug: "wake-on-lan",
    date: "2026-07-02",
    title: "Wake-on-LAN that actually wakes on LAN",
    summary:
      "Magic packets, a stubborn Realtek NIC, and why the firmware setting matters more than the OS one",
    tags: ["hardware"],
  },
  {
    draft: true, // placeholder — delete this line to publish
    slug: "reverse-proxy",
    date: "2026-05-28",
    title: "Running a reverse proxy without exposing anything",
    summary: "Internal TLS with a private CA, wildcard certs, and split-horizon DNS",
    tags: ["network", "tls"],
  },
  {
    draft: true, // placeholder — delete this line to publish
    slug: "ups-failover",
    date: "2026-04-11",
    title: "Cheap UPS, expensive lesson: testing failover before you need it",
    summary: "What a scheduled power cut taught me about shutdown ordering",
    tags: ["hardware"],
  },
  {
    draft: true, // placeholder — delete this line to publish
    slug: "idle-watts",
    date: "2026-02-23",
    title: "Measuring idle watts on three second-hand mini PCs",
    summary: "A month of readings, and the machine that quietly cost the most",
    tags: ["power"],
  },
];

/**
 * Contact rows.
 *  icon — a key from lib/icons.js: mail | chat | code | rss | link | coffee | server
 */
export const contacts = [
  {
    label: "Email",
    blurb: "Best for long questions",
    href: "mailto:hello@example.com",
    icon: "mail",
  },
  { label: "Chat", blurb: "Short questions and homelab show-and-tell", href: "#", icon: "chat" },
  { label: "Code", blurb: "Configs, scripts and dotfiles", href: "#", icon: "code" },
  { label: "Feed", blurb: "Subscribe to new posts", href: "/feed.xml", icon: "rss" },
];

/** Footer, shown on every page. `links` render as small icon buttons. */
export const footer = {
  copyright: `© ${new Date().getFullYear()} ${profile.name}`,
  note: "Built by hand. No trackers, no cookies.",
  links: [
    { label: "Source", href: "#", icon: "code" },
    { label: "RSS", href: "/feed.xml", icon: "rss" },
  ],
};

/**
 * Home page composition.
 * ---------------------------------------------------------------------------
 * `layout` is the order the home page's sections render in. Each entry names a
 * component registered in ../pages/home.js. Delete a line to remove a section;
 * move a line to move it. `id` becomes the anchor target used by `nav` above.
 */
export const layout = [
  { component: "hero" },
  { component: "projects", id: "projects", heading: "Projects" },
  {
    component: "blog",
    id: "blog",
    heading: "Blog",
    limit: 4,
    action: { label: "All posts", href: "/blog/" },
  },
  { component: "contact", id: "contact", heading: "Contact" },
];

/** Behaviour flags — small switches that don't deserve their own file. */
export const settings = {
  /**
   * Public URL of the site, no trailing slash. Only used to build absolute
   * links in feed.xml (`node tools/build-feed.mjs`); nothing in the browser
   * reads it, so the site works before you have a domain.
   */
  siteUrl: "https://bbek10.github.io/ownPersonalSite",
  /** One line describing the site, used in the feed's channel description. */
  description: "Homelab hardware, self-hosted services and home networking.",
  /** Sort `posts` newest-first at runtime instead of trusting the array order. */
  sortPostsByDate: true,
  /** Locale used to format post dates. */
  dateLocale: "en-GB",
  /** Highlight the nav link for the section currently on screen. */
  highlightActiveNav: true,
  /** Show an estimated reading time in each post's header. */
  showReadingTime: true,
};

/**
 * Every post with its `href` filled in, newest first.
 * Derived once here so no component has to remember the URL shape.
 *
 * DRAFTS: an entry with `draft: true` is left out of every list and out of
 * feed.xml. Its page still works if you open the URL directly (it shows a
 * "Draft" badge and asks robots not to index it), which is what makes it
 * useful for previewing a post before it goes live. Delete the `draft` line
 * to publish.
 *
 * @param {Object} [options]
 * @param {boolean} [options.includeDrafts=false]
 * @returns {Array}
 */
export function allPosts({ includeDrafts = false } = {}) {
  const visible = includeDrafts ? posts : posts.filter((post) => !post.draft);

  const ordered = settings.sortPostsByDate
    ? [...visible].sort((a, b) => new Date(b.date) - new Date(a.date))
    : visible;

  return ordered.map((post) => ({
    ...post,
    href: post.href ?? `/blog/${post.slug}/`,
  }));
}

/** One default export so a page can `import site from '../data/site.data.js'`. */
export default {
  profile,
  nav,
  projects,
  posts,
  contacts,
  footer,
  layout,
  settings,
  allPosts,
};
