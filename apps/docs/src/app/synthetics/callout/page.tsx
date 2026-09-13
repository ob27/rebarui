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
        text: "A highlighted callout box with a title and body text. Used for important notes, tips, or warnings that stand out from regular content.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"callout\", title: string, body: string, tone?: \"info\" | \"warning\" | \"error\" | \"success\" }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the callout block:",
      },
    ],
  },
];

export default function CalloutPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Callout</Heading>
      <Text color="secondary">
        A highlighted callout box with a title and body text. Used for important notes, tips, or warnings that stand out from regular content.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
