import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Why does this look so plain?",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Short answer: it isn't unfinished, and it isn't a design failure — it's intentionally low-fidelity, on purpose, for the entire time you're building with it. Rebar UI looks like a sketch because a sketch is exactly what it's meant to be: a real, working, accessible interface that never asks you to make a single visual decision before you've decided whether the thing underneath it is worth building at all.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The 1% we deliberately don't do first",
    body: [
      {
        kind: "text",
        text: "Most software effort that goes into \"making it pretty\" is optional, in the specific sense that a system can be fully useful, fully correct, and fully shipped without it. We treat that phase as exactly that — optional, and last. Every hour spent picking a color palette, a corner radius, a font pairing, or a micro-animation before the logic and content structure are right is an hour spent polishing something that might get thrown away once real usage tells you what the interface actually needs to do.",
      },
      {
        kind: "text",
        text: "So we invert the usual order. Build the real thing — the logic, the accessibility, the content structure, the states a user actually hits — headless and low-fidelity, in components that already look and behave like real UI (not wireframe boxes with `Lorem ipsum`), just without a finished visual identity. Apply visual polish exactly once, at the end, when you actually know what needs polishing.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The name is the whole idea",
    body: [
      {
        kind: "text",
        text: "Rebar and formwork build a structure's load-bearing shape correctly, once, before any cladding, paint, or finish goes on. Nobody tiles a bathroom before the studs are plumb. This library does the same job for software: get the shape — logic, accessibility, content structure — right first, headless, and let the finish come later, deliberately, not as an afterthought bolted onto something that was designed backwards.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migration is the point, not an afterthought",
    body: [
      {
        kind: "text",
        text: "This only works if getting to \"pretty\" later is cheap and safe, not a rewrite. That's what the migration codemod (`@rebar-ui/migrate-antd`, see [Migration](/docs/migration)) and this library's own conventions are built around — every component's structure, states, and accessibility carry over intact when you swap in a real design system, because the *shape* was already correct. You're not stuck with the sketch, and you're not paying twice: once to build it functionally, once again to rebuild it properly. You build it once, correctly, and hand the finish to whichever design system (or design team) the project actually needs — on your own timeline, not the framework's.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Most genuinely useful software isn't pretty",
    body: [
      {
        kind: "text",
        text: "Look at the tools that actually run the world's important work — trading floors, air-traffic systems, hospital admin, most internal B2B tooling, the terminal itself. Almost none of it wins design awards, and almost all of it is worth more, in real terms, than the software that does. That's not a coincidence or a failure of those industries to hire good designers — it's what happens when a team spends its scarce effort on being correct and useful instead of decorative. We don't aspire to be pretty. We aspire to be the cheapest, most direct path to a genuinely useful outcome — and we think that's a more honest goal for a component library to optimize for than looking good in a screenshot.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "This isn't a guess — see the evidence",
    body: [
      {
        kind: "text",
        text: "[Benchmarks](/benchmarks) measures this approach directly against hand-authoring a conventional component library (Ant Design) — real token cost, wall-clock time, and output consistency, not an assertion. [Design Heuristics](/docs/heuristics) is the other half of the argument: low-fidelity doesn't mean low-quality UX — every component still follows real, sourced interaction and accessibility rules (keyboard operability, contrast, progressive disclosure, and 46 others), it just doesn't dress them up before you've asked it to.",
      },
    ],
  },
];

export default function DesignPhilosophyPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
