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
        text: "A wrapping grid of cards — title, optional body copy, optional status tags, optional link — for an index/directory of many similar named things.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"card-grid\", items: { title: string, body?: string, href?: string, linkLabel?: string, tags?: { label: string, tone?: Tone }[] }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the card-grid block:",
      },
    ],
  },
];

export default function CardGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Card Grid</Heading>
      <Text color="secondary">
        A wrapping grid of cards — title, optional body copy, optional status tags, optional link — for an index/directory of many similar named things.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
