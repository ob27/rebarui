import { BlockRenderer } from "@rebar-ui/placement";
import type { Construct } from "@rebar-ui/placement";

// Sprint Board — expressed entirely as a `card-kanban` block's own literal data. Drag-and-drop,
// search-filter, add-card, and cap enforcement are all built into the block/Kanban component
// itself; this file only supplies the seed data and renders it through `BlockRenderer`.
const blocks: Construct[] = [
  {
    type: "card-kanban",
    title: "Sprint Board",
    // Spec requires a new card to land at the top of its column.
    addPosition: "start",
    columns: [
      {
        id: "todo",
        title: "To Do",
        // No `limit` — "To Do" is intentionally uncapped, so per the spec's known/accepted gap it
        // also shows no count badge (Kanban's column header only renders a count/cap badge when
        // `limit` is set; there's no pure-data way to show a plain count on an uncapped column).
        sections: [{ id: "todo-section", cardIds: ["t1", "t2"] }],
      },
      {
        id: "in-progress",
        title: "In Progress",
        // Soft cap of 4 — renders as the "n/4" badge and rejects drops/adds past it.
        limit: 4,
        sections: [{ id: "in-progress-section", cardIds: ["p1", "p2"] }],
      },
      {
        id: "done",
        title: "Done",
        sections: [{ id: "done-section", cardIds: ["d1"] }],
      },
    ],
    cards: {
      t1: {
        id: "t1",
        title: "Design empty states",
        description: "Sketch zero-data screens for the dashboard",
        assignee: "A",
      },
      t2: {
        id: "t2",
        title: "Write onboarding copy",
        assignee: "R",
      },
      p1: {
        id: "p1",
        title: "Fix auth token refresh bug",
        description: "Token silently expires after 30 min idle",
        statusTag: { label: "Blocked", tone: "error" },
        assignee: "J",
      },
      p2: {
        id: "p2",
        title: "Build card drag reorder",
        statusTag: { label: "Review", tone: "info" },
        assignee: "T",
      },
      d1: {
        id: "d1",
        title: "Set up CI pipeline",
        assignee: "M",
      },
    },
  },
];

export default function App() {
  return <BlockRenderer blocks={blocks} />;
}
