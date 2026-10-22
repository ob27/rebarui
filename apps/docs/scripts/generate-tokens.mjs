// Generates apps/docs/src/generated/component-tokens.json: the public `--rebar-*` custom properties each construct reads, with the
// default each `var(--name, default)` falls back to, taken from packages/core's stylesheet (and the basilika component rules for a
// token the core sheet never reads). Run via generate:props (predev/prebuild/typecheck), so a construct page's "Tokens" table
// cannot drift from the CSS. Derived data, gitignored, like component-props.json.
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(__dirname, "../../..");
const SHEETS = [
  path.join(repo, "packages/core/src/styles/style.css"),
  path.join(repo, "packages/theme-basilika/src/components.css"),
];

/** Token-name prefix (after `--rebar-`) -> the component(s) whose reference page lists it. Longest prefix wins. */
const PREFIX_TO_COMPONENT = [
  ["avatar", ["Avatar"]],
  ["backdrop", ["BackdropSection"]],
  ["button", ["Button"]],
  ["classic-button", ["Button"]],
  ["calendar-heatmap", ["CalendarHeatmap"]],
  ["card", ["Card"]],
  ["checkbox", ["Checkbox"]],
  ["text-eyebrow", ["Text"]],
  ["eyebrow", ["Text"]],
  ["section-label", ["Text"]],
  ["heading-group", ["Heading"]],
  ["image-picker", ["ImagePicker"]],
  ["input", ["Input"]],
  ["list", ["List"]],
  ["popup", ["BottomSheet", "ActionSheet"]],
  ["reading-view", ["ReadingView"]],
  ["search-input", ["SearchInput"]],
  ["select", ["Select"]],
  ["statistic", ["Statistic"]],
  ["tag", ["Tag"]],
  ["toaster", ["Toast"]],
  ["top-bar", ["TopBar"]],
  ["tab-bar", ["MobileTabBar"]],
  ["waveform", ["WaveformAudioPlayer"]],
];
/** Set by the component's own rules for its children, not a property an app sets. */
const INTERNAL = new Set(["--rebar-backdrop-scrim-layer"]);

function componentsFor(name) {
  const rest = name.slice("--rebar-".length);
  let best = null;
  for (const [prefix, comps] of PREFIX_TO_COMPONENT) {
    if ((rest === prefix || rest.startsWith(prefix + "-")) && (!best || prefix.length > best[0].length)) best = [prefix, comps];
  }
  return best ? best[1] : [];
}

/** The text between the parentheses of the `var(` that starts at `open` (the index just after `var(`), or null. */
function balanced(css, open) {
  let depth = 1;
  for (let i = open; i < css.length; i++) {
    const c = css[i];
    if (c === "(") depth++;
    else if (c === ")" && --depth === 0) return css.slice(open, i);
  }
  return null;
}

const defaults = new Map(); // token -> default text ("" when a use has none)
for (const file of SHEETS) {
  const css = fs.readFileSync(file, "utf8");
  const rx = /var\(\s*(--rebar-[a-z0-9-]+)\s*([,)])/g;
  let m;
  while ((m = rx.exec(css))) {
    const name = m[1];
    if (m[2] === ")" ) { if (!defaults.has(name)) defaults.set(name, null); continue; }
    const inner = balanced(css, m.index + 4);
    if (inner == null) continue;
    const comma = inner.indexOf(",");
    const def = inner.slice(comma + 1).trim().replace(/\s+/g, " ");
    if (!defaults.get(name)) defaults.set(name, def);
  }
}

const out = {};
for (const [name, def] of [...defaults].sort(([a], [b]) => a.localeCompare(b))) {
  if (INTERNAL.has(name) || name.endsWith("-")) continue;
  for (const comp of componentsFor(name)) (out[comp] ??= []).push({ name, defaultValue: def || null });
}

const outDir = path.resolve(__dirname, "../src/generated");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "component-tokens.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Generated tokens for ${Object.keys(out).length} components: ` + Object.entries(out).map(([k, v]) => `${k} ${v.length}`).join(", "));
