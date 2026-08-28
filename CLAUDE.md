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

When plans change, update these files in place rather than creating new ones alongside them —
they're living documents, not a changelog. New planning docs (e.g. a future phase's detailed
design) also go in `ref/`.
