"use client";

import { useState } from "react";
import { Button, ChatThread, Heading, Text } from "rebar-ui";
import type { ChatMessage } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { CHAT_ANSWER, CHAT_CITATIONS, CHAT_QUESTION, CRISIS_REPLY } from "@/fixtures/athic";

const CODE = `<ChatThread scrollToLatest onReachLatest={() => setUnread(0)} messages={[
  { id: "a", role: "assistant", content, citations, footer: <Button size="sm" variant="tertiary">Share answer</Button> },
  { id: "c", role: "assistant", tone: "crisis", content: crisisReply },
]} />`;

const footer = (
  <>
    <Button size="sm" variant="tertiary" aria-label="Helpful">Helpful</Button>
    <Button size="sm" variant="tertiary">Share answer</Button>
  </>
);

const MESSAGES: ChatMessage[] = [
  { id: "q1", role: "user", content: CHAT_QUESTION },
  { id: "a1", role: "assistant", content: CHAT_ANSWER, citations: CHAT_CITATIONS, footer },
  { id: "q2", role: "user", content: "Can I just tell God and skip it?" },
  { id: "a2", role: "assistant", content: "You can and should speak to God directly, but Christ also instituted the sacrament of Reconciliation for mortal sin (CCC 1456).", citations: [CHAT_CITATIONS[1]!], footer },
  { id: "q3", role: "user", content: "What do I say at the start?" },
  { id: "a3", role: "assistant", content: "“Bless me, Father, for I have sinned. It has been [time] since my last confession.” Then name your sins plainly.", footer },
];

/** Footer slot, citation pills, scroll-to-latest and the crisis tone. */
export function NewBStages() {
  const [reached, setReached] = useState(0);
  return (
    <>
      <Heading level={2}>Footer, Latest pill, crisis tone</Heading>
      <DemoStage title="Catechist chat" caption="Scroll up to bring the Latest pill; crisis and blocked replies drop the footer" code={CODE} widths={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone title="Catechist" height={500} padding={0} tabs={false}>
            <div style={{ position: "relative", height: "100%" }}>
              <ChatThread style={{ height: "100%" }} messages={MESSAGES} scrollToLatest onReachLatest={() => setReached((n) => n + 1)} aria-label="Catechist conversation" />
            </div>
          </TidelinePhone>
          <TidelinePhone title="Catechist" height={500} tabs={false}>
            <ChatThread
              messages={[
                { id: "q", role: "user", content: "I feel like I can’t go on." },
                { id: "c", role: "assistant", tone: "crisis", content: CRISIS_REPLY, footer: footer },
                { id: "b", role: "assistant", tone: "blocked", content: "I can’t help with that request, but I can point you to what the Church teaches.", footer: footer },
              ]}
            />
          </TidelinePhone>
        </div>
        <Text size="xs" color="secondary" style={{ marginTop: 8 }}>Reached the latest message {reached} time{reached === 1 ? "" : "s"}.</Text>
      </DemoStage>
    </>
  );
}
