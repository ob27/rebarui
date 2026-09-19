# Adding constructs to Rebar UI — a guide for agents

You are about to add a new construct (a `packages/core` component, a `@rebar-ui/placement` block,
or both) and/or its reference page on the docs site (`apps/docs`). This file is the checklist that
keeps that work from silently breaking the site — a missing entry in one of several
cross-referenced data files produces a real, but easy-to-miss, defect: a 404, a sidebar entry with
no page, a props table that's empty, a "live example" that's actually just a static screenshot.
Read this before touching any of the files below, and re-check it before you consider the work
done.

**Read `ref/TIERS.md` and `ref/HEURISTICS.md` before this file if you haven't already** — this
file assumes you already know the tier system and the 47-item heuristics checklist. It doesn't
repeat them, only how to actually execute against them without missing a step.

## First: component, block, or both?

- **Component** (`packages/core`) — a single primitive with its own behavior/state (`Select`,
  `Dialog`, `SignaturePad`). Lives at `packages/core/src/components/<Name>.tsx`.
- **Block** (`@rebar-ui/placement`) — a named, pre-decided *layout* of one or more components that
  an LLM picks by supplying content, not markup (`card-grid`, `nav-index`, `site-header`). Lives as
  a variant in the `Construct` union in `packages/placement/src/schema.ts`, rendered by a `case` in
  `packages/placement/src/BlockRenderer.tsx`.
- **Both** — a real component wrapped by a thin block (`nav-bar` wraps `NavBar`, `wizard` wraps
  `Wizard`, `site-header` wraps `NavBar` + more). Build the component first, to the full checklist
  below, then the block as a separate, later step — never skip straight to the block.

If what you're building turns out to be neither — just a new prop on something that already
exists — say so and don't build a new construct. (Two real precedents: "Masked Input" turned out to
be a `mask` prop on `Input`; "Banner" turned out to already be covered by `Alert`.)

## Classify the tier before writing any code

Every construct — component or block — has a tier: **Imitation, Synthetic, Opinion, or Order**
(Genesis is reserved, not a build target). Get this right *before* implementation, because it
changes what "correct" looks like:

- **Imitation** — a standalone primitive, no composition of other named rebar-ui constructs, no
  real internal state beyond mirroring a controlled/uncontrolled value.
- **Synthetic** — a static composition of primitives, no real dynamism (no state machine).
- **Opinion** — real internal state that branches the component into meaningfully different
  rendered/behavioral modes (open/closed with focus management, filtered-list + highlighted-index,
  multi-step flow, drag/reorder) — not just "has a value." For a **block**, this is mechanically
  derived (see below), not a judgment call.
- **Order** — page/macro-level structural governance (nav shells, layout grids, app shells). A
  different axis from complexity, not "one tier above Opinion."

**The composition test** (Imitation vs. Synthetic): if your component imports/renders another
*named* rebar-ui component, it cannot be Imitation. Precedent: `Pagination`/`SegmentedControl`/
`Selector`/`NumberInput` all reimplement a raw `<button>` internally specifically to stay Imitation
rather than importing `Button`.

**The delegated-state exception** (for Opinion): a component can show *zero* of its own `useState`
and still be Opinion, if it delegates its entire state machine to something else with real state —
a wrapped Radix primitive, a chart interaction hook, another Opinion-tier component. You cannot
determine tier by grepping a file for `useState`.

**For blocks specifically, Opinion is mechanical, not a judgment call**: a block is Opinion if and
only if its schema variant has a *literal, top-level* field named `source` (a live-data binding —
see `packages/placement/src/opinions.ts`, which derives `OpinionConstructType` from
`schema.ts` by scanning for exactly this). This has a sharp, easy-to-trip edge: adding a
live-data-binding field to a *non*-Opinion block's schema must **nest** it (e.g.
`constructSearch.source`, not a top-level `source`) or you will silently flip that block's
mechanical classification. `apps/docs/src/data/constructTier.ts` has a compile-time assertion
(`_noExtraOpinionsHere`/`_noMissingOpinionsHere`) that catches this — if it fails to typecheck
after you add a schema field, this is almost certainly why.

## Building a new `packages/core` component — the full checklist

Every one of these, in order, for every new component. Skipping one doesn't fail loudly — it fails
as a quiet gap someone finds later.

1. **The component file**: `packages/core/src/components/<Name>.tsx`. Real semantic HTML or a
   Radix primitive underneath (never a from-scratch reimplementation of something Radix already
   solves correctly — focus trapping, roving tabindex, etc.). `data-rebar-component="<kebab-name>"`
   on the root, `data-rebar-part="<part>"` on meaningful sub-elements. A doc comment on the
   exported function explaining *why* it's classified the tier it is (cite a precedent component if
   the classification isn't obvious from the composition/delegated-state rules above).
2. **CSS** in `packages/core/src/styles/style.css`. Reuse existing `--rebar-*` tokens — never
   invent a new one on the assumption it "should" exist (e.g. there is no
   `--rebar-color-error-bg`; the real token is `--rebar-color-danger-bg`; check `style.css`'s own
   `:root` block before assuming a name). Monospace text is plain `font-family: monospace`, not a
   token — there is no `--rebar-font-family-mono`.
3. **Tests** in `packages/core/src/test/<Name>.test.tsx`. Cover: role/accessible name, keyboard
   operability, the controlled/uncontrolled value contract if it has one, and every new prop's
   observable effect. See "jsdom limitations" below before you write a test that touches canvas,
   pointer drag math, media elements, or the Fullscreen API — several of these simply don't work in
   jsdom and the fix is a smaller, honest test, not a workaround.
4. **Export** from `packages/core/src/index.ts` — the component and its prop type.
5. **Classify** in `apps/docs/src/data/constructTier.ts` — add to `CONSTRUCT_TIER.component`.
6. **Register for prop-table generation**: add the filename to the `COMPONENT_FILES` array in
   `apps/docs/scripts/generate-props.mjs`. Without this, `componentProps["YourComponent"]` in a
   reference page silently resolves to `undefined` and the props table renders empty — no error,
   just a quiet gap (see "the 9-page audit" story below).
7. **Route mapping**: add `YourComponent: "/<tier-route>/<kebab-name>"` to
   `apps/docs/src/data/hasFullPage.ts`. This is the single source of truth several other things key
   off of (sidebar nav, the "no reference page yet" fallback, `audit-examples.mjs`'s own component
   resolution) — get the tier route right (`/imitations`, `/synthetics`, `/opinions`, `/orders`)
   or those all disagree with each other.
8. **The reference page** — see the dedicated section below; don't treat this as an afterthought.
9. **Verify**, in this order (see "Verification, in the order that actually catches problems"
   below) — don't skip straight to build/deploy.
10. **Repo-root gate**: `pnpm run lint`, `pnpm run test`, `pnpm run typecheck` from the repo root
    (not just the package) — confirms nothing else in the monorepo broke.
11. **Commit, push, deploy** — see "Shipping" below.

## Building a new block — the full checklist

1. **Prerequisite components first**, each shipped to the checklist above, independently — never
   build a block against a component that doesn't exist yet or isn't tested yet.
2. **Add the shape** to the `Construct` union in `packages/placement/src/schema.ts`. Doc-comment
   every field, especially anything non-obvious (a live-data `source` field must explain what it
   binds to and why it's nested rather than top-level if the block isn't Opinion-tier — see above).
3. **Add a `case` to `BlockRenderer.tsx`** rendering the real component(s), with
   `data-rebar-placement-block="<type>"` and `data-rebar-block-path={path}` on the rendered root —
   this is the "maker's mark" `PACKER_COVERAGE.md`'s own audit script reads to measure how much of
   a page is Packer-printed vs. hand-authored. Don't skip it because the block "is obviously
   Packer-rendered" — the audit can't tell the difference without it.
4. **Classify** in `apps/docs/src/data/constructTier.ts`'s `CONSTRUCT_TIER.block` — this is
   type-checked against `packages/placement/src/opinions.ts`'s mechanically-derived
   `OpinionConstructType`; a mismatch is a compile error, not a runtime surprise, which is exactly
   why it's worth getting the nested-vs-top-level `source` field placement right the first time
   (see the tier-classification section above).
5. **Tests** in `packages/placement/src/test/` covering DOM output, prop-to-render mapping, and any
   real interaction (open/close, live-data resolution via `data`/`handlers`).
6. **The reference page** — same bar as a component's, below.

## Building the reference/detail page

This is where most of the actual gaps in this project have historically come from — not missing
implementations, but reference pages that don't actually demonstrate what they claim to. Follow
this exactly.

### The page itself

- Path: `apps/docs/src/app/<tier-route>/<kebab-name>/page.tsx`, where `<tier-route>` matches what
  you put in `hasFullPage.ts` (`imitations`/`synthetics`/`opinions`/`orders`).
- Structure: `<Heading level={1}>`, a one-paragraph `<Text color="secondary">` description, **a
  real live/interactive render of the actual construct** (not just a code sample — see below), then
  `<NextBlockRenderer blocks={BLOCKS} />` for the rest of the doc content (Code sample, Props table,
  discursive `doc-section`s, `data-rebar-*` attributes, Migrating-to-Ant-Design note).
- **A props table needs `import componentProps from "@/generated/component-props.json"`** and a
  `{ type: "props-table", heading: "Props", rows: componentProps["YourComponent"] ?? [] }` entry in
  `BLOCKS`. This only produces real rows if step 6 of the component checklist above (registering
  the filename in `generate-props.mjs`) actually happened — verify by running
  `pnpm --filter docs run typecheck` and checking the printed `Generated props for N components:
  ...` list includes your component's name.
- **A block-only page** (no real `packages/core` component backing it, e.g. `modal`, `mega-menu`,
  `page-index`) gets no props table at all — there's nothing to generate rows from. Document its
  shape by hand in a `doc-section` "Shape" code block instead, and **keep that hand-written shape
  text in sync with the real `Construct` union entry in `schema.ts`** — this has drifted out of
  sync before (a page claiming `{ type: "modal", body, actions }` when the real schema was
  `{ type: "modal", blocks, confirmLabel, cancelLabel }`) and nothing catches that automatically.

### The live example has to actually be live

The single most common defect found in this project's own audits: a reference page's "Example"
section that's just a code sample, or a static screenshot standing in for a real render. Every
reference page must render the real construct doing something a visitor can interact with.
`apps/docs/scripts/audit-examples.mjs` checks this mechanically — run
`node apps/docs/scripts/audit-examples.mjs` after adding a page and confirm it doesn't appear in
the output. It works by stripping every `code: \`...\`` sample out of the page's source and then
checking for either a real `<ComponentName` JSX tag or a real `type: "block-type"` object literal
in what's left.

Specific traps that produced real bugs in this project, so you don't repeat them:

- **A block that's hard-coded `open`/non-dismissible for static-render contexts** (e.g. `modal`,
  which forces `open` with no close handler by design, since it's meant for a mockup/benchmark
  screenshot) will hold the whole page hostage with no way to dismiss it if you drop the raw block
  literal into a normal page. Build the live example with the real underlying **component**
  instead (e.g. a real `<Dialog trigger={...} .../>` with a working open/close lifecycle), and
  explain in prose *why* the raw block behaves differently.
- **`page-index`** renders a real `position: sticky` element that only works as a direct flex item
  of a two-column row the *calling page* constructs by hand (`<Stack direction="row"><main
  column/><NextBlockRenderer blocks={[{type:"page-index", sections}]} /></Stack>`) — dropping it
  into the normal single-column `BLOCKS` array produces an invisible, zero-height element, not an
  error. See `/heuristics` or `/about/benchmarks/scenarios` for the working row-layout pattern to
  copy, and note that splitting the row into two separate `NextBlockRenderer` calls means the
  auto-derive-sections-from-headings path can't see the other column's headings — pass an explicit
  `sections` list in this shape, don't rely on auto-derive.
- **`gallery`** needs real image files matching `${prefix}-01.png` through `${prefix}-NN.png` in a
  real `public/` directory — reuse this project's own existing benchmark screenshots
  (`/benchmark-screenshots`, prefix `antd-text`, 15 files) rather than fabricating a path that
  doesn't exist.
- **A component whose "off-screen until focused" or "hidden until hover" trick relies on
  `position: absolute` relative to a nearby ancestor** (SkipLink, an edge-hover toggle) will only
  look right if that ancestor actually clips overflow (`overflow: hidden`) — otherwise "hidden"
  content just renders on top of whatever precedes it on the page instead of disappearing. Give the
  demo's own wrapping box `overflow: hidden` when you build a demo like this.
- **A component that pokes content outside its own border on purpose** (an edge-anchored toggle
  button at `right: -14px`, say) needs its demo box to have enough padding/`overflow: visible` to
  not truncate that content — this is a demo-authoring detail, not a component bug, but it looks
  exactly like one if you miss it.

### Sub-components sharing a parent's page

If your component is a sub-part of an existing page (like `FormItem` inside `Form`'s page, or `Col`
inside `Row`'s), add it to `SUB_COMPONENT_EXCLUSIONS` in `apps/docs/src/data/tierSections.ts` so it
doesn't get a duplicate sidebar entry pointing at a URL nothing serves — and give it **no separate
props table** on that shared page (only the parent's own props, per the "Props" table above).

## jsdom limitations — write the test that's actually true, not the one you assumed would pass

These are real, repeatedly-hit environment limits, not project-specific bugs. Know them before you
write a test, so you don't spend an hour debugging jsdom instead of your component:

- **No real `PointerEvent` constructor** — `fireEvent.pointerDown/Move` silently drop
  `clientX`/`clientY`/`pointerId`. Real drag-math (position/size deltas) cannot be unit-tested here;
  write a "dispatching a full gesture does not throw" regression test instead, and verify the real
  math via an actual browser (see Verification, below).
- **`canvas.getContext("2d")` returns `null`** — any canvas-drawing component must guard `if (!ctx)
  return` before every draw call, and track interaction-happened state *independent* of whether
  drawing actually succeeded (don't nest a `setState` call inside a block that's gated on `ctx`
  being non-null if that state is supposed to reflect "did the user do something," not "did the
  canvas paint").
- **`canvas.toDataURL()` / `HTMLCanvasElement.toDataURL` can return `null`/falsy or throw
  "not implemented"** — never pass it straight through a prop typed as `string`; guard with `|| ""`.
- **`<img>`/`Image().onload` does not fire** — a component that only updates state inside an
  uploaded/loaded image's `onload` callback cannot have that state change asserted in a unit test;
  write a "does not throw" test for the interaction and treat the real behavior as browser-verified
  only.
- **`HTMLMediaElement.play`/`pause` exist but do nothing** — mock them with `vi.spyOn(...).
  mockImplementation(...)`; `<audio>`/`<video>` `.duration` is a getter-only `NaN` stub — override
  per-test with `Object.defineProperty(el, "duration", { configurable: true, value: seconds })`.
- **The Fullscreen API is unimplemented** — mock `requestFullscreen`/`exitFullscreen`/
  `document.fullscreenElement` manually if a component uses them.
- **`data-rebar-*={x || undefined}` patterns**: when `x` is `false`, React omits the attribute
  entirely rather than rendering `="false"` — assert `.not.toHaveAttribute(...)`, never
  `.toHaveAttribute(..., "false")`.

## Verification, in the order that actually catches problems

Running these out of order wastes time — each step is ordered so an earlier failure stops you
before you sink effort into a later one.

1. `pnpm --filter rebar-ui run build` — **rebuild `packages/core` after every change to it**,
   including CSS-only changes. `apps/docs` imports `rebar-ui/style.css`, which resolves to
   `packages/core/dist/style.css` — a *built* artifact. Editing
   `packages/core/src/styles/style.css` and then only rebuilding `apps/docs` ships stale CSS with
   no error or warning anywhere; this has actually happened in this project and cost a full extra
   round of "why doesn't my fix show up" debugging. If you changed anything under `packages/core/
   src/`, this is always your first command, before `pnpm --filter docs run build`.
2. `npx vitest run <new-test-file>` (from `packages/core` or `packages/placement`) — fast, targeted
   feedback on the thing you just wrote.
3. `pnpm --filter docs run typecheck` — regenerates `component-props.json` and prints
   `Generated props for N components: ...`; confirm your component's name is in that list, and that
   the printed count increased if you added one.
4. `pnpm --filter docs run build` — must exit 0. Also run `node apps/docs/scripts/audit-examples.mjs`
   and confirm your new page isn't in its output.
5. **A real headless-Chromium check** — DOM-presence tests do not catch layout bugs (an item
   rendered at zero height, an icon left-aligned instead of centered, a button truncated by a
   parent's `overflow: hidden`, a native drag handle that doesn't actually move anything). Serve the
   static export (`npx serve apps/docs/out -p <port>` — do **not** pass `-s`/single-page mode, which
   silently rewrites every route to `index.html` and will have you screenshotting the homepage while
   thinking you're looking at your new page) and drive it with Playwright:
   `import { chromium } from "/Users/tom/.hermes/hermes-agent/node_modules/playwright-core/index.mjs"`.
   Screenshot it, and for anything interactive, actually click/hover/drag/type and re-screenshot —
   several real bugs in this project (a collapsed sidebar's icon centered in the wrong element, a
   `Col`'s auto-placement overlapping its sibling, an aspect-ratio clamp breaking at a drag
   boundary) were only visible this way, never in a DOM-only test.
6. `pnpm run lint`, `pnpm run test`, `pnpm run typecheck` from the **repo root** — the full
   monorepo gate, not just the package you touched.

## Shipping

Only after every step above is green:

1. `git status` / `git diff --stat` — confirm the changed-file list matches what you actually meant
   to touch (no stray files, no accidentally-reverted unrelated work).
2. Commit with a message describing *what broke or was missing and why*, not just *what file
   changed* — the "why" is what a future agent (or the site owner) needs when this file's own
   checklist didn't cover their specific case. Include
   `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` (or whichever model you are) per this
   repo's own attribution convention.
3. `git push origin main`.
4. `firebase deploy --only hosting` — deploys the `apps/docs/out` static export you already built
   in verification step 4. Don't rebuild again first; if you changed anything after that build,
   rebuild and re-verify before deploying, don't deploy something you haven't checked.

## The short version, if you've read this before and just need the list

Component: file → CSS (real tokens only) → tests (respecting jsdom limits) → export from `index.ts`
→ classify in `constructTier.ts` → register in `generate-props.mjs` → route in `hasFullPage.ts` →
real interactive reference page → rebuild `packages/core` → typecheck docs → build docs →
`audit-examples.mjs` → real-browser check → repo-root lint/test/typecheck → commit/push/deploy.

Block: prerequisite components first → schema.ts variant (mind the nested-`source` tier trap) →
BlockRenderer.tsx case with the maker's-mark attributes → classify in `constructTier.ts` → tests →
real interactive reference page → the same verification chain as above.
