import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "hero",
    imageSrc: "/catalogue-heros/archetypes.jpeg",
  },
  {
    type: "doc-section",
    heading: "What are Archetypes?",
    body: [
      {
        kind: "text",
        text: "Every digital UI construct has a physical ancestor. The button descends from the lever. The slider from the inclined plane. The toggle from the switch. These aren't just metaphors — they're design lineages. The constraints and affordances of the original mechanical form still shape how we perceive and use their digital derivatives, even when the physical mechanism is gone.",
      },
      {
        kind: "text",
        text: "Archetypes explores these lineages. Each article traces a UI construct back through its mechanical ancestry, examining how the original form's physics — its weight, its resistance, its feedback — still informs the digital version's design. Not as nostalgia, but as engineering: the lever works because of fundamental physics, and those same physics still apply when the lever becomes a button.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The articles",
    body: [
      {
        kind: "text",
        text: "**[The Button](/archetypes/the-button)** — from mechanical lever to switch to digital leverage. How the archetype of \"button\" is actually a \"lever,\" and why that physical ancestry still shapes the digital form's design today.",
      },
    ],
  },
];

export default function ArchetypesPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
