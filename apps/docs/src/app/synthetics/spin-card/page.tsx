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
        text: "A small, centered card showing a real loading overlay with a spinner and a list of items being loaded. Used to indicate async operations in progress.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"spin-card\", tip?: string, items: string[], width?: number, minHeight?: number }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the spin-card block:",
      },
    ],
  },
];

export default function SpinCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Spin Card</Heading>
      <Text color="secondary">
        A small, centered card showing a real loading overlay with a spinner and a list of items being loaded. Used to indicate async operations in progress.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
