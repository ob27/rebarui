import { useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { Avatar, Box, Button, Card, Input, Stack, Tag } from "rebar-ui";
import { createSeedBoard } from "./seedData";
import type { BoardState, CardData, ColumnId } from "./types";
import { COLUMN_LABELS, COLUMN_ORDER, IN_PROGRESS_CAP } from "./types";

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface DropTarget {
  column: ColumnId;
  index: number;
}

let newCardSeq = 0;
function newCardId(): string {
  newCardSeq += 1;
  return `new-${newCardSeq}`;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(() => createSeedBoard());
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [draft, setDraft] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  function matches(card: CardData): boolean {
    if (!normalizedQuery) return true;
    return card.title.toLowerCase().includes(normalizedQuery);
  }

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, toIndex: number) {
    setBoard((prev) => {
      const fromList = [...prev[from]];
      const fromIdx = fromList.findIndex((c) => c.id === cardId);
      if (fromIdx === -1) return prev;
      const [card] = fromList.splice(fromIdx, 1);

      if (from === to) {
        let insertAt = toIndex;
        if (fromIdx < insertAt) insertAt -= 1;
        insertAt = Math.max(0, Math.min(insertAt, fromList.length));
        fromList.splice(insertAt, 0, card);
        return { ...prev, [from]: fromList };
      }

      const toList = [...prev[to]];
      if (to === "inprogress" && toList.length >= IN_PROGRESS_CAP) {
        // Reject the drop entirely — board stays exactly as it was.
        return prev;
      }
      const insertAt = Math.max(0, Math.min(toIndex, toList.length));
      toList.splice(insertAt, 0, card);
      return { ...prev, [from]: fromList, [to]: toList };
    });
  }

  function handleDragStart(cardId: string, from: ColumnId) {
    setDragging({ cardId, from });
  }

  function handleDragEnd() {
    setDragging(null);
    setDropTarget(null);
  }

  function handleCardDragOver(e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) return;
    setDropTarget({ column, index });
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>, column: ColumnId) {
    e.preventDefault();
    if (!dragging) return;
    setDropTarget({ column, index: board[column].length });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, column: ColumnId) {
    e.preventDefault();
    if (!dragging) return;
    const target =
      dropTarget && dropTarget.column === column ? dropTarget : { column, index: board[column].length };
    moveCard(dragging.cardId, dragging.from, target.column, target.index);
    setDragging(null);
    setDropTarget(null);
  }

  function startAdding(column: ColumnId) {
    setAddingColumn(column);
    setDraft("");
  }

  function cancelAdding() {
    setAddingColumn(null);
    setDraft("");
  }

  function commitAdding(column: ColumnId) {
    const title = draft.trim();
    if (!title) return;
    if (column === "inprogress" && board.inprogress.length >= IN_PROGRESS_CAP) return;
    const card: CardData = { id: newCardId(), title, assignee: "?" };
    setBoard((prev) => ({ ...prev, [column]: [card, ...prev[column]] }));
    setAddingColumn(null);
    setDraft("");
  }

  function handleDraftKeyDown(e: KeyboardEvent<HTMLInputElement>, column: ColumnId) {
    if (e.key === "Enter") commitAdding(column);
    if (e.key === "Escape") cancelAdding();
  }

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack gap="md" style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          aria-label="Search cards"
          placeholder="Search cards by title…"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
      </Stack>

      <Stack direction="row" gap="lg" style={{ alignItems: "flex-start" }}>
        {COLUMN_ORDER.map((columnId) => {
          const cards = board[columnId];
          const visibleCards = cards.filter(matches);
          const atCap = columnId === "inprogress" && cards.length >= IN_PROGRESS_CAP;

          return (
            <div
              key={columnId}
              data-column={columnId}
              onDragOver={(e) => handleColumnDragOver(e, columnId)}
              onDrop={(e) => handleDrop(e, columnId)}
              style={{
                flex: "1 1 0",
                minWidth: 240,
                background: "rgba(0,0,0,0.03)",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Stack direction="row" justify="between" align="center" style={{ marginBottom: 12 }}>
                <strong>{COLUMN_LABELS[columnId]}</strong>
                <Tag tone={atCap ? "warning" : "default"}>
                  {columnId === "inprogress" ? `${cards.length}/${IN_PROGRESS_CAP}` : cards.length}
                </Tag>
              </Stack>

              <Stack gap="sm">
                {addingColumn === columnId ? (
                  <Input
                    autoFocus
                    aria-label={`New card title for ${COLUMN_LABELS[columnId]}`}
                    placeholder="Card title"
                    value={draft}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleDraftKeyDown(e, columnId)}
                    onBlur={cancelAdding}
                  />
                ) : (
                  <Button variant="secondary" size="sm" disabled={atCap} onClick={() => startAdding(columnId)}>
                    + Add card
                  </Button>
                )}

                {visibleCards.map((card) => {
                  const trueIndex = cards.findIndex((c) => c.id === card.id);
                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id, columnId)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleCardDragOver(e, columnId, trueIndex)}
                      style={{
                        opacity: dragging?.cardId === card.id ? 0.4 : 1,
                        cursor: "grab",
                      }}
                    >
                      <Card
                        title={card.title}
                        labels={
                          card.status
                            ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "info" }]
                            : undefined
                        }
                        footer={<Avatar fallback={card.assignee} size="sm" />}
                      >
                        {card.description}
                      </Card>
                    </div>
                  );
                })}
              </Stack>
            </div>
          );
        })}
      </Stack>
    </Box>
  );
}
