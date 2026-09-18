import { Heading, Image, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function OrdersPage() {
  const count = tierComponentNames("order").length;

  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Philosophy",
      body: [
        {
          kind: "text",
          text: `Orders are macro/page-level structural governance — constructs that arrange other things at a page or app scale (nav bars, sidebars, tab strips that swap whole panels, page-level overlay/panel systems, page indexes) rather than carrying their own data-shaped state as their main purpose. ${count} components ship today, plus a handful of blocks. Read literally, "Order" looks like a fourth rung on the Imitation→Synthetic→Opinion complexity ladder; it isn't — it's a different axis entirely (macro governance vs. behavioral complexity), which is why only a small minority of the whole placement-layer catalog is Order rather than the whole thing.`,
        },
        {
          kind: "text",
          text: "Order is judged by page-structural *role*, not by the absence of a state machine — `SectionNav` and `NavIndex` both have real scroll-spy/search state and are still Orders, because that state exists in service of governing where the reader's attention sits on the page, not as the construct's own defining interaction. Three already-distinct Order artifacts exist for \"a nav bar\" alone — the `NavBar` component, and the `nav-bar` and `site-header` blocks — a known redundancy, not something to silently consolidate on your own without opening an issue first.",
        },
      ],
    },
    {
      type: "doc-section",
      heading: "When to reach for this tier",
      body: [
        {
          kind: "text",
          text: "Reach for an Order when the construct's job is to decide where *other* content lives, appears, or is currently focused — not to hold its own data. Ask: \"does this arrange the page around it, or does the page arrange around what this holds?\" A tab strip that swaps whole panels is an Order; a single tab's own content is whatever tier that content already is. Because this tier is deliberately small and touches shared page structure, a new Order candidate is worth extra scrutiny — open an issue before building one, per `CONTRIBUTING.md`, since it's more likely to interact with other pages' layout than a typical new Imitation or Synthetic.",
        },
      ],
    },
    {
      type: "doc-section",
      heading: "Building your own",
      body: [
        {
          kind: "list",
          items: [
            "Confirm the construct's defining purpose is arranging or governing other content, not holding its own state — if it's mostly the latter, it belongs in Imitation/Synthetic/Opinion instead, regardless of where it happens to render.",
            "It's fine for an Order to carry real state (scroll position, search/filter, open panel) as long as that state serves the governance role rather than being the point.",
            "Still carry `data-rebar-component`/`data-rebar-part`, forward `data-*`/`aria-*`, and style only through `--rebar-*` tokens.",
            "Check for an existing near-duplicate first — this tier already has some intentional redundancy (`NavBar`/`nav-bar`/`site-header`) that wasn't meant to multiply further.",
          ],
        },
      ],
    },
    {
      type: "doc-section",
      heading: "Porting it back to the main repo",
      body: [
        {
          kind: "text",
          text: "Open an issue first — always, for this tier — describing the page-structural role you're filling and why an existing Order doesn't already cover it. Once you're building a component:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Add it under `packages/core/src/components/Name.tsx`, export it from `packages/core/src/index.ts`, and add its filename to `apps/docs/scripts/generate-props.mjs`'s scan list.",
            "Classify it `\"order\"` in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.component` map.",
            "Add a reference page under `apps/docs/src/app/orders/<kebab-name>/page.tsx` with a real, live-rendered example.",
          ],
        },
        {
          kind: "text",
          text: "For a block instead:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Add the shape to `Construct` in `packages/placement/src/schema.ts` and a render case in `BlockRenderer.tsx`.",
            "Classify its type `\"order\"` in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.block` map — checked against the schema at compile time.",
            "Update the block table in `packages/placement`'s own `README.md`, and add a reference page with a real live example.",
          ],
        },
        {
          kind: "text",
          text: "Run `pnpm run lint`, `test`, `build`, and `typecheck` at the repo root before opening the PR — the same four checks CI runs, in that order.",
        },
      ],
    },
  ];

  return (
    <Stack gap="lg">
      <Image src="/catalogue-heros/orders.jpeg" alt="Orders hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Orders</Heading>
      <Text color="secondary">
        Macro/page-level structural governance — arranges other things at a page or app scale.
        Browse all {count} in the sidebar.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
