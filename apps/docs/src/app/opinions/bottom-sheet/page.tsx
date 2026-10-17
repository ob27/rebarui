"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Avatar, BottomSheet, Button, CheckIcon, Heading, Spin, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { COLUMN_TITLES, PEOPLE, TAGS, TASKS, avatarOf, person } from "@/fixtures/tideline";
import type { TaskColumn } from "@/fixtures/tideline";
import { PhoneList, PhoneRow, PhoneSheet, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<BottomSheet
  trigger={<Button variant="secondary">Move to…</Button>}
  title="Move to"
  footer={<Button variant="destructive">Delete task</Button>}
>
  {columns.map((c) => (
    <SheetOption key={c.id} selected={c.id === task.column} onSelect={() => move(c.id)}>
      {c.title}
    </SheetOption>
  ))}
</BottomSheet>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BottomSheet"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: '`Drawer` fixed to `side="bottom"`, so it inherits the Radix Dialog wiring: `role="dialog"` with `aria-modal="true"`, focus trapped while open, Esc and backdrop click close it. The handle is a real drag-to-dismiss surface (past a quarter of the sheet\'s height, release closes it), but the visible close button, Esc and the backdrop always work too.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="bottom-sheet"` on the panel; `data-rebar-part="handle"` on the drag handle, plus every `data-rebar-part` `Drawer` carries (`header`, `title`, `description`, `body`, `footer`, `close`).' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: 'AntD has no direct equivalent. Migrate to antd\'s `Drawer` with `placement="bottom"` and drop the handle.' }],
  },
  {
    type: "doc-section",
    heading: "Auto height and non-dismissible",
    body: [
      {
        "kind": "text",
        "text": "Pass `size=\"auto\"` to fit the content (up to `maxHeight`, default `85vh`; the body scrolls past that) instead of a fixed pixel height. `Drawer` takes the same props. `dismissible={false}` removes the grab bar and close button, disables drag-to-dismiss and ignores Esc and backdrop clicks, so only your own controls close it."
      },
      {
        "kind": "code",
        "code": "<BottomSheet open title=\"Pick one\" size=\"auto\" maxHeight=\"70vh\">...</BottomSheet>\\n<BottomSheet open title=\"Confirm\" dismissible={false} footer={<Button onClick={done}>Done</Button>} />"
      }
    ],
  },
];

const COLUMNS = (Object.keys(COLUMN_TITLES) as TaskColumn[]).map((id) => ({ id, title: COLUMN_TITLES[id] }));

/** One choice in a sheet: a full-height row with a check on the selected one. */
function SheetOption({ children, selected, onSelect, meta }: { children: ReactNode; selected?: boolean; onSelect?: () => void; meta?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        minHeight: 48,
        padding: "0 16px",
        border: 0,
        background: "transparent",
        boxShadow: "0 1px 0 var(--rebar-color-border)",
        color: "var(--rebar-color-text-primary)",
        font: "inherit",
        fontSize: "var(--rebar-font-size-sm)",
        fontWeight: selected ? "var(--rebar-font-weight-semibold)" : "var(--rebar-font-weight-medium)",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      {meta}
      <span style={{ flex: 1 }}>{children}</span>
      {selected ? <CheckIcon aria-hidden="true" style={{ color: "var(--rebar-color-text-secondary)" }} /> : null}
    </button>
  );
}

function OptionList({ children }: { children: ReactNode }) {
  return <div style={{ border: "1px solid var(--rebar-color-border)", borderRadius: 14, overflow: "hidden" }}>{children}</div>;
}

const sync = TASKS.find((t) => t.id === "sync") ?? TASKS[0];
const home = TASKS.find((t) => t.id === "home") ?? TASKS[0];

export default function BottomSheetPage() {
  const [column, setColumn] = useState<TaskColumn>(sync.column);
  const [open, setOpen] = useState(false);

  return (
    <Stack gap="lg">
      <Heading level={1}>BottomSheet</Heading>
      <Text color="secondary">A draggable panel for richer content, with a handle.</Text>

      <DemoStage
        title="Move to"
        caption="Tap, then drag the handle down"
        code={CODE}
        states={[
          {
            label: "Empty",
            node: (
              <BottomSheet trigger={<Button variant="secondary" size="sm">Open empty sheet</Button>} title="Move to" size={240}>
                <Stack gap="xs" align="center" style={{ padding: "16px 0" }}>
                  <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                    No lists yet
                  </Text>
                  <Text size="xs" color="secondary">
                    Create one first.
                  </Text>
                </Stack>
              </BottomSheet>
            ),
          },
          {
            label: "Error",
            node: (
              <BottomSheet trigger={<Button variant="secondary" size="sm">Open error sheet</Button>} title="Move to" size={240} footer={<Button variant="secondary">Retry</Button>}>
                <Text size="sm" style={{ color: "var(--rebar-color-danger)" }}>
                  Could not load lists.
                </Text>
              </BottomSheet>
            ),
          },
          {
            label: "Loading",
            node: (
              <BottomSheet trigger={<Button variant="secondary" size="sm">Open loading sheet</Button>} title="Members" size={240}>
                <Stack gap="sm" align="center" style={{ padding: "12px 0" }}>
                  <Spin spinning size="sm" />
                  <Text size="xs" color="secondary">
                    Hold on a moment.
                  </Text>
                </Stack>
              </BottomSheet>
            ),
          },
          {
            label: "Long text",
            node: (
              <BottomSheet trigger={<Button variant="secondary" size="sm">Open long sheet</Button>} title="Late deliverables" size={300}>
                <Text size="sm">Late deliverables awaiting Maya Chen sign-off: the harbour homepage, the depot signage proofs and the icon audit. Payroll cut-off is 28 Oct, so the rota export has to land first.</Text>
              </BottomSheet>
            ),
          },
        ]}
      >
        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <PhoneList>
            <PhoneRow
              thumb={false}
              title={sync.title}
              meta={`${person(sync.assignee).name} · ${COLUMN_TITLES[column]}`}
              trailing={
                <BottomSheet
                  open={open}
                  onOpenChange={setOpen}
                  trigger={
                    <Button variant="secondary" size="sm">
                      Move to…
                    </Button>
                  }
                  title="Move to"
                  size={340}
                  footer={
                    <Button variant="destructive" onClick={() => setOpen(false)}>
                      Delete task
                    </Button>
                  }
                >
                  <OptionList>
                    {COLUMNS.map((c) => (
                      <SheetOption
                        key={c.id}
                        selected={c.id === column}
                        onSelect={() => {
                          setColumn(c.id);
                          setOpen(false);
                        }}
                      >
                        {c.title}
                      </SheetOption>
                    ))}
                  </OptionList>
                </BottomSheet>
              }
            />
          </PhoneList>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Three sheets" caption="A list of choices, a filter form and a loading sheet, open on the phone" widths={false}>
        <div className="cs-grain" style={{ padding: "28px 20px" }}>
          <Stack direction="row" gap="md" justify="center" style={{ flexWrap: "wrap" }}>
            <TidelinePhone
              title="Harbour rebrand"
              height={460}
              width={250}
              dim
              overlay={
                <PhoneSheet
                  title="Move to"
                  footer={
                    <Button variant="destructive" style={{ width: "100%" }}>
                      Delete task
                    </Button>
                  }
                >
                  <OptionList>
                    {COLUMNS.map((c) => (
                      <SheetOption key={c.id} selected={c.id === "doing"}>
                        {c.title}
                      </SheetOption>
                    ))}
                  </OptionList>
                </PhoneSheet>
              }
            >
              <PhoneList>
                <PhoneRow title={sync.title} meta={`${person(sync.assignee).name.split(" ")[0]} · ${sync.tag}`} tint={1} />
                <PhoneRow title={home.title} meta={`${person(home.assignee).name.split(" ")[0]} · ${home.tag}`} tint={2} />
              </PhoneList>
            </TidelinePhone>

            <TidelinePhone
              title="Tideline mobile"
              height={460}
              width={250}
              dim
              overlay={
                <PhoneSheet
                  title="Filter tasks"
                  footer={
                    <Stack direction="row" gap="sm" justify="between">
                      <Button variant="tertiary" size="sm">
                        Reset
                      </Button>
                      <Button size="sm">Show 7</Button>
                    </Stack>
                  }
                >
                  <Stack gap="sm">
                    <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
                      <Tag tone="info">Mine</Tag>
                      <Tag tone="warning">Overdue</Tag>
                      <Tag>This week</Tag>
                    </Stack>
                    <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
                      {TAGS.map((t) => (
                        <Tag key={t} tone={t === "Design" ? "error" : "default"}>
                          {t}
                        </Tag>
                      ))}
                    </Stack>
                    <OptionList>
                      <SheetOption selected meta={<Avatar size="sm" {...avatarOf(PEOPLE[2].id)} />}>
                        {PEOPLE[2].name}
                      </SheetOption>
                    </OptionList>
                  </Stack>
                </PhoneSheet>
              }
            >
              <PhoneList>
                <PhoneRow title={sync.title} meta={`${person(sync.assignee).name.split(" ")[0]} · ${sync.tag}`} tint={1} />
                <PhoneRow title={home.title} meta={`${person(home.assignee).name.split(" ")[0]} · ${home.tag}`} tint={2} />
              </PhoneList>
            </TidelinePhone>

            <TidelinePhone
              title="Crew interviews"
              height={460}
              width={250}
              dim
              overlay={
                <PhoneSheet>
                  <Stack gap="sm" align="center" style={{ padding: "8px 0 16px" }}>
                    <Spin spinning size="sm" />
                    <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                      Loading members
                    </Text>
                    <Text size="xs" color="secondary">
                      Hold on a moment.
                    </Text>
                  </Stack>
                </PhoneSheet>
              }
            >
              <PhoneList>
                <PhoneRow title={sync.title} meta={`${person(sync.assignee).name.split(" ")[0]} · ${sync.tag}`} tint={1} />
                <PhoneRow title={home.title} meta={`${person(home.assignee).name.split(" ")[0]} · ${home.tag}`} tint={2} />
                <PhoneRow title="Depot signage proofs" meta="Leo · Ops" tint={3} />
              </PhoneList>
            </TidelinePhone>
          </Stack>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
