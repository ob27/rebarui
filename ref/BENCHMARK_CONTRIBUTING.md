---
title: Rebar UI — contributing a new benchmark, compatibly
status: living document
---

# Contributing a new benchmark

`/benchmarks` compares `rebar-ui` (via the placement layer / DSL Packer) against hand-authored Ant
Design, across models, prompt types, and complexity tiers. This doc is for anyone — human or
agent — who wants to **add a new condition** (a different model, a different spec, a different
prompt style) or **reproduce an existing one**, in a way that's genuinely comparable to what's
already published rather than a number that merely looks similar. `ref/QWEN_BENCHMARK_PROTOCOL.md`
is a complete worked example of applying everything below to one specific case (a new model); read
it alongside this doc if you're doing something similar.

## Why "compatible" is the hard part, not "run a benchmark"

Every number currently on `/benchmarks` was produced under a specific set of disciplines, several
of which were only adopted after an earlier, less careful measurement gave a misleading result:
single runs flipped sign entirely on re-measurement, a "fixed" setup once scored worse than the
unfixed baseline it was meant to improve on, and mixing an agentic harness's numbers with a raw
API's numbers without adjustment produced an apparent finding that inverted once corrected for. A
new benchmark that skips these disciplines can produce a real-looking number that simply isn't
answering the same question the existing numbers answer — which is worse than not running it at
all, because it looks comparable without being comparable.

## The non-negotiable rules

1. **n=15 per condition, not fewer, unless you say so loudly.** This project measured directly:
   n=1 and even n=2 samples can flip sign on re-measurement. n=5 is a usable floor for a rough
   signal if you're resource-constrained, but label it as such in the write-up — never present a
   small sample with the same confidence as n=15, and never quietly average a small sample into a
   headline number without the caveat attached.
2. **Every run is fully isolated.** A fresh scaffold clone per run, no shared state, no reused
   directory across runs or across conditions. Reusing a scaffold two conditions were both meant
   to build in has actually happened in this project's history (one condition's later write
   silently clobbered another's already-measured source) — always clone freshly rather than reuse.
3. **Verify before trusting a number.** Typecheck every generated output. Playwright-check a real
   sample of runs (at minimum the min, median, and max by whatever metric you're reporting) for a
   clean render, zero console errors, and — if the spec has one — correct DOM order. A run that
   "succeeded" only in the sense that a response was returned isn't a verified run.
4. **Report all six stats, not just the mean.** Mean, median, min, max, standard deviation, and
   coefficient of variation (stdev ÷ mean × 100). CV (consistency) has repeatedly been as important
   a finding on this page as the mean (cost) — a model that's cheap on average but wildly
   inconsistent is a different result from one that's cheap and reliable, and averaging hides that
   difference.
5. **Record wall-clock duration alongside tokens**, per run, not just at the end. Both belong in
   the stats table.
6. **Never silently drop a run.** If a run failed (bad output, a rate limit, a crash), record it as
   a failure and report the real attempt count, not just the successful ones — an undercounted
   denominator is exactly the kind of fabricated precision this project's own `ref/ASSESSMENT.md`
   flags as the central methodology risk to avoid. If you cap coverage for cost reasons (sampling
   fewer than n=15, skipping a condition), say so explicitly rather than letting a partial result
   read as complete.
7. **Adjust before comparing across different harnesses.** An agentic harness (tool calls, a
   system prompt, self-verification) and a single raw completion call are not the same kind of
   cost, and their raw totals aren't directly comparable — this project hit this exact trap
   comparing Claude (agentic) against Qwen (raw API) until it re-measured a harness-matched
   "marginal cost" figure (real total minus the harness's own fixed overhead, itself measured, not
   assumed) for a fair comparison. If you're introducing a new harness type, work out and state
   your adjustment method before publishing a cross-harness number.
8. **Don't invent a new target spec unless you're testing something a spec doesn't already
   cover.** Reuse an existing one (see below) so your numbers slot next to what's already
   published instead of requiring readers to mentally normalize across specs.

## The existing target specs — reuse one of these

- **PreviewPanel** (the original spec): a title, close button, an info banner with a reset action,
  a 6-item checklist, a warning callout. Full JSX/DSL content is in the git history of
  `bench/rebar-text*`/`bench/antd-text*` and in `ref/QWEN_BENCHMARK_PROTOCOL.md`'s "the target
  component" section — copy the exact wording from there, don't re-describe it from memory.
- **Three complexity tiers** — Simple (an Account Settings form), Composite (a Projects list with
  filters plus a New Project modal with inline validation), Complex (an employee-onboarding wizard
  with tabs, a table, and a confirmation dialog). Exact content lives in `/benchmarks`'s own
  `EXAMPLE_GROUPS`/tier write-up on the live page — read the current published version there before
  reusing it, since it's the source of truth, not a copy.

If your experiment genuinely needs new content (testing a pattern none of the above exercises),
say so explicitly in your write-up and treat it as a new, separately-labeled baseline — not a
variant of an existing one.

## Adding a new condition, step by step

1. **Scaffold.** Follow the existing naming convention: `bench/<condition>-<NN>` (e.g.
   `bench/rebar-text-07`), a standalone Vite + React project with `rebar-ui`,
   `@rebar-ui/theme-sketch`, and `@rebar-ui/theme-clean` as `workspace:*` dependencies (see any
   existing `bench/*/package.json` for the exact shape) — `workspace:*` is what resolves against
   the real in-repo package source, not a published npm version, so your measurement reflects the
   code actually in this repo. Run `pnpm install` at the repo root after adding new scaffold
   directories so the workspace symlinks resolve before dispatching any runs.
2. **Prompt.** If reproducing an existing condition, use the exact prompt wording already
   published or already in a protocol doc — don't rephrase it, since wording changes are
   themselves a variable this project has measured the effect of (see the "refined image prompt"
   work in the benchmarks history). If your harness has no file access (a single completion call,
   not an agentic session), inline everything it would otherwise need to read — a prompt that
   says "read schema.ts first" scored 0/15 against exactly that kind of harness in this project's
   own history, purely because the model had no way to act on the instruction.
3. **Run.** n=15 independent dispatches per condition, each against a freshly cloned scaffold.
   Record tokens, wall-clock duration, and tool-call count (if your harness exposes it) per run as
   you go — don't reconstruct it after the fact from partial logs.
4. **Verify.** Typecheck every output. Playwright-check at least the min/median/max runs by your
   primary metric: clean render, zero console errors, correct DOM order if the spec requires one.
5. **Compute stats.** Mean, median, min, max, stdev, CV. `bench/compute-stats.ts` is a real,
   working reference implementation of this (written for the Qwen results specifically — adapt it
   to your results file's shape rather than assuming it runs unmodified against different data).
6. **Screenshot, if claiming anything about visual consistency.** Capture all runs at a fixed
   viewport and either eyeball the gallery or compute the real pixel-variance metric this project
   uses elsewhere on `/benchmarks` (Playwright + canvas, per-pixel luminance stdev across the
   n runs, no new dependency) — don't assert "consistent" or "variable" without a number backing
   it, the same discipline applied everywhere else on that page.
7. **Write it up.** Add your condition to `apps/docs/src/app/benchmarks/page.tsx` (or a new
   protocol doc under `ref/` if it's a large new axis, following
   `ref/QWEN_BENCHMARK_PROTOCOL.md`'s shape) — state model/date, n, the exact prompts, the stats
   table, wall-clock, any harness-adjustment method used, and every caveat from the rules above
   that applies. **Keep prior numbers visible rather than overwriting them** — this page's whole
   credibility rests on being able to show its own history, including instability a larger sample
   later revealed, not just its latest claim.

## Opening the PR

Same bar as any other contribution (see the root `CONTRIBUTING.md`): scoped, verified, and
described honestly. Specifically for a benchmark PR:

- State n, model(s), date, and which of the rules above you followed — if you deviated from one
  (smaller n, a harness you couldn't adjust for), say so in the PR description, not just in the
  page copy.
- Link the raw data if it's more than a table can hold (a results JSON, a screenshot gallery
  directory) so a reviewer can spot-check your stats computation against the source.
- Don't touch `bench/*` scaffolds that aren't part of your own new condition — several existing
  ones contain intentionally-broken or model-generated code that's correct as historical record,
  not a bug to clean up.
