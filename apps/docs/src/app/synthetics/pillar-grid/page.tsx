import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [
      {
        kind: "text",
        text: "A row of cards, each with a title, body copy, and a CTA link — the homepage's three-pillars grid. Used for main navigation or value propositions.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"pillar-grid\", items: { title: string, body: string, href: string, cta: string }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the pillar-grid block:",
      },
    ],
  },
];

export default function PillarGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Pillar Grid</Heading>
      <Text color="secondary">
        A row of cards, each with a title, body copy, and a CTA link — the homepage's three-pillars grid. Used for main navigation or value propositions.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
