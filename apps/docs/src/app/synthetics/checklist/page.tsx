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
        text: "A vertical list of checkable items with a heading. Each item has a label and optional description. Presentational only — no live state binding.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"checklist\", heading?: string, items: { label: string, description?: string, checked?: boolean }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the checklist block:",
      },
    ],
  },
];

export default function ChecklistPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Checklist</Heading>
      <Text color="secondary">
        A vertical list of checkable items with a heading. Each item has a label and optional description. Presentational only — no live state binding.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
