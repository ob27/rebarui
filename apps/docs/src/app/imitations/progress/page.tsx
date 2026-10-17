import { Card, Heading, Progress, Stack, Text } from "rebar-ui";
import type { CSSProperties } from "react";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, project } from "@/fixtures/tideline";

const CODE = `<Progress value={harbour.done} aria-label="Harbour rebrand" />
<Progress value={interviews.done} aria-label="Crew interviews" />`;

const harbour = project("harbour");
const interviews = project("interviews");

const UPLOADS = [
  { file: FILES.find((f) => f.id === "mark")!, pct: 100 },
  { file: FILES.find((f) => f.id === "fascia")!, pct: 62 },
  { file: FILES.find((f) => f.id === "livery")!, pct: 0 },
];

function Labelled({ label, value, max = 100, right }: { label: string; value: number; max?: number; right: string }) {
  return (
    <Stack gap="xs">
      <Stack direction="row" justify="between" align="center">
        <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
          {label}
        </Text>
        <Text as="span" size="sm" color="secondary">
          {right}
        </Text>
      </Stack>
      <Progress value={value} max={max} aria-label={label} />
    </Stack>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Progress"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'A real Radix `role="progressbar"` with `aria-valuenow`/`aria-valuemax`. Pass `aria-label`, and show the number as text next to it: the bar alone is not enough.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="progress"` on the root; `data-rebar-part="indicator"` on the fill.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: 'AntD\'s `Progress` (`type="line"`, its default) takes the same value as `percent`: a close, low-risk rename.' }],
  },
  {
    type: "doc-section",
    heading: "Warning status",
    body: [
      {
        "kind": "text",
        "text": "`status=\"warning\"` colours the bar in the warning tone, for a quota that is nearly used or a step that needs attention."
      },
      {
        "kind": "code",
        "code": "<Progress value={85} status=\"warning\" aria-label=\"Storage\" />"
      }
    ],
  },
];

export default function ProgressPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Progress</Heading>
      <Text color="secondary">A linear progress bar.</Text>

      <DemoStage
        title="Progress"
        caption="Linear progress"
        code={CODE}
        states={[
          { label: "Empty", node: <Progress value={0} aria-label="Empty" /> },
          { label: "Half", node: <Progress value={50} aria-label="Half" /> },
          { label: "Complete", node: <Progress value={100} aria-label="Complete" /> },
          { label: "Custom max", node: <Labelled label="Tasks" value={9} max={14} right="9 of 14" /> },
        ]}
      >
        <Stack gap="lg" style={{ maxWidth: 480, margin: "0 auto" }}>
          <Labelled label={harbour.name} value={harbour.done} right={`${harbour.done}% done`} />
          <Labelled label={interviews.name} value={interviews.done} right={`${interviews.done}%`} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="File upload" caption="One bar per file, a count on top">
        <Card style={{ maxWidth: 460, margin: "0 auto" }}>
          <Stack gap="md">
            <Stack direction="row" justify="between" align="center">
              <Heading level={3}>Uploading {UPLOADS.length} files</Heading>
              <Text as="span" size="sm" color="secondary">
                {UPLOADS.filter((u) => u.pct > 0).length} of {UPLOADS.length}
              </Text>
            </Stack>
            {UPLOADS.map((u) => (
              <Labelled key={u.file.id} label={u.file.name} value={u.pct} right={u.pct === 0 ? "Waiting" : `${u.pct}%`} />
            ))}
          </Stack>
        </Card>
      </DemoStage>

            <Heading level={2}>Thin usage bar</Heading>
      <DemoStage title="Tokens" caption="Height, radius, track and fill per status: --rebar-progress-*." widths={false}>
        <div style={{ "--rebar-progress-height": "6px", "--rebar-progress-radius": "999px", "--rebar-progress-fill": "#e9705c" } as CSSProperties}><Progress value={64} aria-label="Usage" /></div>
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
