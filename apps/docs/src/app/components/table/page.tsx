"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Button, Heading, Stack, Table, Tag, Text } from "rebar-ui";
import type { TableColumn, TableSort } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

interface Row {
  id: string;
  team: string;
  lead: string;
  status: string;
  members: number;
}

const ROWS: Row[] = [
  { id: "1", team: "Engineering", lead: "Priya Shah", status: "Active", members: 12 },
  { id: "2", team: "Design", lead: "Marcus Webb", status: "Active", members: 5 },
  { id: "3", team: "Platform", lead: "Jordan Lee", status: "Archived", members: 3 },
  { id: "4", team: "Growth", lead: "Amelia Chen", status: "Active", members: 7 },
  { id: "5", team: "Data", lead: "Noah Kim", status: "Active", members: 4 },
  { id: "6", team: "Support", lead: "Elena Ruiz", status: "Archived", members: 9 },
];

const COLUMNS: TableColumn<Row>[] = [
  { key: "team", header: "Team", sortable: true },
  { key: "lead", header: "Lead", sortable: true },
  { key: "status", header: "Status", sortable: true },
];

const RICH_COLUMNS: TableColumn<Row>[] = [
  { key: "team", header: "Team", sortable: true },
  { key: "lead", header: "Lead", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value) => <Tag tone={value === "Active" ? "success" : "default"}>{String(value)}</Tag>,
  },
  { key: "members", header: "Members", sortable: true, align: "right" },
];

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Table columns={[{ key: "team", header: "Team", sortable: true }]} data={rows} rowKey="id" selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} pageSize={10} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Table"] ?? [] },
  {
    type: "doc-section",
    heading: "rowKey stays plain data, not a function",
    body: [
      {
        kind: "text",
        text: "`rowKey` accepts a plain property-name string (`\"id\"`) as well as a function — the common case never needs to construct a closure just to use this component. This matters beyond convenience: a component that pulls in any Radix primitive (`Table` composes `Checkbox` for row selection) becomes a client-component boundary the moment a Next.js App Router Server Component imports it, and a *function*-valued prop constructed in that calling Server Component fails at build time. `column.accessor`/`render` are optional for the same reason, defaulting to a plain `row[key]` lookup.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Real mutations beyond the baseline example",
    body: [
      {
        kind: "text",
        text: "Beyond sortable columns and row selection: a custom `render` per column (a status pill via `Tag`, right-aligned numeric column via `align`); `pageSize`/`page`/`onPageChange` for real pagination instead of one long scrolling list; `loading` (a real loading state, not just an empty table mid-fetch); `emptyMessage` for a genuinely empty dataset; `maxHeight` bounding the scrollable body under a sticky header, per ref/HEURISTICS.md #45; and a real, visible `caption`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "The table block adds search, filters, and sort",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/placement`'s `table` block wraps this component with a search box (matches any cell) and named exact-match filters (collapsing past 2 into a \"More filters\" popover) — never a bare 1:1 pass-through. See it live on [/blocks](/blocks#table).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="table"` on the root; `data-rebar-part` is `"th"`, `"td"`, `"sort-button"`, `"pagination"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Table` is a close structural match (columns/dataSource, sortable columns, row selection, pagination) — a migration maps this component's `columns`/`data`/`rowKey` onto AntD's `columns`/`dataSource`/`rowKey` directly.",
      },
    ],
  },
];

function Mutation({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap="xs">
      <Text size="sm" color="secondary">
        {label}
      </Text>
      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}

export default function TablePage() {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <Stack gap="lg">
      <Heading level={1}>Table</Heading>
      <Text color="secondary">
        Sortable columns, a sticky header over a bounded scrollable body, optional row selection
        with a real indeterminate &quot;select all&quot; state, optional pagination, real
        loading/empty states.
      </Text>

      <Mutation label="Baseline: sortable columns + row selection">
        <Table
          columns={COLUMNS}
          data={ROWS}
          rowKey="id"
          sort={sort}
          onSortChange={setSort}
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={setSelectedRowKeys}
        />
      </Mutation>

      <Mutation label="Custom cell render (status pill via Tag) + right-aligned numeric column + caption">
        <Table columns={RICH_COLUMNS} data={ROWS} rowKey="id" caption="Team roster" />
      </Mutation>

      <Mutation label="Pagination (pageSize=3) + a bounded maxHeight scrollable body">
        <Table columns={COLUMNS} data={ROWS} rowKey="id" pageSize={3} page={page} onPageChange={setPage} maxHeight={220} />
      </Mutation>

      <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <Mutation label="Loading state">
          <Stack gap="sm">
            <Table columns={COLUMNS} data={ROWS} rowKey="id" loading={loading} />
            <Button variant="secondary" size="sm" onClick={() => setLoading((v) => !v)}>
              Toggle loading
            </Button>
          </Stack>
        </Mutation>
        <Mutation label="Empty state (emptyMessage)">
          <Table columns={COLUMNS} data={[]} rowKey="id" emptyMessage="No teams yet — add one to get started." />
        </Mutation>
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
