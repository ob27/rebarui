import type { Construct } from "@rebar-ui/placement";
import { BenchmarkDateline } from "@/components/BenchmarkDateline";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { Image, Stack } from "rebar-ui";

// Narration was deliberately dropped from this page's 2026-09-25 rewrite: its 3 prior
// doc-sections had narration audio attached (see CLAUDE.md's rule on regenerating narration when
// edited text changes), and this session has no DASHSCOPE_API_KEY to regenerate it — shipping
// stale audio against new copy is explicitly what that rule forbids, so the safer move was to
// remove the narration entries (see apps/docs/src/data/narrationSources.mjs and
// apps/docs/public/narration/manifest.json) rather than guess at credentials. Re-add narration
// once the repo owner supplies a key and this copy has settled.

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Does building with AI on rebar-ui actually save you money?",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Reaching for the highest-tier complete unit available — a real, finished component, not primitives you assemble yourself — measurably lowers the effort of building the same UI, in every comparison run so far, including the most direct one yet: hand-rolled antd vs. hand-rolled rebar-ui vs. a complete rebar-ui component, with no DSL wrapper involved in any of the three. That's real and holds up. What it isn't is a blanket \"rebar-ui is always cheaper\" — against a library the model has trained on for years, rebar-ui currently wins on *effort* (fewer actions, usually less wall-clock) but not on *raw token cost*, and closing that specific gap looks like it needs deeper training exposure to rebar-ui itself, not a change this project can make on its own.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "What actually holds up",
    body: [
      {
        kind: "list",
        items: [
          "*Tool-calls and wall-clock: rebar-ui wins, including against a well-known library.* The [Kanban benchmark](/about/benchmarks/kanban) is the first thing on this site to test hand-rolled antd, hand-rolled rebar-ui, and a complete rebar-ui component head to head, with no DSL wrapper anywhere. Reaching for the complete component beat *both* hand-rolled conditions on tool-calls (median 17 vs. 20–29) and typical wall-clock (188s vs. 235–351s).",
          "*Raw tokens: antd wins, and training familiarity is the likely reason, not task difficulty.* antd came out cheapest of all four conditions measured (median 63,070 tokens vs. rebar-ui's complete-component median of 83,137) — the model already knows antd's API cold, while an opinion-tier rebar-ui build still had to read the component's own source to learn how to customize it (confirmed directly: 14 of 15 runs did, at a measured 11,800 tokens each). A [projection](/about/benchmarks/kanban) modeling what removing that one specific cost would do closes roughly half the gap, not all of it.",
          "*The original antd-vs-rebar-ui token comparisons (Claude/Qwen/Kimi, 2026-08-29/30) are real, but measured a different mechanism.* Those built rebar-ui through the Packer/DSL schema wrapper specifically, and found real savings there too — but this project no longer believes the wrapper itself is what earned them (see [Field evidence: Coherence](/about/benchmarks/coherence)). The current best explanation is the same one above: reaching for a complete, high-tier unit costs less effort, independent of whether a DSL wrapper delivers it.",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The migration payoff, still real",
    body: [
      {
        kind: "text",
        text: "rebar-ui doesn't look like a finished product out of the box — it stays deliberately plain until you, or an agent, migrate it to a real design system once, at the end. That migration has a real cost, so the honest question is whether iterating on rebar-ui first actually earns it back rather than costing more overall. The [iteration benchmark](/about/benchmarks/iteration) measured this round by round instead of guessing: on Claude, it takes 13-17 rounds of revisions before rebar-ui, even counting the full migration cost, beats what antd was ever going to cost. Most real projects go through more revisions than that before they ship, and a project that's never re-skinned at all (an internal tool, a prototype) has nothing to earn back in the first place.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "This is a build diary, not a verdict",
    body: [
      {
        kind: "text",
        text: "Every page in this section is a dated entry recording what was actually measured at the time, not a single, settled proof of the platform's superiority — treat the date on each one as real information about how current it still is. The Kanban benchmark above is a working example of why that framing matters: it directly complicated a claim (\"training familiarity is unfair to rebar-ui, and it wins anyway\") that this page itself stated as settled from 2026-09-14 until the more direct comparison ran on 2026-09-25. Expect this page to keep being revised in place as better-designed comparisons replace weaker ones — that's the intended process, not a failure of the earlier ones.",
      },
      {
        kind: "list",
        items: [
          "[Kanban: antd vs. hand-rolled vs. shell-only vs. complete unit](/about/benchmarks/kanban) — 2026-09-25, rebar-ui v0.12.1. The most direct comparison: no DSL wrapper in any of the 4 conditions.",
          "[Field evidence: Coherence](/about/benchmarks/coherence) — 2026-09-25. Real, non-isolated rebuilds of a production app, across the DSL-wrapper's live-data-binding feature boundary.",
          "[Claude Sonnet 5](/about/benchmarks/claude), [Qwen3.7](/about/benchmarks/qwen), [Kimi-K3](/about/benchmarks/kimi) — 2026-08-29/30, rebar-ui v0.1.0. Token/wall-clock cost of antd vs. rebar-ui-via-the-Packer, across three models.",
          "[Simple/Composite/Complex tiers](/about/benchmarks/tiers) — 2026-08-29/30, v0.1.0. The same comparison across three complexity levels.",
          "[Does iteration change it?](/about/benchmarks/iteration) — 2026-08-29/30, v0.1.0. Round-by-round cost through 13-17 revisions, including the full migration-away cost.",
          "[The receipts](/about/benchmarks/receipts) and [what this costs you](/about/benchmarks/scenarios) — 2026-08-29/30 data, written up 2026-09-14. The raw numbers, and what they mean in real dollars.",
        ],
      },
    ],
  },
];

export default function BenchmarksPage() {
  return (
    <Stack gap="lg">
      <Image
        src="/catalogue-heros/benchmark.jpeg"
        alt="Benchmarks hero image"
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <BenchmarkDateline published="2026-09-14" updated="2026-09-25" />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
