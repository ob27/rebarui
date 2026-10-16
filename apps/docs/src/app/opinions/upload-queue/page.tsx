"use client";

import { useState } from "react";
import { Button, Card, Heading, Stack, Text, UploadQueue } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import type { UploadQueueItem } from "rebar-ui";
import { FILES } from "@/fixtures/tideline";

const CODE = "<UploadQueue\n  items={items}\n  onPause={(id) => pause(id)}\n  onResume={(id) => resume(id)}\n  onRetry={(id) => retry(id)}\n  onDismiss={(id) => dismiss(id)}\n/>";

const SCENARIOS: { label: string; items: UploadQueueItem[] }[] = [
  { label: "Uploading", items: [{ id: "1", name: FILES[1].name, progress: 62, status: "uploading" }, { id: "2", name: FILES[4].name, progress: 100, status: "done" }] },
  { label: "Paused", items: [{ id: "1", name: FILES[2].name, progress: 41, status: "paused" }] },
  { label: "Error", items: [{ id: "1", name: FILES[3].name, progress: 30, status: "error", errorMessage: "Connection lost" }] },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["UploadQueue"] ?? [] },
  {
    type: "doc-section",
    heading: "Floating panel",
    body: [{ kind: "text", text: "Rendered through a portal to a fixed corner, so it outlives page changes underneath it. It renders nothing when `items` is empty." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"upload-queue\"`, `data-rebar-state=\"minimized\" | \"expanded\"`; each row carries `data-rebar-status`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's `Progress` and `List` inside a fixed-position `Affix`." }],
  },
];

export default function UploadQueuePage() {
  const [items, setItems] = useState<UploadQueueItem[]>(SCENARIOS[0].items);
  const [min, setMin] = useState(false);
  return (
    <Stack gap="lg">
      <Heading level={1}>UploadQueue</Heading>
      <Text color="secondary">A floating panel in the corner of the screen listing every upload, with pause, resume and retry.</Text>

      <DemoStage title="Upload panel" caption="The panel floats at the bottom right of the window; pick a scenario" code={CODE} widths={false}
        states={SCENARIOS.map((s) => ({ label: s.label, node: <Button size="sm" variant="secondary" onClick={() => { setItems(s.items); setMin(false); }}>{`Show ${s.label.toLowerCase()}`}</Button> }))}>
        <Stack direction="row" gap="md" align="center" style={{ flexWrap: "wrap" }}>
          <Button onClick={() => { setItems(SCENARIOS[0].items); setMin(false); }}>Start uploading</Button>
          <Button variant="secondary" onClick={() => setItems([])}>Clear all</Button>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project files" caption="Add a file and watch the corner" widths={false}>
        <Card style={{ maxWidth: 460, margin: "0 auto" }} title="Harbour rebrand files" subtitle="5 files" actions={[<Button key="u" onClick={() => setItems([{ id: "q1", name: FILES[1].name, progress: 35, status: "uploading" }, { id: "q2", name: FILES[0].name, progress: 100, status: "done" }])}>Upload van photos</Button>]}>
          <Stack gap="xs">
            {FILES.map((f) => (
              <Stack key={f.id} direction="row" justify="between">
                <Text size="sm">{f.name}</Text>
                <Text size="sm" color="secondary">{f.size}</Text>
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <UploadQueue
        items={items}
        minimized={min}
        onMinimizedChange={setMin}
        onPause={(id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "paused" } : i)))}
        onResume={(id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "uploading" } : i)))}
        onRetry={(id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "uploading", progress: 0 } : i)))}
        onDismiss={(id) => setItems((p) => p.filter((i) => i.id !== id))}
      />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
