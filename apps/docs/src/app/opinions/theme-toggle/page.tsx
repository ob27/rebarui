import { Heading, Stack, Text, ThemeToggle } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [{ kind: "code", code: '<ThemeToggle label="Theme" />' }],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ThemeToggle"] ?? [] },
  {
    type: "doc-section",
    heading: "The same real switch this site's own DevTools panel uses",
    body: [
      {
        kind: "text",
        text: 'A visitor-facing popover onto the exact same DOM attributes this site\'s own dev-only DevTools panel already writes (`data-rebar-theme="sketch"|"clean"`, `data-theme="dark"`/absent, `data-rebar-bionic="true"`/absent) — not a second, competing mechanism. This is a real, shipped component, not private page chrome, so any site built on rebar-ui can offer visitors the same control — the "Theme" button in this site\'s own top-right corner is this exact component.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Mutations: showing fewer controls, not a second component",
    body: [
      {
        kind: "text",
        text: '`sections` (`"style"` | `"mode"` | `"bionic"`, default all three) picks which controls this one component exposes — not three separate components. Naming exactly one drops the popover entirely and renders that control directly: `sections={["mode"]}` is a classic, icon-in-thumb light/dark switch (a plain moon while light, a sun once dark — no separate "dark mode toggle" component needed, this *is* one). `sections={["style"]}` or `["bionic"]` alone render as one inline control the same way. Naming two keeps the popover — there\'s still more than one thing to hide behind a trigger — but only shows the named pair.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-variant="mode-only"|"style-only"|"bionic-only"` on the root when `sections` names exactly one control. It also reads/writes `data-rebar-theme`/`data-theme`/`data-rebar-bionic` on the document root, the same attributes `RebarDevTools` uses.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      { kind: "text", text: "Not codemod-covered — AntD has no equivalent built-in theme-switch component; its own theming runs through `ConfigProvider`'s token system instead." },
    ],
  },
];

export default function ThemeTogglePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ThemeToggle</Heading>
      <Text color="secondary">
        A visitor-facing theme switch — the same real component this site&apos;s own
        &quot;Theme&quot; button in the top-right corner is.
      </Text>

      <LivePreview>
        <ThemeToggle />
      </LivePreview>

      <Stack gap="sm">
        <Heading level={3}>Example: sections=&quot;mode&quot; only — a classic light/dark switch</Heading>
        <Text size="sm" color="secondary">
          No popover, no trigger button — just the switch itself, with a moon/sun icon in the
          thumb and a label that follows the current state.
        </Text>
        <LivePreview>
          <ThemeToggle sections={["mode"]} />
        </LivePreview>
      </Stack>

      <Stack gap="sm">
        <Heading level={3}>Example: sections=&quot;style&quot; only</Heading>
        <LivePreview>
          <ThemeToggle sections={["style"]} />
        </LivePreview>
      </Stack>

      <Stack gap="sm">
        <Heading level={3}>Example: sections=&quot;bionic&quot; only</Heading>
        <LivePreview>
          <ThemeToggle sections={["bionic"]} />
        </LivePreview>
      </Stack>

      <Stack gap="sm">
        <Heading level={3}>Example: style + bionic, mode excluded</Heading>
        <Text size="sm" color="secondary">
          Two sections still keeps the popover, just with only the named controls inside.
        </Text>
        <LivePreview>
          <ThemeToggle label="Appearance" sections={["style", "bionic"]} />
        </LivePreview>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
