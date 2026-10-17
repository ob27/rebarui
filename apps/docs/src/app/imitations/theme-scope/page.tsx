"use client";

import { Button, Card, Dialog, Heading, Input, Select, Stack, Text, ThemeScope } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<ThemeScope scheme="light">
  <Card title="Reconciliation">…</Card>
  <Dialog trigger={<Button>Open</Button>} title="Follows the lock">…</Dialog>
</ThemeScope>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ThemeScope"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A plain `<div>`: no role and no focus behaviour of its own. It only changes colours, so contrast is that of the locked scheme, which the theme keeps at AA in both light and dark.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="theme-scope"` and `data-rebar-scheme="light" | "dark"`. The attribute works on any element: the theme re-declares every token under it. Overlays (Dialog, Drawer, BottomSheet, Popover, Select, Dropdown, Tooltip, HoverCard, Menubar, MultiSelect, CommandPalette) opened from inside a `ThemeScope` re-apply it on their portaled content through `useSchemeAttr()`. If you set the attribute by hand instead of using `ThemeScope`, call `useSchemeAttr` yourself or portal into the wrapper with the `container` prop.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Map to a nested `ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}`; AntD also needs `getPopupContainer` for popups to follow it." }],
  },
];

function Panel({ label }: { label: string }) {
  return (
    <Card title={label}>
      <Stack gap="sm">
        <Text size="sm" color="secondary">Everything in this subtree uses its own scheme.</Text>
        <Input placeholder="Email" aria-label={`${label} email`} />
        <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Dialog trigger={<Button variant="tertiary">Open dialog</Button>} title={`${label} dialog`}>
            <Text>This dialog is portaled to the page body, and still follows the lock.</Text>
          </Dialog>
        </Stack>
        <Select aria-label={`${label} select`} defaultValue="a" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} />
      </Stack>
    </Card>
  );
}

export default function ThemeScopePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ThemeScope</Heading>
      <Text color="secondary">Forces one colour scheme for a subtree. Overlays opened from inside it follow the lock, not the page.</Text>

      <DemoStage title="Scheme lock" caption="Use the site's theme toggle: the page changes, the two scopes do not" code={CODE} widths={false}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <ThemeScope scheme="light" style={{ padding: 16, borderRadius: 18 }}>
            <Panel label="Locked light" />
          </ThemeScope>
          <ThemeScope scheme="dark" style={{ padding: 16, borderRadius: 18 }}>
            <Panel label="Locked dark" />
          </ThemeScope>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
