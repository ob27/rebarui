"use client";

import { AppShell, Avatar, Button, CalendarIcon, DeviceFrame, DownloadIcon, FolderIcon, Heading, HomeIcon, LineChartIcon, SettingsIcon, Skeleton, Stack, Tag, TeamIcon, Text } from "rebar-ui";
import type { SidebarNavEntry } from "rebar-ui";
import type { CSSProperties, ReactNode } from "react";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, PEOPLE, STATUS_TONE, TASKS, avatarOf, gbp, person, project } from "@/fixtures/tideline";
import { Kicker, PHONE_TAB_ITEMS, PhoneList, PhoneRow, TAB_BAR_STYLE } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<AppShell
  variant="tablet"
  height="520px"
  sidebar={{ items, logo: { full: <Wordmark />, compact: <Mark /> }, footer: <Account /> }}
  rightPanel={{ title: "Task", width: 230, children: <TaskDetails task={task} /> }}
>
  <ProjectPage project={harbour} />
</AppShell>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AppShell"] ?? [] },
  {
    type: "doc-section",
    heading: "Variants",
    body: [
      {
        kind: "text",
        text: '`"sidebar"` (default), `"top-nav"`, `"top-nav-sidebar"`, `"three-pane"` (an icon rail beside a sidebar), `"mobile"` (a top bar and a real `MobileTabBar`) and `"tablet"` (the sidebar collapsed to a rail by default). `rightPanel` is a real `SidePanel` and composes with any of them.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When not to use it",
    body: [{ kind: "text", text: "Not for embedded widgets or pages that scroll naturally: `AppShell` owns the full viewport (`height: 100vh` by default) so every nav element reaches the edge." }],
  },
];

const harbour = project("harbour");
const maya = person("maya");
const homeTask = TASKS.find((t) => t.id === "home") ?? TASKS[0];

const Mark = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
    <path d="M7 20V6a3 3 0 0 1 6 0v3a3 3 0 0 1-3 3H7l6 8" fill="none" stroke="var(--rebar-color-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Wordmark = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 4px", fontFamily: "var(--rebar-font-family-display)", fontVariationSettings: '"SOFT" 100', fontWeight: 600, fontSize: 19 }}>
    <Mark /> Tideline
  </span>
);

const SHELL_ITEMS: SidebarNavEntry[] = [
  { label: "Today", href: "#today", icon: <HomeIcon />, badge: "3" },
  {
    label: "Projects",
    href: "#projects",
    icon: <FolderIcon />,
    active: true,
    items: [
      { label: harbour.name, href: "#harbour" },
      { label: project("mobile").name, href: "#mobile" },
    ],
  },
  { label: "Calendar", href: "#calendar", icon: <CalendarIcon /> },
  { label: "People", href: "#people", icon: <TeamIcon /> },
  { type: "heading", label: "Studio" },
  { label: "Reports", href: "#reports", icon: <LineChartIcon /> },
  { label: project("rota").name, href: "#rota", icon: <DownloadIcon /> },
  { label: "Settings", href: "#settings", icon: <SettingsIcon /> },
];

function Account({ collapsed }: { collapsed: boolean }) {
  return (
    <Stack direction="row" gap="sm" align="center" justify={collapsed ? "center" : "start"}>
      <Avatar size="sm" {...avatarOf(maya.id)} />
      {collapsed ? null : (
        <span>
          <Text size="sm" style={{ display: "block", fontWeight: "var(--rebar-font-weight-semibold)" }}>
            {maya.name}
          </Text>
          <Text size="xs" color="secondary" style={{ display: "block" }}>
            {maya.role}
          </Text>
        </span>
      )}
    </Stack>
  );
}

function TaskDetails() {
  const rows: [string, ReactNode][] = [
    ["Status", <Tag key="s" tone="info">In progress</Tag>],
    ["Owner", <Stack key="o" direction="row" gap="xs" align="center"><Avatar size="sm" {...avatarOf(maya.id)} /><Text size="sm">{maya.name}</Text></Stack>],
    ["Due", <Text key="d" size="sm">Fri {harbour.due}</Text>],
    ["Budget", <Text key="b" size="sm">{gbp(2400)}</Text>],
  ];
  return (
    <Stack gap="md">
      <Heading level={3} style={{ fontSize: 18 }}>
        {homeTask.title}
      </Heading>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", alignItems: "center" }}>
        {rows.map(([k, v]) => (
          <span key={k} style={{ display: "contents" }}>
            <Text size="sm" color="secondary">
              {k}
            </Text>
            {v}
          </span>
        ))}
      </div>
      <div style={{ padding: "12px 14px", borderRadius: 14, background: "var(--rebar-color-tint-2)" }}>
        <Kicker style={{ marginBottom: 4 }}>Note</Kicker>
        <Text size="sm">Waiting on final harbour photography from Leo.</Text>
      </div>
      <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
        <Button size="sm">Mark done</Button>
        <Button size="sm" variant="secondary">
          Reassign
        </Button>
      </Stack>
    </Stack>
  );
}

function ProjectPage() {
  const tasks = TASKS.filter((t) => t.project === harbour.id).slice(0, 3);
  return (
    <div style={{ padding: 20 }}>
      <Stack gap="md">
        <Stack gap="xs">
          <Kicker>Project</Kicker>
          <Heading level={2}>{harbour.name}</Heading>
        </Stack>
        <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
          <Button size="sm" variant="secondary">
            Share
          </Button>
          <Button size="sm">New task</Button>
        </Stack>
        <PhoneList>
          {tasks.map((t) => (
            <PhoneRow key={t.id} thumb={false} title={t.title} meta={<Tag tone={t.tag === "Design" ? "error" : t.tag === "Ops" ? "success" : "info"} style={{ marginTop: 6 }}>{t.tag}</Tag>} trailing={<Avatar size="sm" {...avatarOf(t.assignee)} />} />
          ))}
        </PhoneList>
      </Stack>
    </div>
  );
}

const FRAME = { border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", "--rebar-color-bg-secondary": "var(--rebar-color-bg-raised)" } as CSSProperties;

export default function AppShellPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>AppShell</Heading>
      <Text color="secondary">Sidebar, top bar, content and a detail panel in one frame.</Text>

      <DemoStage
        title="Studio workspace"
        caption="Rail sidebar, project page and a task panel; both sides collapse"
        code={CODE}
        states={[
          {
            label: "Two column",
            node: (
              <div style={FRAME}>
                <AppShell variant="sidebar" height="200px" sidebar={{ items: SHELL_ITEMS.slice(0, 3), hideCollapseToggle: true, collapsed: true }}>
                  <div style={{ padding: 14 }}>
                    <Heading level={3} style={{ fontSize: 16 }}>
                      Today
                    </Heading>
                    <Text size="sm" color="secondary">
                      7 tasks due
                    </Text>
                  </div>
                </AppShell>
              </div>
            ),
          },
          {
            label: "Top nav",
            node: (
              <div style={FRAME}>
                <AppShell variant="top-nav" height="200px" topNav={{ items: [{ label: "Today", href: "#today" }, { label: "Projects", href: "#projects" }, { label: "Calendar", href: "#calendar" }] }}>
                  <div style={{ padding: 14 }}>
                    <Heading level={3} style={{ fontSize: 16 }}>
                      Calendar
                    </Heading>
                    <Text size="sm" color="secondary">
                      {EVENTS[2].title}, {EVENTS[2].time}
                    </Text>
                  </div>
                </AppShell>
              </div>
            ),
          },
          {
            label: "Loading",
            node: (
              <div style={FRAME}>
                <AppShell variant="sidebar" height="200px" sidebar={{ items: [], hideCollapseToggle: true, collapsed: true, header: <Skeleton variant="avatar" /> }}>
                  <Stack gap="sm" style={{ padding: 14 }}>
                    <Skeleton variant="text" lines={2} />
                    <Skeleton variant="rect" height={60} />
                  </Stack>
                </AppShell>
              </div>
            ),
          },
        ]}
      >
        <div style={FRAME}>
          <AppShell
            variant="tablet"
            height="520px"
            sidebar={{
              items: SHELL_ITEMS,
              logo: { full: <Wordmark />, compact: <Mark /> },
              footer: ({ collapsed }) => <Account collapsed={collapsed} />,
              collapseTogglePlacement: "edge",
            }}
            rightPanel={{ title: "Task", width: 230, children: <TaskDetails /> }}
          >
            <ProjectPage />
          </AppShell>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On a phone" caption="The mobile variant: a top bar, the page and a real tab bar" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <DeviceFrame variant="phone" style={{ width: "100%", "--rebar-device-frame-max-width": "250px" } as CSSProperties}>
              <AppShell variant="mobile" height="460px" topNav={{ items: [{ label: "Today", href: "#today" }, { label: "Projects", href: "#projects" }, { label: "Calendar", href: "#calendar" }, { label: "People", href: "#people" }] }} tabBar={{ items: PHONE_TAB_ITEMS, defaultActiveIndex: 1, style: TAB_BAR_STYLE }}>
                <div style={{ padding: "12px 14px 70px" }}>
                  <Stack gap="sm">
                    <Kicker>Projects</Kicker>
                    <PhoneList>
                      {[harbour, project("mobile"), project("interviews")].map((p, i) => (
                        <PhoneRow key={p.id} title={p.name} meta={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                      ))}
                    </PhoneList>
                    <Text size="xs" color="secondary">
                      {PEOPLE.length} people, 5 projects.
                    </Text>
                  </Stack>
                </div>
              </AppShell>
            </DeviceFrame>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
