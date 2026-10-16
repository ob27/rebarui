"use client";

import { Card, Heading, Stack, Text, ThemeToggle } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = "<ThemeToggle label=\"Theme\" />\n<ThemeToggle sections={[\"mode\"]} />";


const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ThemeToggle"] ?? [] },
  {
    type: "doc-section",
    heading: "Sections",
    body: [{ kind: "text", text: "`sections` (`\"style\"`, `\"mode\"`, `\"bionic\"`; default all three) picks the controls. Naming exactly one drops the popover and renders that control directly; naming two keeps the popover with just those two." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-variant=\"mode-only\"|\"style-only\"|\"bionic-only\"` on the root when `sections` names one control. It reads and writes `data-rebar-theme`, `data-theme` and `data-rebar-bionic` on the document root, the same attributes `RebarDevTools` uses." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no theme-switch component; its theming runs through `ConfigProvider` tokens." }],
  },
];

export default function ThemeTogglePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ThemeToggle</Heading>
      <Text color="secondary">A visitor-facing theme switch; the Theme button at the top right of this site is this component.</Text>

      <DemoStage title="Theme switch" caption="Style, light or dark, and bionic reading in one popover" code={CODE} widths={false}
        states={[
          { label: "Mode only", node: <ThemeToggle sections={["mode"]} /> },
          { label: "Style only", node: <ThemeToggle sections={["style"]} /> },
          { label: "Bionic only", node: <ThemeToggle sections={["bionic"]} /> },
          { label: "Style and bionic", node: <ThemeToggle label="Appearance" sections={["style", "bionic"]} /> },
          { label: "Small", node: <ThemeToggle size="sm" /> },
        ]}>
        <ThemeToggle label="Theme" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Settings" caption="One row in a preferences card" widths={false}>
        <Card style={{ maxWidth: 440, margin: "0 auto" }} title="Preferences" subtitle="Tideline, for Maya Chen">
          <Stack gap="md">
            <Stack direction="row" justify="between" align="center">
              <Text size="sm">Dark mode</Text>
              <ThemeToggle sections={["mode"]} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Text size="sm">Appearance</Text>
              <ThemeToggle label="Appearance" sections={["style", "bionic"]} />
            </Stack>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
