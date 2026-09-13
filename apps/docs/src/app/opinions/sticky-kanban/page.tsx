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
        text: "A kanban board with sticky columns that stay visible while scrolling through cards. Same card shape as card-kanban.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"sticky-kanban\", columns: { title: string, cards: KanbanCard[] }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the sticky-kanban block:",
      },
    ],
  },
];

export default function StickyKanbanPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Sticky Kanban</Heading>
      <Text color="secondary">
        A kanban board with sticky columns that stay visible while scrolling through cards. Same card shape as card-kanban.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
