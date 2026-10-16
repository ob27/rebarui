"use client";

import { Card, Heading, ProgressCircle, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, person } from "@/fixtures/tideline";

const CODE = `<ProgressCircle percent={84}>84%</ProgressCircle>
<ProgressCircle percent={100} color="var(--rebar-color-success)">Done</ProgressCircle>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ProgressCircle"] ?? [] },
  {
    type: "doc-section",
    heading: "Lighter-weight than GaugeChart",
    body: [
      {
        kind: "text",
        text: "`GaugeChart` carries axis labels, ticks, and threshold bands for a real dashboard metric. `ProgressCircle` is the antd-mobile pattern for a bare \"how far along is this\" ring — an upload, a multi-step form's completion — with none of that configuration. Reach for `GaugeChart` when the extra context matters; reach for this when it would just be visual noise.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="progress-circle"` on the root; parts: `track`, `fill`, `label`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: 'Not codemod-covered — the antd-mobile pattern. AntD desktop\'s `Progress` component with `type="circle"` is the direct equivalent.',
      },
    ],
  },
];

export default function ProgressCirclePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ProgressCircle</Heading>
      <Text color="secondary">A circular ring showing how far along something is.</Text>

      <DemoStage title="Project progress" caption="One ring per project, percent in the middle" code={CODE} widths={false}
        states={[
          { label: "Empty", node: <ProgressCircle percent={0}>0%</ProgressCircle> },
          { label: "Done", node: <ProgressCircle percent={100} color="var(--rebar-color-success)">Done</ProgressCircle> },
          { label: "Small", node: <ProgressCircle percent={61} size={56} strokeWidth={5}>61%</ProgressCircle> },
          { label: "Late", node: <ProgressCircle percent={33} color="var(--rebar-color-error)">33%</ProgressCircle> },
        ]}
      >
        <Stack direction="row" gap="xl" align="center" style={{ flexWrap: "wrap" }}>
          {PROJECTS.slice(0, 3).map((p) => (
            <Stack key={p.id} gap="xs" align="center">
              <ProgressCircle percent={p.done} ariaLabel={`${p.name} ${p.done}% done`}>{p.done}%</ProgressCircle>
              <Text size="sm" color="secondary">{p.name}</Text>
            </Stack>
          ))}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects" caption="A ring beside each project, status as a tag" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }} title="This quarter">
          <Stack gap="md">
            {PROJECTS.map((p) => (
              <Stack key={p.id} direction="row" gap="md" align="center">
                <ProgressCircle percent={p.done} size={52} strokeWidth={5} ariaLabel={`${p.name} ${p.done}% done`}>{p.done}</ProgressCircle>
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text>{p.name}</Text>
                  <Text size="sm" color="secondary">{person(p.owner).name}, due {p.due}</Text>
                </Stack>
                <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
