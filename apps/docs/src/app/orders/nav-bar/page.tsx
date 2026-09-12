import { Box, Heading, NavBar, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const ITEMS = [
  { label: "Docs", href: "#" },
  { label: "Components", href: "#" },
  { label: "Blocks", href: "#" },
  { label: "Benchmarks", href: "#" },
  { label: "About", href: "#" },
];

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<NavBar items={[{ label: "Docs", href: "/docs" }, { label: "About", href: "/about" }]} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["NavBar"] ?? [] },
  {
    type: "doc-section",
    heading: "The 50% budget is the consumer's job, not this component's",
    body: [
      {
        kind: "text",
        text: 'NavBar only handles the collapse mechanics — measure, cut off, move the rest into a popover. The actual rule ("a header\'s nav never consumes more than half the header," see [Design Heuristics](/docs/heuristics#nav-overflow)) is enforced by whoever places it, via a real `flex-basis` on its container (e.g. `flex: "0 1 50%"`) — a bare `max-width: 50%` with no basis will get "stuck" collapsed: a flex item\'s default sizing is shrink-to-fit-content, so once NavBar has already collapsed down to one item, there\'s nothing telling it to reclaim space once the header has room again. This site\'s own header (`SiteHeader.tsx`) is the reference implementation.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real `<nav aria-label>` landmark; every item (visible or collapsed) is a real link via `renderLink`, never a `<div>` styled to look like one. The overflow trigger is a real `<button>` — Tab reaches it, Enter/Space opens the `Popover` behind it.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="navbar"`, `data-rebar-part="more"` on the overflow trigger, `data-rebar-part="overflow"` on the popover\'s content wrapper.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no single direct equivalent; its `Menu` component with `mode=\"horizontal\"` and `overflowedIndicator` is the closest structural match, but the prop shapes don't align closely enough for a mechanical rename.",
      },
    ],
  },
];

export default function NavBarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>NavBar</Heading>
      <Text color="secondary">
        A horizontal nav that measures its own available width and collapses items that would
        overflow it into a trailing &quot;More&quot; popover, instead of wrapping or clipping. This
        site&apos;s own header uses it directly — resize your browser to see it collapse and
        re-expand live.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
          resize: "horizontal",
          overflow: "auto",
          width: 320,
          minWidth: 120,
          maxWidth: "100%",
        }}
      >
        <NavBar items={ITEMS} aria-label="Example" />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
