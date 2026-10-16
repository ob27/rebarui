"use client";

import { useRef, useState } from "react";
import { Button, Card, Heading, Stack, Text, Tour } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = "<Tour\n  open={open}\n  onOpenChange={setOpen}\n  steps={[\n    { target: () => newRef.current, title: \"Add work\", description: \"Start a task for any Tideline project.\" },\n    { target: () => filterRef.current, title: \"Narrow the board\", description: \"Filter by person, tag or project.\" },\n  ]}\n/>";


const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Tour"] ?? [] },
  {
    type: "doc-section",
    heading: "Targets and scroll",
    body: [{ kind: "text", text: "`target` is a function returning the real element (a deliberate exception to the no-function-props rule). If it returns `null`, the callout centres on screen. Page scroll is locked while a tour is open, and the highlighted element stays clickable." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"tour\"`; parts include the overlay, mask, highlight and callout." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Tour` is a close equivalent (`steps`, `open`, `onOpenChange`; `currentStep` is AntD's `current`). Step `target` has the same function shape." }],
  },
];

export default function TourPage() {
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState(false);
  const newRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);
  const welcomeRef = useRef<HTMLButtonElement>(null);
  return (
    <Stack gap="lg">
      <Heading level={1}>Tour</Heading>
      <Text color="secondary">A guided walkthrough: a dimmed page with one real element highlighted at a time.</Text>

      <DemoStage title="Toolbar tour" caption="Start the tour; it highlights each button in turn" code={CODE} widths={false}>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          <Button ref={newRef} onClick={() => setOpen(true)}>New task</Button>
          <Button ref={filterRef} variant="secondary">Filters</Button>
          <Button ref={shareRef} variant="secondary">Share</Button>
        </Stack>
        <Tour
          open={open}
          onOpenChange={setOpen}
          steps={[
            { target: () => newRef.current, title: "Add work", description: "Start a task for any Tideline project." },
            { target: () => filterRef.current, title: "Narrow the board", description: "Filter by person, tag or project." },
            { target: () => shareRef.current, title: "Bring in the crew", description: "Share the board with Jonas, Priya and Leo." },
          ]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="First run" caption="A welcome card offers the tour" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Welcome to Tideline, Maya" subtitle="Harbour rebrand is on track for 24 Oct" actions={[<Button key="skip" variant="tertiary">Skip</Button>, <Button key="go" ref={welcomeRef} onClick={() => setCtx(true)}>Take the tour</Button>]}>
          <p style={{ margin: 0, color: "var(--rebar-color-text-secondary)", fontSize: 14 }}>Two minutes to see the board, the inbox and the calendar.</p>
        </Card>
        <Tour open={ctx} onOpenChange={setCtx} steps={[{ target: () => welcomeRef.current, title: "You are here", description: "Every project opens to its own board." }]} />
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
