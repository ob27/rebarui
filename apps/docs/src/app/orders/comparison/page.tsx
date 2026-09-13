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
        text: "A side-by-side comparison of two or more constructs — measures and applies heights automatically. Used for comparing different approaches or versions.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"comparison\", items: { label: string, blocks: Construct[] }[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the comparison block:",
      },
    ],
  },
];

export default function ComparisonPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Comparison</Heading>
      <Text color="secondary">
        A side-by-side comparison of two or more constructs — measures and applies heights automatically. Used for comparing different approaches or versions.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
