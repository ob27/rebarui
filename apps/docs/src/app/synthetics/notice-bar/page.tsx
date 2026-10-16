"use client";

import { useState } from "react";
import { Button, Card, Heading, NoticeBar, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { project } from "@/fixtures/tideline";

const CODE = `<NoticeBar
  tone="warning"
  icon={<WarningIcon />}
  content="Payroll cut-off is 28 Oct. Send the rota export by then."
  closable
  onClose={dismiss}
/>`;

// rebar-ui's icon set is internal; a consuming app supplies its own icon.
function WarningIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z" />
    </svg>
  );
}

const PAYROLL = "Payroll cut-off is 28 Oct. Send the rota export by then.";
const LONG = "Harbour launch moved to 24 Oct 09:00. Everyone on the Harbour rebrand: check your tasks, confirm the launch checklist and tell Maya about anything still open.";

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["NoticeBar"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="notice-bar"` with `data-rebar-tone` set to the current tone; parts: `icon`, `content`, `text` (the actual scrolling/static text node), `action`, `close`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — this is the antd-mobile `NoticeBar` pattern. AntD desktop has no direct equivalent; closest is a full-width `Alert` with `banner` styling.",
      },
    ],
  },
];

export default function NoticeBarPage() {
  const [visible, setVisible] = useState(true);
  const mobile = project("mobile");
  return (
    <Stack gap="lg">
      <Heading level={1}>NoticeBar</Heading>
      <Text color="secondary">A full-width strip at the top of a view that stays until dismissed, scrolling if the text is too long.</Text>

      <DemoStage
        title="Payroll notice"
        caption="Dismiss it, then bring it back"
        code={CODE}
        states={[
          { label: "Info", node: <NoticeBar tone="info" content="Mobile design review is on 22 Oct, 14:00." /> },
          { label: "Error", node: <NoticeBar tone="error" icon={<WarningIcon />} content="Offline: changes will sync when you reconnect." /> },
          { label: "Scrolling", node: <NoticeBar tone="warning" content={LONG} /> },
          { label: "Wrapped", node: <NoticeBar tone="info" content={LONG} wrap /> },
          { label: "With action", node: <NoticeBar tone="warning" content="Crew interviews are late." action={<Button size="sm" variant="secondary">Open</Button>} /> },
        ]}
      >
        {visible ? (
          <NoticeBar tone="warning" icon={<WarningIcon />} content={PAYROLL} closable onClose={() => setVisible(false)} />
        ) : (
          <Button variant="secondary" onClick={() => setVisible(true)}>Show the notice again</Button>
        )}
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Pinned to a screen" caption="Under the app bar, above the content" padding="none" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", padding: 24 }}>
          <TidelinePhone title="Projects" tabs={1} height={420}>
            <Stack gap="sm">
              <NoticeBar tone="warning" icon={<WarningIcon />} content="Payroll cut-off is 28 Oct." closable wrap />
              <Card title={mobile.name} subtitle={`Due ${mobile.due}`}>
                <Text size="sm" color="secondary">{mobile.summary}</Text>
              </Card>
            </Stack>
          </TidelinePhone>
          <TidelinePhone title="Inbox" tabs={0} height={420}>
            <Stack gap="sm">
              <NoticeBar tone="error" icon={<WarningIcon />} content="You are offline. Changes sync when you reconnect." wrap />
              <Text size="sm" color="secondary">3 changes waiting to sync.</Text>
            </Stack>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
