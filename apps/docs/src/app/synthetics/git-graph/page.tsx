import { Card, GitGraph, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<GitGraph
  title="Tideline mobile"
  commits={[
    { id: "a1", parentIds: [], branch: "main", message: "Start offline sync", author: "Jonas" },
    { id: "b2", parentIds: ["a1"], branch: "main", message: "Quiet inbox layout", author: "Maya" },
    { id: "c3", parentIds: ["a1"], branch: "feature/sync", message: "Queue writes offline", author: "Jonas" },
  ]}
/>`;

const COMMITS = [
  { id: "a1c4e90", parentIds: [], branch: "main", message: "Start offline sync", author: "Jonas" },
  { id: "b27d3f1", parentIds: ["a1c4e90"], branch: "main", message: "Quiet inbox layout", author: "Maya" },
  { id: "c3e8a52", parentIds: ["b27d3f1"], branch: "feature/sync", message: "Queue writes while offline", author: "Jonas" },
  { id: "d4f1b07", parentIds: ["b27d3f1"], branch: "main", message: "Crew avatar sizes", author: "Maya" },
  { id: "e5a96c3", parentIds: ["c3e8a52"], branch: "feature/sync", message: "Retry on reconnect", author: "Jonas" },
  { id: "f60b2d8", parentIds: ["d4f1b07", "e5a96c3"], branch: "main", message: "Merge offline sync", author: "Jonas" },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["GitGraph"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="git-graph"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no git-history visualization of its own; migrating typically means adopting a dedicated library (e.g. gitgraph.js) directly.",
      },
    ],
  },
];

export default function GitGraphPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>GitGraph</Heading>
      <Text color="secondary">A read-only commit history with branch columns and merge lines.</Text>

      <DemoStage
        title="Tideline mobile history"
        caption="Offline sync on its own branch, merged back to main"
        code={CODE}
        states={[
          { label: "One commit", node: <GitGraph title="New repo" commits={[COMMITS[0]!]} /> },
          { label: "One branch", node: <GitGraph title="main only" commits={[COMMITS[0]!, { ...COMMITS[1]!, parentIds: ["a1c4e90"] }]} /> },
          { label: "Oldest first", node: <GitGraph title="Oldest first" order="oldest-first" commits={[COMMITS[0]!, COMMITS[1]!]} /> },
        ]}
      >
        <GitGraph title="Tideline mobile" commits={COMMITS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Release card" caption="History beside the release status" widths={false}>
        <Card title="Tideline mobile 0.9" subtitle="Due 7 Nov" extra={<Tag tone="info">Review</Tag>}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">Offline sync merged on 17 Oct. Two commits since.</Text>
            <GitGraph title="Latest commits" commits={[{ ...COMMITS[2]!, parentIds: [] }, COMMITS[4]!]} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
