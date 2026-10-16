import { Avatar, Button, Card, Heading, OrgChart, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, avatarOf, person } from "@/fixtures/tideline";

const CODE = `<OrgChart
  title="Tideline team"
  people={[
    { id: "leo", name: "Leo Santos", role: "Operations" },
    { id: "maya", name: "Maya Chen", role: "Design", parentId: "leo" },
    { id: "jonas", name: "Jonas Weber", role: "Engineering", parentId: "leo" },
  ]}
/>`;

// Leo runs the studio; the other three report to him.
const TEAM = PEOPLE.map((p) => (p.id === "leo" ? { id: p.id, name: p.name, role: p.role } : { id: p.id, name: p.name, role: p.role, parentId: "leo" }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["OrgChart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="org-chart"` on the root; the underlying `NodeLinkGraph`\'s own toolbar/node/edge parts render underneath unchanged.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no diagramming components of its own; an org chart typically migrates to a dedicated library (Google Charts' OrgChart, GoJS) rather than an antd component.",
      },
    ],
  },
];


export default function OrgChartPage() {
  const maya = person("maya");
  return (
    <Stack gap="lg">
      <Heading level={1}>OrgChart</Heading>
      <Text color="secondary">A top-down reporting chart: give each person a manager and the lines are drawn for you.</Text>

      <DemoStage
        title="Tideline team"
        caption="Leo and the three who report to him"
        code={CODE}
        widths={false}
        states={[
          { label: "One person", node: <OrgChart title="Solo" width={190} height={120} people={[TEAM[3]!]} /> },
          { label: "Long role", node: <OrgChart title="Long role" width={190} height={120} people={[{ id: "ben", name: "Ben Okafor", role: "Pilot boat skipper, northern depots" }]} /> },
        ]}
      >
        <OrgChart title="Tideline team" people={TEAM} width={600} height={300} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team page" caption="The chart with a person's card beside it" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <Card title="Who reports to whom" subtitle="Four people, one studio" style={{ flex: "2 1 360px" }}>
            <OrgChart title="Tideline team" people={TEAM} width={520} height={280} />
          </Card>
          <Card title={maya.name} subtitle={maya.role} avatar={<Avatar {...avatarOf("maya")} />} actions={[<Button key="msg" variant="secondary">Message</Button>]} style={{ flex: "1 1 220px" }}>
            <Text size="sm" color="secondary">Reports to Leo Santos. Leads the Harbour rebrand and Depot signage.</Text>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
