"use client";

import Link from "next/link";
import { useState } from "react";
import { GenesisBanners } from "@/components/GenesisBanners";
import { AvatarGroup, Button, Card, Combobox, Input, Kanban, Sparkline, Tag } from "rebar-ui";
import type { KanbanCard, KanbanColumn, KanbanState } from "rebar-ui";
import { CONSTRUCT_TIER } from "@/data/constructTier";

// The counts come from the registry, so the page can never drift from the catalogue.
const tierCount = (tier: string) => Object.values(CONSTRUCT_TIER.component).filter((t) => t === tier).length;
const TOTAL = Object.keys(CONSTRUCT_TIER.component).length;

// Shared sample world ("Tideline", a small studio's project app) used by every demo on the site.
const PEOPLE = [
  { alt: "Maya Chen", fallback: "MC", placeholder: 1 },
  { alt: "Jonas Weber", fallback: "JW", placeholder: 2 },
  { alt: "Priya Nair", fallback: "PN", placeholder: 3 },
];
const KANBAN_CARDS: Record<string, KanbanCard> = {
  sync: { id: "sync", title: "Offline sync for tasks", tags: ["Eng"] },
  palette: { id: "palette", title: "Brand palette", tags: ["Design"] },
  home: { id: "home", title: "Harbour homepage", tags: ["Design"] },
};
const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "doing", title: "In progress", sections: [{ id: "doing-main", cardIds: ["sync", "home"] }] },
  { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["palette"] }] },
];
const COMBO = ["Maya Chen", "Jonas Weber", "Priya Nair", "Leo Santos"].map((v) => ({ value: v, label: v }));
const WEEKLY = [14, 19, 16, 22, 20, 25, 23, 28, 25, 31, 29, 33];

function Collage() {
  const [board, setBoard] = useState<KanbanState>({ columns: KANBAN_COLUMNS, cards: KANBAN_CARDS });
  return (
    <div className="cs-collage" aria-label="Live constructs">
      <div className="cs-collage-card">
        <span className="cs-kicker">Combobox</span>
        <Combobox options={COMBO} placeholder="Assign to" aria-label="Assign a teammate" onValueChange={() => undefined} />
      </div>
      <div className="cs-collage-card cs-collage-stat">
        <div>
          <span className="cs-kicker">Sparkline</span>
          <div className="cs-big">33 done</div>
        </div>
        <Sparkline values={WEEKLY} ariaLabel="Tasks completed per week, rising from 14 to 33" height={48} />
      </div>
      <div className="cs-collage-card cs-wide cs-collage-kanban">
        <span className="cs-kicker">Kanban</span>
        <Kanban columns={board.columns} cards={board.cards} onChange={setBoard} />
      </div>
    </div>
  );
}

const TIERS = [
  { id: "imitation", n: "01", name: "Imitation", href: "/imitations", note: "Familiar parts.", count: tierCount("imitation") },
  { id: "synthetic", n: "02", name: "Synthetic", href: "/synthetics", note: "Parts combined.", count: tierCount("synthetic") },
  { id: "opinion", n: "03", name: "Opinion", href: "/opinions", note: "Our own take.", count: tierCount("opinion") },
  { id: "order", n: "04", name: "Order", href: "/orders", note: "Whole layouts.", count: tierCount("order") },
  { id: "genesis", n: "05", name: "Genesis", href: "/geneses", note: "Finished apps.", count: 1 },
];

function TierPreview({ id }: { id: string }) {
  switch (id) {
    case "imitation":
      return (
        <>
          <Button size="sm">Button</Button>
          <Input size="sm" placeholder="Input" aria-label="Input" readOnly />
        </>
      );
    case "synthetic":
      return (
        <Card title="Card">
          <AvatarGroup avatars={PEOPLE} size="sm" />
        </Card>
      );
    case "opinion":
      return <Card title="Kanban" />;
    case "order":
      return <div className="cs-pv-bar">AppShell</div>;
    default:
      return <Tag>AI Hive</Tag>;
  }
}

export function HomePage() {
  return (
    <main className="cs-wrap">
      <section className="cs-hero cs-grain">
        <div>
          <span className="cs-kicker">{TOTAL} constructs</span>
          <h1 className="cs-h1">Rebar UI</h1>
          <p className="cs-tl">Five tiers, one look.</p>
          <div className="cs-cta">
            <Link className="cs-btn cs-btn--lg" href="/opinions">Browse constructs</Link>
            <Link className="cs-btn cs-btn--secondary cs-btn--lg" href="/geneses">Geneses</Link>
          </div>
        </div>
        <Collage />
      </section>

      <nav className="cs-tiers" aria-label="Tiers">
        {TIERS.map((t) => (
          <Link key={t.id} className={`cs-tier cs-tier--${t.id}`} href={t.href}>
            <div>
              <span className="cs-n">{t.n}</span>
              <h2 className="cs-h3">{t.name}</h2>
              <p>{t.note}</p>
            </div>
            <div className="cs-pv" aria-hidden="true">
              <TierPreview id={t.id} />
            </div>
          </Link>
        ))}
      </nav>

      <div className="cs-sec-h">
        <h2 className="cs-h2">Geneses</h2>
        <Link className="cs-btn cs-btn--secondary cs-btn--sm" href="/geneses">All geneses</Link>
      </div>
      <GenesisBanners />
    </main>
  );
}
