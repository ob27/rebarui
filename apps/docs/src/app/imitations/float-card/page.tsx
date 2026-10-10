import { FloatCard, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<FloatCard label="Today's Gospel">Luke 11:27-28</FloatCard>\n\n<FloatCard tone="accent" label="Ask">CCC 1374: the mode of Christ's presence is unique.</FloatCard>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["FloatCard"] ?? [] },
  {
    type: "doc-section",
    heading: "Theming",
    body: [
      {
        kind: "text",
        text: "Colour comes from `--rebar-color-bg-primary`, `--rebar-color-text-primary` and `--rebar-color-border`; the accent tone uses `--rebar-color-primary`. `--rebar-shadow-float` sets the elevation and `--rebar-float-card-radius` the rounding (both have fallbacks). Use `DeviceStage` to place cards around a device.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A plain `<div>` whose text is ordinary content, so it is read in place. It is not `aria-hidden`. Give a group a name with your own `role=\"group\"` and `aria-label` if it should be announced as a unit (`DeviceStage` does this for its floats).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="float-card"` and `data-rebar-tone` (`default` or `accent`) on the root; `data-rebar-part` values `label` and `body`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. The nearest Ant Design shape is a small `Card` with a box shadow." }],
  },
];

export default function FloatCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FloatCard</Heading>
      <Text color="secondary">
        A small elevated card for a floating fragment of interface: a citation, a check-in, a
        notification preview.
      </Text>
      <LivePreview>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", padding: "var(--rebar-space-lg)" }}>
          <FloatCard label="Today's Gospel">Luke 11:27-28</FloatCard>
          <FloatCard tone="accent" label="Ask">
            CCC 1374: the mode of Christ&apos;s presence is unique.
          </FloatCard>
        </Stack>
      </LivePreview>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
