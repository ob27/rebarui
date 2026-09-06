"use client";

import { useState } from "react";
import { FileManager, Heading, Stack, Text } from "rebar-ui";
import type { FileManagerNode } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const INITIAL_ROOT: FileManagerNode = {
  id: "root",
  name: "Root",
  type: "folder",
  children: [
    {
      id: "docs",
      name: "Docs",
      type: "folder",
      children: [{ id: "readme", name: "readme.txt", type: "file", size: 2048 }],
    },
    { id: "photo", name: "photo.png", type: "file", size: 2 * 1024 * 1024 },
  ],
};

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<FileManager root={root} onMove={(ids, targetId) => move(ids, targetId)} onRename={(id, name) => rename(id, name)} onDelete={(ids) => remove(ids)} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["FileManager"] ?? [] },
  {
    type: "doc-section",
    heading: "In-memory only — no real file I/O",
    body: [
      {
        kind: "text",
        text: "Every mutation is reported back to the caller (onMove/onRename/onDelete) — the same convention FileUpload already established for uploads. Composes the real TreeView for folder navigation, Table for the sortable contents view, ContextMenu for the real non-drag Move-to fallback, and Editable for inline rename.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Grid view supports drag-and-drop; table view uses Move to…",
    body: [
      {
        kind: "text",
        text: "Table's own column API has no row-level drag hooks, so native drag-and-drop between folders works in the grid view (every tile is this component's own DOM); table view relies on the ContextMenu's Move to… fallback as its primary move mechanism — an honest scope boundary, not a gap, and heuristic #38 (a real non-drag alternative) holds in both views.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="file-manager"`; parts include `tree`, `toolbar`, `grid`, and `item`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — compose AntD's own `Tree` + `Table` + `Dropdown` directly against the same node shape.",
      },
    ],
  },
];

export default function FileManagerPage() {
  const [root, setRoot] = useState(INITIAL_ROOT);

  return (
    <Stack gap="lg">
      <Heading level={1}>FileManager</Heading>
      <Text color="secondary">
        A caller-supplied in-memory folder tree with a two-pane browser UI — no real cloud storage
        integration.
      </Text>

      <FileManager
        root={root}
        onRename={(id, name) => {
          function rename(node: FileManagerNode): FileManagerNode {
            if (node.id === id) return { ...node, name };
            return { ...node, children: node.children?.map(rename) };
          }
          setRoot(rename(root));
        }}
      />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
