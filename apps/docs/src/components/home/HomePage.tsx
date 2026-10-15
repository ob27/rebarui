"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeBlock, Combobox, DataGrid, DeviceFrame, FloatCard, Kanban, Puppet, SchematicHeatmap, ScrollRail, SignaturePad } from "rebar-ui";
import type { HeatmapBrush, HeatmapRegion, HeatmapValue, KanbanCard, KanbanColumn, KanbanState } from "rebar-ui";
import { ConStage } from "@/components/mascot/ConStage";
import { CONSTRUCT_TIER } from "@/data/constructTier";
import { CON, CON_CANVAS } from "@/data/conLayers";

// The counts come from the registry, so the page can never drift from the catalogue.
const tierCount = (tier: string) => Object.values(CONSTRUCT_TIER.component).filter((t) => t === tier).length;
const TOTAL = Object.keys(CONSTRUCT_TIER.component).length;
const BLOCK_TOTAL = Object.keys(CONSTRUCT_TIER.block).length;

const TIERS = [
  { id: "imitation", name: "Imitations", href: "/imitations", note: "Static primitives: a button, a badge, an input.", eg: ["Button", "Badge", "Input"], count: tierCount("imitation") },
  { id: "synthetic", name: "Synthetics", href: "/synthetics", note: "Fixed compositions of imitations: a card, an alert, a chat thread.", eg: ["Card", "Alert", "ChatThread"], count: tierCount("synthetic") },
  { id: "opinion", name: "Opinions", href: "/opinions", note: "Real internal state: a Kanban, a combobox, a data grid.", eg: ["Kanban", "DataGrid", "Combobox"], count: tierCount("opinion") },
  { id: "order", name: "Orders", href: "/orders", note: "Page-level structure: app shell, nav bar, grid.", eg: ["AppShell", "NavBar", "Grid"], count: tierCount("order") },
  { id: "genesis", name: "Geneses", href: "/geneses", note: "A whole app built 100% with Rebar UI.", eg: ["AI Hive"], count: 1 },
];

// ---- the live rail: real constructs with small made-up data ----
const KANBAN_CARDS: Record<string, KanbanCard> = {
  spec: { id: "spec", title: "Write spec", tags: ["docs"] },
  ui: { id: "ui", title: "Build the board" },
  bug: { id: "bug", title: "Fix Firefox drag", tags: ["bug"] },
  ship: { id: "ship", title: "Ship it" },
};
const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To do", sections: [{ id: "todo-main", cardIds: ["spec", "ui"] }] },
  { id: "doing", title: "Doing", sections: [{ id: "doing-main", cardIds: ["bug"] }] },
  { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["ship"] }] },
];
const BRUSHES: HeatmapBrush[] = [
  { id: "building", label: "Building", color: "#0066cc" },
  { id: "outdoor", label: "Outdoor", color: "#2e7d32", showLabel: true },
  { id: "service", label: "Service", color: "#757575", showLabel: false },
];
const REGIONS: HeatmapRegion[] = [
  { id: "north-block", kind: "building", label: "North Block", rects: [[0, 0, 220, 90]] },
  { id: "east-hall", kind: "building", label: "East Hall", rects: [[230, 0, 380, 90], [290, 90, 380, 190]] },
  { id: "library", kind: "building", label: "Library", rects: [[0, 100, 120, 190]] },
  { id: "car-park", kind: "outdoor", label: "Car park", rects: [[0, 200, 280, 260]] },
  { id: "plant-room", kind: "service", label: "Plant", rects: [[290, 200, 380, 260]] },
];
const VALUES: Record<string, HeatmapValue> = {
  "north-block": { done: 182, expected: 200 },
  "east-hall": { done: 96, expected: 210 },
  library: { done: 12, expected: 140 },
  "car-park": { done: 40, expected: 40 },
};
const COMBO = ["Tabs", "Table", "TagInput", "TextToSpeechBar", "ThemeToggle", "TimePicker", "Toast", "Tooltip", "Tour", "Transfer"].map((v) => ({ value: v, label: v }));
const GRID = [
  { id: "1", occupation: "Plumbers", median: "$95k", share: "12.4%" },
  { id: "2", occupation: "Nurses", median: "$88k", share: "9.1%" },
  { id: "3", occupation: "Accountants", median: "$91k", share: "7.7%" },
  { id: "4", occupation: "Electricians", median: "$97k", share: "6.2%" },
];

function Win({ name, href, children }: { name: string; href: string; children: React.ReactNode }) {
  return (
    <div className="cs-win">
      <div className="cs-win-bar">
        <span>{name}</span>
        <span className="cs-live">live</span>
      </div>
      <div className="cs-win-body">{children}</div>
      <div className="cs-win-foot">
        <span className="cs-tag cs-tag--opinion">Opinion</span>
        <Link href={href}>Docs &rarr;</Link>
      </div>
    </div>
  );
}

function LiveRail() {
  const [board, setBoard] = useState<KanbanState>({ columns: KANBAN_COLUMNS, cards: KANBAN_CARDS });
  const [selected, setSelected] = useState<string | null>("east-hall");
  return (
    <ScrollRail aria-label="Live Rebar UI constructs" gap="lg" style={{ ["--rebar-scroll-rail-item-width" as string]: "min(380px, 82vw)" }}>
      <Win name="Kanban" href="/opinions/kanban">
        <Kanban columns={board.columns} cards={board.cards} onChange={setBoard} />
      </Win>
      <Win name="SignaturePad" href="/opinions/signature-pad">
        <SignaturePad onValueChange={() => undefined} aria-label="Sign here" />
      </Win>
      <Win name="Combobox" href="/opinions/combobox">
        <Combobox options={COMBO} onValueChange={() => undefined} aria-label="Find a construct" />
      </Win>
      <Win name="SchematicHeatmap" href="/opinions/schematic-heatmap">
        <SchematicHeatmap ariaLabel="Handover progress by zone, fictional campus" regions={REGIONS} brushes={BRUSHES} values={VALUES} crop={[-10, -10, 400, 270]} selectedId={selected} onSelect={setSelected} />
      </Win>
      <Win name="DataGrid" href="/opinions/data-grid">
        <DataGrid
          columns={[{ key: "occupation", header: "Occupation" }, { key: "median", header: "Median" }, { key: "share", header: "Share" }]}
          data={GRID}
          rowKey="id"
        />
      </Win>
    </ScrollRail>
  );
}

export function HomePage() {
  return (
    <main>
      <section className="cs-hero">
        <div className="cs-floor" />
        <div className="cs-wrap">
          <div className="cs-hero-copy">
            <div className="cs-kicker">Open Beta &middot; v0.12.1 &middot; MIT</div>
            <h1 className="cs-h1">Rebar UI</h1>
            <div className="cs-note">
              Headless-first, intentionally low-fidelity React components, classified by tier so an agent reaches for a component that already does the job &mdash;{" "}
              <strong>a full Kanban board, a signature pad, a combobox</strong> &mdash; instead of rebuilding it from primitives.
            </div>
            <div className="cs-cta">
              <Link className="cs-btn" href="/about/agent">Agent Context &rarr;</Link>
              <Link className="cs-btn cs-btn--ink" href="/heuristics">Design Heuristics</Link>
            </div>
            <div className="cs-clone"><b>$</b> git clone https://github.com/ob27/rebarui</div>
          </div>
          <ConStage>
            <FloatCard className="cs-float cs-float--yellow" label="components" style={{ right: "-2%", top: 236, ["--cs-rot" as string]: "3deg" }}><b>{TOTAL}</b></FloatCard>
            <FloatCard className="cs-float cs-float--pink" label="blocks" style={{ left: "-4%", bottom: 250, ["--cs-rot" as string]: "-4deg" }}><b>{BLOCK_TOTAL}</b></FloatCard>
            <FloatCard className="cs-float cs-float--concrete" label="tiers" style={{ right: "-2%", bottom: 170, ["--cs-rot" as string]: "2deg" }}><b>5</b></FloatCard>
          </ConStage>
        </div>
      </section>
      <div className="cs-rods" aria-hidden="true" />

      <section className="cs-sec">
        <div className="cs-wrap">
          <div className="cs-sec-head">
            <div className="cs-kicker cs-kicker--accent">The Construct Library</div>
            <h2 className="cs-h2">Pick the <span className="cs-hl">highest tier</span> that already does the job</h2>
            <p>Reaching for a complete construct beats assembling one from primitives. That is the whole idea, and the numbers below are what it saves.</p>
          </div>
          <div className="cs-stairs">
            {TIERS.map((t) => (
              <Link key={t.id} className="cs-step" href={t.href}>
                <span className={`cs-tag cs-tag--${t.id}`}>{t.id}</span>
                <span className="cs-step-count">{t.count}</span>
                <h3 className="cs-h3">{t.name}</h3>
                <p>{t.note}</p>
                <span className="cs-eg">{t.eg.map((e) => <span key={e}>{e}</span>)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-sec cs-sec--tight">
        <div className="cs-wrap">
          <div className="cs-sec-head">
            <div className="cs-kicker cs-kicker--accent">Built with itself</div>
            <h2 className="cs-h2">Real constructs, not screenshots</h2>
            <p>Every window below is a live Rebar UI construct, the same ones this site is built from. Drag a card, sign, search, pick a region.</p>
          </div>
          <LiveRail />
        </div>
      </section>

      <section className="cs-sec cs-sec--tight">
        <div className="cs-wrap">
          <div className="cs-sec-head">
            <div className="cs-kicker cs-kicker--accent">Measured, not asserted</div>
            <h2 className="cs-h2">The numbers behind that claim</h2>
          </div>
          <div className="cs-stats">
            <div className="cs-stat"><div className="cs-stat-big">3&ndash;5%</div><p>cheaper than hand-authored AntD in token cost (Claude)</p></div>
            <div className="cs-stat"><div className="cs-stat-big">25&ndash;75%</div><p>cheaper than hand-authored AntD (Qwen / Kimi)</p></div>
            <div className="cs-stat"><div className="cs-stat-big">13&ndash;17</div><p>revision rounds before migrating away stops paying off</p></div>
          </div>
          <div className="cs-two">
            <Link className="cs-card cs-card--concrete" href="/heuristics">
              <div className="cs-num">47</div>
              <h3 className="cs-h3">Design Heuristics</h3>
              <p>Spacing, type scale, color and interaction defaults, cited to Nielsen, Shneiderman, Material, Carbon and USWDS.</p>
              <strong>Read the heuristics &rarr;</strong>
            </Link>
            <Link className="cs-card cs-card--pink" href="/about/agent">
              <div className="cs-num">agent.md</div>
              <h3 className="cs-h3">For Agents</h3>
              <p>The compressed, agent-facing digest of every tier, block and heuristic, so a model reaches for the right construct.</p>
              <strong>Open the agent context &rarr;</strong>
            </Link>
          </div>
        </div>
      </section>

      <section className="cs-sec cs-sec--tight">
        <div className="cs-wrap">
          <div className="cs-showcase">
            <div className="cs-showcase-copy">
              <div className="cs-kicker cs-kicker--accent">First genesis</div>
              <h2 className="cs-h2">AI Hive</h2>
              <p className="cs-muted" style={{ fontSize: 19, margin: 0 }}>
                A wall of AI agents and services, each tile showing who it is, where it is working, its status and what it is doing now. The screen is a React app built 100% with Rebar UI, and the whole project is open source.
              </p>
              <div className="cs-cta">
                <Link className="cs-btn" style={{ background: "var(--rebar-color-primary)", color: "var(--rebar-color-primary-text)" }} href="/geneses">Meet the Geneses &rarr;</Link>
                <a className="cs-btn" href="https://github.com/ob27/ai-hive">github.com/ob27/ai-hive</a>
              </div>
            </div>
            <DeviceFrame variant="browser" title="AI Hive · demo mode">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="rebar-theme-image-light" src="/geneses/ai-hive/wall-light.png" alt="The AI Hive wall in light mode: agent and service tiles with a chat panel" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="rebar-theme-image-dark" style={{ display: "none" }} src="/geneses/ai-hive/wall-dark.png" alt="The AI Hive wall in dark mode" />
            </DeviceFrame>
          </div>
        </div>
      </section>

      <section className="cs-band">
        <div className="cs-wrap">
          <div style={{ display: "grid", gap: 24 }}>
            <h2 className="cs-h2">Get started</h2>
            <div className="cs-note">
              <p>Rebar UI is not on npm yet: build it from a checkout and link it, then import the stylesheet and a theme.</p>
              <CodeBlock
                language="bash"
                code={`git clone https://github.com/ob27/rebarui ../rebarui\n(cd ../rebarui && pnpm install && pnpm --filter rebar-ui build)\n\nimport "rebar-ui/style.css";\nimport "@rebar-ui/theme-con/theme.css";`}
              />
            </div>
            <div className="cs-cta">
              <Link className="cs-btn" href="/about">Read the docs</Link>
              <Link className="cs-btn cs-btn--ink" href="/opinions">Browse the tiers</Link>
            </div>
          </div>
          <div className="cs-peek" aria-hidden="true">
            <Puppet layers={CON} canvas={CON_CANVAS} size={300} weight="heavy" phase={-0.6} />
          </div>
        </div>
      </section>
    </main>
  );
}
