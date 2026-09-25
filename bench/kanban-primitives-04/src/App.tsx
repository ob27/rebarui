import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Button, Input, Stack, Tag } from "rebar-ui";
import { CardItem } from "./CardItem";
import { makeId, makeSeedCards } from "./seed";
import { COLUMN_ORDER, COLUMN_TITLES, IN_PROGRESS_CAP } from "./types";
import type { CardData, ColumnId } from "./types";

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface DropTarget {
  column: ColumnId;
  index: number;
}

export default function App() {
  const [board, setBoard] = useState<Record<ColumnId, CardData[]>>(() => makeSeedCards());
  const [search, setSearch] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [addValue, setAddValue] = useState("");

  function isAtCap(column: ColumnId): boolean {
    return column === "inprogress" && board[column].length >= IN_PROGRESS_CAP;
  }

  function handleDragStart(cardId: string, from: ColumnId) {
    setDragState({ cardId, from });
  }

  function handleDragEnd() {
    setDragState(null);
    setDropTarget(null);
  }

  function handleDragOverCard(e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) {
    e.preventDefault();
    setDropTarget({ column, index });
  }

  function handleDragOverColumn(e: DragEvent<HTMLDivElement>, column: ColumnId) {
    e.preventDefault();
    setDropTarget({ column, index: board[column].length });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dragged = dragState;
    const target = dropTarget;
    setDragState(null);
    setDropTarget(null);
    if (!dragged || !target) return;

    setBoard((prev) => {
      const from = dragged.from;
      const to = target.column;
      const fromList = prev[from];
      const cardIndex = fromList.findIndex((c) => c.id === dragged.cardId);
      if (cardIndex === -1) return prev;

      // Reject a cross-column drop that would push "In Progress" over its soft cap.
      if (from !== to && to === "inprogress" && prev[to].length >= IN_PROGRESS_CAP) {
        return prev;
      }

      const card = fromList[cardIndex];
      const newFromList = [...fromList];
      newFromList.splice(cardIndex, 1);

      let targetIndex = target.index;
      if (from === to && cardIndex < targetIndex) {
        targetIndex -= 1;
      }

      if (from === to) {
        newFromList.splice(targetIndex, 0, card);
        return { ...prev, [from]: newFromList };
      }

      const newToList = [...prev[to]];
      newToList.splice(targetIndex, 0, card);
      return { ...prev, [from]: newFromList, [to]: newToList };
    });
  }

  function startAdd(column: ColumnId) {
    if (isAtCap(column)) return;
    setAddingColumn(column);
    setAddValue("");
  }

  function commitAdd(column: ColumnId) {
    const title = addValue.trim();
    setAddingColumn(null);
    setAddValue("");
    if (!title || isAtCap(column)) return;
    const newCard: CardData = { id: makeId(), title, assignee: "?" };
    setBoard((prev) => ({ ...prev, [column]: [newCard, ...prev[column]] }));
  }

  function cancelAdd() {
    setAddingColumn(null);
    setAddValue("");
  }

  function handleAddKeyDown(e: KeyboardEvent<HTMLInputElement>, column: ColumnId) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd(column);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  }

  const query = search.trim().toLowerCase();

  return (
    <Box style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="sm" style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards by title…"
          aria-label="Search cards"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      <Stack direction="row" gap="md" style={{ alignItems: "flex-start" }}>
        {COLUMN_ORDER.map((columnId) => {
          const cards = board[columnId];
          const visibleCards = query
            ? cards.filter((c) => c.title.toLowerCase().includes(query))
            : cards;
          const atCap = isAtCap(columnId);

          return (
            <Box
              key={columnId}
              data-rebar-component="kanban-column"
              onDragOver={(e) => handleDragOverColumn(e, columnId)}
              onDrop={handleDrop}
              style={{
                flex: "1 1 0",
                minWidth: 240,
                background: "var(--rebar-color-surface-sunken, #f4f4f4)",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Stack
                direction="row"
                justify="between"
                align="center"
                style={{ marginBottom: 8 }}
              >
                <strong>{COLUMN_TITLES[columnId]}</strong>
                <Tag tone={atCap ? "warning" : "default"}>
                  {columnId === "inprogress" ? `${cards.length}/${IN_PROGRESS_CAP}` : cards.length}
                </Tag>
              </Stack>

              <div style={{ marginBottom: 8 }}>
                {addingColumn === columnId ? (
                  <Input
                    autoFocus
                    size="sm"
                    placeholder="Card title…"
                    aria-label="New card title"
                    value={addValue}
                    onChange={(e) => setAddValue(e.target.value)}
                    onKeyDown={(e) => handleAddKeyDown(e, columnId)}
                    onBlur={cancelAdd}
                  />
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={atCap}
                    onClick={() => startAdd(columnId)}
                  >
                    + Add card
                  </Button>
                )}
              </div>

              <Stack gap="sm">
                {visibleCards.map((card) => {
                  const trueIndex = cards.indexOf(card);
                  return (
                    <CardItem
                      key={card.id}
                      card={card}
                      dragging={dragState?.cardId === card.id}
                      onDragStart={() => handleDragStart(card.id, columnId)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOverCard(e, columnId, trueIndex)}
                      onDrop={handleDrop}
                    />
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
