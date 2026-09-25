import { useCallback, useRef, useState, type DragEvent } from "react";
import { Box, Input, Stack } from "rebar-ui";
import { SprintColumn } from "./SprintColumn";
import { COLUMN_DEFS, IN_PROGRESS_CAP, seedColumns } from "./seedData";
import type { CardData, ColumnId, DragPayload } from "./types";

export default function App() {
  const [columns, setColumns] = useState<Record<ColumnId, CardData[]>>(seedColumns);
  const [query, setQuery] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const idCounter = useRef(0);

  const moveCard = useCallback(
    (payload: DragPayload, toColumn: ColumnId, toIndex: number | "end") => {
      setColumns((prev) => {
        const { cardId, from } = payload;
        const fromList = prev[from];
        const sourceIndex = fromList.findIndex((c) => c.id === cardId);
        if (sourceIndex === -1) return prev;

        // Reject a cross-column drop into "In Progress" once it's at its soft cap.
        if (toColumn === "inProgress" && from !== "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) {
          return prev;
        }

        const workingFrom = [...fromList];
        const [card] = workingFrom.splice(sourceIndex, 1);

        const sameColumn = toColumn === from;
        const workingTo = sameColumn ? workingFrom : [...prev[toColumn]];

        let insertIndex = toIndex === "end" ? workingTo.length : toIndex;
        if (sameColumn && toIndex !== "end" && sourceIndex < toIndex) insertIndex -= 1;
        insertIndex = Math.max(0, Math.min(insertIndex, workingTo.length));
        workingTo.splice(insertIndex, 0, card);

        return {
          ...prev,
          [from]: sameColumn ? workingTo : workingFrom,
          [toColumn]: workingTo,
        };
      });
    },
    [],
  );

  const handleDropOnCard = useCallback(
    (e: DragEvent<HTMLDivElement>, toColumn: ColumnId, toIndex: number) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;
      const payload = JSON.parse(raw) as DragPayload;
      moveCard(payload, toColumn, toIndex);
      setDraggingId(null);
    },
    [moveCard],
  );

  const handleDropOnColumn = useCallback(
    (e: DragEvent<HTMLDivElement>, toColumn: ColumnId) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;
      const payload = JSON.parse(raw) as DragPayload;
      moveCard(payload, toColumn, "end");
      setDraggingId(null);
    },
    [moveCard],
  );

  const handleAddCard = useCallback((column: ColumnId, title: string) => {
    setColumns((prev) => {
      if (column === "inProgress" && prev.inProgress.length >= IN_PROGRESS_CAP) return prev;
      idCounter.current += 1;
      const newCard: CardData = {
        id: `new-${idCounter.current}-${Date.now()}`,
        title,
        assignee: "?",
      };
      return { ...prev, [column]: [newCard, ...prev[column]] };
    });
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack direction="column" gap="lg">
        <h1 style={{ margin: 0 }}>Sprint Board</h1>
        <Input
          placeholder="Search cards by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search cards"
        />
        <Stack direction="row" gap="md" align="start" style={{ alignItems: "flex-start" }}>
          {COLUMN_DEFS.map(({ id, title }) => {
            const allCards = columns[id];
            const visibleCards = normalizedQuery
              ? allCards.filter((c) => c.title.toLowerCase().includes(normalizedQuery))
              : allCards;
            return (
              <SprintColumn
                key={id}
                id={id}
                title={title}
                allCards={allCards}
                visibleCards={visibleCards}
                draggingId={draggingId}
                onDragStartCard={(payload) => setDraggingId(payload.cardId)}
                onDragEndCard={() => setDraggingId(null)}
                onDropOnCard={handleDropOnCard}
                onDropOnColumn={handleDropOnColumn}
                onAddCard={handleAddCard}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
