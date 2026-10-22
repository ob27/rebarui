"use client";

import type { CSSProperties, ReactNode } from "react";
import { AiChatInput, ChatThread, Chip, DeviceFrame, Heading, Stack, Tag, Text } from "rebar-ui";
import type { ChatMessage } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CHAT, EVENTS, person } from "@/fixtures/tideline";
import { NewBStages } from "./NewBStages";

const CODE = `<ChatThread
  messages={messages}
  onRetry={(m) => resend(m.id)}
  emptyMessage="Try “What is due this week?”"
/>
<AiChatInput placeholder="Ask about Tideline" onSend={ask} />`;

/** The Tideline chat fixture as ChatThread messages: people get their initials and portrait, the assistant is "TL". */
function toMessages(): ChatMessage[] {
  return CHAT.map((m) => {
    const user = m.from !== "assistant";
    return {
      id: m.id,
      role: user ? "user" : "assistant",
      content: m.text,
      status: "sent",
      timestamp: m.time,
      avatarFallback: user ? person(m.from).initials : "TL",
      avatarPlaceholder: user,
      actions: m.citations ? (
        <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
          {m.citations.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </Stack>
      ) : undefined,
    };
  });
}

const MESSAGES = toMessages();
const ASK = CHAT[0]!;
const launch = EVENTS[0]!;

const PHONE_MESSAGES: ChatMessage[] = [
  { id: "p1", role: "user", content: `What is due on ${launch.date}?`, status: "sent" },
  {
    id: "p2",
    role: "assistant",
    content: `${launch.title} at ${launch.time}. The launch checklist is still open.`,
    status: "sent",
    actions: <Tag>Event · {launch.title}</Tag>,
  },
];

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
  { type: "props-table", heading: "Props", rows: componentProps["ChatThread"] ?? [] },
  { type: "props-table", heading: "Chip props", rows: componentProps["Chip"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'The transcript auto-scrolls only while the reader is already at the bottom; otherwise a "new messages" button appears instead of yanking them down. With `sender`, `role: "system"` or `align="start"` the thread becomes a labelled `role="list"` so a screen reader hears each speaker in order. The retry affordance on an errored message is a real button.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="chat-thread"`; each message carries `data-rebar-role` and `data-rebar-status` (and `data-rebar-tone="highlight"` when tinted); the thread carries `data-rebar-align="start"` when set; parts include `bubble`, `meta`, `byline`, `sender`, `header`, `actions`, `retry-button` and `typing-indicator`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered: AntD ships no chat transcript. A migration composes `List` + `Avatar` + `Spin`, or adopts Ant Design X.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "afterMessages slot",
    body: [
      {
        "kind": "text",
        "text": "`afterMessages` renders inside the scroller below the last message and the typing indicator (suggested replies, a follow-up row, a help card), so it scrolls with the transcript."
      },
      {
        "kind": "code",
        "code": "<ChatThread messages={messages} afterMessages={<SuggestedReplies />} />"
      }
    ],
  },
];

function Thread({ messages, height = 220, ...rest }: { messages: ChatMessage[]; height?: number; align?: "sides" | "start"; emptyMessage?: string; onRetry?: (m: ChatMessage) => void }) {
  return (
    <div style={{ height }}>
      <ChatThread messages={messages} {...rest} />
    </div>
  );
}

export default function ChatThreadPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ChatThread</Heading>
      <Text color="secondary">A conversation with citations.</Text>

      <DemoStage
        title="Project assistant"
        caption="Streaming, citations, composer"
        code={CODE}
        states={[
          {
            label: "Streaming",
            node: <Thread align="start" messages={[{ id: "s1", role: "assistant", content: "Drafting a note for the crew", status: "streaming" }]} />,
          },
          {
            label: "Empty",
            node: <Thread align="start" messages={[]} emptyMessage="Try “What is due this week?”" />,
          },
          {
            label: "Error",
            node: <Thread align="start" messages={[{ id: "e1", role: "user", content: ASK.text, status: "error" }]} onRetry={() => undefined} />,
          },
        ]}
      >
        <Stack gap="md">
          <Thread messages={MESSAGES} height={340} />
          <AiChatInput placeholder="Ask about Tideline" aria-label="Ask about Tideline" />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Assistant on a phone" caption="Thread above, composer pinned below" padding="none" widths={false}>
        <div className="cs-grain" style={{ padding: 32, borderRadius: 0 }}>
          <Phone title="Assistant">
            <div style={{ flex: 1, minHeight: 0 }}>
              <ChatThread messages={PHONE_MESSAGES} />
            </div>
            <div style={{ padding: 12 }}>
              <AiChatInput placeholder="Ask about Tideline" aria-label="Ask about Tideline" />
            </div>
          </Phone>
        </div>
      </DemoStage>

      {/* ---- parity-a2: chat ---- */}
      <Heading level={2}>Bubbles variant</Heading>
      <DemoStage
        title="Classic messenger bubbles"
        caption='variant="bubbles": 22px bubbles with a squared tail, citation cards, a round scroll-to-latest button'
        code={`<ChatThread variant="bubbles" messages={messages}
  scrollToLatest={{ label: "Scroll to latest", threshold: 120, icon: <ArrowDown /> }}
  moreCitationsLabel={(n) => \`\${n} more citations\`} />`}
        states={[
          { label: "Streaming", node: <ChatThread variant="bubbles" style={{ height: 120 }} messages={[{ id: "s1", role: "user", content: "What is grace?" }, { id: "s2", role: "assistant", content: "", status: "streaming" }]} /> },
          { label: "Crisis", node: <ChatThread variant="bubbles" style={{ height: 170 }} messages={[{ id: "c1", role: "assistant", tone: "crisis", content: "I am concerned about you. Please reach out to someone you trust right now." }]} /> },
          { label: "Retry on a bubble", node: <ChatThread variant="bubbles" style={{ height: 110 }} messages={[{ id: "r1", role: "user", content: "One more question please", actions: <Chip variant="floating" aria-label="Try again">↻</Chip> }]} /> },
          { label: "No citation", node: <ChatThread variant="bubbles" style={{ height: 130 }} messages={[{ id: "n1", role: "assistant", content: "The Eucharist is the source and summit.", citations: [], citationsEmptyNote: "No Catechism citation" }]} /> },
        ]}
      >
        <ChatThread
          variant="bubbles"
          style={{ height: 360 }}
          moreCitationsLabel={(n) => `${n} more citations`}
          messages={[
            { id: "b1", role: "user", content: "What does the Church teach about grace?" },
            {
              id: "b2",
              role: "assistant",
              content: "Grace is the free and undeserved help that God gives us.",
              citations: [
                { label: "CCC 1996", note: "— Grace and Justification", detail: "Grace is favor, the free and undeserved help…", href: "#" },
                { label: "CCC 2006", note: "— Merit", detail: "The term merit refers in general to the recompense owed…" },
              ],
              footer: (
                <Stack direction="row" gap="sm">
                  <Chip variant="outline" aria-label="Helpful">↑</Chip>
                  <Chip variant="outline" aria-label="Unhelpful">↓</Chip>
                  <Chip size="sm">Share answer</Chip>
                </Stack>
              ),
            },
          ]}
        />
      </DemoStage>

      <Heading level={2}>Chip</Heading>
      <DemoStage
        title="Pill buttons beside content"
        caption="tonal, outline (toggle) and floating"
        code={`<Chip>Why do Catholics pray the Rosary?</Chip>
<Chip variant="outline" pressed aria-label="Helpful">↑</Chip>
<Chip variant="floating" aria-label="Try again">↻</Chip>`}
        states={[
          { label: "Tonal", node: <Chip>Why do Catholics pray the Rosary?</Chip> },
          { label: "Tonal sm", node: <Chip size="sm">Share answer</Chip> },
          { label: "Outline", node: <Chip variant="outline" aria-label="Helpful">↑</Chip> },
          { label: "Outline pressed", node: <Chip variant="outline" pressed aria-label="Helpful, chosen">↑</Chip> },
          { label: "Outline disabled", node: <Chip variant="outline" disabled aria-label="Unhelpful">↓</Chip> },
          { label: "Floating", node: <Chip variant="floating" aria-label="Try again">↻</Chip> },
        ]}
      >
        <Chip>Help me prepare for Confession</Chip>
      </DemoStage>

      <NewBStages />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
