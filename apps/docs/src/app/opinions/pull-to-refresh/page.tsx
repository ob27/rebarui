"use client";

import { useState } from "react";
import { Avatar, Button, Heading, PullToRefresh, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TASKS, avatarOf, person, project } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<PullToRefresh onRefresh={async () => { await reloadInbox(); }}>
  <InboxList items={items} />
</PullToRefresh>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PullToRefresh"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The pull only starts when the content is genuinely at `scrollTop === 0` when the drag begins, so pulling on scrolled content just scrolls. A small, always-visible Refresh button sits in the corner and fires the same `onRefresh`, so a mouse or keyboard user has a real way in.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="pull-to-refresh"`; parts: `indicator`, `scroll-container`, `refresh-button`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD has no direct equivalent. antd-mobile's `PullToRefresh` is the closer sibling library if the migration target is genuinely mobile." }],
  },
];

interface Activity {
  id: string;
  who: string;
  text: string;
  when: string;
}

const task = (id: string) => TASKS.find((t) => t.id === id)?.title ?? id;
const INBOX: Activity[] = [
  { id: "a1", who: "maya", text: `commented on ${task("home")}`, when: "2 min ago" },
  { id: "a2", who: "jonas", text: `moved ${task("sync")} to Review`, when: "10 min ago" },
  { id: "a3", who: "leo", text: `exported the ${project("rota").name.toLowerCase()}`, when: "Yesterday" },
];
const FRESH: Activity = { id: "a0", who: "priya", text: `finished ${task("checklist")}`, when: "Just now" };

function InboxList({ items }: { items: Activity[] }) {
  return (
    <PhoneList style={{ margin: 14 }}>
      {items.map((a) => (
        <PhoneRow key={a.id} thumb={false} trailing={<Avatar size="sm" {...avatarOf(a.who)} />} title={`${person(a.who).name.split(" ")[0]} ${a.text}`} meta={a.when} />
      ))}
    </PhoneList>
  );
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function PullToRefreshPage() {
  const [items, setItems] = useState<Activity[]>(INBOX);
  const [stamp, setStamp] = useState("Updated just now");

  const refresh = async () => {
    await wait(900);
    setItems((prev) => (prev.some((a) => a.id === FRESH.id) ? prev : [FRESH, ...prev]));
    setStamp(`Updated ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`);
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>PullToRefresh</Heading>
      <Text color="secondary">Pull a list down to reload it.</Text>

      <DemoStage
        title="Inbox"
        caption="Pull from the top, or press Refresh"
        code={CODE}
        states={[
          {
            label: "Idle",
            node: (
              <Text size="xs" color="secondary">
                {stamp}
              </Text>
            ),
          },
          {
            label: "Refreshing",
            node: (
              <div style={{ height: 120, border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" }}>
                <PullToRefresh refreshing onRefresh={() => undefined} style={{ height: "100%" }}>
                  <div style={{ height: 160 }} />
                </PullToRefresh>
              </div>
            ),
          },
          {
            label: "Error",
            node: (
              <Stack gap="xs" align="start">
                <Text size="sm" style={{ color: "var(--rebar-color-danger)", fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  Could not refresh.
                </Text>
                <Button size="sm" variant="secondary" onClick={() => void refresh()}>
                  Retry
                </Button>
              </Stack>
            ),
          },
          {
            label: "Empty",
            node: (
              <Stack gap="xs">
                <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  All clear
                </Text>
                <Text size="xs" color="secondary">
                  Nothing new since 9:41.
                </Text>
              </Stack>
            ),
          },
        ]}
      >
        <div style={{ maxWidth: 360, margin: "0 auto", height: 300, border: "1px solid var(--rebar-color-border)", borderRadius: 18, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))" }}>
          <PullToRefresh onRefresh={refresh} style={{ height: "100%" }}>
            <div style={{ minHeight: 320 }}>
              <Kicker style={{ margin: "16px 14px 0" }}>{stamp}</Kicker>
              <InboxList items={items} />
            </div>
          </PullToRefresh>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Inbox on the phone" caption="At rest, and while updating" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title="Inbox" tabs={0} height={460} width={250} padding={0}>
              <PullToRefresh onRefresh={refresh} style={{ height: "100%" }}>
                <div style={{ minHeight: 400 }}>
                  <Kicker style={{ margin: "16px 14px 0" }}>Pull to refresh</Kicker>
                  <InboxList items={INBOX} />
                </div>
              </PullToRefresh>
            </TidelinePhone>
            <TidelinePhone title="Inbox" tabs={0} height={460} width={250} padding={0}>
              <PullToRefresh refreshing onRefresh={() => undefined} style={{ height: "100%" }}>
                <div style={{ minHeight: 400 }}>
                  <Kicker style={{ margin: "16px 14px 0" }}>Updating</Kicker>
                  <InboxList items={INBOX} />
                </div>
              </PullToRefresh>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
