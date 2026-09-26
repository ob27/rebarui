// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
//
// This condition is a pure-data exercise: everything the spec asks for (columns, seed cards,
// assignee avatars, status tags, the "In Progress" cap, search, drag-and-drop, add-card) is
// expressed as a literal `card-kanban` block and handed to `BlockRenderer`. No `Kanban` import,
// no hand-written drag/search/add/cap logic, no `renderCard`/`renderColumnTitle`.
import { BlockRenderer } from "@rebar-ui/placement";
import type { Construct } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    searchPlaceholder: "Search cards...",
    // New cards go to the top of their column, per spec.
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` here — per the spec's "Known, accepted gap," an uncapped column has no way
        // to show a plain count through pure block data, so "To Do" intentionally shows none.
        sections: [{ id: "todo-section", cardIds: ["design-review", "write-docs"] }],
      },
      {
        id: "in-progress",
        title: "In Progress",
        // Soft cap of 4 — this is what makes the built-in "3/4" badge (and drop/add rejection
        // past it) appear at all.
        limit: 4,
        sections: [
          { id: "in-progress-section", cardIds: ["auth-flow", "api-integration"], limit: 4 },
        ],
      },
      {
        id: "done",
        title: "Done",
        sections: [{ id: "done-section", cardIds: ["project-setup"] }],
      },
    ],
    cards: {
      "design-review": {
        id: "design-review",
        title: "Design review for onboarding flow",
        description: "Walk through the new user onboarding screens with design.",
        assignee: "A",
      },
      "write-docs": {
        id: "write-docs",
        title: "Write API docs",
        description: "Document the public endpoints added this sprint.",
        assignee: "M",
      },
      "auth-flow": {
        id: "auth-flow",
        title: "Auth flow rework",
        description: "Swap in the new session refresh logic.",
        assignee: "J",
        statusTag: { label: "Blocked", tone: "error" },
      },
      "api-integration": {
        id: "api-integration",
        title: "Integrate billing API",
        description: "Wire up the new billing provider's webhooks.",
        assignee: "S",
        statusTag: { label: "Review", tone: "info" },
      },
      "project-setup": {
        id: "project-setup",
        title: "Project scaffolding",
        description: "Repo, CI, and base dependencies.",
        assignee: "M",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
