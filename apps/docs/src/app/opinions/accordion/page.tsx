"use client";

import { Accordion, AccordionItem, AvatarGroup, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { EVENTS, PEOPLE, avatarsOf, gbp, person, project } from "@/fixtures/tideline";

const CODE = `<Accordion type="single" collapsible defaultValue="scope">
  <AccordionItem value="scope" trigger="Scope">…</AccordionItem>
  <AccordionItem value="team" trigger="Team">…</AccordionItem>
  <AccordionItem value="budget" trigger={<>Budget <Tag>{gbp(project.budget)}</Tag></>}>…</AccordionItem>
  <AccordionItem value="milestones" trigger="Milestones">…</AccordionItem>
</Accordion>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Accordion props", rows: componentProps["Accordion"] ?? [] },
  { type: "props-table", heading: "AccordionItem props", rows: componentProps["AccordionItem"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Radix accordion: each trigger is a `<button>` inside a heading with `aria-expanded` and `aria-controls`; each panel is a `region` labelled by its trigger. Arrow keys move between triggers, Home and End jump to the ends, Enter or Space toggles. A disabled item is skipped.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="accordion"` on the root; `data-rebar-part="item" | "trigger" | "content"`. Radix\'s own `data-state="open"|"closed"` is read directly.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Collapse` takes an `items` array rather than JSX children: a real, if mechanical, restructuring, not a straight prop rename." }],
  },
];

const signage = project("signage");

function Brief() {
  return (
    <Accordion type="single" collapsible defaultValue="scope">
      <AccordionItem value="scope" trigger="Scope">
        <Text size="sm" color="secondary">
          {signage.summary} Delivery {signage.due}.
        </Text>
      </AccordionItem>
      <AccordionItem value="team" trigger="Team">
        <Stack direction="row" gap="sm" align="center">
          <AvatarGroup avatars={avatarsOf(["maya", "leo"])} size="sm" />
          <Text size="sm" color="secondary">
            {person("maya").name} (design), {person("leo").name} (installs)
          </Text>
        </Stack>
      </AccordionItem>
      <AccordionItem
        value="budget"
        trigger={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            Budget <Tag tone="success">{gbp(signage.budget)}</Tag>
          </span>
        }
      >
        <Text size="sm" color="secondary">
          {gbp(10500)} spent, {gbp(signage.budget - 10500)} left for the northern depots.
        </Text>
      </AccordionItem>
      <AccordionItem value="milestones" trigger="Milestones">
        <Text size="sm" color="secondary">
          Fascia proofs 24 Oct, council permits 7 Nov, install {signage.due}.
        </Text>
      </AccordionItem>
    </Accordion>
  );
}

export default function AccordionPage() {
  const priya = person("priya");
  return (
    <Stack gap="lg">
      <Heading level={1}>Accordion</Heading>
      <Text color="secondary">Stacked sections, one open at a time.</Text>

      <DemoStage
        title="Project brief"
        caption="Single open, keyboard arrows"
        code={CODE}
        states={[
          {
            label: "Collapsed",
            node: (
              <Accordion type="single" collapsible>
                <AccordionItem value="scope" trigger="Scope">
                  <Text size="sm">{signage.summary}</Text>
                </AccordionItem>
                <AccordionItem value="team" trigger="Team">
                  <Text size="sm">{PEOPLE.length} people</Text>
                </AccordionItem>
              </Accordion>
            ),
          },
          {
            label: "Several open",
            node: (
              <Accordion type="multiple" defaultValue={["scope", "team"]}>
                <AccordionItem value="scope" trigger="Scope">
                  <Text size="sm">{signage.kicker}</Text>
                </AccordionItem>
                <AccordionItem value="team" trigger="Team">
                  <Text size="sm">{PEOPLE.length} people</Text>
                </AccordionItem>
              </Accordion>
            ),
          },
          {
            label: "Disabled",
            node: (
              <Accordion type="single" collapsible>
                <AccordionItem value="milestones" trigger="Milestones" disabled>
                  <Text size="sm">Locked</Text>
                </AccordionItem>
              </Accordion>
            ),
          },
          {
            label: "Long text",
            node: (
              <Accordion type="single" collapsible defaultValue="permits">
                <AccordionItem value="permits" trigger="Depot signage: installation access, scaffold hire and council permits">
                  <Text size="sm" color="secondary">
                    Permit lead time is ten working days.
                  </Text>
                </AccordionItem>
              </Accordion>
            ),
          },
        ]}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Brief />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Research log and FAQ" caption="Grouped notes, and short answers">
        <Stack direction="row" gap="lg" align="start" style={{ flexWrap: "wrap" }}>
          <Card title="Crew interviews" style={{ flex: "1 1 280px" }}>
            <Accordion type="single" collapsible defaultValue="week1">
              <AccordionItem
                value="week1"
                trigger={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    Week 1 · {priya.name.split(" ")[0]} <Tag tone="info">4 done</Tag>
                  </span>
                }
              >
                <Text size="sm" color="secondary">
                  Ferry crew, three sessions recorded. Notes tagged and shared with {person("maya").name.split(" ")[0]}.
                </Text>
              </AccordionItem>
              <AccordionItem
                value="week2"
                trigger={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    Week 2 · {priya.name.split(" ")[0]} <Tag tone="warning">Planned</Tag>
                  </span>
                }
              >
                <Text size="sm" color="secondary">
                  {EVENTS[2].title}, {EVENTS[2].date} at {EVENTS[2].time}.
                </Text>
              </AccordionItem>
              <AccordionItem value="synthesis" trigger="Synthesis">
                <Text size="sm" color="secondary">
                  Twelve calls, one clear pattern.
                </Text>
              </AccordionItem>
            </Accordion>
          </Card>
          <Card title="FAQ" style={{ flex: "1 1 280px" }}>
            <Accordion type="single" collapsible defaultValue="edit">
              <AccordionItem value="export" trigger="How do I export the rota?">
                <Text size="sm" color="secondary">
                  Projects, Rota export, then Export CSV. Payroll gets it the same day.
                </Text>
              </AccordionItem>
              <AccordionItem value="edit" trigger="Who can edit a project?">
                <Text size="sm" color="secondary">
                  Owners and editors. Viewers can comment.
                </Text>
              </AccordionItem>
              <AccordionItem value="offline" trigger="Can I work offline?">
                <Text size="sm" color="secondary">
                  Yes. Edits queue and sync when the crew is back in range.
                </Text>
              </AccordionItem>
            </Accordion>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
