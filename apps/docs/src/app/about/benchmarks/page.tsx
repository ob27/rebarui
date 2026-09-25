import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { Image, Stack } from "rebar-ui";

const UPDATE_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Update, following the Kanban benchmark: the antd comparison needs a caveat",
    body: [
      {
        kind: "text",
        text: "The Conclusion above says every number on this page pits a library the model has trained on constantly (antd) against one it's never seen (rebar-ui), and calls that unfair in rebar-ui's favor since it wins anyway. The [Kanban benchmark](/about/benchmarks/kanban) — the first thing on this site to directly compare hand-rolled antd, hand-rolled rebar-ui, and a complete rebar-ui component with no DSL wrapper involved at all — complicates that framing rather than confirming it.",
      },
      {
        kind: "text",
        text: "On tool-calls and wall-clock, reaching for rebar-ui's own complete `Kanban` component still beats hand-rolled antd, matching the pattern above. But on raw tokens, antd is actually the *cheapest* of all four conditions measured — training familiarity cut against rebar-ui there, not for it. The old framing wasn't wrong about effort; it was incomplete about tokens.",
      },
      {
        kind: "text",
        text: "That raises a natural question: would the token gap close if a future model had trained on rebar-ui as much as it has on antd? Part of that has a real, measured answer rather than a guess. 14 of the 15 opinion-tier Kanban runs read `Kanban.tsx`'s own source in full before writing any code, to learn its prop API — a real cost of 11,800 tokens per run, confirmed directly from each run's own saved transcript, that a model with antd-level familiarity wouldn't need to pay (none of the antd-condition runs ever read antd's own source). Subtracting that measured cost projects opinion-tier's median token cost from 83,137 down to about 71,337 — closing roughly half the real gap to antd's 63,070, but not all of it. That's a conservative floor, not a full simulation: a genuinely well-trained model would likely also write the customization itself more fluently, an effect this projection can't isolate from the data collected. See the full breakdown, methodology, and caveats on the [Kanban benchmark](/about/benchmarks/kanban) page.",
      },
      {
        kind: "text",
        text: "The claude/qwen/kimi/tiers/iteration/receipts/scenarios sections below were all measured 2026-08-29/30 against rebar-ui v0.1.0. The Kanban benchmark was measured 2026-09-25 against the current v0.12.1.",
      },
    ],
  },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Does building with AI on rebar-ui actually save you money?",
    level: 1,
    narration: { src: "/narration/benchmarks-does-it-save-money.mp3" },
    body: [
      {
        kind: "text",
        text: "Short answer: yes — real, measured savings on every model and every prompt style we've tested, from a few percent on a frontier model up to roughly three-quarters cheaper on a budget one. Everything on this page is a real number pulled from real API usage, not a guess — the methodology and every underlying data point are still here for anyone who wants to check our work, further down the page.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The short answer",
    narration: { src: "/narration/benchmarks-short-answer.mp3" },
    body: [
      {
        kind: "text",
        text: "*Building the same UI with rebar-ui instead of hand-written antd costs less, every time we've measured it* — 3-5% cheaper on a top-tier model like Claude, and 25-75% cheaper on cheaper models like Qwen and Kimi. The cheaper the model you're using, the bigger rebar-ui's advantage — because most of what a model struggles with when hand-writing a UI is layout and composition decisions, and rebar-ui removes those decisions from the job entirely.",
      },
      {
        kind: "text",
        text: "The one thing rebar-ui doesn't do is look like a finished product out of the box — it's deliberately plain until you (or an agent) migrate it to a real design system once, at the end. That migration has a real cost, so the honest question is whether the savings along the way actually earn it back. We measured that too, round by round, rather than guessing: on Claude, it takes 13-17 rounds of revisions before rebar-ui (even counting the full cost of migrating away from it) is cheaper than antd was ever going to be. Most real projects go through more revisions than that before they ship — and if you're building something you'll never bother re-skinning at all (an internal tool, a prototype), there's no migration cost to earn back in the first place, so rebar-ui is simply cheaper, full stop. See [what this costs you](/about/benchmarks/scenarios) for what that looks like in real dollars.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Conclusion",
    narration: { src: "/narration/benchmarks-conclusion.mp3" },
    body: [
      {
        kind: "text",
        text: "If you're deciding whether to build with rebar-ui or hand-code against antd directly: on every model and prompt style we've tested, rebar-ui costs less and renders more consistently, from the very first build. The cheaper the model you're using, the more that matters — the gap ranges from a few percent on a frontier model up to three-quarters cheaper on a budget one.",
      },
      {
        kind: "text",
        text: "The one real cost on rebar-ui's side is migrating to a proper design system once you're done iterating — and we measured how long that takes to pay for itself rather than guess: 13-17 rounds of revisions, depending on complexity. Most real projects go through more revisions than that. If you're building something you won't re-skin at all, there's nothing to pay back in the first place, and rebar-ui is simply the cheaper choice throughout.",
      },
      {
        kind: "text",
        text: "Worth knowing: every number on this page compares a library the model has trained on constantly (antd) against one it's never seen before (rebar-ui) — a genuinely unfair comparison in rebar-ui's favor, if anything, since it still wins despite that disadvantage. What we'd still like to test: the same round-by-round migration payoff on Qwen and Kimi, not just Claude; a wider range of app types beyond the three we picked; and a fourth model, to see how far the \"cheaper model, bigger gap\" pattern actually goes.",
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
      <NextBlockRenderer blocks={BLOCKS} />
      <NextBlockRenderer blocks={UPDATE_BLOCKS} />
    </Stack>
  );
}
