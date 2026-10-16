"use client";

import { useState } from "react";
import { Heading, Stack, Text, VoiceInputBar } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import type { VoiceInputBarState } from "rebar-ui";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { CHAT } from "@/fixtures/tideline";

const CODE = "<VoiceInputBar\n  state={state}\n  onMicPress={toggleListening}\n  onKeyboardToggle={() => setMode(\"text\")}\n/>";

function Bar({ state }: { state: VoiceInputBarState }) {
  return <VoiceInputBar state={state} barCount={28} onMicPress={() => {}} onKeyboardToggle={() => {}} />;
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["VoiceInputBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Presentational",
    body: [{ kind: "text", text: "No audio capture inside: the caller owns the microphone and sets `state`. The waveform is a seeded decoration, not real amplitude." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"voice-input-bar\"`, `data-rebar-state` mirrors `state`; parts include `waveform`, `status`, `mic-button`, `keyboard-toggle`, `camera-button`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's circular `Button`s against the same state machine; there is no AntD waveform strip." }],
  },
];

export default function VoiceInputBarPage() {
  const [state, setState] = useState<VoiceInputBarState>("idle");
  const press = () => {
    if (state === "idle") setState("listening");
    else if (state === "listening") {
      setState("processing");
      setTimeout(() => setState("idle"), 1200);
    }
  };
  return (
    <Stack gap="lg">
      <Heading level={1}>VoiceInputBar</Heading>
      <Text color="secondary">The voice capture bar: a waveform, a status line, a big mic button, and keyboard and camera buttons.</Text>

      <DemoStage title="Assistant mic" caption="Press the mic to listen, press again to send" code={CODE} widths={false}
        states={[
          { label: "Listening", node: <Bar state="listening" /> },
          { label: "Processing", node: <Bar state="processing" /> },
        ]}>
        <div style={{ maxWidth: 420, border: "1px solid var(--rebar-color-border)", borderRadius: 12 }}>
          <VoiceInputBar state={state} onMicPress={press} onKeyboardToggle={() => setState("idle")} />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Ask Tideline" caption="Voice mode in the phone assistant" padding="none" widths={false}>
        <div style={{ padding: 20, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {(["idle", "listening"] as const).map((s) => (
            <TidelinePhone key={s} title="Ask Tideline" tabs={false} height={540} width={290} padding={12}>
              <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 10 }}>
                {CHAT.slice(0, 2).map((m) => (
                  <div key={m.id} style={{ alignSelf: m.from === "assistant" ? "flex-start" : "flex-end", maxWidth: "88%", padding: "8px 12px", borderRadius: 14, fontSize: 13, border: "1px solid var(--rebar-color-border)", background: m.from === "assistant" ? "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" : "var(--rebar-color-tint-3)" }}>{m.text}</div>
                ))}
                <div style={{ marginTop: "auto" }}><Bar state={s} /></div>
              </div>
            </TidelinePhone>
          ))}
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
