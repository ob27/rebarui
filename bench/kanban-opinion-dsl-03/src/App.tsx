// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import type { Construct } from "@rebar-ui/placement";
import { BlockRenderer } from "@rebar-ui/placement";

type CardKanbanBlock = Extract<Construct, { type: "card-kanban" }>;
type KanbanCardData = NonNullable<CardKanbanBlock["cards"]>[string];
type KanbanColumnData = NonNullable<CardKanbanBlock["columns"]>[number];

const cards: Record<string, KanbanCardData> = {
  "card-1": {
    id: "card-1",
    title: "Set up CI pipeline",
    description: "GitHub Actions for lint/test/build",
    assignee: "T",
  },
  "card-2": {
    id: "card-2",
    title: "Design empty states",
    description: "Board, list, and search-no-results variants",
    assignee: "A",
  },
  "card-3": {
    id: "card-3",
    title: "Implement search filter",
    description: "Case-insensitive substring match across columns",
    assignee: "J",
    statusTag: { label: "Blocked", tone: "error" },
  },
  "card-4": {
    id: "card-4",
    title: "Wire up drag-and-drop",
    assignee: "T",
    statusTag: { label: "Review", tone: "info" },
  },
  "card-5": {
    id: "card-5",
    title: "Ship v0.1 release notes",
    assignee: "A",
  },
};

const columns: KanbanColumnData[] = [
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
];

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards…",
    // The built-in "+ Add card" control inserts new cards at the top of the section, per spec.
    addPosition: "start",
    columns,
    cards,
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
