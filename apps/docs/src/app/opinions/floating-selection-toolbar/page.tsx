"use client";

import { useRef } from "react";
import { Avatar, Card, FloatingSelectionToolbar, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf, person } from "@/fixtures/tideline";

const CODE = `<FloatingSelectionToolbar
  containerRef={noteRef}
  actions={[
    { key: "ask-ai", label: "Ask AI", onSelect: (text) => askAi(text) },
    { key: "comment", label: "Comment", onSelect: (text) => addComment(text) },
  ]}
/>`;

const NOTE = "Most of the crew keep a paper copy of the rota in the cab because the app is slow to open on the quay. They want shifts they can read at a glance, offline, with the next handover time shown first.";
const ACTIONS = [
  { key: "ask-ai", label: "Ask AI", onSelect: () => {} },
  { key: "comment", label: "Comment", onSelect: () => {} },
  { key: "copy", label: "Copy", onSelect: () => {} },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FloatingSelectionToolbar"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="floating-selection-toolbar"`; each action carries `data-rebar-part="action"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no selection-anchored toolbar of its own; the Medium/Notion-style pattern typically needs a hand-rolled `selectionchange` listener regardless of design system.",
      },
    ],
  },
];

export default function FloatingSelectionToolbarPage() {
  const demoRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const priya = person("priya");

  return (
    <Stack gap="lg">
      <Heading level={1}>FloatingSelectionToolbar</Heading>
      <Text color="secondary">A small toolbar that appears over selected text. Select a few words to see it.</Text>

      <DemoStage title="Interview note" caption="Select any words" code={CODE} widths={false}>
        <div ref={demoRef} style={{ border: "1px solid var(--rebar-color-border)", borderRadius: 12, padding: 20, maxWidth: 560, margin: "0 auto" }}>
          <Text>{NOTE}</Text>
        </div>
        <FloatingSelectionToolbar containerRef={demoRef} actions={ACTIONS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Research note" caption="Quote a line from a crew interview" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Interview 11, notes">
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center">
              <Avatar {...avatarOf("priya")} size="sm" />
              <Text size="sm" color="secondary">{priya.name} · 21 Oct</Text>
              <Tag tone="info">Research</Tag>
            </Stack>
            <div ref={noteRef}>
              <Text>{NOTE}</Text>
            </div>
          </Stack>
        </Card>
        <FloatingSelectionToolbar containerRef={noteRef} actions={ACTIONS.slice(0, 2)} />
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
