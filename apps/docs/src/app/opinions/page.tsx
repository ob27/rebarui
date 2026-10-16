import { Stack } from "rebar-ui";
import { TierIntro } from "@/components/docs/TierIntro";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function OpinionsPage() {
  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Build one",
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
      heading: "Contribute it",
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
      <TierIntro tier="opinion" title="Opinions" lead="Our own take: a Kanban, a combobox, a data grid." />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
