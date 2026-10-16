import { Card, Heading, Sparkline, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { KPIS, WEEKLY_DONE } from "@/fixtures/tideline";

const CODE = `<Text>
  Tasks done per week{" "}
  <Sparkline ariaLabel="Tasks done per week, last 12 weeks" values={[14, 19, 16, 22, 20, 25, 23, 28, 25, 31, 29, 33]} />
</Text>`;

// Same twelve weeks, other series for the rows below.
const OPEN = [58, 55, 57, 52, 53, 49, 50, 47, 48, 46, 45, 42];
const DUE_SOON = [4, 6, 5, 8, 6, 9, 7, 6, 8, 5, 7, 7];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Sparkline"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="sparkline"` on the root `<svg>` itself — unlike the other charts, there is no wrapping `<figure>` and no `data-rebar-part`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends pairing with a separate charting library, e.g. `@ant-design/charts`, built on G2Plot); a migration reimplements this inline trend line against whichever charting library the target project already uses.",
      },
    ],
  },
];

export default function SparklinePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Sparkline</Heading>
      <Text color="secondary">A tiny trend line with no axes, made to sit inside a sentence, a table cell or a stat card.</Text>

      <DemoStage
        title="Weekly throughput"
        caption="Tasks done per week, 3 Aug to 19 Oct"
        code={CODE}
        states={[
          { label: "Short", node: <Sparkline ariaLabel="Last four weeks" values={WEEKLY_DONE.slice(-4)} /> },
          { label: "Flat", node: <Sparkline ariaLabel="Flat" values={[20, 20, 20, 20, 20, 20]} /> },
          { label: "Larger", node: <Sparkline ariaLabel="Larger" values={WEEKLY_DONE} width={160} height={48} /> },
          { label: "Falling", node: <Sparkline ariaLabel="Open tasks" values={OPEN} /> },
        ]}
      >
        <Text>
          Tasks done per week <Sparkline ariaLabel="Tasks done per week, last 12 weeks" values={WEEKLY_DONE} />
        </Text>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Stat rows" caption="One line per measure, trend on the right" widths={false}>
        <Card title="This week" subtitle="12-week trend">
          <Stack gap="sm">
            {[
              { ...KPIS[0]!, values: OPEN },
              { ...KPIS[1]!, values: DUE_SOON },
              { label: "Done", value: WEEKLY_DONE[WEEKLY_DONE.length - 1]!, delta: "↑ 4 vs last week", values: WEEKLY_DONE },
            ].map((k) => (
              <Stack key={k.label} direction="row" gap="md" align="center" justify="between">
                <Stack gap="xs">
                  <Text size="sm" color="secondary">{k.label}</Text>
                  <Text style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: 24 }}>{k.value}</Text>
                </Stack>
                <Text size="xs" color="secondary">{k.delta}</Text>
                <Sparkline ariaLabel={`${k.label}, last 12 weeks`} values={k.values} width={120} height={32} />
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
