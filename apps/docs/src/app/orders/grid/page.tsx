"use client";

import type { CSSProperties } from "react";
import { Avatar, Grid, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { KPIS, PROJECTS, STATUS_TONE, TAGS, avatarOf, gbp, project } from "@/fixtures/tideline";
import { Kicker } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<Grid minItemWidth={120} gap="sm">
  {kpis.map((k) => <Stat key={k.label} {...k} />)}
</Grid>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Grid"] ?? [] },
  {
    type: "doc-section",
    heading: "Responsive with zero breakpoints",
    body: [{ kind: "text", text: "`minItemWidth` is real `repeat(auto-fit, minmax(...))`: the grid reflows toward one column on its own. Pass `columns` instead for a fixed count that never reflows. Reach for `Row`/`Col` when regions of one row need different widths." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="grid"` on the root.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Row`/`Col` use a fixed 24-unit span system rather than CSS Grid's `auto-fit`; a migration recomputes fixed spans from the rendered item count." }],
  },
];

const harbour = project("harbour");
const CARD: CSSProperties = { background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", border: "1px solid var(--rebar-color-border)", borderRadius: 14, padding: 14 };
const STATS = [
  { label: "Tasks done", value: `${Math.round((harbour.done * 14) / 100)} of 14`, note: "+3 this week" },
  { label: "Budget used", value: gbp(7640), note: `of ${gbp(12000)}` },
  { label: "Next review", value: `Fri ${harbour.due}`, note: "Maya Chen" },
  { label: KPIS[1].label, value: String(KPIS[1].value), note: KPIS[1].delta },
];

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div style={CARD}>
      <Kicker style={{ marginBottom: 6 }}>{label}</Kicker>
      <div style={{ fontFamily: "var(--rebar-font-family-display)", fontVariationSettings: '"SOFT" 100', fontWeight: 600, fontSize: 22, lineHeight: 1.1 }}>{value}</div>
      <Text size="xs" color="secondary">
        {note}
      </Text>
    </div>
  );
}

const Swatch = () => <div style={{ height: 22, borderRadius: 999, background: "var(--rebar-color-tint-1)" }} />;

export default function GridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Grid</Heading>
      <Text color="secondary">Equal columns that reflow on their own.</Text>

      <DemoStage
        title="Project overview"
        caption="Four stats at 120px minimum; narrow the stage and they wrap"
        code={CODE}
        states={[
          { label: "Two columns", node: <Grid columns={2} gap="sm"><Stat {...STATS[0]} /><Stat {...STATS[1]} /></Grid> },
          { label: "Auto fit", node: <Grid minItemWidth={64} gap="xs">{TAGS.map((t) => <Tag key={t} tone={t === "Design" ? "error" : t === "Eng" ? "info" : t === "Ops" ? "success" : "default"} style={{ justifyContent: "center" }}>{t}</Tag>)}</Grid> },
          { label: "Gap sizes", node: <Stack gap="sm"><Grid columns={3} gap="xs"><Swatch /><Swatch /><Swatch /></Grid><Grid columns={3} gap="lg"><Swatch /><Swatch /><Swatch /></Grid></Stack> },
        ]}
      >
        <Grid minItemWidth={120} gap="sm">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </Grid>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects" caption="Project cards at 160px minimum" widths={false}>
        <Grid minItemWidth={160} gap="md">
          {PROJECTS.map((p) => (
            <div key={p.id} style={CARD}>
              <Stack gap="sm">
                <div className={p.kicker === "Brand" ? "cs-grain" : "cs-grain cs-grain--sand"} style={{ height: 64, borderRadius: 10 }} />
                <Kicker>{p.kicker}</Kicker>
                <Heading level={3} style={{ fontSize: 17 }}>
                  {p.name}
                </Heading>
                <Text size="xs" color="secondary">
                  {p.summary}
                </Text>
                <Stack direction="row" gap="sm" align="center" justify="between">
                  <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
                  <Avatar size="sm" {...avatarOf(p.owner)} />
                </Stack>
              </Stack>
            </div>
          ))}
        </Grid>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
