// Sprint Board — built from Imitation/Synthetic-tier primitives only (Box/Stack/Card/Tag/Input/
// Button/Avatar). Drag-and-drop, search-filter, and add-card behavior are all hand-written here;
// no `Kanban` import from rebar-ui. See bench/KANBAN_BENCHMARK_SPEC.md for the exact spec.
import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Avatar, Box, Button, Card, Input, Stack, Tag } from "rebar-ui";

type ColumnId = "todo" | "inprogress" | "done";

interface CardData {
  id: string;
  title: string;
  description?: string;
  status?: "Blocked" | "Review";
  assignee?: string;
}

interface ColumnMeta {
  id: ColumnId;
  title: string;
  cap?: number;
}

const COLUMNS: ColumnMeta[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress", cap: 4 },
  { id: "done", title: "Done" },
];

const CAPS: Partial<Record<ColumnId, number>> = COLUMNS.reduce(
  (acc, col) => (col.cap !== undefined ? { ...acc, [col.id]: col.cap } : acc),
  {} as Partial<Record<ColumnId, number>>,
);

let idCounter = 0;
function generateId(): string {
  idCounter += 1;
  return `card-${Date.now()}-${idCounter}`;
}

const SEED: Record<ColumnId, CardData[]> = {
  todo: [
    { id: generateId(), title: "Set up CI pipeline", description: "GitHub Actions, lint + test", assignee: "A" },
    { id: generateId(), title: "Write onboarding docs", assignee: "B" },
  ],
  inprogress: [
    {
      id: generateId(),
      title: "Refactor auth module",
      description: "Split token refresh out of login flow",
      status: "Blocked",
      assignee: "C",
    },
    { id: generateId(), title: "Design new dashboard", assignee: "D" },
  ],
  done: [{ id: generateId(), title: "Migrate database schema", assignee: "E" }],
};

interface DragPayload {
  cardId: string;
  from: ColumnId;
}

const DRAG_MIME = "application/x-sprint-card";

function matchesSearch(card: CardData, term: string): boolean {
  if (!term) return true;
  return card.title.toLowerCase().includes(term.toLowerCase());
}

export default function App() {
  const [cards, setCards] = useState<Record<ColumnId, CardData[]>>(SEED);
  const [search, setSearch] = useState("");
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [addValue, setAddValue] = useState("");

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, beforeCardId: string | null) {
    setCards((prev) => {
      const source = [...prev[from]];
      const cardIdx = source.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return prev;
      const [card] = source.splice(cardIdx, 1);

      const targetBase = from === to ? source : prev[to];
      const cap = CAPS[to];
      if (from !== to && cap !== undefined && targetBase.length >= cap) {
        // Rejected: target column is already at its cap.
        return prev;
      }

      const target = [...targetBase];
      let insertIndex = beforeCardId ? target.findIndex((c) => c.id === beforeCardId) : -1;
      if (insertIndex === -1) insertIndex = target.length;
      target.splice(insertIndex, 0, card);

      if (from === to) {
        return { ...prev, [from]: target };
      }
      return { ...prev, [from]: source, [to]: target };
    });
  }

  function addCard(columnId: ColumnId, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    setCards((prev) => {
      const list = prev[columnId];
      const cap = CAPS[columnId];
      if (cap !== undefined && list.length >= cap) return prev;
      const newCard: CardData = { id: generateId(), title: trimmed };
      return { ...prev, [columnId]: [newCard, ...list] };
    });
  }

  function handleCardDragStart(e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) {
    const payload: DragPayload = { cardId, from };
    e.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  }

  function readPayload(e: DragEvent<HTMLDivElement>): DragPayload | null {
    const raw = e.dataTransfer.getData(DRAG_MIME);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as DragPayload;
    } catch {
      return null;
    }
  }

  function handleCardDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  }

  function handleCardDrop(e: DragEvent<HTMLDivElement>, columnId: ColumnId, beforeCardId: string) {
    e.preventDefault();
    e.stopPropagation();
    const payload = readPayload(e);
    if (!payload) return;
    moveCard(payload.cardId, payload.from, columnId, beforeCardId);
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleColumnDrop(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    e.preventDefault();
    const payload = readPayload(e);
    if (!payload) return;
    moveCard(payload.cardId, payload.from, columnId, null);
  }

  return (
    <Box style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 16px" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Box as="h1" style={{ margin: 0, fontSize: 24 }}>
            Sprint Board
          </Box>
          <Input
            placeholder="Search cards by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search cards"
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
          {COLUMNS.map((col) => {
            const fullList = cards[col.id];
            const trimmedSearch = search.trim();
            const visibleList = trimmedSearch
              ? fullList.filter((c) => matchesSearch(c, trimmedSearch))
              : fullList;
            const atCap = col.cap !== undefined && fullList.length >= col.cap;
            const isAdding = addingColumn === col.id;

            return (
              <Box
                key={col.id}
                data-column={col.id}
                onDragOver={handleColumnDragOver}
                onDrop={(e) => handleColumnDrop(e, col.id)}
                style={{
                  flex: "1 1 260px",
                  minWidth: 260,
                  background: "var(--rebar-color-surface-subtle, #f4f4f5)",
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 200,
                }}
              >
                <Stack gap="sm">
                  <Stack direction="row" justify="between" align="center">
                    <Box as="h2" style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                      {col.title}
                    </Box>
                    <Tag tone={atCap ? "warning" : "default"}>
                      {col.cap !== undefined ? `${fullList.length}/${col.cap}` : fullList.length}
                    </Tag>
                  </Stack>

                  {isAdding ? (
                    <Input
                      autoFocus
                      placeholder="Card title"
                      value={addValue}
                      onChange={(e) => setAddValue(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          addCard(col.id, addValue);
                          setAddValue("");
                          setAddingColumn(null);
                        } else if (e.key === "Escape") {
                          setAddValue("");
                          setAddingColumn(null);
                        }
                      }}
                    />
                  ) : (
                    <Button
                      variant="tertiary"
                      size="sm"
                      disabled={atCap}
                      onClick={() => {
                        setAddValue("");
                        setAddingColumn(col.id);
                      }}
                    >
                      + Add card
                    </Button>
                  )}

                  <Stack gap="sm">
                    {visibleList.map((card) => (
                      <Card
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleCardDragStart(e, card.id, col.id)}
                        onDragOver={handleCardDragOver}
                        onDrop={(e) => handleCardDrop(e, col.id, card.id)}
                        title={card.title}
                        subtitle={card.description}
                        extra={card.status ? <Tag tone={card.status === "Blocked" ? "error" : "info"}>{card.status}</Tag> : undefined}
                        footer={
                          card.assignee ? <Avatar fallback={card.assignee} size="sm" /> : undefined
                        }
                        style={{ cursor: "grab" }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
