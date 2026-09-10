"use client";

import { useRef, useState } from "react";
import { GoalTracker, Heading, Stack, Text } from "rebar-ui";
import type { GoalTrackerFocusArea } from "rebar-ui";
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
        code: '<GoalTracker\n  aspiration="Grow the platform business"\n  focusAreas={focusAreas}\n  onGoalToggle={(focusAreaId, goalId, completed) => toggle(focusAreaId, goalId, completed)}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["GoalTracker"] ?? [] },
  {
    type: "doc-section",
    heading: "A hierarchical, editable OKR structure",
    body: [
      {
        kind: "text",
        text: "Aspiration → Focus Areas → Goals, each level inline-editable via the real Editable component, each also carrying a small visible caption (\"Aspiration\", \"Focus area\", \"Goals\") above it rather than relying on an aria-label alone — see ref/HEURISTICS.md #6. Completing a goal (not un-completing) fires a celebratory particle burst sized by the `celebration` prop (`\"small\"` default, `\"big\"` for a larger/longer one, `\"none\"` to disable), built without any new dependency, skipped entirely under prefers-reduced-motion. `onAddFocusArea`/`onAddGoal` add the \"+ Add focus area\"/\"+ Add goal\" buttons — omitted entirely unless passed.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="goal-tracker"`; parts include `aspiration`, `focus-area`, `goal`, and `goal-toggle`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no OKR-tracker primitive of its own; compose `Collapse` + `Checkbox` + `Typography.Text editable` directly.",
      },
    ],
  },
];

export default function GoalTrackerPage() {
  const [focusAreas, setFocusAreas] = useState<GoalTrackerFocusArea[]>([
    {
      id: "fa1",
      text: "Expand into new markets",
      goals: [
        { id: "g1", text: "Launch in two new regions", completed: true },
        { id: "g2", text: "Sign 10 new enterprise customers", completed: false },
      ],
    },
    {
      id: "fa2",
      text: "Improve retention",
      goals: [{ id: "g3", text: "Reduce churn to under 3%", completed: false }],
    },
  ]);
  const nextId = useRef(1);

  return (
    <Stack gap="lg">
      <Heading level={1}>GoalTracker</Heading>
      <Text color="secondary">
        A hierarchical goal/OKR tracker — Aspiration → Focus Areas → Goals, with a celebratory
        completion effect.
      </Text>

      <GoalTracker
        aspiration="Grow the platform business"
        focusAreas={focusAreas}
        celebration="big"
        onGoalToggle={(focusAreaId, goalId, completed) =>
          setFocusAreas((prev) =>
            prev.map((fa) =>
              fa.id === focusAreaId
                ? { ...fa, goals: fa.goals.map((g) => (g.id === goalId ? { ...g, completed } : g)) }
                : fa,
            ),
          )
        }
        onFocusAreaChange={(id, text) =>
          setFocusAreas((prev) => prev.map((fa) => (fa.id === id ? { ...fa, text } : fa)))
        }
        onGoalChange={(focusAreaId, goalId, text) =>
          setFocusAreas((prev) =>
            prev.map((fa) =>
              fa.id !== focusAreaId
                ? fa
                : { ...fa, goals: fa.goals.map((g) => (g.id === goalId ? { ...g, text } : g)) },
            ),
          )
        }
        onDelete={(kind, { focusAreaId, goalId }) =>
          setFocusAreas((prev) =>
            kind === "focusArea"
              ? prev.filter((fa) => fa.id !== focusAreaId)
              : prev.map((fa) =>
                  fa.id !== focusAreaId
                    ? fa
                    : { ...fa, goals: fa.goals.filter((g) => g.id !== goalId) },
                ),
          )
        }
        onAddFocusArea={() => {
          const id = `fa${nextId.current++}`;
          setFocusAreas((prev) => [...prev, { id, text: "", goals: [] }]);
        }}
        onAddGoal={(focusAreaId) => {
          const id = `g${nextId.current++}`;
          setFocusAreas((prev) =>
            prev.map((fa) =>
              fa.id !== focusAreaId
                ? fa
                : { ...fa, goals: [...fa.goals, { id, text: "", completed: false }] },
            ),
          );
        }}
      />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
