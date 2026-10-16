"use client";

import { Avatar, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, TAGS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<Stack gap="md">
  <Stack direction="row" gap="md" justify="between" align="center">
    <Text>Harbour rebrand</Text>
    <Tag tone="success">On track</Tag>
  </Stack>
</Stack>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Stack"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="stack"`, `data-rebar-direction` set to the current direction.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's `Space`/`Flex` are the closest structural equivalents (`Flex` maps almost directly onto `direction`/`gap`/`align`/`justify`), a close, low-risk manual rename.",
      },
    ],
  },
];

export default function StackPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Stack</Heading>
      <Text color="secondary">A row or a column with a spacing-token gap.</Text>

      <DemoStage title="Project row" caption="A column of rows; each row pushes its ends apart" code={CODE} widths={false}
        states={[
          { label: "Row, gap sm", node: <Stack direction="row" gap="sm">{TAGS.map((t) => <Tag key={t}>{t}</Tag>)}</Stack> },
          { label: "Row, gap xl", node: <Stack direction="row" gap="xl">{TAGS.map((t) => <Tag key={t}>{t}</Tag>)}</Stack> },
          { label: "Column, gap xs", node: <Stack gap="xs">{TAGS.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}</Stack> },
          { label: "Wrapping", node: <Stack direction="row" gap="sm" style={{ flexWrap: "wrap", maxWidth: 140 }}>{TAGS.map((t) => <Tag key={t}>{t}</Tag>)}</Stack> },
        ]}
      >
        <Stack gap="md" style={{ maxWidth: 420 }}>
          {PROJECTS.slice(0, 3).map((p) => (
            <Stack key={p.id} direction="row" gap="md" justify="between" align="center">
              <Stack direction="row" gap="sm" align="center">
                <Avatar size="sm" {...avatarOf(p.owner)} />
                <Text>{p.name}</Text>
              </Stack>
              <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
            </Stack>
          ))}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project card" caption="Stacks inside a Card: title row, summary, footer row" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" justify="between" align="center">
              <Heading level={3}>{harbour.name}</Heading>
              <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
            </Stack>
            <Text size="sm" color="secondary">{harbour.summary}</Text>
            <Stack direction="row" justify="between" align="center">
              <Stack direction="row" gap="xs" align="center">
                <Avatar size="sm" {...avatarOf(harbour.owner)} />
                <Text size="sm">{person(harbour.owner).name}</Text>
              </Stack>
              <Text size="sm" color="secondary">Due {harbour.due}</Text>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
