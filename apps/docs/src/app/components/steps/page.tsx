import { Heading, Stack, Steps, Text } from "rebar-ui";
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
        code: '<Steps\n  current={1}\n  items={[\n    { title: "Team" },\n    { title: "Details", description: "Fill in employee info" },\n    { title: "Review" },\n  ]}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Steps"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`current` (an index) derives each step\'s status automatically — before it is "finish" (✓), at it is "process", after it is "wait" — the active step is marked `aria-current="step"`. Any item can set its own `status` (including `"error"`) to override the derived value.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="steps"`, `data-rebar-direction`, `data-rebar-part="item" | "icon" | "content"`, `data-rebar-status="wait" | "process" | "finish" | "error"` on each item.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Steps` takes the same `items`/`current`/`direction` shape almost verbatim — one of the closest matches on this page, not yet codemod-covered.",
      },
    ],
  },
];

export default function StepsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Steps</Heading>
      <Text color="secondary">
        A numbered progress indicator for a multi-stage flow. Pass <code>current</code> and every
        step&apos;s finish/process/wait state is derived automatically.
      </Text>

      <LivePreview>
        <Stack gap="xl">
          <Steps
            current={1}
            items={[
              { title: "Team" },
              { title: "Details", description: "Fill in employee info" },
              { title: "Review" },
            ]}
          />
          <Steps
            direction="vertical"
            current={1}
            items={[
              { title: "Order placed" },
              { title: "Payment failed", status: "error" },
              { title: "Shipped" },
            ]}
          />
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
