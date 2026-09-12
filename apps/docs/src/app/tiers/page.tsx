import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TierNavTabs } from "@/components/TierNavTabs";
import { Stack } from "rebar-ui";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Tiers",
    level: 1,
    body: [
      {
        kind: "text",
        text: "A four-tier lifecycle — Imitations → Synthetics → Opinions → Orders — classifying every rebar-ui component and placement-layer block by where it sits between a raw static primitive and a piece of page-level structural law. Orthogonal to two existing axes: the [component/block split](/docs/robot-md) (what you import directly vs. what the Packer composes from content), and Web/Mobile/Diagram (components) / Global/Web/Mobile (blocks, see `ref/BLOCKS.md`) (which viewport/platform a thing targets). Every combination of tier and those other axes is legal — a Web-category, Order-tier component (`NavBar`) and a Global-category, Synthetic-tier block (`checklist`) both exist.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The four tiers",
    level: 2,
    body: [
      {
        kind: "list",
        items: [
          "*Imitations* — static, standalone primitives. No composition of other named components, no real state machine beyond mirroring one caller-controlled value for the controlled/uncontrolled convention.",
          "*Synthetics* — static compositions/groupings of primitives with a unified purpose, but still no real dynamism.",
          "*Opinions* — real internal state: validation, morphing, multi-step flow, drag/reorder, search-and-filter, open/closed with focus management.",
          "*Orders* — macro/page-level structural governance of other things (nav, sidebars, tab strips that swap whole panels, page-level overlay/panel systems, page indexes).",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The delegated-state exception",
    level: 2,
    body: [
      {
        kind: "text",
        text: "You cannot determine tier by grepping a component's own file for `useState`. Several components delegate their entire state machine to a wrapped Radix primitive and show zero own state in their own source — `Select`, `Accordion`, `Tabs`, `Dialog`, `Popover`, `Dropdown`, `Tooltip`, `Combobox`, `HoverCard`, `ContextMenu`, `Menubar` and similar are still real Opinions despite that. You have to know what a component wraps, not just scan its file.",
      },
      {
        kind: "text",
        text: "The real test for \"real state machine\" is *branching into meaningfully different modes*, not merely holding some state: every stateful primitive carries some internal state for the controlled/uncontrolled convention alone (`Checkbox`, `Switch`, `Slider`), and that alone doesn't make it an Opinion — a checkbox mirroring one boolean stays an Imitation; a component with open/closed + filtered-list + highlighted-index + selection state (`Combobox`) is an Opinion.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Opinion is mechanical, for blocks",
    level: 2,
    body: [
      {
        kind: "text",
        text: "For a block, \"Opinion\" isn't a judgment call — it's a compiler-checked fact. A block *is* an Opinion iff its schema type declares a `source` field or an `on<Verb>` handler (`packages/placement/src/opinions.ts`'s `OpinionBlockType`, computed directly off `Block`'s own shape, not a hand-maintained list). That's exactly the set of blocks that support the live-data-binding mechanism (`source`/`onX`, resolved by `BlockRenderer`'s `data`/`handlers` props): `ai-chat`, `table`, `goal-tracker`, `card-kanban`, `sticky-kanban`, `wizard`, `scatter-chart`, `line-chart`, `stacked-bar-chart` — nine blocks that already embedded real interactive state directly in `BlockRenderer.tsx` despite looking like static schema data, before that mechanism existed to make it explicit.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Order is really a different axis",
    level: 2,
    body: [
      {
        kind: "text",
        text: "Read literally, the four tiers look like one ascending complexity ladder. Tested against the real 39-block catalog, that doesn't hold: \"Order\" turned out to be a different axis entirely (macro/page-level governance vs. behavioral complexity) than the Imitation→Synthetic→Opinion ladder. Of the 39 blocks, only ~8 (`site-header`, `nav-bar`, `nav-index`, `page-index`, `side-panel`, `tabs`, `modal`, `comparison`) are genuine Orders; the rest split across Synthetic (~22, plain static content) and Opinion (9, above) — calling every block in the placement package \"Order\" because of where its code lives conflates architectural layer with behavioral complexity. See `ref/ARCHITECTURE.md` for the fuller technical statement of this nuance. It's kept out of the rest of this site's copy deliberately: the clean four-step lifecycle is still a genuinely good mental model to compose new content with, even though Order is really the frame Imitations/Synthetics/Opinions render inside, not a fourth rung on their ladder.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Sequencing: encouraged, not enforced",
    level: 2,
    body: [
      {
        kind: "text",
        text: "When building something new, ask, in order: (1) Is this a standalone primitive with no awareness of siblings or its own state — could it be an Imitation? (2) If it needs to combine with others, can it become a fixed composition that still requires no live state — a Synthetic? (3) Does the real requirement force genuine internal state — validation, morphing, multi-step, drag, search-and-filter — making it an Opinion? (4) Does it need to govern page- or app-level structural arrangement of other things — an Order?",
      },
      {
        kind: "text",
        text: "This is *not* a build-order gate — shipping an Opinion or an Order with nothing beneath it in Imitation/Synthetic form first is completely valid and common; most useful state machines were never simpler static versions of themselves first. But asking in this order surfaces two things a design pass that jumps straight to \"build the state machine\" would miss: a static sub-piece worth extracting and reusing on its own (the `GoalTracker` → `TodoItem` precedent — the checkable row turned out to be worth having independently of the hierarchy/editing logic wrapped around it), and whether something billed as \"just data\" (a block's fixed schema) is actually smuggling in real interactive state that changes its tier and its guarantees (the nine Opinion blocks, above).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Rolled-up cases",
    level: 2,
    body: [
      {
        kind: "text",
        text: "Some artifacts span two tiers depending on configuration, or duplicate across the component/block boundary. Of six originally-flagged cases, only `Card` genuinely needed two catalog rows over one artifact — every other case already had real, separately-named artifacts that just needed cross-referencing:",
      },
      {
        kind: "list",
        items: [
          "*Card* — default config is Synthetic; `editable` is an Opinion. Two catalog rows, one component — not split into two exports, since `editable` is a prop-level variant, not a different interaction pattern.",
          "*NavBar* (component) / `nav-bar` / `site-header` (blocks) — three already-distinct, already-Order artifacts.",
          "*Kanban* (component) / `card-kanban` / `sticky-kanban` (blocks) — three already-distinct, already-Opinion artifacts.",
          "*Wizard* (component) / `wizard` (block) — both Opinion; a near-passthrough block wrapping a real state machine is still an Opinion, not diluted by how thin the wrapper is.",
          "*Table*/*DataGrid* (components, Opinion) / `table` (block, Opinion) / `stats-table` (block, Synthetic) — the clearest proof tier tracks the exposed authoring surface, not the implementation underneath: `table` and `stats-table` both render through the real `Table` component, but `stats-table` exposes none of its stateful props by design.",
          "*ChatThread*/*AiChatInput* (components) / `ai-chat` (block) — all three already correctly Opinion.",
        ],
      },
    ],
  },
];

export default function TiersPage() {
  return (
    <Stack gap="lg">
      <TierNavTabs />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
