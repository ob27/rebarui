# rebarui

Rebar UI: a headless-first, intentionally low-fidelity ("Balsamiq-as-code") React component
library, designed to be re-skinned into a real design system later — by hand or by an LLM —
without rewriting component structure or breaking Playwright tests.

## Planning docs live in `ref/`

All planning, architecture, and assessment documents for this project go in `ref/`, not scattered
across the repo or left only in conversation. Current docs:

- `ref/chat-export-1787916853126.json` — the original brainstorm this project grew out of (raw
  export, not edited).
- `ref/ASSESSMENT.md` — critical review of that brainstorm: what's solid, what changed, why.
- `ref/PLAN.md` — the actual plan: vision, v0.1 scope, phases.
- `ref/ARCHITECTURE.md` — technical architecture: package layout, component API conventions,
  theming, migration adapters, devtools, testing.
- `ref/HEURISTICS.md` — the default design/behavior rules baked into components, with sources.
- `ref/MARKETING_SITE.md` — the docs/marketing site plan (structure, framework, IA), benchmarked
  against mermaid.js.org.
- `ref/PLACEMENT_LIVE_DATA.md` — a scoped, not-yet-built proposal for letting `@rebar-ui/placement`
  blocks bind to live data/handlers instead of only static JSON, prompted by Coherence's two
  rebuilds both bypassing the Packer entirely for exactly this reason.

When plans change, update these files in place rather than creating new ones alongside them —
they're living documents, not a changelog. New planning docs (e.g. a future phase's detailed
design) also go in `ref/`.

`PACKER_COVERAGE.md` (repo root, not `ref/`) — measured inventory of how much of `apps/docs` is
Packer-printed vs. hand-authored, with a prioritized gap list. Regenerate the numbers via
`pnpm --filter docs run audit:packer`. Lives at root rather than in `ref/` so it's actually tracked
by git — `.gitignore`'s blanket `ref/` rule had silently kept it (and a couple other `ref/` docs)
out of version control entirely.

## Agent context: `agents.md`

Before designing a new component, building a block, or using the Packer (`@rebar-ui/placement`)
to compose a page, read `packages/core/agents.md` — the compressed, single-file context for
exactly these tasks: Framework Rules vs. Heuristics (a fixed, binary constraint vs. a
judgment-requiring design principle — don't conflate the two), the controlled/uncontrolled
component pattern, the block-authoring conventions, the full block/component catalogs, and the
46-item heuristics checklist condensed to one line each. It's also published live at
`/docs/robot-md` and ships inside the real `rebar-ui` npm tarball (see that package's `package.json`
`files` list) for a consumer's own agent. Keep it in sync with `ref/HEURISTICS.md`/
`ref/ARCHITECTURE.md` when either changes — it's a compressed derivative of those, not an
independent source of truth.

**`apps/docs` (the marketing site) is this project's own dogfooding workbench** — the goal is for
it to be printed by the Packer end to end, not hand-authored `rebar-ui` JSX, so a new component or
block proves itself immediately on the site that documents it. Touching `apps/docs` to add content
is a Framework Rule trigger, not a free pass: if the needed shape doesn't exist as a block yet,
close that gap in order (component in `packages/core`, if needed → block in `@rebar-ui/placement`
→ printed page), never a hand-rolled shortcut. `PACKER_COVERAGE.md` (repo root) is the measured inventory
of how far along each page actually is (via `pnpm --filter docs run audit:packer`, which reads the
`data-rebar-placement-block` "maker's mark" every `BlockRenderer`-rendered block already carries)
— check it, don't assume.

## Narration audio — regenerate it when you edit the content it reads aloud

A small set of pages carry pre-generated narration audio (the Alcuin voice, via Alibaba Cloud
Model Studio's `qwen3-tts`): the `doc-section` `narration` field (a small play icon next to a
section heading — see `packages/placement/src/schema.ts`'s own doc comment on that field) on the
**Philosophy** and **When to reach for this tier** sections of the five tier pages
(`/imitations`, `/synthetics`, `/opinions`, `/orders`, `/geneses`); the same field on every
`heuristic` block's own `title` (all 46 entries on `/heuristics`, plus that page's intro
`doc-section`) and on all three `doc-section`s on `/about/benchmarks`; the same two `doc-section`
headings on `/archetypes` itself (`Where Interfaces Come From`, `Why the ancestry still matters`);
and a whole-page `WaveformAudioPlayer` on each archetype essay page (`/archetypes/<slug>`)
narrating the full essay start to finish.

**The rule**: if you edit the text of any of those specific sections/pages, regenerate its
narration in the same change — don't ship narration that's read a stale version of the copy it's
supposed to be reading. `apps/docs/scripts/generate-narration.mjs`'s own `NARRATION_SOURCES`
constant is the single source of truth for what gets narrated; update the entry there to match the
new copy, then run:

```
DASHSCOPE_API_KEY=sk-... node apps/docs/scripts/generate-narration.mjs
```

It hashes each entry's text and skips anything unchanged (each real run costs money — never
regenerate the whole set speculatively), writing `apps/docs/public/narration/<id>.mp3` plus a
manifest tracking what's been generated. Requires `ffmpeg` on PATH (used to transcode/concatenate
the synthesized audio chunks) and a real Alibaba Cloud Model Studio API key — ask the repo owner
for one rather than guessing at credentials. If a *new* page/section should get narration (not just
edited text on an existing one), add it to `NARRATION_SOURCES` and to the relevant
`doc-section`'s `narration` field (or the new archetype page's `WaveformAudioPlayer`) in the same
change, not as a follow-up.

This is a manual, per-change rule (not a CI job) — there's no automatic trigger watching for these
edits, so catching this is on whoever (human or agent) makes the edit.

## Exploratory Analysis Workflow

**Before doing any manual analysis, ask yourself:**
> "Should I just create an automated tool instead?"

Exploratory tasks are largely try-fail. Manually reasoning through data, grepping for patterns,
or iterating by hand will take forever. Instead:

1. **Build automated tools** that systematically test hypotheses across all data
2. **Generate comprehensive output** that analyzes all possibilities
3. **Let the tool identify patterns** rather than manually searching for them
4. **Iterate on the tool**, not on manual commands

Example: `packages/dgn-viewer/brute-force-geometry.ts` analyzes all byte offsets and data types
for geometry elements, flagging reasonable values automatically. This is the pattern to follow.

## DGN Viewer TODO (`packages/dgn-viewer/`)

Clean-room reverse-engineered DGN V8 parser. Source excluded from git (obfuscation strategy),
minified `dist/` committed. Full derivation log in `packages/dgn-viewer/DERIVATION_LOG.md`.

### Reverse Engineering Workflow

**Before manual analysis, ask:** "Should I create a brute force runner/helper instead?"

Binary format parsing is try-fail. Build automated tools that systematically test hypotheses across all data, then let the tool identify patterns rather than manually searching.

Example: `brute-force-geometry.ts` analyzes all byte offsets and data types for geometry elements, flagging reasonable values automatically.

- [x] **Text element extraction (type 17)** — working: 392 elements with position + string content extracted.
- [x] **Cell placement extraction (type 2)** — placement position/scale extracted (59 elements); sub-element/cell-library geometry definitions are a separate, unstarted item (see below).
- [x] **Line/LineString/Shape extraction (types 3/4/6)** — fixed 2026-09-04: was regressed to 0 elements (a `uint32` "vertex count" field was being read and validated, but it's not a real count — it's garbage). Real layout: vertices start at `dataOffset` directly, `N = floor((dataSize-4)/16)` 16-byte `(Float64 X, Float64 Y)` pairs, divide by 1,000,000. Now extracts 3398 elements, validated file-wide (see `packages/dgn-viewer/HANDOFF.md`).
- [x] **Circle/arc/ellipse/line placement transform** — fixed 2026-09-04: every type-2 cell is named "ATRPTH" and placed at genuinely varying positions; a running per-stream cell transform is now applied to line/circle/arc/ellipse elements.
- [x] **Arc/ellipse center field** — fixed 2026-09-04: the Float32 center used since Phase 14 was a coincidental misread of the upper 4 bytes of a real Float64 coordinate 4 bytes earlier (an IEEE-754 quirk that happens to look internally consistent while being wrong — see `packages/dgn-viewer/HANDOFF.md` "The bug that looked right" for why self-consistency checks alone didn't catch it). Now reads the real Float64 field; verified within 3 units of the independently-validated line-vertex cluster for 217/217 arcs and ~918/918 ellipses.
- [x] **"ATRPTH" glyph identified** — a ring of arcs + rotated ellipses + a center crosshair of tiny lines: a classic survey control-point/target marker symbol, cross-checked against `ref/dgn-reference/screenshot-13.png`/`-14.png` (the reference viewer's own Layers panel, which independently confirms this session's `Dgn^Nm` decode). At normal view scale this reads as the plain numbered circles seen in `screenshot-11.png`/`-12.png`.
- [x] **Text element string content** — fixed 2026-09-04: `elementName` never extracted (wrong offset, `+168` vs the real `+58`). Now decodes real content matching the project's known vehicle-check terminology exactly (e.g. `"B-Double (26.0m) - Mandatory Stop"`, `"Passenger vehicle (5.2 m)"`, percentages, and plain numbers `"1"`-`"47"`).
- [ ] **Master layout / reference-attachment placement not found** — 47 of the 59 "ATRPTH" cells sit at literal local `(0,0)`; their real-world position (if any) needs a reference-attachment/model-placement table this session hasn't located, so only 12/59 cells currently have any position relative to each other. The numbered text (`"1"`-`"47"`) turned out to live in a separate paper-space reference frame (1480+ units from any cell — not spatial marker labels as first assumed) and its exact meaning (sheet number? table row?) is unresolved. See `packages/dgn-viewer/HANDOFF.md` "The two-space problem" and "If you want to keep going" for specifics; this is the most promising remaining lead if reconstructing the full alignment (`screenshot-11.png`) is still a goal.
- [ ] **Commit obfuscated code to GitHub** — dist/ is now tracked, ready to push. Commit message should reference clean-room methodology.
