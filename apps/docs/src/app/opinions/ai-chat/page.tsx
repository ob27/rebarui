"use client";

import { Avatar, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { STATUS_TONE, avatarOf, project } from "@/fixtures/tideline";

const MESSAGES: { id: string; role: "user" | "assistant"; content: string; avatarFallback: string }[] = [
  { id: "1", role: "user", content: "What slipped on the mobile release this week?", avatarFallback: "JW" },
  { id: "2", role: "assistant", content: "Two things. Offline sync is in review and the crew-interview notes are late.", avatarFallback: "AI" },
  { id: "3", role: "user", content: "Can you draft a note for the crew?", avatarFallback: "JW" },
];
const CODE_SHAPE = `{ type: "ai-chat", title?: string, messages: AiChatMessageData[], placeholder?: string, dictation?: boolean, height?: number }
// AiChatMessageData = { id: string, role: "user" | "assistant", content: string, avatarFallback?: string, avatarSrc?: string, avatarPlaceholder?: boolean }`;
const CODE = `<NextBlockRenderer blocks={[{ type: "ai-chat", title: "Tideline assistant", messages, placeholder: "Ask about a project" }]} />`;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: CODE_SHAPE }],
  },
];

export default function AiChatPage() {
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>Ai Chat</Heading>
      <Text color="secondary">A transcript and a composer in one block; sending adds your message to the thread.</Text>

      <DemoStage title="Release chat" caption="Type a message and send; the thread is local to the page" code={CODE} widths={false}
        states={[
          { label: "Empty", node: <div style={{ width: 320 }}><NextBlockRenderer blocks={[{ type: "ai-chat", title: "New chat", messages: [], placeholder: "Ask about a project", height: 220 }]} /></div> },
          { label: "With dictation", node: <div style={{ width: 320 }}><NextBlockRenderer blocks={[{ type: "ai-chat", title: "Dictate a note", messages: MESSAGES.slice(0, 1), dictation: true, height: 220 }]} /></div> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "ai-chat", title: "Tideline assistant", messages: MESSAGES, placeholder: "Ask about a project", height: 340 }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project side panel" caption="The chat beside the project it is about" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <Card style={{ flex: "1 1 220px" }} title={mobile.name} avatar={<Avatar {...avatarOf(mobile.owner)} />} subtitle={`Due ${mobile.due}`} extra={<Tag tone={STATUS_TONE[mobile.status]}>{mobile.status}</Tag>}>
            <Text size="sm" color="secondary">{mobile.summary} {mobile.done}% complete.</Text>
          </Card>
          <div style={{ flex: "2 1 320px" }}>
            <NextBlockRenderer blocks={[{ type: "ai-chat", title: "Ask about this project", messages: MESSAGES.slice(0, 2), placeholder: "Ask about Tideline mobile", height: 300 }]} />
          </div>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
