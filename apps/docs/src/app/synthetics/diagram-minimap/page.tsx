"use client";

import { useState } from "react";
import { Card, DiagramMinimap, Heading, NodeLinkGraph, Stack, Text } from "rebar-ui";
import type { NodeLinkGraphEdge, NodeLinkGraphNode } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, PROJECTS, TASKS } from "@/fixtures/tideline";

// A small manual layout: the launch flow of the Harbour rebrand.
const FLOW_NODES: NodeLinkGraphNode[] = [
  { id: "brief", label: "Brief", x: 280, y: 30 },
  { id: "palette", label: "Brand palette", x: 140, y: 140 },
  { id: "home", label: "Homepage", x: 420, y: 140 },
  { id: "icons", label: "Icon audit", x: 70, y: 250 },
  { id: "livery", label: "Van livery", x: 210, y: 250 },
  { id: "copy", label: "Copy", x: 350, y: 250 },
  { id: "build", label: "Build", x: 490, y: 250 },
  { id: "launch", label: "Launch, 24 Oct", x: 280, y: 350 },
];
const FLOW_EDGES: NodeLinkGraphEdge[] = [
  { source: "brief", target: "palette" },
  { source: "brief", target: "home" },
  { source: "palette", target: "icons" },
  { source: "palette", target: "livery" },
  { source: "home", target: "copy" },
  { source: "home", target: "build" },
  { source: "icons", target: "launch" },
  { source: "livery", target: "launch", label: "approved" },
  { source: "copy", target: "launch" },
  { source: "build", target: "launch", label: "shipped" },
];
const FLOW_VIEWPORT = { x: 20, y: 0, width: 520, height: 210 };

// The whole studio: Tideline, its four people, their projects and tasks. Too big to see at once in a small viewport.
function studio(): { nodes: NodeLinkGraphNode[]; edges: NodeLinkGraphEdge[] } {
  const nodes: NodeLinkGraphNode[] = [{ id: "studio", label: "Tideline" }];
  const edges: NodeLinkGraphEdge[] = [];
  for (const p of PEOPLE) {
    nodes.push({ id: p.id, label: p.name, parentId: "studio" });
    edges.push({ source: "studio", target: p.id });
    for (const pr of PROJECTS.filter((x) => x.owner === p.id)) {
      nodes.push({ id: pr.id, label: pr.name, parentId: p.id });
      edges.push({ source: p.id, target: pr.id });
      for (const t of TASKS.filter((x) => x.project === pr.id)) {
        nodes.push({ id: `${pr.id}-${t.id}`, label: t.title, parentId: pr.id });
        edges.push({ source: pr.id, target: `${pr.id}-${t.id}` });
      }
    }
  }
  return { nodes, edges };
}
const { nodes: STUDIO_NODES, edges: STUDIO_EDGES } = studio();

const CODE = `const [view, setView] = useState<{ nodes: { id: string; x: number; y: number }[]; viewportBounds: Rect }>();

<NodeLinkGraph nodes={nodes} edges={edges} onViewportChange={setView} />
<DiagramMinimap nodes={view?.nodes ?? []} viewportBounds={view?.viewportBounds} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DiagramMinimap"] ?? [] },
  {
    type: "doc-section",
    heading: "Pairing with NodeLinkGraph",
    body: [
      {
        kind: "text",
        text: "`DiagramMinimap` is static: it draws a dot per resolved node position, scaled into a small frame, and runs no layout of its own. Feed it the same coordinates as the canvas. `NodeLinkGraph`'s `onViewportChange` fires with every node's position plus the currently visible region, both in the coordinate space the minimap expects.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="diagram-minimap"` on the root `<figure>`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. AntD ships no diagramming components; a minimap typically migrates with whichever canvas library (React Flow, AntV X6) the main diagram uses.",
      },
    ],
  },
];

interface LiveView {
  nodes: { id: string; x: number; y: number }[];
  viewportBounds: { x: number; y: number; width: number; height: number };
}

export default function DiagramMinimapPage() {
  const [view, setView] = useState<LiveView | null>(null);
  const flowDots = FLOW_NODES.map(({ id, x, y }) => ({ id, x: x ?? 0, y: y ?? 0 }));

  return (
    <Stack gap="lg">
      <Heading level={1}>DiagramMinimap</Heading>
      <Text color="secondary">A small thumbnail map of a large canvas: a dot per node and a viewport box.</Text>

      <DemoStage
        title="Launch flow"
        caption="The Harbour rebrand flow and its minimap"
        code={CODE}
        widths={false}
        states={[
          { label: "Whole diagram in view", node: <DiagramMinimap title="Whole diagram" width={200} height={140} nodes={flowDots} viewportBounds={{ x: 0, y: 0, width: 560, height: 380 }} /> },
          { label: "Zoomed in", node: <DiagramMinimap title="Zoomed in" width={200} height={140} nodes={flowDots} viewportBounds={{ x: 200, y: 100, width: 200, height: 140 }} /> },
          { label: "Empty", node: <DiagramMinimap title="Empty" width={200} height={140} nodes={[]} /> },
        ]}
      >
        <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
          <NodeLinkGraph layout="manual" title="Harbour launch flow" width={560} height={380} nodes={FLOW_NODES} edges={FLOW_EDGES} />
          <DiagramMinimap title="Minimap of the launch flow" width={200} height={140} nodes={flowDots} viewportBounds={FLOW_VIEWPORT} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Studio map" caption="Pan or zoom the graph; the minimap box follows what is visible" widths={false}>
        <Stack direction="row" gap="md" align="start" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <NodeLinkGraph title="Tideline: people, projects and tasks" layout="hierarchical" width={1000} height={420} nodes={STUDIO_NODES} edges={STUDIO_EDGES} onViewportChange={setView} />
          </div>
          <Card title="Minimap" style={{ width: 232 }}>
            <Stack gap="xs">
              <DiagramMinimap title="Studio minimap" width={200} height={150} nodes={view?.nodes ?? []} viewportBounds={view?.viewportBounds} />
              <Text size="xs" color="secondary">Drag or zoom the graph; the highlighted box tracks what is visible.</Text>
            </Stack>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
