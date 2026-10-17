"use client";

import { useState } from "react";
import { Button, Card, Heading, Radio, RadioGroup, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { gbp, project } from "@/fixtures/tideline";

const CODE = `<RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
  <Radio value="studio">Studio</Radio>
  <Radio value="team">Team</Radio>
  <Radio value="agency">Agency</Radio>
</RadioGroup>`;

const PLANS = [
  { id: "studio", name: "Studio", detail: "Up to 5 people", price: 0 },
  { id: "team", name: "Team", detail: "Up to 25 people, exports", price: 12 },
  { id: "agency", name: "Agency", detail: "Unlimited, SSO", price: 48 },
];

const FORMATS = [
  { id: "pdf", name: "PDF", detail: "Printable" },
  { id: "csv", name: "CSV", detail: "For spreadsheets" },
  { id: "ics", name: "Calendar (.ics)" },
];

function Plans() {
  const [plan, setPlan] = useState("team");
  return (
    <RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
      <Stack gap="sm">
        {PLANS.map((p) => {
          const selected = p.id === plan;
          return (
            <Card
              key={p.id}
              style={{
                padding: "4px 0",
                borderColor: selected ? "var(--rebar-color-primary)" : undefined,
                background: selected ? "var(--rebar-color-tint-1)" : undefined,
              }}
            >
              <Stack direction="row" justify="between" align="start" gap="md">
                <Radio value={p.id} style={{ marginTop: 2 }}>
                  <Stack gap="xs">
                    <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                      {p.name}
                    </Text>
                    <Text as="span" size="sm" color="secondary">
                      {p.detail}
                    </Text>
                  </Stack>
                </Radio>
                <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  {gbp(p.price)}
                </Text>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </RadioGroup>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "RadioGroup props", rows: componentProps["RadioGroup"] ?? [] },
  { type: "props-table", heading: "Radio props", rows: componentProps["Radio"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real Radix `role="radiogroup"`: arrow keys move between options, Space selects, each `Radio` is a real `<label>`. Give the group an `aria-label` or `aria-labelledby` pointing at its legend.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="radio-group"` on the group, `"radio"` on each item; `data-rebar-part="indicator"`, `"label"`; Radix sets `data-state`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Radio.Group`/`Radio` take the same `value`/`onChange` (event-based) shape: a close, low-risk rename." }],
  },
];

export default function RadioGroupPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>RadioGroup</Heading>
      <Text color="secondary">A labelled set of radios.</Text>

      <DemoStage
        title="Plan"
        caption="Group with legend and cards"
        code={CODE}
        states={[
          {
            label: "Horizontal",
            node: (
              <RadioGroup defaultValue="day" aria-label="Range">
                <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
                  <Radio value="day">Day</Radio>
                  <Radio value="week">Week</Radio>
                  <Radio value="month">Month</Radio>
                </Stack>
              </RadioGroup>
            ),
          },
          {
            label: "Error",
            node: (
              <Stack gap="xs">
                <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  Colour
                </Text>
                <RadioGroup aria-label="Colour" aria-invalid="true">
                  <Stack direction="row" gap="md">
                    <Radio value="coral" style={{ borderColor: "var(--rebar-color-danger)" }}>
                      Coral
                    </Radio>
                    <Radio value="navy" style={{ borderColor: "var(--rebar-color-danger)" }}>
                      Navy
                    </Radio>
                  </Stack>
                </RadioGroup>
                <Text size="xs" style={{ color: "var(--rebar-color-danger)" }}>
                  Choose a colour.
                </Text>
              </Stack>
            ),
          },
          {
            label: "Disabled",
            node: (
              <RadioGroup defaultValue="day" disabled aria-label="Range">
                <Stack direction="row" gap="md">
                  <Radio value="day">Day</Radio>
                  <Radio value="week">Week</Radio>
                </Stack>
              </RadioGroup>
            ),
          },
        ]}
      >
        <Stack gap="sm" style={{ maxWidth: 460, margin: "0 auto" }}>
          <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            Plan
          </Text>
          <Plans />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Export dialog" caption="One choice, then one action">
        <Card style={{ maxWidth: 420, margin: "0 auto" }}>
          <Stack gap="md">
            <Heading level={3}>Export {project("rota").name.split(" ")[0]?.toLowerCase()}</Heading>
            <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              Format
            </Text>
            <RadioGroup defaultValue="pdf" aria-label="Format">
              <Stack gap="sm">
                {FORMATS.map((f) => (
                  <Radio key={f.id} value={f.id}>
                    <Stack gap="xs">
                      <span>{f.name}</span>
                      {f.detail ? (
                        <Text as="span" size="xs" color="secondary">
                          {f.detail}
                        </Text>
                      ) : null}
                    </Stack>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Button style={{ width: "100%" }}>Export</Button>
          </Stack>
        </Card>
      </DemoStage>

            <Heading level={2}>Native appearance</Heading>
      <DemoStage title="Native" caption={'RadioGroup appearance="native": each Radio is the browser radio, grouped by name.'} widths={false}
        code={`<RadioGroup appearance="native" defaultValue="dr"><Radio value="dr">Douay-Rheims</Radio><Radio value="cpdv">CPDV</Radio></RadioGroup>`}>
        <RadioGroup appearance="native" defaultValue="dr" aria-label="Translation"><Radio value="dr">Douay-Rheims</Radio><Radio value="cpdv">CPDV</Radio></RadioGroup>
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
