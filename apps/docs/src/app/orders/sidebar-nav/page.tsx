"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Avatar, CalendarIcon, DownloadIcon, FolderIcon, Heading, HomeIcon, LineChartIcon, SettingsIcon, SidebarNav, Stack, TeamIcon, Text } from "rebar-ui";
import type { SidebarNavEntry } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, avatarOf, person, project } from "@/fixtures/tideline";
import { PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<SidebarNav
  logo={{ full: <Wordmark />, compact: <Mark /> }}
  items={[
    { label: "Today", href: "/today", icon: <HomeIcon />, badge: "3" },
    { label: "Projects", href: "/projects", icon: <FolderIcon />, active: true, items: [
      { label: "Harbour rebrand", href: "/projects/harbour" },
      { label: "Tideline mobile", href: "/projects/mobile" },
    ] },
    { label: "Calendar", href: "/calendar", icon: <CalendarIcon /> },
    { label: "People", href: "/people", icon: <TeamIcon /> },
    { type: "heading", label: "Studio" },
    { label: "Reports", href: "/reports", icon: <LineChartIcon /> },
    { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
  ]}
  footer={({ collapsed }) => <Account collapsed={collapsed} />}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SidebarNav"] ?? [] },
  {
    type: "doc-section",
    heading: "Slots and entries",
    body: [
      {
        kind: "text",
        text: '`logo` swaps between `full` and `compact` as the rail collapses; `header`, `workspace`, `search`, `panel` and `footer` take the rest of a real dashboard sidebar. Besides items (one level of nested `items`, a `badge`, `active`), the list accepts `{ type: "heading" }` and `{ type: "divider" }` entries. `activeStyle` is `"tint"`, `"bar"` or `"fill"`; `collapseTogglePlacement` is `"inline"`, `"edge"` or `"edge-hover"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "Collapsed, every link keeps its full label as the accessible name (and a native `title` tooltip); the active item carries `aria-current=\"page\"`; groups are real disclosure buttons." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="sidebar-nav"`, `data-rebar-collapsed` when collapsed; parts: `logo`, `header`, `workspace`, `search`, `list`, `heading`, `divider`, `item`, `sublist`, `subitem`, `badge`, `panel`, `footer`, `collapse-toggle`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Menu` in `inline` mode inside a `Layout.Sider` is a close structural match (`items`/`icon`/nested sub-menus map across; `collapsed` maps to the Sider's own prop). Not yet codemod-covered." }],
  },
];

const maya = person("maya");
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

const ITEMS: SidebarNavEntry[] = [
  { label: "Today", href: "#today", icon: <HomeIcon />, badge: "3" },
  {
    label: "Projects",
    href: "#projects",
    icon: <FolderIcon />,
    active: true,
    items: [
      { label: project("harbour").name, href: "#harbour" },
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

const CALENDAR_ACTIVE: SidebarNavEntry[] = ITEMS.map((e) => ("label" in e && "href" in e ? { ...e, active: e.label === "Calendar", items: undefined } : e));

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

/** The active row reads as a raised card on the cream sidebar (as in the mocks), and the action colour on it clears AA. */
const BOX = { border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", display: "flex", "--rebar-color-bg-secondary": "var(--rebar-color-bg-raised)" } as CSSProperties;

export default function SidebarNavPage() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Stack gap="lg">
      <Heading level={1}>SidebarNav</Heading>
      <Text color="secondary">Grouped links with an active page, counts and nested projects.</Text>

      <DemoStage
        title="Primary navigation"
        caption="Tint and bar active styles; the first collapses to a rail"
        code={CODE}
        states={[
          { label: "Collapsed rail", node: <div style={{ ...BOX, height: 300, width: 66 }}><SidebarNav items={ITEMS.slice(0, 4)} logo={{ full: <Wordmark />, compact: <Mark /> }} collapsed hideCollapseToggle style={{ height: "100%" }} /></div> },
          { label: "Fill", node: <div style={{ ...BOX, height: 300 }}><SidebarNav items={CALENDAR_ACTIVE.slice(0, 4)} activeStyle="fill" hideCollapseToggle style={{ height: "100%", width: "100%" }} /></div> },
          { label: "Long label", node: <div style={{ ...BOX, height: 300 }}><SidebarNav items={[{ label: "Northern depot signage and wayfinding", href: "#signage", active: true, icon: <FolderIcon />, badge: "12" }]} hideCollapseToggle style={{ height: "100%", width: "100%" }} /></div> },
          { label: "Empty", node: <div style={{ ...BOX, height: 300 }}><SidebarNav items={[{ type: "heading", label: "Projects" }]} hideCollapseToggle panel={<Text size="xs" color="secondary">No projects yet. Create one to see it here.</Text>} style={{ height: "100%", width: "100%" }} /></div> },
        ]}
      >
        <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
          <div style={{ ...BOX, height: 560 }}>
            <SidebarNav items={ITEMS} logo={{ full: <Wordmark />, compact: <Mark /> }} footer={({ collapsed: c }) => <Account collapsed={c} />} collapsed={collapsed} onCollapsedChange={setCollapsed} style={{ height: "100%" }} />
          </div>
          <div style={{ ...BOX, height: 560 }}>
            <SidebarNav items={CALENDAR_ACTIVE} activeStyle="bar" search={{ placeholder: "Search" }} footer={<Account collapsed={false} />} hideCollapseToggle style={{ height: "100%" }} />
          </div>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On a phone" caption="The sidebar as a drawer over the projects list" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone
              title="Projects"
              tabs={1}
              height={460}
              dim
              overlay={
                <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 200, zIndex: 1002, display: "flex", boxShadow: "var(--rebar-shadow-float)", "--rebar-color-bg-secondary": "var(--rebar-color-bg-raised)" } as CSSProperties}>
                  <SidebarNav items={CALENDAR_ACTIVE.slice(0, 4)} logo={{ full: <Wordmark />, compact: <Mark /> }} activeStyle="tint" hideCollapseToggle footer={<Account collapsed={false} />} style={{ height: "100%", width: "100%" }} />
                </div>
              }
            >
              <PhoneList>
                {PROJECTS.slice(0, 4).map((p, i) => (
                  <PhoneRow key={p.id} title={p.name} meta={p.status} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                ))}
              </PhoneList>
            </TidelinePhone>
            <TidelinePhone title="Projects" tabs={1} height={460}>
              <PhoneList>
                {PROJECTS.slice(0, 4).map((p, i) => (
                  <PhoneRow key={p.id} title={p.name} meta={p.status} tint={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                ))}
              </PhoneList>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
