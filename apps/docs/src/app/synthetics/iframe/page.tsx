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
        text: "A real <iframe> — a required, not optional, title (an embed with no accessible name is a real, common accessibility gap). No default height.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"iframe\", src: string, title: string, height?: number }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the iframe block:",
      },
    ],
  },
];

export default function IframePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Iframe</Heading>
      <Text color="secondary">
        A real iframe — a required, not optional, title (an embed with no accessible name is a real, common accessibility gap). No default height.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
