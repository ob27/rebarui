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
        text: "A chat interface with a title, a list of messages, and an input bar. Messages render with real Avatar components. Presentational only — no send handler.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"ai-chat\", title: string, messages: AiChatMessage[], inputPlaceholder?: string }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the ai-chat block:",
      },
    ],
  },
];

export default function AiChatPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Ai Chat</Heading>
      <Text color="secondary">
        A chat interface with a title, a list of messages, and an input bar. Messages render with real Avatar components. Presentational only — no send handler.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
