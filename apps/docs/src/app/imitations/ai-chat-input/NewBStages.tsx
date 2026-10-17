"use client";

import { useEffect, useState } from "react";
import { AiChatInput, Button, Heading, Stack, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";

const CODE = `<AiChatInput onDictate={toggleRecording} recording={recording && { seconds }} transcribing={transcribing}
  disabled={replying && "Catechist is replying…"} banner={offline && <>You’re offline <Button size="sm">Retry</Button></>} />`;

/** Mic and send morph, recording, transcribing, quota/offline banners, disabled with a reason. */
export function NewBStages() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);
  const dictate = () => {
    if (!recording) {
      setSeconds(0);
      setRecording(true);
      return;
    }
    setRecording(false);
    setTranscribing(true);
    window.setTimeout(() => {
      setTranscribing(false);
      setText("What happens at Mass?");
    }, 1400);
  };
  return (
    <>
      <Heading level={2}>Mic and send morph</Heading>
      <DemoStage
        title="Dictation composer"
        caption="Empty shows the mic; text morphs it to Send. Mic starts recording, again stops and transcribes"
        code={CODE}
        widths={false}
      >
        <Stack gap="sm" style={{ maxWidth: 420, margin: "0 auto" }}>
          <AiChatInput
            value={text}
            onValueChange={setText}
            onSend={() => setText("")}
            onDictate={dictate}
            recording={recording ? { seconds } : false}
            transcribing={transcribing}
            placeholder="Ask about the faith…"
            aria-label="Ask a question"
          />
          <Text size="xs" color="secondary">Recording is simulated; the caller owns the real speech-to-text.</Text>
        </Stack>
      </DemoStage>
      <DemoStage title="Blocked states" caption="Every state that stops sending explains itself" widths={false}>
        <Stack gap="lg" style={{ maxWidth: 420, margin: "0 auto" }}>
          <Stack gap="xs"><Text size="xs" color="secondary">Disabled while the catechist replies</Text><AiChatInput onDictate={() => undefined} disabled="Catechist is replying…" aria-label="Disabled composer" /></Stack>
          <Stack gap="xs"><Text size="xs" color="secondary">Offline</Text><AiChatInput onDictate={() => undefined} disabled="Offline" banner={<><span>You’re offline.</span><Button size="sm" variant="tertiary">Retry</Button></>} aria-label="Offline composer" /></Stack>
          <Stack gap="xs"><Text size="xs" color="secondary">Quota exceeded</Text><AiChatInput onDictate={() => undefined} disabled="Daily limit reached" banner={<><span>You’ve used today’s questions.</span><Button size="sm" variant="tertiary">Upgrade</Button></>} aria-label="Quota composer" /></Stack>
          <Stack gap="xs"><Text size="xs" color="secondary">Transcribing</Text><AiChatInput onDictate={() => undefined} transcribing aria-label="Transcribing composer" /></Stack>
        </Stack>
      </DemoStage>
    </>
  );
}
