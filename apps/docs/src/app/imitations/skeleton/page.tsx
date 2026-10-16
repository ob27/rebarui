import { Card, Heading, Skeleton, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `<Stack direction="row" gap="sm" align="center">
  <Skeleton variant="avatar" />
  <Skeleton variant="text" lines={2} width={160} />
</Stack>
<Skeleton variant="text" lines={3} />`;

function Row() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <Skeleton variant="avatar" />
      <Skeleton variant="text" lines={2} width={180} />
    </Stack>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Skeleton"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'The whole thing is `aria-hidden="true"`. Announce the loading state once, from an `aria-live` region or `Spin`, rather than reading every placeholder shape.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="skeleton"`, `data-rebar-variant`, `data-rebar-part="line"` on each row of the `text` variant.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered: AntD's `Skeleton` composes `Skeleton.Avatar`/`Skeleton.Button`/`Skeleton.Input` rather than one component with a `variant`." }],
  },
];

export default function SkeletonPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Skeleton</Heading>
      <Text color="secondary">A placeholder while content loads.</Text>

      <DemoStage
        title="Skeleton"
        caption="Placeholder while loading"
        code={CODE}
        states={[
          { label: "Image", node: <Skeleton variant="rect" height={80} /> },
          { label: "Button", node: <Skeleton variant="button" width={110} height={40} /> },
          { label: "Heading", node: <Skeleton variant="text" lines={1} height={22} width="70%" /> },
          { label: "Static", node: <Skeleton variant="text" lines={2} active={false} /> },
        ]}
      >
        <Stack direction="row" gap="xl" align="start" style={{ flexWrap: "wrap" }}>
          <Row />
          <div style={{ flex: "1 1 220px" }}>
            <Skeleton variant="text" lines={3} />
          </div>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project list loading" caption="Rows shaped like the real list">
        <Card style={{ maxWidth: 480, margin: "0 auto" }}>
          <Stack gap="md">
            {PROJECTS.slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ paddingTop: i ? 16 : 0, borderTop: i ? "1px solid var(--rebar-color-border)" : undefined }}>
                <Row />
              </div>
            ))}
            <Text size="xs" color="secondary">
              Loading {PROJECTS.length} projects
            </Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
