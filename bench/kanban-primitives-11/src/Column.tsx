import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { Avatar, Box, Button, Card, Input, Stack, Tag } from "rebar-ui";
import type { CardItem, ColumnId, ColumnMeta } from "./types";

interface ColumnProps {
  meta: ColumnMeta;
  /** Every card in this column, regardless of the active search filter — used for the count/cap
   * badge and the add-card cap check, both of which must reflect true state, not the filtered view. */
  fullCards: CardItem[];
  /** The subset of `fullCards` that currently matches the search query (or all of them, if none). */
  visibleCards: CardItem[];
  onDropCard: (cardId: string, fromColumn: ColumnId, toColumn: ColumnId, beforeId: string | null) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

export function Column({ meta, fullCards, visibleCards, onDropCard, onAddCard }: ColumnProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const atCap = meta.cap !== undefined && fullCards.length >= meta.cap;

  function findBeforeId(e: DragEvent<HTMLDivElement>): string | null {
    const container = listRef.current;
    if (!container) return null;
    const cardEls = Array.from(container.querySelectorAll<HTMLElement>("[data-card-id]"));
    const y = e.clientY;
    for (const el of cardEls) {
      const rect = el.getBoundingClientRect();
      if (y < rect.top + rect.height / 2) {
        return el.getAttribute("data-card-id");
      }
    }
    return null;
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;
    let parsed: { id: string; fromColumn: ColumnId };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    onDropCard(parsed.id, parsed.fromColumn, meta.id, findBeforeId(e));
  }

  return (
    <Box
      data-column={meta.id}
      style={{
        flex: "1 1 260px",
        minWidth: 260,
        background: "var(--rebar-color-surface-muted, #f3f3f3)",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Stack gap="sm">
        <Stack direction="row" justify="between" align="center">
          <strong>{meta.title}</strong>
          <Tag tone={atCap ? "warning" : "default"}>
            {meta.cap !== undefined ? `${fullCards.length}/${meta.cap}` : fullCards.length}
          </Tag>
        </Stack>

        <AddCardControl disabled={atCap} onAdd={(title) => onAddCard(meta.id, title)} />

        <div ref={listRef} onDragOver={handleDragOver} onDrop={handleDrop} style={{ minHeight: 40 }}>
          <Stack gap="sm">
            {visibleCards.map((card) => (
              <div
                key={card.id}
                data-card-id={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ id: card.id, fromColumn: meta.id }),
                  );
                }}
              >
                <Card
                  title={card.title}
                  subtitle={card.description}
                  labels={
                    card.status
                      ? [{ label: card.status, tone: card.status === "Blocked" ? "error" : "warning" }]
                      : undefined
                  }
                  footer={<Avatar fallback={card.assignee} size="sm" />}
                />
              </div>
            ))}
          </Stack>
        </div>
      </Stack>
    </Box>
  );
}

function AddCardControl({ disabled, onAdd }: { disabled: boolean; onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <Button variant="secondary" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
        + Add card
      </Button>
    );
  }

  return (
    <Input
      ref={inputRef}
      value={value}
      placeholder="Card title"
      aria-label="New card title"
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const trimmed = value.trim();
          if (trimmed) {
            onAdd(trimmed);
            setValue("");
            setOpen(false);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          setValue("");
          setOpen(false);
        }
      }}
    />
  );
}
