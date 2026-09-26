// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import type { Construct } from "@rebar-ui/placement";
import { BlockRenderer } from "@rebar-ui/placement";

// `KanbanCardData`/`KanbanColumnData` aren't exported from the package's public entry point
// (only `Construct` and the `*Source`/`*Handler` live-binding types are) — derive their shapes
// from the `card-kanban` member of `Construct` itself rather than duplicating them by hand.
type CardKanbanBlock = Extract<Construct, { type: "card-kanban" }>;
type KanbanCardData = NonNullable<CardKanbanBlock["cards"]>[string];
type KanbanColumnData = NonNullable<CardKanbanBlock["columns"]>[number];

const CARDS: Record<string, KanbanCardData> = {
  "design-review": {
    id: "design-review",
    title: "Design review for onboarding flow",
    description: "Walk through the new user wireframes with the team",
    assignee: "P",
  },
  "api-contracts": {
    id: "api-contracts",
    title: "Define API contracts",
    assignee: "J",
  },
  "auth-flow": {
    id: "auth-flow",
    title: "Implement auth flow",
    description: "OAuth against the identity provider",
    statusTag: { label: "Blocked", tone: "error" },
    assignee: "R",
  },
  "dashboard-charts": {
    id: "dashboard-charts",
    title: "Dashboard charts",
    statusTag: { label: "Review", tone: "info" },
    assignee: "S",
  },
  "release-notes": {
    id: "release-notes",
    title: "Write release notes",
    assignee: "P",
  },
};

const COLUMNS: KanbanColumnData[] = [
  {
    id: "todo",
    title: "To Do",
    sections: [{ id: "todo-main", cardIds: ["design-review", "api-contracts"] }],
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
    sections: [{ id: "done-main", cardIds: ["release-notes"] }],
  },
];

const BLOCKS: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    columns: COLUMNS,
    cards: CARDS,
    searchPlaceholder: "Search cards...",
    addPosition: "start",
  },
];

export default function App() {
  return <BlockRenderer blocks={BLOCKS} />;
}
