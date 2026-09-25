import { Alert, Stack } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { BenchmarkDateline } from "@/components/BenchmarkDateline";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Field evidence, not a controlled study",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Everything else on this section is a controlled benchmark: n=15, isolated scaffolds, the same target spec across conditions. This page is different on purpose — it's a real record of what happened across 4 independent, non-isolated rebuilds of the same production app (Coherence, a RAG console) over time, each one a genuinely fresh attempt, not a repeated measurement of the same task. Read it as a single, real data point about how the placement layer actually gets used once real requirements and real iteration pressure show up — not as something to average into the n=15 numbers elsewhere on this page. Rebuilds 1-3 predate live-data binding (shipped 2026-09-12 at rebar-ui v0.4.0, see `ref/PLACEMENT_LIVE_DATA.md`); rebuild 4 happened at/after that point, specifically to test whether it changed anything.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "What happened",
    body: [
      {
        kind: "text",
        text: "The first three independent rebuilds never imported `BlockRenderer` at all, despite `@rebar-ui/placement` being a listed dependency in every one — confirmed directly (`grep -rn \"@rebar-ui/placement|BlockRenderer\"` across each app's `src/`), not assumed. This is exactly the finding `ref/PLACEMENT_LIVE_DATA.md` already documents in detail: every view was hand-authored `rebar-ui` component JSX instead, traced to a real structural fact at the time — the `Block` union was plain, static, JSON-serializable data with no way to express a live source or handler, so a real backend-driven app had nowhere to plug in.",
      },
      {
        kind: "text",
        text: "The fourth rebuild came after live-data binding shipped (`source`/`onX` fields, resolved through `BlockRenderer`'s own `data`/`handlers` props — see `ref/PLACEMENT_LIVE_DATA.md`), specifically to test whether that changed anything. It did, partially: this is the first of the four rebuilds to reach for the Packer at all. But the per-view result is the real finding, not just \"it got used this time.\"",
      },
    ],
  },
  {
    type: "stats-table",
    headers: ["View", "Lines", "Placement layer usage"],
    rows: [
      ["AskView.tsx", "163", "Full — the ai-chat construct's own live source/onSend binding"],
      ["CorpusesView.tsx", "233", "Partial — one form construct for the create flow, the rest hand-authored"],
      ["DocumentsView.tsx", "252", "Evaluated and explicitly abandoned (see below)"],
      ["ChunkSearchView.tsx", "138", "None"],
      ["ConversationsView.tsx", "161", "None"],
    ],
  },
  {
    type: "doc-section",
    heading: "The wall DocumentsView hit, in the code's own words",
    body: [
      {
        kind: "text",
        text: "This is the sharpest single data point. `DocumentsView.tsx` needed a lifecycle-status column (a real `Tag`, not plain text) in a document listing table. It reached for the `table` construct, found that `TableRow.cells` is typed `string[]` — plain text only — and left a comment in the source explaining exactly why it gave up on the construct and hand-authored the whole 252-line view instead. Not a guess about what an agent might do under pressure — the actual reasoning, left in the actual code.",
      },
      {
        kind: "text",
        text: "The two views that did stay in the Packer (`AskView`, and the one `form` construct in `CorpusesView`) are exactly the ones where a construct already fully covered the needed behavior. The three that left needed either more expressiveness than the Opinion tier currently offers at that construct, or had no construct at all to reach for (`ChunkSearchView`'s faceted search, `ConversationsView`'s list-with-inline-actions). The wrapper gets dropped at the first place it doesn't quite fit — the underlying high-tier component doesn't need the wrapper to still be worth reaching for.",
      },
    ],
  },
];

export default function CoherenceBenchmarkPage() {
  return (
    <Stack gap="lg">
      <BenchmarkDateline published="2026-09-25" />
      <NextBlockRenderer blocks={BLOCKS} />
      <Alert type="info" title="What this actually tests, versus what the rest of this page tests">
        The controlled benchmarks elsewhere on this section measure assembling a UI from
        primitives against reaching for a complete unit — the placement layer&apos;s{" "}
        <code>Block[]</code> wrapper happened to be the delivery mechanism in that specific
        measurement, not the thing being measured. This page is the reminder that the wrapper
        itself is optional: real usage keeps the saving by reaching for the underlying component
        directly the moment the wrapper doesn&apos;t fit, rather than falling all the way back to
        primitives. See <code>ref/TIERS.md</code> for the axis that actually drives the numbers on
        this page.
      </Alert>
    </Stack>
  );
}
