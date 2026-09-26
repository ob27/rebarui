// Build the Sprint Board here using a `card-kanban` block from @rebar-ui/placement — see
// bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and this condition's own constraint.
//
// Everything the spec asks for — three fixed columns, seed cards, a status tag, an assignee
// avatar, drag-and-drop, search, add-card, and the "In Progress" 4-card cap — is expressed as
// plain literal data on a single `card-kanban` block. `BlockRenderer` owns all the behavior
// (drag/reorder, search filtering, add-card, cap enforcement); this file only declares the board.
import { BlockRenderer } from "@rebar-ui/placement";
import type { Construct } from "@rebar-ui/placement";

const board: Construct = {
  type: "card-kanban",
  title: "Sprint Board",
  addPosition: "start",
  columns: [
    {
      id: "todo",
      title: "To Do",
      sections: [{ id: "todo-section", cardIds: ["design-empty-states", "onboarding-copy"] }],
    },
    {
      id: "in-progress",
      title: "In Progress",
      limit: 4,
      sections: [{ id: "in-progress-section", cardIds: ["pagination-bug", "auth-refactor"] }],
    },
    {
      id: "done",
      title: "Done",
      sections: [{ id: "done-section", cardIds: ["release-notes"] }],
    },
  ],
  cards: {
    "design-empty-states": {
      id: "design-empty-states",
      title: "Design empty states",
      description: "Cover the zero-data view for the dashboard",
      assignee: "A",
    },
    "onboarding-copy": {
      id: "onboarding-copy",
      title: "Write onboarding copy",
      description: "Draft the first-run tour text",
      assignee: "J",
    },
    "pagination-bug": {
      id: "pagination-bug",
      title: "Fix pagination bug",
      description: "Page size resets on filter change",
      statusTag: { label: "Blocked", tone: "error" },
      assignee: "M",
    },
    "auth-refactor": {
      id: "auth-refactor",
      title: "Refactor auth middleware",
      description: "Split token refresh from session check",
      statusTag: { label: "Review", tone: "warning" },
      assignee: "S",
    },
    "release-notes": {
      id: "release-notes",
      title: "Ship v1.2 release notes",
      description: "Publish the changelog and tag the release",
      assignee: "T",
    },
  },
};

const constructs: Construct[] = [board];

export default function App() {
  return <BlockRenderer blocks={constructs} />;
}
