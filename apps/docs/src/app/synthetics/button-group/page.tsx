import { Button, ButtonGroup, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<ButtonGroup>
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ButtonGroup"] ?? [] },
  {
    type: "doc-section",
    heading: "Sizing",
    body: [
      {
        kind: "text",
        text: "`ButtonGroup` never overrides its children's props; it only joins them visually. Set `size` and `variant` on each `Button`. The root is `inline-flex`; to fill a container pass `style={{ display: \"flex\" }}` and `flex: 1` on the buttons.",
      },
      { kind: "code", code: '<ButtonGroup style={{ display: "flex" }}>\n  <Button variant="secondary" style={{ flex: 1 }}>Day</Button>\n  <Button variant="secondary" style={{ flex: 1 }}>Week</Button>\n</ButtonGroup>' },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="button-group"`, `data-rebar-orientation="horizontal" | "vertical"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Button.Group` (or `Space.Compact`) is a close direct equivalent." }],
  },
];

export default function ButtonGroupPage() {
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>ButtonGroup</Heading>
      <Text color="secondary">A joined row or column of equal buttons.</Text>

      <DemoStage
        title="Calendar range"
        caption="Three equal, always-visible choices"
        code={CODE}
        widths={false}
        states={[
          {
            label: "Vertical",
            node: (
              <ButtonGroup orientation="vertical">
                <Button variant="secondary">Top</Button>
                <Button variant="secondary">Middle</Button>
                <Button variant="secondary">Bottom</Button>
              </ButtonGroup>
            ),
          },
          {
            label: "Disabled",
            node: (
              <ButtonGroup>
                <Button variant="secondary" disabled>Day</Button>
                <Button variant="secondary" disabled>Week</Button>
              </ButtonGroup>
            ),
          },
          {
            label: "Small",
            node: (
              <ButtonGroup>
                <Button variant="secondary" size="sm">Day</Button>
                <Button variant="secondary" size="sm">Week</Button>
                <Button variant="secondary" size="sm">Month</Button>
              </ButtonGroup>
            ),
          },
          {
            label: "Full width",
            node: (
              <ButtonGroup style={{ display: "flex", width: "100%" }}>
                <Button variant="secondary" style={{ flex: 1 }}>Day</Button>
                <Button variant="secondary" style={{ flex: 1 }}>Week</Button>
                <Button variant="secondary" style={{ flex: 1 }}>Month</Button>
              </ButtonGroup>
            ),
          },
        ]}
      >
        <ButtonGroup>
          <Button variant="secondary">Day</Button>
          <Button variant="secondary">Week</Button>
          <Button variant="secondary">Month</Button>
        </ButtonGroup>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project header" caption="View switcher and actions" widths={false}>
        <Card title={mobile.name} actions={[<Button key="share" variant="secondary">Share</Button>, <Button key="edit">Edit project</Button>]}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">{mobile.summary}</Text>
            <ButtonGroup>
              <Button variant="secondary">Board</Button>
              <Button variant="secondary">List</Button>
              <Button variant="secondary">Timeline</Button>
            </ButtonGroup>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
