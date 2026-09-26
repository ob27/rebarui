// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import type { Construct } from "@rebar-ui/placement";
import { BlockRenderer } from "@rebar-ui/placement";

const BLOCKS: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards…",
    columns: [
      {
        id: "todo",
        title: "To Do",
        sections: [
          {
            id: "todo-main",
            cardIds: ["design-review", "api-contract"],
          },
        ],
      },
      {
        id: "in-progress",
        title: "In Progress",
        limit: 4,
        sections: [
          {
            id: "in-progress-main",
            cardIds: ["auth-flow", "dashboard-charts"],
          },
        ],
      },
      {
        id: "done",
        title: "Done",
        sections: [
          {
            id: "done-main",
            cardIds: ["project-scaffold"],
          },
        ],
      },
    ],
    cards: {
      "design-review": {
        id: "design-review",
        title: "Design review",
        description: "Walk through the new onboarding mocks with design.",
        assignee: "P",
      },
      "api-contract": {
        id: "api-contract",
        title: "Finalize API contract",
        description: "Lock the v2 endpoint shapes before implementation starts.",
        assignee: "J",
      },
      "auth-flow": {
        id: "auth-flow",
        title: "Auth flow",
        description: "Implement the new login/signup flow.",
        assignee: "J",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "dashboard-charts": {
        id: "dashboard-charts",
        title: "Dashboard charts",
        description: "Wire up the scatter and line charts on the overview page.",
        assignee: "P",
        statusTag: { label: "Review", tone: "info" },
      },
      "project-scaffold": {
        id: "project-scaffold",
        title: "Project scaffold",
        description: "Initial repo setup and CI pipeline.",
        assignee: "T",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={BLOCKS} />;
}
