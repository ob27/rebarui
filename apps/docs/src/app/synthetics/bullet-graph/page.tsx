import { BulletGraph, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<BulletGraph
  title="October targets"
  measures={[
    { label: "Tasks done", value: 33, target: 30, ranges: [20, 30, 40] },
    { label: "Hours logged", value: 109, target: 120, ranges: [80, 120, 160] },
  ]}
/>`;

const INK = "var(--rebar-color-primary)";
const MAIN = [
  { label: "Tasks done", value: 33, target: 30, ranges: [20, 30, 40] as [number, number, number], color: INK },
  { label: "Hours logged", value: 109, target: 120, ranges: [80, 120, 160] as [number, number, number], color: INK },
  { label: "Harbour (%)", value: 84, target: 80, ranges: [50, 80, 100] as [number, number, number], color: INK },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BulletGraph"] ?? [] },
  {
    type: "doc-section",
    heading: "Reading it",
    body: [{ kind: "text", text: "A bar for the value, a tick for the target, and three shaded bands for poor, satisfactory and good. Each measure is scaled to its own `ranges`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="bullet-graph"` on the root `<figure>`; `data-rebar-part="measure"` per row, `"measure-bar"` and `"target"` within it.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose a thin `Progress` bar with a target-tick overlay, or adopt a dataviz library." }],
  },
];

export default function BulletGraphPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BulletGraph</Heading>
      <Text color="secondary">A measure bar against a target tick, read against three shaded bands.</Text>

      <DemoStage
        title="October targets"
        caption="Tasks, hours and Harbour progress against plan"
        code={CODE}
        states={[
          { label: "Below target", node: <BulletGraph ariaLabel="Interviews" measures={[{ label: "Interviews done", value: 9, target: 12, ranges: [6, 12, 15], color: INK }]} /> },
          { label: "Over target", node: <BulletGraph ariaLabel="Rota" measures={[{ label: "Rota export runs", value: 14, target: 10, ranges: [5, 10, 12], color: INK }]} /> },
        ]}
      >
        <BulletGraph title="October targets" measures={MAIN} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Studio dashboard" caption="One card of KPIs" widths={false}>
        <Card title="This month" style={{ maxWidth: 560, margin: "0 auto" }}>
          <BulletGraph ariaLabel="Month targets" measures={MAIN.slice(0, 2)} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
