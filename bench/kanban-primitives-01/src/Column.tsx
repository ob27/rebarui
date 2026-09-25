import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Avatar, Button, Card, Input, Stack, Tag } from "rebar-ui";
import type { CardData, ColumnDef, ColumnId, DragInfo, DropIndicator } from "./types";

interface CardItemProps {
  card: CardData;
  column: ColumnId;
  index: number;
  visible: boolean;
  isDragging: boolean;
  isDropTargetBefore: boolean;
  onDragStart: (cardId: string, column: ColumnId) => void;
  onDragEnd: () => void;
  onCardDragOver: (e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) => void;
}

function CardItem({
  card,
  column,
  index,
  visible,
  isDragging,
  isDropTargetBefore,
  onDragStart,
  onDragEnd,
  onCardDragOver,
}: CardItemProps) {
  return (
    <Card
      title={card.title}
      subtitle={card.description}
      labels={card.tag ? [{ label: card.tag, tone: card.tag === "Blocked" ? "error" : "info" }] : undefined}
      footer={card.assignee ? <Avatar fallback={card.assignee} size="sm" /> : undefined}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", card.id);
        onDragStart(card.id, column);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onCardDragOver(e, column, index)}
      className={[
        "sprint-card",
        isDragging ? "sprint-card-dragging" : "",
        isDropTargetBefore ? "sprint-card-drop-before" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ display: visible ? undefined : "none" }}
      data-testid="kanban-card"
      data-card-id={card.id}
    />
  );
}

interface ColumnProps {
  def: ColumnDef;
  cards: CardData[];
  search: string;
  dragging: DragInfo | null;
  dropIndicator: DropIndicator | null;
  rejected: boolean;
  onDragStart: (cardId: string, column: ColumnId) => void;
  onDragEnd: () => void;
  onCardDragOver: (e: DragEvent<HTMLDivElement>, column: ColumnId, index: number) => void;
  onColumnDragOver: (e: DragEvent<HTMLDivElement>, column: ColumnId) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, column: ColumnId) => void;
  onAddCard: (column: ColumnId, title: string) => void;
}

export function Column({
  def,
  cards,
  search,
  dragging,
  dropIndicator,
  rejected,
  onDragStart,
  onDragEnd,
  onCardDragOver,
  onColumnDragOver,
  onDrop,
  onAddCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const capReached = def.cap != null && cards.length >= def.cap;
  const countLabel = def.cap != null ? `${cards.length}/${def.cap}` : `${cards.length}`;
  const normalizedSearch = search.trim().toLowerCase();

  const cancelAdd = () => {
    setDraft("");
    setAdding(false);
  };

  const commitAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddCard(def.id, trimmed);
    setDraft("");
    setAdding(false);
  };

  const handleDraftKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAdd();
    }
  };

  const showEndIndicator = dropIndicator?.column === def.id && dropIndicator.index >= cards.length;

  return (
    <Stack
      direction="column"
      gap="sm"
      className={["sprint-column", dragging && rejected ? "sprint-column-rejected" : ""].filter(Boolean).join(" ")}
      data-testid="kanban-column"
      data-column-id={def.id}
      onDragOver={(e) => onColumnDragOver(e, def.id)}
      onDrop={(e) => onDrop(e, def.id)}
    >
      <Stack direction="row" justify="between" align="center" className="sprint-column-header">
        <span className="sprint-column-title">{def.title}</span>
        <Tag tone={def.cap != null && capReached ? "warning" : "default"}>{countLabel}</Tag>
      </Stack>

      <div className="sprint-column-body">
        {adding ? (
          <Input
            autoFocus
            value={draft}
            placeholder="Card title"
            aria-label={`New card title for ${def.title}`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleDraftKeyDown}
            className="sprint-add-card-input"
          />
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setAdding(true)}
            disabled={capReached}
            className="sprint-add-card-button"
          >
            + Add card
          </Button>
        )}

        <div className="sprint-column-cards">
          {cards.map((card, index) => (
            <CardItem
              key={card.id}
              card={card}
              column={def.id}
              index={index}
              visible={!normalizedSearch || card.title.toLowerCase().includes(normalizedSearch)}
              isDragging={dragging?.cardId === card.id}
              isDropTargetBefore={dropIndicator?.column === def.id && dropIndicator.index === index}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onCardDragOver={onCardDragOver}
            />
          ))}
          {showEndIndicator ? <div className="sprint-drop-indicator" /> : null}
        </div>
      </div>
    </Stack>
  );
}
