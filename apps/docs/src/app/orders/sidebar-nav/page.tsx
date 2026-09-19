"use client";

import { useState } from "react";
import {
  Box,
  CalendarIcon,
  ChatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DashboardIcon,
  ErrorWarningIcon,
  FolderIcon,
  Heading,
  HomeIcon,
  LineChartIcon,
  QuestionIcon,
  SettingsIcon,
  SidebarNav,
  Stack,
  TaskIcon,
  TeamIcon,
  Text,
} from "rebar-ui";
import type { SidebarNavEntry, SidebarNavItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "#dashboard", icon: <HomeIcon />, active: true },
  { label: "Projects", href: "#projects", icon: <FolderIcon /> },
  {
    label: "Settings",
    icon: <SettingsIcon />,
    items: [
      { label: "Profile", href: "#profile" },
      { label: "Billing", href: "#billing" },
      { label: "Team members", href: "#team" },
    ],
  },
  { label: "Help", href: "#help", icon: <QuestionIcon /> },
];

const APP_SHELL_ITEMS: SidebarNavEntry[] = [
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

const GRID_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "#dashboard", icon: <DashboardIcon />, active: true },
  { label: "Teams", href: "#teams", icon: <TeamIcon /> },
  { label: "Payments", href: "#payments", icon: <CreditCardIcon /> },
  { label: "Attendance", href: "#attendance", icon: <CalendarIcon /> },
  { label: "Task", href: "#task", icon: <TaskIcon /> },
  { label: "Settings", href: "#settings", icon: <SettingsIcon /> },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<SidebarNav logo={{ full: <Wordmark />, compact: <Icon /> }} items={[{ label: "Dashboard", href: "/dashboard", icon: <HomeIcon />, active: true }, { label: "Settings", icon: <SettingsIcon />, items: [{ label: "Profile", href: "/settings/profile" }] }]} />',
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
    heading: "App-shell slots: logo, header, workspace, search, panel, footer",
    body: [
      {
        kind: "text",
        text: "Real dashboard sidebars are rarely just a bare item list — a logo up top, an account/workspace switcher, a search box, a promo or quota widget, a profile row at the bottom. Six pieces cover this without inventing a prescribed sub-component for each: `logo` (a brand mark that natively swaps between a wide `full` asset and a square `compact` one as the rail collapses — see below), `header` (anything else above the list — a tagline, a secondary brand element), `workspace` (a ready-made switcher row — icon/avatar, label, optional description, a trailing switch affordance), `search` (built-in, self-filtering — filters `items` by label as the user types, recursing into nested children and auto-expanding a group with a match), `panel` (anything between the list and the footer — a promo card, a storage/quota widget), and `footer` (an account row, a logout button). `header`/`panel`/`footer` accept a plain node or a function of `{ collapsed }` for the same kind of collapse-aware swap `logo` gives natively.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "A brand mark that swaps itself: logo",
    body: [
      {
        kind: "text",
        text: '`logo={{ full, compact }}` renders `full` (typically a wide wordmark/logo image) while expanded and `compact` (typically a square 1:1 icon mark) while collapsed, switching automatically with the sidebar\'s own collapsed state — no hand-written `collapsed ? ... : ...` ternary required. Pass real `<img>`s (a wide logo file and a square icon file) or inline SVG/React content for either side; each renders as-is, sized to fit the sidebar\'s own width via `max-width: 100%`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Flat sections without nesting: heading and divider entries",
    body: [
      {
        kind: "text",
        text: 'Alongside a real `SidebarNavItem`, `items` accepts two plain entry kinds: `{ type: "heading", label }` — a non-interactive section label (e.g. "SHORTCUTS") that splits flat items without turning them into a collapsible group — and `{ type: "divider" }`, a bare visual rule. Neither has a destination or anything that collapses under it, unlike an `items`-bearing `SidebarNavItem`, which is for a real collapsible group. A heading hides while collapsed (nothing to show); a divider still renders as a bare rule.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Layout variants: labelPlacement and variant=\"grid\"",
    body: [
      {
        kind: "text",
        text: '`labelPlacement="below"` stacks the icon above a small label underneath it — a third density tier between a full label and icon-only, common at a narrower "tablet" sidebar width. `variant="grid"` renders a 2-column grid of icon-over-label tiles instead of a vertical list — the dashboard-tile pattern. Both fall back to a single icon-only column while collapsed, regardless of setting.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Active-item style: activeStyle",
    body: [
      {
        kind: "text",
        text: '`activeStyle` picks how the current item is marked: `"tint"` (default) is a soft background wash plus colored text; `"bar"` adds a solid accent bar on the leading edge; `"fill"` is a solid, fully-filled background with inverted text — the boldest option. All three ship as real CSS, not a "bring your own override."',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Collapse toggle placement: collapseTogglePlacement",
    body: [
      {
        kind: "text",
        text: '`collapseTogglePlacement="edge"` anchors a small circular toggle to the sidebar\'s own right border, vertically centered, instead of the default full-width inline row at the bottom of the list — the floating-chevron pattern some dashboard sidebars use. `"edge-hover"` is the same button in the same spot, transparent until the sidebar is hovered or the button itself gets keyboard focus — the VS Code/Notion reveal-on-hover pattern. Two more placements below are composed, not props: a controlled `collapsed` state with a real toggle button placed in the `header` slot, and a native CSS `resize: horizontal` handle for continuously resizing the sidebar\'s own width rather than a binary collapsed/expanded toggle at all.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="sidebar-nav"`, `data-rebar-collapsed` when collapsed; parts: `logo`, `header`, `workspace`, `search`, `list`, `heading`, `divider`, `item`, `sublist`, `subitem`, `badge`, `panel`, `footer`, `collapse-toggle`.',
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
  const [headerToggleCollapsed, setHeaderToggleCollapsed] = useState(false);

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

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          Every app-shell slot at once: <code>header</code>, <code>workspace</code>,{" "}
          <code>search</code>, a <code>heading</code>/<code>divider</code>/<code>badge</code> mix,{" "}
          <code>panel</code>, and <code>footer</code>.
        </Text>
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            height: 560,
            overflow: "hidden",
          }}
        >
          <SidebarNav
            items={APP_SHELL_ITEMS}
            logo={{ full: <strong>Sport Live</strong>, compact: <DashboardIcon /> }}
            workspace={{ label: "Saleshouse", description: "general team", icon: <TeamIcon /> }}
            search={{ placeholder: "Search" }}
            panel={({ collapsed: c }) =>
              c ? null : (
                <div>
                  <strong style={{ fontSize: "var(--rebar-font-size-sm, 14px)" }}>Used space</strong>
                  <div style={{ fontSize: "var(--rebar-font-size-xs, 12px)", color: "var(--rebar-color-text-secondary, #757575)" }}>
                    71% of quota
                  </div>
                </div>
              )
            }
            footer={({ collapsed: c }) => (c ? "JW" : "Jerry Wilson")}
          />
        </Box>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>labelPlacement=&quot;below&quot;</code> (left) vs. <code>variant=&quot;grid&quot;</code> (right).
        </Text>
        <Stack direction="row" gap="md">
          <Box style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 4, height: 340, overflow: "hidden" }}>
            <SidebarNav items={GRID_ITEMS} labelPlacement="below" hideCollapseToggle />
          </Box>
          <Box style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 4, height: 340, overflow: "hidden" }}>
            <SidebarNav items={GRID_ITEMS} variant="grid" hideCollapseToggle />
          </Box>
        </Stack>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>activeStyle</code>: &quot;tint&quot; (default), &quot;bar&quot;, &quot;fill&quot;.
        </Text>
        <Stack direction="row" gap="md">
          {(["tint", "bar", "fill"] as const).map((style) => (
            <Box
              key={style}
              style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 4, height: 220, overflow: "hidden" }}
            >
              <SidebarNav items={ITEMS.slice(0, 3)} activeStyle={style} hideCollapseToggle />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack gap="md">
        <Text size="sm" color="secondary">
          Four ways to expose the collapse control — the first two are the built-in{" "}
          <code>collapseTogglePlacement</code> values; the last two are composed on top of{" "}
          <code>SidebarNav</code>, not props it accepts itself.
        </Text>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap" }}>
          <Stack gap="xs">
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              collapseTogglePlacement=&quot;edge&quot;
            </Text>
            <Text size="xs" color="secondary" style={{ maxWidth: 200 }}>
              A small circular toggle on the sidebar&apos;s own border, always visible.
            </Text>
            <Box
              style={{
                border: "1px solid var(--rebar-color-border, #e0e0e0)",
                borderRadius: 4,
                height: 300,
                overflow: "visible",
                paddingRight: 20,
              }}
            >
              <SidebarNav items={ITEMS.slice(0, 3)} collapseTogglePlacement="edge" />
            </Box>
          </Stack>

          <Stack gap="xs">
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              collapseTogglePlacement=&quot;edge-hover&quot;
            </Text>
            <Text size="xs" color="secondary" style={{ maxWidth: 200 }}>
              Same button, transparent until the sidebar is hovered or the button gets keyboard
              focus. Hover the box to see it.
            </Text>
            <Box
              style={{
                border: "1px solid var(--rebar-color-border, #e0e0e0)",
                borderRadius: 4,
                height: 300,
                overflow: "visible",
                paddingRight: 20,
              }}
            >
              <SidebarNav items={ITEMS.slice(0, 3)} collapseTogglePlacement="edge-hover" />
            </Box>
          </Stack>

          <Stack gap="xs">
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              Composed: integrated into the header
            </Text>
            <Text size="xs" color="secondary" style={{ maxWidth: 200 }}>
              Not a prop — control <code>collapsed</code> yourself and put a real toggle button in
              the <code>header</code> slot instead of the built-in one.
            </Text>
            <Box style={{ border: "1px solid var(--rebar-color-border, #e0e0e0)", borderRadius: 4, height: 300, overflow: "hidden" }}>
              <SidebarNav
                items={ITEMS.slice(0, 3)}
                collapsed={headerToggleCollapsed}
                hideCollapseToggle
                header={({ collapsed: c }) => (
                  <Stack direction="row" align="center" justify={c ? "center" : "between"}>
                    {c ? null : (
                      <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                        My App
                      </Text>
                    )}
                    <button
                      type="button"
                      aria-label={c ? "Expand sidebar" : "Collapse sidebar"}
                      onClick={() => setHeaderToggleCollapsed((v) => !v)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        padding: 0,
                        border: "1px solid var(--rebar-color-border)",
                        borderRadius: "var(--rebar-radius, 4px)",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      {c ? <ChevronRightIcon aria-hidden="true" /> : <ChevronLeftIcon aria-hidden="true" />}
                    </button>
                  </Stack>
                )}
              />
            </Box>
          </Stack>

          <Stack gap="xs">
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              Composed: drag to resize
            </Text>
            <Text size="xs" color="secondary" style={{ maxWidth: 200 }}>
              Also not a prop — a native CSS <code>resize: horizontal</code> wrapper. Drag the
              bottom-right corner.
            </Text>
            <Box
              style={{
                height: 300,
                width: 220,
                minWidth: 64,
                maxWidth: 320,
                border: "1px solid var(--rebar-color-border, #e0e0e0)",
                borderRadius: 4,
                resize: "horizontal",
                overflow: "auto",
              }}
            >
              <SidebarNav items={ITEMS.slice(0, 3)} hideCollapseToggle style={{ width: "100%", height: "100%" }} />
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
