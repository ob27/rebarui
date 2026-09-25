import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Stack, Input, Button } from "rebar-ui";
import { COLUMNS, seedBoard, makeCardId } from "./board";
import type { ColumnId, SprintCard } from "./board";
import { SprintCardView } from "./SprintCardView";

const COLUMN_IDS = COLUMNS.map((c) => c.id);

/** Given a column's list container and the current pointer Y, finds the card element the
 * dragged card should land *before* — the classic "closest midpoint below the pointer" reorder
 * heuristic. Returns null to mean "insert at the end." Hidden (search-filtered) and the
 * currently-dragging card are excluded so they can't be used as a drop reference. */
function findDropTargetId(container: HTMLElement, y: number): string | null {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>('[data-card-id]:not([data-dragging="true"]):not([data-hidden="true"])'),
  );
  let closestOffset = Number.NEGATIVE_INFINITY;
  let closestId: string | null = null;
  for (const el of candidates) {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestId = el.dataset.cardId ?? null;
    }
  }
  return closestId;
}

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, SprintCard[]>>(() => seedBoard());
  const [search, setSearch] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [addValue, setAddValue] = useState("");
  const listRefs = useRef<Partial<Record<ColumnId, HTMLDivElement | null>>>({});

  const query = search.trim().toLowerCase();

  function isAtCap(columnId: ColumnId): boolean {
    const def = COLUMNS.find((c) => c.id === columnId);
    return def?.cap !== undefined && columns[columnId].length >= def.cap;
  }

  function moveCard(cardId: string, destColumn: ColumnId, beforeCardId: string | null) {
    setColumns((prev) => {
      let sourceColumn: ColumnId | null = null;
      let card: SprintCard | undefined;
      for (const col of COLUMN_IDS) {
        const found = prev[col].find((c) => c.id === cardId);
        if (found) {
          sourceColumn = col;
          card = found;
          break;
        }
      }
      if (!sourceColumn || !card) return prev;

      const movingBetweenColumns = sourceColumn !== destColumn;
      const destDef = COLUMNS.find((c) => c.id === destColumn);
      if (movingBetweenColumns && destDef?.cap !== undefined && prev[destColumn].length >= destDef.cap) {
        // Reject: destination is at its soft cap and this card isn't already one of its cards.
        return prev;
      }

      const next: Record<ColumnId, SprintCard[]> = {
        todo: [...prev.todo],
        inprogress: [...prev.inprogress],
        done: [...prev.done],
      };
      next[sourceColumn] = next[sourceColumn].filter((c) => c.id !== cardId);

      const destList = movingBetweenColumns ? next[destColumn] : next[sourceColumn];
      let insertIndex = destList.length;
      if (beforeCardId) {
        const idx = destList.findIndex((c) => c.id === beforeCardId);
        if (idx !== -1) insertIndex = idx;
      }
      destList.splice(insertIndex, 0, card);
      if (movingBetweenColumns) {
        next[destColumn] = destList;
      } else {
        next[sourceColumn] = destList;
      }
      return next;
    });
  }

  function handleDragStart(cardId: string) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("text/plain", cardId);
      event.dataTransfer.effectAllowed = "move";
      setDraggingCardId(cardId);
    };
  }

  function handleDragEnd() {
    setDraggingCardId(null);
  }

  function handleColumnDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleColumnDrop(columnId: ColumnId) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const cardId = event.dataTransfer.getData("text/plain") || draggingCardId;
      if (!cardId) return;
      const container = listRefs.current[columnId];
      const beforeId = container ? findDropTargetId(container, event.clientY) : null;
      moveCard(cardId, columnId, beforeId);
      setDraggingCardId(null);
    };
  }

  function openAddCard(columnId: ColumnId) {
    setAddingColumn(columnId);
    setAddValue("");
  }

  function closeAddCard() {
    setAddingColumn(null);
    setAddValue("");
  }

  function submitAddCard(columnId: ColumnId) {
    const title = addValue.trim();
    if (!title) return;
    if (isAtCap(columnId)) return; // reject: at cap, same as a rejected drop
    const newCard: SprintCard = {
      id: makeCardId(),
      title,
      status: null,
      assignee: "?",
    };
    setColumns((prev) => ({
      ...prev,
      [columnId]: [newCard, ...prev[columnId]],
    }));
    closeAddCard();
  }

  function handleAddKeyDown(columnId: ColumnId) {
    return (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitAddCard(columnId);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeAddCard();
      }
    };
  }

  return (
    <Box style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 16px" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            aria-label="Search cards"
            placeholder="Search cards by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </Stack>

        <Stack direction="row" gap="lg" align="start">
          {COLUMNS.map((columnDef) => {
            const cards = columns[columnDef.id];
            const atCap = isAtCap(columnDef.id);
            const countLabel = columnDef.cap !== undefined ? `${cards.length}/${columnDef.cap}` : `${cards.length}`;

            return (
              <Box
                key={columnDef.id}
                style={{
                  flex: "1 1 0",
                  minWidth: 240,
                  background: "var(--rebar-surface-2, #f3f3f3)",
                  borderRadius: 8,
                  padding: 12,
                }}
                onDragOver={handleColumnDragOver}
                onDrop={handleColumnDrop(columnDef.id)}
              >
                <Stack gap="sm">
                  <Stack direction="row" justify="between" align="center">
                    <strong>{columnDef.title}</strong>
                    <span
                      data-rebar-testid="column-count"
                      style={{
                        fontSize: 12,
                        opacity: 0.7,
                        fontWeight: atCap ? 700 : 400,
                        color: atCap ? "var(--rebar-tone-error, #b42318)" : undefined,
                      }}
                    >
                      {countLabel}
                    </span>
                  </Stack>

                  {addingColumn === columnDef.id ? (
                    <Stack direction="row" gap="xs">
                      <Input
                        autoFocus
                        aria-label="New card title"
                        placeholder="Card title…"
                        value={addValue}
                        onChange={(e) => setAddValue(e.target.value)}
                        onKeyDown={handleAddKeyDown(columnDef.id)}
                        onBlur={closeAddCard}
                        style={{ flex: 1 }}
                      />
                    </Stack>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openAddCard(columnDef.id)}
                      disabled={atCap}
                    >
                      + Add card
                    </Button>
                  )}

                  <div
                    ref={(el) => {
                      listRefs.current[columnDef.id] = el;
                    }}
                    data-rebar-testid={`column-list-${columnDef.id}`}
                  >
                    <Stack gap="sm">
                      {cards.map((card) => {
                        const hidden = query.length > 0 && !card.title.toLowerCase().includes(query);
                        return (
                          <SprintCardView
                            key={card.id}
                            card={card}
                            onDragStart={handleDragStart(card.id)}
                            onDragEnd={handleDragEnd}
                            isDragging={draggingCardId === card.id}
                            hidden={hidden}
                          />
                        );
                      })}
                    </Stack>
                  </div>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
