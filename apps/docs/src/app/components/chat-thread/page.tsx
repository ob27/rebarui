"use client";

import { useState } from "react";
import { ChatThread, Heading, Stack, Text } from "rebar-ui";
import type { ChatMessage } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const INITIAL: ChatMessage[] = [
  { id: "1", role: "user", content: "Can you summarize this quarter's numbers?", status: "sent" },
  { id: "2", role: "assistant", content: "Revenue is up 12% quarter over quarter, driven mostly by the new enterprise tier.", status: "sent" },
];

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<ChatThread\n  messages={messages}\n  isTyping={isTyping}\n  onRetry={(m) => resend(m.id)}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ChatThread"] ?? [] },
  {
    type: "doc-section",
    heading: "Presentational — the caller owns streaming",
    body: [
      {
        kind: "text",
        text: "This component performs no networking itself, the same convention `FileUpload` follows for uploads — the caller updates a message's `content` in place as chunks arrive and this re-renders. Only auto-scrolls to new content when the reader is already at the bottom; scrolled-up readers get a floating \"new messages\" button instead of being yanked back down.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="chat-thread"`; each message carries `data-rebar-role` and `data-rebar-status`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chat-transcript component of its own; a migration typically composes `List` + `Avatar` + `Spin` directly, or adopts a dedicated chat-UI library.",
      },
    ],
  },
];

export default function ChatThreadPage() {
  const [messages] = useState<ChatMessage[]>(INITIAL);

  return (
    <Stack gap="lg">
      <Heading level={1}>ChatThread</Heading>
      <Text color="secondary">
        A chat-bubble message thread with a typing indicator and a scroll-to-bottom affordance.
      </Text>

      <div style={{ height: 320, border: "1px solid var(--rebar-color-border)", borderRadius: 4 }}>
        <ChatThread messages={messages} />
      </div>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
