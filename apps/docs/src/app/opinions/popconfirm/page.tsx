"use client";

import { Button, Card, Heading, Popconfirm, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, project } from "@/fixtures/tideline";

const CODE = `<Popconfirm
  trigger={<Button variant="destructive">Delete project</Button>}
  title="Delete Depot signage?"
  description="8 tasks and 2 files go with it."
  destructive
  onConfirm={handleDelete}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Popconfirm"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="popconfirm"`; parts: `title`, `description`, `actions`, `cancel`, `confirm`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Popconfirm` is a close direct equivalent — `title`/`description`/`onConfirm`/`onCancel` map directly; `confirmLabel`/`cancelLabel` map to AntD's `okText`/`cancelText`.",
      },
    ],
  },
];

export default function PopconfirmPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Popconfirm</Heading>
      <Text color="secondary">A small yes/no confirmation that opens right at its trigger.</Text>

      <DemoStage
        title="Delete project"
        caption="Click the button to open the confirmation"
        code={CODE}
        widths={false}
        states={[
          { label: "Neutral", node: <Popconfirm trigger={<Button variant="secondary">Archive</Button>} title="Archive Rota export?" description="It moves to Done and stays searchable." onConfirm={() => {}} /> },
          { label: "Custom labels", node: <Popconfirm trigger={<Button variant="secondary">Send</Button>} title="Send the rota to payroll?" confirmLabel="Send now" cancelLabel="Not yet" onConfirm={() => {}} /> },
          { label: "Title only", node: <Popconfirm trigger={<Button variant="tertiary">Remove</Button>} title="Remove Leo from this project?" destructive onConfirm={() => {}} /> },
        ]}
      >
        <Popconfirm
          trigger={<Button variant="destructive">Delete project</Button>}
          title={`Delete ${project("signage").name}?`}
          description="8 tasks and 2 files go with it."
          destructive
          onConfirm={() => {}}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project files" caption="Each delete asks first" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Files" subtitle={project("harbour").name}>
          <Stack gap="sm">
            {FILES.filter((f) => f.project === "harbour").map((f) => (
              <Stack key={f.id} direction="row" gap="md" align="center" justify="between">
                <Stack gap="xs">
                  <Text size="sm">{f.name}</Text>
                  <Text size="xs" color="secondary">{f.size}</Text>
                </Stack>
                <Popconfirm trigger={<Button size="sm" variant="tertiary">Delete</Button>} title={`Delete ${f.name}?`} description="Everyone on the project loses access." destructive onConfirm={() => {}} />
              </Stack>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
