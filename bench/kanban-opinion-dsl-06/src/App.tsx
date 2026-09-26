// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import { BlockRenderer, type Construct } from "@rebar-ui/placement";

const board: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards...",
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` — "To Do" is intentionally uncapped, so it gets no count badge (a known,
        // accepted gap in what `card-kanban`'s literal data can express — see the spec's "Known,
        // accepted gap" note).
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
        description: "Cover install, first project, and deploy",
        assignee: "R",
      },
      "card-2": {
        id: "card-2",
        title: "Set up CI pipeline",
        description: "Lint, typecheck, and test on every PR",
        assignee: "T",
      },
      "card-3": {
        id: "card-3",
        title: "Fix flaky drag-drop test",
        description: "Intermittent failure on the Firefox runner",
        assignee: "J",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "card-4": {
        id: "card-4",
        title: "Design empty states",
        description: "Board, search, and column-empty variants",
        assignee: "M",
        statusTag: { label: "Review", tone: "info" },
      },
      "card-5": {
        id: "card-5",
        title: "Ship v0.1 release notes",
        description: "Summarize the last sprint's changes",
        assignee: "R",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={board} />;
}
