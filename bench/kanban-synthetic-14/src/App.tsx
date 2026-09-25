import { useState } from "react";
import { Box, Stack, Input } from "rebar-ui";
import { Column } from "./Column";
import { COLUMN_META, SEED_COLUMNS, createCardId } from "./data";
import type { CardData, ColumnId, DragState, DropIndicator } from "./types";

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(SEED_COLUMNS);
  const [search, setSearch] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnId | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const handleCardDragStart = (card: CardData, columnId: ColumnId) => {
    setDragState({ card, columnId });
  };

  const handleCardDragEnd = () => {
    setDragState(null);
    setDropIndicator(null);
  };

  const handleDropCard = (targetColumnId: ColumnId, index: number) => {
    const current = dragState;
    if (!current) return;
    const { card, columnId: fromColumnId } = current;

    setColumns((prev) => {
      const targetMeta = COLUMN_META.find((c) => c.id === targetColumnId);
      const wouldExceedCap =
        targetMeta?.cap !== undefined &&
        fromColumnId !== targetColumnId &&
        prev[targetColumnId].length >= targetMeta.cap;
      if (wouldExceedCap) return prev;

      const sourceList = prev[fromColumnId].filter((c) => c.id !== card.id);
      const destList = fromColumnId === targetColumnId ? sourceList : [...prev[targetColumnId]];
      const clampedIndex = Math.max(0, Math.min(index, destList.length));
      destList.splice(clampedIndex, 0, card);

      return {
        ...prev,
        [fromColumnId]: sourceList,
        [targetColumnId]: destList,
      };
    });

    setDragState(null);
    setDropIndicator(null);
  };

  const handleStartAdd = (columnId: ColumnId) => {
    setAddingColumn(columnId);
    setDraftTitle("");
  };

  const handleCancelAdd = () => {
    setAddingColumn(null);
    setDraftTitle("");
  };

  const handleSubmitAdd = (columnId: ColumnId) => {
    const title = draftTitle.trim();
    if (!title) {
      handleCancelAdd();
      return;
    }
    const meta = COLUMN_META.find((c) => c.id === columnId);
    setColumns((prev) => {
      if (meta?.cap !== undefined && prev[columnId].length >= meta.cap) return prev;
      const newCard: CardData = { id: createCardId(), title };
      return { ...prev, [columnId]: [newCard, ...prev[columnId]] };
    });
    setAddingColumn(null);
    setDraftTitle("");
  };

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <h1 style={{ margin: 0 }}>Sprint Board</h1>
          <Input
            placeholder="Search cards by title…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search cards"
          />
        </Stack>

        <Stack direction="row" gap="lg" align="start">
          {COLUMN_META.map((meta) => (
            <Column
              key={meta.id}
              meta={meta}
              cards={columns[meta.id]}
              search={search}
              dragState={dragState}
              dropIndicator={dropIndicator}
              isAdding={addingColumn === meta.id}
              draftTitle={draftTitle}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onDragOverColumn={setDropIndicator}
              onDropCard={handleDropCard}
              onStartAdd={handleStartAdd}
              onDraftTitleChange={setDraftTitle}
              onSubmitAdd={handleSubmitAdd}
              onCancelAdd={handleCancelAdd}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
