import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Avatar, Box, Button, Card, Input, Stack, Tag } from "rebar-ui";
import type { TagTone } from "rebar-ui";
import { COLUMN_CAPS, COLUMN_TITLES, type CardData, type CardStatus, type ColumnId } from "./types";

const STATUS_TONE: Record<CardStatus, TagTone> = {
  Blocked: "error",
  Review: "info",
};

export interface DragInfo {
  cardId: string;
  from: ColumnId;
}

export interface DropTarget {
  column: ColumnId;
  index: number;
}

export interface ColumnProps {
  columnId: ColumnId;
  cards: CardData[];
  query: string;
  dragging: DragInfo | null;
  dropTarget: DropTarget | null;
  onDragStart: (cardId: string, from: ColumnId) => void;
  onDragEnd: () => void;
  onDragOverColumn: (columnId: ColumnId, index: number) => void;
  onDropColumn: (columnId: ColumnId) => void;
  onAddCard: (columnId: ColumnId, title: string) => void;
}

function matchesQuery(card: CardData, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return card.title.toLowerCase().includes(q);
}

export function Column({
  columnId,
  cards,
  query,
  dragging,
  dropTarget,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDropColumn,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const cap = COLUMN_CAPS[columnId];
  const atCap = cap !== undefined && cards.length >= cap;
  const countLabel = cap !== undefined ? `${cards.length}/${cap}` : `${cards.length}`;

  const handleListDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = listRef.current;
    if (!container) return;
    const cardEls = Array.from(container.querySelectorAll<HTMLElement>("[data-card-id]")).filter(
      (el) => el.offsetParent !== null,
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
    onDragOverColumn(columnId, index);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDropColumn(columnId);
  };

  const startAdd = () => {
    if (atCap) return;
    setAdding(true);
    setDraftTitle("");
  };

  const cancelAdd = () => {
    setAdding(false);
    setDraftTitle("");
  };

  const commitAdd = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed || atCap) return;
    onAddCard(columnId, trimmed);
    setAdding(false);
    setDraftTitle("");
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  };

  const isDropColumn = dragging !== null && dropTarget !== null && dropTarget.column === columnId;

  return (
    <Box
      className="sprint-column"
      data-column-id={columnId}
      onDragOver={handleListDragOver}
      onDrop={handleDrop}
    >
      <Stack direction="row" justify="between" align="center" className="sprint-column-header">
        <span className="sprint-column-title">{COLUMN_TITLES[columnId]}</span>
        <Tag tone={atCap ? "warning" : "default"}>{countLabel}</Tag>
      </Stack>

      <div className="sprint-column-add">
        {adding ? (
          <Input
            autoFocus
            size="sm"
            placeholder="Card title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="New card title"
          />
        ) : (
          <Button variant="tertiary" size="sm" disabled={atCap} onClick={startAdd}>
            + Add card
          </Button>
        )}
      </div>

      <div ref={listRef} className="sprint-column-list" data-testid={`${columnId}-list`}>
        {cards.length === 0 && !isDropColumn ? <div className="sprint-column-empty">No cards</div> : null}
        {cards.map((card, index) => {
          const visible = matchesQuery(card, query);
          const showIndicatorBefore = isDropColumn && dropTarget!.index === index;
          return (
            <div key={card.id} className="sprint-card-slot" style={visible ? undefined : { display: "none" }}>
              {showIndicatorBefore ? <div className="sprint-drop-indicator" /> : null}
              <div
                data-card-id={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", card.id);
                  onDragStart(card.id, columnId);
                }}
                onDragEnd={onDragEnd}
              >
                <Card
                  className="sprint-card"
                  title={card.title}
                  subtitle={card.description}
                  extra={card.status ? <Tag tone={STATUS_TONE[card.status]}>{card.status}</Tag> : null}
                  footer={<Avatar size="sm" fallback={card.assignee} />}
                />
              </div>
            </div>
          );
        })}
        {isDropColumn && dropTarget!.index >= cards.length ? <div className="sprint-drop-indicator" /> : null}
      </div>
    </Box>
  );
}
