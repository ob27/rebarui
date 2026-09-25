import { Fragment, useRef } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Box, Stack, Button, Input } from "rebar-ui";
import { CardItem } from "./CardItem";
import { computeDropIndex } from "./dragGeometry";
import { matchesSearch } from "./data";
import type { CardData, ColumnMeta, DragState, DropIndicator } from "./types";

export interface ColumnProps {
  meta: ColumnMeta;
  cards: CardData[];
  search: string;
  dragState: DragState | null;
  dropIndicator: DropIndicator | null;
  isAdding: boolean;
  draftTitle: string;
  onCardDragStart: (card: CardData, columnId: ColumnMeta["id"]) => void;
  onCardDragEnd: () => void;
  onDragOverColumn: (indicator: DropIndicator | null) => void;
  onDropCard: (columnId: ColumnMeta["id"], index: number) => void;
  onStartAdd: (columnId: ColumnMeta["id"]) => void;
  onDraftTitleChange: (value: string) => void;
  onSubmitAdd: (columnId: ColumnMeta["id"]) => void;
  onCancelAdd: () => void;
}

/** A thin horizontal rule marking where a dragged card would land if dropped now. */
function DropMarker() {
  return (
    <div
      data-drop-marker="true"
      style={{
        height: 3,
        borderRadius: 2,
        background: "var(--rebar-color-accent, #4a6cf7)",
        margin: "2px 0",
      }}
    />
  );
}

export function Column({
  meta,
  cards,
  search,
  dragState,
  dropIndicator,
  isAdding,
  draftTitle,
  onCardDragStart,
  onCardDragEnd,
  onDragOverColumn,
  onDropCard,
  onStartAdd,
  onDraftTitleChange,
  onSubmitAdd,
  onCancelAdd,
}: ColumnProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const atCap = meta.cap !== undefined && cards.length >= meta.cap;
  // A drop into THIS column would be rejected only when it's genuinely arriving from elsewhere
  // while already at cap — reordering within a full column doesn't change its count.
  const wouldExceedCap = (from: DragState | null) =>
    meta.cap !== undefined && !!from && from.columnId !== meta.id && cards.length >= meta.cap;

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!dragState || !listRef.current) return;
    event.preventDefault();
    if (wouldExceedCap(dragState)) {
      event.dataTransfer.dropEffect = "none";
      onDragOverColumn(null);
      return;
    }
    event.dataTransfer.dropEffect = "move";
    const index = computeDropIndex(listRef.current, event.clientY, dragState.card.id);
    onDragOverColumn({ columnId: meta.id, index });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!dragState || !listRef.current) return;
    if (wouldExceedCap(dragState)) return;
    const index = computeDropIndex(listRef.current, event.clientY, dragState.card.id);
    onDropCard(meta.id, index);
  };

  const handleAddKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmitAdd(meta.id);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancelAdd();
    }
  };

  const isDropTarget = dropIndicator?.columnId === meta.id;
  let visibleIndex = 0;
  const cardElements = cards.map((card) => {
    const visible = matchesSearch(card, search);
    const showMarkerBefore = isDropTarget && visible && dropIndicator!.index === visibleIndex;
    if (visible) visibleIndex += 1;
    return (
      <Fragment key={card.id}>
        {showMarkerBefore ? <DropMarker /> : null}
        <CardItem
          card={card}
          columnId={meta.id}
          visible={visible}
          isDragging={dragState?.card.id === card.id}
          onDragStart={onCardDragStart}
          onDragEnd={onCardDragEnd}
        />
      </Fragment>
    );
  });
  const showMarkerAtEnd = isDropTarget && dropIndicator!.index === visibleIndex;

  return (
    <Box
      style={{
        flex: "1 1 0",
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      data-column-id={meta.id}
    >
      <Stack direction="row" justify="between" align="center">
        <strong>{meta.title}</strong>
        <span data-testid={`${meta.id}-count`}>
          {meta.cap !== undefined ? `${cards.length}/${meta.cap}` : cards.length}
        </span>
      </Stack>

      <div
        ref={listRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: 48,
          flex: 1,
        }}
      >
        {isAdding ? (
          <div style={{ marginBottom: 8 }}>
            <Input
              autoFocus
              placeholder="Card title"
              value={draftTitle}
              onChange={(event) => onDraftTitleChange(event.target.value)}
              onKeyDown={handleAddKeyDown}
              onBlur={() => onCancelAdd()}
              aria-label={`New card title for ${meta.title}`}
            />
          </div>
        ) : null}
        {cardElements}
        {showMarkerAtEnd ? <DropMarker /> : null}
      </div>

      {!isAdding ? (
        <Button variant="tertiary" size="sm" disabled={atCap} onClick={() => onStartAdd(meta.id)}>
          + Add card
        </Button>
      ) : null}
    </Box>
  );
}
