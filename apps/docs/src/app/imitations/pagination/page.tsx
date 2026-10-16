"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Card, Heading, Pagination, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, person, project } from "@/fixtures/tideline";

const CODE = `<Pagination current={page} total={12} onChange={setPage} aria-label="Tasks" />
<Text size="sm" color="secondary">Showing {(page - 1) * 10 + 1} to {page * 10} of 118 tasks</Text>`;

const PER_PAGE = 10;
const TOTAL_TASKS = 118;
const PAGES = Math.ceil(TOTAL_TASKS / PER_PAGE);

function Pager() {
  const [page, setPage] = useState(3);
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, TOTAL_TASKS);
  return (
    <Stack gap="md" align="start">
      <Pagination current={page} total={PAGES} onChange={setPage} aria-label="Tasks" />
      <Text size="sm" color="secondary">
        Showing {from} to {to} of {TOTAL_TASKS} tasks
      </Text>
    </Stack>
  );
}

const TH: CSSProperties = { textAlign: "left", fontSize: "0.68rem", fontWeight: "var(--rebar-font-weight-semibold)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)", padding: "4px 0 10px" };
const TD: CSSProperties = { padding: "10px 0", borderTop: "1px solid var(--rebar-color-border)", fontSize: "var(--rebar-font-size-sm)" };

function TaskTable() {
  const [page, setPage] = useState(3);
  const rows = TASKS.filter((t) => t.column !== "done").slice(0, 3);
  return (
    <Card style={{ maxWidth: 560, margin: "0 auto" }}>
      <Stack gap="md">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={TH}>Task</th>
              <th style={TH}>Owner</th>
              <th style={{ ...TH, textAlign: "right" }}>Due</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td style={TD}>{t.title}</td>
                <td style={TD}>{person(t.assignee).name.split(" ")[0]}</td>
                <td style={{ ...TD, textAlign: "right" }}>{project(t.project).due}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Stack direction="row" justify="between" align="center" gap="md" style={{ flexWrap: "wrap" }}>
          <Text size="sm" color="secondary">
            Page {page} of {PAGES}
          </Text>
          <Pagination current={page} total={PAGES} onChange={setPage} aria-label="Task pages" />
        </Stack>
      </Stack>
    </Card>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Pagination"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real `<nav aria-label>` landmark; the active page carries `aria-current="page"`; Previous and Next disable themselves at the ends. Only the first, last, current and its neighbours render, with an ellipsis for the rest.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="pagination"`; `data-rebar-part` is `"prev"`, `"page"` or `"next"`; the active page carries `data-rebar-active`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "A close, low-risk rename: AntD's `Pagination` takes the same `current`/`total`/`onChange` shape (its `total` counts items, not pages)." }],
  },
];

export default function PaginationPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Pagination</Heading>
      <Text color="secondary">Page through a list.</Text>

      <DemoStage
        title="Pagination"
        caption="Pages with arrows"
        code={CODE}
        states={[
          { label: "Last page", node: <Pagination defaultCurrent={PAGES} total={PAGES} aria-label="Last page" /> },
          { label: "Disabled", node: <Pagination defaultCurrent={2} total={3} disabled aria-label="Disabled" /> },
        ]}
      >
        <Pager />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Task table" caption="Page count on the left, pages on the right">
        <TaskTable />
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
