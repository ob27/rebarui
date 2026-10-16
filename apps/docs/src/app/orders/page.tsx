import { Stack } from "rebar-ui";
import { TierIntro } from "@/components/docs/TierIntro";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function OrdersPage() {
  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Build one",
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
      heading: "Contribute it",
      body: [
        {
          kind: "text",
          text: "Open an issue first — always, for this tier — describing the page-structural role you're filling and why an existing Order doesn't already cover it. No write access to this repo is required to start: fork it, build the construct there, then open an issue linking your fork or branch asking for it to be adopted into the main project.",
        },
        {
          kind: "text",
          text: "Once you're building a component:",
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
      <TierIntro tier="order" title="Orders" lead="Whole layouts: an app shell, a nav bar, a grid." />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
