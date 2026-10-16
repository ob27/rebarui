import { Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { COLUMN_TITLES, PEOPLE, TASKS, kanbanBoard, project } from "@/fixtures/tideline";

const CODE = `{
  type: "card-kanban",
  title: "Harbour rebrand",
  sharedWith: [{ name: "Maya Chen" }, { name: "Jonas Weber" }],
  columns: [{ id: "todo", title: "To do", sections: [{ id: "todo-main", cardIds: ["icons"] }] }],
  cards: { icons: { id: "icons", title: "Icon audit", tags: ["Design"] } },
}`;

const board = kanbanBoard();
const withLimit = board.columns.map((c) => (c.id === "doing" ? { ...c, sections: c.sections.map((s) => ({ ...s, limit: 2 })) } : c));

const BOARD: Construct = {
  type: "card-kanban",
  title: "Tideline tasks",
  sharedWith: PEOPLE.map((p) => ({ name: p.name })),
  searchPlaceholder: "Search tasks",
  columns: withLimit,
  cards: board.cards,
};

/** Small board: the two open columns of one project. */
const SMALL: Construct = {
  type: "card-kanban",
  title: "Harbour rebrand",
  sharedWith: [{ name: "Maya Chen" }, { name: "Priya Nair" }],
  columns: (["todo", "doing"] as const).map((c) => ({ id: c, title: COLUMN_TITLES[c], sections: [{ id: `${c}-main`, cardIds: TASKS.filter((t) => t.column === c && t.project === "harbour").map((t) => t.id) }] })),
  cards: Object.fromEntries(TASKS.filter((t) => t.project === "harbour").map((t) => [t.id, board.cards[t.id]])),
};

const EMPTY: Construct = {
  type: "card-kanban",
  title: "Rota export",
  columns: [{ id: "todo", title: "To do", sections: [{ id: "todo-main", cardIds: [] }] }, { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: [] }] }],
  cards: {},
};

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "card-kanban", title: string, sharedWith?: { name: string, avatarSrc?: string }[], shareUrl?: string, columns: KanbanColumnData[], cards: Record<string, KanbanCardData>, searchPlaceholder?: string, settingsBlocks?: Block[] }
// KanbanColumnData = { id: string, title: string, sections: KanbanSectionData[], limit?: number }
// KanbanSectionData = { id: string, label?: string, cardIds: string[], limit?: number }
// KanbanCardData = { id: string, title: string, description?: string, tags?: string[] }` }],
  },
];

export default function CardKanbanPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Card Kanban</Heading>
      <Text color="secondary">A titled, shareable, searchable task board built on Kanban.</Text>

      <DemoStage
        title="Task board"
        caption="Drag cards between columns; In progress holds two at most"
        code={CODE}
        states={[{ label: "Empty board", node: <NextBlockRenderer blocks={[EMPTY]} /> }]}
      >
        <NextBlockRenderer blocks={[BOARD]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="A board under the project header" widths={false}>
        <Stack gap="md">
          <Card>
            <Stack direction="row" gap="md" align="center" style={{ flexWrap: "wrap" }}>
              <Heading level={3}>{harbour.name}</Heading>
              <Tag tone="success">{harbour.status}</Tag>
              <Text size="sm" color="secondary">Due {harbour.due}</Text>
            </Stack>
          </Card>
          <NextBlockRenderer blocks={[SMALL]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
