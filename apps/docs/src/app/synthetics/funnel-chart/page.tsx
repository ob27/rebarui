import { Card, FunnelChart, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW_FUNNEL } from "@/fixtures/tideline";

const CODE = `<FunnelChart
  title="Crew interview recruitment"
  stages={[
    { label: "Contacted", value: 48 },
    { label: "Replied", value: 31 },
    { label: "Booked", value: 18 },
    { label: "Interviewed", value: 12 },
  ]}
  milestones={[{ afterStageIndex: 1, label: "Target: 20 booked" }]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FunnelChart"] ?? [] },
  {
    type: "doc-section",
    heading: "How it reads",
    body: [
      {
        kind: "text",
        text: "Each stage's width is scaled against the first stage's value and eased into the next. Colours cycle through a built-in palette when a stage has no `color`. `milestones` adds a dashed checkpoint line at a stage boundary.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="funnel-chart"` on the root `<figure>`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. AntD ships no chart components of its own (it recommends `@ant-design/charts`), so a funnel is reimplemented against whichever charting library the target project uses.",
      },
    ],
  },
];

export default function FunnelChartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FunnelChart</Heading>
      <Text color="secondary">A narrowing-bar chart: each stage scaled against the first, tapering into the next.</Text>

      <DemoStage
        title="Interview recruitment"
        caption="From first contact to a finished call"
        code={CODE}
        states={[
          { label: "Two stages", node: <FunnelChart ariaLabel="Replies" stages={CREW_FUNNEL.slice(0, 2)} height={140} /> },
          { label: "No milestone", node: <FunnelChart ariaLabel="Bookings" stages={CREW_FUNNEL.slice(1)} height={160} /> },
          { label: "Single colour", node: <FunnelChart ariaLabel="Single colour" stages={CREW_FUNNEL.map((s) => ({ ...s, color: "var(--rebar-color-primary)" }))} height={180} /> },
        ]}
      >
        <FunnelChart title="Crew interview recruitment" stages={CREW_FUNNEL} milestones={[{ afterStageIndex: 1, label: "Target: 20 booked" }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project card" caption="The funnel beside the project summary" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          <Card title="Crew interviews" style={{ flex: "1 1 180px" }}>
            <Stack gap="xs">
              <Text size="sm" color="secondary">Twelve calls, one clear pattern.</Text>
              <Text size="sm">Owner: Priya Nair</Text>
              <Text size="sm">Due 17 Oct, now late.</Text>
            </Stack>
          </Card>
          <Card title="Recruitment" style={{ flex: "2 1 420px" }}>
            <FunnelChart ariaLabel="Crew interview recruitment funnel" stages={CREW_FUNNEL} />
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
