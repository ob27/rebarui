"use client";

import type { CSSProperties } from "react";
import {
  AppShell,
  Avatar,
  Box,
  Breadcrumb,
  Button,
  CalendarIcon,
  Col,
  Container,
  Dialog,
  FolderIcon,
  Footer,
  Grid,
  Heading,
  HomeIcon,
  MobileTabBar,
  NavBar,
  NavIndex,
  Row,
  SectionNav,
  SettingsIcon,
  SidePanel,
  SidebarNav,
  SkipLink,
  Stack,
  Tag,
  TeamIcon,
  Text,
} from "rebar-ui";
import type { NavBarItem, SidebarNavEntry } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PHONE_TAB_ITEMS, TAB_BAR_STYLE } from "@/app/imitations/device-frame/TidelinePhone";
import { CREW, KPIS, PROJECTS, STATUS_TONE, TASKS, avatarOf, gbp, person, project } from "@/fixtures/tideline";
import { ex } from "./tierExamples.types";
import type { ExampleMap } from "./tierExamples.types";

const harbour = project("harbour");
const maya = person("maya");
const BOX: CSSProperties = { border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", "--rebar-color-bg-secondary": "var(--rebar-color-bg-raised)" } as CSSProperties;
const CARD: CSSProperties = { background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", border: "1px solid var(--rebar-color-border)", borderRadius: 14, padding: 12 };
const SURFACE: CSSProperties = { background: "var(--rebar-color-bg-primary)", border: "1px solid var(--rebar-color-border)", borderRadius: 8, padding: "var(--rebar-space-sm)" };

const Mark = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
    <path d="M7 20V6a3 3 0 0 1 6 0v3a3 3 0 0 1-3 3H7l6 8" fill="none" stroke="var(--rebar-color-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_ITEMS: SidebarNavEntry[] = [
  { label: "Today", href: "#today", icon: <HomeIcon />, badge: "3" },
  { label: "Projects", href: "#projects", icon: <FolderIcon />, active: true },
  { label: "Calendar", href: "#calendar", icon: <CalendarIcon /> },
  { label: "People", href: "#people", icon: <TeamIcon /> },
  { type: "heading", label: "Studio" },
  { label: "Settings", href: "#settings", icon: <SettingsIcon /> },
];

const TOP_ITEMS: NavBarItem[] = [
  { label: "Today", href: "#today" },
  { label: "Projects", href: "#projects" },
  { label: "Calendar", href: "#calendar" },
  { label: "People", href: "#people" },
];

const Swatch = ({ label }: { label: string }) => (
  <div style={{ background: "var(--rebar-color-tint-1)", borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
    <Text size="xs" color="secondary">
      {label}
    </Text>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div style={CARD}>
    <Text size="xs" color="secondary">
      {label}
    </Text>
    <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{value}</Text>
  </div>
);

const Band = ({ children }: { children: string }) => (
  <Box style={{ ...SURFACE, textAlign: "center" }}>
    <Text size="sm" color="secondary">
      {children}
    </Text>
  </Box>
);

const COMPARISON: Construct[] = [
  {
    type: "comparison",
    leftLabel: "Harbour rebrand: to do",
    leftBlocks: [{ type: "checklist", heading: "Launch checklist", items: ["Brand palette signed off", "Icon audit finished", "Homepage copy approved"] }],
    rightLabel: "Harbour rebrand: status",
    rightBlocks: [{ type: "callout", tone: "success", title: "On track for 24 Oct", subtitle: "84% complete, owner Maya Chen" }],
  },
];

const mega = (id: string) => {
  const p = PROJECTS.find((x) => x.id === id)!;
  return { label: p.name, description: `${p.kicker}, due ${p.due}`, href: `#${p.id}` };
};
const MEGA_MENU: Construct[] = [
  {
    type: "mega-menu",
    columns: [
      { heading: "Projects", items: [mega("harbour"), mega("mobile"), mega("signage")] },
      { heading: "Team", items: [{ label: "Maya Chen", href: "#maya" }, { label: "Jonas Weber", href: "#jonas" }, { label: "Priya Nair", href: "#priya" }] },
    ],
    footer: { label: "See all projects", href: "#projects" },
  },
];

const PAGE_INDEX_CONTENT: Construct[] = [
  { type: "doc-section", heading: "Summary", body: [{ kind: "text", text: `${harbour.summary} ${harbour.done}% complete, due ${harbour.due}.` }] },
  { type: "doc-section", heading: "Tasks", body: [{ kind: "list", items: ["Brand palette (done)", "Harbour homepage (in progress)", "Icon audit"] }] },
  { type: "doc-section", heading: "Team", body: [{ kind: "text", text: "Maya Chen owns it, with Priya Nair on the checklist." }] },
];
const PAGE_INDEX: Construct[] = [
  {
    type: "page-index",
    searchPlaceholder: "Jump to a section...",
    sections: [
      { id: "summary", label: "Summary" },
      { id: "tasks", label: "Tasks" },
      { id: "team", label: "Team" },
    ],
  },
];

const SITE_HEADER: Construct[] = [
  {
    type: "site-header",
    logo: { label: "Tideline", href: "#", iconPath: "M12 2 2 7l10 5 10-5-10-5Zm0 8-10 5 10 5 10-5-10-5Z" },
    items: [
      {
        label: "Projects",
        href: "#",
        megaMenu: {
          columns: [
            {
              heading: "Open",
              items: [
                { label: "Harbour rebrand", description: "Brand, due 24 Oct", href: "#" },
                { label: "Tideline mobile", description: "Product, due 7 Nov", href: "#" },
              ],
            },
          ],
          footer: { label: "See all projects", href: "#" },
        },
      },
      { label: "Calendar", href: "#" },
      { label: "Files", href: "#" },
    ],
    trailing: { kind: "avatar", name: "Maya Chen", href: "#", placeholder: true },
  },
];

const TABS: Construct[] = [
  {
    type: "tabs",
    tabs: [
      { label: "Team", blocks: [{ type: "callout", tone: "info", title: "Four people on Harbour rebrand", subtitle: "Maya Chen, Jonas Weber, Priya Nair, Leo Santos" }] },
      { label: "Checklist", blocks: [{ type: "checklist", items: ["Brand palette signed off", "Icon audit finished", "Homepage copy approved"] }] },
    ],
  },
];

const SECTIONS = [
  { id: "gal-sn-summary", label: "Summary", body: "Identity, site and launch kit." },
  { id: "gal-sn-tasks", label: "Tasks", body: "Four open, two done." },
  { id: "gal-sn-files", label: "Files", body: "Five files, 260 MB." },
];

const NAV_INDEX_ITEMS = [
  { label: "All crew", href: "#" },
  ...CREW.slice(0, 5).map((c) => ({ label: c.name, href: "#", category: "done" })),
  ...CREW.slice(10, 12).map((c) => ({ label: c.name, href: "#", category: "booked", status: "Booked" })),
];

export const ORDER_EXAMPLES: ExampleMap = {
  AppShell: ex(
    <div style={BOX}>
      <AppShell
        variant="sidebar"
        height="300px"
        sidebar={{ items: NAV_ITEMS, logo: { full: <Heading level={3}>Tideline</Heading>, compact: <Mark /> }, collapsed: true, hideCollapseToggle: true }}
      >
        <Stack gap="sm" style={{ padding: 16 }}>
          <Heading level={3}>{harbour.name}</Heading>
          <Text size="sm" color="secondary">
            {harbour.summary}
          </Text>
          <Stack direction="row" gap="sm" align="center">
            <Avatar size="sm" {...avatarOf(maya.id)} />
            <Text size="sm">{maya.name}</Text>
            <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
          </Stack>
        </Stack>
      </AppShell>
    </div>,
    { wide: true },
  ),
  Breadcrumb: ex(
    <Breadcrumb
      items={[
        { label: "Projects", href: "#projects" },
        { label: harbour.name, href: "#harbour" },
        { label: "Tasks" },
      ]}
    />,
  ),
  Comparison: ex(<NextBlockRenderer blocks={COMPARISON} />, { wide: true }),
  Container: ex(
    <Box style={{ background: "var(--rebar-color-bg-secondary)", borderRadius: 8 }}>
      <Container maxWidth="sm" padding="var(--rebar-space-sm)" verticalPadding="var(--rebar-space-md)">
        <Band>{'maxWidth="sm"'}</Band>
      </Container>
    </Box>,
  ),
  Footer: ex(
    <Box style={SURFACE}>
      <Footer
        label="No more projects"
        content={"© 2026 Tideline Studio"}
        links={[
          { text: "Terms", href: "#terms" },
          { text: "Privacy", href: "#privacy" },
        ]}
        chips={[{ text: "Beta" }, { text: "Send feedback", type: "link" }]}
      />
    </Box>,
  ),
  Grid: ex(
    <Grid minItemWidth={100} gap="sm">
      <Stat label="Tasks done" value="12 of 14" />
      <Stat label="Budget used" value={gbp(7640)} />
      <Stat label={KPIS[1]!.label} value={String(KPIS[1]!.value)} />
      <Stat label="Next review" value={`Fri ${harbour.due}`} />
    </Grid>,
  ),
  "Mega Menu": ex(<NextBlockRenderer blocks={MEGA_MENU} />, { wide: true }),
  MobileTabBar: ex(
    <div style={{ ...BOX, borderRadius: 12 }}>
      <MobileTabBar aria-label="Tideline" position="static" items={PHONE_TAB_ITEMS} defaultActiveIndex={1} style={TAB_BAR_STYLE} />
    </div>,
  ),
  Modal: ex(
    <Dialog
      trigger={<Button variant="destructive">Delete {project("signage").name}</Button>}
      title={`Delete ${project("signage").name}?`}
      footer={
        <>
          <Button variant="secondary">Keep it</Button>
          <Button variant="destructive">Delete</Button>
        </>
      }
    >
      <Text>21 tasks and 5 files go with it. This cannot be undone.</Text>
    </Dialog>,
  ),
  NavBar: ex(
    <div style={{ width: "100%" }}>
      <NavBar aria-label="Site" items={TOP_ITEMS} />
    </div>,
  ),
  NavIndex: ex(
    <Box style={{ ...SURFACE, padding: "var(--rebar-space-md)" }}>
      <NavIndex items={NAV_INDEX_ITEMS} categoryLabels={{ done: "Interviewed", booked: "Booked" }} style={{ position: "static", maxHeight: 240 }} />
    </Box>,
  ),
  "Page Index": ex(
    <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
      <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
        <NextBlockRenderer blocks={PAGE_INDEX_CONTENT} />
      </Stack>
      <NextBlockRenderer blocks={PAGE_INDEX} />
    </Stack>,
    { wide: true },
  ),
  Row: ex(
    <Stack gap="xs">
      <Row gutter="xs">
        <Col span={16}>
          <Swatch label="Col 16" />
        </Col>
        <Col span={8}>
          <Swatch label="Col 8" />
        </Col>
      </Row>
      <Row gutter="xs">
        <Col span={8}>
          <Swatch label="8" />
        </Col>
        <Col span={8}>
          <Swatch label="8" />
        </Col>
        <Col span={8}>
          <Swatch label="8" />
        </Col>
      </Row>
    </Stack>,
  ),
  SectionNav: ex(
    <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
      <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
        {SECTIONS.map((s) => (
          <Box key={s.id} id={s.id} style={{ minHeight: 70 }}>
            <Heading level={3}>{s.label}</Heading>
            <Text color="secondary">{s.body}</Text>
          </Box>
        ))}
      </Stack>
      <SectionNav sections={SECTIONS.map(({ id, label }) => ({ id, label }))} />
    </Stack>,
    { wide: true },
  ),
  SidebarNav: ex(
    <div style={{ ...BOX, display: "flex", height: 290 }}>
      <SidebarNav items={NAV_ITEMS} hideCollapseToggle style={{ height: "100%", width: "100%" }} />
    </div>,
  ),
  SidePanel: ex(
    <div style={{ ...BOX, display: "flex", height: 230 }}>
      <div style={{ flex: 1, minWidth: 0, padding: 16 }}>
        <Stack gap="xs">
          <Heading level={3}>{harbour.name}</Heading>
          <Text size="sm" color="secondary">
            Select a task to see its details on the right.
          </Text>
        </Stack>
      </div>
      <SidePanel title="Task" width={220} hideToggle>
        <Stack gap="sm">
          <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{TASKS[4]!.title}</Text>
          <Stack direction="row" gap="sm" align="center">
            <Avatar size="sm" {...avatarOf(TASKS[4]!.assignee)} />
            <Text size="sm">{person(TASKS[4]!.assignee).name}</Text>
          </Stack>
          <Tag tone="info">In progress</Tag>
        </Stack>
      </SidePanel>
    </div>,
    { wide: true },
  ),
  "Site Header": ex(
    <Box style={{ ...SURFACE, padding: "0 var(--rebar-space-sm)" }}>
      <NextBlockRenderer blocks={SITE_HEADER} />
    </Box>,
    { wide: true },
  ),
  SkipLink: ex(
    <Box style={{ position: "relative", border: "1px solid var(--rebar-color-border)", borderRadius: 8, minHeight: 72, overflow: "hidden" }}>
      <SkipLink targetId="gal-skip-link-target" style={{ transform: "none", clip: "auto", position: "absolute", top: 8, left: 8 }} />
      <Box id="gal-skip-link-target" />
    </Box>,
  ),
  Tabs: ex(<NextBlockRenderer blocks={TABS} />),
};
