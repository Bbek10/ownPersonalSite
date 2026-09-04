/**
 * dom.js — the entire "framework" used by this site, in about 60 lines.
 * ---------------------------------------------------------------------------
 * Every function here is pure and side-effect free except `mount`, which is
 * the single place the real document is touched. Components build detached
 * DOM trees with `el()` and return them; main.js mounts them.
 */

/**
 * Create an element.
 *
 * @param {string} tag                     e.g. "a", "section", "h2"
 * @param {Object} [props]                 attributes and special keys:
 *        class      → className
 *        text       → textContent (safe: never parsed as HTML)
 *        html       → innerHTML (only pass strings YOU authored, e.g. icons)
 *        dataset    → object of data-* attributes
 *        on         → object of event handlers, { click: fn }
 *        anything else → setAttribute(key, value)
 *        A null/undefined/false value skips the attribute entirely, which
 *        makes optional attributes read nicely at the call site.
 * @param {(Node|string|null|false)[]} [children]
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    switch (key) {
      case "class":
        node.className = value;
        break;
      case "text":
        node.textContent = value;
        break;
      case "html":
        node.innerHTML = value;
        break;
      case "dataset":
        Object.assign(node.dataset, value);
        break;
      case "on":
        for (const [event, handler] of Object.entries(value)) {
          node.addEventListener(event, handler);
        }
        break;
      default:
        node.setAttribute(key, value === true ? "" : String(value));
    }
  }

  appendAll(node, children);
  return node;
}

/**
 * Append children, flattening arrays and skipping empty values so callers can
 * write `[maybeThing && el(...), ...list]` without guards.
 *
 * @param {Node} parent
 * @param {(Node|string|null|false|Array)[]} children
 */
export function appendAll(parent, children) {
  for (const child of [children].flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/**
 * Replace the contents of a mount point with a node.
 * The one impure function in this module.
 *
 * @param {string|Element} target  CSS selector or element
 * @param {Node} node
 * @returns {Element|null} the mount point, or null if it wasn't found
 */
export function mount(target, node) {
  const host = typeof target === "string" ? document.querySelector(target) : target;
  if (!host) {
    console.warn(`[dom] mount target not found: ${target}`);
    return null;
  }
  host.replaceChildren(node);
  return host;
}

/** Shorthand for a single query. */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/** Shorthand for a query returning a real array (so .map/.filter work). */
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
