import { Heading, SidePanel, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<Stack direction="row" style={{ alignItems: "stretch" }}>\n  <div style={{ flex: 1 }}>{/* main content */}</div>\n  <SidePanel title="Thread">\n    <Text size="sm">Reply content goes here.</Text>\n  </SidePanel>\n</Stack>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["SidePanel"] ?? [] },
  {
    type: "doc-section",
    heading: "Persistent, not modal — the Slack \"thread panel\" pattern",
    body: [
      {
        kind: "text",
        text: 'Distinct from `Drawer`/`BottomSheet`/`ActionSheet` (all real Radix `Dialog` overlays with a backdrop, meant to be dismissed): `SidePanel` has no backdrop, no portal, and no scrim. It sits *beside* the main content in normal document flow — the rest of the page stays fully visible and interactive while it\'s open, exactly like a real Slack thread or details panel never dims the channel behind it.',
      },
      {
        kind: "text",
        text: "Collapsing doesn't remove the panel — it shrinks to a slim, always-present 44px rail with one toggle button, so there's always a real way back in without wiring up an external \"reopen\" control yourself. Same controlled/uncontrolled convention as everything else here (`open`/`defaultOpen`/`onOpenChange`).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="side-panel"`; `data-rebar-open` mirrors whether the panel is expanded or collapsed to its rail; `data-rebar-part="header"|"content"|"toggle"|"close"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated persistent side-panel component of its own; a migration typically composes a flex layout with a plain collapsible `div`, or `Layout.Sider` if the app already uses AntD's `Layout` system.",
      },
    ],
  },
];

export default function SidePanelPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SidePanel</Heading>
      <Text color="secondary">
        A persistent, non-modal side panel that sits beside the main content — the Slack
        &quot;thread&quot;/&quot;details&quot; pattern, not an overlay.
      </Text>

      <LivePreview>
        <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--rebar-color-border)", height: 220 }}>
          <div style={{ flex: 1, padding: "var(--rebar-space-md)" }}>
            <Text size="sm">Main content stays fully visible and interactive while the panel is open.</Text>
          </div>
          <SidePanel title="Thread" width={260}>
            <Text size="sm">Alex: Can we ship this Friday?</Text>
          </SidePanel>
        </div>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
