// Measures how much of each marketing/docs page is actually printed by the Packer
// (@rebar-ui/placement's BlockRenderer) versus hand-authored rebar-ui component JSX — see
// ref/PACKER_COVERAGE.md for the write-up this feeds. Every block BlockRenderer renders carries
// data-rebar-placement-block on its root (verified directly against BlockRenderer.tsx, not
// assumed) — that attribute is this project's "maker's mark." A real rebar-ui component
// (data-rebar-component) counts as Packer-printed if it sits inside such a marked subtree,
// hand-authored otherwise. Run against a live dev server: `node scripts/audit-packer-coverage.mjs`.
import { chromium } from "@playwright/test";

const BASE_URL = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";

const ROUTES = [
  "/", "/about",
  "/benchmarks", "/benchmarks/scenarios", "/benchmarks/receipts", "/benchmarks/claude",
  "/benchmarks/qwen", "/benchmarks/kimi", "/benchmarks/tiers", "/benchmarks/iteration",
  "/blocks",
  "/components", "/components/aspect-ratio", "/components/avatar", "/components/badge",
  "/components/breadcrumb", "/components/button", "/components/card", "/components/carousel",
  "/components/cascader", "/components/color-picker", "/components/combobox",
  "/components/descriptions", "/components/dialog", "/components/divider", "/components/editable",
  "/components/empty", "/components/form", "/components/hover-card", "/components/kanban",
  "/components/multi-select",
  "/components/nav-bar", "/components/nav-index", "/components/number-input",
  "/components/pagination", "/components/pin-input", "/components/popover", "/components/rate",
  "/components/result", "/components/section-nav", "/components/segmented-control",
  "/components/skeleton", "/components/spin", "/components/statistic", "/components/steps",
  "/components/sticky", "/components/scatter-chart", "/components/line-chart",
  "/components/stacked-bar-chart", "/components/table", "/components/qr-code",
  "/components/watermark",
  "/components/tag", "/components/timeline", "/components/tree-view", "/components/wizard",
  "/components/bar-chart", "/components/area-chart", "/components/sparkline",
  "/components/pie-chart", "/components/gauge-chart", "/components/funnel-chart",
  "/components/waterfall-chart", "/components/radar-chart", "/components/box-plot",
  "/components/drawer", "/components/bottom-sheet", "/components/action-sheet",
  "/components/mobile-tab-bar", "/components/scroll-area", "/components/split-button",
  "/components/calendar", "/components/time-picker", "/components/resizable-panels",
  "/components/transfer", "/components/command-palette", "/components/barcode",
  "/components/date-picker", "/components/image", "/components/lightbox",
  "/components/file-upload", "/components/bubble-chart", "/components/heatmap",
  "/components/rich-text-editor", "/components/pull-to-refresh", "/components/picker-wheel",
  "/components/swipe-actions", "/components/treemap", "/components/candlestick-chart",
  "/components/geo-chart", "/components/gantt-chart", "/components/sankey-diagram",
  "/components/word-cloud", "/components/node-link-graph",
  "/components/data-grid", "/components/pivot-table", "/components/org-chart",
  "/components/mind-map", "/components/flowchart", "/components/diagram-minimap",
  "/components/popconfirm", "/components/tree-select", "/components/tour",
  "/components/mentions", "/components/back-top", "/components/affix",
  "/components/avatar-group",
  "/components/button-group", "/components/speed-dial", "/components/masonry",
  "/components/collapsible", "/components/toggle", "/components/toggle-group",
  "/components/context-menu", "/components/menubar",
  "/components/git-graph", "/components/version-history", "/components/chat-thread",
  "/components/waveform-audio-player", "/components/upload-queue", "/components/infinite-scroll-grid",
  "/components/goal-tracker", "/components/text-to-speech-bar", "/components/floating-selection-toolbar",
  "/components/slash-command-menu", "/components/voice-composer", "/components/shape-gallery",
  "/components/file-manager", "/components/layers-panel",
  "/docs", "/docs/contributing", "/docs/design-philosophy", "/docs/devtools",
  "/docs/getting-started", "/docs/heuristics", "/docs/mobile-skew",
  "/docs/migration", "/docs/packer-coverage", "/docs/robot-md", "/docs/theming", "/docs/token-estimate",
  "/status",
];

const browser = await chromium.launch();
const page = await browser.newPage();
const rows = [];

for (const route of ROUTES) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
  const result = await page.evaluate(() => {
    const components = Array.from(document.querySelectorAll("[data-rebar-component]"));
    let printed = 0;
    const handDrawn = [];
    for (const el of components) {
      if (el.closest("[data-rebar-placement-block]")) printed++;
      else handDrawn.push(el.getAttribute("data-rebar-component"));
    }
    const blocks = new Set(
      Array.from(document.querySelectorAll("[data-rebar-placement-block]")).map((el) =>
        el.getAttribute("data-rebar-placement-block"),
      ),
    );
    return {
      total: components.length,
      printed,
      handDrawn: handDrawn.length,
      handDrawnKinds: [...new Set(handDrawn)],
      blockTypes: [...blocks],
    };
  });
  const pct = result.total > 0 ? Math.round((result.printed / result.total) * 100) : null;
  rows.push({ route, ...result, pct });
}

await browser.close();

console.log(
  "route".padEnd(32),
  "total".padStart(6),
  "printed".padStart(8),
  "hand".padStart(6),
  "pct".padStart(5),
  " hand-drawn kinds",
);
for (const r of rows) {
  console.log(
    r.route.padEnd(32),
    String(r.total).padStart(6),
    String(r.printed).padStart(8),
    String(r.handDrawn).padStart(6),
    (r.pct === null ? "—" : `${r.pct}%`).padStart(5),
    " " + r.handDrawnKinds.join(", "),
  );
}

console.log("\nJSON:\n" + JSON.stringify(rows, null, 2));
