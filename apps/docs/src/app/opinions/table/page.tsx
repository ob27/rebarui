"use client";

import { useState } from "react";
import { Card, DeviceFrame, Heading, MobileTabBar, Stack, Table, Tag, Text } from "rebar-ui";
import type { TableColumn } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { INVOICES, INVOICE_TONE, gbpPence } from "@/fixtures/tideline";
import type { Invoice } from "@/fixtures/tideline";

const CODE = `<Table
  columns={[
    { key: "id", header: "Invoice", render: (v) => <strong>{v}</strong> },
    { key: "supplier", header: "Supplier" },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (v) => <Tag tone={INVOICE_TONE[v]}>{v}</Tag> },
    { key: "amount", header: "Amount", align: "right", render: (v) => gbpPence(v) },
  ]}
  data={INVOICES}
  rowKey="id"
  caption="October invoices"
/>`;

const COLUMNS: TableColumn<Invoice>[] = [
  { key: "id", header: "Invoice", render: (v) => <strong>{String(v)}</strong> },
  { key: "supplier", header: "Supplier" },
  { key: "date", header: "Date" },
  { key: "status", header: "Status", render: (v) => <Tag tone={INVOICE_TONE[v as Invoice["status"]]}>{String(v)}</Tag> },
  { key: "amount", header: "Amount", align: "right", render: (v) => gbpPence(Number(v)) },
];
const ID_STATUS = [COLUMNS[0], COLUMNS[3]];
const ID_AMOUNT = [COLUMNS[0], COLUMNS[4]];
const TOTAL = INVOICES.reduce((sum, i) => sum + i.amount, 0);
const LONG: Invoice[] = [{ id: "INV-1047", supplier: "Northern Depot Quay 3 resurfacing, signage and lighting works, phase two", date: "24 Oct", status: "Due", amount: 12480, project: "signage" }];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Table"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<table>` with a visible `caption`, `<th>` headers and, for sortable columns, buttons that announce their direction. Row selection is a column of real checkboxes with a header checkbox; loading rows are `Skeleton`s marked `aria-hidden`, and the empty state is a real `Empty`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="table"` on the wrapper; `data-rebar-part="caption" | "scroll"`, and each row carries `aria-selected` when selection is on.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/migrate-antd` maps `columns` to AntD's `columns` (`header` to `title`, `key` to `dataIndex`, `render` kept) and `data`/`rowKey` to `dataSource`/`rowKey`. Selection becomes `rowSelection`, pagination `pagination={{ pageSize }}`.",
      },
    ],
  },
];

function TotalRow() {
  return (
    <Stack direction="row" justify="between" style={{ padding: "10px 16px", background: "var(--rebar-color-bg-secondary)", borderRadius: "var(--rebar-radius)" }}>
      <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        Total
      </Text>
      <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)", fontVariantNumeric: "tabular-nums" }}>
        {gbpPence(TOTAL)}
      </Text>
    </Stack>
  );
}

function PhoneInvoices() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 520, background: "var(--rebar-color-bg-primary)" }}>
      <div style={{ background: "var(--rebar-color-bg-inverse)", color: "var(--rebar-color-text-inverse)", padding: "14px 18px" }}>
        <Heading level={3} style={{ color: "inherit", fontSize: "1.1rem" }}>
          Invoices
        </Heading>
      </div>
      <Stack gap="sm" style={{ padding: 14, flex: 1 }}>
        {INVOICES.slice(0, 3).map((i) => (
          <Card key={i.id} title={i.id} subtitle={`${i.supplier} · ${i.date}`} extra={<Tag tone={INVOICE_TONE[i.status]}>{i.status}</Tag>}>
            <Text style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: "1.3rem", fontWeight: "var(--rebar-font-weight-semibold)" }}>{gbpPence(i.amount)}</Text>
          </Card>
        ))}
      </Stack>
      <MobileTabBar aria-label="Tideline" style={{ position: "static" }} items={[{ label: "Inbox" }, { label: "Projects" }, { label: "Calendar" }, { label: "You" }]} defaultActiveIndex={0} />
    </div>
  );
}

export default function TablePage() {
  const [selected, setSelected] = useState<string[]>(["INV-1042"]);
  return (
    <Stack gap="lg">
      <Heading level={1}>Table</Heading>
      <Text color="secondary">Plain rows with a total.</Text>

      <DemoStage
        title="Invoices"
        caption="Static rows, header, total"
        code={CODE}
        states={[
          { label: "Selectable", node: <Table columns={[COLUMNS[0]]} data={INVOICES.slice(0, 2)} rowKey="id" selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} aria-label="Pick invoices" /> },
          { label: "Loading", node: <Table columns={ID_AMOUNT} data={[]} rowKey="id" loading aria-label="Loading invoices" /> },
          { label: "Empty", node: <Table columns={ID_STATUS} data={[]} rowKey="id" emptyMessage="No invoices this month" aria-label="No invoices" /> },
          { label: "Long text", node: <Table columns={[COLUMNS[1]]} data={LONG} rowKey="id" aria-label="A long supplier name" /> },
        ]}
      >
        <Stack gap="xs">
          <Table columns={COLUMNS} data={INVOICES} rowKey="id" caption="October invoices" />
          <TotalRow />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Invoices" caption="Desktop and phone">
        <Stack gap="lg">
          <Card title="October invoices">
            <Stack gap="xs">
              <Table columns={COLUMNS} data={INVOICES.slice(0, 3)} rowKey="id" aria-label="October invoices" />
              <TotalRow />
            </Stack>
          </Card>
          <div className="cs-grain cs-grain--sand" style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
            <DeviceFrame variant="phone" style={{ maxWidth: 320 }}>
              <PhoneInvoices />
            </DeviceFrame>
          </div>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
