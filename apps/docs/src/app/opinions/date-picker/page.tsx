"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Alert, Button, Card, DatePicker, DeviceFrame, Heading, Input, MobileTabBar, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, HOURS_BY_PERSON, PEOPLE, project } from "@/fixtures/tideline";
import { NewBStages } from "./NewBStages";

const LAUNCH = new Date(2026, 9, 24);
const CODE = `const [due, setDue] = useState(new Date(2026, 9, 24));

<DatePicker value={due} onValueChange={setDue} minDate={new Date(2026, 9, 1)} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DatePicker"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A `role="group"` labelled "Date" holding three real `NumberInput`s (Day, Month, Year), each with its own label and bounds; arrow keys step a field, and the day field re-bounds itself to the month. No calendar popover to trap focus in.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="date-picker"` on the root; parts `day`, `month`, `year` (each a real `NumberInput` with its own `data-rebar-component="number-input"`).' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not a structural match: AntD's `DatePicker` is a calendar popover. A migration uses that when browsing is the point, or three plain `InputNumber`s to keep this compact direct-entry shape.",
      },
    ],
  },
];

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

/** The three fields need about 300px; in a narrow states cell they scroll sideways rather than spill over the next cell. */
function Scroll({ children }: { children: ReactNode }) {
  return <div style={{ overflowX: "auto", paddingBottom: 4 }}>{children}</div>;
}

function Field({ label, error, children }: { label?: string; error?: string; children: ReactNode }) {
  return (
    <Stack gap="xs">
      {label ? (
        <Text as="span" size="xs" style={{ fontWeight: "var(--rebar-font-weight-semibold)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)" }}>
          {label}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text size="sm" style={{ color: "var(--rebar-color-danger)" }}>
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}

export default function DatePickerPage() {
  const [due, setDue] = useState<Date>(LAUNCH);
  const [from, setFrom] = useState<Date>(new Date(2026, 9, 19));
  const [to, setTo] = useState<Date>(new Date(2026, 9, 25));
  const days = Math.max(0, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
  const hours = HOURS_BY_PERSON.reduce((sum, h) => sum + h.hours, 0);
  const rota = project("rota");

  return (
    <Stack gap="lg">
      <Heading level={1}>DatePicker</Heading>
      <Text color="secondary">Day, month, year: typed, not browsed.</Text>

      <DemoStage
        title="Due date"
        caption="Three bounded fields; the day re-bounds to the month"
        code={CODE}
        states={[
          { label: "Bounded to October", node: <Scroll><DatePicker defaultValue={new Date(2026, 9, 16)} minDate={new Date(2026, 9, 1)} maxDate={new Date(2026, 9, 31)} /></Scroll> },
          {
            label: "Error",
            node: (
              <Field error="Due date can’t be in the past.">
                <Scroll>
                  <DatePicker defaultValue={new Date(2026, 9, 10)} />
                </Scroll>
              </Field>
            ),
          },
          { label: "Disabled", node: <Scroll><DatePicker defaultValue={new Date(2026, 9, 30)} disabled /></Scroll> },
        ]}
      >
        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <Field label="Due date">
            <DatePicker value={due} onValueChange={setDue} minDate={new Date(2026, 9, 1)} />
            <Text size="sm" color="secondary">
              {fmt(due)} · {EVENTS[0].title}
            </Text>
          </Field>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Rota export" caption="A range in a form, and a due date on a phone">
        <Stack gap="lg">
          <Card style={{ maxWidth: 440, margin: "0 auto" }} title={rota.name} actions={[<Button key="cancel" variant="secondary">Cancel</Button>, <Button key="export">Export CSV</Button>]}>
            <Stack gap="md">
              <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
                <Field label="From">
                  <DatePicker value={from} onValueChange={setFrom} />
                </Field>
                <Field label="To">
                  <DatePicker value={to} onValueChange={setTo} minDate={from} />
                </Field>
              </Stack>
              <Alert type="info">
                {days} {days === 1 ? "day" : "days"}, {PEOPLE.length} people, {hours} hours.
              </Alert>
            </Stack>
          </Card>
          <div className="cs-grain" style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
            <DeviceFrame variant="phone" style={{ maxWidth: 300 }}>
              <div style={{ display: "flex", flexDirection: "column", minHeight: 460, background: "var(--rebar-color-bg-primary)" }}>
                <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
                  <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
                    New task
                  </Heading>
                </div>
                <Stack gap="md" style={{ padding: 16, flex: 1 }}>
                  <Field label="Title">
                    <Input defaultValue="Send crew rota" aria-label="Title" />
                  </Field>
                  <Field label="Due date">
                    <DatePicker defaultValue={new Date(2026, 9, 28)} />
                  </Field>
                </Stack>
                <MobileTabBar aria-label="Tideline" style={{ position: "static" }} items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={2} />
              </div>
            </DeviceFrame>
          </div>
        </Stack>
      </DemoStage>

      <NewBStages />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
