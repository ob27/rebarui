import { Card, Heading, PivotTable, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `<PivotTable
  title="Budget by team and status (GBP)"
  data={projects.map((p) => ({ team: p.kicker, status: p.status, budget: p.budget }))}
  rowField="team"
  colField="status"
  valueField="budget"
  aggregate="sum"
/>`;

const BUDGET = PROJECTS.map((p) => ({ team: p.kicker, status: p.status, budget: p.budget }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PivotTable"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="pivot-table"` on the root; renders through the real `Table` component underneath.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD ships no dedicated pivot-table component of its own — a migration typically composes AntD's `Table` with the aggregation done ahead of time (the same shape this component already produces) or reaches for a dedicated library (e.g. `react-pivottable`) for drill-down.",
      },
    ],
  },
];

export default function PivotTablePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>PivotTable</Heading>
      <Text color="secondary">A cross-tab that totals your records by a row and a column, with row and column totals.</Text>

      <DemoStage
        title="Budget by team and status"
        caption="Sum of budget; every cell is several records collapsed"
        code={CODE}
        states={[
          { label: "One row", node: <PivotTable title="Brand only" data={BUDGET.filter((r) => r.team === "Brand")} rowField="team" colField="status" valueField="budget" aggregate="sum" /> },
        ]}
      >
        <PivotTable title="Budget by team and status (GBP)" data={BUDGET} rowField="team" colField="status" valueField="budget" aggregate="sum" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Finance summary" caption="Where the money is, at a glance" widths={false}>
        <Card title="Budget by team" subtitle="Five projects, October">
          <PivotTable title="Projects by team and status" data={BUDGET} rowField="team" colField="status" valueField="budget" aggregate="count" />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
