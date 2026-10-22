"use client";

import type { ReactElement, ReactNode } from "react";
import { Avatar, Button, Card, DeviceFrame, Drawer, Heading, Input, MobileTabBar, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, PROJECTS, TASKS, avatarOf, person } from "@/fixtures/tideline";

const CODE = `<Drawer side="left" size={300} trigger={<Button variant="secondary">Menu</Button>} title="Tideline">
  <nav>…</nav>
</Drawer>

<Drawer side="right" trigger={<Button>Task details</Button>} title="Task details" footer={<Button>Save changes</Button>}>
  <Input defaultValue="Offline sync for tasks" aria-label="Title" />
</Drawer>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Drawer"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'Built on the same Radix Dialog primitive as `Dialog`: `role="dialog"` with `aria-modal="true"`, focus trapped inside the panel while open, Esc and a backdrop click close it. A visible close button is always rendered, never gesture-only dismissal.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="drawer"` on the panel; `data-rebar-side` mirrors `side`; `data-rebar-part="header"|"title"|"description"|"body"|"footer"|"close"`. Radix\'s own `data-state="open"|"closed"` is read directly.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Drawer` is a close match: `open`, `title` and `footer` keep their names, `side` maps to `placement`. `onOpenChange` is renamed to `onClose` and flagged, since AntD's `onClose` takes an event, not a boolean.",
      },
    ],
  },
];

const NAV = [
  { label: "Inbox", count: 3 },
  { label: "Projects", count: PROJECTS.length },
  { label: "Calendar" },
  { label: "Team", count: PEOPLE.length },
];

function MenuDrawer({ trigger }: { trigger: ReactElement }) {
  const maya = person("maya");
  return (
    <Drawer side="left" size={300} trigger={trigger} title="Tideline" footer={<Text size="sm" color="secondary">Settings · Sign out</Text>}>
      <Stack gap="md">
        <Stack direction="row" gap="sm" align="center">
          <Avatar {...avatarOf("maya")} />
          <Stack gap="xs">
            <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              {maya.name}
            </Text>
            <Text as="span" size="xs" color="secondary">
              Tideline studio
            </Text>
          </Stack>
        </Stack>
        <Stack gap="xs">
          {NAV.map((item, i) => (
            <Stack
              key={item.label}
              direction="row"
              justify="between"
              align="center"
              style={{ padding: "10px 12px", borderRadius: "var(--rebar-radius)", background: i === 1 ? "var(--rebar-color-tint-3)" : undefined }}
            >
              <Text as="span" size="sm" style={{ fontWeight: i === 1 ? "var(--rebar-font-weight-semibold)" : undefined }}>
                {item.label}
              </Text>
              {item.count ? (
                <Text as="span" size="xs" color="secondary">
                  {item.count}
                </Text>
              ) : null}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Drawer>
  );
}

function TaskDrawer({ trigger, side = "right" }: { trigger: ReactElement; side?: "right" | "bottom" }) {
  const sync = TASKS.find((t) => t.id === "sync") ?? TASKS[0];
  return (
    <Drawer side={side} trigger={trigger} title="Task details" footer={<Button>Save changes</Button>}>
      <Stack gap="md">
        <Input defaultValue={sync.title} aria-label="Title" />
        <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
          <Tag tone="info">{sync.tag}</Tag>
          <Tag tone="warning">Due 24 Oct</Tag>
        </Stack>
        <Stack direction="row" gap="sm" align="center" style={{ padding: "10px 12px", background: "var(--rebar-color-bg-secondary)", borderRadius: "var(--rebar-radius)" }}>
          <Avatar size="sm" {...avatarOf(sync.assignee)} />
          <Text as="span" size="sm">
            {person(sync.assignee).name}
          </Text>
        </Stack>
      </Stack>
    </Drawer>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <DeviceFrame variant="phone" style={{ maxWidth: 280 }}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
        <Stack direction="row" align="center" justify="between" style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "10px 12px 10px 18px" }}>
          <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
            Projects
          </Heading>
          {children}
        </Stack>
        <Stack gap="xs" style={{ padding: 14, flex: 1 }}>
          {PROJECTS.slice(0, 4).map((p) => (
            <Stack key={p.id} direction="row" gap="sm" align="center" style={{ padding: "10px 12px", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius)" }}>
              <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  {p.name}
                </Text>
                <Text as="span" size="xs" color="secondary">
                  {p.status} · {p.done}% done
                </Text>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <MobileTabBar aria-label="Tideline" style={{ position: "static" }} items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={1} />
      </div>
    </DeviceFrame>
  );
}

export default function DrawerPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Drawer</Heading>
      <Text color="secondary">A side panel for navigation or detail, with a scrim.</Text>

      <DemoStage
        title="Menu and details"
        caption="Left for navigation, right for a record; Esc closes"
        code={CODE}
        states={[
          { label: "Left", node: <MenuDrawer trigger={<Button variant="secondary" size="sm">Menu</Button>} /> },
          { label: "Right", node: <TaskDrawer trigger={<Button variant="secondary" size="sm">Task details</Button>} /> },
          { label: "Bottom", node: <TaskDrawer side="bottom" trigger={<Button variant="secondary" size="sm">Sheet</Button>} /> },
          {
            label: "Non-modal (modal={false}): no focus trap, nothing outside is made inert",
            node: (
              <Stack direction="row" gap="sm" align="center">
                <Drawer modal={false} side="right" title="Notes" trigger={<Button variant="secondary" size="sm">Notes</Button>} size={280}>
                  <Text size="sm" color="secondary">Tab leaves the panel; the dim layer is still drawn and still dismisses.</Text>
                </Drawer>
                <Input aria-label="Quick search" placeholder="Tab reaches this while open" />
              </Stack>
            ),
          },
          {
            label: "No title",
            node: (
              <Drawer trigger={<Button variant="secondary" size="sm">Open</Button>} size={280}>
                <Text size="sm" color="secondary">
                  A bare panel; the close button still renders.
                </Text>
              </Drawer>
            ),
          },
        ]}
      >
        <div className="cs-grain" style={{ padding: "48px 16px", display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <MenuDrawer trigger={<Button variant="secondary">Menu</Button>} />
          <TaskDrawer trigger={<Button>Task details</Button>} />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects on a phone" caption="Menu from the app bar; the details drawer from a card">
        <Stack gap="lg">
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <Phone>
              <MenuDrawer
                trigger={
                  <Button variant="tertiary" size="sm" style={{ color: "inherit" }} aria-label="Open menu">
                    Menu
                  </Button>
                }
              />
            </Phone>
          </div>
          <Card style={{ maxWidth: 420, margin: "0 auto" }} title="Offline sync for tasks" labels={[{ label: "Eng" }, { label: "Due 24 Oct" }]} actions={[<TaskDrawer key="open" trigger={<Button variant="secondary">Open details</Button>} />]}>
            <Text size="sm" color="secondary">
              Queue edits while offline and replay them when the crew is back in range.
            </Text>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
