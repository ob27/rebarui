"use client";

import { useState } from "react";
import { Box, Heading, SidebarNav, Stack, Text } from "rebar-ui";
import type { SidebarNavItem } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "#dashboard", icon: "🏠", active: true },
  { label: "Projects", href: "#projects", icon: "📁" },
  {
    label: "Settings",
    icon: "⚙️",
    items: [
      { label: "Profile", href: "#profile" },
      { label: "Billing", href: "#billing" },
      { label: "Team members", href: "#team" },
    ],
  },
  { label: "Help", href: "#help", icon: "❓" },
];

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<SidebarNav items={[{ label: "Dashboard", href: "/dashboard", icon: <HomeIcon />, active: true }, { label: "Settings", icon: <GearIcon />, items: [{ label: "Profile", href: "/settings/profile" }] }]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["SidebarNav"] ?? [] },
  {
    type: "doc-section",
    heading: "A real alternative shape to NavBar, not a variant of it",
    body: [
      {
        kind: "text",
        text: "`NavBar` is a horizontal row that collapses overflowing items into a trailing \"More\" popover once it runs out of width — real measure-and-collapse mechanics `SidebarNav` doesn't need, since a vertical list doesn't run out of horizontal room the way a horizontal row does. `SidebarNav` instead has its own real concerns `NavBar` doesn't: one level of collapsible nested/grouped items (a common admin-dashboard \"Settings\" group), and an icon-only `collapsed` mode for reclaiming horizontal space. Reach for `NavBar` for a top-level marketing/docs-site nav, `SidebarNav` for an admin/dashboard-shaped app where the nav genuinely lives down the side.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Collapsed mode keeps a real accessible name",
    body: [
      {
        kind: "text",
        text: "Collapsing hides the visible label text (kept as a `title` attribute, the standard browser-tooltip affordance for an icon-only control) but every link/group-toggle still carries a real `aria-label` matching the full label — an icon-only sidebar item is still announced by its real name to a screen reader, not silently reduced to an unlabeled icon.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="sidebar-nav"`, `data-rebar-collapsed` when collapsed; parts: `list`, `item`, `sublist`, `subitem`, `collapse-toggle`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Menu` (in `inline` mode, inside a `Layout.Sider`) is a close structural match — `items`/`icon`/nested sub-menus map across directly; `collapsed` maps to `Layout.Sider`'s own `collapsed` prop. Not yet codemod-covered.",
      },
    ],
  },
];

export default function SidebarNavPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Stack gap="lg">
      <Heading level={1}>SidebarNav</Heading>
      <Text color="secondary">
        A traditional vertical left-hand navigation — the Bootstrap-dashboard-style pattern, for
        admin/dashboard-shaped apps.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          height: 420,
          overflow: "hidden",
        }}
      >
        <SidebarNav items={ITEMS} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
