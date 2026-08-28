---
title: Assessment of initial brainstorm (chat-export-1787916853126.json)
status: living document
---

# Assessment: the origin chat

The export in this folder is a brainstorm with an external model (Qwen3.7-Plus) that starts from
"vectorize a contract for LLM querying" and arrives, ten turns later, at "build a headless,
low-fi, AI-migratable React component library called Rebar." That pivot is the only part of the
chat relevant to this repo — the GraphRAG/requirements-management discussion (turns 1–7) is
origin story, not product scope, and nothing from it should leak into Rebar's design.

This doc is the critical pass over turns 8–31: what to keep as-is, what to keep but change, and
what to cut. [PLAN.md](PLAN.md) and [ARCHITECTURE.md](ARCHITECTURE.md) encode the conclusions
here — treat this file as the "why," not the spec.

## Keep as-is

- **The core premise.** A component library that is deliberately ugly/low-fidelity by default,
  fully functional and accessible, with an explicit, designed pathway to become someone else's
  design system later. This gap is real — headless libraries (Radix, Headless UI) give you the
  logic with zero opinion on look; styled libraries (AntD, MUI) give you the look but resist
  restyling. Nothing packages "intentionally sketchy by default, trivially re-skinned later" as a
  product. Worth building.
- **Radix UI as the primitive layer.** Correct call — don't reinvent focus-trapping, roving
  tabindex, or WAI-ARIA compliance. Radix is the standard choice here in 2026.
- **CSS custom properties as the only styling surface.** Locking spacing/color/type to `--rebar-*`
  tokens rather than letting components hardcode values is exactly what makes a later re-skin a
  find-and-replace instead of a rewrite. Keep this as a hard rule, not a suggestion.
- **Structural `data-rebar-*` attributes + reliance on the a11y tree for testability.** This is
  good Playwright practice independent of Rebar (official Playwright guidance already prefers
  `getByRole` over CSS selectors), and it's the right insurance policy for "tests must survive a
  full re-skin."
- **npm as the only distribution channel**, website for docs/marketing only. The chat's argument
  against "host it, let people download it" is correct and not worth re-litigating — no JS
  developer will manually vendor a component library in 2026.
- **8pt spacing grid, a small locked type scale, semantic color tokens, WCAG AA contrast as a
  baseline.** These are genuinely industry-standard (Material, Carbon, USWDS all converge here),
  not exotic choices. Fine as sensible defaults.

## Keep, but change

- **The Ant Design coupling.** The chat has the *core* component API mimic AntD's specific prop
  vocabulary (`open`/`onOpenChange`, `size="small"|"middle"|"large"`, `danger`) so that a future
  swap is a 1:1 rename. Problem, at the time this was written: AntD was this chat's suggestion,
  not a confirmed target — the user's actual "work repo" design system was unknown and never
  named. Baking one specific library's naming into Rebar's core forever would have been
  over-fitting to a guess, and would foreclose a clean migration to Tailwind/shadcn/MUI/a custom
  system later.
  **Update:** AntD is no longer a guess. While scoping the unrelated Coherence project (a
  separate repo — see `/Users/tom/Documents/GitHub/Coherence`), every sibling app on the user's
  actual "Oestler platform" (`Simple-Doc-Control`, `Simple-Checklists`,
  `Simple-Asset-Management`, `Simple AIM Kanban`, `Simple-Presentation`, `Oestler-Root`) turned
  out to depend on `antd` + `@ant-design/icons` in production. That's almost certainly the "work
  repo" design system the original brainstorm meant. This validates building the AntD adapter now
  rather than only sketching the pattern — see [PLAN.md](PLAN.md) Phase 5 — while the underlying
  decision to keep it as a *separate, optional adapter package* rather than baked into core
  remains correct regardless: the same repo family could still gain a non-AntD product later, and
  the adapter pattern needs to generalize either way.
  **Resolution:** keep the core API on its own sensible, common conventions (`open`/`onOpenChange`
  is fine — it's converged on across Radix/MUI/AntD, not AntD-specific; `variant="destructive"`
  instead of `danger`, since `variant` is the more universal cross-library term). Push
  AntD-specific naming into an **optional adapter/codemod package** (`@rebar-ui/migrate-antd`)
  that a user pulls in only if AntD turns out to be the actual target. Same pattern can host a
  `migrate-mui` or `migrate-shadcn` package later without touching the core. See
  [ARCHITECTURE.md](ARCHITECTURE.md#migration-adapters).
- **Runtime auto-correction of "bad" values** (the chat's example: a component silently rewrites
  `margin: 13px` to `16px`). Silently mutating a value the developer explicitly set is a surprise,
  which directly violates the heuristic set Rebar is supposed to enforce ("visibility of system
  status," "user control"). It's also unbuildable in practice for arbitrary inline styles without
  a build-time transform.
  **Resolution:** dev-mode **console warnings only** (or an optional lint rule), never silent
  mutation. Real violations get surfaced in the DevTools panel as a count, not auto-fixed.
- **The "tokens saved" / migration-cost-in-tokens-and-USD calculator.** This is the weakest part of
  the brainstorm. The formulas (`RebarButton: raw 45 tokens vs rebar 8`, `$0.002/1K tokens`, a
  fixed 5–10x "build from scratch" multiplier) are invented on the spot with no measurement behind
  them, and LLM API pricing changes constantly — hardcoding a $/token figure makes the number
  wrong the day it ships and years wrong later. Shipping fabricated precision ("you saved exactly
  10,247 tokens") is worse than not shipping the feature, because it's a specific, checkable claim
  that's false.
  **Resolution:** keep the *shape* of the idea (a dev-mode panel showing real, computed usage), but
  replace fake tokens/dollars with things that are actually true and countable:
  - Component instance count per type on the current page (real — comes from a render-time
    registry).
  - A **relative migration-effort score**, not a token count: e.g. "12 simple components, 3
    medium, 1 complex, 4 style overrides" mapped to a bucketed effort label (Low/Medium/High), not
    a specific number pretending to be exact.
  - If a token/cost estimate is wanted at all, label it explicitly as a rough, configurable
    heuristic ("~N tokens per component, editable in config — not a measured value") rather than a
    dashboard stat presented as fact. Strongly consider cutting it entirely for v0.1 and revisiting
    once there's real usage data to calibrate against.
- **Attribution precision on the heuristics.** The chat sometimes blurs "this exact numeric rule
  comes from Nielsen" when Nielsen's 10 heuristics are qualitative (no library specifies "24px gap
  between form items"); the numeric defaults actually come from Material/Carbon/USWDS convention.
  [HEURISTICS.md](HEURISTICS.md) fixes this: qualitative heuristics (Nielsen, Shneiderman, Gestalt)
  are cited as *behavioral* rules Rebar's components must satisfy; the pixel-level tokens are
  cited to the systems that actually publish numbers (Material, Carbon, USWDS), with the numbers
  themselves treated as Rebar's own reasonable starting values, not sacred.
  One licensing note worth flagging: **Laws of UX** (lawsofux.com) is CC BY-NC-SA — fine to link to
  and be inspired by, but don't reproduce its text verbatim in Rebar's shipped docs given the
  non-commercial clause, if Rebar or its docs are ever monetized.

## Cut

- Nothing from turns 1–7 (the GraphRAG/requirements-management tool) belongs in Rebar's scope.
  That's the motivating project Rebar's first app will be built *for*, not something Rebar itself
  needs to know about.
- The specific claim that a "polished Balsamiq-as-code component library doesn't exist" should be
  treated as an untested assumption, not a validated market gap — the chat's model asserted this
  from training knowledge, not a search. Worth a quick real check (npm/GitHub search for
  "wireframe component library react," "sketch ui react") before investing heavily in the
  differentiation story, though even if something adjacent exists, the AI-migration angle is
  still likely under-served.

## Open questions for the user

These are decisions only you can make; [PLAN.md](PLAN.md) flags them again at the point they
block a phase:

1. Monorepo tooling preference (pnpm + Turborepo assumed as a default — say if you want something
   else, e.g. plain npm workspaces, Nx).
2. ~~Whether to build the AntD adapter package now...~~ **Resolved** — see the update above;
   AntD is confirmed, build it now (Phase 5).
3. Whether the token/cost estimator gets cut, reframed (recommended), or kept as originally
   specified.
4. v0.1 component scope — how small the first npm publish should be.
