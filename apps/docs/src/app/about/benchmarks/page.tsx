import type { Construct } from "@rebar-ui/placement";
import { BenchmarkDateline } from "@/components/BenchmarkDateline";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { Image, Stack } from "rebar-ui";

// No narration on this page (dropped in the 2026-09-25 rewrite — see that commit — since this
// session has no DASHSCOPE_API_KEY to regenerate it against new copy, and shipping stale audio is
// exactly what CLAUDE.md's narration rule forbids). Re-add once a key is available.

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Does building with AI on rebar-ui actually save you money?",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Short answer: yes — and the newest, most direct measurement is also the strongest one yet, though it comes with a real condition attached, not a blanket guarantee. Reaching for a complete rebar-ui component beats hand-rolling the same feature, whether you're hand-rolling from rebar-ui's own primitives or from a well-known library like antd, on *effort* — fewer actions, less wall-clock — every time it's been measured. Composed as plain data through the Packer, once its schema was widened to actually cover what a real task needed, that same component beat every other approach on *every* metric, including raw token cost — the one place antd had never lost before. The condition: that win depends on the schema genuinely expressing the customization needed. When it doesn't, you're back to hand-authoring, which still wins on effort but not on tokens against a library the model already knows by heart.",
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
          "*Reaching for a complete unit beats hand-rolling on effort, full stop.* The [Kanban benchmark](/about/benchmarks/kanban) tested five ways to build the same feature — hand-rolled antd, hand-rolled rebar-ui primitives, a rebar-ui shell with hand-written behavior, the complete `Kanban` component via its props, and that same component composed as data through the Packer. On tool-calls and wall-clock, the two conditions that reach for a complete unit (props or data) both beat every hand-rolled condition, including antd's.",
          "*When the Packer's schema actually covers the need, it wins outright — even on tokens.* This is the new result: after widening `card-kanban`'s schema with the `assignee`/`statusTag`/`addPosition` fields a real customization task needed, a 5th condition (pure `Construct[]` data, zero behavior code, no escape hatch) came out cheapest on tokens of *all five* conditions measured — beating antd, the previous cheapest, for the first time on this site. The earlier antd-vs-rebar-ui token comparisons (Claude/Qwen/Kimi, 2026-08-29/30) also went through the Packer and also won — this is the first controlled test confirming why: the DSL wrapper wins when its schema already models the real need as data, not because the wrapper itself is inherently cheap.",
          "*When it doesn't cover the need, training familiarity decides the token count, not tier.* Kanban's complete component customized via hand-authored props (no Packer) came out *most* expensive on tokens, because the model still had to read the component's source to learn its customization surface — a cost a library it already knows cold (antd) never pays. A [projection](/about/benchmarks/kanban) modeling what removing exactly that cost would do closes roughly half the gap, not all of it.",
          "*The benchmark itself found and fixed a real bug, not just numbers.* Validating the new DSL condition surfaced an actual defect in the shipped `Kanban` component — its search implementation was unmounting non-matching cards instead of hiding them, the exact mistake this page's own \"hidden, not removed\" framing has been checking for in hand-rolled code all along, except this instance was in the library itself. It's fixed now, with new test coverage that didn't exist before. That's the point of measuring this way: a claim gets checked against the actual code, not taken on a self-report, and sometimes that check finds something worth fixing.",
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
        text: "Every page in this section is a dated entry recording what was actually measured at the time, not a single, settled proof of the platform's superiority — treat the date on each one as real information about how current it still is. The Kanban benchmark is now a working example of this twice over: it first complicated a claim (\"training familiarity is unfair to rebar-ui, and it wins anyway\") that this page itself stated as settled from 2026-09-14 until 2026-09-25, and then, days later, the follow-up investigation into *that* finding turned up a genuine library bug and a DSL-strategy result stronger than anything measured before it. Expect this page to keep being revised in place as better-designed comparisons replace weaker ones and as real defects get found and fixed along the way — that's the intended process, not a failure of the earlier ones.",
      },
      {
        kind: "list",
        items: [
          "[Kanban: antd vs. hand-rolled vs. shell-only vs. complete unit vs. the Packer](/about/benchmarks/kanban) — 2026-09-25, rebar-ui v0.12.1. The most direct comparison yet, across five conditions, plus the library bug fix and gotcha-note validation this investigation turned up.",
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
      <BenchmarkDateline published="2026-09-14" updated="2026-09-26" />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
