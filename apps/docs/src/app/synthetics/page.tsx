import { Heading, Image, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function SyntheticsPage() {
  const count = tierComponentNames("synthetic").length;

  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Philosophy",
      narration: { src: "/narration/synthetics-philosophy.mp3" },
      body: [
        {
          kind: "text",
          text: `Synthetics are static compositions/groupings of primitives with a unified purpose, but still no real dynamism — a fixed layout, not a state machine. ${count} ship today, and most placement-layer blocks (roughly half the whole catalog) land here too: plain content shapes with nothing bound to live data or a handler. A Synthetic is what you get when the requirement is "arrange several things together and give them one identity," and nothing about that arrangement changes at runtime beyond whatever a parent re-render already does.`,
        },
        {
          kind: "text",
          text: "Composing one interactive sub-component as a single non-core slot doesn't automatically promote the whole thing to Opinion — only if that interactivity is the component's own defining purpose. `Card`, `AspectRatio`, and `Descriptions` each optionally accept an Opinion-grade child in one slot and stay Synthetic, because being a card (or a fixed-ratio box, or a label/value list) is still what they're for, not the interactivity riding along inside them. Read the actual source before concluding either way — a block's schema field names can look interactive (`form`, `filter-bar`) while its real `BlockRenderer.tsx` case wires nothing downstream (no validation, no submit handler, no filter effect), which is exactly why both are correctly Synthetic, not Opinion.",
        },
      ],
    },
    {
      type: "doc-section",
      heading: "When to reach for this tier",
      narration: { src: "/narration/synthetics-when-to-reach.mp3" },
      body: [
        {
          kind: "text",
          text: "Reach for a Synthetic when you're combining multiple Imitations (or other Synthetics) into one coherent, reusable unit, and the result never needs to branch its own behavior based on internal state — a chart with no hover/selection interactivity, a fixed multi-field summary, a static progress indicator. If your design doc says \"this needs to remember whether it's open,\" \"this needs to validate as the user types,\" or \"this needs to filter its own list,\" you've already crossed into Opinion territory — build it there instead of half-heartedly bolting state onto a Synthetic.",
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
      heading: "Porting it back to the main repo",
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
      <Image src="/catalogue-heros/synthetics.jpeg" alt="Synthetics hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Synthetics</Heading>
      <Text color="secondary">
        Static compositions of primitives with a unified purpose, no real dynamism. Browse all{" "}
        {count} in the sidebar.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
