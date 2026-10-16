import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{
  type: "feature-grid",
  items: [
    { title: "Offline first", body: "Tasks keep working below deck.", icon: "lock" },
    { title: "A quiet inbox", body: "One digest a day, not forty pings.", icon: "mail" },
    { title: "Rota to payroll", body: "Shifts export without the spreadsheet.", icon: "calendar" },
  ],
}`;

const ITEMS = [
  { title: "Offline first", body: "Tasks keep working below deck.", icon: "lock" },
  { title: "A quiet inbox", body: "One digest a day, not forty pings.", icon: "mail" },
  { title: "Rota to payroll", body: "Shifts export without the spreadsheet.", icon: "calendar" },
];

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "feature-grid", items: { title: string, body: string, icon?: string, iconPath?: string, iconViewBox?: string }[] }` }],
  },
  {
    type: "doc-section",
    heading: "Icons",
    body: [
      {
        kind: "text",
        text: "`icon` is looked up by name in the icon sets `rebar-ui` ships (browse them on [/imitations/icon](/imitations/icon)). Use the exact export name (`CalendarIcon`, `EnterOutlined`) or a short form that ignores case, dashes, underscores and the `Icon`/`Outlined` suffix: `calendar`, `chat`, `lock`, `mail`. An unknown name renders no icon and logs a warning in development; it never throws.",
      },
      {
        kind: "text",
        text: "For a mark the sets do not have, pass `iconPath` (an SVG path `d` string, drawn with `fill=\"currentColor\"`) and, if it is not on a 24 by 24 grid, `iconViewBox`. `iconPath` takes priority over `icon`. The icon is decorative (`aria-hidden`).",
      },
    ],
  },
];

export default function FeatureGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Feature Grid</Heading>
      <Text color="secondary">A wrapping row of short title and body pairs, each with an optional icon.</Text>

      <DemoStage
        title="Tideline features"
        caption="Three short callouts with icons"
        code={CODE}
        states={[
          { label: "No icon", node: <NextBlockRenderer blocks={[{ type: "feature-grid", items: [{ title: "Quiet inbox", body: "One digest a day." }] }]} /> },
          { label: "Custom path", node: <NextBlockRenderer blocks={[{ type: "feature-grid", items: [{ title: "Checked", body: "Reviewed before launch.", iconPath: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" }] }]} /> },
          { label: "Long body", node: <NextBlockRenderer blocks={[{ type: "feature-grid", items: [{ title: "Rota to payroll", body: "Shifts for every harbour depot export in one pass, ready for the 28 Oct payroll cut-off.", icon: "calendar" }] }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "feature-grid", items: ITEMS }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Landing page" caption="Under the Tideline mobile headline" widths={false}>
        <Stack gap="md" align="center">
          <Heading level={2}>Tideline mobile</Heading>
          <Text color="secondary">Offline tasks and a quiet inbox for the crew.</Text>
          <NextBlockRenderer blocks={[{ type: "feature-grid", items: ITEMS }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
