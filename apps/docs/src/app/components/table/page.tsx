"use client";

import { useState } from "react";
import { Box, Heading, Stack, Table, Text } from "rebar-ui";
import type { TableColumn, TableSort } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

interface Row {
  id: string;
  team: string;
  lead: string;
  status: string;
}

const ROWS: Row[] = [
  { id: "1", team: "Engineering", lead: "Priya Shah", status: "Active" },
  { id: "2", team: "Design", lead: "Marcus Webb", status: "Active" },
  { id: "3", team: "Platform", lead: "Jordan Lee", status: "Archived" },
  { id: "4", team: "Growth", lead: "Amelia Chen", status: "Active" },
];

const COLUMNS: TableColumn<Row>[] = [
  { key: "team", header: "Team", sortable: true },
  { key: "lead", header: "Lead", sortable: true },
  { key: "status", header: "Status", sortable: true },
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

export default function TablePage() {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  return (
    <Stack gap="lg">
      <Heading level={1}>Table</Heading>
      <Text color="secondary">
        Sortable columns, a sticky header over a bounded scrollable body, optional row selection
        with a real indeterminate &quot;select all&quot; state, optional pagination, real
        loading/empty states.
      </Text>

      <Box
        style={{
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg)",
        }}
      >
        <Table
          columns={COLUMNS}
          data={ROWS}
          rowKey="id"
          sort={sort}
          onSortChange={setSort}
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={setSelectedRowKeys}
        />
      </Box>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
