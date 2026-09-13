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
        text: "A page-top header with a title, optional subtitle, and optional action buttons. Used as the top chrome for a page or section.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"header\", title: string, subtitle?: string, actions?: Action[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the header block:",
      },
    ],
  },
];

export default function HeaderPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Header</Heading>
      <Text color="secondary">
        A page-top header with a title, optional subtitle, and optional action buttons. Used as the top chrome for a page or section.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
