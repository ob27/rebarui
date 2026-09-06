import { DiagramMinimap, Heading, NodeLinkGraph, Stack, Text } from "rebar-ui";
import type { NodeLinkGraphEdge, NodeLinkGraphNode } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// One shared coordinate dataset, fed to both `NodeLinkGraph` (manual layout, so these `x`/`y`
// values are used verbatim rather than recomputed) and `DiagramMinimap` below — the whole point of
// this pairing is that the thumbnail is a small-scale read of the SAME diagram, not a lookalike
// with its own arbitrary numbers.
const WORKFLOW_NODES: NodeLinkGraphNode[] = [
  { id: "kickoff", label: "Kickoff", x: 280, y: 30 },
  { id: "design", label: "Design", x: 140, y: 140 },
  { id: "dev", label: "Development", x: 420, y: 140 },
  { id: "wireframes", label: "Wireframes", x: 70, y: 250 },
  { id: "visual-qa", label: "Visual QA", x: 210, y: 250 },
  { id: "backend", label: "Backend", x: 350, y: 250 },
  { id: "frontend", label: "Frontend", x: 490, y: 250 },
  { id: "launch", label: "Launch", x: 280, y: 350 },
];

const WORKFLOW_EDGES: NodeLinkGraphEdge[] = [
  { source: "kickoff", target: "design" },
  { source: "kickoff", target: "dev" },
  { source: "design", target: "wireframes" },
  { source: "design", target: "visual-qa" },
  { source: "dev", target: "backend" },
  { source: "dev", target: "frontend" },
  { source: "wireframes", target: "launch" },
  { source: "visual-qa", target: "launch", label: "approved" },
  { source: "backend", target: "launch" },
  { source: "frontend", target: "launch", label: "shipped" },
];

// Illustrative only — `NodeLinkGraph` doesn't (yet) expose its live pan/zoom transform as a
// controlled value a caller can read, so this is a fixed rect in the same coordinate space rather
// than one wired to the diagram's actual current viewport.
const ILLUSTRATIVE_VIEWPORT = { x: 20, y: 0, width: 520, height: 210 };

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<NodeLinkGraph\n  layout="manual"\n  nodes={[{ id: "kickoff", label: "Kickoff", x: 280, y: 30 }, { id: "design", label: "Design", x: 140, y: 140 }, /* ... */]}\n  edges={[{ source: "kickoff", target: "design" }, /* ... */]}\n/>\n<DiagramMinimap\n  nodes={[{ id: "kickoff", x: 280, y: 30 }, { id: "design", x: 140, y: 140 }, /* same coordinates */]}\n  viewportBounds={{ x: 20, y: 0, width: 520, height: 210 }}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["DiagramMinimap"] ?? [] },
  {
    type: "doc-section",
    heading: "Designed to pair with NodeLinkGraph, not built on it",
    body: [
      {
        kind: "text",
        text: "This is a genuinely standalone, static component — it runs no layout or interaction logic of its own, just draws a dot per already-resolved node position, scaled into a small frame. It's *designed* to pair with a `NodeLinkGraph` (or any similar pannable canvas) elsewhere on the page by sharing the same coordinate data — the caller feeds it the same node positions and current viewport rect the real canvas is using — not because it wraps one internally, as shown above. There's no single \"full canvas size\" prop: the coordinate space this component scales from is inferred from the data itself (every node position, plus the viewport rect's own corners, if supplied), the same \"fit to content\" approach a real minimap control takes.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="diagram-minimap"` on the root `<figure>`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — AntD ships no diagramming components of its own; a minimap/overview navigator typically migrates as part of whichever dedicated canvas library (React Flow, AntV X6) the paired main diagram uses.",
      },
    ],
  },
];

export default function DiagramMinimapPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DiagramMinimap</Heading>
      <Text color="secondary">
        A small, static thumbnail overview of a large pannable canvas — a dot per node, an
        optional viewport highlight. Shown here paired with the real{" "}
        <code>NodeLinkGraph</code> it summarizes, both reading from the same node coordinates —
        on its own, with no larger diagram to summarize, a handful of dots in a box has nothing to
        read as a thumbnail *of*.
      </Text>

      <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
        <LivePreview>
          <NodeLinkGraph
            layout="manual"
            title="Project workflow"
            width={560}
            height={380}
            nodes={WORKFLOW_NODES}
            edges={WORKFLOW_EDGES}
          />
        </LivePreview>

        <Stack gap="xs" style={{ width: 200 }}>
          <DiagramMinimap
            title="Minimap of the diagram at left"
            width={200}
            height={140}
            nodes={WORKFLOW_NODES.map(({ id, x, y }) => ({ id, x: x ?? 0, y: y ?? 0 }))}
            viewportBounds={ILLUSTRATIVE_VIEWPORT}
          />
          <Text color="secondary" style={{ fontSize: "var(--rebar-font-size-xs)" }}>
            The highlighted rectangle is an illustrative viewport — e.g. what a caller would pass
            after panning/zooming the diagram to focus on its top half.
          </Text>
        </Stack>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
