// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
import type { Construct } from "@rebar-ui/placement";
import { BlockRenderer } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards…",
    // New cards from the "+ Add card" control should land at the top of their column.
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` — an uncapped column intentionally shows no count badge (see the spec's
        // "Known, accepted gap" note: the schema has no way to show a plain count without a cap).
        sections: [
          {
            id: "todo-section",
            cardIds: ["design-empty-states", "write-onboarding-copy"],
          },
        ],
      },
      {
        id: "in-progress",
        title: "In Progress",
        limit: 4,
        sections: [
          {
            id: "in-progress-section",
            cardIds: ["build-search-filter", "refactor-column-header"],
          },
        ],
      },
      {
        id: "done",
        title: "Done",
        sections: [
          {
            id: "done-section",
            cardIds: ["set-up-ci-pipeline"],
          },
        ],
      },
    ],
    cards: {
      "design-empty-states": {
        id: "design-empty-states",
        title: "Design empty states",
        description: "Cover zero-data and error variants",
        assignee: "J",
      },
      "write-onboarding-copy": {
        id: "write-onboarding-copy",
        title: "Write onboarding copy",
        assignee: "K",
      },
      "build-search-filter": {
        id: "build-search-filter",
        title: "Build search filter",
        description: "Debounce input, highlight matches",
        assignee: "R",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "refactor-column-header": {
        id: "refactor-column-header",
        title: "Refactor column header",
        assignee: "M",
        statusTag: { label: "Review", tone: "info" },
      },
      "set-up-ci-pipeline": {
        id: "set-up-ci-pipeline",
        title: "Set up CI pipeline",
        assignee: "T",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
