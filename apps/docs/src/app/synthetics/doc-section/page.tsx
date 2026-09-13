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
        text: "A heading (level 1, 2, or 3) plus prose/code/list content — the block type every /docs/* page is built from. Prose text supports inline markup.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"doc-section\", heading?: string, level?: 1 | 2 | 3, body: ProseNode[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the doc-section block:",
      },
    ],
  },
];

export default function DocSectionPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Doc Section</Heading>
      <Text color="secondary">
        A heading (level 1, 2, or 3) plus prose/code/list content — the block type every /docs/* page is built from. Prose text supports inline markup.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
