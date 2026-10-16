import { Barcode, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { INVOICES, INVOICE_TONE, gbpPence, project } from "@/fixtures/tideline";

const CODE = `<Barcode value="INV-1042" showText />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Barcode"] ?? [] },
  {
    type: "doc-section",
    heading: "Width",
    body: [{ kind: "text", text: "A real Code 128 barcode. `barWidth` sets the narrowest bar in px and the total width scales with the value, as a scanner needs; `quietZone` adds the blank margin around it." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="barcode"` on the root `<svg>`; each bar is `data-rebar-part="bar"`, the text (with `showText`) is `data-rebar-part="text"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD ships no barcode component; use `jsbarcode` or `react-barcode`, or keep this encoder and swap the shell." }],
  },
];

export default function BarcodePage() {
  const inv = INVOICES[1]!;
  return (
    <Stack gap="lg">
      <Heading level={1}>Barcode</Heading>
      <Text color="secondary">A scannable Code 128 barcode as SVG, with the value shown underneath.</Text>

      <DemoStage
        title="Invoice reference"
        caption="Code 128, value printed below"
        code={CODE}
        states={[
          { label: "No text", node: <Barcode value="INV-1042" showText={false} /> },
          { label: "Short", node: <Barcode value="A1" /> },
          { label: "Long value", node: <Barcode value="HARBOUR-REBRAND-24-OCT-0001" barWidth={1} /> },
        ]}
      >
        <Barcode value={inv.id} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Invoice slip" caption="The barcode on a printable supplier invoice" widths={false}>
        <Card title={`Invoice ${inv.id}`} style={{ maxWidth: 420, margin: "0 auto" }}>
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center">
              <Text size="sm">{inv.supplier}</Text>
              <Tag tone={INVOICE_TONE[inv.status]}>{inv.status}</Tag>
            </Stack>
            <Text size="sm" color="secondary">{project(inv.project).name}, {inv.date}. Total {gbpPence(inv.amount)}.</Text>
            <Barcode value={inv.id} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
