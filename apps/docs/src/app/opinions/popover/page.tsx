"use client";

import { Avatar, Button, Card, Heading, Popover, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { STATUS_TONE, TASKS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<Popover trigger={<Button variant="secondary">Filters</Button>}>
  <Text size="sm">Status</Text>
</Popover>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Popover"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Real Radix `Popover` underneath: focus moves into the panel on open and returns to the trigger on close, Escape closes it, and a click outside closes it. `role` and focus trapping come from Radix, not reimplemented here.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="popover"` on the content panel.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's `Popover` takes `content`/`title` props directly rather than a `children`-as-panel-content shape, so mapping this over is a structural change, not a rename.",
      },
    ],
  },
];

export default function PopoverPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Popover</Heading>
      <Text color="secondary">A floating panel that opens from a click on its trigger.</Text>

      <DemoStage
        title="Filters"
        caption="Click to open, Escape or a click outside to close"
        code={CODE}
        widths={false}
        states={[
          {
            label: "Person card",
            node: (
              <Popover trigger={<button type="button" aria-label="Maya Chen" style={{ border: 0, background: "none", padding: 0, cursor: "pointer" }}><Avatar {...avatarOf("maya")} /></button>}>
                <Stack gap="xs" style={{ minWidth: 180 }}>
                  <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{person("maya").name}</Text>
                  <Text size="xs" color="secondary">{person("maya").role}, owns Harbour rebrand</Text>
                </Stack>
              </Popover>
            ),
          },
          { label: "Wider offset", node: <Popover sideOffset={16} trigger={<Button variant="tertiary">Details</Button>}><Text size="sm">Due 24 Oct, 84% done</Text></Popover> },
        ]}
      >
        <Popover trigger={<Button variant="secondary">Filters</Button>}>
          <Stack gap="sm" style={{ minWidth: 200 }}>
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>Filter by status</Text>
            <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
              {(Object.keys(STATUS_TONE) as (keyof typeof STATUS_TONE)[]).map((s) => (
                <Tag key={s} tone={STATUS_TONE[s]}>{s}</Tag>
              ))}
            </Stack>
          </Stack>
        </Popover>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project header" caption="A people popover and a filter popover on one toolbar" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title={project("harbour").name} subtitle={project("harbour").summary} extra={<Tag tone={STATUS_TONE[project("harbour").status]}>{project("harbour").status}</Tag>}>
          <Stack direction="row" gap="md" align="center" justify="between">
            <Stack direction="row" gap="xs">
              {["maya", "priya", "jonas"].map((id) => (
                <Popover key={id} trigger={<button type="button" aria-label={person(id).name} style={{ border: 0, background: "none", padding: 0, cursor: "pointer" }}><Avatar {...avatarOf(id)} /></button>}>
                  <Stack gap="xs" style={{ minWidth: 180 }}>
                    <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{person(id).name}</Text>
                    <Text size="xs" color="secondary">{person(id).role}</Text>
                  </Stack>
                </Popover>
              ))}
            </Stack>
            <Popover trigger={<Button size="sm" variant="secondary">Show tasks</Button>}>
              <Stack gap="xs" style={{ minWidth: 200 }}>
                {TASKS.filter((t) => t.project === "harbour").map((t) => (
                  <Text key={t.id} size="sm">{t.title}</Text>
                ))}
              </Stack>
            </Popover>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
