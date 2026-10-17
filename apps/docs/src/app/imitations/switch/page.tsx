import type { ReactNode } from "react";
import { Card, Heading, Stack, Switch, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { SwitchMobile } from "./SwitchMobile";

const CODE = `<label>
  <Switch defaultChecked />
  Offline sync
</label>
<label>
  <Switch />
  Push notifications
</label>`;

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", flexShrink: 0 }}>{children}</span>
      <span>{label}</span>
    </label>
  );
}

const SETTINGS = [
  { id: "sync", name: "Offline sync", detail: "Keep tasks on this phone", on: true },
  { id: "mentions", name: "Mentions", detail: "Push when someone tags you", on: true },
  { id: "digest", name: "Weekly digest", detail: "Fridays, 16:00", on: false },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Switch"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real Radix `role="switch"` button: Space or Enter toggles, `aria-checked` follows `checked`. It has no label of its own, so wrap it in a `<label>` or pass `aria-label`. Use `Switch` for a setting that applies at once; a `Checkbox` for a choice submitted with a form.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="switch"` on the root; `data-rebar-part="thumb"` and `"thumb-icon"`; Radix sets `data-state`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Switch` takes the same `checked`/`onChange` shape: a close, low-risk rename." }],
  },
];

export default function SwitchPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Switch</Heading>
      <Text color="secondary">An instant on and off.</Text>

      <DemoStage
        title="Switch"
        caption="On and off"
        code={CODE}
        states={[
          {
            label: "Disabled",
            node: (
              <Row label="Beta">
                <Switch disabled />
              </Row>
            ),
          },
          {
            label: "Disabled on",
            node: (
              <Row label="Sync">
                <Switch disabled defaultChecked />
              </Row>
            ),
          },
          {
            label: "Thumb icon",
            node: (
              <Row label="Dark mode">
                <Switch defaultChecked thumbIcon={<span aria-hidden="true">☾</span>} />
              </Row>
            ),
          },
          {
            label: "Long label",
            node: (
              <Row label="Show weekend days on the crew calendar">
                <Switch defaultChecked />
              </Row>
            ),
          },
        ]}
      >
        <Stack gap="md" style={{ maxWidth: 420, margin: "0 auto" }}>
          <Row label="Offline sync">
            <Switch defaultChecked />
          </Row>
          <Row label="Push notifications">
            <Switch />
          </Row>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Settings" caption="Each row is one setting, applied at once">
        <Card style={{ maxWidth: 460, margin: "0 auto" }}>
          <Stack gap="md">
            {SETTINGS.map((s, i) => (
              <label
                key={s.id}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer", paddingTop: i ? 16 : 0, borderTop: i ? "1px solid var(--rebar-color-border)" : undefined }}
              >
                <Stack gap="xs">
                  <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                    {s.name}
                  </Text>
                  <Text as="span" size="sm" color="secondary">
                    {s.detail}
                  </Text>
                </Stack>
                <span style={{ display: "inline-flex", flexShrink: 0 }}>
                  <Switch defaultChecked={s.on} />
                </span>
              </label>
            ))}
          </Stack>
        </Card>
      </DemoStage>

      <SwitchMobile />
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
