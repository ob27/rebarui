"use client";

import { AgentTile, AgentWall, Button, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { useEffect, useState } from "react";
import type { AgentWallMember } from "rebar-ui";
import { PROJECTS } from "@/fixtures/tideline";

const ACTIVITY = [
  "Drafting the launch checklist.",
  "Reading the crew interview notes.",
  "Comparing two signage quotes.",
  "Summarising the week for Maya.",
  "Waiting on the rota data.",
  "Checking the palette against the brand guide.",
];
const NAMES = ["Scribe", "Planner", "Courier", "Auditor", "Linker", "Tagger", "Sorter", "Watcher", "Mapper", "Nudger", "Packer", "Runner"];
const SERVICE_ID = "sync";
const WORKER_ID = "export";

function initialMembers(): AgentWallMember[] {
  const agents: AgentWallMember[] = NAMES.map((name, i) => ({
    id: `a${i}`,
    name,
    project: `${PROJECTS[i % PROJECTS.length].name} > ${i % 2 === 0 ? "Tasks" : "Files"}`,
    status: i === 7 ? "stalled" : i === 9 ? "idle" : "active",
    statusLabel: i === 9 ? "Idle 30mins" : undefined,
    activity: ACTIVITY[i % ACTIVITY.length],
  }));
  // Two quiet agents: ghosts, most likely just not active.
  agents[3] = { ...agents[3], status: "ghost", statusLabel: "Ghost", activity: undefined };
  agents[10] = { ...agents[10], status: "ghost", statusLabel: "Ghost", activity: undefined };
  return [
    ...agents,
    { id: SERVICE_ID, name: "Sync service", kind: "service", project: "Tideline mobile", status: "active", activity: "Sync service: heartbeat ok" },
    { id: WORKER_ID, name: "Export worker", kind: "service", project: "Rota export", status: "active", activity: "Export worker: heartbeat ok" },
  ];
}

const CODE = `<AgentWall
  members={members}        // { id, name, kind?, project?, status?, statusLabel?, activity? }[]
  title="Tideline crew"
  actions={<a href="/join">Add an agent</a>}
  columns={5}
  rows={4}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AgentWall"] ?? [] },
  {
    type: "doc-section",
    heading: "Statuses",
    body: [
      {
        kind: "text",
        text: "A tile is `active`, `idle`, `stalled`, `failure`, `ghost` or `offline`. A service that reports trouble or stops answering is `failure`; an agent that has gone quiet is a `ghost`, faded and not a failure. The host decides when a ghost leaves `members`. Each tile wears a persona orb (`agentPersona(kind, status)`), or `look=\"avatar\"` for an illustrated face; a CSS look-alike replaces the orb without WebGL or under reduced motion.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "AgentTile",
    body: [
      {
        kind: "text",
        text: "`AgentTile` is the single tile the wall repeats, exported on its own: an orb, a name, `Project > Path`, a status dot and one line of activity. It is a fixed size, so long text is cut with an ellipsis. Pass `onSelect` to make it a button.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="agent-wall"` with `data-rebar-filter-mode`; parts `header`, `toolbar`, `grid`, `empty`, `pages`. Each tile is `data-rebar-component="agent-tile"` with `data-rebar-status`, `data-rebar-kind`, and `data-rebar-dimmed`/`data-rebar-selected` when set; its parts are `orb`, `name`, `status`, `project`, `activity`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. Ant Design has no status-wall component; compose its `Card`/`Avatar`/`Badge`/`Pagination` against the same members array.",
      },
    ],
  },
];

export default function AgentWallPage() {
  const [members, setMembers] = useState<AgentWallMember[]>(initialMembers);
  const [failed, setFailed] = useState(false);

  // Fake backend: every couple of seconds a few agents change what they are doing, and the services send a heartbeat.
  useEffect(() => {
    let beat = 0;
    const id = setInterval(() => {
      beat += 1;
      setMembers((prev) =>
        prev.map((m, i) => {
          if (m.id === SERVICE_ID) {
            return failed
              ? { ...m, status: "failure", statusLabel: "Not responding", activity: "Sync service: no heartbeat, likely failed" }
              : { ...m, status: "active", statusLabel: undefined, activity: `Sync service: heartbeat #${beat}` };
          }
          if (m.id === WORKER_ID) {
            // The worker reports a suspected leak for a few beats, then recovers: an active failure, not silence.
            return beat % 9 >= 4 && beat % 9 <= 6
              ? { ...m, status: "failure", statusLabel: "Leaking memory?", activity: "Export worker: memory climbing, may be leaking" }
              : { ...m, status: "active", statusLabel: undefined, activity: `Export worker: heartbeat #${beat}` };
          }
          if (m.status === "ghost") return m;
          if ((i + beat) % 7 !== 0) return m;
          const active = m.status !== "active";
          return { ...m, status: active ? "active" : "idle", statusLabel: active ? undefined : "Idle 1min", activity: ACTIVITY[(i + beat) % ACTIVITY.length] };
        }),
      );
    }, 2500);
    return () => clearInterval(id);
  }, [failed]);

  return (
    <Stack gap="lg">
      <Heading level={1}>AgentWall</Heading>
      <Text color="secondary">A paged wall of agent and service tiles with search and a status filter.</Text>

      <DemoStage title="Tideline crew" caption="Agents and services; use the button to stop the sync service and watch its tile fail" code={CODE} widths={false}
        states={[
          { label: "Single tile", node: <AgentTile name="Scribe" project="Harbour rebrand > Tasks" status="active" activity="Drafting the launch checklist." orb="css" /> },
          { label: "Empty", node: <AgentWall members={[]} emptyText="No agents are running." orb="css" columns={2} rows={1} /> },
          { label: "One service failing", node: <AgentWall members={members.filter((m) => m.id === SERVICE_ID).map((m) => ({ ...m, status: "failure", statusLabel: "Not responding", activity: "Sync service: no heartbeat" }))} orb="css" columns={1} rows={1} /> },
        ]}
      >
        <Stack gap="md">
          <Stack direction="row" gap="sm">
            <Button variant="secondary" onClick={() => setFailed((f) => !f)}>
              {failed ? "Recover the service" : "Fail the service"}
            </Button>
          </Stack>
          <AgentWall members={members} filterMode="hide" look="orb" title="Tideline crew" actions={<Button variant="tertiary" size="sm">Add an agent</Button>} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Operations" caption="A compact wall in a card, dimming what the filter hides" widths={false}>
        <Card title="Running now" subtitle="Rota export and Harbour launch" extra={<Tag tone="success">{members.filter((m) => m.status === "active").length} active</Tag>}>
          <AgentWall members={members.slice(0, 6)} columns={3} rows={2} filterMode="dim" orb="css" />
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
