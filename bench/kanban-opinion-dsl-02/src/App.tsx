// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import { BlockRenderer, type Construct } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    addPosition: "start",
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
        description: "Walk through the new onboarding mocks with the team.",
        assignee: "J",
      },
      "api-contract": {
        id: "api-contract",
        title: "Draft API contract",
        description: "Sketch the request/response shapes for the billing service.",
        assignee: "R",
      },
      "auth-flow": {
        id: "auth-flow",
        title: "Auth flow",
        description: "Wire up the login/refresh token exchange.",
        assignee: "T",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "dashboard-charts": {
        id: "dashboard-charts",
        title: "Dashboard charts",
        description: "Add the weekly-active-users sparkline.",
        assignee: "M",
        statusTag: { label: "Review", tone: "warning" },
      },
      "project-scaffold": {
        id: "project-scaffold",
        title: "Project scaffold",
        description: "Initial repo setup and CI pipeline.",
        assignee: "J",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
