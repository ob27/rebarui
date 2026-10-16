"use client";

import { Avatar, Card, GaugeChart, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, avatarOf, project } from "@/fixtures/tideline";

const CODE = `<GaugeChart
  title="Harbour rebrand"
  label="complete"
  value={84}
  min={0}
  max={100}
  valueFormat={(v) => \`\${v}%\`}
/>`;

const pct = (v: number) => `${v}%`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["GaugeChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="gauge-chart"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, a separate package built on G2Plot); there's no direct 1:1 antd component mapping for a gauge chart, so a migration reimplements this chart against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function GaugeChartPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>GaugeChart</Heading>
      <Text color="secondary">A half-circle dial showing one value between a minimum and a maximum.</Text>

      <DemoStage
        title="Project progress"
        caption="Harbour rebrand, 84% complete"
        code={CODE}
        states={[
          { label: "Late", node: <GaugeChart title="Crew interviews" label="complete" value={33} valueFormat={pct} size={200} /> },
          { label: "Overshoot", node: <GaugeChart title="Hours this week" label="of 30 planned" value={36} min={0} max={30} size={200} /> },
          { label: "Custom range", node: <GaugeChart title="Open tasks" label="of 60" value={42} min={0} max={60} size={200} /> },
        ]}
      >
        <GaugeChart title="Harbour rebrand" label="complete" value={harbour.done} min={0} max={100} valueFormat={pct} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project health" caption="One dial per project, owner underneath" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          {PROJECTS.slice(0, 4).map((p) => (
            <Card key={p.id} style={{ flex: "1 1 200px" }} title={p.name} subtitle={`Due ${p.due}`} extra={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>}>
              <Stack gap="sm" align="center">
                <GaugeChart ariaLabel={`${p.name}, ${p.done}% complete`} value={p.done} valueFormat={pct} size={180} />
                <Stack direction="row" gap="xs" align="center">
                  <Avatar size="sm" {...avatarOf(p.owner)} />
                  <Text size="sm" color="secondary">{avatarOf(p.owner).alt}</Text>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
