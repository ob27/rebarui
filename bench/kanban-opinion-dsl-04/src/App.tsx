// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import { BlockRenderer } from "@rebar-ui/placement";
import type { Construct } from "@rebar-ui/placement";

const BLOCKS: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards…",
    // "+ Add card" inserts the new card at the top of its column, per spec.
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` — uncapped column, so (per the schema's known, accepted gap) it
        // intentionally shows no count badge.
        sections: [
          {
            id: "todo-main",
            cardIds: ["design-review", "write-tests"],
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
            cardIds: ["api-integration", "fix-login-bug"],
          },
        ],
      },
      {
        id: "done",
        title: "Done",
        sections: [
          {
            id: "done-main",
            cardIds: ["setup-repo"],
          },
        ],
      },
    ],
    cards: {
      "design-review": {
        id: "design-review",
        title: "Design review",
        description: "Review the new checkout flow mockups",
        assignee: "A",
      },
      "write-tests": {
        id: "write-tests",
        title: "Write unit tests",
        description: "Cover the new checkout flow with unit tests",
        assignee: "B",
      },
      "api-integration": {
        id: "api-integration",
        title: "API integration",
        description: "Wire up the payments API",
        assignee: "C",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "fix-login-bug": {
        id: "fix-login-bug",
        title: "Fix login bug",
        description: "Users get logged out after 5 minutes",
        assignee: "D",
        statusTag: { label: "Review", tone: "warning" },
      },
      "setup-repo": {
        id: "setup-repo",
        title: "Set up repo",
        assignee: "A",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={BLOCKS} />;
}
