"use client";

import { Card, Heading, Stack, Text, WaterfallChart } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { gbp, project } from "@/fixtures/tideline";

const CODE = `<WaterfallChart
  title="Harbour rebrand budget bridge"
  steps={[
    { label: "Approved", value: 48200, isTotal: true },
    { label: "Signage kit", value: 6400 },
    { label: "Photography", value: -5200 },
    { label: "Print overrun", value: -2300 },
    { label: "Forecast", value: 47100, isTotal: true },
  ]}
/>`;

const start = project("harbour").budget;
const steps = [
  { label: "Approved", value: start, isTotal: true },
  { label: "Signage kit", value: 6400 },
  { label: "Agency credit", value: 1800 },
  { label: "Photography", value: -5200 },
  { label: "Print overrun", value: -2300 },
  { label: "Forecast", value: start + 6400 + 1800 - 5200 - 2300, isTotal: true },
];
const fmt = (v: number) => gbp(v);

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["WaterfallChart"] ?? [] },
  {
    type: "doc-section",
    heading: "Colours",
    body: [{ kind: "text", text: "Totals (`isTotal`) are drawn from zero in the primary colour; increases in the success colour, decreases in the danger colour, joined by dashed connectors." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="waterfall-chart"` on the root `<figure>`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no chart components (it recommends `@ant-design/charts`); reimplement against the charting library your project already uses." }],
  },
];

export default function WaterfallChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>WaterfallChart</Heading>
      <Text color="secondary">A starting total, a run of increases and decreases, and the ending total.</Text>

      <DemoStage
        title="Harbour rebrand budget bridge"
        caption="From the approved budget to the forecast"
        code={CODE}
        states={[
          { label: "Only increases", node: <WaterfallChart title="Extras" height={160} yFormat={fmt} steps={[{ label: "Start", value: 10000, isTotal: true }, { label: "Signage", value: 6400 }, { label: "Credit", value: 1800 }, { label: "End", value: 18200, isTotal: true }]} /> },
          { label: "Only decreases", node: <WaterfallChart title="Savings" height={160} yFormat={fmt} steps={[{ label: "Start", value: 20000, isTotal: true }, { label: "Photography", value: -5200 }, { label: "Print", value: -2300 }, { label: "End", value: 12500, isTotal: true }]} /> },
          { label: "Short", node: <WaterfallChart title="No change" height={160} yFormat={fmt} steps={[{ label: "Start", value: 9400, isTotal: true }, { label: "End", value: 9400, isTotal: true }]} /> },
        ]}
      >
        <WaterfallChart title="Harbour rebrand budget bridge" steps={steps} yFormat={fmt} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project review" caption="The bridge sits under the summary a lead reads first" widths={false}>
        <Card title="Harbour rebrand" style={{ maxWidth: 680, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">Forecast is {gbp(steps[steps.length - 1]!.value)} against {gbp(start)} approved, due 24 Oct.</Text>
            <WaterfallChart title="Budget bridge" steps={steps} yFormat={fmt} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
