"use client";

import { Avatar, Breadcrumb, ChevronLeftIcon, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { avatarOf, person, project, TASKS } from "@/fixtures/tideline";
import { Kicker, PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<Breadcrumb
  items={[
    { label: "Projects", href: "/projects" },
    { label: "Harbour rebrand", href: "/projects/harbour" },
    { label: "Tasks", href: "/projects/harbour/tasks" },
    { label: "Depot signage proofs" },
  ]}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Breadcrumb"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`<nav aria-label="Breadcrumb">` wrapping a real `<ol>`: each item with an `href` is a real `<a>`; the final item is plain text marked `aria-current="page"`, never a link to the page being viewed. Separators are `aria-hidden`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="breadcrumb"`, `data-rebar-part="item" | "separator"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Breadcrumb` takes an `items` array of the same shape (AntD calls the text `title`, not `label`): a mostly mechanical rename, not yet codemod-covered." }],
  },
];

const harbour = project("harbour");
const task = TASKS.find((t) => t.id === "home") ?? TASKS[0];
const owner = person(task.assignee);

const PATH = [
  { label: "Projects", href: "#projects" },
  { label: harbour.name, href: "#harbour" },
  { label: "Tasks", href: "#tasks" },
  { label: "Depot signage proofs" },
];

export default function BreadcrumbPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Breadcrumb</Heading>
      <Text color="secondary">Where you are in the project tree, with a link back up each level.</Text>

      <DemoStage
        title="Task page"
        caption="Path with the current page last"
        code={CODE}
        states={[
          { label: "Collapsed", node: <Breadcrumb items={[{ label: "Projects", href: "#projects" }, { label: "…", href: "#harbour" }, { label: "Tasks", href: "#tasks" }, { label: "Depot signage proofs" }]} /> },
          { label: "Long label", node: <Breadcrumb items={[{ label: "Projects", href: "#projects" }, { label: "Reconcile the northern depot rota with shifts" }]} /> },
          { label: "Single level", node: <Breadcrumb items={[{ label: "Projects" }]} /> },
          { label: "Custom separator", node: <Breadcrumb separator="›" items={PATH.slice(1)} /> },
        ]}
      >
        <div style={{ background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))", border: "1px solid var(--rebar-color-border)", borderRadius: "var(--rebar-radius-lg)", padding: "22px 26px 26px" }}>
          <Stack gap="sm">
            <Breadcrumb items={PATH} />
            <Heading level={2} style={{ marginTop: 6 }}>
              Depot signage proofs
            </Heading>
            <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
              <Avatar size="sm" {...avatarOf(owner.id)} />
              <Text size="sm" color="secondary">
                {owner.name}, due Mon 27 Oct
              </Text>
              <Tag tone="info">In progress</Tag>
            </Stack>
          </Stack>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="On a phone" caption="A back link in the app bar, the full path under it" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" justify="center">
            <TidelinePhone
              height={360}
              width={250}
              bar={
                <>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontFamily: "var(--rebar-font-family-sans)", fontSize: 13, fontWeight: 500, color: "var(--rebar-color-text-inverse-secondary)" }}>
                    <ChevronLeftIcon aria-hidden="true" /> Tasks
                  </span>
                  <span style={{ fontSize: 17 }}>Depot signage proofs</span>
                </>
              }
            >
              <Stack gap="md">
                <Breadcrumb items={PATH.slice(0, 3)} />
                <PhoneList>
                  <PhoneRow title="Depot signage proofs" meta={`${owner.name}, due Mon`} tint={1} />
                </PhoneList>
                <Kicker>Harbour rebrand</Kicker>
              </Stack>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
