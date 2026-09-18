"use client";

import { useState } from "react";
import {
  Box,
  ChatIcon,
  DashboardIcon,
  ErrorWarningIcon,
  FolderIcon,
  Heading,
  HomeIcon,
  LineChartIcon,
  SegmentedControl,
  SettingsIcon,
  Stack,
  TaskIcon,
  TeamIcon,
  Text,
  AppShell,
} from "rebar-ui";
import type { SidebarNavProps } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SIDEBAR_ITEMS: SidebarNavProps["items"] = [
  { label: "Dashboard", href: "#dashboard", icon: <DashboardIcon />, active: true },
  { label: "Overview", href: "#overview", icon: <LineChartIcon /> },
  { label: "Chat", href: "#chat", icon: <ChatIcon />, badge: "5" },
  { label: "Team", href: "#team", icon: <TeamIcon /> },
  { type: "heading", label: "Shortcuts" },
  { label: "Tasks", href: "#tasks", icon: <TaskIcon /> },
  { label: "Reports", href: "#reports", icon: <ErrorWarningIcon /> },
  { type: "divider" },
  { label: "Settings", href: "#settings", icon: <SettingsIcon /> },
];

const RAIL_ITEMS: SidebarNavProps["items"] = [
  { label: "Home", href: "#home", icon: <HomeIcon />, active: true },
  { label: "Chat", href: "#chat", icon: <ChatIcon /> },
  { label: "Files", href: "#files", icon: <FolderIcon /> },
  { label: "Settings", href: "#settings", icon: <SettingsIcon /> },
];

const TOP_NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Docs", href: "#docs" },
  { label: "About", href: "#about" },
];

const TAB_BAR_ITEMS = [
  { label: "Home", href: "#home", icon: <HomeIcon /> },
  { label: "Chat", href: "#chat", icon: <ChatIcon /> },
  { label: "Settings", href: "#settings", icon: <SettingsIcon /> },
];

const VARIANTS = [
  { value: "sidebar", label: "Sidebar" },
  { value: "top-nav", label: "Top nav" },
  { value: "top-nav-sidebar", label: "Top nav + sidebar" },
  { value: "three-pane", label: "Three pane" },
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
] as const;

type Variant = (typeof VARIANTS)[number]["value"];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<AppShell
  sidebar={{
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon />, active: true },
      { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
    ],
    header: <Heading level={3}>My App</Heading>,
  }}
>
  <BlockRenderer document={myBlocks} />
</AppShell>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["AppShell"] ?? [] },
  {
    type: "doc-section",
    heading: "Starter template: AppShell + BlockRenderer",
    body: [
      {
        kind: "text",
        text: "The expected architecture for a full-viewport application: `AppShell` provides the structural frame, and `BlockRenderer` prints declarative content within that frame. This separation keeps layout concerns (the shell) distinct from content concerns (the blocks), and makes it impossible to hand-roll or hand-draw the shell — you select an Order-tier component first, then compose content inside it.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Seven variants, not two",
    body: [
      {
        kind: "text",
        text: '`variant="sidebar"` (default, dashboard pattern) and `variant="top-nav"` (docs/marketing pattern) are the two original shapes. Five more now cover the real layouts those two alone can\'t represent: `"top-nav-sidebar"` combines both (a global top bar plus a section sidebar — the GitHub/Linear complex-dashboard shape), `"three-pane"` adds a forced-collapsed icon-only `railSidebar` alongside a normal `sidebar` (Slack/Discord/VS Code), `"mobile"` composes an optional top bar with a real `MobileTabBar` pinned to the bottom, and `"tablet"` is the same shape as `"sidebar"` with the icon-only collapsed rail defaulted on (Material Design\'s "navigation rail") instead of a fully-expanded list.',
      },
      {
        kind: "text",
        text: '`rightPanel` (a real `SidePanel` — non-modal, sits beside content rather than over it, the Slack "thread" pattern) is deliberately not an eighth variant: it composes *with* any of the seven above rather than replacing one, since a right-docked detail panel is commonly used alongside whatever the primary navigation shape already is. Try it in the live preview below.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Why this architecture",
    body: [
      {
        kind: "text",
        text: "`AppShell` solves the CSS height-inheritance problem — the common bug where a sidebar doesn't extend to the bottom of the viewport because `height: 100%` on a child only works when the parent has an explicit `height` (not just `minHeight`). `AppShell` uses `height: 100vh` on the outer container by default, ensuring all children with `height: 100%` resolve correctly, however many nav elements that variant composes.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When NOT to use AppShell",
    body: [
      {
        kind: "text",
        text: "Don't use `AppShell` for embedded widgets that don't own the full viewport — use a plain `<Stack>` or `<Box>` instead. Don't use it for pages that scroll naturally — `AppShell` is for full-viewport applications where the nav must extend to the viewport edge.",
      },
    ],
  },
];

export default function AppShellPage() {
  const [variant, setVariant] = useState<Variant>("sidebar");
  const [showRightPanel, setShowRightPanel] = useState(false);

  const content = (
    <Box style={{ padding: "var(--rebar-space-lg)" }}>
      <Heading level={2}>Content area</Heading>
      <Text>
        This is where your page content goes — the content area fills whatever space the
        variant&apos;s nav elements don&apos;t claim, and scrolls independently if it overflows.
      </Text>
    </Box>
  );

  return (
    <Stack gap="lg">
      <Heading level={1}>AppShell</Heading>
      <Text>
        A full-viewport application shell that handles CSS height inheritance correctly, composing
        the real nav components for you across seven layout variants.
      </Text>

      <Box style={{ border: "1px solid var(--rebar-color-border)", padding: "var(--rebar-space-md)" }}>
        <Stack gap="md">
          <Heading level={3}>Live preview</Heading>
          <Stack direction="row" gap="md" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <SegmentedControl
              options={VARIANTS.map(({ value, label }) => ({ value, label }))}
              value={variant}
              onValueChange={(v) => setVariant(v as Variant)}
            />
            <label style={{ display: "flex", alignItems: "center", gap: "var(--rebar-space-xs)", fontSize: 14 }}>
              <input
                type="checkbox"
                checked={showRightPanel}
                onChange={(e) => setShowRightPanel(e.target.checked)}
                disabled={variant === "mobile"}
              />
              rightPanel
            </label>
          </Stack>
          <Box
            style={{
              height: 420,
              border: "1px solid var(--rebar-color-border)",
              overflow: "hidden",
            }}
          >
            <AppShell
              variant={variant}
              height="420px"
              sidebar={
                variant === "sidebar" || variant === "tablet" || variant === "top-nav-sidebar" || variant === "three-pane"
                  ? { items: SIDEBAR_ITEMS, header: <Heading level={3}>My App</Heading> }
                  : undefined
              }
              railSidebar={variant === "three-pane" ? { items: RAIL_ITEMS } : undefined}
              topNav={
                variant === "top-nav" || variant === "top-nav-sidebar" || variant === "mobile"
                  ? { items: TOP_NAV_ITEMS }
                  : undefined
              }
              tabBar={variant === "mobile" ? { items: TAB_BAR_ITEMS } : undefined}
              rightPanel={
                showRightPanel && variant !== "mobile"
                  ? { title: "Details", children: <Text size="sm">A real, non-modal SidePanel.</Text> }
                  : undefined
              }
            >
              {content}
            </AppShell>
          </Box>
        </Stack>
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
