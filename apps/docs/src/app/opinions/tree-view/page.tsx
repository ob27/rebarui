"use client";

import { useState } from "react";
import { Card, Heading, Stack, Tag, Text, TreeView } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES } from "@/fixtures/tideline";

const CODE = "<TreeView\n  data={[{ value: \"brand\", label: \"Brand\", children: [{ value: \"mark-stacked.svg\", label: \"mark-stacked.svg\" }] }]}\n  onSelect={(v) => open(v)}\n  aria-label=\"Project files\"\n/>";

const DATA = [
  {
    value: "brand",
    label: "Brand",
    children: [
      { value: "logos", label: "Logos", children: [{ value: "mark-stacked.svg", label: "mark-stacked.svg" }] },
      { value: "van-livery-photos.zip", label: "van-livery-photos.zip" },
    ],
  },
  { value: "depot-fascia-final.pdf", label: "depot-fascia-final.pdf" },
  { value: "interview-03-walkthrough.mp4", label: "interview-03-walkthrough.mp4" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TreeView"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "`role=\"tree\"` and `role=\"treeitem\"` with `aria-expanded`, `aria-level` and `aria-selected`. Right expands (or enters the first child), Left collapses (or goes to the parent), Up and Down move through whatever is visible, with real focus moves." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"tree-view\"`; `data-rebar-part=\"item\"` per node." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "A close, low-risk rename: AntD's `Tree` takes a very similar `treeData` shape." }],
  },
];

export default function TreeViewPage() {
  const [sel, setSel] = useState("mark-stacked.svg");
  return (
    <Stack gap="lg">
      <Heading level={1}>TreeView</Heading>
      <Text color="secondary">An expandable list of nested items with selection, as a real ARIA tree.</Text>

      <DemoStage title="Project files" caption="Arrow keys move, Right expands, Left collapses" code={CODE} widths={false}
        states={[
          { label: "Collapsed", node: <TreeView data={DATA} aria-label="Collapsed files" /> },
          { label: "Selected", node: <TreeView data={DATA} defaultExpanded={["brand", "logos"]} defaultSelected="mark-stacked.svg" aria-label="Selected file" /> },
          { label: "Long names", node: <TreeView data={[{ value: "x", label: "interview-03-walkthrough-transcript-final-reviewed.docx" }]} aria-label="Long names" /> },
        ]}>
        <div style={{ maxWidth: 360 }}>
          <TreeView data={DATA} defaultExpanded={["brand"]} aria-label="Project files" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="File browser" caption="Pick a file, see its details" widths={false}>
        <Card style={{ maxWidth: 600, margin: "0 auto" }} title="Harbour rebrand files" subtitle="Brand, signage and research">
          <Stack direction="row" gap="lg" style={{ flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", minWidth: 200 }}>
              <TreeView data={DATA} defaultExpanded={["brand", "logos"]} selected={sel} onSelect={setSel} aria-label="Harbour rebrand files" />
            </div>
            <div style={{ flex: "1 1 200px", minWidth: 200, alignSelf: "flex-start", padding: "var(--rebar-space-md)", borderRadius: 10, background: "var(--rebar-color-tint-3)" }}>
              <Stack gap="xs">
                <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{sel}</Text>
                <Text size="xs" color="secondary">{FILES.find((f) => f.name === sel)?.size ?? "Folder"}</Text>
                <div><Tag tone="info">Harbour rebrand</Tag></div>
              </Stack>
            </div>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
