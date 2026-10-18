"use client";

import { useState } from "react";
import {
  AddIcon,
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  BackdropSection,
  Badge,
  Barcode,
  BellIcon,
  BentoCard,
  BentoGrid,
  Box,
  Button,
  CalendarIcon,
  Card,
  CheckIcon,
  Checkbox,
  Divider,
  DownloadIcon,
  FileChartIcon,
  FloatCard,
  FolderIcon,
  Heading,
  HomeIcon,
  Iframe,
  Input,
  Kbd,
  NumberInput,
  Pagination,
  PinInput,
  Progress,
  ProgressCircle,
  QRCode,
  Radio,
  RadioGroup,
  Rate,
  ScrollArea,
  SearchInput,
  SegmentedControl,
  Selector,
  SettingsIcon,
  Skeleton,
  Slider,
  Spin,
  Stack,
  Statistic,
  Switch,
  Tag,
  TeamIcon,
  Text,
  Textarea,
  ThemeScope,
  Toggle,
  Watermark,
  useHashTarget,
} from "rebar-ui";
import { BACKDROP_ART } from "@/data/placeholderScreens";
import { PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { EVENTS, INVOICES, KPIS, PEOPLE, PROJECTS, STATUS_TONE, TAGS, TAG_OPTIONS, TASKS, avatarOf, avatarsOf, gbp, project } from "@/fixtures/tideline";
import { ex } from "./tierExamples.types";
import type { ExampleMap } from "./tierExamples.types";

const harbour = project("harbour");
const TINT = ["var(--rebar-color-tint-3)", "var(--rebar-color-tint-1)", "var(--rebar-color-tint-2)", "var(--rebar-color-tint-4)"];
const TAG_TONE: Record<(typeof TAGS)[number], "default" | "error" | "info" | "success"> = { Design: "default", Eng: "error", Research: "info", Ops: "success" };
const INVOICE = INVOICES[1]!;
const QR_LINK = "https://tideline.example/launch/harbour";
const bold = { fontWeight: "var(--rebar-font-weight-semibold)" } as const;

const statusDoc = `data:text/html;charset=utf-8,${encodeURIComponent(
  `<!doctype html><html><body style="font-family:system-ui,sans-serif;margin:12px"><h3 style="margin:0 0 6px">${harbour.name}</h3><p style="margin:0">${harbour.done}% done, due ${harbour.due}.</p></body></html>`,
)}`;

const LabelledProgress = ({ label, value, right }: { label: string; value: number; right: string }) => (
  <Stack gap="xs">
    <Stack direction="row" justify="between">
      <Text size="sm">{label}</Text>
      <Text size="sm" color="secondary">
        {right}
      </Text>
    </Stack>
    <Progress value={value} aria-label={label} />
  </Stack>
);

const SwitchRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack direction="row" gap="md" justify="between" align="center">
    <Text size="sm">{label}</Text>
    {children}
  </Stack>
);

function Pager() {
  const [page, setPage] = useState(3);
  return (
    <Stack gap="sm" align="start">
      <Pagination current={page} total={8} onChange={setPage} aria-label="Tasks" />
      <Text size="sm" color="secondary">
        Showing {(page - 1) * 10 + 1} to {page * 10} of 80 tasks
      </Text>
    </Stack>
  );
}

const HASH_ROWS = [
  { id: "gal-uht-model", title: "How the model works", body: "Offline sync keeps tasks readable on the ferry." },
  { id: "gal-uht-journal", title: "Journal and notes", body: "Interview notes stay on the device until the crew is back at the quay." },
  { id: "gal-uht-data", title: "Where data lives", body: "Everything syncs to the studio server over TLS." },
];

function HashTargetDemo() {
  const { target, open, setOpen } = useHashTarget(
    HASH_ROWS.map((r) => r.id),
    { focus: true },
  );
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
        {HASH_ROWS.map((r) => (
          <a key={r.id} href={`#${r.id}`} style={{ fontSize: "var(--rebar-font-size-sm, 14px)" }}>
            {r.title}
          </a>
        ))}
      </Stack>
      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        {HASH_ROWS.map((r) => (
          <AccordionItem key={r.id} id={r.id} value={r.id} trigger={r.title}>
            {r.body}
          </AccordionItem>
        ))}
      </Accordion>
      <Text size="xs" color="secondary">
        Target: {target ?? "none (open the page with a hash)"}
      </Text>
    </Stack>
  );
}

export const IMITATION_EXAMPLES: ExampleMap = {
  Avatar: ex(
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
        {PEOPLE.map((p, i) => (
          <Avatar key={p.id} {...avatarOf(p.id)} size={i === 0 ? "lg" : undefined} style={{ background: TINT[i] }} />
        ))}
      </Stack>
      <AvatarGroup avatars={avatarsOf(PEOPLE.map((p) => p.id))} />
    </Stack>,
  ),
  BackdropSection: ex(
    <BackdropSection image={{ src: BACKDROP_ART }} scrim="start" rounded>
      <Stack gap="xs">
        <Heading level={3}>{harbour.name}</Heading>
        <Text size="sm">{harbour.summary}</Text>
      </Stack>
    </BackdropSection>,
  ),
  Badge: ex(
    <Stack gap="md">
      <Stack direction="row" gap="lg" align="center">
        <Badge count={150}>
          <Avatar {...avatarOf("maya")} style={{ background: TINT[0] }} />
        </Badge>
        <Badge dot tone="success">
          <Avatar {...avatarOf("jonas")} style={{ background: TINT[1] }} />
        </Badge>
        <Badge count={3}>
          <Avatar {...avatarOf("priya")} style={{ background: TINT[2] }} />
        </Badge>
      </Stack>
      <Stack direction="row" gap="xs" style={{ flexWrap: "wrap" }}>
        <Badge tone="success" content="On track" />
        <Badge tone="warning" content="At risk" />
        <Badge tone="info" content="In review" />
      </Stack>
    </Stack>,
  ),
  Barcode: ex(
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
      <Barcode value={INVOICE.id} />
    </div>,
  ),
  BentoGrid: ex(
    <BentoGrid>
      <BentoCard span={6} tone="tint-1" title={PROJECTS[0]!.name} body={PROJECTS[0]!.summary} />
      <BentoCard span={3} tone="tint-2" title={PROJECTS[1]!.name} body={PROJECTS[1]!.kicker} />
      <BentoCard span={3} tone="tint-3" title={PROJECTS[2]!.name} body={PROJECTS[2]!.kicker} />
    </BentoGrid>,
  ),
  Box: ex(
    <Stack gap="sm">
      <Box style={{ padding: 12, border: "1px solid var(--rebar-color-border)", borderRadius: 8 }}>
        <Text size="sm">
          A plain Box: {harbour.name}, {harbour.done}% done
        </Text>
      </Box>
      <Box as="section" style={{ padding: 12, background: "var(--rebar-color-bg-secondary)", borderRadius: 8 }}>
        <Text size="sm">A Box as a real section, due {harbour.due}</Text>
      </Box>
    </Stack>,
  ),
  Button: ex(
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Button>Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>,
  ),
  Checkbox: ex(
    <Stack gap="md">
      <Checkbox defaultChecked>Include archived projects</Checkbox>
      <Checkbox>Notify the team</Checkbox>
      <Checkbox checked="indeterminate">Select all tasks</Checkbox>
    </Stack>,
  ),
  DeviceFrame: ex(
    <div style={{ display: "flex", justifyContent: "center" }}>
      <TidelinePhone title="Projects" width={170} height={170} padding={10}>
        <PhoneList>
          <PhoneRow title={harbour.name} meta="12 of 14 done" tint={1} />
          <PhoneRow title={PROJECTS[1]!.name} meta={PROJECTS[1]!.status} tint={2} />
        </PhoneList>
      </TidelinePhone>
    </div>,
  ),
  Divider: ex(
    <Stack gap="md">
      <Text size="sm">Harbour rebrand: identity</Text>
      <Divider />
      <Text size="sm">Harbour rebrand: launch kit</Text>
      <Divider>Or</Divider>
      <Stack direction="row" gap="md" align="center" style={{ height: 28 }}>
        <Text size="sm">Maya</Text>
        <Divider orientation="vertical" />
        <Text size="sm">Jonas</Text>
        <Divider orientation="vertical" />
        <Text size="sm">Priya</Text>
      </Stack>
    </Stack>,
  ),
  FloatCard: ex(
    <Stack gap="md">
      <FloatCard label="Next up">
        {EVENTS[0]!.title}, {EVENTS[0]!.date}, {EVENTS[0]!.time}
      </FloatCard>
      <FloatCard tone="accent" label="Review">
        {EVENTS[1]!.title}, {EVENTS[1]!.date}
      </FloatCard>
    </Stack>,
  ),
  Heading: ex(
    <Stack gap="sm">
      <Heading level={1}>{harbour.name}</Heading>
      <Heading level={2}>Launch kit</Heading>
      <Heading level={3}>Print files</Heading>
    </Stack>,
  ),
  Icon: ex(
    <Stack direction="row" gap="md" align="center" style={{ flexWrap: "wrap" }}>
      <CalendarIcon size={24} />
      <BellIcon size={24} />
      <FolderIcon size={24} />
      <HomeIcon size={24} />
      <TeamIcon size={24} />
      <SettingsIcon size={24} />
      <FileChartIcon size={24} />
      <DownloadIcon size={24} />
      <AddIcon size={24} />
      <span style={{ color: "var(--rebar-color-success)", display: "inline-flex" }}>
        <CheckIcon size={24} />
      </span>
    </Stack>,
  ),
  Iframe: ex(<Iframe title="Harbour rebrand status page" src={statusDoc} style={{ width: "100%", height: 130, border: "1px solid var(--rebar-color-border)", borderRadius: 8 }} />),
  Input: ex(
    <Stack gap="sm">
      <Input placeholder="Search projects" aria-label="Search projects" />
      <Input defaultValue={harbour.name} aria-label="Project name" />
      <Input disabled defaultValue="Locked by admin" aria-label="Locked field" />
    </Stack>,
  ),
  Kbd: ex(
    <Stack gap="sm">
      <Stack direction="row" gap="xs" align="center" style={{ flexWrap: "wrap" }}>
        <Kbd>Ctrl</Kbd>
        <Text size="sm" color="secondary">
          +
        </Text>
        <Kbd>K</Kbd>
        <Text size="sm" color="secondary">
          command palette
        </Text>
      </Stack>
      <Text size="sm">
        Press <Kbd>Esc</Kbd> to close.
      </Text>
    </Stack>,
  ),
  NumberInput: ex(
    <Stack gap="xs">
      <Text size="sm" color="secondary">
        Reviewers
      </Text>
      <NumberInput defaultValue={5} min={0} max={10} aria-label="Reviewers" />
    </Stack>,
  ),
  Pagination: ex(<Pager />),
  PinInput: ex(
    <Stack gap="xs">
      <Text size="sm" color="secondary">
        Sign-in code
      </Text>
      <PinInput length={4} aria-label="Sign-in code" />
    </Stack>,
  ),
  Progress: ex(
    <Stack gap="md">
      <LabelledProgress label={harbour.name} value={harbour.done} right={`${harbour.done}% done`} />
      <LabelledProgress label={PROJECTS[2]!.name} value={PROJECTS[2]!.done} right={`${PROJECTS[2]!.done}%`} />
    </Stack>,
  ),
  ProgressCircle: ex(
    <Stack direction="row" gap="lg" align="center" style={{ flexWrap: "wrap" }}>
      {PROJECTS.slice(0, 3).map((p) => (
        <Stack key={p.id} gap="xs" align="center">
          <ProgressCircle percent={p.done} size={64} strokeWidth={6} ariaLabel={`${p.name} ${p.done}% done`}>
            {p.done}%
          </ProgressCircle>
        </Stack>
      ))}
    </Stack>,
  ),
  QRCode: ex(
    <div style={{ display: "flex", justifyContent: "center" }}>
      <QRCode value={QR_LINK} size={140} />
    </div>,
  ),
  RadioGroup: ex(
    <RadioGroup defaultValue="week" aria-label="Range">
      <Stack gap="sm">
        <Radio value="day">Day</Radio>
        <Radio value="week">Week</Radio>
        <Radio value="month">Month</Radio>
      </Stack>
    </RadioGroup>,
  ),
  Rate: ex(
    <Stack gap="xs">
      <Text size="sm" color="secondary">
        Interview rating
      </Text>
      <Rate defaultValue={4} aria-label="Interview rating" />
    </Stack>,
  ),
  ScrollArea: ex(
    <ScrollArea maxHeight={140}>
      <Stack gap="sm">
        {TASKS.concat(TASKS).map((t, i) => (
          <Text key={i} size="sm">
            {t.title}
          </Text>
        ))}
      </Stack>
    </ScrollArea>,
  ),
  SearchInput: ex(<SearchInput placeholder="Search projects" />),
  SegmentedControl: ex(
    <SegmentedControl
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
      defaultValue="week"
      aria-label="Calendar range"
    />,
  ),
  Selector: ex(<Selector options={TAG_OPTIONS} multiple defaultValue={["design", "eng"]} aria-label="Task tags" />),
  Skeleton: ex(
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Skeleton variant="avatar" />
        <Skeleton variant="text" lines={2} width={160} />
      </Stack>
      <Skeleton variant="rect" height={60} />
      <Text size="xs" color="secondary">
        Loading the project card
      </Text>
    </Stack>,
  ),
  Slider: ex(
    <Stack gap="sm">
      <Stack direction="row" justify="between">
        <Text size="sm" color="secondary">
          Budget
        </Text>
        <Text size="sm">{gbp(harbour.budget)}</Text>
      </Stack>
      <Slider defaultValue={50} min={0} max={100} step={5} aria-label="Budget in thousands of pounds" />
    </Stack>,
  ),
  Spin: ex(
    <Stack direction="row" gap="lg" align="center" style={{ flexWrap: "wrap" }}>
      {(["drums", "hourglass", "papers", "classic"] as const).map((v) => (
        <Stack key={v} gap="xs" align="center">
          <Spin variant={v} />
          <Text size="xs" color="secondary">
            {v}
          </Text>
        </Stack>
      ))}
    </Stack>,
  ),
  Stack: ex(
    <Stack gap="md">
      {PROJECTS.slice(0, 3).map((p) => (
        <Stack key={p.id} direction="row" gap="sm" justify="between" align="center">
          <Stack direction="row" gap="sm" align="center">
            <Avatar size="sm" {...avatarOf(p.owner)} />
            <Text size="sm">{p.name}</Text>
          </Stack>
          <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
        </Stack>
      ))}
    </Stack>,
  ),
  Statistic: ex(
    <Stack direction="row" gap="xl" style={{ flexWrap: "wrap" }}>
      <Statistic title={KPIS[0]!.label} value={KPIS[0]!.value} />
      <Statistic title="Budget left" value={158450} prefix={"£"} />
      <Statistic title="On-time rate" value={87.5} precision={1} suffix="%" />
    </Stack>,
  ),
  Switch: ex(
    <Stack gap="md">
      <SwitchRow label="Offline sync">
        <Switch defaultChecked aria-label="Offline sync" />
      </SwitchRow>
      <SwitchRow label="Push notifications">
        <Switch aria-label="Push notifications" />
      </SwitchRow>
    </Stack>,
  ),
  Tag: ex(
    <Stack direction="row" gap="xs" align="center" style={{ flexWrap: "wrap" }}>
      {TAGS.map((t) => (
        <Tag key={t} tone={TAG_TONE[t]}>
          {t}
        </Tag>
      ))}
      <Tag tone="warning">At risk</Tag>
    </Stack>,
  ),
  Text: ex(
    <Stack gap="xs">
      <Text size="md">{harbour.summary}</Text>
      <Text size="sm" color="secondary">
        Owned by Maya Chen. Due {harbour.due}.
      </Text>
      <Text size="xs" color="secondary">
        Updated 17 Oct.
      </Text>
    </Stack>,
  ),
  Textarea: ex(<Textarea aria-label="Reflection" rows={4} maxLength={200} showCount placeholder="Write a note for the crew" />),
  ThemeScope: ex(
    <Stack gap="sm">
      {(["light", "dark"] as const).map((scheme) => (
        <ThemeScope key={scheme} scheme={scheme} style={{ padding: 12, borderRadius: 12 }}>
          <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
            <Text size="sm" style={bold}>
              Locked {scheme}
            </Text>
            <Button size="sm">Primary</Button>
            <Tag tone="info">Info</Tag>
          </Stack>
        </ThemeScope>
      ))}
    </Stack>,
  ),
  Toggle: ex(
    <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
      <Toggle defaultPressed aria-label="Bold">
        B
      </Toggle>
      <Toggle aria-label="Italic">I</Toggle>
      <Toggle aria-label="Underline">U</Toggle>
      <Toggle defaultPressed>Watching</Toggle>
    </Stack>,
  ),
  useHashTarget: ex(<HashTargetDemo />),
  Watermark: ex(
    <Watermark text="CONFIDENTIAL">
      <Card title={harbour.name} subtitle="Launch plan">
        <Text size="sm" color="secondary">
          Budget {gbp(harbour.budget)}. Not for distribution before {harbour.due}.
        </Text>
      </Card>
    </Watermark>,
  ),
};
