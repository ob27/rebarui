"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AiChatInput, ChatThread, DeviceFrame, Heading, Stack, Text } from "rebar-ui";
import type { AiChatInputIntent, ChatMessage } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, TASKS, person, project } from "@/fixtures/tideline";
import { NewBStages } from "./NewBStages";

const CODE = `<AiChatInput
  value={draft}
  onValueChange={setDraft}
  onSend={ask}
  intent={draft.startsWith("/") ? "command" : "message"}
  placeholder="Ask about Tideline"
  dictation
  dictating={listening}
  onDictationToggle={setListening}
/>`;

const launch = EVENTS[0]!;
const sync = TASKS.find((t) => t.id === "sync")!;

const PHONE_STYLE = {
  margin: "0 auto",
  "--rebar-device-frame-max-width": "300px",
  "--rebar-device-frame-bezel-color": "var(--rebar-color-bg-inverse)",
  "--rebar-device-frame-status-bg": "var(--rebar-color-bg-inverse)",
} as CSSProperties;

function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DeviceFrame variant="phone" style={PHONE_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
        <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "8px 18px 14px", fontFamily: "var(--rebar-font-family-display)", fontWeight: "var(--rebar-font-weight-semibold)", fontSize: "1.1rem" }}>{title}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>{children}</div>
      </div>
    </DeviceFrame>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AiChatInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<textarea>` (labelled by `aria-label`, default \"Chat message\") that grows to `maxRows` then scrolls. Enter sends, Shift+Enter breaks a line. The send and dictation controls are real buttons with text labels; `onSend` never fires for an empty draft.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="ai-chat-input"`, `data-rebar-intent`; parts: `textarea`, `actions`, `dictation-button` (carries `data-rebar-active` while dictating), `send-button`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered: AntD has no AI chat input. Compose `Input.TextArea` (autoSize) with a send button, or use Ant Design X's `Sender`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "maxLength, counter and Enter behaviour",
    body: [
      {
        "kind": "text",
        "text": "`maxLength` caps the message (typing and pasting stop at it); `showCounter` adds a live \"n / max\" counter that turns to the danger tone at 90%. `submitOnEnter={false}` makes Enter add a line so sending happens only from the button (default `true`: Enter sends, Shift+Enter adds a line)."
      },
      {
        "kind": "code",
        "code": "<AiChatInput maxLength={500} showCounter submitOnEnter={false} onSend={send} />"
      }
    ],
  },
];

function Composer() {
  const [draft, setDraft] = useState(`What is due before the ${launch.title.toLowerCase()} on ${launch.date}?`);
  const [listening, setListening] = useState(false);
  const intent: AiChatInputIntent = draft.trim().startsWith("/") ? "command" : draft.trim().startsWith("?") ? "search" : "message";
  return (
    <AiChatInput
      value={draft}
      onValueChange={setDraft}
      onSend={() => setDraft("")}
      intent={intent}
      placeholder="Ask about Tideline"
      aria-label="Ask about Tideline"
      dictation
      dictating={listening}
      onDictationToggle={setListening}
    />
  );
}

function PhoneChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "a1", role: "user", content: `Who owns ${sync.title.toLowerCase()}?`, status: "sent" },
    { id: "a2", role: "assistant", content: `${person(sync.assignee).name}. It is in ${project(sync.project).status.toLowerCase()}.`, status: "sent" },
  ]);
  return (
    <Phone title="Assistant">
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatThread messages={messages} />
      </div>
      <div style={{ padding: 12 }}>
        <AiChatInput
          placeholder="Ask about Tideline"
          aria-label="Ask about Tideline"
          onSend={(text) => setMessages((prev) => [...prev, { id: `a${prev.length + 1}`, role: "user", content: text, status: "sent" }])}
        />
      </div>
    </Phone>
  );
}

export default function AiChatInputPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>AiChatInput</Heading>
      <Text color="secondary">A composer that grows with the message.</Text>

      <DemoStage
        title="Project assistant"
        caption="Send, dictate, intent"
        code={CODE}
        states={[
          { label: "Command", node: <AiChatInput intent="command" defaultValue="/export" aria-label="Command" /> },
          { label: "Dictating", node: <AiChatInput dictation dictating placeholder="Listening" aria-label="Dictating" /> },
          { label: "Disabled", node: <AiChatInput disabled placeholder="Ask Tideline" aria-label="Disabled" /> },
        ]}
      >
        <Composer />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Assistant on a phone" caption="Composer pinned under the thread" padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <PhoneChat />
        </div>
      </DemoStage>

      {/* ---- parity-a2: chat ---- */}
      <Heading level={2}>Boxed variant</Heading>
      <DemoStage
        title="Bar and box"
        caption='variant="boxed" singleLine: a surface bar with a top rule, a rounded field and a separate round button'
        code={`<AiChatInput variant="boxed" singleLine placeholder="Type your question…"
  onDictate={toggleMic} recording={recording ? { seconds } : false}
  transcribing={busy} sendIcon={<SendGlyph />} micIcon={<MicGlyph />} busyIcon={<Spinner />} />`}
        states={[
          { label: "Typed", node: <AiChatInput variant="boxed" singleLine defaultValue="What is grace?" onDictate={() => undefined} aria-label="Typed" /> },
          { label: "Recording", node: <AiChatInput variant="boxed" singleLine onDictate={() => undefined} recording={{ seconds: 2 }} aria-label="Recording" /> },
          { label: "Transcribing", node: <AiChatInput variant="boxed" singleLine onDictate={() => undefined} transcribing aria-label="Transcribing" /> },
          { label: "Disabled", node: <AiChatInput variant="boxed" singleLine disabled defaultValue="Sending…" onDictate={() => undefined} aria-label="Disabled" /> },
          { label: "Send only", node: <AiChatInput variant="boxed" singleLine maxLength={300} aria-label="Send only" /> },
          { label: "With notice", node: <AiChatInput variant="boxed" singleLine banner="Couldn't reach the catechist." defaultValue="Is anyone there?" aria-label="With notice" /> },
        ]}
      >
        <AiChatInput variant="boxed" singleLine placeholder="Type your question…" onDictate={() => undefined} aria-label="Boxed composer" />
      </DemoStage>

      <NewBStages />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
