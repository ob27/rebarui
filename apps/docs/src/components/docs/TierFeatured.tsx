"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Alert, Avatar, AvatarGroup, Breadcrumb, Button, Card, Checkbox, Combobox, Input, Kanban, MobileTabBar, Sparkline, Steps, Switch, Table, Tag } from "rebar-ui";
import type { KanbanState } from "rebar-ui";
import type { Tier } from "@/data/tier.types";
import { PEOPLE_OPTIONS, PROJECTS, STATUS_TONE, WEEKLY_DONE, avatarOf, avatarsOf, gbp, kanbanBoard, project } from "@/fixtures/tideline";

interface Featured {
  name: string;
  href: string;
  node: ReactNode;
}

function KanbanPreview() {
  const [board, setBoard] = useState<KanbanState>(kanbanBoard);
  return <Kanban columns={board.columns.slice(1)} cards={board.cards} onChange={setBoard} />;
}

function SwitchPreview() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <Switch aria-label="Notify the crew" checked={on} onCheckedChange={setOn} />
      <Checkbox defaultChecked>Due this week</Checkbox>
      <Tag tone="success">On track</Tag>
    </div>
  );
}

const harbour = project("harbour");

/** Three live constructs that stand for each tier at the top of its index page: the real thing, with Tideline data, not a tile. */
const FEATURED: Record<Tier, Featured[]> = {
  imitation: [
    {
      name: "Button",
      href: "/imitations/button",
      node: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button>Save changes</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      ),
    },
    { name: "Input", href: "/imitations/input", node: <Input placeholder="Search projects" aria-label="Search projects" /> },
    { name: "Switch", href: "/imitations/switch", node: <SwitchPreview /> },
  ],
  synthetic: [
    {
      name: "Card",
      href: "/synthetics/card",
      node: (
        <Card title={harbour.name} subtitle={harbour.summary} extra={<Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>}>
          <AvatarGroup avatars={avatarsOf(["maya", "jonas", "priya"])} size="sm" />
        </Card>
      ),
    },
    { name: "Alert", href: "/synthetics/alert", node: <Alert type="info" title="Launch is Friday 24 Oct">9 of 14 tasks done.</Alert> },
    {
      name: "Steps",
      href: "/synthetics/steps",
      node: <Steps current={1} items={[{ title: "Brief" }, { title: "Design" }, { title: "Build" }, { title: "Launch" }]} />,
    },
  ],
  opinion: [
    { name: "Kanban", href: "/opinions/kanban", node: <KanbanPreview /> },
    { name: "Combobox", href: "/opinions/combobox", node: <Combobox options={PEOPLE_OPTIONS} placeholder="Assign to" aria-label="Assign a teammate" onValueChange={() => undefined} /> },
    {
      name: "Table",
      href: "/opinions/table",
      node: (
        <Table
          rowKey="id"
          columns={[
            { key: "name", header: "Project" },
            { key: "status", header: "Status" },
            { key: "budget", header: "Budget", align: "right" },
          ]}
          data={PROJECTS.slice(0, 3).map((p) => ({ id: p.id, name: p.name, status: p.status, budget: gbp(p.budget) }))}
        />
      ),
    },
  ],
  order: [
    {
      name: "Breadcrumb",
      href: "/orders/breadcrumb",
      node: <Breadcrumb items={[{ label: "Projects", href: "#" }, { label: "Harbour rebrand", href: "#" }, { label: "Board" }]} />,
    },
    {
      name: "MobileTabBar",
      href: "/orders/mobile-tab-bar",
      node: <MobileTabBar aria-label="Tideline" items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={1} />,
    },
    {
      name: "AppShell",
      href: "/orders/app-shell",
      node: (
        <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, minHeight: 96 }}>
          <div style={{ background: "var(--rebar-color-bg-inverse)", borderRadius: 10 }} />
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <div style={{ height: 14, width: "60%", borderRadius: 6, background: "var(--rebar-color-tint-3)" }} />
            <Sparkline values={WEEKLY_DONE} ariaLabel="Tasks completed per week" height={48} />
          </div>
        </div>
      ),
    },
  ],
  genesis: [
    {
      name: "AI Hive",
      href: "/geneses",
      node: (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Avatar {...avatarOf("maya")} />
          <Tag>Genesis</Tag>
        </div>
      ),
    },
  ],
};

export function TierFeatured({ tier }: { tier: Tier }) {
  const items = FEATURED[tier];
  if (!items?.length) return null;
  return (
    <div className="cs-featured" aria-label="Featured constructs">
      {items.map((f) => (
        <div key={f.name} className="cs-featured-card">
          <div className="cs-featured-head">
            <span className="cs-kicker">{f.name}</span>
            <Link href={f.href}>Docs</Link>
          </div>
          <div className="cs-featured-body">{f.node}</div>
        </div>
      ))}
    </div>
  );
}
