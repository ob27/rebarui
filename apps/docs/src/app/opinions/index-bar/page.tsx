"use client";

import type { ReactNode } from "react";
import { Avatar, Heading, IndexBar, Stack, Text } from "rebar-ui";
import type { IndexBarGroup } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW, PEOPLE } from "@/fixtures/tideline";
import type { CrewMember, Person } from "@/fixtures/tideline";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<IndexBar
  groups={byLetter(CREW)}
  height={400}
  renderItem={(member) => <MemberRow member={member} />}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["IndexBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The whole rail is one touch surface: press anywhere and drag, and the list jumps live while a bubble shows the letter under your finger. A plain tap on a letter works too, and every letter is a real, keyboard-focusable button.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="index-bar"` on the root; parts: `list`, `group`, `group-header`, `item`, `rail`, `rail-letter` (each with `data-index-key`, and `data-rebar-active` while dragged over), `bubble`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered: the pattern is antd-mobile's `IndexBar`, not the desktop `antd` package. A desktop migration usually means a plain list with a search box." }],
  },
];

interface Entry {
  name: string;
  detail: string;
  placeholder: number;
}

const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").toUpperCase();

function byLetter(entries: Entry[]): IndexBarGroup<Entry>[] {
  const map = new Map<string, Entry[]>();
  for (const e of [...entries].sort((a, b) => a.name.localeCompare(b.name))) {
    const key = e.name[0]!.toUpperCase();
    map.set(key, [...(map.get(key) ?? []), e]);
  }
  return [...map.entries()].map(([key, items]) => ({ key, items }));
}

const CREW_ENTRIES: Entry[] = CREW.map((m: CrewMember, i) => ({ name: m.name, detail: m.role, placeholder: i + 5 }));
const TEAM_ENTRIES: Entry[] = PEOPLE.map((p: Person) => ({ name: p.name, detail: p.role, placeholder: p.placeholder }));

function MemberRow({ entry }: { entry: Entry }) {
  return (
    <Stack direction="row" gap="sm" align="center" style={{ padding: "8px 12px", boxShadow: "0 1px 0 var(--rebar-color-border)" }}>
      <Avatar size="sm" alt={entry.name} fallback={initials(entry.name)} placeholder={entry.placeholder} />
      <span style={{ minWidth: 0 }}>
        <Text size="sm" style={{ display: "block", fontWeight: "var(--rebar-font-weight-semibold)" }}>
          {entry.name}
        </Text>
        <Text size="xs" color="secondary" style={{ display: "block" }}>
          {entry.detail}
        </Text>
      </span>
    </Stack>
  );
}

const Box = ({ children, height }: { children: ReactNode; height?: number }) => (
  <div style={{ position: "relative", border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden", background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", height }}>{children}</div>
);

export default function IndexBarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>IndexBar</Heading>
      <Text color="secondary">A letter rail for jumping through a long list.</Text>

      <DemoStage
        title="Crew directory"
        caption="Tap a letter or drag along the rail"
        code={CODE}
        states={[
          { label: "Short list", node: <Box><IndexBar groups={byLetter(TEAM_ENTRIES)} height={160} renderItem={(e) => <MemberRow entry={e} />} /></Box> },
          { label: "Empty", node: <Box height={120}><IndexBar groups={[]} height={118} renderItem={(e: Entry) => <MemberRow entry={e} />} /><Text size="sm" color="secondary" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", margin: 0 }}>No people yet</Text></Box> },
          { label: "Group headers", node: <Box><IndexBar groups={byLetter(TEAM_ENTRIES)} height={160} renderGroupHeader={(k) => `${k} · ${byLetter(TEAM_ENTRIES).find((g) => g.key === k)?.items.length ?? 0}`} renderItem={(e) => <MemberRow entry={e} />} /></Box> },
        ]}
      >
        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <Box>
            <IndexBar groups={byLetter(CREW_ENTRIES)} height={380} renderItem={(e) => <MemberRow entry={e} />} />
          </Box>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Team on the phone" caption="The crew directory and the studio team" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone title="Crew" tabs={3} height={460} width={250} padding={0}>
              <IndexBar groups={byLetter(CREW_ENTRIES)} height={390} renderItem={(e) => <MemberRow entry={e} />} />
            </TidelinePhone>
            <TidelinePhone title="Team" tabs={3} height={460} width={250} padding={0}>
              <IndexBar groups={byLetter(TEAM_ENTRIES)} height={390} renderItem={(e) => <MemberRow entry={e} />} />
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
