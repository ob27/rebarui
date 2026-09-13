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
        text: "A component's full prop reference — Prop/Type/Required/Default columns — rendered from already-generated PropRow[] data.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"props-table\", heading?: string, rows: PropRow[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the props-table block:",
      },
    ],
  },
];

export default function PropsTablePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Props Table</Heading>
      <Text color="secondary">
        A component's full prop reference — Prop/Type/Required/Default columns — rendered from already-generated PropRow[] data.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
