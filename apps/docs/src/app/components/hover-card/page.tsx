import { Heading, HoverCard, Stack, Text } from "rebar-ui";
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
        code: '<HoverCard trigger={<a href="/about">@tom</a>}>\n  <p>Full profile preview</p>\n</HoverCard>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["HoverCard"] ?? [] },
  {
    type: "doc-section",
    heading: "HoverCard vs. Popover",
    body: [
      {
        kind: "text",
        text: 'Opens on hover (or focus, for keyboard users) and auto-dismisses a short delay after the pointer leaves both the trigger and the content — the grace period lets someone move their pointer from one to the other without it vanishing mid-move. This is the right choice for supplementary content someone is *previewing*, not actively operating: a footnote, a profile preview, extra detail on a term. For something a viewer deliberately clicked open and is actively using — a filter panel, a menu — use [Popover](/components/popover) instead; a hover-dismissing panel for content someone clicked to open is a real usability bug, not a stylistic choice.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Real Radix `HoverCard` underneath — opens on keyboard focus as well as pointer hover, so it's reachable without a mouse, not a hover-only pattern that silently excludes keyboard users.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="hover-card"` on the content panel.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD's closest equivalent is `Popover` with `trigger=\"hover\"`, a prop-level mode switch on one component rather than two separate ones, so mapping this over is a structural change, not a rename.",
      },
    ],
  },
];

export default function HoverCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>HoverCard</Heading>
      <Text color="secondary">
        A hover-triggered floating panel that auto-dismisses shortly after the pointer leaves —
        real Radix HoverCard underneath. A genuinely distinct component from <code>Popover</code>,
        not a variant of it.
      </Text>

      <LivePreview>
        <HoverCard trigger={<a href="#profile">@tom</a>}>
          <Stack gap="xs" style={{ minWidth: 180 }}>
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              Tom
            </Text>
            <Text size="sm" color="secondary">
              Building Rebar UI.
            </Text>
          </Stack>
        </HoverCard>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
