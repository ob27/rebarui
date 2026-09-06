---
title: Rebar UI — cross-model benchmark protocol (for Qwen or any other model)
status: living document
---

# Cross-model benchmark protocol

This is a self-contained runbook for reproducing the `/benchmarks` experiments on a **different
model** than the one that produced the numbers currently published there (Claude Sonnet 5,
2026-08-29). Hand this whole file to the model/agent you want to test (e.g. Qwen) as its
instructions — it should be able to execute this without any other context from this repo's
history, though it does need working code access to a `rebar-ui` + `antd` environment (see Setup).

See `ref/BENCHMARK_CONTRIBUTING.md` for the general rules this protocol is one worked example
of (n=15, isolation, verification, stats, harness-adjustment) — read it first if you're adapting
this protocol to a different model/spec rather than reproducing it exactly as written.

## Why this matters — the actual research question

The current `/benchmarks` findings are all measured on one model. There's a real open question
they can't answer: **does a cheaper/weaker model benefit even more from Rebar's placement layer
than a frontier model does?** The placement layer's whole mechanism is removing layout/composition
*decisions* from the model — it only picks a named archetype and supplies content, a deterministic
renderer does the rest. A weaker model is plausibly worse at the open-ended part (composing
`Stack`/`Box` JSX from scratch, or authoring correct AntD markup from imperfect training-data
recall) and just as capable at the constrained part (filling in a small typed document). If that's
right, a cheaper model run through the placement layer could end up **relatively closer to (or
even beating) a frontier model's own antd-direct cost** than the frontier-vs-frontier comparison
already on this page suggests — which would be a real, separate argument for the placement layer:
not just "cheaper per call," but "makes a much cheaper model viable for UI work at all." This
protocol is designed to produce numbers that can test that, not just repeat the existing result on
a different model for its own sake.

## What gets measured

Four sub-experiments, mirroring the existing `/benchmarks` page exactly so the numbers are
directly comparable:

1. **antd-text** — build the target component against `antd` directly, given a text prompt.
2. **rebar-ui-text** — build the same component via Rebar's placement layer, given a text prompt.
3. **antd-image** — build the same component against `antd` directly, given a reference screenshot
   instead of a text prompt.
4. **rebar-ui-image** — build the same component via Rebar's placement layer, given the same
   reference screenshot.

Per sub-experiment: **n=15 independent runs**, each in a fresh, isolated scaffold (no shared state
between runs — every run should look like the first time this model has ever seen the task). n=15
is not arbitrary — this project found n=1 and even n=2 measurements can flip sign entirely (a
"fixed" setup once scored worse on re-run than the original unfixed baseline); don't trust fewer
than ~15 samples per condition for anything you intend to compare against the published numbers.
If you're resource-constrained, n=5 is a usable floor for a rough signal, but say so explicitly
when reporting — don't present a small sample with the same confidence as n=15.

For every run, record:
- **Total tokens** (input + output, whatever your tooling reports as the full cost of that one
  build call)
- **Wall-clock duration** (real elapsed time for that one build call)
- **Tool-call count**, if your harness exposes it (useful for diagnosing *why* a cost differs, the
  same way this project traced the image-prompt gap to a 6-vs-3 tool-call difference)

After collecting all 15 per condition, compute: **mean, median, min, max, standard deviation, and
coefficient of variation (stdev/mean × 100)**. Report all six, not just the mean — the CV
(consistency) is as important a finding on this page as the mean (cost).

## The target component ("PreviewPanel")

A "Preview" panel: a title bar, an info banner with a reset action, a six-row checklist, and a
warning callout. Exact content (verbatim — transcribe exactly, including punctuation):

- **Header**: title `"Preview"`, a close (×) icon button on the right.
- **Info banner**: an info icon, text `"Preview — nothing entered here is saved."`, and a "Reset"
  button with a refresh icon on the right.
- **Checklist**, heading `"Checklist"`, six rows, each an unchecked checkbox with a label:
  1. `Pre-Fab Checkprint comments resolved`
  2. `Pre-Fab Attribute Matrix comments resolved`
  3. `Pre-Fab Data Release form comments resolved`
  4. `As Built model data supplied by DE`
  5. `No blocking quality items`
  6. `All anticipated Post-fab decisions documented`
- **Warning callout**: a clock icon, bold title `"DPK can now move to Post-fab In Progress"`, and a
  secondary line `"Some required items in this section are still incomplete."`

## Setup

You need a working checkout of this repo (or at minimum `packages/core`, `packages/theme-clean`,
and `antd` installed as real dependencies — not stubbed). The existing scaffolds under `bench/` are
the reference implementation of this exact setup:

- `bench/antd-text/` — Vite+React+TS, `antd` + `@ant-design/icons` installed, `src/Component.tsx`
  exports `PreviewPanel`.
- `bench/rebar-dsl/` — Vite+React+TS, `rebar-ui` + theme installed, plus the placement-layer files
  described below; the file the model writes is `src/panel.ts`.

If you're running this in a **fresh clone** rather than reusing this repo's `bench/` scaffolds
directly: clone 15 independent copies of each scaffold type per condition (so no run shares
state/cache with another), and run `pnpm install` (or your package manager's equivalent) once
before dispatching any build so all dependencies resolve — a real mistake this project made once
was dispatching build agents before dependencies were linked, which corrupts the measurement by
making agents waste calls on unrelated dependency errors.

### The placement-layer schema (for the rebar-ui conditions)

This is the exact, already-validated schema and renderer — reuse them verbatim, don't ask the
model under test to reinvent them (that would test something different: schema-design ability, not
build cost). Place these three files in each `rebar-ui` scaffold at `src/schema.ts`,
`src/icons.tsx`, `src/PanelRenderer.tsx`:

**`src/schema.ts`:**
```ts
export type IconName = "close" | "info" | "refresh" | "clock";
export type Tone = "info" | "warning" | "success" | "error";
export interface Action { label?: string; icon?: IconName; }
export type Section =
  | { type: "banner"; tone: Tone; icon?: IconName; text: string; action?: Action }
  | { type: "checklist"; heading?: string; items: string[] }
  | { type: "callout"; tone: Tone; icon?: IconName; title: string; subtitle?: string };
export interface PanelHeader { title: string; action?: Action; }
export interface PanelDocument { type: "panel"; header?: PanelHeader; sections: Section[]; }
```

**`src/icons.tsx`:**
```tsx
import type { SVGProps } from "react";
import type { IconName } from "./schema";

function makeIcon(children: React.ReactNode, viewBox = "0 0 16 16") {
  return function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg width={16} height={16} viewBox={viewBox} fill="none" aria-hidden="true" {...props}>
        {children}
      </svg>
    );
  };
}

export const IconClose = makeIcon(
  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
);
export const IconInfo = makeIcon(
  <>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="4.75" r="0.9" fill="currentColor" />
    <path d="M8 7.25V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>,
);
export const IconRefresh = makeIcon(
  <>
    <path d="M13 8A5 5 0 1 1 11.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 3V6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>,
);
export const IconClock = makeIcon(
  <>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4.75V8L10.25 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>,
);

export const ICONS: Record<IconName, ReturnType<typeof makeIcon>> = {
  close: IconClose,
  info: IconInfo,
  refresh: IconRefresh,
  clock: IconClock,
};
```

**`src/PanelRenderer.tsx`** — reuse `bench/rebar-dsl/src/PanelRenderer.tsx` from this repo verbatim
(it's ~100 lines; not reproduced here to keep this doc shorter — copy the file directly). It is the
*only* file that decides layout; the model under test never touches it, only `src/panel.ts`.

**`src/App.tsx`:**
```tsx
import { panel } from "./panel";
import { PanelRenderer } from "./PanelRenderer";

export default function App() {
  return <PanelRenderer doc={panel} />;
}
```

**`src/panel.ts`** starts as a placeholder before each run:
```ts
import type { PanelDocument } from "./schema";
export const panel: PanelDocument = { type: "panel", sections: [] };
```

Reset `src/panel.ts` back to this placeholder between every run of the rebar-ui conditions.
Likewise reset `bench/antd-text/src/Component.tsx` (and its image-condition equivalent) to:
```tsx
export function PreviewPanel() {
  return null;
}
```

## The prompts

Use these verbatim (or as close as your harness allows) for all four conditions. Every run within
a condition gets the *identical* prompt — the only thing that varies is the model doing the build.

### 1. antd-text

> Implement the React component in `src/Component.tsx` (exported as `PreviewPanel`, a named
> export, no props) using `antd` components (Alert, Checkbox, Button, Typography, Card, etc. —
> whatever fits best) and `@ant-design/icons` for icons. The component is a "Preview" panel: a
> title bar with "Preview" on the left and a close (×) icon button on the right; below it an
> info-style banner with an info icon, the text "Preview — nothing entered here is saved.", and a
> "Reset" button (refresh icon) on the right; then a "Checklist" heading followed by six bordered
> rows, each an unchecked checkbox with a label — "Pre-Fab Checkprint comments resolved", "Pre-Fab
> Attribute Matrix comments resolved", "Pre-Fab Data Release form comments resolved", "As Built
> model data supplied by DE", "No blocking quality items", "All anticipated Post-fab decisions
> documented"; then a warning/amber callout with a clock icon, bold title "DPK can now move to
> Post-fab In Progress", and secondary line "Some required items in this section are still
> incomplete." Match antd's own defaults/spacing rather than fighting them. After writing, run
> `npx tsc --noEmit` to verify it typechecks. Do not run a dev server or take screenshots.

### 2. rebar-ui-text

**Do not use a "read `schema.ts` first" style prompt here if your model is a single completion
call with no file access** (no agentic tool use, no ability to actually open a file) — a first
pass of this protocol used exactly that style, scored 0/15, and every failure traced back to the
model guessing the schema's shape from prose alone (inventing `"info-banner"` instead of
`"banner"`, wrapping checklist items in `{ label: string }` objects instead of plain strings) since
the "read the file" instruction was simply unreachable. Rewriting to inline the full schema
directly, exactly the same way the `rebar-ui-image` prompt already does below, took it to 15/15.
Use this version:

> Your only task: write `src/panel.ts`. Do NOT read `schema.ts`, `PanelRenderer.tsx`, or
> `icons.tsx` — everything you need is below (this is a single API call with no file access, so
> those files aren't actually reachable regardless). Write `src/panel.ts` with exactly this shape:
>
> ```ts
> import type { PanelDocument } from "./schema";
> export const panel: PanelDocument = {
>   type: "panel",
>   header: { title: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } },
>   sections: [ /* array of Section, see below */ ],
> };
> ```
>
> A `Section` is one of exactly these three shapes — use these exact `type` strings, no others,
> and `items` must be plain strings, never objects:
> - `{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", text: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } }`
> - `{ type: "checklist", heading?: string, items: string[] }` — items is an array of plain strings
>   like `["First item", "Second item"]`, NOT `[{ label: "..." }]`.
> - `{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", title: string, subtitle?: string }`
>
> Describe a "Preview" panel: header title "Preview" with a close-icon action; a banner section
> (tone "info", icon "info", text "Preview — nothing entered here is saved.", action label "Reset"
> with icon "refresh"); a checklist section (heading "Checklist", items: "Pre-Fab Checkprint
> comments resolved", "Pre-Fab Attribute Matrix comments resolved", "Pre-Fab Data Release form
> comments resolved", "As Built model data supplied by DE", "No blocking quality items", "All
> anticipated Post-fab decisions documented"); and a callout section (tone "warning", icon "clock",
> title "DPK can now move to Post-fab In Progress", subtitle "Some required items in this section
> are still incomplete."). After writing, run `npx tsc --noEmit` to verify it typechecks. Do not
> run a dev server or take screenshots.

The general lesson, not specific to this one condition: **before using any prompt from an agentic
context (one that says "read this file," "look at that component," etc.) against a non-agentic,
single-completion-call harness, inline whatever it references directly instead.** A prompt that
assumes tool access silently breaks the moment it runs somewhere without it — on any model, not
just Qwen.

### 3. antd-image

Same as antd-text's prompt, but replace the written content description with: *"Read the reference
image at `[path to reference-preview-panel.png]` first, then implement the component to match it."*
Keep the rest of the antd-text prompt's instructions (component list, verification steps) as-is —
just swap the source of the content spec from prose to the image.

If you don't have access to this repo's `bench/reference-preview-panel.png`, generate or source
your own reference screenshot showing the exact content spec above, laid out as a real panel — the
image itself doesn't need to look identical to this project's reference, but the *content* it
depicts must match exactly (same header, same banner text, same six checklist items, same callout
text), so a model reading it produces content comparable to what this protocol's text-prompt
conditions specify.

### 4. rebar-ui-image (use this version, not a naive one)

This project found that a naive image prompt (just "here's an image, write `panel.ts`") measurably
lost to antd on this model — reading a picture and mapping it onto the schema took extra lookup
that a spelled-out prompt doesn't need. Use the refined version directly:

> Your only task: write `src/panel.ts`. Do NOT read `schema.ts`, `PanelRenderer.tsx`, or
> `icons.tsx` — everything you need is below. First, read the reference image at
> `[path to reference-preview-panel.png]`. Then write `src/panel.ts` with exactly this shape:
>
> ```ts
> import type { PanelDocument } from "./schema";
> export const panel: PanelDocument = {
>   type: "panel",
>   header: { title: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } },
>   sections: [ /* array of Section, see below */ ],
> };
> ```
>
> A `Section` is one of exactly these three shapes — pick whichever matches each visual element in
> the image, top to bottom:
> - A colored banner strip with an icon, a line of text, and (optionally) a trailing button:
>   `{ type: "banner", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", text: string, action?: { label?: string, icon?: "close"|"info"|"refresh"|"clock" } }`
> - A heading followed by a vertical list of checkbox rows:
>   `{ type: "checklist", heading?: string, items: string[] }`
> - A colored callout box with a bold title line and a secondary (lighter) line below it:
>   `{ type: "callout", tone: "info"|"warning"|"success"|"error", icon?: "close"|"info"|"refresh"|"clock", title: string, subtitle?: string }`
>
> Transcribe all visible text exactly as shown (including punctuation). Match tone/icon choice to
> the visual color/icon shown. A close (×) icon top-right of the title bar maps to the header's
> `action.icon: "close"`. After writing, run `npx tsc --noEmit` to verify it typechecks. Do not run
> a dev server or take screenshots.

## Verification

A run only counts toward the stats if it's actually correct — don't include a run that failed to
typecheck or render. For every run:

1. **Typecheck**: `npx tsc --noEmit` must pass with no errors.
2. **Render check** (do this for at least min/median/max of each condition, ideally more): render
   the component and confirm no console/page errors, and that all the expected text content is
   present. If your tooling has browser automation (Playwright or equivalent), also confirm DOM
   order matches the intended reading order (header → banner → checklist heading → 6 items in
   order → callout title → subtitle) — this project uses
   `document.createTreeWalker(root, NodeFilter.SHOW_TEXT)` to extract visible text in DOM order and
   diff it against the expected sequence.
3. If you can capture screenshots, do — a fixed-viewport screenshot per run (this project used
   560×620) lets you both eyeball consistency and compute a real visual-consistency metric (see
   below), the same way `/benchmarks` does.

## Optional: the visual-consistency metric

If you can capture per-run screenshots, this project's method for turning "do these look the same"
into a real number: align all 15 screenshots per condition pixel-for-pixel, convert each to
grayscale luminance, compute the standard deviation across the 15 runs at every pixel, then average
that over the whole image — a single number on a 0-255 scale, where 0 means every run rendered that
pixel identically. Also report what % of pixels have a stdev above some threshold (this project
used 10) as an intuitive "how much of the image actually varies" figure. This doesn't require any
special library — any environment that can decode PNGs into pixel arrays (a canvas, PIL/Pillow,
etc.) can compute it.

## Reporting back

For direct comparability with the existing `/benchmarks` page, report, per sub-experiment:
- n (how many valid runs)
- mean / median / min / max / stdev / CV for tokens
- same six stats for wall-clock duration
- the visual-consistency numbers, if captured
- anything that had to change about the prompts/setup to get this model to produce valid output
  (this is itself a finding — e.g. if the model needed a different level of prompt detail than
  Claude did, that's evidence for or against the "constrained schema helps a weaker model more"
  hypothesis this whole protocol exists to test)
- your model name/version and the date you ran this

Whatever comes back, report it as found — including if the hypothesis is wrong (e.g. if the
cheaper model does *worse*, relatively, via the placement layer than via antd-direct, because it
struggles with the schema's type constraints more than with antd's familiar API). That would be a
real, useful, non-obvious finding too, not a failed experiment.
