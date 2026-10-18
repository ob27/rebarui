"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Accordion,
  AccordionItem,
  ActionSheet,
  AgentWall,
  AreaChart,
  Avatar,
  AvatarGroup,
  BottomSheet,
  BoxPlot,
  BubbleChart,
  Button,
  Calendar,
  CalendarHeatmap,
  Card,
  Cascader,
  Collapsible,
  ColorPicker,
  Combobox,
  CommandPalette,
  CommentThread,
  ConstructSearch,
  ContextMenu,
  DataGrid,
  DatePicker,
  Dialog,
  DistributionChart,
  Drawer,
  Dropdown,
  Editable,
  Ellipsis,
  EmailCapture,
  FileManager,
  FileUpload,
  FloatAssistant,
  FloatingBubble,
  FloatingPanel,
  FloatingSelectionToolbar,
  Flowchart,
  Form,
  FormItem,
  GraphExplorer,
  Heading,
  Heatmap,
  HeatmapPainter,
  HeatmapViewer,
  Histogram,
  HoverCard,
  Image,
  ImageCropper,
  IndexBar,
  IndexChart,
  Input,
  Kanban,
  LayersPanel,
  Lightbox,
  LineChart,
  Mentions,
  Menubar,
  MindMap,
  Stack,
  Tag,
  Text,
} from "rebar-ui";
import type {
  AgentWallMember,
  CommandPaletteCommand,
  CommentThreadComment,
  ConstructSearchResult,
  ContextMenuItem,
  FileManagerNode,
  GraphExplorerEdge,
  GraphExplorerNode,
  HeatmapLayout,
  HeatmapViewerSource,
  IndexBarGroup,
  LayerNode,
  TableColumn,
  UploadFileState,
} from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import {
  COLUMN_TITLES,
  CREW,
  CYCLE_DAYS,
  FILES,
  OPENED_PER_WEEK,
  PEOPLE,
  PEOPLE_OPTIONS,
  PROJECTS,
  PROJECT_HOURS,
  STATUS_TONE,
  TASKS,
  WEEKLY_DONE,
  WEEK_LABELS,
  avatarOf,
  avatarsOf,
  gbp,
  kanbanBoard,
  person,
  project,
} from "@/fixtures/tideline";
import type { Project } from "@/fixtures/tideline";
import { ex } from "./tierExamples.types";
import type { ExampleMap } from "./tierExamples.types";

/** Renders placement blocks (the capitals-with-spaces constructs). */
const block = (b: Construct) => <NextBlockRenderer blocks={[b]} />;

/** A small box that is its own containing block, so fixed and absolute children stay inside the card. */
const FRAME: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  transform: "translateZ(0)",
  border: "1px solid var(--rebar-color-border)",
  borderRadius: 12,
  background: "var(--rebar-color-tint-3)",
};

const harbour = project("harbour");
const signage = project("signage");

/* ---- Accordion ---- */
const accordion = (
  <Accordion type="single" collapsible defaultValue="scope">
    <AccordionItem value="scope" trigger="Scope">
      <Text size="sm" color="secondary">
        {signage.summary} Delivery {signage.due}.
      </Text>
    </AccordionItem>
    <AccordionItem value="team" trigger="Team">
      <Stack direction="row" gap="sm" align="center">
        <AvatarGroup avatars={avatarsOf(["maya", "leo"])} size="sm" />
        <Text size="sm" color="secondary">
          {person("maya").name.split(" ")[0]} and {person("leo").name.split(" ")[0]}
        </Text>
      </Stack>
    </AccordionItem>
    <AccordionItem
      value="budget"
      trigger={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          Budget <Tag tone="success">{gbp(signage.budget)}</Tag>
        </span>
      }
    >
      <Text size="sm" color="secondary">
        {gbp(10500)} spent, {gbp(signage.budget - 10500)} left.
      </Text>
    </AccordionItem>
  </Accordion>
);

/* ---- ActionSheet ---- */
const actionSheet = (
  <ActionSheet
    trigger={<Button variant="secondary">Actions</Button>}
    title="Offline sync for tasks"
    actions={[
      { label: "Assign to...", onSelect: () => {} },
      { label: "Move to...", onSelect: () => {} },
      { label: "Duplicate", onSelect: () => {} },
      { label: "Delete task", destructive: true, onSelect: () => {} },
    ]}
  />
);

/* ---- AgentWall ---- */
const AGENT_ACTIVITY = ["Drafting the launch checklist.", "Reading the crew interview notes.", "Comparing two signage quotes.", "Waiting on the rota data.", "Summarising the week for Maya.", "Checking the palette against the brand guide."];
const AGENT_NAMES = ["Scribe", "Planner", "Courier", "Auditor", "Linker", "Tagger"];
const AGENT_MEMBERS: AgentWallMember[] = AGENT_NAMES.map((name, i) => ({
  id: `a${i}`,
  name,
  project: `${PROJECTS[i % PROJECTS.length].name} > ${i % 2 === 0 ? "Tasks" : "Files"}`,
  status: i === 3 ? "ghost" : i === 5 ? "idle" : "active",
  statusLabel: i === 3 ? "Ghost" : i === 5 ? "Idle 30mins" : undefined,
  activity: i === 3 ? undefined : AGENT_ACTIVITY[i],
}));

/* ---- Ai Chat ---- */
const AI_MESSAGES = [
  { id: "1", role: "user" as const, content: "What slipped on the mobile release this week?", avatarFallback: "JW" },
  { id: "2", role: "assistant" as const, content: "Two things. Offline sync is in review and the crew-interview notes are late.", avatarFallback: "AI" },
];

/* ---- charts ---- */
const days = (v: number) => `${Math.round(v)}d`;
const BOX_GROUPS = CYCLE_DAYS.map(({ person: id, ...five }) => ({ label: person(id).name.split(" ")[0], ...five }));
const k = (v: number) => `£${Math.round(v)}k`;
const BUBBLE_COLORS = ["var(--rebar-color-primary)", "var(--rebar-color-info)", "var(--rebar-color-warning)", "var(--rebar-color-success)", "var(--rebar-color-text-secondary)"];
const BUBBLE_SERIES = PROJECTS.map((p, i) => ({ label: p.name, color: BUBBLE_COLORS[i], points: [{ x: p.budget / 1000, y: p.done, size: PROJECT_HOURS[p.id] }] }));
const CYCLE_ALL = [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 9, 12, 14];

/** Tasks per day over the weekly totals: weekdays carry the work, weekends are quiet. */
function tasksPerDay() {
  const data: { date: string; value: number }[] = [];
  const start = Date.UTC(2026, 7, 3);
  WEEKLY_DONE.forEach((total, w) => {
    [0.24, 0.2, 0.22, 0.18, 0.16, 0, 0].forEach((share, d) => {
      const wobble = ((w * 7 + d * 3) % 4) - 1;
      const value = Math.max(0, Math.round(total * share) + (share ? wobble : 0));
      if (share === 0 && (w + d) % 3) return;
      data.push({ date: new Date(start + (w * 7 + d) * 86_400_000).toISOString().slice(0, 10), value });
    });
  });
  return data;
}
const HEAT_SCALE = (t: number): string => `color-mix(in srgb, var(--rebar-color-primary) ${Math.round(Math.max(0, Math.min(1, t)) * 100)}%, var(--rebar-color-tint-3))`;
const HEAT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HEAT_ROWS = PEOPLE.map((p) => p.name);
const HEAT_DONE: (number | null)[][] = [
  [6, 8, 7, 9, 5],
  [9, 7, 11, 8, 6],
  [3, 4, 5, 2, 3],
  [5, 6, null, 7, 4],
];
const HEAT_DATA = HEAT_DONE.flatMap((vals, r) => vals.flatMap((v, c) => (v === null ? [] : [{ row: HEAT_ROWS[r], col: HEAT_DAYS[c], value: v }])));

/* ---- Calendar, DatePicker ---- */
function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 24));
  return (
    <div style={{ overflowX: "auto", display: "flex", justifyContent: "center", paddingBottom: 4 }}>
      <Calendar value={date} onValueChange={setDate} minDate={new Date(2026, 9, 20)} />
    </div>
  );
}
function DatePickerDemo() {
  const [due, setDue] = useState<Date>(new Date(2026, 9, 24));
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <DatePicker value={due} onValueChange={setDue} minDate={new Date(2026, 9, 1)} />
    </div>
  );
}

/* ---- Cascader ---- */
const CASCADER_OPTIONS = PROJECTS.map((p) => {
  const tasks = TASKS.filter((t) => t.project === p.id);
  return { value: p.id, label: p.name, children: tasks.length ? tasks.map((t) => ({ value: t.id, label: t.title })) : undefined };
});

/* ---- CommandPalette ---- */
function PaletteDemo() {
  const [open, setOpen] = useState(false);
  const commands: CommandPaletteCommand[] = [
    ...PROJECTS.map((p) => ({ id: p.id, label: p.name, group: "Projects", onSelect: () => {} })),
    ...TASKS.slice(0, 4).map((t) => ({ id: t.id, label: t.title, group: "Tasks", onSelect: () => {} })),
    { id: "new-task", label: "New task", group: "Actions", shortcut: "N", onSelect: () => {} },
  ];
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Jump to...
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} commands={commands} placeholder="Projects, tasks, people" />
    </>
  );
}

/* ---- CommentThread ---- */
function ThreadDemo() {
  const [comments, setComments] = useState<CommentThreadComment[]>([
    {
      id: "c1",
      authorName: person("maya").name,
      body: "Homepage hero is in. The harbour photo crops badly on narrow screens, can someone check?",
      timestamp: new Date(2026, 9, 17, 9, 20),
      likeCount: 3,
      replies: [{ id: "c1-r1", authorName: person("jonas").name, body: "On it. I'll switch it to the portrait crop under 600px.", timestamp: new Date(2026, 9, 17, 9, 48), likeCount: 1 }],
    },
  ]);
  const toggle = (id: string) =>
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, liked: !c.liked, likeCount: (c.likeCount ?? 0) + (c.liked ? -1 : 1) } : c)));
  return <CommentThread comments={comments} onToggleLike={toggle} />;
}

/* ---- ConstructSearch ---- */
const SEARCH_RESULTS: ConstructSearchResult[] = [
  { name: "Kanban", group: "Opinions", href: "/opinions/kanban" },
  { name: "Card Kanban", group: "Opinions", href: "/opinions/card-kanban" },
  { name: "Calendar", group: "Opinions", href: "/opinions/calendar" },
  { name: "CalendarHeatmap", group: "Opinions", href: "/opinions/calendar-heatmap" },
  { name: "Card", group: "Synthetics", href: "/synthetics/card" },
  { name: "Combobox", group: "Opinions", href: "/opinions/combobox" },
  { name: "NavBar", group: "Orders", href: "/orders/nav-bar" },
];

/* ---- ContextMenu ---- */
const FILE_ITEMS: ContextMenuItem[] = [
  { key: "open", label: "Open", onSelect: () => {} },
  { key: "rename", label: "Rename", onSelect: () => {} },
  { key: "download", label: "Download", onSelect: () => {} },
  { key: "sep", separator: true },
  { key: "delete", label: "Delete", danger: true, onSelect: () => {} },
];

/* ---- DataGrid ---- */
const GRID_COLUMNS: TableColumn<Project>[] = [
  { key: "name", header: "Project", sortable: true, render: (v) => <strong>{String(v)}</strong> },
  { key: "owner", header: "Owner", sortable: true, render: (v) => person(String(v)).name },
  { key: "status", header: "Status", render: (v) => <Tag tone={STATUS_TONE[v as Project["status"]]}>{String(v)}</Tag> },
  { key: "done", header: "Done", align: "right", sortable: true, render: (v) => `${String(v)}%` },
  { key: "budget", header: "Budget", align: "right", sortable: true, render: (v) => gbp(Number(v)) },
];
function GridDemo() {
  const [selected, setSelected] = useState<string[]>(["mobile"]);
  return <DataGrid columns={GRID_COLUMNS} data={PROJECTS} rowKey="id" selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} caption="Projects" />;
}

/* ---- Dialog, Drawer, BottomSheet ---- */
const dialog = (
  <Dialog
    trigger={<Button variant="secondary">Rename project</Button>}
    title="Rename project"
    description="Everyone on Tideline mobile sees the new name."
    footer={
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Save name</Button>
      </>
    }
  >
    <Input defaultValue="Tideline mobile v2" aria-label="Project name" />
  </Dialog>
);
const drawer = (
  <Drawer side="right" trigger={<Button variant="secondary">Task details</Button>} title="Task details" footer={<Button>Save changes</Button>}>
    <Stack gap="sm">
      <Input defaultValue="Offline sync for tasks" aria-label="Title" />
      <Stack direction="row" gap="sm" align="center">
        <Avatar {...avatarOf("jonas")} size="sm" />
        <Text size="sm" color="secondary">
          {person("jonas").name}, due 26 Oct
        </Text>
      </Stack>
    </Stack>
  </Drawer>
);
const bottomSheet = (
  <BottomSheet trigger={<Button variant="secondary">Move to...</Button>} title="Move to" footer={<Button variant="destructive">Delete task</Button>}>
    <Stack gap="xs">
      {(Object.keys(COLUMN_TITLES) as (keyof typeof COLUMN_TITLES)[]).map((id) => (
        <Text key={id} size="sm" style={{ padding: "10px 4px", boxShadow: "0 1px 0 var(--rebar-color-border)" }}>
          {COLUMN_TITLES[id]}
        </Text>
      ))}
    </Stack>
  </BottomSheet>
);

/* ---- Dropdown ---- */
const SORTS = ["Due date", "Priority", "Owner", "Recently updated"];

/* ---- Ellipsis ---- */
const NOTE =
  "Interview 11: most of the crew keep a paper copy of the rota in the cab because the app is slow to open on the quay. They want shifts they can read at a glance, offline, with the next handover time shown first.";

/* ---- EmailCapture ---- */
const later = () => new Promise<void>((resolve) => setTimeout(resolve, 600));

/* ---- FileManager, FileUpload ---- */
const BYTES: Record<string, number> = { "1.4 MB": 1.4 * 1024 * 1024, "48 MB": 48 * 1024 * 1024, "212 MB": 212 * 1024 * 1024, "90 KB": 90 * 1024, "8 KB": 8 * 1024 };
const FILE_ROOT: FileManagerNode = {
  id: "root",
  name: "Tideline",
  type: "folder",
  children: PROJECTS.filter((p) => FILES.some((f) => f.project === p.id)).map((p) => ({
    id: p.id,
    name: p.name,
    type: "folder" as const,
    children: FILES.filter((f) => f.project === p.id).map((f) => ({ id: f.id, name: f.name, type: "file" as const, size: BYTES[f.size] })),
  })),
};
const UPLOADS: UploadFileState[] = [
  { id: "1", name: "depot-fascia-final.pdf", size: 1_468_000, status: "done" },
  { id: "2", name: "van-livery-photos.zip", size: 50_331_648, status: "uploading", progress: 45 },
];

/* ---- FloatAssistant ---- */
function AssistantDemo() {
  return (
    <div style={{ ...FRAME, height: 260 }}>
      <Stack gap="xs" style={{ padding: 14 }}>
        <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{harbour.name}</Text>
        <Text size="sm" color="secondary">
          {harbour.summary}
        </Text>
      </Stack>
      <FloatAssistant name="Tideline assistant" greeting="Seven tasks due this week, three today. Offline sync for tasks is in review." screenshotEnabled={false} markdown />
    </div>
  );
}

/* ---- FloatingSelectionToolbar ---- */
function SelectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={ref} style={{ border: "1px solid var(--rebar-color-border)", borderRadius: 12, padding: 14 }}>
        <Text size="sm">{NOTE}</Text>
      </div>
      <Text size="xs" color="secondary" style={{ marginTop: 6 }}>
        Select a few words.
      </Text>
      <FloatingSelectionToolbar
        containerRef={ref}
        actions={[
          { key: "ask-ai", label: "Ask AI", onSelect: () => {} },
          { key: "comment", label: "Comment", onSelect: () => {} },
          { key: "copy", label: "Copy", onSelect: () => {} },
        ]}
      />
    </>
  );
}

/* ---- Flowchart ---- */
const REVIEW_STEPS = [
  { id: "start", label: "Task done", shape: "start-end" as const, next: ["check"] },
  { id: "check", label: "Approved?", shape: "decision" as const, next: ["yes", "no"] },
  { id: "yes", label: "Ship to crew", shape: "process" as const, next: ["end"] },
  { id: "no", label: "Revise", shape: "process" as const, next: ["end"] },
  { id: "end", label: "Closed", shape: "start-end" as const },
];

/* ---- Form ---- */
const form = (
  <Form defaultValues={{ name: harbour.name, owner: person(harbour.owner).name, due: "24/10/2026" }} onSubmit={() => {}}>
    <Stack gap="md">
      <FormItem name="name" label="Project name" required>
        {(field) => <Input {...field} />}
      </FormItem>
      <FormItem name="owner" label="Owner">
        {(field) => <Input {...field} />}
      </FormItem>
      <FormItem name="due" label="Due date">
        {(field) => <Input {...field} placeholder="DD/MM/YYYY" />}
      </FormItem>
      <Button type="submit">Save changes</Button>
    </Stack>
  </Form>
);

/* ---- GraphExplorer ---- */
function buildGraph(): { nodes: GraphExplorerNode[]; edges: GraphExplorerEdge[] } {
  const nodes: GraphExplorerNode[] = [
    ...PEOPLE.map((p) => ({ id: `person-${p.id}`, label: p.name, category: "Person" })),
    ...PROJECTS.map((p) => ({ id: `project-${p.id}`, label: p.name, category: "Project" })),
    ...FILES.map((f) => ({ id: `file-${f.id}`, label: f.name, category: "File" })),
  ];
  const seen = new Set<string>();
  const edges: GraphExplorerEdge[] = [];
  const link = (source: string, target: string) => {
    if (seen.has(`${source}>${target}`)) return;
    seen.add(`${source}>${target}`);
    edges.push({ source, target });
  };
  for (const p of PROJECTS) link(`person-${p.owner}`, `project-${p.id}`);
  for (const t of TASKS) link(`person-${t.assignee}`, `project-${t.project}`);
  for (const f of FILES) link(`project-${f.project}`, `file-${f.id}`);
  return { nodes, edges };
}
const GRAPH = buildGraph();

/* ---- Heatmap painter and viewer ---- */
const DEPOT_LAYOUT: HeatmapLayout = {
  cellSize: 20,
  brushes: [
    { id: "depot", label: "Depot", color: "var(--rebar-color-primary)" },
    { id: "yard", label: "Yard", color: "var(--rebar-color-success)", showLabel: false },
  ],
  frames: [{ id: "frame-1", title: "All depots", crop: [-20, -20, 360, 260] }],
  regions: [
    { id: "north-depot", kind: "depot", label: "North depot", rects: [[0, 0, 120, 100]] },
    { id: "quay-depot", kind: "depot", label: "Quay depot", rects: [[160, 0, 340, 100], [240, 100, 340, 180]] },
    { id: "yard", kind: "yard", label: "Yard", rects: [[0, 120, 220, 160]] },
  ],
};
function PainterDemo() {
  const [layout, setLayout] = useState<HeatmapLayout>(DEPOT_LAYOUT);
  return <HeatmapPainter value={layout} onChange={setLayout} height={300} idSuggestions={["east-depot", "workshop", "stairs"]} />;
}
// Signs fitted per region; the yard has no figure so it hatches rather than reading as 0%.
const FITTED: Record<string, { done: number; expected: number }> = {
  "north-depot": { done: 9, expected: 10 },
  "quay-depot": { done: 5, expected: 10 },
};
const DEPOT_SOURCE: HeatmapViewerSource = {
  listHeatmaps: async () => [{ id: "layout", title: "Depot signage", regionCount: DEPOT_LAYOUT.regions.length }],
  getHeatmap: async () => ({ ...DEPOT_LAYOUT, id: "layout", title: "Depot signage", metrics: [{ id: "progress", label: "Signs fitted", kind: "progress" }] }),
  getSnapshot: async () => ({
    date: null,
    dates: [],
    computedAt: null,
    cells: Object.fromEntries(Object.entries(FITTED).map(([id, cell]) => [id, { progress: cell }])),
  }),
};

/* ---- HoverCard ---- */
const LINK_STYLE: CSSProperties = { color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 };
const hoverCard = (
  <Text>
    Handed the icon audit to{" "}
    <HoverCard
      trigger={
        <a href="#maya" style={LINK_STYLE}>
          @Maya
        </a>
      }
    >
      <Stack direction="row" gap="sm" align="center" style={{ minWidth: 200 }}>
        <Avatar {...avatarOf("maya")} />
        <Stack gap="xs">
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            {person("maya").name}
          </Text>
          <Text size="xs" color="secondary">
            {person("maya").role}
          </Text>
        </Stack>
      </Stack>
    </HoverCard>{" "}
    for the{" "}
    <HoverCard
      trigger={
        <a href="#harbour" style={LINK_STYLE}>
          {harbour.name}
        </a>
      }
    >
      <Stack gap="xs" style={{ minWidth: 220 }}>
        <Stack direction="row" gap="sm" align="center" style={{ justifyContent: "space-between" }}>
          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            {harbour.name}
          </Text>
          <Tag tone={STATUS_TONE[harbour.status]}>{harbour.status}</Tag>
        </Stack>
        <Text size="sm" color="secondary">
          {harbour.summary}
        </Text>
      </Stack>
    </HoverCard>{" "}
    launch.
  </Text>
);

/* ---- IndexBar ---- */
interface CrewEntry {
  name: string;
  detail: string;
  placeholder: number;
}
const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").toUpperCase();
const CREW_GROUPS: IndexBarGroup<CrewEntry>[] = (() => {
  const map = new Map<string, CrewEntry[]>();
  for (const e of CREW.map((m, i) => ({ name: m.name, detail: m.role, placeholder: i + 5 })).sort((a, b) => a.name.localeCompare(b.name))) {
    const key = e.name[0].toUpperCase();
    map.set(key, [...(map.get(key) ?? []), e]);
  }
  return [...map.entries()].map(([key, items]) => ({ key, items }));
})();
function CrewRow({ entry }: { entry: CrewEntry }) {
  return (
    <Stack direction="row" gap="sm" align="center" style={{ padding: "8px 12px", boxShadow: "0 1px 0 var(--rebar-color-border)" }}>
      <Avatar size="sm" alt={entry.name} fallback={initials(entry.name)} placeholder={entry.placeholder} />
      <span style={{ minWidth: 0 }}>
        <Text size="sm" style={{ display: "block", fontWeight: "var(--rebar-font-weight-semibold)" }}>
          {entry.name}
        </Text>
        <Text size="xs" color="secondary" style={{ display: "block" }}>
          {entry.detail}
        </Text>
      </span>
    </Stack>
  );
}

/* ---- LayersPanel ---- */
const LAYERS: LayerNode[] = [
  {
    id: "hero",
    name: "Hero",
    children: [
      { id: "headline", name: "Headline" },
      { id: "photo", name: "Harbour photo" },
      { id: "cta", name: "Call to action" },
    ],
  },
  {
    id: "nav",
    name: "Navigation",
    children: [
      { id: "logo", name: "Logo mark" },
      { id: "links", name: "Links", locked: true },
    ],
  },
  { id: "bg", name: "Background wash", hidden: true },
];
const setFlag = (nodes: LayerNode[], id: string, patch: Partial<LayerNode>): LayerNode[] =>
  nodes.map((n) => (n.id === id ? { ...n, ...patch } : { ...n, children: n.children ? setFlag(n.children, id, patch) : n.children }));
function LayersDemo() {
  const [layers, setLayers] = useState(LAYERS);
  return (
    <LayersPanel
      layers={layers}
      aria-label="Layers"
      onToggleLocked={(id, locked) => setLayers((l) => setFlag(l, id, { locked }))}
      onToggleHidden={(id, hidden) => setLayers((l) => setFlag(l, id, { hidden }))}
    />
  );
}

/* ---- Kanban ---- */
function KanbanDemo() {
  const [board, setBoard] = useState(kanbanBoard);
  return <Kanban columns={board.columns} cards={board.cards} onChange={setBoard} />;
}

/* ---- Mentions ---- */
const MENTION_OPTIONS = PEOPLE.map((p) => ({ id: p.id, label: p.name }));

/* ---- Menubar ---- */
const MENUS = [
  {
    label: "File",
    items: [
      { key: "new", label: "New project", onSelect: () => {} },
      { key: "open", label: "Open recent", onSelect: () => {} },
      { key: "export", label: "Export rota", onSelect: () => {} },
      { key: "sep-1", separator: true },
      { key: "archive", label: "Archive project", disabled: true, onSelect: () => {} },
    ],
  },
  { label: "Edit", items: [{ key: "copy", label: "Copy link", onSelect: () => {} }, { key: "rename", label: "Rename", onSelect: () => {} }] },
  { label: "View", items: [{ key: "board", label: "Board", onSelect: () => {} }, { key: "list", label: "List", onSelect: () => {} }] },
];

/* ---- MindMap ---- */
const BRANCHES = [
  { id: "brand", label: "Brand", children: [{ id: "palette", label: "Palette" }] },
  { id: "site", label: "Site", children: [{ id: "home", label: "Homepage" }, { id: "checklist", label: "Checklist" }] },
  { id: "signage", label: "Signage" },
  { id: "crew", label: "Crew comms" },
];

export const OPINION_A: ExampleMap = {
  Accordion: ex(accordion),
  ActionSheet: ex(actionSheet),
  AgentWall: ex(<AgentWall members={AGENT_MEMBERS} columns={3} rows={2} orb="css" filterMode="dim" />, { wide: true }),
  "Ai Chat": ex(block({ type: "ai-chat", title: "Tideline assistant", messages: AI_MESSAGES, placeholder: "Ask about a project", height: 280 })),
  AreaChart: ex(
    <AreaChart
      title="Tasks per week"
      xLabels={WEEK_LABELS.slice(-6)}
      height={180}
      series={[
        { label: "Opened", color: "var(--rebar-color-info)", values: OPENED_PER_WEEK.slice(-6) },
        { label: "Done", color: "var(--rebar-color-primary)", values: WEEKLY_DONE.slice(-6) },
      ]}
    />,
  ),
  BottomSheet: ex(bottomSheet),
  BoxPlot: ex(<BoxPlot title="Days to finish a task" height={190} yFormat={days} groups={BOX_GROUPS} />),
  BubbleChart: ex(<BubbleChart title="Budget vs. progress" height={200} xFormat={k} yFormat={(v) => `${Math.round(v)}%`} series={BUBBLE_SERIES} />),
  Calendar: ex(<CalendarDemo />, { wide: true }),
  CalendarHeatmap: ex(<CalendarHeatmap title="Tasks finished per day" data={tasksPerDay()} startDate="2026-08-03" endDate="2026-10-25" cellSize={12} colorScale={HEAT_SCALE} />),
  "Card Kanban": ex(
    block({
      type: "card-kanban",
      title: "Harbour rebrand",
      sharedWith: [{ name: "Maya Chen" }, { name: "Priya Nair" }],
      columns: (["todo", "doing"] as const).map((c) => ({
        id: c,
        title: COLUMN_TITLES[c],
        sections: [{ id: `${c}-main`, cardIds: TASKS.filter((t) => t.column === c && t.project === "harbour").map((t) => t.id) }],
      })),
      cards: Object.fromEntries(TASKS.filter((t) => t.project === "harbour").map((t) => [t.id, { id: t.id, title: t.title, tags: [t.tag] }])),
    }),
    { wide: true },
  ),
  Cascader: ex(<Cascader options={CASCADER_OPTIONS} defaultValue={["harbour", "palette"]} aria-label="Project and task" />),
  Collapsible: ex(
    <Collapsible trigger="Show budget details" defaultOpen>
      <Text size="sm">
        {gbp(harbour.budget)} budget for {harbour.name}, {harbour.done}% complete, due {harbour.due}.
      </Text>
    </Collapsible>,
  ),
  ColorPicker: ex(
    <Stack direction="row" gap="md" align="center">
      <ColorPicker defaultValue="#0066cc" aria-label="Label colour" />
      <Text size="sm" color="secondary">
        {harbour.name}
      </Text>
    </Stack>,
  ),
  Combobox: ex(<Combobox options={PEOPLE_OPTIONS} defaultValue="maya" placeholder="Choose a teammate" aria-label="Assignee" />),
  CommandPalette: ex(<PaletteDemo />),
  CommentThread: ex(<ThreadDemo />),
  ConstructSearch: ex(<ConstructSearch results={SEARCH_RESULTS} placeholder="Search the library" aria-label="Search constructs" />),
  ContextMenu: ex(
    <ContextMenu items={FILE_ITEMS}>
      <Card style={{ padding: 20, textAlign: "center" }}>
        <Stack gap="xs" align="center">
          <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{FILES[0].name}</Text>
          <Text size="sm" color="secondary">
            Right-click or long-press
          </Text>
        </Stack>
      </Card>
    </ContextMenu>,
  ),
  DataGrid: ex(<GridDemo />, { wide: true }),
  DatePicker: ex(<DatePickerDemo />),
  Dialog: ex(dialog),
  DistributionChart: ex(
    <DistributionChart
      title="Days to finish a task"
      height={170}
      xFormat={(v) => `${v} d`}
      series={[
        { label: "Design", mean: 4.2, stdDev: 1.1, color: "var(--rebar-color-primary)" },
        { label: "Engineering", mean: 6.5, stdDev: 2, color: "var(--rebar-color-info)" },
        { label: "Operations", mean: 3, stdDev: 0.8, color: "var(--rebar-color-success)" },
      ]}
    />,
  ),
  Drawer: ex(drawer),
  Dropdown: ex(<Dropdown trigger={<Button variant="secondary">Sort: Due date</Button>} items={SORTS.map((s) => ({ key: s, label: s, onSelect: () => {} }))} />),
  Editable: ex(<Editable defaultValue={harbour.name} aria-label="Project name" />),
  Ellipsis: ex(<Ellipsis content={NOTE} rows={2} expandText="More" collapseText="Less" />),
  EmailCapture: ex(<EmailCapture onSubmit={later} submitLabel="Notify me" helperText="We will only email you about the launch." />),
  FileManager: ex(<FileManager root={FILE_ROOT} aria-label="Project files" />, { wide: true }),
  FileUpload: ex(<FileUpload multiple maxSizeBytes={5 * 1024 * 1024} files={UPLOADS} />),
  FloatAssistant: ex(<AssistantDemo />),
  FloatingBubble: ex(
    <div style={{ ...FRAME, height: 170 }}>
      <Stack gap="xs" style={{ padding: 14 }}>
        <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{harbour.name}</Text>
        <Text size="sm" color="secondary">
          Drag the bubble around.
        </Text>
      </Stack>
      <FloatingBubble axis="xy" magnetic="x" style={{ position: "absolute", bottom: 16, right: 16 }}>
        +
      </FloatingBubble>
    </div>,
  ),
  FloatingPanel: ex(
    <div style={{ ...FRAME, height: 280 }}>
      <FloatingPanel anchors={[80, 180, 260]} defaultHeight={180} style={{ position: "absolute" }} header={<Heading level={3}>Projects</Heading>} aria-label="Projects">
        <Stack gap="sm">
          {PROJECTS.slice(0, 4).map((p) => (
            <Stack key={p.id} direction="row" gap="sm" align="center">
              <Avatar {...avatarOf(p.owner)} size="sm" />
              <Text size="sm" style={{ flex: 1 }}>
                {p.name}
              </Text>
              <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
            </Stack>
          ))}
        </Stack>
      </FloatingPanel>
    </div>,
  ),
  FloatingSelectionToolbar: ex(<SelectionDemo />),
  Flowchart: ex(<Flowchart title="Task review" steps={REVIEW_STEPS} />, { wide: true }),
  Form: ex(form),
  "Goal Tracker": ex(
    block({
      type: "goal-tracker",
      aspiration: "Launch the Harbour rebrand on 24 Oct",
      celebration: "small",
      focusAreas: [
        {
          id: "fa1",
          text: "Identity",
          goals: [
            { id: "g1", text: "Sign off the brand palette", completed: true },
            { id: "g2", text: "Finish the icon audit", completed: false },
          ],
        },
        {
          id: "fa2",
          text: "Launch",
          goals: [{ id: "g4", text: "Draft the launch checklist", completed: false }],
        },
      ],
    }),
  ),
  GraphExplorer: ex(<GraphExplorer nodes={GRAPH.nodes} edges={GRAPH.edges} title="Who is on what" width={320} height={280} />, { wide: true }),
  Heatmap: ex(<Heatmap title="Tasks done this week" rows={HEAT_ROWS} cols={HEAT_DAYS} data={HEAT_DATA} cellSize={30} />),
  HeatmapPainter: ex(<PainterDemo />, { wide: true }),
  HeatmapViewer: ex(<HeatmapViewer source={DEPOT_SOURCE} title="Depot signage" />, { wide: true }),
  Histogram: ex(<Histogram title="Days from To do to Done" height={180} series={[{ label: "All tasks", values: CYCLE_ALL }]} />),
  HoverCard: ex(hoverCard),
  Image: ex(<Image src="/art/grain-dawn.svg" alt="Harbour van livery" width={240} height={150} />),
  ImageCropper: ex(<ImageCropper src="/art/grain-dawn.svg" alt="Van livery photo" width={240} height={160} aspectRatio={1} />),
  IndexBar: ex(
    <div style={{ position: "relative", overflow: "hidden", border: "1px solid var(--rebar-color-border)", borderRadius: 14 }}>
      <IndexBar groups={CREW_GROUPS} height={260} renderItem={(e) => <CrewRow entry={e} />} />
    </div>,
  ),
  IndexChart: ex(
    <IndexChart
      title="Spend, indexed to 100"
      height={180}
      xLabels={["Jun", "Jul", "Aug", "Sep", "Oct"]}
      series={[
        { label: "Harbour rebrand", values: [9000, 17500, 26400, 38100, 46500] },
        { label: "Tideline mobile", values: [30000, 42000, 53000, 62000, 70500] },
      ]}
    />,
  ),
  Kanban: ex(<KanbanDemo />, { wide: true }),
  LayersPanel: ex(<LayersDemo />),
  Lightbox: ex(<Lightbox src="/art/grain-dawn.svg" alt="Harbour van livery, rear doors" onCopy={() => {}} onDownload={() => {}} />),
  LineChart: ex(
    <LineChart
      title="Tasks per week"
      height={180}
      xLabels={WEEK_LABELS}
      labelStep={3}
      series={[
        { label: "Done", values: WEEKLY_DONE },
        { label: "Opened", values: OPENED_PER_WEEK, dashed: true },
      ]}
    />,
  ),
  Mentions: ex(<Mentions options={MENTION_OPTIONS} defaultValue="Thanks @Maya Chen, the palette is perfect." rows={3} />),
  Menubar: ex(<Menubar items={MENUS} />),
  MindMap: ex(<MindMap topic="Harbour launch" branches={BRANCHES} height={300} />, { wide: true }),
};

