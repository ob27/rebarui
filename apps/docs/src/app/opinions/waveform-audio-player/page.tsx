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
  {
    type: "doc-section",
    heading: "Track appearance",
    body: [
      { kind: "text", text: "`appearance=\"track\"` is the plain mobile player: a bare round play/pause glyph, a thin seek rail with a progress fill, and `m:ss / m:ss`. There are no bars and no skip buttons; the rail is still the `role=\"slider\"` named Seek. Set `--rebar-waveform-track-fill`, `-rail`, `-glyph-size`, `-gap`, `-height`, `-rail-height`, `-time-size`, `-time-opacity` and `--rebar-waveform-glyph-ink` to match a brand." },
    ],
  },
  {
    type: "doc-section",
    heading: "Card appearance",
    body: [
      { kind: "text", text: "`appearance=\"card\"` draws the app player: a raised rounded card, a round play button (`playIcon` and `pauseIcon` swap the glyph), the elapsed time, a short bar waveform (`barHeights` gives one percent per bar; a bar counts as played while its index over the count is at most the progress) and the total time. Skip buttons are not drawn. Set `--rebar-waveform-card-background`, `-radius`, `-padding`, `-shadow`, `-gap`, `-play-size`, `-play-background`, `-play-color`, `-time-*`, `-height`, `-bar`, `-bar-played` to match a brand." },
    ],
  },
  {
    type: "doc-section",
    heading: "Icon controls, compact size, audioRef",
    body: [
      {
        "kind": "text",
        "text": "`controls=\"icons\"` draws round glyph buttons (play, pause, replay, skip back/forward with the seconds) instead of the labelled text buttons; each keeps its accessible name. `size=\"compact\"` tightens the bar for lists and cards. `audioRef` gives you the underlying `<audio>` element (object or callback ref) and `crossOrigin` is forwarded to it. The error message uses a danger tone mixed toward the text colour, at least 6:1 on the page and tints in light and dark, and a lighter one on `tone=\"onDark\"`."
      },
      {
        "kind": "code",
        "code": "<WaveformAudioPlayer src={url} controls=\"icons\" size=\"compact\" audioRef={audio} crossOrigin=\"anonymous\" />"
      }
    ],
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

      <DemoStage title="Track appearance" caption="appearance=&quot;track&quot;: a bare round play glyph, a thin seek rail with a fill and m:ss / m:ss (the plain mobile player)" code={"<WaveformAudioPlayer src={url} appearance=\"track\" />"} widths={false}
        states={[{ label: "On dark art", node: <div style={{ background: "#0a0b16", color: "#fdfaf5", padding: 14, borderRadius: 16 }}><WaveformAudioPlayer src={SRC} appearance="track" tone="onDark" aria-label="Track on dark" /></div> }]}>
        <div style={{ maxWidth: 480 }}>
          <WaveformAudioPlayer src={SRC} appearance="track" aria-label="Track player" />
        </div>
      </DemoStage>

      <DemoStage title="Card appearance" caption="appearance=&quot;card&quot;: a raised card with a round play button, elapsed time, short bar waveform and total time (the app player)" code={"<WaveformAudioPlayer src={url} appearance=\"card\" barHeights={[40, 70, 55, 90, 35]} />"} widths={false}>
        <div style={{ maxWidth: 480 }}>
          <WaveformAudioPlayer src={SRC} appearance="card" barHeights={[40, 70, 55, 90, 35, 60, 80, 45, 65, 50, 75, 40, 85, 55, 70, 45]} aria-label="Card player" />
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
