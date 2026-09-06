import { Box, Heading, Stack, Text, Wizard } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const STEPS = [
  { label: "Team", fields: [{ kind: "text" as const, label: "Team name", required: true }] },
  { label: "Details", fields: [{ kind: "textarea" as const, label: "Notes" }] },
];

const LONG_STEPS = Array.from({ length: 12 }, (_, i) => ({
  label: `Step ${i + 1}`,
  fields: [],
}));

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Wizard steps={[{ label: "Team", fields: [{ kind: "text", label: "Team name", required: true }] }, { label: "Details", fields: [{ kind: "textarea", label: "Notes" }] }]} onSubmit={(values) => save(values)} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Wizard"] ?? [] },
  {
    type: "doc-section",
    heading: "Step overflow",
    body: [
      {
        kind: "text",
        text: "Beyond 3 steps, the header stops rendering one item per step and windows to the current step plus the next one, replacing everything else with a leading `N Done` and/or trailing `N todo` bucket — a fixed, scannable width no matter how many steps a wizard has. Click through the 12-step demo below to see the buckets grow and shrink.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Validation gates navigation, not just progress",
    body: [
      {
        kind: "text",
        text: "Next/Submit is disabled while any `required` field in the current step is empty — not just visually hinted (see [Design Heuristics](/docs/heuristics) heuristic #26). This is the one real behavioral nuance the catalogue's own research flagged when it grouped Wizard alongside `Steps` + `Form`: a step container needs actual gating, or it's just a progress indicator with no enforcement behind it.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="wizard"`, `data-rebar-state` is `"in-progress"` or `"last-step"`; each field carries `data-rebar-part="field"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no single `Wizard` component; its `Steps` plus a hand-wired `Form` per step is the closest structural match, but the validation-gating and per-step field state don't map to a mechanical rename.",
      },
    ],
  },
];

export default function WizardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Wizard</Heading>
      <Text color="secondary">
        A multi-step form container — a progress indicator, one step&apos;s fields at a time, and
        a Back/Next/Submit footer that won&apos;t advance past a step&apos;s own required fields.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <Wizard steps={STEPS} />
      </Box>

      <Stack gap="sm">
        <Text size="sm" color="secondary">
          A 12-step wizard, to show the overflow window — click Next to see the leading &quot;N
          Done&quot; bucket appear and the trailing &quot;N todo&quot; bucket shrink.
        </Text>
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "var(--rebar-space-lg)",
          }}
        >
          <Wizard steps={LONG_STEPS} />
        </Box>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
