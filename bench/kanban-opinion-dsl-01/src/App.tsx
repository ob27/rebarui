// Sprint Board — kanban-opinion-dsl condition.
//
// Per bench/KANBAN_BENCHMARK_SPEC.md's `kanban-opinion-dsl-*` constraint: this authors a single
// `card-kanban` block (from @rebar-ui/placement) as a literal `Construct[]` and renders it through
// `BlockRenderer`. No `Kanban` import, no drag/search/add-card/cap logic, no `renderCard`/
// `renderColumnTitle` — every requirement in the spec is expressed as the block's own data
// (`columns`/`cards`, using `assignee`/`statusTag`/`addPosition` directly). Search, drag-and-drop,
// add-card, and column-cap enforcement are all built into the block itself.
import { BlockRenderer, type Construct } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    // New cards go to the top of their column (spec: "+ Add card" inserts at the top).
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        sections: [
          {
            id: "todo-main",
            cardIds: ["t1", "t2"],
          },
        ],
      },
      {
        id: "in-progress",
        title: "In Progress",
        // Soft cap of 4 — Kanban itself renders the "N/4" badge next to the title and rejects
        // any drag-drop or add-card submission that would exceed it.
        limit: 4,
        sections: [
          {
            id: "in-progress-main",
            cardIds: ["p1", "p2"],
          },
        ],
      },
      {
        id: "done",
        title: "Done",
        sections: [
          {
            id: "done-main",
            cardIds: ["d1"],
          },
        ],
      },
    ],
    cards: {
      t1: {
        id: "t1",
        title: "Set up CI pipeline",
        description: "Configure lint + test workflow on every PR",
        assignee: "A",
      },
      t2: {
        id: "t2",
        title: "Design empty states",
        description: "Cover zero-data cases across list views",
        assignee: "B",
      },
      p1: {
        id: "p1",
        title: "Implement OAuth login",
        description: "Google + GitHub providers",
        assignee: "C",
        statusTag: { label: "Blocked", tone: "error" },
      },
      p2: {
        id: "p2",
        title: "Refactor billing service",
        description: "Split into smaller modules",
        assignee: "D",
        statusTag: { label: "Review", tone: "warning" },
      },
      d1: {
        id: "d1",
        title: "Ship onboarding tour",
        description: "Launched to 100% of new signups",
        assignee: "E",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
