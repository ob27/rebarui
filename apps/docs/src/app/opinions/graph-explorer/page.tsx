"use client";

import { useState } from "react";
import { Button, Card, GraphExplorer, Heading, Stack, Tag, Text } from "rebar-ui";
import type { GraphExplorerEdge, GraphExplorerNode } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW, FILES, PEOPLE, PROJECTS, STATUS_TONE, TASKS, project } from "@/fixtures/tideline";

const CODE = `<GraphExplorer
  title="Who is on what"
  nodes={nodes}
  edges={edges}
  nodeActions={() => [{ label: "Expand", onClick: loadCrew }]}
/>`;

function buildGraph(): { nodes: GraphExplorerNode[]; edges: GraphExplorerEdge[] } {
  const nodes: GraphExplorerNode[] = [
    ...PEOPLE.map((p) => ({ id: `person-${p.id}`, label: p.name, category: "Person" })),
    ...PROJECTS.map((p) => ({ id: `project-${p.id}`, label: p.name, category: "Project" })),
    ...FILES.map((f) => ({ id: `file-${f.id}`, label: f.name, category: "File" })),
  ];
  const seen = new Set<string>();
  const edges: GraphExplorerEdge[] = [];
  const link = (source: string, target: string) => {
    const key = `${source}>${target}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ source, target });
  };
  for (const p of PROJECTS) link(`person-${p.owner}`, `project-${p.id}`);
  for (const t of TASKS) link(`person-${t.assignee}`, `project-${t.project}`);
  for (const f of FILES) link(`project-${f.project}`, `file-${f.id}`);
  return { nodes, edges };
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["GraphExplorer"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="graph-explorer"` on the root; parts: `toolbar`, `search`, `search-results`, `zoom-controls`, `legend`, `legend-chip`, `canvas-wrap`, `canvas`, `radial-menu`, `radial-menu-button`, `status` (the visually-hidden `aria-live` selection announcer).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no force-directed network graph component at all; migrating means reaching for a dedicated graph-visualization library (e.g. AntV G6, from the same Ant ecosystem) directly.",
      },
    ],
  },
];


export default function GraphExplorerPage() {
  const [graph, setGraph] = useState(buildGraph);
  const [expanded, setExpanded] = useState<string | null>(null);
  const harbour = project("harbour");

  const expandCrew = (node: GraphExplorerNode) => {
    if (expanded) return;
    setExpanded(node.label);
    setGraph((prev) => ({
      nodes: [...prev.nodes, ...CREW.slice(0, 4).map((c) => ({ id: `crew-${c.id}`, label: c.name, category: "Person" }))],
      edges: [...prev.edges, ...CREW.slice(0, 4).map((c) => ({ source: node.id, target: `crew-${c.id}` }))],
    }));
  };

  const small = buildGraph();
  const quiet = { nodes: small.nodes.filter((n) => n.id.startsWith("person-") || n.id.startsWith("project-")), edges: small.edges.filter((e) => e.target.startsWith("project-")) };

  return (
    <Stack gap="lg">
      <Heading level={1}>GraphExplorer</Heading>
      <Text color="secondary">A force-directed network of people, projects and files, with search and a category legend.</Text>

      <DemoStage
        title="Who is on what"
        caption={expanded ? `Expanded crew around ${expanded}` : "Select a node, then Expand to reveal the crew"}
        code={CODE}
        widths={false}
        states={[
          { label: "Empty", node: <GraphExplorer nodes={[]} edges={[]} width={260} height={170} title="Nothing yet" /> },
          { label: "Quiet", node: <GraphExplorer nodes={quiet.nodes} edges={quiet.edges} width={260} height={170} legend={false} searchable={false} /> },
          { label: "Two nodes", node: <GraphExplorer nodes={[{ id: "a", label: "Maya Chen", category: "Person" }, { id: "b", label: "Harbour rebrand", category: "Project" }]} edges={[{ source: "a", target: "b" }]} width={260} height={170} /> },
        ]}
      >
        <GraphExplorer
          nodes={graph.nodes}
          edges={graph.edges}
          title="Who is on what"
          width={640}
          height={440}
          nodeActions={() => [{ label: "Expand", onClick: expandCrew }]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project network" caption="The graph beside the project it is showing" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <Card title="Who is on what" subtitle="People, projects and files">
            <GraphExplorer nodes={graph.nodes} edges={graph.edges} width={480} height={300} />
          </Card>
          <Card
            title={harbour.name}
            subtitle={harbour.kicker}
            labels={[{ label: harbour.status, tone: STATUS_TONE[harbour.status] }]}
            actions={[<Button key="open" variant="secondary">Open project</Button>]}
            style={{ minWidth: 240, flex: 1 }}
          >
            <Stack gap="xs">
              <Text size="sm" color="secondary">{harbour.summary}</Text>
              <Tag>{harbour.done}% done</Tag>
            </Stack>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
