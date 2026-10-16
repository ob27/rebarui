"use client";

import { Card, Heading, ScrollArea, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, PROJECTS, TASKS, project } from "@/fixtures/tideline";

const CODE = `<ScrollArea maxHeight={180}>
  {tasks.map((t) => (
    <Text key={t.id} size="sm">{t.title}</Text>
  ))}
</ScrollArea>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ScrollArea"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="scroll-area"`; `data-rebar-orientation` mirrors the `orientation` prop (`"vertical"|"horizontal"|"both"`).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD has no dedicated scroll-area primitive of its own — a custom scrollbar is normally done with plain CSS in an antd app too, the same approach this component takes, so there's nothing to remap beyond dropping the `rebar-ui` import.",
      },
    ],
  },
];

export default function ScrollAreaPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ScrollArea</Heading>
      <Text color="secondary">A scrollable container with a thin, theme-aware scrollbar.</Text>

      <DemoStage title="Task list" caption="Fixed height, the rest scrolls" code={CODE} widths={false}
        states={[
          { label: "Short content", node: <ScrollArea maxHeight={120}><Text size="sm">Nothing else to do today.</Text></ScrollArea> },
          {
            label: "Horizontal",
            node: (
              <ScrollArea orientation="horizontal" style={{ maxWidth: 260 }}>
                <Stack direction="row" gap="sm" style={{ width: "max-content" }}>
                  {PROJECTS.map((p) => <Tag key={p.id}>{p.name}</Tag>)}
                </Stack>
              </ScrollArea>
            ),
          },
        ]}
      >
        <ScrollArea maxHeight={180} style={{ maxWidth: 360 }}>
          <Stack gap="sm">
            {TASKS.concat(TASKS).map((t, i) => (
              <Text key={i} size="sm">{t.title}</Text>
            ))}
          </Stack>
        </ScrollArea>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Files" caption="A card with a fixed-height file list" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }} title="Project files" subtitle={`${FILES.length} files`}>
          <ScrollArea maxHeight={160}>
            <Stack gap="sm">
              {FILES.map((f) => (
                <Stack key={f.id} direction="row" justify="between" align="center">
                  <Stack gap="xs">
                    <Text size="sm">{f.name}</Text>
                    <Text size="xs" color="secondary">{project(f.project).name}</Text>
                  </Stack>
                  <Text size="xs" color="secondary">{f.size}</Text>
                </Stack>
              ))}
            </Stack>
          </ScrollArea>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
