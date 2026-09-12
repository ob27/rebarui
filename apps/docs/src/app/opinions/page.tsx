import { Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { shippedCategory } from "@/data/shippedCategory";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { BlockEntry } from "@/components/BlockEntry";

const CATEGORY_LABEL = { web: "Web", mobile: "Mobile", diagram: "Diagram" } as const;
const CATEGORY_TONE = { web: "info", mobile: "success", diagram: "warning" } as const;

export default function OpinionsPage() {
  const names = tierComponentNames("opinion");

  const grid: Block = {
    type: "card-grid",
    items: [
      ...names.map((name) => {
        const href = HAS_FULL_PAGE[name];
        const category = shippedCategory(name);
        return { title: name, href, linkLabel: "View reference →", tags: [{ label: CATEGORY_LABEL[category], tone: CATEGORY_TONE[category] }] };
      }),
      // The one genuine "rolled up" case (see /docs/tiers): Card's default config is a Synthetic
      // (see /synthetics), but `editable` grafts real click-to-edit state via Editable — an
      // Opinion. Same physical component/page, cross-linked here rather than duplicated as a
      // second export.
      {
        title: "Card (editable)",
        href: "/synthetics/card",
        linkLabel: "View reference →",
        tags: [{ label: "See Synthetics for the default config", tone: "info" as const }],
      },
    ],
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>Opinions</Heading>
      <Text color="secondary">
        Real internal state — validation, morphing, multi-step flow, drag/reorder,
        search-and-filter, open/closed with focus management. Several components delegate their
        entire state machine to a wrapped Radix primitive (Select, Accordion, Tabs, Dialog,
        Popover, …) and show zero own useState in their own source — they&apos;re still Opinions;
        you can&apos;t determine tier by grepping for state alone. For blocks, Opinion is a
        mechanical, compiler-checked fact: a block is an Opinion iff its schema type declares a{" "}
        <code>source</code> or <code>onX</code> live-data-binding field (
        <code>packages/placement/src/opinions.ts</code>), not a judgment call — these are the only
        nine blocks that support the live <code>data</code>/<code>handlers</code> props on{" "}
        <code>BlockRenderer</code>. See{" "}
        <a href="/docs/tiers" className="rebar-link">
          the four tiers
        </a>{" "}
        for how this relates to Imitations, Synthetics, and Orders.
      </Text>

      <Heading level={2}>Components ({names.length})</Heading>
      <NextBlockRenderer blocks={[grid]} />

      <Heading level={2}>Blocks (9)</Heading>

      <BlockEntry
        id="goal-tracker"
        measured={false}
        description="A hierarchical goal/OKR tracker: one Aspiration, several Focus Areas, each holding several Goals — all three levels inline-editable, goals toggle complete with a celebratory confetti burst (TodoItem underneath), and Add/Delete affordances mutate the board. Supports a live source (a GoalTrackerSource) and onChange handler, resolved by BlockRenderer's data/handlers props — the same real-state-machine reason this block is an Opinion, not a Synthetic."
        shape={`{ type: "goal-tracker", aspiration?: string, focusAreas?: GoalTrackerFocusAreaData[], source?: string, onChange?: string, celebration?: "none" | "small" | "big" }
// GoalTrackerFocusAreaData = { id: string, text: string, goals: GoalTrackerGoalData[] }
// GoalTrackerGoalData = { id: string, text: string, completed: boolean }`}
        blocks={[
          {
            type: "goal-tracker",
            aspiration: "Become the top board network",
            focusAreas: [
              {
                id: "fa1",
                text: "Grow membership",
                goals: [
                  { id: "g1", text: "Reach 500 members", completed: false },
                  { id: "g2", text: "Host 3 events", completed: true },
                ],
              },
            ],
          },
        ]}
      />

      <BlockEntry
        id="ai-chat"
        measured={false}
        description="A chat surface: ChatThread (the transcript) + AiChatInput (the composer). A literal messages array renders a static-render demo (send appends locally, never fabricates a reply); setting source/onSend instead binds the transcript and send handler to a real backend — see ref/PLACEMENT_LIVE_DATA.md for why this exists. intent is computed from the current draft text (/ for command, ? for search)."
        shape={`{ type: "ai-chat", title?: string, messages?: AiChatMessageData[], source?: string, onSend?: string, placeholder?: string, dictation?: boolean, height?: number }
// AiChatMessageData = { id: string, role: "user" | "assistant", content: string, status?: "sending"|"sent"|"streaming"|"error", avatarFallback?: string, avatarSrc?: string, avatarPlaceholder?: boolean }`}
        blocks={[
          {
            type: "ai-chat",
            title: "Support chat",
            messages: [
              { id: "1", role: "assistant", content: "How can I help today?", avatarFallback: "AI" },
              { id: "2", role: "user", content: "My order hasn't arrived yet.", avatarFallback: "JD" },
            ],
          },
        ]}
      />

      <BlockEntry
        id="table"
        measured={false}
        description="A bordered data table with exactly the columns you give it. Wraps the real Table component (sortable columns, on by default). searchPlaceholder/filters/addable/exportable/copyable add real, working controls. A literal rows array is static; source/onAddRow/onRowAction bind rows, the add flow, and per-row actions to real backend calls instead — the reason this block is an Opinion. loading forwards straight to the real Table component."
        shape={`{ type: "table", columns: string[], rows?: { cells: string[], actionLabel?: string }[], source?: string, sortable?: boolean, searchPlaceholder?: string, filters?: { label: string, columnIndex: number, options: string[] }[], addable?: boolean | { label?: string }, onAddRow?: string, onRowAction?: string, loading?: boolean, exportable?: boolean, copyable?: boolean }`}
        blocks={[
          {
            type: "table",
            columns: ["Team", "Lead", "Status"],
            searchPlaceholder: "Search teams...",
            filters: [{ label: "Status", columnIndex: 2, options: ["Active", "Archived"] }],
            addable: { label: "Add team" },
            exportable: true,
            copyable: true,
            rows: [
              { cells: ["Engineering", "Priya Shah", "Active"], actionLabel: "Select" },
              { cells: ["Design", "Marcus Webb", "Active"], actionLabel: "Select" },
              { cells: ["Platform", "Jordan Lee", "Archived"], actionLabel: "Select" },
            ],
          },
        ]}
      />

      <BlockEntry
        id="wizard"
        measured={false}
        description="A multi-step form container — Steps for progress, one step's fields shown at a time, a Back/Next/Submit footer. Next/Submit is disabled until the current step's required fields are filled. A wizard's steps are static content, but onSubmit forwards the real Wizard component's own onSubmit (fired with the collected values on completion) — its result is real live output a backend-driven app needs, which is why this block is an Opinion despite having no source of its own."
        shape={`{ type: "wizard", steps: { label: string, description?: string, fields: FormField[] }[], submitLabel?: string, backLabel?: string, nextLabel?: string, onSubmit?: string }`}
        blocks={[
          {
            type: "wizard",
            steps: [
              { label: "Team", fields: [{ kind: "text", label: "Team name", required: true }] },
              { label: "Details", fields: [{ kind: "textarea", label: "Notes" }] },
            ],
          },
        ]}
      />

      <BlockEntry
        id="card-kanban"
        measured={false}
        description="A drag-and-drop card board — title, optional shared-with avatars, a Share action, a search box, and an optional Board settings button, all above the real Kanban component: arbitrary columns, optional dividers, cards/columns draggable, per-column/per-section card limits. Literal columns/cards seed a local-only board; source/onChange bind the whole board state to real backend reads/writes instead — Kanban's own onChange forwarded straight through."
        shape={`{ type: "card-kanban", title: string, sharedWith?: { name: string, avatarSrc?: string }[], shareUrl?: string, columns?: KanbanColumnData[], cards?: Record<string, KanbanCardData>, source?: string, onChange?: string, searchPlaceholder?: string, settingsBlocks?: Block[] }
// KanbanColumnData = { id: string, title: string, sections: KanbanSectionData[], limit?: number }
// KanbanSectionData = { id: string, label?: string, cardIds: string[], limit?: number }
// KanbanCardData = { id: string, title: string, description?: string, tags?: string[] }`}
        blocks={[
          {
            type: "card-kanban",
            title: "Sprint board",
            sharedWith: [{ name: "Priya Shah" }, { name: "Jae Kim" }],
            columns: [
              { id: "todo", title: "To do", sections: [{ id: "todo-main", cardIds: ["spec"] }] },
              { id: "done", title: "Done", sections: [{ id: "done-main", cardIds: ["ship"], limit: 1 }] },
            ],
            cards: {
              spec: { id: "spec", title: "Write spec", tags: ["docs"] },
              ship: { id: "ship", title: "Ship it" },
            },
          },
        ]}
      />

      <BlockEntry
        id="sticky-kanban"
        measured={false}
        description="The exact same board, chrome, and live-binding shape as card-kanban — with one difference: Kanban's cardVariant=&quot;sticky&quot; instead of the default. Postit-style cards capped at 3 per column; click (not drag) opens an edit form for a sticky's title/description/tags/color. A mutation of the same primitive, not a second component."
        shape={`{ type: "sticky-kanban", title: string, sharedWith?: { name: string, avatarSrc?: string }[], shareUrl?: string, columns?: KanbanColumnData[], cards?: Record<string, KanbanCardData>, source?: string, onChange?: string, searchPlaceholder?: string, settingsBlocks?: Block[] }
// same KanbanColumnData/KanbanSectionData/KanbanCardData shapes as card-kanban, above`}
        blocks={[
          {
            type: "sticky-kanban",
            title: "Retro board",
            columns: [
              { id: "went-well", title: "Went well", sections: [{ id: "went-well-main", cardIds: ["went1"] }] },
              { id: "improve", title: "To improve", sections: [{ id: "improve-main", cardIds: ["improve1"] }] },
            ],
            cards: {
              went1: { id: "went1", title: "Fast turnaround on reviews" },
              improve1: { id: "improve1", title: "Standup ran long" },
            },
          },
        ]}
      />

      <BlockEntry
        id="scatter-chart"
        measured={false}
        description="A distribution scatter plot — each series' individual values plotted as a jittered column of points, with a dashed line marking that series' mean. A filter footer toggles series visibility. A literal series array is static; source binds it to live data instead — read-only, since a chart has no meaningful user-initiated write-back."
        shape={`{ type: "scatter-chart", title?: string, ariaLabel?: string, height?: number, series: { label: string, color?: string, values: number[] }[], source?: string }`}
        blocks={[
          {
            type: "scatter-chart",
            title: "Token cost, antd vs. rebar-ui",
            series: [
              { label: "antd", values: [31231, 31131, 30891, 31921, 30950] },
              { label: "rebar-ui", values: [30211, 30212, 30149, 30253, 30180] },
            ],
          },
        ]}
      />

      <BlockEntry
        id="line-chart"
        measured={false}
        description="A multi-series line chart over an ordered x-axis — for cumulative cost/measurement comparisons where one series may overtake another partway through (crossoverIndex). Same series-toggle filter footer and live source binding as scatter-chart. xLabels stays literal-only for now."
        shape={`{ type: "line-chart", title?: string, ariaLabel?: string, height?: number, xLabels: string[], labelStep?: number, crossoverIndex?: number, series: { label: string, color?: string, values: number[], dashed?: boolean }[], source?: string }`}
        blocks={[
          {
            type: "line-chart",
            title: "Cumulative cost per round",
            xLabels: ["R0", "R1", "R2", "R3"],
            crossoverIndex: 3,
            series: [
              { label: "antd", values: [10, 20, 30, 42] },
              { label: "rebar-ui + migration", values: [22, 28, 35, 40], dashed: true },
            ],
          },
        ]}
      />

      <BlockEntry
        id="stacked-bar-chart"
        measured={false}
        description="A stacked bar chart — each bar broken into labeled cost/quantity segments, with the bar's own total shown above it. A filter footer toggles one distinct segment label across every bar at once. Same live source binding as the other two chart blocks."
        shape={`{ type: "stacked-bar-chart", title?: string, ariaLabel?: string, height?: number, bars: { label: string, segments: { label: string, value: number, color?: string }[] }[], source?: string }`}
        blocks={[
          {
            type: "stacked-bar-chart",
            title: "Cost composition",
            bars: [
              {
                label: "Hire developers",
                segments: [
                  { label: "Build", value: 16800 },
                  { label: "Revisions", value: 16800 },
                ],
              },
              {
                label: "AI-assisted",
                segments: [{ label: "Oversight", value: 3500 }],
              },
            ],
          },
        ]}
      />
    </Stack>
  );
}
