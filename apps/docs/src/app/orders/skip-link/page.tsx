import { Box, Heading, SkipLink, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<SkipLink targetId="main-content" />\n<header>...</header>\n<main id="main-content">...</main>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["SkipLink"] ?? [] },
  {
    type: "doc-section",
    heading: "Why this exists",
    body: [
      {
        kind: "text",
        text: '"Skip to main content" — the standard first-focusable-element pattern (GOV.UK Design System, Carbon, and most accessibility-serious systems ship one explicitly). Without it, a keyboard user has to tab through every nav item, every sidebar link, and every header control on *every single page load* before reaching the actual content — real, cumulative friction the sighted mouse-using majority never notices. Off-screen until focused, then a real, visible link; never removed from the DOM or the tab order.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Try it: press Tab",
    body: [
      {
        kind: "text",
        text: "Click anywhere in the demo box below to focus it, then press Tab once — the skip link appears at the top-left, fully visible and clickable, exactly where a keyboard user's very first Tab press would land on a real page.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="skip-link"` on the root.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no dedicated skip-link component; a migration typically keeps this exact pattern as a plain styled `<a>`, since it's simple enough that most design systems leave it to app-level markup rather than a library export.",
      },
    ],
  },
];

export default function SkipLinkPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SkipLink</Heading>
      <Text color="secondary">
        &quot;Skip to main content&quot; — off-screen until focused, then a real, visible,
        first-in-tab-order link.
      </Text>

      <Box
        tabIndex={-1}
        style={{
          position: "relative",
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
          outline: "none",
          // Real usage anchors SkipLink to the top of the whole page, where "off-screen" means
          // scrolled above the viewport — genuinely invisible. Anchored to this mid-page box
          // instead, "off-screen" only means clipped by the box's own bounds; without this, the
          // hidden link would render on top of whatever content precedes the box instead.
          overflow: "hidden",
        }}
      >
        <SkipLink targetId="skip-link-demo-target" />
        <Text size="sm" color="secondary">
          Click here, then press Tab.
        </Text>
        <Box id="skip-link-demo-target" tabIndex={-1} style={{ marginTop: "var(--rebar-space-md)" }}>
          <Text size="sm">This is the &quot;main content&quot; the link jumps to.</Text>
        </Box>
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
