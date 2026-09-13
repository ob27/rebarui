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
        text: "A kanban board with columns, each containing cards. Cards have title, optional body, optional labels, and optional footer. Presentational only.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"card-kanban\", columns: { title: string, cards: KanbanCard[] }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the card-kanban block:",
      },
    ],
  },
];

export default function CardKanbanPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Card Kanban</Heading>
      <Text color="secondary">
        A kanban board with columns, each containing cards. Cards have title, optional body, optional labels, and optional footer. Presentational only.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
