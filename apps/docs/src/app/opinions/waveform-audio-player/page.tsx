"use client";

import { Avatar, Card, Heading, Stack, Text, WaveformAudioPlayer } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";
import { NewBStages } from "./NewBStages";

const CODE = "<WaveformAudioPlayer src=\"/voice-note.mp3\" barCount={48} skipSeconds={15} />";

const SRC = "/audio/empty-state-waiting-music.mp3";

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["WaveformAudioPlayer"] ?? [] },
  {
    type: "doc-section",
    heading: "Waveform",
    body: [{ kind: "text", text: "Bar heights are seeded from `src`, so the same audio always shows the same bars; there is no real amplitude analysis." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"waveform-audio-player\"`; parts include `play-button`, `skip-back`, `skip-forward`, `waveform`, `bar` (with `data-played` once passed), `time`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no audio player; use a dedicated library or a native `<audio controls>` if you do not need the waveform." }],
  },
];

export default function WaveformAudioPlayerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1} style={{ overflowWrap: "anywhere" }}>WaveformAudioPlayer</Heading>
      <Text color="secondary">An audio player with a bar waveform you can click to seek.</Text>

      <DemoStage title="Voice note" caption="Click the bars to seek; arrows and Home/End work too" code={CODE} widths={false}
        states={[
          { label: "Few bars, skip 5 seconds", node: <div style={{ overflowX: "auto" }}><WaveformAudioPlayer src={SRC} barCount={20} skipSeconds={5} aria-label="Few bars" /></div> },
          { label: "A different track", node: <div style={{ overflowX: "auto" }}><WaveformAudioPlayer src={SRC + "?b"} aria-label="Different bars" /></div> },
        ]}>
        <div style={{ maxWidth: 480, overflowX: "auto" }}>
          <WaveformAudioPlayer src={SRC} aria-label="Voice note from Priya" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Message" caption="A voice note in the crew chat" widths={false}>
        <Card style={{ maxWidth: 480, margin: "0 auto" }} title="Priya Nair" subtitle="Crew interviews, 21 Oct 09:40" avatar={<Avatar {...avatarOf("priya")} />} labels={[{ label: "Voice note" }]}>
          <div style={{ overflowX: "auto" }}><WaveformAudioPlayer src={SRC} aria-label="Voice note from Priya" /></div>
        </Card>
      </DemoStage>

      <NewBStages />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
