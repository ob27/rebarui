"use client";

import { useState } from "react";
import { Heading, Stack, Text, VoiceComposer } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import type { VoiceComposerState } from "rebar-ui";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { CHAT } from "@/fixtures/tideline";

const CODE = "<VoiceComposer\n  state={state}\n  draftText={draft}\n  onDraftTextChange={setDraft}\n  onStartRecording={start}\n  onStopRecording={stop}\n  onSend={send}\n  onCancel={cancel}\n/>";

const NOTE = "Can you move the mobile design review to 14:00 on 22 Oct?";
const NOOP = { onStartRecording: () => {}, onStopRecording: () => {}, onSend: () => {}, onCancel: () => {} };

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["VoiceComposer"] ?? [] },
  {
    type: "doc-section",
    heading: "Presentational",
    body: [{ kind: "text", text: "No `MediaRecorder` inside: the caller records and transcribes, and drives the component with `state` and `draftText`. The draft is an editable textarea once ready." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"voice-composer\"`; parts include `main-button`, `cancel-button`, `draft-textarea`, `elapsed-time`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's `Button` and `Input.TextArea` against the same state machine." }],
  },
];

export default function VoiceComposerPage() {
  const [state, setState] = useState<VoiceComposerState>("idle");
  const [draft, setDraft] = useState("");
  const [ctx, setCtx] = useState<VoiceComposerState>("idle");
  return (
    <Stack gap="lg">
      <Heading level={1}>VoiceComposer</Heading>
      <Text color="secondary">A voice-message composer: a record button that changes with state, and an editable transcript.</Text>

      <DemoStage title="Voice note" caption="Record, stop, edit the transcript, send" code={CODE} widths={false}
        states={[
          { label: "Recording", node: <VoiceComposer state="recording" elapsedSeconds={12} draftText="Listening..." {...NOOP} /> },
          { label: "Transcribing", node: <VoiceComposer state="transcribing" {...NOOP} /> },
          { label: "Ready", node: <VoiceComposer state="ready" draftText={NOTE} {...NOOP} /> },
          { label: "Error", node: <VoiceComposer state="error" errorMessage="The microphone is blocked." {...NOOP} /> },
        ]}>
        <div style={{ maxWidth: 480 }}>
          <VoiceComposer
            state={state}
            draftText={draft}
            onDraftTextChange={setDraft}
            onStartRecording={() => { setState("recording"); setDraft("Listening..."); }}
            onStopRecording={() => { setState("transcribing"); setTimeout(() => { setDraft(NOTE); setState("ready"); }, 1000); }}
            onSend={() => { setState("idle"); setDraft(""); }}
            onCancel={() => { setState("idle"); setDraft(""); }}
          />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Crew chat" caption="Reply to Jonas by voice" padding="none" widths={false}>
        <div style={{ padding: 20, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone title="Mobile release" tabs={0} height={560} width={300}>
            <Stack gap="sm">
              {CHAT.map((m) => (
                <div key={m.id} style={{ alignSelf: m.from === "jonas" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "8px 12px", borderRadius: 14, fontSize: 13, background: m.from === "jonas" ? "var(--rebar-color-tint-3)" : "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", border: "1px solid var(--rebar-color-border)" }}>
                  {m.text}
                </div>
              ))}
              <VoiceComposer state={ctx} draftText={ctx === "ready" ? "Offline sync is in review; I will ping the crew once it lands." : ""} elapsedSeconds={5} onDraftTextChange={() => {}} onStartRecording={() => setCtx("recording")} onStopRecording={() => setCtx("ready")} onSend={() => setCtx("idle")} onCancel={() => setCtx("idle")} />
            </Stack>
          </TidelinePhone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
