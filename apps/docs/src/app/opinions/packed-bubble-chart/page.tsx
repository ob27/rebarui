import { Avatar, Card, Heading, PackedBubbleChart, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, avatarOf, gbp } from "@/fixtures/tideline";

const CODE = `<PackedBubbleChart
  title="Budget by project"
  valueFormat={(v) => "£" + v.toLocaleString("en-GB")}
  items={[{ label: "Tideline mobile", value: 72900, group: "Product" }, { label: "Harbour rebrand", value: 48200, group: "Brand" } /* ... */]}
/>`;

const FLAT = PROJECTS.map((p) => ({ label: p.name, value: p.budget }));
const GROUPED = PROJECTS.map((p) => ({ label: p.name, value: p.budget, group: p.kicker }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PackedBubbleChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="packed-bubble-chart"` on the root `<figure>`; `data-rebar-part="mark"` per circle, `"group"` on a cluster boundary in grouped mode.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own; a migration typically adopts a dedicated circle-packing library (e.g. d3-hierarchy's `pack` layout) directly.",
      },
    ],
  },
];


export default function PackedBubbleChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>PackedBubbleChart</Heading>
      <Text color="secondary">Circles sized by value and packed together with no overlaps, optionally in groups.</Text>

      <DemoStage
        title="Budget by project"
        caption="Area is the budget; hover for the figure"
        code={CODE}
        states={[
          { label: "Grouped", node: <PackedBubbleChart title="By kind of work" height={190} items={GROUPED} valueFormat={gbp} /> },
          { label: "One bubble", node: <PackedBubbleChart title="One project" height={190} items={[FLAT[0]!]} valueFormat={gbp} /> },
          { label: "Long label", node: <PackedBubbleChart title="Long label" height={190} items={[{ label: "Wayfinding for the three northern depots", value: 21800 }, { label: "Rota", value: 6150 }]} valueFormat={gbp} /> },
        ]}
      >
        <PackedBubbleChart title="Budget by project" items={FLAT} valueFormat={gbp} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Budget overview" caption="Where the money sits, and who owns it" widths={false}>
        <Card title="Where the budget sits" subtitle="Five projects, October" style={{ maxWidth: 620, margin: "0 auto" }}>
          <Stack gap="md">
            <PackedBubbleChart title="Budget by kind of work" height={240} items={GROUPED} valueFormat={gbp} />
            <Stack gap="xs">
              {PROJECTS.map((p) => (
                <Stack key={p.id} direction="row" gap="sm" align="center">
                  <Avatar {...avatarOf(p.owner)} size="sm" />
                  <Text size="sm" style={{ flex: 1 }}>{p.name}</Text>
                  <Text size="sm" color="secondary">{gbp(p.budget)}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
