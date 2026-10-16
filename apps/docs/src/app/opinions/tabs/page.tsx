"use client";

import { Avatar, Badge, Card, Checkbox, Heading, Stack, Tab, TabList, TabPanel, Tabs, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, FILES, TASKS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<Tabs defaultValue="tasks">
  <TabList aria-label="Project views">
    <Tab value="overview">Overview</Tab>
    <Tab value="tasks">Tasks <Badge count={12} /></Tab>
    <Tab value="files">Files <Badge count={4} /></Tab>
    <Tab value="activity">Activity</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="tasks">…</TabPanel>
</Tabs>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Tabs props", rows: componentProps["Tabs"] ?? [] },
  { type: "props-table", heading: "Tab props", rows: componentProps["Tab"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'Radix tabs: `role="tablist"`, each `Tab` a `role="tab"` button with `aria-selected` and `aria-controls`, each `TabPanel` a `role="tabpanel"`. Arrow keys move between tabs, Home and End jump to the ends; a disabled tab is skipped.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="tabs"` on the root; `data-rebar-part="list"` on `TabList` (with `data-rebar-size`), `"tab"` on each `Tab`, `"panel"` on each `TabPanel`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Tabs` takes an `items` array (`{ key, label, children }`) rather than JSX children: a real, mechanical restructuring, not a straight prop rename." }],
  },
];

const harbour = project("harbour");
const harbourTasks = TASKS.filter((t) => t.project === "harbour");
const harbourFiles = FILES.filter((f) => f.project === "harbour");

function TaskRows() {
  return (
    <Stack gap="xs">
      {harbourTasks.map((t) => (
        <Stack key={t.id} direction="row" gap="sm" align="center" style={{ padding: "10px 12px", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius)" }}>
          <Checkbox defaultChecked={t.column === "done"} aria-label={`Done: ${t.title}`} />
          <Text as="span" size="sm" style={{ flex: 1, fontWeight: "var(--rebar-font-weight-semibold)", textDecoration: t.column === "done" ? "line-through" : undefined }}>
            {t.title}
          </Text>
          <Avatar size="sm" {...avatarOf(t.assignee)} />
          <Text as="span" size="xs" color="secondary">
            {t.due ? `Due ${t.due}` : t.tag}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}

function ProjectTabs({ defaultValue = "overview" }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabList aria-label="Project views">
        <Tab value="overview">Overview</Tab>
        <Tab value="tasks">
          Tasks <Badge count={harbourTasks.length} />
        </Tab>
        <Tab value="files">
          Files <Badge count={harbourFiles.length} />
        </Tab>
        <Tab value="activity">Activity</Tab>
      </TabList>
      <TabPanel value="overview">
        <Text size="sm" color="secondary">
          {harbour.summary} {harbour.done}% done, launch {harbour.due}.
        </Text>
      </TabPanel>
      <TabPanel value="tasks">
        <TaskRows />
      </TabPanel>
      <TabPanel value="files">
        <Stack gap="xs">
          {harbourFiles.map((f) => (
            <Stack key={f.id} direction="row" justify="between" style={{ padding: "8px 12px", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius)" }}>
              <Text as="span" size="sm">
                {f.name}
              </Text>
              <Text as="span" size="xs" color="secondary">
                {f.size}
              </Text>
            </Stack>
          ))}
        </Stack>
      </TabPanel>
      <TabPanel value="activity">
        <Text size="sm" color="secondary">
          {person("maya").name} moved “Brand palette” to Done. {EVENTS[0].title} is on {EVENTS[0].date}.
        </Text>
      </TabPanel>
    </Tabs>
  );
}

export default function TabsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Tabs</Heading>
      <Text color="secondary">Switch views of one project.</Text>

      <DemoStage
        title="Project tabs"
        caption="Underline, counts, arrow keys"
        code={CODE}
        states={[
          {
            label: "Disabled",
            node: (
              <Tabs defaultValue="overview">
                <TabList aria-label="Views">
                  <Tab value="overview">Overview</Tab>
                  <Tab value="billing" disabled>
                    Billing
                  </Tab>
                </TabList>
                <TabPanel value="overview" />
              </Tabs>
            ),
          },
          {
            label: "Jumbo",
            node: (
              <Tabs defaultValue="board">
                <TabList aria-label="Views" size="jumbo">
                  <Tab value="board" description="Drag cards">
                    Board
                  </Tab>
                  <Tab value="list" description="Sort rows">
                    List
                  </Tab>
                </TabList>
                <TabPanel value="board" />
                <TabPanel value="list" />
              </Tabs>
            ),
          },
          {
            label: "Overflow",
            node: (
              <Tabs defaultValue="overview">
                <TabList aria-label="Views" style={{ overflowX: "auto" }}>
                  <Tab value="overview">Overview</Tab>
                  <Tab value="tasks">Tasks</Tab>
                  <Tab value="files">Files</Tab>
                  <Tab value="calendar">Calendar</Tab>
                  <Tab value="people">People</Tab>
                  <Tab value="settings">Settings</Tab>
                </TabList>
                <TabPanel value="overview" />
              </Tabs>
            ),
          },
        ]}
      >
        <ProjectTabs />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="Tabs under the project header, the task list open">
        <Card>
          <Stack gap="md">
            <Stack gap="xs">
              <Text as="span" size="xs" style={{ fontWeight: "var(--rebar-font-weight-semibold)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)" }}>
                {harbour.kicker}
              </Text>
              <Heading level={2}>{harbour.name}</Heading>
              <Text size="sm" color="secondary">
                {person(harbour.owner).name} · due {harbour.due}
              </Text>
            </Stack>
            <ProjectTabs defaultValue="tasks" />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
