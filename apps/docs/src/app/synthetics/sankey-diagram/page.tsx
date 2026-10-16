import { Card, Heading, SankeyDiagram, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, gbp } from "@/fixtures/tideline";

const CODE = `<SankeyDiagram
  title="Where the budget goes"
  nodes={[{ id: "all", label: "Studio budget" }, { id: "Brand", label: "Brand" }, { id: "harbour", label: "Harbour rebrand" } /* ... */]}
  links={[{ source: "all", target: "Brand", value: 70000 }, { source: "Brand", target: "harbour", value: 48200 } /* ... */]}
/>`;

const TEAMS = [...new Set(PROJECTS.map((p) => p.kicker))];
const NODES = [
  { id: "all", label: "Studio budget" },
  ...TEAMS.map((t) => ({ id: t, label: t })),
  ...PROJECTS.map((p) => ({ id: p.id, label: p.name })),
];
const LINKS = [
  ...TEAMS.map((t) => ({ source: "all", target: t, value: PROJECTS.filter((p) => p.kicker === t).reduce((n, p) => n + p.budget, 0) })),
  ...PROJECTS.map((p) => ({ source: p.kicker, target: p.id, value: p.budget })),
];
const TOTAL = PROJECTS.reduce((n, p) => n + p.budget, 0);

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SankeyDiagram"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="sankey-diagram"` on the root `<figure>`; each node carries `data-rebar-node-column`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no chart components of its own (it recommends `@ant-design/charts`, built on G2Plot); there's no direct 1:1 antd component mapping for a Sankey diagram.",
      },
    ],
  },
];

export default function SankeyDiagramPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SankeyDiagram</Heading>
      <Text color="secondary">A flow diagram where each link is as thick as the amount that moves along it.</Text>

      <DemoStage
        title="Where the budget goes"
        caption="Studio budget to teams to projects"
        code={CODE}
        states={[
          {
            label: "Two nodes",
            node: <SankeyDiagram title="Rota" nodes={[{ id: "a", label: "Operations" }, { id: "b", label: "Rota export" }]} links={[{ source: "a", target: "b", value: 6150 }]} height={120} />,
          },
          {
            label: "Split",
            node: (
              <SankeyDiagram
                title="Brand split"
                nodes={[{ id: "a", label: "Brand" }, { id: "b", label: "Harbour rebrand" }, { id: "c", label: "Depot signage" }]}
                links={[{ source: "a", target: "b", value: 48200 }, { source: "a", target: "c", value: 21800 }]}
                height={160}
              />
            ),
          },
        ]}
      >
        <SankeyDiagram title="Where the budget goes" nodes={NODES} links={LINKS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Budget review" caption={`${gbp(TOTAL)} across the studio`} widths={false}>
        <Card title="Budget flow" subtitle="October">
          <SankeyDiagram title="Budget by team and project" nodes={NODES} links={LINKS} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
