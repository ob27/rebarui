import { Stack } from "rebar-ui";
import { TierIntro } from "@/components/docs/TierIntro";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function ImitationsPage() {
  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Build one",
      body: [
        {
          kind: "list",
          items: [
            "Wrap the closest real semantic HTML element, or at most one Radix primitive — never compose another named rebar-ui component.",
            "Carry `data-rebar-component` (plus `data-rebar-part`/`data-rebar-state` if it has any internal structure or state worth targeting in a test or a re-skin).",
            "Forward arbitrary `data-*`/`aria-*` props through to the root DOM node.",
            "Style only through `--rebar-*` custom properties with sensible fallback values — never a hardcoded pixel or color.",
            "If it holds any value at all, support both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) use, the same convention every existing Imitation follows.",
            "Write tests covering role/name, keyboard operability, and every attribute above — not just a snapshot of the rendered markup.",
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
          text: "For anything bigger than a small fix, open an issue first describing what you're planning — this project's architecture (the placement layer, token-only theming, \"defer to migration rather than fine-tune styling\") is deliberate, and `ref/PLAN.md`/`ref/ASSESSMENT.md` already record a lot of \"we tried this, here's why not.\" No write access to this repo is required to start: fork it, build the construct there against the checklist below, then open an issue linking your fork or branch asking for it to be adopted into the main project — a real, normal path in, not a formality.",
        },
        {
          kind: "text",
          text: "Once you're building:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Add the component under `packages/core/src/components/Name.tsx`, following the checklist above.",
            "Export it (and its prop types) from `packages/core/src/index.ts`.",
            "Classify it in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.component` map as `\"imitation\"` — every name in the generated prop table must appear there, or the tier lookup throws.",
            "Add its filename to `apps/docs/scripts/generate-props.mjs`'s scan list so `pnpm run generate:props` (or the app's own `predev`/`prebuild` hooks) picks up its prop table.",
            "Add a reference page under `apps/docs/src/app/imitations/<kebab-name>/page.tsx` with a real, live-rendered example — not just a props table and prose.",
            "Run `pnpm run lint`, `test`, `build`, and `typecheck` at the repo root — the same four checks CI runs on every PR, in that order.",
          ],
        },
      ],
    },
  ];

  return (
    <Stack gap="lg">
      <TierIntro tier="imitation" title="Imitations" lead="Familiar parts: a button, an input, a tag." />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
