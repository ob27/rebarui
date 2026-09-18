import { Heading, Image, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

export default function ImitationsPage() {
  const count = tierComponentNames("imitation").length;

  const BLOCKS: Construct[] = [
    {
      type: "doc-section",
      heading: "Philosophy",
      body: [
        {
          kind: "text",
          text: `Imitations are the floor of the tier ladder — static, standalone primitives with no composition of other named components, and no real state beyond mirroring one caller-controlled value for the controlled/uncontrolled convention. ${count} ship today. Every other tier is built *out of* these, directly or through composition; nothing in this catalog is built *out of* something smaller. A block can never be an Imitation — a block is always at least a fixed composition of components, so the placement layer's Packer doesn't touch this tier at all. It's components-only.`,
        },
        {
          kind: "text",
          text: "The two tests that actually decide membership, both mechanically checkable by reading the source rather than guessing from the name: **the composition test** — does this component import and render another *named* rebar-ui component? If so, it's at least a Synthetic, not an Imitation, no matter how simple it looks. **The state test** — does its own `useState` do anything beyond mirroring one caller-owned value for controlled/uncontrolled use? If it branches into meaningfully different rendered or behavioral modes, it's not an Imitation either.",
        },
      ],
    },
    {
      type: "doc-section",
      heading: "When to reach for this tier",
      body: [
        {
          kind: "text",
          text: "Reach for an Imitation when the thing you're building wraps one real semantic HTML element (or, occasionally, one Radix primitive) with no awareness of siblings and no internal decision-making beyond \"what value do I currently hold.\" A `Checkbox` mirroring one boolean is the canonical case. The moment you find yourself importing `Button` to render inside your new component, or branching your JSX on more than one internal state variable, you've already left this tier — that's not a failure, it just means the thing you're building is a Synthetic or an Opinion, and should be classified and tested as one.",
        },
        {
          kind: "text",
          text: "A real, enforced example from this codebase: `Pagination`, `SegmentedControl`, `Selector`, and `NumberInput` all deliberately reimplement their own raw `<button>` internally instead of importing the real `Button` component, specifically to stay Imitation. When a later audit found `ToggleGroup` (composing real `Toggle`s), `Carousel` (composing a real `Button` for its prev/next controls), and `AiChatInput` (composing a real `Button` for send/dictation) quietly breaking that same rule, all three were reclassified to Synthetic to match — not exceptions, the rule enforced consistently.",
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
      heading: "Porting it back to the main repo",
      body: [
        {
          kind: "text",
          text: "For anything bigger than a small fix, open an issue first describing what you're planning — this project's architecture (the placement layer, token-only theming, \"defer to migration rather than fine-tune styling\") is deliberate, and `ref/PLAN.md`/`ref/ASSESSMENT.md` already record a lot of \"we tried this, here's why not.\" Once you're building:",
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
      <Image src="/catalogue-heros/immitations.jpeg" alt="Imitations hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Imitations</Heading>
      <Text color="secondary">
        Static, standalone primitives — the smallest, closest-to-HTML building block in the
        catalog. Browse all {count} in the sidebar.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
