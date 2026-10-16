"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, DataGrid, Heading, Input, Stack, Tag, Text } from "rebar-ui";
import type { TableColumn } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS, STATUS_TONE, gbp, person } from "@/fixtures/tideline";
import type { Project } from "@/fixtures/tideline";

const CODE = `const [selected, setSelected] = useState(["mobile"]);

<DataGrid
  columns={[
    { key: "name", header: "Project", sortable: true, render: (v) => <strong>{v}</strong> },
    { key: "owner", header: "Owner", sortable: true, render: (v) => person(v).name },
    { key: "status", header: "Status", render: (v) => <Tag tone={STATUS_TONE[v]}>{v}</Tag> },
    { key: "done", header: "Done", align: "right", sortable: true, render: (v) => \`\${v}%\` },
    { key: "budget", header: "Budget", align: "right", sortable: true, render: (v) => gbp(v) },
  ]}
  data={PROJECTS}
  rowKey="id"
  selectedRowKeys={selected}
  onSelectedRowKeysChange={setSelected}
  caption="Projects"
/>`;

const COLUMNS: TableColumn<Project>[] = [
  { key: "name", header: "Project", sortable: true, render: (v) => <strong>{String(v)}</strong> },
  { key: "owner", header: "Owner", sortable: true, render: (v) => person(String(v)).name },
  { key: "status", header: "Status", render: (v) => <Tag tone={STATUS_TONE[v as Project["status"]]}>{String(v)}</Tag> },
  { key: "done", header: "Done", align: "right", sortable: true, render: (v) => `${String(v)}%` },
  { key: "budget", header: "Budget", align: "right", sortable: true, render: (v) => gbp(Number(v)) },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["DataGrid"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<table>` with a visible `caption`, `<th>` headers and sort buttons that announce their direction; selection is a column of real checkboxes with a header checkbox (indeterminate when only some rows are selected). Editable cells are `Editable` buttons: Enter to edit, Enter or blur to commit, Escape to cancel.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="data-grid"` on the root; every `Table`, `Editable` and `Accordion` attribute underneath is the real thing, not duplicated.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Table` supports inline editing via a custom `render` per column and row grouping via a nested `dataSource`; a migration folds `editable` and `groupBy` into that pattern rather than a 1:1 prop mapping.",
      },
    ],
  },
];

export default function DataGridPage() {
  const [selected, setSelected] = useState<string[]>(["mobile"]);
  const [sceneSelected, setSceneSelected] = useState<string[]>(["mobile"]);
  const [rows, setRows] = useState<Project[]>(PROJECTS.slice(0, 2));
  const [scenePage, setScenePage] = useState(1);

  return (
    <Stack gap="lg">
      <Heading level={1}>DataGrid</Heading>
      <Text color="secondary">Sortable, selectable, editable rows.</Text>

      <DemoStage
        title="Project grid"
        caption="Sort, select, tabular numbers"
        code={CODE}
        states={[
          {
            label: "Cell editing",
            node: (
              <DataGrid
                columns={[{ key: "budget", header: "Budget", align: "right" }]}
                data={rows}
                rowKey="id"
                editable
                onCellChange={(key, col, value) => setRows((prev) => prev.map((r) => (r.id === key ? { ...r, [col]: col === "budget" ? Number(value) || 0 : value } : r)))}
                aria-label="Budgets, click a cell to edit"
              />
            ),
          },
          {
            label: "Loading",
            node: <DataGrid columns={COLUMNS.slice(0, 1)} data={[]} rowKey="id" loading aria-label="Loading projects" />,
          },
          {
            label: "Empty",
            node: <DataGrid columns={COLUMNS.slice(0, 1)} data={[]} rowKey="id" emptyMessage="Nothing matches “Quay”. Clear the filter to see all 5." aria-label="No projects" />,
          },
          {
            label: "Error",
            node: (
              <Alert type="error" title="Couldn’t load">
                <Stack gap="sm" align="start">
                  <span>Projects are unavailable.</span>
                  <Button variant="secondary" size="sm">
                    Try again
                  </Button>
                </Stack>
              </Alert>
            ),
          },
        ]}
      >
        <DataGrid columns={COLUMNS} data={PROJECTS} rowKey="id" selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} caption="Projects" />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects page" caption="Filter, columns, add; selection and pages">
        <Card>
          <Stack gap="md">
            <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
              <Heading level={3}>Projects</Heading>
              <Badge count={PROJECTS.length} />
              <span style={{ flex: 1 }} />
              <Input size="sm" placeholder="Filter" aria-label="Filter projects" style={{ width: 160 }} />
              <Button variant="secondary" size="sm">
                Columns
              </Button>
              <Button size="sm">Add project</Button>
            </Stack>
            <DataGrid
              columns={COLUMNS}
              data={PROJECTS}
              rowKey="id"
              selectedRowKeys={sceneSelected}
              onSelectedRowKeysChange={setSceneSelected}
              pageSize={4}
              page={scenePage}
              onPageChange={setScenePage}
              aria-label="Projects"
            />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
