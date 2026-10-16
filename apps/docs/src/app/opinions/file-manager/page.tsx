"use client";

import { useState } from "react";
import { Button, Card, FileManager, Heading, Stack, Text } from "rebar-ui";
import type { FileManagerNode } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, PROJECTS } from "@/fixtures/tideline";

const CODE = `<FileManager
  root={root}
  onMove={(ids, targetId) => move(ids, targetId)}
  onRename={(id, name) => rename(id, name)}
  onDelete={(ids) => remove(ids)}
  actions={[{ key: "zip", label: "Zip & download", onSelect: (ids) => zip(ids) }]}
/>`;

const BYTES: Record<string, number> = { "1.4 MB": 1.4 * 1024 * 1024, "48 MB": 48 * 1024 * 1024, "212 MB": 212 * 1024 * 1024, "90 KB": 90 * 1024, "8 KB": 8 * 1024 };

/** One folder per project, holding that project's files. */
const INITIAL_ROOT: FileManagerNode = {
  id: "root",
  name: "Tideline",
  type: "folder",
  children: PROJECTS.filter((p) => FILES.some((f) => f.project === p.id)).map((p) => ({
    id: p.id,
    name: p.name,
    type: "folder" as const,
    children: FILES.filter((f) => f.project === p.id).map((f) => ({ id: f.id, name: f.name, type: "file" as const, size: BYTES[f.size] })),
  })),
};

const FLAT: FileManagerNode = { id: "flat", name: "Attachments", type: "folder", children: FILES.slice(0, 3).map((f) => ({ id: f.id, name: f.name, type: "file" as const, size: BYTES[f.size] })) };
const EMPTY: FileManagerNode = { id: "empty", name: "Depot signage", type: "folder", children: [] };

function removeIds(node: FileManagerNode, ids: string[]): FileManagerNode {
  return { ...node, children: node.children?.filter((c) => !ids.includes(c.id)).map((c) => removeIds(c, ids)) };
}
function renameId(node: FileManagerNode, id: string, name: string): FileManagerNode {
  if (node.id === id) return { ...node, name };
  return { ...node, children: node.children?.map((c) => renameId(c, id, name)) };
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FileManager"] ?? [] },
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
  const [last, setLast] = useState("nothing yet");
  const [picked, setPicked] = useState<string[]>([]);

  return (
    <Stack gap="lg">
      <Heading level={1}>FileManager</Heading>
      <Text color="secondary">A folder tree and a file list in one browser. You keep the data and apply every change.</Text>

      <DemoStage
        title="Project files"
        caption="Select a file to reveal Delete and your own actions"
        code={CODE}
        states={[
          { label: "Empty folder", node: <FileManager root={EMPTY} aria-label="Empty folder" /> },
        ]}
      >
        <Stack gap="sm">
          <FileManager
            root={root}
            aria-label="Project files"
            onRename={(id, name) => setRoot(renameId(root, id, name))}
            onDelete={(ids) => setRoot(removeIds(root, ids))}
            onMove={(ids, target) => setLast(`move ${ids.join(", ")} to ${target}`)}
            actions={[
              { key: "zip", label: "Zip & download", onSelect: (ids) => setLast(`zip ${ids.join(", ")}`) },
              { key: "share", label: "Share", disabled: (ids) => ids.length !== 1, onSelect: (ids) => setLast(`share ${ids[0]}`) },
            ]}
          />
          <Text size="sm" color="secondary">Last action: {last}</Text>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Attach a file" caption="The single-file picker inside a form" widths={false}>
        <Card
          style={{ maxWidth: 560, margin: "0 auto" }}
          title="Attach to “Harbour homepage”"
          actions={[<Button key="c" variant="secondary">Cancel</Button>, <Button key="a" disabled={!picked[0]}>Attach</Button>]}
        >
          <Stack gap="sm">
            <FileManager root={FLAT} singleFileMode onSelectedIdsChange={setPicked} aria-label="Pick a file" />
            <Text size="sm" color="secondary">Picked: {picked[0] ? FILES.find((f) => f.id === picked[0])?.name : "none"}</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
