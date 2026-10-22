"use client";

import { Avatar, Card, Ellipsis, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf, person } from "@/fixtures/tideline";

const CODE = `<Ellipsis content={note} rows={2} expandText="More" collapseText="Less" />`;

const NOTE =
  "Interview 11: most of the crew keep a paper copy of the rota in the cab because the app is slow to open on the quay. They want shifts they can read at a glance, offline, with the next handover time shown first.";
const FILE = "interview-03-walkthrough-harbour-office-second-take-final.mp4";

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Ellipsis"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="ellipsis"`; `data-rebar-part="content"|"expand"|"collapse"`.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Ant Design (web) has no direct equivalent — `Typography.Text`'s own `ellipsis` prop only truncates, with no expand/collapse and no `middle`/`start` direction. This ports antd-**mobile**'s `Ellipsis` instead, the closest real match.",
      },
    ],
  },
];

export default function EllipsisPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Ellipsis</Heading>
      <Text color="secondary">Cuts text to a number of lines, with optional More and Less.</Text>

      <DemoStage
        title="Interview note"
        caption="Two lines, then More"
        code={CODE}
        states={[
          { label: "One line, cut in the middle", node: <div style={{ maxWidth: 280 }}><Ellipsis content={FILE} rows={1} direction="middle" /></div> },
          { label: "Cut at the start", node: <div style={{ maxWidth: 280 }}><Ellipsis content={FILE} rows={1} direction="start" /></div> },
          { label: "Short text, nothing to cut", node: <div style={{ maxWidth: 280 }}><Ellipsis content="Twelve calls, one clear pattern." rows={2} expandText="More" /></div> },
          { label: "Opens expanded", node: <div style={{ maxWidth: 280, background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", padding: 8, borderRadius: 8 }}><Ellipsis content={NOTE} rows={2} defaultOpen expandText="More" collapseText="Less" /></div> },
        ]}
      >
        <Card style={{ maxWidth: 460, margin: "0 auto" }}>
          <Ellipsis content={NOTE} rows={2} expandText="More" collapseText="Less" />
        </Card>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Activity feed" caption="Long updates stay one row tall until opened" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }} title="Latest notes">
          <Stack gap="md">
            {[
              { id: "priya", text: NOTE },
              { id: "jonas", text: "Offline sync now queues edits while the phone has no signal and replays them in order when it reconnects. Conflicts keep the newest edit and flag the older one for a look." },
              { id: "maya", text: "Palette signed off." },
            ].map((n) => (
              <Stack key={n.id} direction="row" gap="sm" align="start">
                <Avatar {...avatarOf(n.id)} size="sm" />
                <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{person(n.id).name}</Text>
                  <Text size="sm" color="secondary"><Ellipsis content={n.text} rows={2} expandText="More" collapseText="Less" /></Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
