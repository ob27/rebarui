// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Avatar, Box, Button, Card, Input, Stack } from "rebar-ui";
import { COLUMNS } from "./types";
import type { ColumnId, SprintCard } from "./types";
import { SEED_CARDS } from "./seedData";

interface DragState {
  cardId: string;
  from: ColumnId;
}

interface OverTarget {
  column: ColumnId;
  index: number;
}

function statusTone(status: SprintCard["status"]): "error" | "warning" | undefined {
  if (status === "Blocked") return "error";
  if (status === "Review") return "warning";
  return undefined;
}

export default function App() {
  const [cards, setCards] = useState<Record<ColumnId, SprintCard[]>>(SEED_CARDS);
  const [query, setQuery] = useState("");
  const [addingIn, setAddingIn] = useState<ColumnId | null>(null);
  const [draft, setDraft] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [overTarget, setOverTarget] = useState<OverTarget | null>(null);
  const idCounter = useRef(0);

  const normalizedQuery = query.trim().toLowerCase();

  function moveCard(cardId: string, from: ColumnId, to: ColumnId, toIndexRaw: number) {
    setCards((prev) => {
      const sourceList = prev[from];
      const cardIndex = sourceList.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const card = sourceList[cardIndex];

      // Column cap: only relevant when the card is landing in a column it wasn't already in —
      // reordering within the same (already-valid) column can never push it over.
      const cap = COLUMNS.find((c) => c.id === to)?.cap;
      if (cap !== undefined && to !== from && prev[to].length >= cap) {
        return prev;
      }

      const newSource = [...sourceList];
      newSource.splice(cardIndex, 1);

      let toIndex = toIndexRaw;
      if (from === to && cardIndex < toIndex) {
        toIndex -= 1; // removing the card earlier in the same list shifts later indices down
      }

      const destList = from === to ? newSource : [...prev[to]];
      const clampedIndex = Math.max(0, Math.min(toIndex, destList.length));
      destList.splice(clampedIndex, 0, card);

      if (from === to) {
        return { ...prev, [to]: destList };
      }
      return { ...prev, [from]: newSource, [to]: destList };
    });
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, cardId: string, from: ColumnId) {
    setDrag({ cardId, from });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
  }

  function handleDragEnd() {
    setDrag(null);
    setOverTarget(null);
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    if (!drag) return;

    const cap = COLUMNS.find((c) => c.id === columnId)?.cap;
    if (cap !== undefined && columnId !== drag.from && cards[columnId].length >= cap) {
      // Leaving this un-prevented tells the browser the drop isn't allowed here (shows a
      // "no drop" cursor) and means onDrop simply won't fire for this column — a real rejection,
      // not just a cosmetic discouragement.
      setOverTarget(null);
      return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const container = e.currentTarget;
    const cardEls = Array.from(
      container.querySelectorAll<HTMLElement>('[data-card-id]:not([data-hidden="true"])'),
    );
    let index = cardEls.length;
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (e.clientY < midpoint) {
        index = i;
        break;
      }
    }
    setOverTarget({ column: columnId, index });
  }

  function handleColumnDrop(e: DragEvent<HTMLDivElement>, columnId: ColumnId) {
    e.preventDefault();
    if (!drag) return;
    const targetIndex =
      overTarget?.column === columnId ? overTarget.index : cards[columnId].length;
    moveCard(drag.cardId, drag.from, columnId, targetIndex);
    setDrag(null);
    setOverTarget(null);
  }

  function startAdd(columnId: ColumnId) {
    setAddingIn(columnId);
    setDraft("");
  }

  function cancelAdd() {
    setAddingIn(null);
    setDraft("");
  }

  function commitAdd(columnId: ColumnId) {
    const title = draft.trim();
    if (!title) return; // title required — Enter on an empty draft is a no-op, field stays open
    idCounter.current += 1;
    const newCard: SprintCard = {
      id: `new-${idCounter.current}`,
      title,
      status: null,
    };
    setCards((prev) => ({ ...prev, [columnId]: [newCard, ...prev[columnId]] }));
    setAddingIn(null);
    setDraft("");
  }

  function handleDraftKeyDown(e: KeyboardEvent<HTMLInputElement>, columnId: ColumnId) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd(columnId);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  }

  return (
    <Box style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Stack gap="lg">
        <Box as="h1" style={{ fontSize: 20, margin: 0 }}>
          Sprint Board
        </Box>

        <Input
          aria-label="Search cards"
          placeholder="Search cards by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 320 }}
        />

        <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
          {COLUMNS.map((column) => {
            const list = cards[column.id];
            const countLabel = column.cap ? `${list.length}/${column.cap}` : `${list.length}`;

            return (
              <Box
                key={column.id}
                as="section"
                style={{
                  flex: "1 1 260px",
                  minWidth: 240,
                  background: "var(--rebar-surface, #f4f4f4)",
                  borderRadius: 8,
                  padding: 12,
                }}
                onDragOver={(e) => handleColumnDragOver(e, column.id)}
                onDrop={(e) => handleColumnDrop(e, column.id)}
              >
                <Stack gap="sm">
                  <Stack direction="row" justify="between" align="center">
                    <Box as="h2" style={{ fontSize: 15, margin: 0 }}>
                      {column.title}
                    </Box>
                    <Box as="span" style={{ fontSize: 13, opacity: 0.7 }}>
                      {countLabel}
                    </Box>
                  </Stack>

                  {addingIn === column.id ? (
                    <Stack direction="row" gap="xs">
                      <Input
                        autoFocus
                        aria-label={`New card title for ${column.title}`}
                        placeholder="Card title"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => handleDraftKeyDown(e, column.id)}
                        onBlur={cancelAdd}
                        size="sm"
                      />
                    </Stack>
                  ) : (
                    <Button variant="tertiary" size="sm" onClick={() => startAdd(column.id)}>
                      + Add card
                    </Button>
                  )}

                  <Stack gap="sm">
                    {list.map((card) => {
                      const matches =
                        !normalizedQuery || card.title.toLowerCase().includes(normalizedQuery);
                      return (
                        <Card
                          key={card.id}
                          data-card-id={card.id}
                          data-hidden={matches ? undefined : "true"}
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                          onDragEnd={handleDragEnd}
                          style={{ display: matches ? undefined : "none", cursor: "grab" }}
                          title={card.title}
                          subtitle={card.description}
                          labels={
                            card.status
                              ? [{ label: card.status, tone: statusTone(card.status) }]
                              : undefined
                          }
                          footer={
                            card.assignee ? (
                              <Avatar fallback={card.assignee} size="sm" />
                            ) : undefined
                          }
                        />
                      );
                    })}
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
