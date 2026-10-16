"use client";

import { useState } from "react";
import { Avatar, Button, Card, Heading, Mentions, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CHAT, PEOPLE, avatarOf, person } from "@/fixtures/tideline";

const CODE = `<Mentions
  value={value}
  onValueChange={setValue}
  options={[{ id: "maya", label: "Maya Chen" }, { id: "jonas", label: "Jonas Weber" } /* ... */]}
  placeholder="Type @ to mention someone"
/>`;

const OPTIONS = PEOPLE.map((p) => ({ id: p.id, label: p.name }));

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Mentions"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="mentions"`; parts: `input` (the real textarea), `list`, `option` (the highlighted one carries `data-rebar-active`).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Mentions` is a close direct equivalent — `value`/`onValueChange`/`options`/`placeholder` map to AntD's `value`/`onChange`/`options`/`placeholder`.",
      },
    ],
  },
];


export default function MentionsPage() {
  const [value, setValue] = useState("");
  const [reply, setReply] = useState("");
  const first = CHAT[0]!;

  return (
    <Stack gap="lg">
      <Heading level={1}>Mentions</Heading>
      <Text color="secondary">A textarea that suggests people as you type @.</Text>

      <DemoStage
        title="Comment box"
        caption="Type @ and pick a name"
        code={CODE}
        widths={false}
        states={[
          { label: "With a mention", node: <Mentions options={OPTIONS} defaultValue="Thanks @Maya Chen, the palette is perfect." /> },
          { label: "Two rows", node: <Mentions options={OPTIONS} placeholder="Add a note" rows={2} /> },
          { label: "No people", node: <Mentions options={[]} placeholder="Nobody to mention" rows={2} /> },
        ]}
      >
        <div style={{ maxWidth: 440 }}>
          <Mentions value={value} onValueChange={setValue} options={OPTIONS} placeholder="Type @ to mention someone" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Task comments" caption="Replying on Offline sync for tasks" widths={false}>
        <Card title="Offline sync for tasks" subtitle="Tideline mobile" style={{ maxWidth: 520, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" gap="sm" align="start">
              <Avatar {...avatarOf(first.from)} size="sm" />
              <Stack gap="xs">
                <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{person(first.from).name} <Text as="span" size="xs" color="secondary">{first.time}</Text></Text>
                <Text size="sm">{first.text}</Text>
              </Stack>
            </Stack>
            <Mentions value={reply} onValueChange={setReply} options={OPTIONS} placeholder="Reply, or @ someone in" rows={2} />
            <Stack direction="row" style={{ justifyContent: "flex-end" }}>
              <Button disabled={!reply.trim()}>Post reply</Button>
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
