"use client";

import { Avatar, Button, Card, Heading, Stack, Text, Tooltip } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { STATUS_TONE, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = "<Tooltip content=\"Saves your current changes\">\n  <Button>Save changes</Button>\n</Tooltip>";


const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Tooltip"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "Shows on hover and on keyboard focus. `children` must be a single focusable element; wrap a disabled button in a focusable span." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-component=\"tooltip\"` on the popover content." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Tooltip` takes the same shape (`title` instead of `content`): a low-risk rename." }],
  },
];

export default function TooltipPage() {
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>Tooltip</Heading>
      <Text color="secondary">A short hint that shows on hover or keyboard focus.</Text>

      <DemoStage title="Save button" caption="Hover or Tab to the button" code={CODE} widths={false}
        states={[
          { label: "On an icon button", node: <Tooltip content="Share this project"><Button variant="tertiary" aria-label="Share">Share</Button></Tooltip> },
          { label: "Long content", node: <Tooltip content="Exports every task, file and message in Harbour rebrand as a single zip. This can take a minute."><Button variant="secondary">Export</Button></Tooltip> },
          { label: "Disabled button", node: <Tooltip content="Only the owner can delete a project"><span tabIndex={0} style={{ display: "inline-block" }}><Button variant="destructive" disabled>Delete project</Button></span></Tooltip> },
          { label: "No delay", node: <Tooltip content="Opens instantly" delayDuration={0}><Button variant="secondary">Instant</Button></Tooltip> },
        ]}>
        <Tooltip content="Saves your current changes">
          <Button>Save changes</Button>
        </Tooltip>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project card" caption="Hover an avatar to see who it is" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }} title={mobile.name} subtitle={`${mobile.kicker}, due ${mobile.due}`} labels={[{ label: mobile.status, tone: STATUS_TONE[mobile.status] }]}>
          <Stack gap="md">
            <Text size="sm" color="secondary">{mobile.summary}</Text>
            <Stack direction="row" gap="xs" align="center">
              {["jonas", "maya", "priya"].map((id) => (
                <Tooltip key={id} content={`${person(id).name}, ${person(id).role}`}>
                  <span tabIndex={0} style={{ display: "inline-flex", borderRadius: "50%" }}><Avatar {...avatarOf(id)} /></span>
                </Tooltip>
              ))}
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
