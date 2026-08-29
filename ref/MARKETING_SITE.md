---
title: Rebar UI — Marketing / docs site plan
status: living document
---

# Rebar UI — Marketing / docs site plan

Reference point: **mermaid.js.org**, at the user's request. This document maps what that site
actually does structurally onto Rebar's own `apps/docs` (see
[ARCHITECTURE.md](ARCHITECTURE.md#package-layout)), keeps what transfers directly, and changes
what doesn't fit a component library.

## What mermaid.js.org actually does (checked directly, not from memory)

- It's two separate properties: **mermaid.js.org** — a docs site built on **VitePress**
  (sidebar nav, "on this page" anchors, edit-on-GitHub links, `Run ▶` buttons on code blocks that
  render the diagram inline) — and **mermaid.live** — a separate, standalone live editor app,
  linked from the docs but not embedded in them.
- Top nav: Docs / Tutorials / Integrations / Contributing / Latest News, plus a version number,
  changelog link, search (cmd/ctrl+K palette), GitHub/Discord links, light/dark toggle.
- Homepage: hero + three feature cards (Easy to use, Integrations available, Award winning) +
  contributor/sponsor grid.
- Docs sidebar is organized by content type: Introduction → Diagram Syntax (the actual reference,
  one page per diagram type) → Ecosystem → Deployment & Configuration → Contributing.

## What transfers directly to Rebar

- **The two-property split**: a docs/marketing site plus a separate, focused live-demo app. This
  is already `apps/docs` + `apps/playground` in Rebar's planned layout — no change needed there,
  just confirming the shape is right.
- **Docs organized by content type in a sidebar**, not by chronology: Getting Started → Components
  (the reference, one page per component — Rebar's analogue of "one page per diagram type") →
  Theming & Defaults → Migration → Contributing.
- **Runnable examples inline in docs pages**, not just static code blocks — mermaid's `Run ▶`
  buttons are the same instinct as "show it live, not just describe it," which matters even more
  for a UI library.
- **cmd/ctrl+K search, version number + changelog, GitHub link, light/dark toggle** in the top nav
  — standard, no reason to deviate.
- **A feature-card row on the homepage** — three cards, mermaid's pattern. Rebar's three:
  *Headless & accessible* (Radix underneath — full keyboard/ARIA support out of the box),
  *Built to be replaced* (CSS-variable theming + migration adapters — the differentiator), and
  *Playwright-proof* (`data-rebar-*` + ARIA-first testing survives the re-skin).

## What to change, and why

**Docs framework: not VitePress.** VitePress is Vue. Mermaid can get away with it because its
"live preview" is a code block that renders an SVG diagram — no framework-specific component
tree involved. Rebar's live previews *are* React component trees (a real `<RebarDialog>`
rendered live, togglable between sketch/clean/dark). Embedding a live React tree inside a
Vue-based static site is awkward and fights the tool. Recommendation: **Next.js + MDX** (Nextra is
a reasonable pre-built option on top of Next if it saves time; a hand-rolled Next+MDX setup is
fine too) — React-native, so every doc page can import and render actual Rebar components
directly, not screenshots or code-only snippets. This is the same reasoning shadcn/ui and Chakra
UI's docs sites landed on for the same kind of library.

**The marketing gimmick is dogfooding, not a visitor-facing global switch.** The docs/marketing
site itself is a real Rebar app: its nav, buttons, layout are actual Rebar components, and it
ships in production/clean mode with the dev layer off exactly the way any real consuming app would
— no special-casing, no always-on component that doesn't exist elsewhere in the architecture.
The marketing claim is proof-by-existence: *this whole site is built with Rebar, dev layer off,
and it looks like a normal, legitimate website* — not a fabricated demo of the idea, but the idea
already working. (Confirmed with the project owner directly — the alternative, a site-wide
visitor-facing sketch/clean/dark switch requiring a new always-on `packages/core` component
distinct from the dev-only DevTools panel, was considered and explicitly rejected in favor of
this simpler dogfooding framing.)

This does **not** rule out small, scoped interactive demos on the homepage (the hero panel and
"see it work" example described below) — those are just ordinary local component state within
that one demo section, flipping a `data-rebar-theme` attribute on a wrapper `div` for
illustration, same mechanism a `packages/core` consumer would use anywhere. They're not a
site-wide switch and don't require any new component beyond what a component-reference doc page
already needs (see the per-component page template below, which does the same thing per example).

`apps/playground` still gets built (per [PLAN.md](PLAN.md) Phase 5) as a deeper, multi-component
"build a whole mock screen and toggle it" demo, in the same spirit as mermaid's inline `Run ▶`
snippets vs. the full mermaid.live editor — a bigger, separate destination for people who want to
play with more than one homepage example.

**No sponsor/contributor grid at launch.** Mermaid's is a mature-project artifact (14+ core devs,
hundreds of contributor avatars). Premature for v0.1 — revisit once there's an actual community,
per the distribution philosophy already agreed in [PLAN.md](PLAN.md) (npm + GitHub, community
extends via adapters/ports).

## Information architecture

**Top nav:** Docs · Components · Performance · Migration · Playground · GitHub · search
(cmd/ctrl+K) · light/dark toggle (ordinary site chrome, not Rebar's sketch/clean gimmick) ·
version number. "Performance" added per the user's ant.design-inspired homepage restructure — see
below.

**Homepage** (restructured to mirror ant.design's actual flow — hero → theme-customization
showcase → rich-components showcase → an ecosystem-style card grid — checked directly against
the live site, not from memory):
1. Hero — tagline, `npm install rebar-ui`, and one small, self-contained demo panel (a card or
   form) with its own local sketch⇄clean toggle scoped to just that panel — illustrating the
   mechanism without implying the whole site is switching. Maps onto ant.design's hero + its
   "flexible theme customization" showcase in one step, since Rebar's theme swap already *is*
   the showcase.
2. Three feature cards (Headless & accessible / Built to be replaced / Playwright-proof).
3. "See it work" — a slightly bigger embedded example (a small form + confirmation dialog), same
   scoped local-toggle pattern, proving it holds up on composite components, not just a button.
   Maps onto ant.design's "rich components" section.
4. **Three pillars** — a card grid (ant.design's "ecosystem links" pattern) for Design
   Heuristics (`/docs/theming`), Design Components (`/components`), and Performance
   (`/benchmarks`) — the user's explicit three-pillar framing for the whole site, not just a
   copy of ant.design's specific link set.
5. Install / getting-started snippet, link into docs.
6. Footer: GitHub, license, links to `ARCHITECTURE.md`/`HEURISTICS.md`-derived doc pages,
   migration guide.

**The Benchmarks pillar** (`/benchmarks`) is the empirical complement to the DevTools token
estimate (`/docs/token-estimate`). It's no longer methodology-only — real, repeated (n=15 per
condition), Playwright-verified measured runs now live there, both a text-prompt and an
image-prompt build of the same target component, comparing AntD direct against Rebar built through
its placement layer (see "Positioning" below and [ARCHITECTURE.md](ARCHITECTURE.md#the-placement-layer--validated-direction-not-yet-a-shipped-package)).
The one standing rule carries over unchanged from when this was methodology-only: never fabricate
or round a number here — every figure on that page must trace back to a real transcript.

## Positioning: the placement layer, and when to migrate

Two things changed since this document was first written that the whole site's copy needs to
reflect, not just `/benchmarks`:

1. **Rebar is always used through its placement layer now, not hand-authored.** Earlier language
   on this page (and on the homepage) describes Rebar purely as "headless components + CSS-
   variable theming" — true, but no longer the whole story. The measured default building method
   is: an LLM writes a small typed document naming pre-built composite blocks (a banner, a
   checklist, a callout, ...), and a deterministic renderer (`@rebar-ui/placement`'s
   `BlockRenderer` — see [ARCHITECTURE.md](ARCHITECTURE.md#the-placement-layer-rebar-uiplacement))
   turns that into the real component tree. This isn't a separate "DSL mode" to explain as an
   alternative — it's simply how Rebar is built with, the same way nobody explains JSX as "the
   React DSL." Site copy should name the two heuristics that make it work, not just gesture at "a
   placement layer": **anatomical order** (each block's internal parts render in a fixed, head-to-
   toe sequence the model never chooses — icon, then text, then action, every time) and **the
   magnetic heuristic** (blocks snap into place in the order the model lists them, like magnets
   pulling into a line — no coordinates, no grid math, just sequence). Site copy should stop
   presenting raw `Stack`/`Box` composition as the primary authoring path (it still is one, for a
   human hand-writing code, but the marketing story for AI-assisted building is the placement
   layer, backed by the `/benchmarks` numbers).
2. **The core hypothesis needs to be stated plainly, not left implicit:** most of the token cost of
   building UI with an LLM is front-loaded, during the early phase of a project when flows and
   layouts are still volatile — many small changes, a lot of exploration, nothing settled yet.
   That is exactly the phase Rebar (via the placement layer) is built for: no visual decisions in
   the loop, so iteration is cheap and — per the benchmark's visual-consistency numbers — far more
   predictable. Once a project's UI has actually stabilized and is heading to production, the
   right move is to migrate once, via the codemod/migration-prompt path, to a real design system
   that can be customized for the long term. Rebar isn't positioned as a permanent alternative to a
   production design system — it's positioned as the cheapest way to get through the volatile
   phase before you need one. This should be the load-bearing sentence on the homepage hero and
   the Introduction doc page, not buried in a benchmarks caveat.

Concretely, this means: the homepage hero subtitle, the Introduction page's "why cheaper" section,
and the Migration page's framing should all name the volatility→stabilization arc explicitly
(design volatile → build headless via the placement layer → flows settle → migrate once), rather
than describing headless-first and migration as two separate, only-loosely-connected features.

**Docs sidebar:**
- **Introduction** — what Rebar is, the pitch, when to reach for it vs. not.
- **Getting Started** — install, first component, project setup.
- **Components** — one page per component (Button, Input, Dialog, Tabs, Form, ...), each following
  the same template (next section).
- **Theming & Defaults** — the content of [HEURISTICS.md](HEURISTICS.md), written for public
  consumption: token tables, behavioral heuristics, how to override.
- **Migration** — how the sketch→clean re-skin works, `MIGRATION_PROMPT.md` explained, adapter
  packages (`@rebar-ui/migrate-antd` and future ones) documented individually.
- **DevTools** — what the dev-only panel shows and how to read it.
- **Contributing** — same spirit as mermaid's Contributing section: how to add a component, how
  adapter packages are structured so someone can add `migrate-mui` following the template.

**Per-component doc page template** (Rebar's analogue of mermaid's per-diagram-type page):
1. One-line description + when to use it.
2. Live preview, rendered with the real component, with the sketch/clean/dark toggle available
   inline on that preview.
3. Code snippet for the example shown.
4. Props table (generate from the component's TypeScript types rather than hand-maintaining a
   second copy — avoids the table silently drifting from the actual prop signature).
5. Accessibility notes (keyboard interactions, ARIA roles) — this doubles as the Playwright
   testing guidance for that component.
6. `data-rebar-*` attributes this component emits, for anyone writing selectors against it.
7. Migration notes: how this component maps under `@rebar-ui/migrate-antd` (and future adapters),
   once those exist.

## Open questions

1. Next.js+MDX hand-rolled vs. Nextra vs. Docusaurus (Docusaurus is also React-based and would
   work, just more opinionated/heavier than Nextra) — default assumption above is Next.js+MDX,
   flag if a preference exists.
2. Docs search: Algolia DocSearch (free for qualifying open-source projects, what most sites in
   this space use) vs. a local search plugin — Algolia assumed unless there's a reason to avoid an
   external dependency.
3. ~~Hosting: Vercel...~~ **Resolved**: a Firebase project (`rebarui`) is already provisioned for
   this. Firebase Hosting serves static output, so the Next.js docs site should build with
   `output: "export"` (static export) rather than relying on Next's server runtime — the same
   static-build-to-Firebase-Hosting pattern the Oestler platform's own Vite apps use, just via
   Next instead of Vite. Firebase config lives in `apps/docs/.env.local` (gitignored; see
   `apps/docs/.env.example` for the shape) and is not committed. `apps/docs` isn't scaffolded yet
   — this is prep for Phase 6, done now because the credential arrived now.
