"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Avatar, Badge, CalendarIcon, ChatIcon, FolderIcon, Heading, HomeIcon, MobileTabBar, Stack, Tag, TeamIcon, Text } from "rebar-ui";
import type { MobileTabBarItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, PROJECTS, TASKS, avatarOf, person, project } from "@/fixtures/tideline";
import { DOT, Kicker, PHONE_TABS, PhoneList, PhoneRow, TAB_BAR_STYLE, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<MobileTabBar
  items={[
    { label: "Today", icon: <HomeIcon /> },
    { label: "Projects", icon: <FolderIcon /> },
    { label: "Calendar", icon: <CalendarIcon /> },
    { label: "People", icon: <TeamIcon /> },
  ]}
  activeIndex={tab}
  onActiveChange={setTab}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["MobileTabBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A plain `<nav aria-label="Primary">` of real, keyboard-focusable `<button>` or `<a>` targets (`renderLink` for a framework router). Every item is at least 44×44 CSS px and always shows both an icon and a label. The active item carries `aria-current="page"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="mobile-tab-bar"` on the `<nav>`; `data-rebar-part="item"` on each item wrapper.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD has no direct equivalent; a bottom tab bar is a mobile-native pattern. antd-mobile's `TabBar` is the closer sibling library if the migration target is genuinely mobile." }],
  },
];

const TABS: MobileTabBarItem[] = [
  { label: "Today", icon: <HomeIcon /> },
  { label: "Projects", icon: <FolderIcon /> },
  { label: "Calendar", icon: <CalendarIcon /> },
  { label: "People", icon: <TeamIcon /> },
];

/** A bare tab bar in a box of its own (the construct is `position: fixed` to its containing block). */
function BarBox({ children }: { children: ReactNode }) {
  return <div style={{ position: "relative", transform: "translateZ(0)", height: 64, border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-primary)" }}>{children}</div>;
}

function TodayScreen() {
  return (
    <PhoneList>
      {TASKS.filter((t) => t.column !== "done")
        .slice(0, 3)
        .map((t) => (
          <PhoneRow
            key={t.id}
            thumb={false}
            title={t.title}
            meta={
              <Tag tone={t.tag === "Design" ? "error" : t.tag === "Ops" ? "success" : "info"} style={{ marginTop: 6 }}>
                {t.tag}
              </Tag>
            }
            trailing={<Avatar size="sm" {...avatarOf(t.assignee)} />}
          />
        ))}
    </PhoneList>
  );
}

function ProjectsScreen() {
  const meta = (id: string) => {
    const p = project(id);
    if (p.status === "Done") return "Done";
    if (p.status === "Late") return "Late by 2 days";
    if (p.status === "Review") return "Review, 3 open";
    return `${Math.round((p.done * 14) / 100)} of 14 done`;
  };
  return (
    <PhoneList>
      {PROJECTS.slice(0, 4).map((p, i) => (
        <PhoneRow key={p.id} title={p.name} meta={meta(p.id)} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
      ))}
    </PhoneList>
  );
}

function CalendarScreen() {
  return (
    <Stack gap="sm">
      <Kicker>Fri 24 Oct</Kicker>
      <PhoneList>
        {EVENTS.slice(0, 2).map((e) => (
          <PhoneRow key={e.id} thumb={false} trailing={null} title={e.title} meta={`${e.time ?? e.date}, ${person(project(e.project).owner).name.split(" ")[0]}`} />
        ))}
      </PhoneList>
    </Stack>
  );
}

export default function MobileTabBarPage() {
  const [tab, setTab] = useState(0);
  const screens = [<TodayScreen key="today" />, <ProjectsScreen key="projects" />, <CalendarScreen key="calendar" />, <Text key="people" size="sm" color="secondary">Four people on the crew.</Text>];
  const titles = ["Today", "Projects", "Calendar", "People"];

  return (
    <Stack gap="lg">
      <Heading level={1}>MobileTabBar</Heading>
      <Text color="secondary">Bottom bar with four destinations, a badge and an active tab.</Text>

      <DemoStage
        title="Tideline mobile"
        caption="Tap a tab: the screen above follows"
        code={CODE}
        states={[
          {
            label: "Badge",
            node: (
              <BarBox>
                <MobileTabBar
                  aria-label="Badge example"
                  items={[{ label: "Inbox", icon: <Badge count={2}><ChatIcon /></Badge> }, { label: "Projects", icon: <FolderIcon /> }, { label: "Calendar", icon: <CalendarIcon /> }]}
                  defaultActiveIndex={0}
                  style={TAB_BAR_STYLE}
                />
              </BarBox>
            ),
          },
          {
            label: "Dots",
            node: (
              <BarBox>
                <MobileTabBar aria-label="Dot tabs" items={[PHONE_TABS[0], PHONE_TABS[1], PHONE_TABS[3]].map((label) => ({ label, icon: DOT }))} defaultActiveIndex={0} style={TAB_BAR_STYLE} />
              </BarBox>
            ),
          },
          {
            label: "Links",
            node: (
              <BarBox>
                <MobileTabBar aria-label="Link tabs" items={[TABS[0], TABS[1], TABS[3]].map((t) => ({ ...t, href: `#${t.label.toLowerCase()}` }))} defaultActiveIndex={1} />
              </BarBox>
            ),
          },
          {
            label: "Compact bar via --rebar-tab-bar-* properties (49px, 24px icons, 10px labels, regular weight)",
            node: (
              <div style={{ "--rebar-tab-bar-min-height": "0px", "--rebar-tab-bar-padding": "0", "--rebar-tab-bar-gap": "0", "--rebar-tab-bar-item-padding": "4px 8px", "--rebar-tab-bar-item-min-height": "0px", "--rebar-tab-bar-item-gap": "2px", "--rebar-tab-bar-item-radius": "0", "--rebar-tab-bar-icon-size": "24px", "--rebar-tab-bar-icon-font-size": "24px", "--rebar-tab-bar-label-size": "10px", "--rebar-tab-bar-label-line-height": "15px", "--rebar-tab-bar-weight": "400", "--rebar-tab-bar-active-weight": "400", "--rebar-tab-bar-color": "#666" } as React.CSSProperties}>
                <MobileTabBar position="static" activeIndex={0} items={[{ label: "Today", icon: <span>◆</span> }, { label: "Pray", icon: <span>◇</span> }, { label: "Ask", icon: <span>○</span> }]} />
              </div>
            ),
          },
        ]}
      >
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" align="start" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title={titles[tab]} height={420} width={250} tabBar={<MobileTabBar aria-label="Tideline" items={TABS} activeIndex={tab} onActiveChange={setTab} style={TAB_BAR_STYLE} />}>
              {screens[tab]}
            </TidelinePhone>
            <TidelinePhone title="Calendar" height={420} width={250} tabBar={<MobileTabBar aria-label="Tideline, calendar" items={TABS} activeIndex={2} style={TAB_BAR_STYLE} />}>
              <CalendarScreen />
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects" caption="The bar under a real list, with the current tab marked" widths={false}>
        <div className="cs-grain cs-grain--sand" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title="Projects" tabs={1} height={440} width={250}>
              <ProjectsScreen />
              <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 14, background: "var(--rebar-color-tint-2)" }}>
                <Kicker style={{ marginBottom: 4 }}>This week</Kicker>
                <Text size="sm">7 tasks due, 3 today.</Text>
              </div>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
