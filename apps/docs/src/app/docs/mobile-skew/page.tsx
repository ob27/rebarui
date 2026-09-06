import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Mobile skew: every site gets a mobile print, for free",
    level: 1,
    body: [
      {
        kind: "text",
        text: "*Status: this page describes a planned mechanism, not a shipped one — nothing on this page is built yet.* We're writing it down anyway, before building it, because the shape of the commitment matters as much as the code that eventually fulfills it.",
      },
      {
        kind: "text",
        text: "Every web component and web diagram the Packer (`@rebar-ui/placement`) prints will get *two* prints from the same source data, not one: a desktop print (what exists today) and a mobile print, generated alongside it — not authored separately. At render time, the client picks whichever print matches the viewport actually in front of the person using it. A phone or a small tablet gets the mobile print; a large tablet gets the full desktop app, same as a laptop. Build one document, get a mobile-optimized site automatically — the same way you already get a consistent, low-fidelity visual baseline automatically, with no separate mobile design pass required.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Why this is a placement-layer problem, not a per-component one",
    body: [
      {
        kind: "text",
        text: "A component used directly — hand-authored `Stack`/`Card` JSX, not through the Packer — can only get this the conventional way: container queries or breakpoint-gated CSS baked into that one component, decided once, the same as any other component library. That's a real, valid fallback for a component used on its own, but it means every component re-solves \"what does this look like small\" in isolation, and a hand-authored page combining several components has no single place that can look at the *whole* page and decide to restructure it for a small screen.",
      },
      {
        kind: "text",
        text: "The Packer already is that single place. It already owns every layout decision for a page built through it — see [Design Heuristics](/docs/heuristics) for anatomical order and the magnetic heuristic — precisely so the model never has to make one. A second render path inside the same renderer, given the same `Block[]` document, is a natural extension of a decision this system already centralizes, not a new architectural seam.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "What a mobile print should mean, concretely",
    body: [
      {
        kind: "list",
        items: [
          "Denser vertical stacking in place of a desktop row's horizontal arrangement — the same content, the same fixed internal ordering, just without a desktop row's width to spend.",
          "Larger touch targets by default (44×44px minimum, the same rule every component already follows, not a separate mobile-only standard).",
          "Overflow-prone chrome — a nav bar's collapsed items, a table's named filters — collapsing more aggressively, since a phone's viewport hits those thresholds far sooner than a laptop's.",
          "Anything genuinely desktop-only (a hover-triggered card, a drag-and-drop board with no touch equivalent) either gaining its already-required touch pairing or being deliberately simplified for the mobile print, rather than rendered unusably.",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Where diagrams fit in",
    body: [
      {
        kind: "text",
        text: "The original ask behind this page was \"every web component *and every web diagram*\" — diagrams (flowcharts, sequence diagrams, org charts) are a separate, not-yet-built archetype family for the Packer. Whenever diagram archetypes are actually built, they inherit this same two-print mechanism for free, for the same reason components do: they'd already be `Block[]`-described and rendered by the same renderer, not bespoke SVG each diagram type invents its own responsive behavior for.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Detection",
    body: [
      {
        kind: "text",
        text: "Chosen by real viewport/device signals at render time — not a user-agent string sniff alone, which is unreliable and doesn't track a foldable device or a resized window. The exact mechanism (a live viewport listener deciding which print to return, versus two static builds selected server-side) is an open implementation question, left open on purpose: this page exists to state the shape of the commitment before committing to one specific technical path.",
      },
    ],
  },
];

export default function MobileSkewPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
