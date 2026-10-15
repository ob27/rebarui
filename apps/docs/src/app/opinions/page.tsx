import { Heading, Image, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function OpinionsPage() {
  const count = tierComponentNames("opinion").length;

  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Philosophy",
      body: [
        {
          kind: "text",
          text: `Opinions carry real internal state: validation, morphing, multi-step flow, drag/reorder, search-and-filter, open/closed with focus management. ${count} ship today — the largest tier by far, since "has a real state machine" covers most of what makes a UI feel alive. The dividing line isn't state *presence*, it's state *richness*: a checkbox mirroring one caller-owned boolean stays Imitation; a component with open/closed + filtered-list + highlighted-index + selection state (\`Combobox\`) is an Opinion, because its internal state causes it to branch into meaningfully different rendered and behavioral modes, not just reflect one value back.`,
        },
        {
          kind: "text",
          text: "The delegated-state exception matters more here than anywhere else: you cannot determine tier by grepping a component's own file for `useState`. Several Opinions below show zero own state because they delegate their entire state machine to a wrapped Radix primitive (`Select`, `Accordion`, `Tabs`, `Dialog`, `Popover`, `Dropdown`, `Tooltip`, `HoverCard`, `ContextMenu`, `Collapsible`, `Menubar`, `Combobox`), a shared chart hook (`useChartMarkSelection`/`useSeriesFilter`), or another Opinion-tier construct (`NodeLinkGraph`'s pan/zoom/drag under `Flowchart`/`MindMap`/`OrgChart`/`PertChart`; `Table`/`Editable`/`Accordion` under `DataGrid`; `Drawer` under `BottomSheet`/`ActionSheet`/`Popconfirm`/`Lightbox`/`VersionHistory`; react-hook-form under `Form`). `Card` is the one construct that genuinely needed two tier placements over one artifact: its default config is Synthetic, but the `editable` variant grafts real click-to-edit state via `Editable` and is an Opinion — a prop-level variant, not a forked duplicate export.",
        },
        {
          kind: "text",
          text: "For a block, Opinion isn't a judgment call at all — it's mechanical, computed directly off the schema. A block *is* an Opinion iff its own variant in `packages/placement/src/schema.ts` declares a `source` field or an `on<Verb>` handler, checked by `packages/placement/src/opinions.ts`'s `OpinionConstructType` and cross-verified against `apps/docs/src/data/constructTier.ts`'s tier table at compile time — the two can't silently disagree, `tsc --noEmit` fails first. This is exactly the live-data-binding surface `BlockRenderer`'s `data`/`handlers` props resolve against (see `ref/PLACEMENT_LIVE_DATA.md`): `ai-chat`, `table`, `goal-tracker`, `card-kanban`, `sticky-kanban`, `wizard`, `scatter-chart`, `line-chart`, and `stacked-bar-chart` are the current set.",
        },
      ],
    },
    {
      type: "doc-section",
      heading: "When to reach for this tier",
      body: [
        {
          kind: "text",
          text: "Reach for an Opinion when the real requirement forces genuine internal state that changes what gets rendered or how the user can interact next — not just a value being held, but a mode being entered. If a Radix primitive already models the interaction you need (a popover, a dialog, a select, a tabs strip), delegate to it rather than reimplementing focus-trapping and keyboard navigation by hand; that's not a lesser Opinion, it's most of this tier's real membership.",
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
            "Identify the actual state machine first — what are the real modes, and what triggers a transition between them?",
            "Delegate to a Radix primitive when one already models your interaction, instead of hand-rolling focus management and keyboard handling.",
            "Still carry `data-rebar-component`/`data-rebar-part`/`data-rebar-state`, forward `data-*`/`aria-*`, and style only through `--rebar-*` tokens.",
            "Support controlled/uncontrolled for whatever value the state machine ultimately produces, the same convention every other tier follows.",
            "Write real tests covering state transitions and keyboard operability, not just a snapshot of one static render.",
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
          text: "Open an issue first for anything this size — a new Opinion is rarely a small fix. No write access to this repo is required to start: fork it, build the construct there, then open an issue linking your fork or branch asking for it to be adopted into the main project.",
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
            "Classify it `\"opinion\"` in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.component` map.",
            "Add a reference page under `apps/docs/src/app/opinions/<kebab-name>/page.tsx` with a real, live, interactive example — a static screenshot doesn't prove a state machine works.",
          ],
        },
        {
          kind: "text",
          text: "For a block that needs live-data binding instead:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Add the shape to `Construct` in `packages/placement/src/schema.ts`, including a real `source` and/or `on<Verb>` field resolved via `resolveSource`/`resolveHandler` against `BlockRenderer`'s `data`/`handlers` props in its render case — never add a field shaped like one without actually wiring it, since that silently lies about the block's own tier.",
            "Classify its type `\"opinion\"` in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.block` map — `tsc --noEmit` fails immediately if this ever disagrees with what `packages/placement/src/opinions.ts` computes mechanically from the schema.",
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
      <Image src="/catalogue-heros/opinions.jpeg" alt="Opinions hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Opinions</Heading>
      <Text color="secondary">
        Real internal state — validation, morphing, multi-step flow, drag/reorder,
        search-and-filter, open/closed with focus management. Browse all {count} in the sidebar.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
