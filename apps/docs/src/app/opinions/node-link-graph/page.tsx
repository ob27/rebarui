import { Avatar, Button, Card, Heading, NodeLinkGraph, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, PROJECTS, STATUS_TONE, avatarOf, project } from "@/fixtures/tideline";

const CODE = `<NodeLinkGraph
  layout="hierarchical"
  title="Studio structure"
  nodes={[{ id: "studio", label: "Tideline" }, { id: "maya", label: "Maya Chen", parentId: "studio" }, { id: "harbour", label: "Harbour rebrand", parentId: "maya" }]}
  edges={[{ source: "studio", target: "maya" }, { source: "maya", target: "harbour" }]}
/>`;

// The studio, who leads which project, hierarchical: Tideline > people > their projects.
const NODES = [
  { id: "studio", label: "Tideline" },
  ...PEOPLE.map((p) => ({ id: p.id, label: p.name, parentId: "studio" })),
  ...PROJECTS.map((p) => ({ id: p.id, label: p.name, parentId: p.owner })),
];
const EDGES = NODES.filter((n) => "parentId" in n && n.parentId).map((n) => ({ source: (n as { parentId: string }).parentId, target: n.id }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["NodeLinkGraph"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="node-link-graph"`; parts: `toolbar`, `zoom-out-button`, `zoom-label`, `zoom-in-button`, `pan-zoom-container`, `node` (also carrying `data-node-id`), `edge`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no diagramming components of its own; a node-link graph typically migrates to a dedicated library (React Flow, Cytoscape.js) rather than an antd component.",
      },
    ],
  },
];


export default function NodeLinkGraphPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>NodeLinkGraph</Heading>
      <Text color="secondary">An SVG canvas of nodes and edges you can pan and zoom, with hierarchical, circular or manual layout.</Text>

      <DemoStage
        title="Studio structure"
        caption="Who leads which project"
        code={CODE}
        widths={false}
        states={[
          { label: "Circular", node: <NodeLinkGraph layout="circular" width={280} height={190} nodes={NODES.slice(1, 6)} edges={[]} /> },
          { label: "Two nodes", node: <NodeLinkGraph layout="hierarchical" width={280} height={190} nodes={[{ id: "a", label: "Maya Chen" }, { id: "b", label: "Harbour rebrand", parentId: "a" }]} edges={[{ source: "a", target: "b" }]} /> },
          { label: "No nodes", node: <NodeLinkGraph layout="hierarchical" width={280} height={190} nodes={[]} edges={[]} /> },
        ]}
      >
        <NodeLinkGraph layout="hierarchical" title="Studio structure" nodes={NODES} edges={EDGES} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Studio map" caption="The structure beside a project's details" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <Card title="Who leads what" subtitle="Tideline, October" style={{ flex: "2 1 360px" }}>
            <NodeLinkGraph layout="hierarchical" nodes={NODES} edges={EDGES} height={300} />
          </Card>
          <Card
            title={harbour.name}
            subtitle={harbour.kicker}
            labels={[{ label: harbour.status, tone: STATUS_TONE[harbour.status] }]}
            actions={[<Button key="open" variant="secondary">Open project</Button>]}
            style={{ flex: "1 1 220px" }}
          >
            <Stack direction="row" gap="sm" align="center">
              <Avatar {...avatarOf(harbour.owner)} size="sm" />
              <Text size="sm" color="secondary">Led by Maya Chen, due {harbour.due}</Text>
            </Stack>
            <Tag>{harbour.done}% done</Tag>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
