"use client";

import { useState } from "react";
import { Card, Countdown, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<Countdown target="2026-10-24T09:00:00" onComplete={() => announceLaunch()} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Countdown"] ?? [] },
  {
    type: "doc-section",
    heading: "Format",
    body: [
      {
        kind: "text",
        text: 'The default format drops leading zero units: "2d 04h 12m 33s" becomes "12m 33s" once under an hour remains. Pass your own `format` function for anything else, such as a single "12:33" clock face.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="countdown"` on the root; `data-rebar-complete` present once the countdown reaches zero.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Statistic.Countdown` is the closest equivalent. Not yet codemod-covered, but a near 1:1 prop mapping (`value`/`target`, `onFinish`/`onComplete`).",
      },
    ],
  },
];

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export default function CountdownPage() {
  const [now] = useState(() => Date.now());
  const inMs = (ms: number) => new Date(now + ms).toISOString();
  const launch = inMs(3 * 86400000 + 4 * 3600000 + 12 * 60000);

  return (
    <Stack gap="lg">
      <Heading level={1}>Countdown</Heading>
      <Text color="secondary">A ticking countdown to a target time.</Text>

      <DemoStage
        title="Harbour launch"
        caption="Counts down to 24 Oct, 09:00"
        code={CODE}
        widths={false}
        states={[
          { label: "Under an hour", node: <Countdown target={inMs(12 * 60000 + 33000)} /> },
          { label: "Clock face", node: <Countdown target={inMs(90000)} format={mmss} /> },
          { label: "Complete", node: <Countdown target={inMs(-1000)} /> },
        ]}
      >
        <Countdown target={launch} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project card" caption="Time left until the payroll cut-off" widths={false}>
        <Card title="Rota export" style={{ maxWidth: 360, margin: "0 auto" }}>
          <Stack gap="xs">
            <Text size="sm" color="secondary">Payroll cut-off, 28 Oct. Owner: Leo Santos.</Text>
            <Heading level={3}>
              <Countdown target={inMs(4 * 86400000 + 2 * 3600000)} />
            </Heading>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
