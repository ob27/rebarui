#!/usr/bin/env node
/**
 * Finds construct reference pages with no real live example: no rendered instance of the page's
 * OWN construct (not just some incidental `<Stack>`/`<Heading>` layout wrapper) outside of a
 * `code:` sample string. Two shapes, checked differently:
 *   - A component page (its slug resolves to a real `packages/core` export via `hasFullPage.ts`'s
 *     reverse mapping): look for a real `<ComponentName` JSX tag.
 *   - A block page (its slug is a real `Construct["type"]`): look for a real `type: "that-slug"`
 *     object literal (block data fed through `NextBlockRenderer`, not a JSX tag at all).
 * Everything is checked against the source with every `code: \`...\`` / `code: "..."` sample
 * stripped out first, since those legitimately contain the same text as a plain string.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TIERS = ["imitations", "synthetics", "opinions", "orders", "geneses"];

function stripCodeStrings(src) {
  return src
    .replace(/code:\s*`[\s\S]*?`/g, "code: ``")
    .replace(/code:\s*"(?:[^"\\]|\\.)*"/g, 'code: ""')
    .replace(/code:\s*'(?:[^'\\]|\\.)*'/g, "code: ''");
}

// --- Ground truth: reverse hasFullPage.ts (href -> component name) ---
const hasFullPageSrc = fs.readFileSync(path.join(ROOT, "src/data/hasFullPage.ts"), "utf8");
const hrefToComponent = {};
for (const m of hasFullPageSrc.matchAll(/^\s*([A-Za-z0-9]+):\s*"([^"]+)",?\s*$/gm)) {
  hrefToComponent[m[2]] = m[1];
}

// --- Ground truth: block types from constructTier.ts's `block: {...}` section ---
const constructTierSrc = fs.readFileSync(path.join(ROOT, "src/data/constructTier.ts"), "utf8");
const blockSection = constructTierSrc.split("block: {")[1].split(/}\s*satisfies Record<Construct/)[0];
const blockTypes = new Set([...blockSection.matchAll(/"?([a-zA-Z0-9-]+)"?:\s*"(?:imitation|synthetic|opinion|order|genesis)"/g)].map((m) => m[1]));

const results = [];
const unresolved = [];

for (const tier of TIERS) {
  const tierDir = path.join(ROOT, "src/app", tier);
  if (!fs.existsSync(tierDir)) continue;
  const entries = fs.readdirSync(tierDir, { withFileTypes: true }).filter((e) => e.isDirectory());
  for (const entry of entries) {
    const pagePath = path.join(tierDir, entry.name, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;
    const route = `/${tier}/${entry.name}`;
    const src = fs.readFileSync(pagePath, "utf8");
    const stripped = stripCodeStrings(src);

    const componentName = hrefToComponent[route];
    const isBlock = blockTypes.has(entry.name);

    if (!componentName && !isBlock) {
      unresolved.push(route);
      continue;
    }

    // A construct can legitimately be documented via either shape (some — the Opinion-tier
    // blocks like `table`/`wizard`/`nav-bar` — are BOTH a real component and a block type, and
    // their docs page might demo either or both), so a live example in either form counts.
    const hasComponentRender = componentName ? new RegExp(`<${componentName}[\\s/>]`).test(stripped) : false;
    const hasBlockRender = isBlock ? new RegExp(`type:\\s*["']${entry.name}["']`).test(stripped) : false;
    const hasLiveRender = hasComponentRender || hasBlockRender;
    const kind = [componentName ? "component" : null, isBlock ? "block" : null].filter(Boolean).join("+");

    if (!hasLiveRender) {
      results.push({ tier, slug: entry.name, kind, name: componentName ?? entry.name, path: path.relative(ROOT, pagePath) });
    }
  }
}

console.log(`${results.length} pages with no detected live example of their own construct:\n`);
for (const r of results) {
  console.log(`[${r.kind}] ${r.path}  (${r.name})`);
}
if (unresolved.length > 0) {
  console.log(`\n${unresolved.length} pages that couldn't be resolved to a component or block type (check manually):`);
  for (const u of unresolved) console.log(`  ${u}`);
}
