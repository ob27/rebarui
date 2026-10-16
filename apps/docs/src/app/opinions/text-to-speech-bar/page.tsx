"use client";

import { useState } from "react";
import { Avatar, Card, Heading, Stack, Text, TextToSpeechBar } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";
import type { TtsState } from "rebar-ui";

const CODE = "<TextToSpeechBar\n  state={state}\n  onGenerate={generate}\n  onPlay={play}\n  onPause={pause}\n  onStop={stop}\n/>";

const VOICES = [{ id: "en-us", label: "English (US)" }, { id: "en-gb", label: "English (UK)" }];
const NOOP = { onGenerate: () => {}, onPlay: () => {}, onPause: () => {}, onStop: () => {} };

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TextToSpeechBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "The main button is always at least 44px and an aria-live region announces every state change. The component does no synthesis itself; the caller sets `state`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"text-to-speech-bar\"`, `data-rebar-state`; parts include `main-button`, `stop-button`, `voice-select`, `speed-slider`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's `Button`, `Progress`, `Select` and `Slider` against the same state machine." }],
  },
];

export default function TextToSpeechBarPage() {
  const [state, setState] = useState<TtsState>("idle");
  const [ctx, setCtx] = useState<TtsState>("paused");
  return (
    <Stack gap="lg">
      <Heading level={1}>TextToSpeechBar</Heading>
      <Text color="secondary">A play, pause, stop and generate bar; the caller drives the speech and the bar shows its state.</Text>

      <DemoStage title="Read aloud" caption="Generate, play, pause, stop" code={CODE} widths={false}
        states={[
          { label: "Generating", node: <TextToSpeechBar state="generating" {...NOOP} /> },
          { label: "Playing", node: <TextToSpeechBar state="playing" progress={0.4} {...NOOP} /> },
          { label: "Paused", node: <TextToSpeechBar state="paused" progress={0.4} {...NOOP} /> },
        ]}>
        <div style={{ maxWidth: 520 }}>
          <TextToSpeechBar
            state={state}
            onGenerate={() => {
              setState("generating");
              setTimeout(() => setState("playing"), 1200);
            }}
            onPlay={() => setState("playing")}
            onPause={() => setState("paused")}
            onStop={() => setState("idle")}
            voices={VOICES}
            selectedVoiceId="en-gb"
          />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Interview summary" caption="Listen to a write-up instead of reading it" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }} title="Crew interview 11" subtitle="Summary by Priya, 21 Oct" avatar={<Avatar {...avatarOf("priya")} />} labels={[{ label: "Research" }]}>
          <Stack gap="md">
            <Text size="sm">Shift swaps still run through the group chat. Three of the crew asked for a single place to see who is covering, and two said the quiet inbox would help on night watch.</Text>
            <TextToSpeechBar state={ctx} onGenerate={() => setCtx("playing")} onPlay={() => setCtx("playing")} onPause={() => setCtx("paused")} onStop={() => setCtx("idle")} voices={VOICES} selectedVoiceId="en-gb" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
