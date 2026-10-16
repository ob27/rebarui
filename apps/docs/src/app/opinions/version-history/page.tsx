"use client";

import { Avatar, Button, Card, Heading, Stack, Text, VersionHistory } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";

const CODE = "<VersionHistory\n  trigger={<Button>Version history</Button>}\n  versions={versions}\n  currentVersionId=\"v3\"\n  onRestore={(v) => restore(v.id)}\n/>";

const noop = () => {};
const LONG = "Rewrote the opening paragraph, moved the launch date to 24 Oct, added the crew briefing and the livery photo list, then cut the budget table back to the three lines the harbour trust asked for.";
const VERSIONS = [
  { id: "v3", label: "Auto-saved", timestamp: new Date("2026-10-24T09:12:00"), preview: "Final edits before the launch brief goes to the harbour trust." },
  { id: "v2", label: "Before AI edit", timestamp: new Date("2026-10-23T14:40:00"), preview: "Original summary paragraph before the assistant rewrote it." },
  { id: "v1", label: "First draft", timestamp: new Date("2026-10-21T10:05:00"), preview: "Outline, launch date and the list of deliverables." },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["VersionHistory"] ?? [] },
  {
    type: "doc-section",
    heading: "Restore",
    body: [{ kind: "text", text: "Built from the drawer chrome, a `Popconfirm` (it never restores on the first click) and a `Tag` for the current version." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"version-history\"`; rows carry `data-rebar-part=\"row\" | \"label\" | \"timestamp\" | \"preview\" | \"restore-button\"`." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Compose AntD's `Drawer`, `List` and `Popconfirm`; the shape maps across almost verbatim." }],
  },
];

export default function VersionHistoryPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>VersionHistory</Heading>
      <Text color="secondary">A drawer of saved snapshots with a confirm-before-restore button on each row.</Text>

      <DemoStage title="Brief history" caption="Open the drawer, restore asks first" code={CODE} widths={false}
        states={[
          { label: "One version", node: <VersionHistory trigger={<Button size="sm" variant="secondary">Version history</Button>} versions={VERSIONS.slice(0, 1)} currentVersionId="v3" onRestore={noop} /> },
          { label: "Long preview", node: <VersionHistory trigger={<Button size="sm" variant="secondary">Long preview</Button>} versions={[{ ...VERSIONS[1], preview: LONG }, VERSIONS[0]]} currentVersionId="v3" onRestore={noop} /> },
          { label: "Right side", node: <VersionHistory side="right" trigger={<Button size="sm" variant="secondary">Open on the right</Button>} versions={VERSIONS} currentVersionId="v3" onRestore={noop} /> },
        ]}>
        <VersionHistory trigger={<Button>Version history</Button>} versions={VERSIONS} currentVersionId="v3" onRestore={noop} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Document header" caption="History sits next to the doc it belongs to" widths={false}>
        <Card style={{ maxWidth: 520, margin: "0 auto" }} title="Harbour launch brief" subtitle="Edited by Maya, 24 Oct 09:12" avatar={<Avatar {...avatarOf("maya")} />} labels={[{ label: "On track", tone: "success" }]} actions={[<VersionHistory key="h" trigger={<Button variant="secondary">Version history</Button>} versions={VERSIONS} currentVersionId="v3" onRestore={noop} />]}>
          <Text size="sm" color="secondary">Launch is 24 Oct at 09:00. The crew briefing goes out two days before, and the livery photos are filed under Brand.</Text>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
