"use client";

import { useState } from "react";
import { Card, Heading, LayersPanel, Stack, Tag, Text } from "rebar-ui";
import type { LayerNode } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<LayersPanel
  layers={layers}
  onToggleLocked={(id, locked) => toggleLocked(id, locked)}
  onToggleHidden={(id, hidden) => toggleHidden(id, hidden)}
  onReorder={(draggedId, targetId, position) => reorder(draggedId, targetId, position)}
/>`;

const INITIAL: LayerNode[] = [
  {
    id: "hero",
    name: "Hero",
    children: [
      { id: "headline", name: "Headline" },
      { id: "photo", name: "Harbour photo" },
      { id: "cta", name: "Call to action" },
    ],
  },
  {
    id: "nav",
    name: "Navigation",
    children: [
      { id: "logo", name: "Logo mark" },
      { id: "links", name: "Links", locked: true },
    ],
  },
  { id: "bg", name: "Background wash", hidden: true },
];

function setFlag(nodes: LayerNode[], id: string, patch: Partial<LayerNode>): LayerNode[] {
  return nodes.map((n) => (n.id === id ? { ...n, ...patch } : { ...n, children: n.children ? setFlag(n.children, id, patch) : n.children }));
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["LayersPanel"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="layers-panel"`, `role="tree"`; rows carry `data-rebar-part="group" | "layer"` and `data-rebar-drop-position` while a drag is over them.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — compose AntD's own `Tree` (with `draggable`) + a custom row renderer for the lock/hide toggles.",
      },
    ],
  },
];


export default function LayersPanelPage() {
  const harbour = project("harbour");
  const [layers, setLayers] = useState(INITIAL);
  const handlers = {
    onToggleLocked: (id: string, locked: boolean) => setLayers((l) => setFlag(l, id, { locked })),
    onToggleHidden: (id: string, hidden: boolean) => setLayers((l) => setFlag(l, id, { hidden })),
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>LayersPanel</Heading>
      <Text color="secondary">A tree of layers and groups with drag-to-reorder, inline rename and lock and hide toggles.</Text>

      <DemoStage
        title="Harbour homepage layers"
        caption="Rename, lock, hide, drag to reorder"
        code={CODE}
        widths={false}
        states={[
          { label: "Empty", node: <LayersPanel layers={[]} aria-label="Empty layers" /> },
          { label: "Locked and hidden", node: <LayersPanel aria-label="Locked layers" layers={[{ id: "a", name: "Logo", locked: true }, { id: "b", name: "Wash", hidden: true }]} /> },
        ]}
      >
        <div style={{ maxWidth: 340 }}>
          <LayersPanel layers={layers} aria-label="Layers" {...handlers} />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Design editor" caption="The canvas on the left, its layers on the right" widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "stretch" }}>
          <div className="cs-grain" style={{ flex: "2 1 280px", minHeight: 280, display: "flex", alignItems: "flex-end", padding: 16 }}>
            <Tag tone="info">{project("harbour").name}: homepage</Tag>
          </div>
          <Card title="Layers" subtitle={`${harbour.name}`} style={{ flex: "1 1 240px" }}>
            <LayersPanel layers={layers} aria-label="Homepage layers" selectedId="headline" {...handlers} />
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
