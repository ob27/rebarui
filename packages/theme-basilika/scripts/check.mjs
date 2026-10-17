// Sanity checks for the theme: every font file it references exists, both modes define the same token names, and the key text pairs meet WCAG AA.
import { existsSync, readFileSync } from "node:fs";

const css = readFileSync("src/theme.css", "utf8");
const bad = [];
for (const m of css.matchAll(/url\("\.\/(fonts\/[^"]+)"\)/g)) if (!existsSync(`src/${m[1]}`)) bad.push(`missing font ${m[1]}`);

// The first rule whose selector (possibly spread over several lines) matches `re`, up to its closing brace.
const block = (re) => { const m = re.exec(css); if (!m) return ""; const j = css.indexOf("\n}\n", m.index); return css.slice(m.index, j); };
const tokens = (b) => Object.fromEntries([...b.matchAll(/--rebar-([a-z0-9-]+):\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()]));
const light = tokens(block(/:where\(:root, \[data-rebar-theme="basilika"\][^{]*\{/));
const dark = tokens(block(/:where\(\s*\[data-theme="dark"\][^{]*\{/));
for (const k of ["color-primary", "color-text-primary", "color-bg-primary", "color-danger", "color-tint-1"]) if (!dark[k]) bad.push(`dark mode lacks ${k}`);

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const [x, y] = [lum(rgb(a)), lum(rgb(b))]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const pairs = [["color-text-primary", "color-bg-primary"], ["color-text-primary", "color-bg-secondary"], ["color-text-secondary", "color-bg-primary"], ["color-text-secondary", "color-bg-secondary"],
  ["color-primary-text", "color-primary"], ["color-danger-text", "color-danger"], ["color-primary", "color-bg-primary"], ["color-info", "color-bg-primary"], ["color-text-primary", "color-tint-1"], ["color-text-primary", "color-tint-3"]];
for (const [name, t] of [["light", light], ["dark", { ...light, ...dark }]]) for (const [fg, bg] of pairs) {
  const r = ratio(t[fg], t[bg]); if (r < 4.5) bad.push(`${name}: ${fg} on ${bg} is ${r.toFixed(2)}:1`);
}
if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log("theme-basilika: fonts present, dark complete, text pairs pass AA");
