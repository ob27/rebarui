import { Stack } from "rebar-ui";
import { TierIntro } from "@/components/docs/TierIntro";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function SyntheticsPage() {
  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Build one",
      body: [
        {
          kind: "list",
          items: [
            "Compose from existing Imitations and Synthetics — importing named components here is expected and fine, unlike in Imitations.",
            "Still carry `data-rebar-component`/`data-rebar-part`, forward `data-*`/`aria-*`, and style only through `--rebar-*` tokens.",
            "If you're building a *block* instead of a component: add its shape to the `Construct` union in `packages/placement/src/schema.ts`, with a doc comment noting it's unmeasured until it's been through real repeated benchmarking (see the existing blocks' comments for the convention), plus a render case in `BlockRenderer.tsx`.",
            "Do not give a Synthetic block a `source` or an `on<Verb>`-named field unless it is genuinely wired to live data or a handler inside that `BlockRenderer.tsx` case — `packages/placement/src/opinions.ts` mechanically promotes any block declaring one to Opinion, checked at compile time (`tsc --noEmit` fails if the tier table disagrees), so an unwired field name that merely *looks* live is a real bug, not a stylistic choice.",
            "Write tests covering the rendered DOM output, and — for a block — that DOM order matches visual order.",
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
          text: "Open an issue first for anything bigger than a small fix — the placement layer's shape is deliberate, and a quick check avoids building something that's already been tried and rejected (see `ref/PLAN.md`/`ref/ASSESSMENT.md`). No write access to this repo is required to start: fork it, build the construct there, then open an issue linking your fork or branch asking for it to be adopted into the main project.",
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
            "Classify it `\"synthetic\"` in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.component` map.",
            "Add a reference page under `apps/docs/src/app/synthetics/<kebab-name>/page.tsx` with a real, live-rendered example.",
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
            "Classify its type `\"synthetic\"` in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.block` map — this is checked against the schema at compile time, so a missing entry fails `tsc --noEmit` immediately.",
            "Update the block table in `packages/placement`'s own `README.md`.",
            "Add a reference page under its tier route with a real live example (`apps/docs/src/app/synthetics/<block-type>/page.tsx`).",
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
      <TierIntro tier="synthetic" title="Synthetics" lead="Parts combined: a card, an alert, a chat thread." />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
