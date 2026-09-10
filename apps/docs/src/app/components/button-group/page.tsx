import { Button, ButtonGroup, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<ButtonGroup>\n  <Button variant="secondary">Day</Button>\n  <Button variant="secondary">Week</Button>\n  <Button variant="secondary">Month</Button>\n</ButtonGroup>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ButtonGroup"] ?? [] },
  {
    type: "doc-section",
    heading: "No size/variant prop of its own",
    body: [
      {
        kind: "text",
        text: "`ButtonGroup` never clones or overrides props on its children — it receives real, already-built `Button` elements as `children` and only supplies the visual joining (collapsed double borders, squared-off inner corners) via CSS. Set `size`/`variant` directly on each `Button` as usual.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Distinct from SplitButton",
    body: [
      {
        kind: "text",
        text: "`SplitButton` pairs one primary action with a dropdown menu of secondary ones. `ButtonGroup` is several equal, always-visible actions with no menu at all — closer to a segmented control.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="button-group"`, `data-rebar-orientation="horizontal" | "vertical"` on the root.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Button.Group` (or `Space.Compact` in recent versions) is a close direct equivalent — same joined-row shape.",
      },
    ],
  },
];

export default function ButtonGroupPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ButtonGroup</Heading>
      <Text color="secondary">
        A visually joined row (or column) of several equal buttons.
      </Text>

      <Stack gap="md" align="start">
        <ButtonGroup>
          <Button variant="secondary">Day</Button>
          <Button variant="secondary">Week</Button>
          <Button variant="secondary">Month</Button>
        </ButtonGroup>

        <ButtonGroup orientation="vertical">
          <Button variant="secondary">Top</Button>
          <Button variant="secondary">Middle</Button>
          <Button variant="secondary">Bottom</Button>
        </ButtonGroup>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
