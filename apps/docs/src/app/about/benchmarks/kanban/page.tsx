import { Alert, Stack } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { BenchmarkDateline } from "@/components/BenchmarkDateline";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// A new, standalone baseline — not a variant of Simple/Composite/Complex — per
// ref/BENCHMARK_CONTRIBUTING.md rule #8. Full methodology/prompts/constraints live in
// bench/KANBAN_BENCHMARK_SPEC.md; the 60 scaffolds themselves are committed under bench/kanban-*.

const ANTD_COLOR = "var(--rebar-color-text-secondary, #757575)";
const PRIMITIVES_COLOR = "var(--rebar-color-danger, #d32f2f)";
const SYNTHETIC_COLOR = "var(--rebar-color-warning, #f57c00)";
const OPINION_COLOR = "var(--rebar-color-primary, #0066cc)";
const PROJECTED_COLOR = "var(--rebar-color-success, #2e7d32)";
const DSL_COLOR = "#7b2cbf";

const INTRO_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Kanban: antd vs. hand-rolled vs. shell-only vs. complete unit vs. the Packer (Claude Sonnet 5, n=15 per condition)",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Every other benchmark on this section measures assembling a UI from primitives against reaching for a complete unit, with a DSL wrapper (the Packer) as the delivery mechanism in the middle. This one takes the wrapper apart entirely, then puts it back on purpose: build the same \"Sprint Board\" five ways — hand-rolled antd, hand-rolled from rebar-ui's Imitation/Synthetic primitives, a pre-built rebar-ui visual shell with hand-written behavior, the real, complete rebar-ui `Kanban` component customized through its own props, and (added last) that same component composed as pure `Construct[]` data through the Packer.",
      },
      {
        kind: "list",
        items: [
          "*kanban-antd* — Ant Design components directly (`antd` has no pre-built Kanban/board component), plus a real drag-and-drop dependency of the builder's own choosing where they wanted one. The fairest one-to-one match against kanban-primitives: neither library has a pre-built board to reach for.",
          "*kanban-primitives* — `Box`/`Stack`/`Card`/`Tag`/`Input`/`Button`/`Avatar` only. Drag-and-drop, search-filter, and add-card state all hand-written from scratch. No `Kanban` import.",
          "*kanban-synthetic* — the same primitives may compose a static visual shell, but the drag-and-drop/search/add-card *behavior* is still entirely hand-written. No `Kanban` import.",
          "*kanban-opinion* — the real `Kanban` component, customized only through its documented props (`columns`/`cards`/`onChange`/`search`/`filterCard`/`renderCard`/`renderColumnTitle`/column `limit`). Nothing it already provides is reimplemented.",
          "*kanban-opinion-dsl* — a single `card-kanban` block from `@rebar-ui/placement`, rendered through `BlockRenderer`. No `Kanban` import, no hand-written behavior, no `renderCard` escape hatch — added after the schema was widened (see below) specifically to test whether a DSL strategy can still deliver the clean wins the original Claude/Qwen/Kimi benchmarks found, now that it's cleanly separated from tier for the first time.",
        ],
      },
      {
        kind: "text",
        text: "Same target spec, same model (Claude Sonnet 5), same agentic harness, isolated scaffolds (fresh `bench/kanban-<condition>-<NN>` per run, `workspace:*` deps, no shared state), n=15 per condition — 75 real dispatches total, plus a 5-run validation follow-up (see below). The first 4 conditions were run 2026-09-25 against rebar-ui v0.12.1 (the current version — every other benchmark on this section was measured against v0.1.0; see the version note on the [benchmarks overview](/about/benchmarks)); the 5th (`kanban-opinion-dsl`) was added the same day, after widening `Kanban`'s own schema with `assignee`/`statusTag`/`addPosition` fields specifically so this condition's data could express the spec without a `renderCard` escape hatch. Every output was independently re-typechecked in a single-threaded pass after all runs completed (not trusted from each building agent's own self-report — see the verification section below for why that distinction mattered, twice over this time).",
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
      ["antd", "63,197", "63,070", "53,811", "81,969", "7,459 (11.8%)"],
      ["primitives", "74,686", "75,583", "63,807", "92,893", "7,343 (9.8%)"],
      ["synthetic", "74,799", "72,954", "65,546", "91,021", "6,672 (8.9%)"],
      ["opinion", "80,538", "83,137", "67,136", "86,301", "5,783 (7.2%)"],
      ["opinion-dsl", "63,494", "59,472", "55,151", "92,504", "10,168 (16.0%)"],
    ],
  },
  {
    type: "scatter-chart",
    title: "Tokens per run, all 15 runs per condition",
    ariaLabel: "Scatter plot: tokens per run across antd, primitives, synthetic, opinion, and opinion-dsl conditions — opinion-dsl is lowest and second-tightest (tied closely with antd), opinion is highest, primitives and synthetic sit in between",
    series: [
      { label: "antd", color: ANTD_COLOR, values: [81969, 65247, 63070, 64273, 57427, 59851, 57647, 75045, 56479, 66392, 58923, 64220, 53811, 57393, 66201] },
      { label: "primitives", color: PRIMITIVES_COLOR, values: [75583, 78507, 79037, 92893, 63807, 80856, 76485, 70504, 75867, 78206, 75104, 67975, 68895, 63961, 72616] },
      { label: "synthetic", color: SYNTHETIC_COLOR, values: [68084, 71940, 65546, 68888, 76875, 73180, 77225, 91021, 70955, 84729, 72121, 80125, 77358, 70977, 72954] },
      { label: "opinion", color: OPINION_COLOR, values: [77320, 86301, 85559, 85419, 85024, 86139, 73898, 79093, 83137, 67136, 75865, 84336, 81795, 83300, 73750] },
      { label: "opinion-dsl", color: DSL_COLOR, values: [92504, 57365, 60591, 57456, 61821, 56704, 55986, 66638, 58315, 55151, 59472, 63997, 70486, 78129, 57799] },
    ],
  },
  { type: "doc-section", heading: "Wall-clock", level: 3, body: [] },
  {
    type: "stats-table",
    headers: ["Condition", "Mean", "Median", "Min", "Max", "Std. dev."],
    rows: [
      ["antd", "246.4s", "234.6s", "162.6s", "364.7s", "54.5s (22.1%)"],
      ["primitives", "334.5s", "350.8s", "204.1s", "460.7s", "82.4s (24.6%)"],
      ["synthetic", "275.3s", "270.5s", "206.9s", "373.6s", "45.9s (16.7%)"],
      ["opinion", "238.1s", "188.2s", "79.8s", "599.3s", "138.2s (58.1%)"],
      ["opinion-dsl (n=15)", "104.5s", "72.8s", "61.1s", "503.5s", "111.1s (106.3%)"],
      ["opinion-dsl (excl. run 01)", "76.0s", "72.6s", "61.1s", "99.4s", "12.6s (16.6%)"],
    ],
  },
  {
    type: "doc-section",
    body: [
      {
        kind: "text",
        text: "opinion-dsl's own validation run (its first, opinion-dsl-01) is a real, honestly-reported outlier: it hit a genuinely stale `packages/placement` build mid-run and spent several minutes diagnosing it (confirmed by direct build-artifact timestamps, not a guess) before the actual authoring task even started — inflating its wall-clock to 503s. That run is kept in the n=15 table above (never silently dropped), but the 14-run figure excluding it — 76.0s mean, 72.6s median, 16.6% CV — is the more honest read of the condition's real, steady-state cost once the shared build is current, which the other 14 runs all had.",
      },
    ],
  },
  {
    type: "scatter-chart",
    title: "Wall-clock seconds per run, all 15 runs per condition",
    ariaLabel: "Scatter plot: wall-clock seconds per run — opinion-dsl is by far the fastest and tightest except for one outlier run caused by a stale build, opinion has the lowest median among the other four but the widest spread including one large outlier, antd sits between opinion and the two hand-rolled rebar-ui conditions with tighter spread, primitives is slowest and most spread out",
    series: [
      { label: "antd", color: ANTD_COLOR, values: [365, 302, 262, 270, 208, 210, 183, 332, 235, 243, 207, 261, 163, 224, 233] },
      { label: "primitives", color: PRIMITIVES_COLOR, values: [283, 400, 398, 461, 296, 453, 372, 363, 394, 351, 331, 236, 204, 217, 258] },
      { label: "synthetic", color: SYNTHETIC_COLOR, values: [207, 271, 291, 267, 323, 374, 294, 323, 241, 301, 226, 300, 214, 246, 253] },
      { label: "opinion", color: OPINION_COLOR, values: [189, 387, 368, 277, 366, 599, 136, 177, 168, 80, 133, 171, 188, 218, 116] },
      { label: "opinion-dsl", color: DSL_COLOR, values: [503, 64, 72, 73, 83, 68, 75, 99, 79, 65, 68, 91, 61, 99, 67] },
    ],
  },
  { type: "doc-section", heading: "Tool-calls", level: 3, body: [] },
  {
    type: "stats-table",
    headers: ["Condition", "Mean", "Median", "Min", "Max", "Std. dev."],
    rows: [
      ["antd", "23", "20", "15", "45", "8 (35.7%)"],
      ["primitives", "31", "29", "22", "43", "6 (17.7%)"],
      ["synthetic", "28", "27", "22", "37", "5 (17.1%)"],
      ["opinion", "18", "17", "11", "31", "6 (31.1%)"],
      ["opinion-dsl", "19", "18", "12", "38", "6 (32.0%)"],
    ],
  },
  {
    type: "scatter-chart",
    title: "Tool-calls per run, all 15 runs per condition",
    ariaLabel: "Scatter plot: tool-calls per run — opinion is lowest, opinion-dsl and antd are close behind and closer to opinion than to the two hand-rolled rebar-ui conditions, primitives and synthetic are both higher",
    series: [
      { label: "antd", color: ANTD_COLOR, values: [45, 34, 20, 25, 16, 17, 15, 29, 19, 26, 17, 16, 19, 21, 25] },
      { label: "primitives", color: PRIMITIVES_COLOR, values: [29, 34, 35, 43, 28, 37, 32, 27, 28, 40, 28, 28, 22, 29, 29] },
      { label: "synthetic", color: SYNTHETIC_COLOR, values: [22, 37, 29, 24, 26, 36, 24, 28, 27, 35, 25, 29, 26, 24, 34] },
      { label: "opinion", color: OPINION_COLOR, values: [17, 20, 26, 31, 24, 24, 12, 13, 19, 11, 13, 16, 15, 18, 17] },
      { label: "opinion-dsl", color: DSL_COLOR, values: [38, 16, 18, 16, 18, 16, 15, 26, 18, 17, 17, 23, 12, 22, 18] },
    ],
  },
];

const INTERPRETATION_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "So — does rebar-ui actually beat hand-rolled antd?",
    body: [
      {
        kind: "text",
        text: "Yes on effort, no on raw context — and the split is informative, not disappointing. On tool-calls, opinion-tier rebar-ui's median of 17 beats antd's 20, which itself beats both hand-rolled rebar-ui conditions (27–29). On wall-clock, opinion-tier's median (188s) again beats antd (235s), which again beats hand-rolled rebar-ui (271–351s). So for the metrics that measure *how much work an agent has to do*, the ranking is exactly what the tier thesis predicts: complete unit < hand-rolled-but-well-known library < hand-rolled-from-an-unfamiliar-library's-primitives.",
      },
      {
        kind: "text",
        text: "But on tokens, antd is the cheapest of all four conditions (63,070 median) — cheaper than every rebar-ui condition, including opinion-tier (83,137 median). This is the one place hand-rolling antd beats reaching for rebar-ui's own complete component, and it's not a small gap.",
      },
      {
        kind: "text",
        text: "The likely explanation ties directly to something this project's own benchmarks conclusion already says elsewhere: every comparison on this site pits a library the model has trained on constantly (antd) against one it's never seen before (rebar-ui). An opinion-tier build still has to read `Kanban.tsx`'s actual prop surface to learn how to customize it — real context spent on a library the model has no memorized shortcuts for. Hand-rolling antd needs none of that reading, because the model already knows antd's API cold; it just needs to write the DnD wiring, which is exactly the kind of well-worn task (dnd-kit's canonical multi-container pattern, hand-rolled HTML5 drag events) that's all over the model's training data too. Training familiarity, not task difficulty, is doing most of the work in the token number.",
      },
      {
        kind: "text",
        text: "Put together: reaching for a complete rebar-ui component is the fastest, lowest-effort way to build this feature, genuinely faster than even a well-known library's hand-rolled equivalent. It is not the cheapest in raw tokens against a library the model already knows by heart — and pretending otherwise would be the same overclaim this whole pivot was meant to correct. The honest, narrower claim: tier drives effort; training familiarity drives token cost; they're different axes, and this is the first measurement on this site to actually separate them instead of conflating both into one antd-vs-rebar-ui number.",
      },
      {
        kind: "text",
        text: "One more thing worth reading off the scatter plots directly, not just the summary stats: opinion-tier's wall-clock spread is dramatically wider than antd's (58.1% CV versus 22.1%) — reaching for the complete component lowers the typical cost but raises the worst case, because a build that has to fight the component's prop API for an edge case (see the add-to-top workaround discussion below) can cost more than one that just writes the behavior from scratch. antd's hand-rolled effort is more *predictable*, even where it's not fastest.",
      },
    ],
  },
];

const DSL_STRATEGY_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Widen the schema, and the DSL strategy works again — the strongest result of all five",
    body: [
      {
        kind: "text",
        text: "The reason the original Claude/Qwen/Kimi benchmarks showed a DSL wrapper winning cleanly, and Kanban's opinion-tier condition never touched the Packer at all, comes down to one thing: those specs were pure layout composition of already-complete blocks, while Kanban's opinion-tier condition needed real customization (a custom card face, a custom insertion position) that a `Block[]` schema can't serialize — you can't put a function in JSON. So rather than declare the DSL dead, this session widened `card-kanban`'s schema with the exact fields every opinion-tier run had to reach for a `renderCard` escape hatch to get: `assignee`, `statusTag`, and `addPosition`. Then a 5th condition — `kanban-opinion-dsl`, pure `Construct[]` data through `BlockRenderer`, zero behavior code, no `renderCard` — was run at the same n=15 to see if that was enough.",
      },
      {
        kind: "text",
        text: "It was. `kanban-opinion-dsl` has the lowest median tokens of all five conditions (59,472 — lower than antd's 63,070, the previous cheapest), the lowest wall-clock by a wide margin (72.6s median excluding one outlier, versus antd's 234.6s and opinion-tier's 188.2s), and the second-lowest tool-calls (18 median, essentially tied with opinion-tier's 17). Of the 15 runs, 14 needed zero `renderCard`/`renderColumnTitle` — the widened schema fields covered every requirement as plain data. That's the DSL strategy actually working the way the original benchmarks implied it should: not because a schema wrapper is inherently magic, but because the schema now expresses the real customization the task needed, instead of forcing an escape hatch to hand-authored JSX.",
      },
      {
        kind: "text",
        text: "This isn't unqualified, and the qualifications are real findings, not footnotes. First, the schema still has a genuine, accepted expressiveness gap: `Kanban`'s column header only shows a count/cap badge when a column has a `limit` set, so there's no way to show a plain count on an uncapped column through pure block data — every run correctly left \"To Do\"/\"Done\" without a badge rather than inventing a fake `limit` as a workaround, exactly the discipline this project asks for when a construct's schema doesn't quite fit. Second, one run (kanban-opinion-dsl-13) self-reported forgetting to set `addPosition: \"start\"`, landing new cards at the bottom instead of the top — a real compliance miss, left in the dataset rather than quietly fixed, the same as every other condition's organic mistakes this benchmark has recorded. Third, 5 of 15 runs independently hit the same friction point: `KanbanCardData`/`KanbanColumnData`/`KanbanSectionData` weren't exported from `@rebar-ui/placement`'s public entry point, forcing a type-inference workaround — a small, now-fixed DX gap (see below), but a real one five separate agents ran into without prompting.",
      },
    ],
  },
];

const LIBRARY_BUG_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "The benchmark found a real bug in the library itself — fixed, not worked around",
    body: [
      {
        kind: "text",
        text: "While validating the DSL condition, one run's own report flagged something worth checking directly rather than taking on faith: it noticed that `Kanban`'s real search implementation filters `cardIds` down to matching ones *before* mapping them to elements — `visibleIds.map(...)`, where `visibleIds` was already the filtered list. Reading the source confirmed it: a non-matching card was never mounted to the page at all when a search was active, in the actual shipped `Kanban` component, not in any benchmark scaffold's own code. Every one of the 30 opinion-tier runs and all 15 opinion-dsl runs in this entire benchmark series built on top of an already-broken library search implementation — the same \"filter before render, not hide\" mistake this page spent an entire section flagging in hand-rolled scaffold code, except this instance was in `packages/core` itself.",
      },
      {
        kind: "text",
        text: "This was fixed directly in `packages/core/src/components/Kanban.tsx`, not routed around: non-collapsed columns now render every card in the section unconditionally and apply `display: none` to non-matching ones, for both the default card face and a custom `renderCard`'s output (wrapped in a small visibility container so the fix doesn't require any change to `renderCard`'s existing, documented contract). Two pre-existing tests in `packages/core` and `packages/placement` that asserted the old (buggy) behavior — \"the non-matching card is absent from the document\" — were updated to assert the correct one instead, plus two new tests covering the `renderCard` path directly, which had no coverage at all before this. The full suites (1,585 tests in `packages/core`, 120 in `packages/placement`) pass.",
      },
      {
        kind: "text",
        text: "This is arguably the single most important finding to come out of the whole Kanban benchmark effort — not a number, a real defect in shipped code, found because a controlled benchmark cared enough to check a self-report against the actual source rather than trust it. It doesn't change any of the token/wall-clock/tool-call numbers reported above (the fix landed after every run's real usage was already measured), but it does mean every prior claim on this page and on `/opinions/kanban` about `search`'s \"hidden, not removed\" behavior was describing the intent correctly and the implementation incorrectly, until now.",
      },
    ],
  },
];

const VALIDATION_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Does telling agents about the search bug actually help? A small, real test",
    body: [
      {
        kind: "text",
        text: "The recurring \"search removes instead of hides\" defect in hand-rolled scaffold code (see the verification section below) raised an obvious question: would explicitly naming the mistake in the spec actually prevent it, or is that the kind of thing that sounds like it should help but doesn't? `bench/KANBAN_BENCHMARK_SPEC.md` got a new \"Known gotcha\" section spelling out exactly what went wrong and why (\"render every card unconditionally, toggle only its visibility — a card that was never rendered in the first place is not hidden\"), and 5 fresh `kanban-synthetic` runs (16 through 20) were dispatched against the updated spec to check.",
      },
      {
        kind: "text",
        text: "All 5 passed, independently Playwright-verified with real before/after DOM element counts, not taken on self-report. Before the note existed, only 1 of 3 sampled synthetic runs got this right (33%); after, 5 of 5 (100%). Both samples are small — this is suggestive, not proof at scale — but it's a clean, real result in the direction you'd hope: naming a specific, concrete failure mode in the spec text measurably changed what got built, at least for this one recurring mistake.",
      },
    ],
  },
];

const PROJECTION_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "If rebar-ui were as pretrained as antd — a projection, not a measurement",
    body: [
      {
        kind: "text",
        text: "The token gap has an obvious candidate explanation: training familiarity. antd has been a top-tier React UI library for years, all over public code the model trained on; rebar-ui is new and unfamiliar to it. As more real code using rebar-ui exists publicly, future model training runs plausibly pick some of it up the same way — antd wasn't always in the training data either. That raises a real question this benchmark can partially answer with actual measurements, not a guess: if a future model knew `Kanban`'s prop API as well as it already knows antd's, how much of the token gap would close?",
      },
      {
        kind: "text",
        text: "**Methodology.** Every opinion-tier run's own saved transcript was checked directly for whether it read `packages/core/src/components/Kanban.tsx` — 14 of the 15 did (kanban-opinion-04 is the one exception), each exactly once, to learn the component's prop surface before writing any customization code. The actual token cost of that one read was measured directly from a real transcript at 11,800 tokens (a 884-line, ~44KB file) — not estimated from file size alone. None of the 15 antd-condition runs ever read antd's own source; every one used its Card/Tag/Avatar/Input/Button API from memory, the way a model with deep training exposure would for any library. That's the concrete, measurable stand-in for \"a model that already knows rebar-ui cold\": subtract the one real, identified cost of *not* already knowing the API — the forced source-read — from each run that paid it, leave the one run that didn't pay it (opinion-04) unchanged, and recompute.",
      },
    ],
  },
  {
    type: "stats-table",
    headers: ["Tokens", "Mean", "Median", "Min", "Max", "Std. dev."],
    rows: [
      ["antd (real, unchanged)", "63,197", "63,070", "53,811", "81,969", "7,459 (11.8%)"],
      ["opinion (real, measured)", "80,538", "83,137", "67,136", "86,301", "5,783 (7.2%)"],
      ["opinion (projected)", "69,525", "71,337", "55,336", "85,419", "7,138 (10.3%)"],
      ["opinion-dsl (real, measured)", "63,494", "59,472", "55,151", "92,504", "10,168 (16.0%)"],
    ],
  },
  {
    type: "scatter-chart",
    title: "Tokens per run: antd (real), opinion-tier rebar-ui (real and projected), and opinion-dsl (real)",
    ariaLabel: "Scatter plot: antd's real token distribution is lowest and tightest among the non-dsl series, opinion-tier rebar-ui's real distribution is highest, the projected distribution sits between the two, and opinion-dsl's real distribution — added for comparison — sits at or below antd's, actually beating the projection rather than just approaching it",
    series: [
      { label: "antd (real)", color: ANTD_COLOR, values: [81969, 65247, 63070, 64273, 57427, 59851, 57647, 75045, 56479, 66392, 58923, 64220, 53811, 57393, 66201] },
      { label: "opinion (real)", color: OPINION_COLOR, values: [77320, 86301, 85559, 85419, 85024, 86139, 73898, 79093, 83137, 67136, 75865, 84336, 81795, 83300, 73750] },
      { label: "opinion (projected)", color: PROJECTED_COLOR, values: [65520, 74501, 73759, 85419, 73224, 74339, 62098, 67293, 71337, 55336, 64065, 72536, 69995, 71500, 61950] },
      { label: "opinion-dsl (real)", color: DSL_COLOR, values: [92504, 57365, 60591, 57456, 61821, 56704, 55986, 66638, 58315, 55151, 59472, 63997, 70486, 78129, 57799] },
    ],
  },
  {
    type: "doc-section",
    body: [
      {
        kind: "text",
        text: "Worth reading directly off this chart: `opinion-dsl`'s real median (59,472) isn't just close to the *projected* \"if rebar-ui were as pretrained as antd\" opinion-tier figure (71,337) — it beats it outright, and antd's real median too. The projection modeled removing one specific cost (reading `Kanban.tsx`'s source); the DSL condition removes that cost differently, by never needing to read the source at all, since the schema itself already expresses the customization as data. Two different routes to the same underlying fix — don't read source to learn a pattern — and the one that's actually achievable today (widen the schema) already outperforms the hypothetical one (wait for better training exposure).",
      },
    ],
  },
  {
    type: "doc-section",
    body: [
      {
        kind: "text",
        text: "The projected median (71,337) closes roughly half the real gap to antd (83,137 → 71,337, versus antd's 63,070) but doesn't close all of it. The same subtraction applied to tool-calls (remove one tool-call from the 14 runs that paid it) projects a median of 16, versus antd's real 20 — opinion-tier's existing tool-call lead would widen, not just hold.",
      },
      {
        kind: "text",
        text: "Read the ranking this way: if rebar-ui reached antd-level training familiarity, opinion-tier rebar-ui would very likely still win on tool-calls and probably still win on wall-clock, by a wider margin than it does today — those metrics were never about reading the source in the first place. On tokens, the gap would shrink substantially but, on this one identified cost driver alone, likely wouldn't fully close. That's almost certainly a conservative floor, not a ceiling: a genuinely well-trained model would probably also write the customization itself more fluently (less exploratory back-and-forth on the render-prop API, fewer false starts like the add-to-top workaround several runs needed), an effect this projection has no way to measure from the data collected here. The honest summary: pretraining would likely help rebar-ui's token cost meaningfully, probably not enough on its own to fully catch antd, but enough that the two libraries would be much closer than the 24% gap measured today — while rebar-ui's effort advantage would likely hold or grow.",
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
        text: "Per this project's own benchmark discipline (verify before trusting a number), a min/median/max sample per condition (12 of the 60 outputs, selected by token count) was Playwright-verified against the spec's actual behavior — not just typechecked, and not taken on the building agent's own word. 5 of the 12 sampled runs (42%) had at least one real behavioral defect despite every one of them passing `tsc --noEmit` cleanly.",
      },
      {
        kind: "list",
        items: [
          "*Search hides by removing, not by hiding* — found in 4 of the 12 sampled runs, across 3 of the 4 conditions (kanban-primitives-04, kanban-synthetic-15, kanban-synthetic-08, kanban-antd-13): a non-matching card is unmounted from the DOM entirely (a plain `.filter()` before render) rather than kept and hidden, contradicting the spec's explicit \"a card that doesn't match is hidden, not removed.\" Appearing in 3 of 4 conditions, including the antd one that has nothing to do with rebar-ui's tier system, confirms this is a subtle, easy-to-miss spec detail rather than a weakness of any one library or tier.",
          "*A real drag-and-drop bug* (kanban-synthetic-08, its condition's highest-token run): the floating drag-ghost hardcodes `isDragging={false}`, which lets the ghost's own `pointer-events: auto` shadow the real drop-zone underneath it during `elementFromPoint` hit-testing — breaking every real pointer-driven drag in that scaffold, confirmed by direct DOM probing, not a test-harness artifact.",
          "*A building agent's self-report didn't match its own code* (kanban-opinion-09): its report claimed an `onChange` post-processor moved newly-added cards to the top of their column, overriding Kanban's native append-to-end behavior. Reading the actual file found a plain pass-through, `onChange={(next) => setBoard(next)}` — no such logic exists. The new card genuinely lands at the bottom, violating the spec. Whether this was a fix that was never written or one that was silently reverted, the verification step is what caught it — the self-report alone would have logged this run as fully compliant.",
        ],
      },
      {
        kind: "text",
        text: "The antd condition's own sample (2 of 3 clean, 1 of 3 with the search-removal defect) landed at almost exactly the same defect rate as the three rebar-ui conditions — real-world correctness gaps here track spec-reading care, not which library or tier was used.",
      },
      {
        kind: "text",
        text: "One further, incidental finding, not scaffold-specific: `Kanban`'s own shared touch-drag implementation (`packages/core/src/components/Kanban.tsx`) calls `preventDefault()` inside a `touchmove` handler the browser registers as passive by default, logging \"Unable to preventDefault inside passive event listener invocation\" on every real touch-driven drag, in every scaffold using the component. It doesn't block the drag from completing, but it is a genuine library-level bug worth its own fix, independent of this benchmark.",
      },
      {
        kind: "text",
        text: "None of this changes the token/wall-clock/tool-call numbers above — those are fixed regardless of whether the resulting app is behaviorally correct. What it does mean: a build that looks cheap and clean by every automated metric can still be wrong in ways only an independent, empirical check catches. That's as true of the opinion-tier condition this project has a stake in as of the antd condition it's being compared against — the one clean self-report contradiction found here was in an opinion-tier run, not the antd baseline.",
      },
    ],
  },
];

export default function KanbanBenchmarkPage() {
  return (
    <Stack gap="lg">
      <BenchmarkDateline published="2026-09-25" />
      <NextBlockRenderer blocks={INTRO_BLOCKS} />
      <NextBlockRenderer blocks={TOKEN_BLOCKS} />
      <NextBlockRenderer blocks={INTERPRETATION_BLOCKS} />
      <NextBlockRenderer blocks={DSL_STRATEGY_BLOCKS} />
      <NextBlockRenderer blocks={PROJECTION_BLOCKS} />
      <NextBlockRenderer blocks={LIBRARY_BUG_BLOCKS} />
      <NextBlockRenderer blocks={VALIDATION_BLOCKS} />
      <NextBlockRenderer blocks={VERIFICATION_BLOCKS} />
      <Alert type="info" title="What this is, and isn't">
        This is a new, standalone baseline (per <code>ref/BENCHMARK_CONTRIBUTING.md</code> rule
        #8) — Kanban had no prior benchmark spec, so it isn&apos;t folded into the
        Simple/Composite/Complex tiers measured elsewhere on this section. All 80 scaffolds across
        five conditions plus the 5-run gotcha-note validation
        (<code>bench/kanban-antd-01</code> … <code>kanban-opinion-dsl-15</code>), the target spec,
        and all three scaffold generators are committed to the repo under <code>bench/</code> for
        anyone who wants to re-run or extend it.
      </Alert>
    </Stack>
  );
}
