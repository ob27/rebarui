import type { Construct } from "@rebar-ui/placement";
import { BlockRenderer } from "@rebar-ui/placement";

// Sprint Board — see bench/KANBAN_BENCHMARK_SPEC.md. Everything the spec asks for (three fixed
// columns, cards with title/description/statusTag/assignee, drag-and-drop, add-card, search, and
// the "In Progress" cap) is expressed as literal `card-kanban` block data; the block + its
// underlying `Kanban` component supply all the behavior.
const BLOCKS: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards...",
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` here — "To Do" is intentionally uncapped, so (per the spec's accepted gap)
        // it shows no count badge at all; that's a real limit of the schema, not worked around.
        sections: [
          {
            id: "todo-main",
            cardIds: ["design-login", "ci-pipeline"],
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
            cardIds: ["oauth-integration", "kanban-refactor"],
          },
        ],
      },
      {
        id: "done",
        title: "Done",
        sections: [
          {
            id: "done-main",
            cardIds: ["announcement-post"],
          },
        ],
      },
    ],
    cards: {
      "design-login": {
        id: "design-login",
        title: "Design login flow",
        description: "Wireframes for the new auth screens",
        assignee: "A",
      },
      "ci-pipeline": {
        id: "ci-pipeline",
        title: "Set up CI pipeline",
        assignee: "J",
      },
      "oauth-integration": {
        id: "oauth-integration",
        title: "Implement OAuth integration",
        description: "Blocked on vendor API keys",
        statusTag: { label: "Blocked", tone: "error" },
        assignee: "M",
      },
      "kanban-refactor": {
        id: "kanban-refactor",
        title: "Refactor Kanban drag handlers",
        statusTag: { label: "Review", tone: "info" },
        assignee: "S",
      },
      "announcement-post": {
        id: "announcement-post",
        title: "Ship v1 announcement blog post",
        assignee: "T",
      },
    },
    addPosition: "start",
  },
];

export default function App() {
  return <BlockRenderer blocks={BLOCKS} />;
}
