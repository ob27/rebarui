import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "The token estimate: methodology and assumptions",
    level: 1,
    body: [
      {
        kind: "text",
        text: "The DevTools panel (🔧) shows three numbers: build against AntD directly, build with Rebar alone, and build with Rebar then migrate once. This page is the full, honest accounting of how those numbers are computed — a documented estimation *model* with stated, editable assumptions, not a measured cost. The source is `packages/devtools/src/tokenEstimate.ts`, short enough to read end to end yourself.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "What each number represents",
    body: [
      {
        kind: "text",
        text: "AntD, built directly — authoring every component against AntD's real API from the start, paying a \"reconciliation tax\" on every logic iteration to keep the code working against AntD's specific prop names, component shape, and visual rules.",
      },
      {
        kind: "text",
        text: "Rebar only — authoring headless: no visual decisions to make, so a smaller tax per iteration than AntD's (not zero — see below).",
      },
      {
        kind: "text",
        text: "Rebar, then migrate once — Rebar-only cost, plus a single one-time migration pass at the end (via `@rebar-ui/migrate-antd` where it applies, or the manual/LLM-assisted `MIGRATION_PROMPT.md` path where it doesn't).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The formula",
    body: [
      {
        kind: "code",
        code: `for each component type on the page, with count N and complexity tier T:

  antdBase             += BASE_AUTHORING_COST[T] × N
  antdTaxPerIteration  += ANTD_ITERATION_TAX[T] × N
  rebarBase            += BASE_AUTHORING_COST[T] × N × (1 - REBAR_FIRST_BUILD_DISCOUNT)  // measured
  rebarTaxPerIteration += REBAR_ITERATION_TAX[T] × N
  migrationCost        += codemodSupported(type)
                            ? CODEMOD_REVIEW_COST × N                        // cheap, mechanical
                            : BASE_AUTHORING_COST[T] × N × MANUAL_MIGRATION_MULTIPLIER

antdDirect         = antdBase + antdTaxPerIteration × iterations
rebarOnly          = rebarBase + rebarTaxPerIteration × iterations
rebarThenMigrate   = rebarOnly + migrationCost

// Both totals are linear in iteration count, so the crossover has a closed-form solution —
// no need to try iteration counts one at a time to find where the lines cross:
breakevenIterations = (rebarBase + migrationCost - antdBase) / (antdTaxPerIteration - rebarTaxPerIteration)`,
      },
      {
        kind: "text",
        text: "`iterations` — how many rounds of logic changes you expect before this UI is done — is fixed at 5 in the panel for the three headline numbers (it was confusing without this page's context open alongside it); edit `ASSUMED_LOGIC_ITERATIONS` in `packages/devtools/src/RebarDevTools.tsx` if your project's expected iteration count is very different. `breakevenIterations` doesn't depend on that assumption at all — it's solved directly from the constants below, and is the number the panel leads with (\"pays for itself after ~N revisions\").",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The constants, and the reasoning behind each",
    body: [
      {
        kind: "text",
        text: "Base authoring cost (tokens to write one instance of a component the first time, headless — no styling decisions): simple 30, medium 80, complex 150. These track the same simple/medium/complex tiers used for the DevTools panel's Low/Medium/High migration-effort estimate.",
      },
      {
        kind: "text",
        text: "AntD per-iteration tax (extra tokens paid on each logic iteration when building directly against AntD, reconciling the change with AntD's specific API): simple 10, medium 25, complex 50.",
      },
      {
        kind: "text",
        text: "Rebar per-iteration tax (simple 9, medium 23, complex 47) — the constant this model got wrong before the iteration experiment actually ran. It previously assumed this was zero: headless authoring has no visual decisions, so the intuition was no iteration cost either. The real, measured Condition A/B experiment on [/benchmarks](/benchmarks) — three tiers, iterated round-by-round to an actual crossover rather than an assumed one — found rebar-ui's own average per-round cost across all rounds was ~92.5% of antd's, a real but modest ~7.5% saving per round, not the ~0% this model implied. Set here at a slightly more conservative 93% of `ANTD_ITERATION_TAX` (rounded up, so this model doesn't overstate rebar's per-round advantage beyond what was measured) — same rounding discipline as the first-build discount below.",
      },
      {
        kind: "text",
        text: "Rebar first-build discount (3%) — grounded in the real, repeated (n=15) benchmark runs on [/benchmarks](/benchmarks), which found Rebar's own placement-layer build costs ~3.2% less than AntD's direct build on the very first build alone (30,211 vs. 31,231 tokens, text-prompt; 30,787 vs. 31,765, image-prompt) — rounded down to 3% to stay conservative. Real, but at a coarser grain than the rest of this model: a whole-panel measurement, not an isolated per-component-type one — we haven't measured what one `Button` vs. one `Card` costs in isolation.",
      },
      {
        kind: "text",
        text: "Migration cost: components `@rebar-ui/migrate-antd` actually handles (see its README for the exact list) cost a flat 5 tokens — reviewing an auto-generated diff. Everything else falls to the manual/LLM path, modeled as 1.5× that component's own base authoring cost — restructuring already-correct code with semantic judgment is cheaper than a from-scratch build, but not free. The real measured migration costs from the iteration experiment (a full LLM rewrite of a placement-layer document to equivalent antd JSX, since the codemod doesn't cover schema files) came in around 1.08-1.14× the size of an equivalent antd build — broadly consistent with this 1.5× assumption being a conservative upper bound, not a wildly different number.",
      },
      {
        kind: "text",
        text: "Breakeven iterations — not a stored constant, a derived number: solving for the iteration count where the two totals cross. Checked this against the real measured crossover on [/benchmarks](/benchmarks) (round 13 Complex, round 14 Composite, round 17 Simple) before writing anything here, rather than assuming they'd agree — and they don't: this model, run against a representative single-type or mixed component page, predicts breakeven around 44-74 iterations, several times higher than the 13-17 actually measured.",
      },
      {
        kind: "text",
        text: "That gap is real and has a real cause, not a bug to paper over: the /benchmarks iteration experiment measured cost via fresh, isolated one-shot dispatches every round — each round re-pays close to a full build's worth of tokens, because that harness has no cheaper way to apply a small diff. This model instead assumes a lighter \"reconciliation tax\" per iteration — the cost of reconciling a logic change with an existing, already-open codebase in one continuous session, which a real IDE-based coding session can plausibly do much more cheaply than a fresh dispatch can. Both numbers are real measurements of genuinely different iteration styles (restart-every-round vs. continuous-session), not the same quantity measured two ways — so they aren't expected to match, and forcing this model's constants to fake agreement with 13-17 would be exactly the fabricated-precision mistake this page exists to avoid. Treat `breakevenIterations` as this model's own internally-consistent number, not a stand-in for the measured one.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "What this is not claiming",
    body: [
      {
        kind: "text",
        text: "This is not a measurement of any real project's actual token usage — it's a model built from stated, arguable assumptions, computed against the real component counts on your page. Change the constants in `packages/devtools/src/tokenEstimate.ts` if you disagree with them; the model is short and the reasoning for each number is written above specifically so you can. Treat the comparison as directional evidence for the underlying argument (iteration cost compounds against a real design system, a migration is a bounded one-time cost), not as a precise cost prediction for your specific project.",
      },
    ],
  },
];

export default function TokenEstimatePage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
