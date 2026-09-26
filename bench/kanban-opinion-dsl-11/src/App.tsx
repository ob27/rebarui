// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import type { Construct } from "@rebar-ui/placement";
import { BlockRenderer } from "@rebar-ui/placement";

const BLOCKS: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        sections: [{ id: "todo-main", cardIds: ["design-review", "api-contract"] }],
      },
      {
        id: "in-progress",
        title: "In Progress",
        limit: 4,
        sections: [{ id: "in-progress-main", cardIds: ["auth-flow", "dashboard-charts"] }],
      },
      {
        id: "done",
        title: "Done",
        sections: [{ id: "done-main", cardIds: ["project-scaffold"] }],
      },
    ],
    cards: {
      "design-review": {
        id: "design-review",
        title: "Design review",
        description: "Walk through the new onboarding flow with design.",
        assignee: "R",
      },
      "api-contract": {
        id: "api-contract",
        title: "Draft API contract",
        description: "Define request/response shapes for the billing service.",
        assignee: "T",
      },
      "auth-flow": {
        id: "auth-flow",
        title: "Auth flow",
        description: "Implement refresh-token rotation.",
        assignee: "M",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "dashboard-charts": {
        id: "dashboard-charts",
        title: "Dashboard charts",
        description: "Wire the new analytics widgets to live data.",
        assignee: "J",
        statusTag: { label: "Review", tone: "info" },
      },
      "project-scaffold": {
        id: "project-scaffold",
        title: "Project scaffold",
        description: "Initial repo setup and CI pipeline.",
        assignee: "R",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={BLOCKS} />;
}
