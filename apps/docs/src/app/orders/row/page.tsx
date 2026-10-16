"use client";

import type { CSSProperties, ReactNode } from "react";
import { Avatar, AvatarGroup, Button, Col, Heading, Row, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, KPIS, PEOPLE, TASKS, avatarOf, avatarsOf, gbp, project } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<Row gutter="md">
  <Col span={16}>
    <Card title="Crew interviews">…</Card>
  </Col>
  <Col span={8}>
    <Card title="Interviewers">…</Card>
  </Col>
</Row>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Row"] ?? [] },
  { type: "props-table", heading: "Col props", rows: componentProps["Col"] ?? [] },
  {
    type: "doc-section",
    heading: "Row and Col, or Grid",
    body: [{ kind: "text", text: "A fixed 24-unit span grid: `Row` sets the track, `Col` claims a `span` and an optional `offset`. Reach for `Grid` for uniform tiles; reach for `Row`/`Col` when regions of one row need different widths (16/8, 6/12/6)." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="row"` on the root; `data-rebar-component="col"` on each column.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Row`/`Col` use this exact 24-unit span system: a near 1:1 codemod target, not yet covered." }],
  },
];

const CARD: CSSProperties = { background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", border: "1px solid var(--rebar-color-border)", borderRadius: 14, padding: 16, height: "100%", boxSizing: "border-box" };
const Cell = ({ children, style }: { children?: ReactNode; style?: CSSProperties }) => <div style={{ ...CARD, ...style }}>{children}</div>;
const Swatch = ({ label }: { label: string }) => (
  <div style={{ background: "var(--rebar-color-tint-1)", borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
    <Text size="xs" color="secondary">
      {label}
    </Text>
  </div>
);

const interviews = project("interviews");
const harbour = project("harbour");

export default function RowPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Row / Col</Heading>
      <Text color="secondary">A 24-unit span grid for rows whose columns are not all the same width.</Text>

      <DemoStage
        title="Page with sidebar"
        caption="16 and 8"
        code={CODE}
        states={[
          { label: "12 / 12", node: <Row gutter="xs"><Col span={12}><Swatch label="12" /></Col><Col span={12}><Swatch label="12" /></Col></Row> },
          { label: "8 / 8 / 8", node: <Row gutter="xs"><Col span={8}><Swatch label="8" /></Col><Col span={8}><Swatch label="8" /></Col><Col span={8}><Swatch label="8" /></Col></Row> },
          { label: "Offset 6, span 12", node: <Row gutter="xs"><Col span={12} offset={6}><Swatch label="12" /></Col></Row> },
          { label: "Gutters", node: <Stack gap="xs"><Row gutter="xs"><Col span={8}><Swatch label="xs" /></Col><Col span={8}><Swatch label="xs" /></Col><Col span={8}><Swatch label="xs" /></Col></Row><Row gutter="lg"><Col span={8}><Swatch label="lg" /></Col><Col span={8}><Swatch label="lg" /></Col><Col span={8}><Swatch label="lg" /></Col></Row></Stack> },
        ]}
      >
        <Row gutter="md">
          <Col span={16}>
            <Cell>
              <Stack gap="sm">
                <Tag tone="error">Col span 16</Tag>
                <Heading level={3}>{interviews.name}</Heading>
                <Text size="sm" color="secondary">
                  Six interviews booked across the northern depot. Priya is drafting the discussion guide.
                </Text>
                <PhoneList style={{ maxWidth: 220 }}>
                  <PhoneRow thumb={false} trailing={null} title={`Tue 28 Oct, 10:00`} meta="Depot shift lead" />
                  <PhoneRow thumb={false} trailing={null} title={`Wed 29 Oct, 14:30`} meta="Ferry crew" />
                </PhoneList>
              </Stack>
            </Cell>
          </Col>
          <Col span={8}>
            <Cell>
              <Stack gap="sm">
                <Tag tone="error">Col span 8</Tag>
                <Heading level={3}>Interviewers</Heading>
                <AvatarGroup size="sm" avatars={avatarsOf(["maya", "jonas", "priya"])} />
                <Tag tone="info">6 booked</Tag>
              </Stack>
            </Cell>
          </Col>
        </Row>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project overview" caption="KPIs on 6s, the task list on 16 and the team on 8" widths={false}>
        <div style={{ background: "var(--rebar-color-bg-primary)", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius-lg)", padding: 18 }}>
          <Stack gap="md">
            <Row gutter="md">
              <Col span={16}>
                <Kicker>Project</Kicker>
                <Heading level={2}>{harbour.name}</Heading>
              </Col>
              <Col span={8}>
                <Stack direction="row" gap="sm" justify="end" style={{ flexWrap: "wrap" }}>
                  <Button size="sm" variant="secondary">
                    Share
                  </Button>
                  <Button size="sm">New task</Button>
                </Stack>
              </Col>
            </Row>
            <Row gutter="sm">
              {[{ label: "Tasks done", value: `${Math.round((harbour.done * 14) / 100)} of 14`, note: "+3 this week" }, { label: "Budget used", value: gbp(7640), note: `of ${gbp(12000)}` }, { label: "Next review", value: `Fri ${harbour.due}`, note: PEOPLE[0].name }, { label: KPIS[1].label, value: String(KPIS[1].value), note: KPIS[1].delta }].map((k) => (
                <Col key={k.label} span={6}>
                  <Cell style={{ padding: 12 }}>
                    <Kicker style={{ marginBottom: 6 }}>{k.label}</Kicker>
                    <div style={{ fontFamily: "var(--rebar-font-family-display)", fontVariationSettings: '"SOFT" 100', fontWeight: 600, fontSize: 22, lineHeight: 1.1 }}>{k.value}</div>
                    <Text size="xs" color="secondary">
                      {k.note}
                    </Text>
                  </Cell>
                </Col>
              ))}
            </Row>
            <Row gutter="md">
              <Col span={16}>
                <Cell>
                  <Kicker style={{ marginBottom: 10 }}>Latest tasks</Kicker>
                  <PhoneList>
                    {TASKS.filter((t) => t.project === harbour.id).slice(0, 3).map((t) => (
                      <PhoneRow key={t.id} thumb={false} title={t.title} meta={<Tag tone={t.tag === "Design" ? "error" : "success"} style={{ marginTop: 6 }}>{t.tag}</Tag>} trailing={<Avatar size="sm" {...avatarOf(t.assignee)} />} />
                    ))}
                  </PhoneList>
                </Cell>
              </Col>
              <Col span={8}>
                <Cell style={{ background: "var(--rebar-color-tint-3)", border: 0 }}>
                  <Kicker style={{ marginBottom: 10 }}>Team</Kicker>
                  <Stack gap="sm">
                    {PEOPLE.map((p) => (
                      <Stack key={p.id} direction="row" gap="sm" align="center">
                        <Avatar size="sm" {...avatarOf(p.id)} />
                        <span>
                          <Text size="sm" style={{ display: "block", fontWeight: "var(--rebar-font-weight-semibold)" }}>
                            {p.name}
                          </Text>
                          <Text size="xs" color="secondary" style={{ display: "block" }}>
                            {p.role}
                          </Text>
                        </span>
                      </Stack>
                    ))}
                  </Stack>
                  <Text size="xs" color="secondary" style={{ marginTop: 10 }}>
                    Next: {EVENTS[0].title}, {EVENTS[0].date}
                  </Text>
                </Cell>
              </Col>
            </Row>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
