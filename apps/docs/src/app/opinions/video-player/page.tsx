"use client";

import { Avatar, Card, Heading, Stack, Text, VideoPlayer } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, avatarOf } from "@/fixtures/tideline";

const CODE = "<VideoPlayer src=\"/clip.mp4\" poster=\"/poster.jpg\" />";

const SAMPLE_SRC = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["VideoPlayer"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "The scrub bar is a real `role=\"slider\"`: ArrowLeft and ArrowRight seek 5 seconds, Home and End jump to the start and end." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"video-player\"` on the root (a `role=\"group\"`); parts: `video`, `controls`, `play-button`, `skip-back`, `skip-forward`, `scrub`, `time`, `mute`, `volume`, `fullscreen`, `error`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no video player; keep the real `<video>` and re-skin the controls." }],
  },
];

export default function VideoPlayerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>VideoPlayer</Heading>
      <Text color="secondary">A video with play, pause, scrub, volume and fullscreen controls.</Text>

      <DemoStage title="Walkthrough" caption="Space plays, arrows seek 5 seconds" code={CODE} widths={false}
        states={[
          { label: "Skip 15 seconds", node: <VideoPlayer src={SAMPLE_SRC} skipSeconds={15} /> },
          { label: "Skip 5 seconds", node: <VideoPlayer src={SAMPLE_SRC} skipSeconds={5} /> },
          { label: "preload=\"none\": nothing downloads until Play (default \"metadata\")", node: <VideoPlayer src={SAMPLE_SRC} preload="none" /> },
        ]}>
        <div style={{ maxWidth: 560 }}>
          <VideoPlayer src={SAMPLE_SRC} />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Interview recording" caption="Watch the call beside the notes" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Interview 03 walkthrough" subtitle={`${FILES[2].size}, Crew interviews`} avatar={<Avatar {...avatarOf("priya")} />} labels={[{ label: "Research" }]}>
          <Stack gap="md">
            <VideoPlayer src={SAMPLE_SRC} />
            <Text size="sm" color="secondary">Priya walks the night-watch handover with Tomas Larsen. Notes are due 17 Oct.</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
