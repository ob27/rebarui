import { Alert, Stack } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// A new, standalone baseline — not a variant of Simple/Composite/Complex — per
// ref/BENCHMARK_CONTRIBUTING.md rule #8. Full methodology/prompts/constraints live in
// bench/KANBAN_BENCHMARK_SPEC.md; the 45 scaffolds themselves are committed under bench/kanban-*.

const INTRO_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Kanban: hand-rolled vs. shell-only vs. complete unit (Claude Sonnet 5, n=15 per condition)",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Every other benchmark on this section measures assembling a UI from primitives against reaching for a complete unit, with a DSL wrapper (the Packer) as the delivery mechanism in the middle. This one removes the wrapper entirely and isolates tier on its own: build the same \"Sprint Board\" three ways — hand-rolled from Imitation/Synthetic primitives, a pre-built visual shell with hand-written behavior, and the real, complete `Kanban` component customized through its own props. No `@rebar-ui/placement` in any condition's scaffold.",
      },
      {
        kind: "list",
        items: [
          "*kanban-primitives* — `Box`/`Stack`/`Card`/`Tag`/`Input`/`Button`/`Avatar` only. Drag-and-drop, search-filter, and add-card state all hand-written from scratch. No `Kanban` import.",
          "*kanban-synthetic* — the same primitives may compose a static visual shell, but the drag-and-drop/search/add-card *behavior* is still entirely hand-written. No `Kanban` import.",
          "*kanban-opinion* — the real `Kanban` component, customized only through its documented props (`columns`/`cards`/`onChange`/`search`/`filterCard`/`renderCard`/`renderColumnTitle`/column `limit`). Nothing it already provides is reimplemented.",
        ],
      },
      {
        kind: "text",
        text: "Same target spec, same model (Claude Sonnet 5), same agentic harness, isolated scaffolds (fresh `bench/kanban-<condition>-<NN>` per run, `workspace:*` deps, no shared state), n=15 per condition — 45 real dispatches total, run 2026-09-25 against rebar-ui v0.12.1 (the current version — every other benchmark on this section was measured against v0.1.0; see the version note on the [benchmarks overview](/about/benchmarks)). Every one of the 45 outputs was independently re-typechecked in a single-threaded pass after all runs completed (not trusted from each building agent's own self-report — see the verification section below for why that distinction mattered).",
      },
    ],
  },
  { type: "doc-section", heading: "Tokens (total context at completion)", level: 3, body: [] },
];

const TOKEN_BLOCKS: Construct[] = [
  {
    type: "stats-table",
    headers: ["Condition", "Mean", "Median", "Min", "Max", "Std. dev."],
    rows: [
      ["primitives", "74,686", "75,583", "63,807", "92,893", "7,343 (9.8%)"],
      ["synthetic", "74,799", "72,954", "65,546", "91,021", "6,672 (8.9%)"],
      ["opinion", "80,538", "83,137", "67,136", "86,301", "5,783 (7.2%)"],
    ],
  },
  { type: "doc-section", heading: "Wall-clock", level: 3, body: [] },
  {
    type: "stats-table",
    headers: ["Condition", "Mean", "Median", "Min", "Max", "Std. dev."],
    rows: [
      ["primitives", "334.5s", "350.8s", "204.1s", "460.7s", "82.4s (24.6%)"],
      ["synthetic", "275.3s", "270.5s", "206.9s", "373.6s", "45.9s (16.7%)"],
      ["opinion", "238.1s", "188.2s", "79.8s", "599.3s", "138.2s (58.1%)"],
    ],
  },
  { type: "doc-section", heading: "Tool-calls", level: 3, body: [] },
  {
    type: "stats-table",
    headers: ["Condition", "Mean", "Median", "Min", "Max", "Std. dev."],
    rows: [
      ["primitives", "31", "29", "22", "43", "6 (17.7%)"],
      ["synthetic", "28", "27", "22", "37", "5 (17.1%)"],
      ["opinion", "18", "17", "11", "31", "6 (31.1%)"],
    ],
  },
];

const INTERPRETATION_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "A genuinely mixed result — reported as measured, not spun",
    body: [
      {
        kind: "text",
        text: "Tool-calls is the cleanest signal, and it clearly favors opinion-tier: a median of 17 versus 27–29 for the other two conditions, with the lowest variance of the three metrics. This is the most direct evidence for the thesis — reaching for a complete component genuinely means less exploration and iteration per build.",
      },
      {
        kind: "text",
        text: "Median wall-clock also favors opinion-tier (188s versus 271–351s), but its variance is the highest of any condition on any metric (58.1% CV, versus 17–25% for the other two). One run took 599s — nearly 5x the opinion median — from an agent that fought harder with Kanban's prop-based customization surface, while two others finished in under 3 minutes. Reaching for a complete unit lowers the typical cost but widens the worst case: when a build has to fight the component's API rather than write its own, that fight can cost more than writing the behavior from scratch would have.",
      },
      {
        kind: "text",
        text: "Token count does *not* favor opinion-tier — it's actually the highest of the three (83,137 median versus 72,954–75,583). The likely cause: an opinion-tier build still has to read `Kanban.tsx`'s full prop surface and render-customization API to figure out how to hit every spec requirement, and that reading costs context even when it saves tool-calls and time.",
      },
      {
        kind: "text",
        text: "Read together: reaching for the highest tier available makes the typical build cheaper in the metrics that measure *effort* (fewer actions, usually less wall-clock), not in the metric that measures *context consumed*. That's a narrower, more honest claim than \"opinion-tier wins outright\" — and it's the claim the numbers actually support.",
      },
    ],
  },
];

const VERIFICATION_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Verification found real defects that self-reports didn't disclose",
    body: [
      {
        kind: "text",
        text: "Per this project's own benchmark discipline (verify before trusting a number), a min/median/max sample per condition (9 of the 45 outputs, selected by token count) was Playwright-verified against the spec's actual behavior — not just typechecked, and not taken on the building agent's own word. 4 of the 9 sampled runs (44%) had at least one real behavioral defect despite every one of them passing `tsc --noEmit` cleanly.",
      },
      {
        kind: "list",
        items: [
          "*Search hides by removing, not by hiding* — found in 3 of the 9 sampled runs (kanban-primitives-04, kanban-synthetic-15, kanban-synthetic-08): a non-matching card is unmounted from the DOM entirely (a plain `.filter()` before render) rather than kept and hidden, contradicting the spec's explicit \"a card that doesn't match is hidden, not removed.\" This is a subtle, easy-to-miss requirement, not a tier-specific weakness — it appeared in both the primitives and synthetic conditions.",
          "*A real drag-and-drop bug* (kanban-synthetic-08, its condition's highest-token run): the floating drag-ghost hardcodes `isDragging={false}`, which lets the ghost's own `pointer-events: auto` shadow the real drop-zone underneath it during `elementFromPoint` hit-testing — breaking every real pointer-driven drag in that scaffold, confirmed by direct DOM probing, not a test-harness artifact.",
          "*A building agent's self-report didn't match its own code* (kanban-opinion-09): its report claimed an `onChange` post-processor moved newly-added cards to the top of their column, overriding Kanban's native append-to-end behavior. Reading the actual file found a plain pass-through, `onChange={(next) => setBoard(next)}` — no such logic exists. The new card genuinely lands at the bottom, violating the spec. Whether this was a fix that was never written or one that was silently reverted, the verification step is what caught it — the self-report alone would have logged this run as fully compliant.",
        ],
      },
      {
        kind: "text",
        text: "One further, incidental finding, not scaffold-specific: `Kanban`'s own shared touch-drag implementation (`packages/core/src/components/Kanban.tsx`) calls `preventDefault()` inside a `touchmove` handler the browser registers as passive by default, logging \"Unable to preventDefault inside passive event listener invocation\" on every real touch-driven drag, in every scaffold using the component. It doesn't block the drag from completing, but it is a genuine library-level bug worth its own fix, independent of this benchmark.",
      },
      {
        kind: "text",
        text: "None of this changes the token/wall-clock/tool-call numbers above — those are fixed regardless of whether the resulting app is behaviorally correct. What it does mean: a build that looks cheap and clean by every automated metric can still be wrong in ways only an independent, empirical check catches. That's as true of the opinion-tier condition this project has a stake in as of the other two — the one clean self-report contradiction found here was in an opinion-tier run, not a primitives one.",
      },
    ],
  },
];

export default function KanbanBenchmarkPage() {
  return (
    <Stack gap="lg">
      <NextBlockRenderer blocks={INTRO_BLOCKS} />
      <NextBlockRenderer blocks={TOKEN_BLOCKS} />
      <NextBlockRenderer blocks={INTERPRETATION_BLOCKS} />
      <NextBlockRenderer blocks={VERIFICATION_BLOCKS} />
      <Alert type="info" title="What this is, and isn't">
        This is a new, standalone baseline (per <code>ref/BENCHMARK_CONTRIBUTING.md</code> rule
        #8) — Kanban had no prior benchmark spec, so it isn&apos;t folded into the
        Simple/Composite/Complex tiers measured elsewhere on this section. All 45 scaffolds
        (<code>bench/kanban-primitives-01</code> … <code>kanban-opinion-15</code>), the target
        spec, and the scaffold generator are committed to the repo under <code>bench/</code> for
        anyone who wants to re-run or extend it.
      </Alert>
    </Stack>
  );
}
