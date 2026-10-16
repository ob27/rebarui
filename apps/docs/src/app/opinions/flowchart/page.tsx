import { Card, Flowchart, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<Flowchart
  title="Task review"
  steps={[
    { id: "start", label: "Task done", shape: "start-end", next: ["check"] },
    { id: "check", label: "Design approved?", shape: "decision", next: ["yes", "no"] },
    { id: "yes", label: "Ship to crew", shape: "process", next: ["end"] },
    { id: "no", label: "Revise", shape: "process", next: ["check"] },
    { id: "end", label: "Closed", shape: "start-end" },
  ]}
/>`;

const REVIEW = [
  { id: "start", label: "Task done", shape: "start-end" as const, next: ["check"] },
  { id: "check", label: "Approved?", shape: "decision" as const, next: ["yes", "no"] },
  { id: "yes", label: "Ship to crew", shape: "process" as const, next: ["end"] },
  { id: "no", label: "Revise", shape: "process" as const, next: ["end"] },
  { id: "end", label: "Closed", shape: "start-end" as const },
];
const LINEAR = [
  { id: "a", label: "Draft", next: ["b"] },
  { id: "b", label: "Review", next: ["c"] },
  { id: "c", label: "Publish", shape: "start-end" as const },
];
const PAYROLL = [
  { id: "s", label: "Cut-off 28 Oct", shape: "start-end" as const, next: ["d"] },
  { id: "d", label: "Rota signed off?", shape: "decision" as const, next: ["x", "w"] },
  { id: "x", label: "Export rota", shape: "process" as const, next: ["e"] },
  { id: "w", label: "Chase Leo", shape: "process" as const, next: ["e"] },
  { id: "e", label: "Payroll", shape: "start-end" as const },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Flowchart"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="flowchart"` on the root; the underlying `NodeLinkGraph`\'s own toolbar/node/edge parts render underneath unchanged.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no diagramming components of its own; structured flowchart/BPMN shapes typically migrate to a dedicated library (JointJS, mxGraph) rather than an antd component.",
      },
    ],
  },
];

export default function FlowchartPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Flowchart</Heading>
      <Text color="secondary">Process, decision and start/end shapes joined by each step&apos;s own next list.</Text>

      <DemoStage
        title="Task review"
        caption="A decision fans out into two branches"
        code={CODE}
        states={[
          { label: "Straight line", node: <Flowchart title="Publishing" steps={LINEAR} width={320} height={300} /> },
          { label: "Single step", node: <Flowchart title="One step" steps={[{ id: "only", label: "Close task", shape: "start-end" }]} width={240} height={100} /> },
        ]}
      >
        <Flowchart title="Task review" steps={REVIEW} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Runbook" caption="The rota export flow on its project page" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Rota export: payroll cut-off">
          <Stack gap="sm">
            <Text size="sm" color="secondary">What happens before the 28 Oct payroll cut-off.</Text>
            <Flowchart title="Payroll cut-off" steps={PAYROLL} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
