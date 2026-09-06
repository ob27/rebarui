import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Auditing Packer coverage",
    level: 1,
    body: [
      {
        kind: "text",
        text: "A technique for measuring how much of a page is actually printed by the Packer versus hand-authored component JSX — useful the moment a codebase starts migrating from hand-drawn to printed gradually, rather than all at once.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The maker's mark",
    body: [
      {
        kind: "text",
        text: "Every real `rebar-ui` component carries `data-rebar-component=\"<kebab-name>\"` on its root, and every block `BlockRenderer` renders carries `data-rebar-placement-block=\"<type>\"` on its own root. Together, those two attributes are enough to tell Packer-printed markup apart from hand-authored JSX in the actual rendered DOM — no separate tracking, no extra attribute to remember to add.",
      },
      {
        kind: "text",
        text: "A `[data-rebar-component]` element sitting inside a `[data-rebar-placement-block]` subtree was printed by the Packer. One that isn't was hand-authored — even if it's a real, correct, well-built piece of JSX using real Rebar components, it didn't come from a `Block[]` document.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Measuring your own site",
    body: [
      {
        kind: "text",
        text: "This matters whenever a codebase is gradually adopting the placement layer rather than starting from it — the honest question isn't \"did we add the Packer,\" it's \"how much of this page actually goes through it now.\" That's a number to measure in the rendered DOM, not estimate from memory of what got converted.",
      },
      {
        kind: "code",
        code: `import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/some-route", { waitUntil: "networkidle" });

const { total, printed, handDrawnKinds } = await page.evaluate(() => {
  const components = Array.from(document.querySelectorAll("[data-rebar-component]"));
  const handDrawn = components.filter((el) => !el.closest("[data-rebar-placement-block]"));
  return {
    total: components.length,
    printed: components.length - handDrawn.length,
    handDrawnKinds: [...new Set(handDrawn.map((el) => el.getAttribute("data-rebar-component")))],
  };
});

console.log(\`\${printed}/\${total} printed — hand-drawn: \${handDrawnKinds.join(", ")}\`);`,
      },
      {
        kind: "text",
        text: "Loop that over every real route to get a full-site inventory. This project's own [audit-packer-coverage.mjs](https://github.com/ob27/rebarui/blob/main/apps/docs/scripts/audit-packer-coverage.mjs) is a fleshed-out, working version of exactly this — a real route list, a formatted table, JSON output — worth reading directly as a starting point rather than rebuilding the idea from scratch.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "What doesn't count as a gap",
    body: [
      {
        kind: "list",
        items: [
          "Global page chrome (a site header, a persistent dev panel) shows up as hand-authored on every route — it's not page content, and a page's own layout shell can't sensibly live inside a block it also has to render. Read a page's percentage as \"of that page's own content,\" not a defect to chase toward 100%.",
          "A component's own reference/demo page is a legitimate, permanent exception — printing a single component's own demo through a one-component block decides no layout, and multiplies into a second schema to keep in sync per component, for no benefit.",
          "A genuinely interactive widget — a live estimator, a real triggered dialog, anything whose whole point is client-side interactivity beyond static content — is also legitimate to leave hand-authored. A block can't sensibly wrap something that isn't static data.",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Closing a real gap",
    body: [
      {
        kind: "text",
        text: "When a low number *is* a real gap, close it in order: check the existing block catalog for a shape that already fits — most content does. If nothing fits, that's a signal to build the missing *component* first (if one doesn't exist), then add or extend a *block* that composes it, then print the actual content through that block. Never a hand-authored shortcut that quietly grows the gap instead.",
      },
      {
        kind: "text",
        text: "One real wrinkle worth expecting: a block that needs real page-level layout context — sticky positioning, a specific flex row a page places it in — can't always assume it'll be wrapped the same way as ordinary content. `page-index` (the in-page content index) is a real example: it renders a `position: sticky` element that needs to land as a *direct* flex item of whatever row the calling page places it in, so `BlockRenderer` special-cases it rather than wrapping every block identically. Watch for the same class of issue in any block whose component has layout opinions of its own.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "This project's own numbers",
    body: [
      {
        kind: "text",
        text: "This site dogfoods the whole thing on itself — [PACKER_COVERAGE.md](https://github.com/ob27/rebarui/blob/main/PACKER_COVERAGE.md) is the running inventory: per-route totals, what's still hand-drawn and why, and a prioritized list of the real gaps left. It gets regenerated with the same script above, not hand-edited to match a claim.",
      },
    ],
  },
];

export default function PackerCoveragePage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
