// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import { BlockRenderer } from "@rebar-ui/placement";
import type { Construct } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        sections: [{ id: "todo-main", cardIds: ["card-1", "card-2"] }],
      },
      {
        id: "in-progress",
        title: "In Progress",
        limit: 4,
        sections: [{ id: "in-progress-main", cardIds: ["card-3", "card-4"] }],
      },
      {
        id: "done",
        title: "Done",
        sections: [{ id: "done-main", cardIds: ["card-5"] }],
      },
    ],
    cards: {
      "card-1": {
        id: "card-1",
        title: "Write onboarding docs",
        description: "Cover setup, first project, and deploy",
        assignee: "T",
      },
      "card-2": {
        id: "card-2",
        title: "Design empty states",
        assignee: "R",
      },
      "card-3": {
        id: "card-3",
        title: "Fix flaky drag-drop test",
        description: "Intermittent failure on column reorder",
        assignee: "K",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "card-4": {
        id: "card-4",
        title: "Wire up search filter",
        assignee: "T",
        statusTag: { label: "Review", tone: "info" },
      },
      "card-5": {
        id: "card-5",
        title: "Set up CI pipeline",
        assignee: "R",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
