#!/usr/bin/env node
/**
 * Checks the tier cover galleries' live examples (src/components/docs/tierExamples.*.tsx):
 *   - lists, per tier, which constructs have an example and which fall back to a plain card (name, category, Docs link);
 *   - fails on registry keys that match no construct (a typo would otherwise silently leave a card plain);
 *   - server-renders every example and fails if one throws or renders nothing (the lazy wrapper hides this from `next build`).
 * Usage: node scripts/check-tier-examples.mjs [--strict]   (--strict also fails when any construct has no example)
 */
import fs from "node:fs";
import path from "node:path";
import Module, { createRequire } from "node:module";
import { makeLoader } from "./load-ts.mjs";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(path.join(root, "package.json"));
// rebar-ui's build resolves its own copy of React; hooks need one copy, so pin react and react-dom to the docs app's.
const pinned = Object.fromEntries(
  ["react", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom", "react-dom/server", "react-dom/client"].map((r) => [r, require.resolve(r)]),
);
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (pinned[request]) return pinned[request];
  return origResolve.call(this, request, ...rest);
};
const { renderToStaticMarkup } = require("react-dom/server");
const load = makeLoader(root);
const { galleryEntries } = load("src/components/docs/tierGallery.ts");
const { TIER_EXAMPLES } = load("src/components/docs/tierExamples.tsx");

// Examples that use IntersectionObserver-free code only; silence expected React warnings about useLayoutEffect on the server.
const origError = console.error;
console.error = (...a) => { if (!String(a[0]).includes("useLayoutEffect")) origError(...a); };

const strict = process.argv.includes("--strict");
let failures = 0;
let withEx = 0;
let total = 0;
for (const tier of ["imitation", "synthetic", "opinion", "order"]) {
  const entries = galleryEntries(tier);
  const map = TIER_EXAMPLES[tier];
  const labels = new Set(entries.map((e) => e.label));
  const missing = entries.filter((e) => !map[e.label]);
  const orphans = Object.keys(map).filter((k) => !labels.has(k));
  const broken = [];
  for (const e of entries) if (!fs.existsSync(path.join(root, "src/app", e.href.split("#")[0], "page.tsx"))) broken.push(`${e.label}: Docs link ${e.href} has no page`);
  for (const e of entries) {
    const spec = map[e.label];
    if (!spec) continue;
    try {
      const html = renderToStaticMarkup(spec.node);
      if (html.replace(/<[^>]*>/g, "").trim().length === 0 && !/<(svg|img|canvas|input|button|textarea|video|iframe|table|hr)\b/.test(html)) broken.push(`${e.label}: renders no content`);
    } catch (err) {
      broken.push(`${e.label}: ${String(err && err.message).split("\n")[0]}`);
    }
  }
  withEx += entries.length - missing.length;
  total += entries.length;
  console.log(`${tier.padEnd(9)} ${String(entries.length - missing.length).padStart(3)} live / ${String(missing.length).padStart(3)} plain of ${entries.length}`);
  if (missing.length) console.log(`  no example: ${missing.map((e) => e.label).join(", ")}`);
  if (orphans.length) { console.log(`  KEYS MATCHING NO CONSTRUCT: ${orphans.join(", ")}`); failures++; }
  if (broken.length) { console.log(`  BROKEN:\n    ${broken.join("\n    ")}`); failures++; }
  if (strict && missing.length) failures++;
}
console.log(`total     ${withEx} live / ${total - withEx} plain of ${total}`);
if (failures) { console.error("check-tier-examples: FAILED"); process.exit(1); }
