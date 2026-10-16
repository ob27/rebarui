"use client";

import type { CSSProperties, ReactNode } from "react";
import { AvatarGroup, DeviceFrame, Heading, Input, NavBar, Stack, Tag, Text } from "rebar-ui";
import type { NavBarItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, avatarsOf, project } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<header className="site-header">
  <Wordmark />
  <NavBar aria-label="Site" items={[
    { label: "Today", href: "/today" },
    { label: "Projects", href: "/projects", megaMenu: { columns: [{ heading: "Open", items: projects }] } },
    { label: "Calendar", href: "/calendar" },
    { label: "People", href: "/people" },
  ]} />
  <Input size="sm" placeholder="Search" />
  <AvatarGroup size="sm" avatars={avatarsOf(["maya", "jonas"])} />
</header>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["NavBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Overflow",
    body: [{ kind: "text", text: 'The bar measures its own width and moves the links that no longer fit into a trailing "More" popover, instead of wrapping or clipping. An item with `megaMenu` opens a panel of grouped links instead of navigating.' }],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "A `<nav>` of real links (`renderLink` for a framework router); the overflow trigger and any mega menu are real buttons with a popover." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="navbar"`; `data-rebar-part="more"` on the overflow trigger.' }],
  },
];

const ITEMS: NavBarItem[] = [
  { label: "Today", href: "#today" },
  {
    label: "Projects",
    href: "#projects",
    megaMenu: {
      columns: [
        { heading: "Open", items: PROJECTS.filter((p) => p.status !== "Done").map((p) => ({ label: p.name, description: p.summary, href: `#${p.id}` })) },
        { heading: "Done", items: PROJECTS.filter((p) => p.status === "Done").map((p) => ({ label: p.name, description: p.summary, href: `#${p.id}` })) },
      ],
      footer: { label: "All projects", href: "#projects" },
    },
  },
  { label: "Calendar", href: "#calendar" },
  { label: "People", href: "#people" },
];
const MANY: NavBarItem[] = [...ITEMS.map((i) => ({ label: i.label, href: i.href })), { label: "Reports", href: "#reports" }, { label: project("rota").name, href: "#rota" }, { label: "Files", href: "#files" }, { label: "Settings", href: "#settings" }];
const SECTIONS: NavBarItem[] = ["Overview", "Tasks", "Files", "People", "Budget"].map((s) => ({ label: s, href: `#${s.toLowerCase()}` }));

const Wordmark = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--rebar-font-family-display)", fontVariationSettings: '"SOFT" 100', fontWeight: 600, fontSize: 19, whiteSpace: "nowrap" }}>
    <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 20V6a3 3 0 0 1 6 0v3a3 3 0 0 1-3 3H7l6 8" fill="none" stroke="var(--rebar-color-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Tideline
  </span>
);

const HEADER: CSSProperties = { display: "flex", alignItems: "center", gap: 18, padding: "10px 18px", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", border: "1px solid var(--rebar-color-border)", borderRadius: 999 };

function SiteHeader({ items, extras = true, style }: { items: NavBarItem[]; extras?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ ...HEADER, ...style }}>
      <Wordmark />
      <div style={{ flex: 1, minWidth: 0 }}>
        <NavBar aria-label="Site" items={items} />
      </div>
      {extras ? (
        <>
          <Input size="sm" placeholder="Search" aria-label="Search" style={{ width: 120 }} />
          <AvatarGroup size="sm" avatars={avatarsOf(["maya", "jonas"])} />
        </>
      ) : null}
    </div>
  );
}

function Shell({ children, width }: { children: ReactNode; width: number }) {
  return <div style={{ width, maxWidth: "100%" }}>{children}</div>;
}

export default function NavBarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>NavBar</Heading>
      <Text color="secondary">Top bar with brand, links, search and people.</Text>

      <DemoStage
        title="Site header"
        caption="Four links; Projects opens a menu; narrow it and the rest fold into More"
        code={CODE}
        states={[
          { label: "Overflow", node: <Shell width={230}><NavBar aria-label="Overflow" items={MANY} /></Shell> },
          { label: "Many links", node: <NavBar aria-label="Many links" items={MANY} /> },
          { label: "Custom more", node: <Shell width={190}><NavBar aria-label="Custom more label" items={MANY} moreLabel="Menu" /></Shell> },
          { label: "Sections", node: <NavBar aria-label="Project sections" items={SECTIONS} /> },
        ]}
      >
        <SiteHeader items={ITEMS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Desktop and phone" caption="The header on a browser window; project sections on a phone, folding into More" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" align="start" justify="center" style={{ flexWrap: "wrap" }}>
            <DeviceFrame variant="browser" title="tideline.app/projects" style={{ width: 270, "--rebar-device-frame-max-width": "270px" } as CSSProperties}>
              <div style={{ padding: 12, minHeight: 300, background: "var(--rebar-color-bg-primary)" }}>
                <Stack gap="md">
                  <SiteHeader items={ITEMS.slice(0, 3).map((i) => ({ label: i.label, href: i.href }))} extras={false} style={{ padding: "8px 14px", gap: 12 }} />
                  <Kicker>Projects</Kicker>
                  <PhoneList>
                    {PROJECTS.slice(0, 3).map((p) => (
                      <PhoneRow key={p.id} thumb={false} title={p.name} meta={<Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>} trailing={null} />
                    ))}
                  </PhoneList>
                </Stack>
              </div>
            </DeviceFrame>
            <TidelinePhone title={project("harbour").name} tabs={1} height={400} padding={0}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--rebar-color-border)", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" }}>
                <NavBar aria-label="Project sections" items={SECTIONS} />
              </div>
              <div style={{ padding: 14 }}>
                <PhoneList>
                  <PhoneRow title="Harbour homepage" meta="Maya · Design" tint={1} />
                  <PhoneRow title="Icon audit" meta="Maya · Design" tint={3} />
                </PhoneList>
              </div>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
