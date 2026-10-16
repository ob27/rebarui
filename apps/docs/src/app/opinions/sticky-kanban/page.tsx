import { Avatar, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf } from "@/fixtures/tideline";

const CODE = "{ type: \"sticky-kanban\", title: \"Harbour rebrand retro\", columns, cards }";

const LIVE: Construct = {
  type: "sticky-kanban",
  title: "Harbour rebrand retro",
  columns: [
    { id: "went-well", title: "Went well", sections: [{ id: "went-well-main", cardIds: ["w1", "w2"] }] },
    { id: "improve", title: "To improve", sections: [{ id: "improve-main", cardIds: ["i1", "i2"] }] },
    { id: "ideas", title: "Ideas", sections: [{ id: "ideas-main", cardIds: ["d1"] }] },
  ],
  cards: {
    w1: { id: "w1", title: "Brand palette signed off in one round" },
    w2: { id: "w2", title: "Homepage shipped to staging early" },
    i1: { id: "i1", title: "Interview notes ran late" },
    i2: { id: "i2", title: "Too many threads for livery photos" },
    d1: { id: "d1", title: "A weekly digest for the crew" },
  },
};
const EMPTY: Construct = {
  type: "sticky-kanban",
  title: "New retro",
  columns: [
    { id: "a", title: "Went well", sections: [{ id: "a-main", cardIds: [] }] },
    { id: "b", title: "To improve", sections: [{ id: "b-main", cardIds: [] }] },
  ],
  cards: {},
};

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "text", text: "Same as `card-kanban`: `{ type: \"sticky-kanban\", title, sharedWith?, shareUrl?, columns, cards, searchPlaceholder?, settingsBlocks? }`. It is Kanban with `cardVariant=\"sticky\"`: varied tilt and shadow, an assigned or automatic colour, a cap of 3 per column, and a click (not a drag) opens the edit form." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "Same as `card-kanban`; cards carry the Kanban sticky variant attributes." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered; see `card-kanban`." }],
  },
];

export default function StickyKanbanPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Sticky Kanban</Heading>
      <Text color="secondary">The card-kanban block with post-it style cards: tilted, coloured, three per column.</Text>

      <DemoStage title="Harbour retro" caption="Click a sticky to edit it; drag to move it" code={CODE}
        states={[
          { label: "Empty board", node: <NextBlockRenderer blocks={[EMPTY]} /> },
        ]}>
        <NextBlockRenderer blocks={[LIVE]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Retro night" caption="The board inside a project card" widths={false}>
        <Card style={{ maxWidth: 760, margin: "0 auto" }} title="Harbour rebrand retro" subtitle="Run by Maya, 22 Oct" avatar={<Avatar {...avatarOf("maya")} />} labels={[{ label: "On track", tone: "success" }]}>
          <NextBlockRenderer blocks={[LIVE]} />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
