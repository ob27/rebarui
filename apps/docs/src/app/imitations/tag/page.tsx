"use client";

import { useState } from "react";
import { Avatar, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { TagTone } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, TAGS, TASKS, avatarOf, project } from "@/fixtures/tideline";

const CODE = `<Tag>Design</Tag>
<Tag tone="error">Eng</Tag>
<Tag tone="info">Research</Tag>
<Tag tone="success">Ops</Tag>
<Tag closable onClose={() => remove("harbour")}>Harbour rebrand</Tag>`;

const TAG_TONE: Record<(typeof TAGS)[number], TagTone> = { Design: "default", Eng: "error", Research: "info", Ops: "success" };
const sync = TASKS.find((t) => t.id === "sync")!;

function Removable() {
  const [ids, setIds] = useState(PROJECTS.slice(0, 2).map((p) => p.id));
  return (
    <>
      {ids.map((id) => (
        <Tag key={id} closable onClose={() => setIds((prev) => prev.filter((x) => x !== id))}>
          {project(id).name}
        </Tag>
      ))}
    </>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Tag"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'The close affordance is a real `<button aria-label="Remove">`: Tab to focus, Enter or Space to activate. The tone is colour only, so the label must carry the meaning.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="tag"`, `data-rebar-tone`, `data-rebar-part="label" | "close"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered: AntD's `Tag` uses `color` (a preset name or hex) rather than a fixed `tone` union, so it is a semantic remap. `closable`/`onClose` map directly." }],
  },
];

export default function TagPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Tag</Heading>
      <Text color="secondary">A short label or removable chip.</Text>

      <DemoStage
        title="Tag"
        caption="Label and removable chip"
        code={CODE}
        states={[
          { label: "Long", node: <Tag style={{ whiteSpace: "normal", textAlign: "left" }}>Crew interviews synthesis notes</Tag> },
          {
            label: "Removable",
            node: (
              <Tag tone="error" closable>
                Late
              </Tag>
            ),
          },
          { label: "Count", node: <Tag tone="info">Review · 3</Tag> },
          {
            label: "Tones",
            node: (
              <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
                <Tag>Default</Tag>
                <Tag tone="info">Info</Tag>
                <Tag tone="success">Success</Tag>
                <Tag tone="warning">Warning</Tag>
                <Tag tone="error">Error</Tag>
              </Stack>
            ),
          },
        ]}
      >
        <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
          {TAGS.map((t) => (
            <Tag key={t} tone={TAG_TONE[t]}>
              {t}
            </Tag>
          ))}
          <Removable />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Task card" caption="Area, project and due date as tags">
        <Card style={{ maxWidth: 400, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              {sync.title}
            </Text>
            <Stack direction="row" gap="xs" align="center" style={{ flexWrap: "wrap" }}>
              <Tag tone={TAG_TONE[sync.tag]}>{sync.tag}</Tag>
              <Tag tone="info">{project(sync.project).name}</Tag>
              <Tag tone="success">Due {project(sync.project).due}</Tag>
              <span style={{ marginLeft: "auto" }}>
                <Avatar size="sm" {...avatarOf(sync.assignee)} style={{ background: "var(--rebar-color-tint-1)" }} />
              </span>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
