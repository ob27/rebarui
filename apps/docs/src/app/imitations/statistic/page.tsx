"use client";

import { Card, Heading, Stack, Statistic, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { HOURS_BY_PERSON, KPIS } from "@/fixtures/tideline";

const CODE = `<Statistic title="Open tasks" value={42} />
<Statistic title="On-time rate" value={87.5} precision={1} suffix="%" />
<Statistic title="Budget left" value={158450} prefix="£" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Statistic"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Plain text content — no special ARIA needed. A number is formatted with locale-aware thousands separators (`toLocaleString`) unless `precision` is set, in which case it's shown as a fixed-decimal string instead.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="statistic"`, `data-rebar-part="title" | "value" | "prefix" | "suffix"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Caption placement and type properties",
    body: [
      {
        kind: "text",
        text: '`titlePlacement="bottom"` puts the title under the value. `--rebar-statistic-title-size/-line-height/-gap`, `--rebar-statistic-value-size/-weight/-tracking/-line-height`, `--rebar-statistic-gap` and `--rebar-statistic-affix-size/-weight/-color/-tracking/-numeric` set the type; each fallback is the previous value.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Statistic` has the same `title`/`value`/`precision`/`prefix`/`suffix` prop shape almost exactly — a close, mostly mechanical rename, not yet codemod-covered.",
      },
    ],
  },
];

export default function StatisticPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Statistic</Heading>
      <Text color="secondary">A labeled number for a summary row or a card headline.</Text>

      <DemoStage title="This week" caption="Title, value, and optional prefix, suffix and precision" code={CODE} widths={false}
        states={[
          { label: "Precision", node: <Statistic title="On-time rate" value={87.5} precision={1} suffix="%" /> },
          { label: "Prefix", node: <Statistic title="Budget left" value={158450} prefix="£" /> },
          { label: "No data", node: <Statistic title="Interviews booked" value="—" /> },
          { label: "Caption below (titlePlacement=\"bottom\")", node: <div style={{ "--rebar-statistic-value-size": "30px", "--rebar-statistic-affix-size": "15px", "--rebar-statistic-affix-tracking": "normal", "--rebar-statistic-title-size": "12.5px", "--rebar-statistic-title-gap": "2px" } as React.CSSProperties}><Statistic titlePlacement="bottom" title="Mandatory Days attended this cycle" value={0} suffix="/ 56" /></div> },
          { label: "Long title", node: <Statistic title="Tasks waiting on a client reply" value={7} /> },
        ]}
      >
        <Stack direction="row" gap="xl" style={{ flexWrap: "wrap" }}>
          {KPIS.map((k) => <Statistic key={k.label} title={k.label} value={k.value} />)}
          <Statistic title="Hours logged" value={HOURS_BY_PERSON.reduce((n, h) => n + h.hours, 0)} suffix="h" />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Dashboard header" caption="One card per figure, with a delta line under each" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          {KPIS.map((k) => (
            <Card key={k.label} style={{ flex: "1 1 160px" }}>
              <Stack gap="xs">
                <Statistic title={k.label} value={k.value} />
                <Text size="sm" color="secondary">{k.delta}</Text>
              </Stack>
            </Card>
          ))}
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
