"use client";

import { useState } from "react";
import type { UploadFileState } from "rebar-ui";
import { Button, Card, FileUpload, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `const [files, setFiles] = useState<UploadFileState[]>([]);

<FileUpload
  multiple
  maxSizeBytes={5 * 1024 * 1024}
  files={files}
  onFilesSelected={(picked) => startUpload(picked)}
  onRemove={(file) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
/>`;

const SEED: UploadFileState[] = [
  { id: "1", name: "depot-fascia-final.pdf", size: 1_468_000, status: "done" },
  { id: "2", name: "van-livery-photos.zip", size: 50_331_648, status: "uploading", progress: 45 },
];
const QUEUED: UploadFileState[] = [{ id: "q", name: "rota-export-march.csv", size: 90_000, status: "pending" }];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FileUpload"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="file-upload"`; parts: `dropzone`, `picker`, `input`, `list`, `file-row` (each row also carrying `file-name`/`file-size`/`file-status`/`remove`).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Upload` component is a close structural match, but it owns real upload-request logic internally (an `action` URL, `customRequest`) — this component deliberately doesn't, so a migration is an opportunity to either adopt AntD's built-in request handling or keep your own upload logic and just swap the rendering shell.",
      },
    ],
  },
];

export default function FileUploadPage() {
  const [files, setFiles] = useState<UploadFileState[]>(SEED);
  const [attach, setAttach] = useState<UploadFileState[]>([]);

  const add = (set: typeof setFiles) => (picked: File[]) =>
    set((prev) => [...prev, ...picked.map((file, i) => ({ id: `${file.name}-${prev.length + i}`, name: file.name, size: file.size, status: "pending" as const }))]);
  const remove = (set: typeof setFiles) => (file: UploadFileState) => set((prev) => prev.filter((f) => f.id !== file.id));

  return (
    <Stack gap="lg">
      <Heading level={1}>FileUpload</Heading>
      <Text color="secondary">A drop zone with a file picker, size checks and progress. It does not upload; you do.</Text>

      <DemoStage
        title="Project files"
        caption="Drop files or press the picker; progress comes from your own upload"
        code={CODE}
        widths={false}
        states={[
          {
            label: "Empty, images only and waiting",
            node: (
              <Stack gap="md">
                <FileUpload multiple />
                <FileUpload accept="image/*" multiple maxSizeBytes={2 * 1024 * 1024} />
                <FileUpload files={QUEUED} />
              </Stack>
            ),
          },
        ]}
      >
        <FileUpload multiple maxSizeBytes={5 * 1024 * 1024} files={files} onFilesSelected={add(setFiles)} onRemove={remove(setFiles)} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Add to a project" caption="Inside a dialog-style card" widths={false}>
        <Card
          style={{ maxWidth: 520, margin: "0 auto" }}
          title="Add files to Depot signage"
          actions={[<Button key="c" variant="secondary">Cancel</Button>, <Button key="a" disabled={attach.length === 0}>Add {attach.length || ""} files</Button>]}
        >
          <FileUpload multiple accept=".pdf,.png,.svg" files={attach} onFilesSelected={add(setAttach)} onRemove={remove(setAttach)} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
