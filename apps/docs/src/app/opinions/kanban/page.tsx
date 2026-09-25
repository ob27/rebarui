"use client";

import { useState } from "react";
import { Box, Editable, Heading, Input, Kanban, Stack, Tag, Text } from "rebar-ui";
import type { KanbanCard, KanbanCardRenderContext, KanbanColumn, KanbanState } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const INITIAL_CARDS: Record<string, KanbanCard> = {
  spec: { id: "spec", title: "Write spec", tags: ["docs"] },
  ui: { id: "ui", title: "Build the board UI", description: "Columns, cards, drag reorder" },
  review: { id: "review", title: "Design review" },
  bug: { id: "bug", title: "Fix drag-drop on Firefox", tags: ["bug"] },
  ship: { id: "ship", title: "Ship it" },
};

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To do", sections: [{ id: "todo-main", cardIds: ["spec", "ui"] }] },
  {
    id: "in-progress",
    title: "In progress",
    sections: [
      { id: "in-progress-blocked", label: "Blocked", cardIds: ["bug"], limit: 3 },
      { id: "in-progress-active", label: "Active", cardIds: ["review"] },
    ],
    limit: 4,
  },
  { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["ship"], limit: 1 }] },
];

const STICKY_CARDS: Record<string, KanbanCard> = {
  went1: { id: "went1", title: "Fast turnaround on reviews" },
  went2: { id: "went2", title: "Good test coverage" },
  improve1: { id: "improve1", title: "Standup ran long" },
  action1: { id: "action1", title: "Timebox standup to 10 min" },
};

const STICKY_COLUMNS: KanbanColumn[] = [
  { id: "went-well", title: "Went well", sections: [{ id: "went-well-main", cardIds: ["went1", "went2"] }] },
  { id: "improve", title: "To improve", sections: [{ id: "improve-main", cardIds: ["improve1"] }] },
  { id: "actions", title: "Action items", sections: [{ id: "actions-main", cardIds: ["action1"] }] },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Kanban columns={columns} cards={cards} search={search} onChange={setBoard} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Kanban"] ?? [] },
  {
    type: "doc-section",
    heading: "Uncontrolled, like TreeView",
    body: [
      {
        kind: "text",
        text: "`Kanban` owns no state of its own for `columns`/`cards` — every drag, sort, or add-card calls `onChange` with the updated structure, and the caller re-renders with it. The same \"you own the array\" contract as `TreeView`'s `onSelect`, not a new pattern.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Limits and dividers",
    body: [
      {
        kind: "text",
        text: "A column's optional `limit` caps its total card count across all its sections; a section's own `limit` caps just that section. A drop past either limit is rejected outright, not just visually hinted — try dragging a card into the \"Done\" column above, or into \"Blocked\", both already at their limit. A section's optional `label` renders as a horizontal divider within its column, splitting one column into named sub-groups (see \"In progress\" above).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Sticky variant",
    body: [
      {
        kind: "text",
        text: '`cardVariant="sticky"` mutates the same component into the postit board shown above — a hard 3-per-column cap (an explicit `limit` above 3 is clamped down to it), procedurally varied rotation/shadow per card, and click (not drag) opens an edit form for title/description/tags/color instead of a `card-kanban`-style caller-supplied modal. Try clicking a sticky above, then dragging one — the two are resolved so a drag never also opens the edit form.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Real touch support, not mouse-only",
    body: [
      {
        kind: "text",
        text: "Every board above is draggable on a touchscreen too — cards and columns both — parallel to the native HTML5 drag-and-drop path, not a replacement for it. `onCardLongPress` is the real touch equivalent of `onDoubleClick` (a touch device never fires a real double-click at all): pass it alongside `renderCard` to open whatever your own custom card face should open on a long-press, the same way the built-in `Card`/`Sticky` rendering already does for its own edit dialog.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Hiding a column without losing its cards",
    body: [
      {
        kind: "text",
        text: 'Every column header above has an eye icon — click it to collapse that column into a tray showing just its card count, without touching the underlying `columns`/`cards` state at all. Type a search term that matches a card inside a collapsed column and it still surfaces as a faded "ghost" card in the tray, so collapsing a column never makes a search look like it silently missed something.',
      },
      {
        kind: "text",
        text: "Collapse state is uncontrolled by default — Kanban tracks it itself, resetting on remount, the right choice for a purely personal view preference. Pass `collapsedColumnIds` (together with `onColumnCollapsedChange`, required alongside it) when a caller wants collapse state to survive a reload or be the same for every viewer — e.g. persisted as real board data — the same controlled/uncontrolled split `cardVariant` already has at the board level, just per-column.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "filterCard: a caller-defined filter that composes with search",
    body: [
      {
        kind: "text",
        text: '`filterCard` is an additional visibility predicate, composed with `search` — a card must pass both. For a filter that doesn\'t fit a single substring match (e.g. "only this tag," "only this assignee"). Same visibility-only guarantee as `search`: it only ever hides a card from view — the real per-section `cardIds` array a drag/reorder\'s own `onChange` reads from is untouched either way, so filtering never risks silently dropping a card from its column\'s real data.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Full ownership of the card face and column title",
    body: [
      {
        kind: "text",
        text: '`renderCard` replaces the built-in `Card`/`Sticky` rendering (and its click/double-click behavior) entirely — the caller owns the card\'s whole face and whatever click/double-click/long-press should do, while `Kanban` still owns layout, drag-and-drop, limits, sort, and search filtering underneath it. `renderColumnTitle` does the same for just the title text inside a column header, e.g. for click-to-rename. The demo below renders each card with inline, always-editable tag chips and a clickable column title — try editing a tag or a column name directly, then drag a card between columns to confirm layout/DnD still work exactly as before.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "stickyDefaultLimit: false means genuinely unlimited",
    body: [
      {
        kind: "text",
        text: 'Sticky mode\'s default 3-per-column cap only applies to a column with no explicit `limit` of its own. Pass `stickyDefaultLimit={false}` when your own app lets users configure every column\'s real limit (including a genuinely unlimited one, i.e. `limit: undefined`) and sticky mode should respect that exactly like the default variant does — not silently substitute 3 for a column that was deliberately left uncapped.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Known gap: mouse/touch only",
    body: [
      {
        kind: "text",
        text: "Drag-and-drop uses the native HTML5 Drag and Drop API (plus a parallel touch implementation, see above) — no keyboard-operable equivalent yet. A documented, honest gap rather than a silently missing one.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="kanban"`; each column/section/card carries `data-rebar-part="column"`/`"section"`/`"card"` respectively.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD has no built-in Kanban/board component; a migration reimplements the board on top of a drag-and-drop library of the consuming team's choice.",
      },
    ],
  },
];

const RENDER_CARD_COLUMNS: KanbanColumn[] = [
  { id: "backlog", title: "Backlog", sections: [{ id: "backlog-main", cardIds: ["idea1", "idea2"] }] },
  { id: "active", title: "Active", sections: [{ id: "active-main", cardIds: ["work1"] }] },
];

function CustomCard({
  card,
  ctx,
  onTagsChange,
}: {
  card: KanbanCard;
  ctx: KanbanCardRenderContext;
  onTagsChange: (tags: string[]) => void;
}) {
  return (
    <Box
      draggable={ctx.dragHandlers.draggable}
      onDragStart={ctx.dragHandlers.onDragStart}
      onDragEnd={ctx.dragHandlers.onDragEnd}
      onDragOver={ctx.dragHandlers.onDragOver}
      onDrop={ctx.dragHandlers.onDrop}
      {...ctx.touchHandlers}
      style={{
        border: "1px solid var(--rebar-color-border, #e0e0e0)",
        borderRadius: 4,
        padding: "var(--rebar-space-sm)",
        background: "var(--rebar-color-bg-primary, #fff)",
        cursor: "grab",
      }}
    >
      <Stack gap="xs">
        <Text as="span" style={{ fontWeight: 600 }}>
          {card.title}
        </Text>
        <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
          {(card.tags ?? []).map((tag) => (
            <Tag key={tag} closable onClose={() => onTagsChange((card.tags ?? []).filter((t) => t !== tag))}>
              {tag}
            </Tag>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

function RenderCardDemo() {
  const [board, setBoard] = useState<KanbanState>({
    columns: RENDER_CARD_COLUMNS,
    cards: {
      idea1: { id: "idea1", title: "Dark mode", tags: ["ui"] },
      idea2: { id: "idea2", title: "Bulk export", tags: ["backend"] },
      work1: { id: "work1", title: "Fix flaky test", tags: ["ci", "urgent"] },
    },
  });

  const setCardTags = (cardId: string, tags: string[]) => {
    setBoard((prev) => ({ ...prev, cards: { ...prev.cards, [cardId]: { ...prev.cards[cardId]!, tags } } }));
  };

  const renameColumn = (columnId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
    }));
  };

  return (
    <Box
      style={{
        border: "1px solid var(--rebar-color-border, #e0e0e0)",
        borderRadius: 4,
        padding: "var(--rebar-space-lg)",
        overflowX: "auto",
      }}
    >
      <Kanban
        columns={board.columns}
        cards={board.cards}
        onChange={setBoard}
        renderCard={(card, ctx) => (
          <CustomCard card={card} ctx={ctx} onTagsChange={(tags) => setCardTags(card.id, tags)} />
        )}
        renderColumnTitle={(column) => (
          <Editable
            value={column.title}
            onChange={(title) => renameColumn(column.id, title)}
            aria-label="Column title"
          />
        )}
      />
    </Box>
  );
}

export default function KanbanPage() {
  const [board, setBoard] = useState<KanbanState>({ columns: INITIAL_COLUMNS, cards: INITIAL_CARDS });
  const [search, setSearch] = useState("");
  const [stickyBoard, setStickyBoard] = useState<KanbanState>({ columns: STICKY_COLUMNS, cards: STICKY_CARDS });

  return (
    <Stack gap="lg">
      <Heading level={1}>Kanban</Heading>
      <Text color="secondary">
        A drag-and-drop card board — arbitrary columns, optional dividers within a column, cards
        draggable within/across sections and columns, columns themselves draggable to reorder, and
        optional per-column/per-section card limits.
      </Text>

      <Stack gap="xs">
        <Input
          aria-label="Search demo cards"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "var(--rebar-space-lg)",
            overflowX: "auto",
          }}
        >
          <Kanban columns={board.columns} cards={board.cards} search={search} onChange={setBoard} />
        </Box>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          A retro board using <code>cardVariant=&quot;sticky&quot;</code> — up to 3 stickies per
          column, click a sticky to edit it.
        </Text>
        <Box
          style={{
            border: "1px solid var(--rebar-color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "var(--rebar-space-lg)",
            overflowX: "auto",
          }}
        >
          <Kanban
            columns={stickyBoard.columns}
            cards={stickyBoard.cards}
            cardVariant="sticky"
            onChange={setStickyBoard}
          />
        </Box>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" color="secondary">
          <code>renderCard</code> + <code>renderColumnTitle</code> — a fully custom card face with
          removable tag chips, and a click-to-rename column title. Drag still works; so does the
          collapse eye icon on each column.
        </Text>
        <RenderCardDemo />
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
