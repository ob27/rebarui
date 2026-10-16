import { Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `{
  type: "goal-tracker",
  aspiration: "Launch the Harbour rebrand on 24 Oct",
  focusAreas: [{ id: "fa1", text: "Identity", goals: [{ id: "g1", text: "Sign off the palette", completed: true }] }],
}`;

const TRACKER: Construct = {
  type: "goal-tracker",
  aspiration: "Launch the Harbour rebrand on 24 Oct",
  celebration: "small",
  focusAreas: [
    {
      id: "fa1",
      text: "Identity",
      goals: [
        { id: "g1", text: "Sign off the brand palette", completed: true },
        { id: "g2", text: "Finish the icon audit", completed: false },
        { id: "g3", text: "Cut the stacked mark as an SVG", completed: true },
      ],
    },
    {
      id: "fa2",
      text: "Launch",
      goals: [
        { id: "g4", text: "Draft the launch checklist", completed: false },
        { id: "g5", text: "Book the crew walkthrough", completed: false },
      ],
    },
  ],
};

const DONE: Construct = {
  type: "goal-tracker",
  aspiration: "Hand payroll a clean rota",
  celebration: "none",
  focusAreas: [{ id: "fa1", text: "Rota export", goals: [{ id: "g1", text: "Export March rota to CSV", completed: true }, { id: "g2", text: "Check with Leo", completed: true }] }],
};

const FRESH: Construct = { type: "goal-tracker", aspiration: "Run twelve crew interviews", focusAreas: [] };

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "goal-tracker", aspiration: string, focusAreas: GoalTrackerFocusAreaData[], celebration?: "none" | "small" | "big" }
// GoalTrackerFocusAreaData = { id: string, text: string, goals: GoalTrackerGoalData[] }
// GoalTrackerGoalData = { id: string, text: string, completed: boolean }` }],
  },
];

export default function GoalTrackerPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Goal Tracker</Heading>
      <Text color="secondary">One aspiration, focus areas under it and goals to tick off.</Text>

      <DemoStage
        title="Launch goals"
        caption="Edit any line, tick a goal, add or delete"
        code={CODE}
        widths={false}
        states={[
          { label: "All done, and nothing added yet", node: <Stack gap="md"><NextBlockRenderer blocks={[DONE]} /><NextBlockRenderer blocks={[FRESH]} /></Stack> },
        ]}
      >
        <NextBlockRenderer blocks={[TRACKER]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project overview" caption="Goals beside the project's status" widths={false}>
        <Stack gap="md">
          <Card>
            <Stack direction="row" gap="md" align="center" style={{ flexWrap: "wrap" }}>
              <Heading level={3}>{harbour.name}</Heading>
              <Tag tone="success">{harbour.status}</Tag>
              <Text size="sm" color="secondary">{harbour.done}% done, due {harbour.due}</Text>
            </Stack>
          </Card>
          <NextBlockRenderer blocks={[TRACKER]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
