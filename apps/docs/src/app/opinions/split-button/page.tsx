"use client";

import { Button, Card, Heading, SplitButton, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `<SplitButton
  label="Send report"
  onClick={send}
  items={[
    { label: "Send and archive", onSelect: sendAndArchive },
    { label: "Schedule for Friday", onSelect: schedule },
  ]}
/>`;
const ITEMS = [{ label: "Save as draft" }, { label: "Save and publish" }];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SplitButton"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="split-button"` on the root; `data-rebar-part="primary"` on the main button, `"trigger"` on the caret button, `"menu"` on the popover content, `"item"` per secondary action.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Dropdown.Button` is a very close direct equivalent: `label` maps to its children, `items` maps to `menu.items`, `onClick` maps directly to AntD's own `onClick` on the primary button half.",
      },
    ],
  },
];

export default function SplitButtonPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SplitButton</Heading>
      <Text color="secondary">A main action with a caret that opens related actions, joined as one button.</Text>

      <DemoStage
        title="Send report"
        caption="Click the label to send, the caret for the alternatives"
        code={CODE}
        widths={false}
        states={[
          { label: "Secondary", node: <SplitButton label="Save" variant="secondary" items={ITEMS} /> },
          { label: "Destructive", node: <SplitButton label="Delete" variant="destructive" items={[{ label: "Delete forever" }]} /> },
          {
            label: "Sizes",
            node: (
              <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
                <SplitButton label="Save" size="sm" items={ITEMS} />
                <SplitButton label="Save" items={ITEMS} />
                <SplitButton label="Save" size="lg" items={ITEMS} />
              </Stack>
            ),
          },
        ]}
      >
        <SplitButton
          label="Send report"
          onClick={() => {}}
          items={[{ label: "Send and archive", onSelect: () => {} }, { label: "Schedule for Friday", onSelect: () => {} }]}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Weekly report" caption="One primary send, two variations" widths={false}>
        <Card
          style={{ maxWidth: 480, margin: "0 auto" }}
          title="Week of 19 Oct"
          subtitle="33 tasks done, 7 due soon"
          actions={[
            <Button key="preview" variant="secondary">Preview</Button>,
            <SplitButton key="send" label="Send to crew" onClick={() => {}} items={[{ label: "Send and archive", onSelect: () => {} }, { label: "Schedule for Friday", onSelect: () => {} }]} />,
          ]}
        >
          <Text size="sm" color="secondary">Harbour launch moves to 24 Oct. Rota export shipped. Crew interviews are one task behind.</Text>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
