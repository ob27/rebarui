import type { CardData } from "./types";

export const SEED_CARDS: CardData[] = [
  {
    id: "card-1",
    columnId: "todo",
    title: "Design empty-column state",
    description: "What a column with zero cards should look like",
    assignee: "A",
  },
  {
    id: "card-2",
    columnId: "todo",
    title: "Write onboarding copy",
    assignee: "J",
  },
  {
    id: "card-3",
    columnId: "inProgress",
    title: "Fix drag ghost offset",
    description: "Card image lags behind the cursor on drop",
    status: "Blocked",
    assignee: "M",
  },
  {
    id: "card-4",
    columnId: "inProgress",
    title: "Wire up search filter",
    assignee: "S",
  },
  {
    id: "card-5",
    columnId: "done",
    title: "Set up project scaffold",
    assignee: "T",
  },
];
