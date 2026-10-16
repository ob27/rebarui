import { Card, Heading, Stack, Text, Treemap } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, gbp } from "@/fixtures/tideline";

const CODE = `<Treemap
  title="Budget by area"
  data={[
    { label: "Brand", value: 70000, children: [{ label: "Harbour rebrand", value: 48200 }, { label: "Depot signage", value: 21800 }] },
    { label: "Product", value: 72900 },
  ]}
/>`;

const kickers = Array.from(new Set(PROJECTS.map((p) => p.kicker)));
const data = kickers.map((k) => {
  const ps = PROJECTS.filter((p) => p.kicker === k);
  const total = ps.reduce((s, p) => s + p.budget, 0);
  return ps.length > 1 ? { label: k, value: total, children: ps.map((p) => ({ label: p.name, value: p.budget })) } : { label: k, value: total };
});
const total = PROJECTS.reduce((s, p) => s + p.budget, 0);

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Treemap"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [{ kind: "text", text: "Slice-and-dice: top level splits horizontally, children vertically, area proportional to `value`. Nesting stops at one level." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="treemap"` on the root `<figure>`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD ships no chart components (it recommends `@ant-design/charts`); there is no 1:1 mapping for a treemap." }],
  },
];

export default function TreemapPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Treemap</Heading>
      <Text color="secondary">Rectangles sized by value, one level of grouping.</Text>

      <DemoStage
        title="Budget by area"
        caption="Five projects grouped by area"
        code={CODE}
        states={[
          { label: "Flat", node: <Treemap title="By project" width={260} height={150} data={PROJECTS.map((p) => ({ label: p.name, value: p.budget }))} /> },
          { label: "One group", node: <Treemap title="Brand" width={260} height={150} data={[{ label: "Brand", value: 70000, children: [{ label: "Harbour rebrand", value: 48200 }, { label: "Depot signage", value: 21800 }] }]} /> },
          { label: "Zero values", node: <Treemap title="Nothing spent" width={260} height={150} data={[{ label: "Rota export", value: 0 }, { label: "Crew interviews", value: 0 }]} /> },
        ]}
      >
        <Treemap title="Budget by area" data={data} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Finance overview" caption="Where the studio's budget sits" widths={false}>
        <Card title="Budget, Q4" style={{ maxWidth: 620, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">{gbp(total)} across five projects. Product is the largest area.</Text>
            <Treemap title="Budget by area" data={data} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
