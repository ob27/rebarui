import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Introduction",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Rebar is a headless-first React component library that's intentionally low-fidelity by default: fully functional and accessible, but visually barebones so your attention stays on logic and data flow, not pixels. It's built to be used through a small procedural placement layer — an LLM names which pre-built section shapes it needs and supplies content, the Packer decides the actual layout — rather than hand-authored component-by-component. Every visual value is a CSS variable, so re-skinning into a real design system later is a bounded migration, not a rewrite.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The placement layer: catalog selection, then two smaller heuristics — not a general layout engine",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/placement` exports `BlockRenderer`, which turns a small typed document — a list of blocks (a banner, a checklist, a callout, a feature grid, ...) — into the actual component tree. An LLM authoring that document never writes a layout prop; it only decides which block fits each piece of content and what that content is. That choice — *which named block* — is the real layout decision, not an afterthought: a checklist, a table, and a card-grid all lay out similar data differently, on purpose, and picking the wrong one is a real failure mode, not a style preference. Two smaller heuristics handle everything beneath that choice:",
      },
      {
        kind: "text",
        text: "*Anatomical order* — within any one block, its internal parts always render in the same fixed sequence, head to toe, every time: a callout is always icon, then title, then subtitle, top to bottom; a banner is always icon, then text, then a trailing action, left to right. The model fills in the slots' content; it never decides which slot comes first, because that was already decided when the block was designed.",
      },
      {
        kind: "text",
        text: "*The magnetic heuristic* — once a document is a flat, ordered list of blocks, the Packer just snaps each one into place in that sequence — like magnets pulling into a line, not a grid the model has to compute coordinates for. This is the *default* single-column stacking every block gets for free, not the whole placement story: a document's top-level blocks are still just an ordered list, but a handful of blocks (`comparison`, `tabs`, `modal`) have layout of their own beneath that top level — `comparison` needs the model to decide which content goes in `leftBlocks` versus `rightBlocks`, which is a real structural decision, just one still made by filling in a block's own fixed slots (anatomical order again), never by writing raw x/y or flex/grid values.",
      },
      {
        kind: "text",
        text: "This is genuinely this project's own homepage, not just a demo: the feature-card row and three-pillars grid on [the homepage](/) are real `BlockRenderer` output, not hand-authored `Stack`/`Card` JSX (`apps/docs/src/app/page.tsx`, if you're reading the source). It's a small, fixed vocabulary of blocks today, not a general \"any UI\" engine — the real, repeated measurements on [/benchmarks](/benchmarks) are what back the ones it was validated on; the rest were added to build this site with, not measured in isolation the same way.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The hypothesis: most of the cost is upfront, while things are still moving",
    body: [
      {
        kind: "text",
        text: "Most of the token cost of building UI with an LLM is paid early, while a project's flows and layouts are still volatile — screens get reshuffled, fields get added and removed, whole sections get rethought, often many times before anything settles. Building directly against a real, opinionated design system during that phase is expensive precisely because it's volatile: every round of change pays a styling/constraint tax again, reconciling the new logic with the target library's component shapes, prop conventions, and visual rules. That volatility is exactly where Rebar, built through its placement layer, is cheapest — [measured, not modeled](/benchmarks): no visual decisions in the loop, so iteration is fast, and (per the same benchmark's visual-consistency numbers) far more predictable in cost than a design-system build, where nominally identical requests still land on visibly different output each time.",
      },
      {
        kind: "text",
        text: "Once the UI has actually stabilized — the flows are settled, the project is heading to production — the right move is to migrate once, via [a codemod or the migration prompt](/docs/migration), to a real design system that can be customized for the long term. Rebar isn't meant to compete with a production design system on visual fidelity, or to be the permanent choice; it's meant to be the cheapest way to get through the volatile phase before you need one.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When to reach for Rebar",
    body: [
      {
        kind: "text",
        text: "Anywhere the UI is still being figured out: early-stage prototypes, internal tools, admin panels, or the first pass of a production app whose flows aren't settled yet — even when you already know the target design system you'll eventually migrate to. The less settled the UI, the more this approach saves; once it's genuinely stable and you're optimizing for final visual polish rather than iterating on logic, that's the signal to migrate. Rebar is designed to be replaced; that's the point, not a limitation.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The three guarantees",
    body: [
      {
        kind: "list",
        ordered: true,
        items: [
          "*Headless & accessible* — Radix UI underneath every interactive component.",
          "*Built to be replaced* — CSS-variable theming, no component logic depends on the current theme.",
          "*Playwright-proof* — `data-rebar-*` attributes and an ARIA-first surface survive a full re-skin.",
        ],
      },
    ],
  },
];

export default function IntroductionPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
