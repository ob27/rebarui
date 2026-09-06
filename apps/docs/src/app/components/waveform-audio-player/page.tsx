import { Heading, Stack, Text, WaveformAudioPlayer } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      { kind: "code", code: '<WaveformAudioPlayer src="/voice-message.mp3" barCount={48} skipSeconds={15} />' },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["WaveformAudioPlayer"] ?? [] },
  {
    type: "doc-section",
    heading: "A deterministic, low-fidelity waveform",
    body: [
      {
        kind: "text",
        text: 'Bar heights are seeded from a hash of `src` (the same deterministic-seed trick `Sticky`/`Avatar` placeholders use) — no real amplitude analysis, so the same audio always shows the same bar pattern. Bars double as a real click-to-seek scrub bar, with Arrow/Home/End keyboard seeking as the non-drag equivalent.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="waveform-audio-player"`; parts include `play-button`, `skip-back`, `skip-forward`, `waveform`, `bar` (with `data-played` once passed), and `time`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no audio-player primitive of its own; migrate to a dedicated audio-player library or a plain native `<audio controls>` if the waveform isn't required.",
      },
    ],
  },
];

export default function WaveformAudioPlayerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>WaveformAudioPlayer</Heading>
      <Text color="secondary">
        A transport control with a click-to-seek bar-based waveform display.
      </Text>

      <Text size="sm" color="secondary">
        A silent placeholder clip is wired up below (a real inline data URI, not a broken link) so
        the transport controls are genuinely interactive without needing a hosted audio file.
      </Text>
      <WaveformAudioPlayer
        src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
        aria-label="Demo audio player"
      />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
