"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpIcon, Avatar, Button, FloatAssistant, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CHAT, TASKS, avatarOf, person, project } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<FloatAssistant
  name="Tideline assistant"
  greeting="Seven tasks due this week, three today. Offline sync is in review."
  apiEndpoint="/api/assistant/chat"
  getHostContext={() => \`Project: \${project.name}, \${openTasks} open tasks\`}
  screenshotEnabled={false}
  markdown
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FloatAssistant"] ?? [] },
  {
    type: "doc-section",
    heading: "API integration",
    body: [
      { kind: "text", text: "The construct never sees an API key: `apiEndpoint` is a server-side proxy you implement. It receives `{ message, history, screenshot?, pageContext?, hostContext? }` and returns `{ reply }`. `getHostContext` is called fresh before every send to describe the real on-screen state (the open project, an active filter)." },
      { kind: "code", code: `POST /api/assistant/chat\n{ "message": "What is due this week?", "history": [...], "hostContext": "Project: Harbour rebrand, 5 open tasks" }\n\n{ "reply": "Seven tasks, three today. Offline sync is in review." }` },
    ],
  },
  {
    type: "doc-section",
    heading: "Features",
    body: [
      { kind: "text", text: "Drag the button anywhere (`draggable`), minimise it to a dot (`minimizable`), dock the panel to a full-height sidebar (`sidebarDockable`), switch to voice (`voiceEnabled`, `voices`), render replies as Markdown (`markdown`), and pick a WebGL orb persona (`persona`: Spark, Strato or Chorus). The footer always says it is an AI." },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'Real `role="dialog"` when expanded, `aria-label` and `aria-expanded` on the trigger, keyboard-navigable controls and visible focus. The floating button is always reachable with Tab.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="float-assistant"`, `data-rebar-part="trigger"` on the button, `"panel"` on the expanded panel, `"messages"` on the message list.' }],
  },
];

const harbour = project("harbour");
const sync = TASKS.find((t) => t.id === "sync") ?? TASKS[0];
const home = TASKS.find((t) => t.id === "home") ?? TASKS[0];
const GREETING = "Seven tasks due this week, three today. Offline sync for tasks is in review.";

/** A box that is its own containing block, so the assistant's fixed button and panel stay inside it. */
function Screen({ children, height = 300, style }: { children?: ReactNode; height?: number; style?: CSSProperties }) {
  return <div style={{ position: "relative", transform: "translateZ(0)", height, overflow: "hidden", borderRadius: 14, border: "1px solid var(--rebar-color-border)", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", ...style }}>{children}</div>;
}

function Bubble({ from, children, cite }: { from: "user" | "assistant"; children: ReactNode; cite?: string }) {
  const mine = from === "user";
  return (
    <div style={{ alignSelf: mine ? "flex-start" : "flex-end", maxWidth: "84%", padding: "10px 14px", borderRadius: 16, background: mine ? "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" : "var(--rebar-color-bg-inverse)", color: mine ? "var(--rebar-color-text-primary)" : "var(--rebar-color-text-inverse)", border: mine ? "1px solid var(--rebar-color-border)" : 0, fontSize: 14, lineHeight: 1.45 }}>
      {children}
      {cite ? <div style={{ marginTop: 6 }}><Tag>{cite}</Tag></div> : null}
    </div>
  );
}

export default function FloatAssistantPage() {
  const [sent, setSent] = useState<string | null>(null);
  const common = { name: "Tideline assistant", greeting: GREETING, screenshotEnabled: false, markdown: true, onSendMessage: (m: string) => setSent(m) } as const;

  return (
    <Stack gap="lg">
      <Heading level={1}>FloatAssistant</Heading>
      <Text color="secondary">A button that opens an assistant panel over the page.</Text>

      <DemoStage
        title="Open panel"
        caption="Press Ask; the panel, the composer and the greeting"
        code={CODE}
        states={[
          { label: "Closed", node: <Screen height={120}><FloatAssistant {...common} /></Screen> },
          { label: "Dark", node: <Screen height={120}><FloatAssistant {...common} theme="dark" /></Screen> },
          { label: "Bottom left", node: <Screen height={120}><FloatAssistant {...common} position="bottom-left" /></Screen> },
          { label: "Accent", node: <Screen height={120}><FloatAssistant {...common} accentColor="var(--rebar-color-info)" /></Screen> },
        ]}
      >
        <Screen height={600} style={{ background: "transparent", border: 0 }}>
          <Stack gap="sm" style={{ padding: 4, maxWidth: 360 }}>
            <Kicker>{harbour.kicker}</Kicker>
            <Heading level={3}>{harbour.name}</Heading>
            <PhoneList>
              {[sync, home].map((t) => (
                <PhoneRow key={t.id} thumb={false} title={t.title} meta={<Tag tone={t.tag === "Design" ? "error" : "info"} style={{ marginTop: 6 }}>{t.tag}</Tag>} trailing={<Avatar size="sm" {...avatarOf(t.assignee)} />} />
              ))}
            </PhoneList>
            <Text size="xs" color="secondary" aria-live="polite">
              {sent ? `Sent: “${sent}”. Wire apiEndpoint for a reply.` : "Open the assistant and ask about the project."}
            </Text>
          </Stack>
          <FloatAssistant {...common} draggable minimizable getHostContext={() => `Project: ${harbour.name}, ${TASKS.filter((t) => t.project === harbour.id && t.column !== "done").length} open tasks`} />
        </Screen>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On a phone" caption="The button over the project, and the conversation as a screen" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title={harbour.name} height={460} overlay={<FloatAssistant {...common} />}>
              <PhoneList>
                <PhoneRow title={sync.title} meta={`${person(sync.assignee).name.split(" ")[0]} · ${sync.tag}`} tint={1} />
                <PhoneRow title={home.title} meta={`${person(home.assignee).name.split(" ")[0]} · ${home.tag}`} tint={2} />
              </PhoneList>
            </TidelinePhone>
            <TidelinePhone title="Assistant" height={460}>
              <Stack gap="sm" style={{ minHeight: 330 }}>
                {CHAT.map((m) => (
                  <Bubble key={m.id} from={m.from === "assistant" ? "assistant" : "user"} cite={m.citations?.[0]}>
                    {m.text}
                  </Bubble>
                ))}
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, padding: "6px 6px 6px 14px", borderRadius: 999, border: "1px solid var(--rebar-color-border)", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" }}>
                  <Text size="sm" color="secondary" style={{ flex: 1 }}>
                    Ask about {harbour.name}
                  </Text>
                  <Button size="sm" aria-label="Send" style={{ padding: "0 10px", minHeight: 32 }}>
                    <ArrowUpIcon aria-hidden="true" />
                  </Button>
                </div>
              </Stack>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
