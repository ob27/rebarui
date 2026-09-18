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
        text: "A modal dialog with a title, body content, and action buttons. Used for focused tasks or confirmations that require user attention.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"modal\", title: string, body: Construct[], actions?: Action[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the modal block — always rendered open, since this is a static-render context, not a real overlay with its own open/close lifecycle:",
      },
    ],
  },
  {
    type: "modal",
    title: "Delete this record?",
    blocks: [
      {
        type: "callout",
        tone: "warning",
        title: "This can't be undone",
        subtitle: "Any linked references will also be removed.",
      },
    ],
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
];

export default function ModalPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Modal</Heading>
      <Text color="secondary">
        A modal dialog with a title, body content, and action buttons. Used for focused tasks or confirmations that require user attention.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
