import { Heading, Stack, Text, VideoPlayer } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SAMPLE_SRC = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<VideoPlayer src="/clip.mp4" poster="/poster.jpg" />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["VideoPlayer"] ?? [] },
  {
    type: "doc-section",
    heading: "Parity with WaveformAudioPlayer",
    body: [
      {
        kind: "text",
        text: "Play/pause/scrub/volume/fullscreen — the same shape as the existing `WaveformAudioPlayer` (also Opinion), just for video. A real `<video>` element underneath, driven entirely by this component's own transport logic, with the same real, keyboard-operable `role=\"slider\"` scrub bar (ArrowLeft/ArrowRight seek by 5s, Home/End jump to start/end — see ref/HEURISTICS.md #38, no click/drag-only control).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="video-player"` on the root (a real `role="group"`); parts: `video`, `controls`, `play-button`, `skip-back`, `skip-forward`, `scrub`, `time`, `mute`, `volume`, `fullscreen`, `error`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated video player; a migration typically keeps the real `<video>` element and this same transport logic, re-skinning the controls.",
      },
    ],
  },
];

export default function VideoPlayerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>VideoPlayer</Heading>
      <Text color="secondary">Play/pause/scrub/volume/fullscreen — a real video transport control.</Text>

      <LivePreview>
        <VideoPlayer src={SAMPLE_SRC} />
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
