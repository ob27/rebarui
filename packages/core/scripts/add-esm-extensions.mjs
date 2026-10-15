// Post-processes the unbundled `dist/esm/**/*.js` output:
//  1. adds explicit `.js` extensions (or `/index.js`) to relative specifiers. tsup keeps the source's
//     extensionless relative imports, which bundlers accept but strict ESM resolvers (webpack for
//     "type": "module" packages, Node) reject;
//  2. marks the generated icons' `createIcon(...)` calls pure. esbuild does not emit that annotation
//     for unbundled output, and without it a consumer's bundler keeps all ~1,800 icons once it imports
//     one of them (about 900 KB).
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist", "esm");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith(".js") ? [full] : [];
  });
}

const SPECIFIER = /((?:from|import)\s*\(?\s*)(["'])(\.{1,2}\/[^"']*)\2/g;

let rewritten = 0;
for (const file of walk(root)) {
  const source = readFileSync(file, "utf8");
  const next = source.replace(SPECIFIER, (match, lead, quote, spec) => {
    if (/\.(js|cjs|mjs|json|css)$/.test(spec)) return match;
    const base = resolve(dirname(file), spec);
    if (existsSync(`${base}.js`)) return `${lead}${quote}${spec}.js${quote}`;
    if (existsSync(join(base, "index.js"))) return `${lead}${quote}${spec.replace(/\/$/, "")}/index.js${quote}`;
    return match;
  });
  const pured = /[\\/]icons(?:-remix|-antd)?\.js$/.test(file) ? next.replace(/= createIcon\(/g, "= /* @__PURE__ */ createIcon(") : next;
  if (pured !== source) {
    writeFileSync(file, pured);
    rewritten += 1;
  }
}
console.log(`add-esm-extensions: rewrote ${rewritten} files under dist/esm`);
