// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import { BlockRenderer, type Construct } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    // "+ Add card" inserts new cards at the top of the column, per spec.
    addPosition: "start",
    cards: {
      "1": {
        id: "1",
        title: "Design login flow",
        description: "Wireframe the new SSO screen",
        assignee: "M",
      },
      "2": {
        id: "2",
        title: "Set up CI pipeline",
        assignee: "J",
      },
      "3": {
        id: "3",
        title: "Implement search API",
        description: "Typeahead + fuzzy match",
        assignee: "J",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "4": {
        id: "4",
        title: "Refactor auth middleware",
        assignee: "K",
        statusTag: { label: "Review", tone: "warning" },
      },
      "5": {
        id: "5",
        title: "Ship v1.2 release notes",
        assignee: "T",
      },
    },
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` here on purpose — an uncapped column has no way to show a plain count
        // through pure block data (Kanban's header badge only appears when `limit` is set).
        // See the spec's "Known, accepted gap" note; not worked around.
        sections: [{ id: "todo-section", cardIds: ["1", "2"] }],
      },
      {
        id: "in-progress",
        title: "In Progress",
        limit: 4,
        sections: [{ id: "in-progress-section", cardIds: ["3", "4"] }],
      },
      {
        id: "done",
        title: "Done",
        sections: [{ id: "done-section", cardIds: ["5"] }],
      },
    ],
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
