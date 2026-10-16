import { Avatar, FloatCard, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CHAT, EVENTS, avatarOf, person, project } from "@/fixtures/tideline";

const CODE = `<FloatCard label="Next up">Harbour launch, 24 Oct, 09:00</FloatCard>

<FloatCard tone="accent" label="Jonas">Offline sync is in review.</FloatCard>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FloatCard"] ?? [] },
  {
    type: "doc-section",
    heading: "Theming",
    body: [{ kind: "text", text: "Colour comes from `--rebar-color-bg-primary`, `--rebar-color-text-primary` and `--rebar-color-border`; the accent tone uses `--rebar-color-primary`. `--rebar-shadow-float` sets elevation and `--rebar-float-card-radius` the rounding." }],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'A plain `<div>` of ordinary content, read in place and not `aria-hidden`. Add your own `role="group"` and `aria-label` to announce a set as a unit.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="float-card"` and `data-rebar-tone` (`default` or `accent`) on the root; `data-rebar-part` values `label` and `body`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. The nearest Ant Design shape is a small `Card` with a box shadow." }],
  },
];

const launch = EVENTS[0]!;
const review = EVENTS[1]!;

export default function FloatCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FloatCard</Heading>
      <Text color="secondary">A small raised card for a floating fragment of interface.</Text>

      <DemoStage
        title="Floating fragments"
        caption="Default and accent tones"
        code={CODE}
        states={[
          { label: "No label", node: <FloatCard>{review.title}, {review.date}</FloatCard> },
          { label: "Long text", node: <FloatCard label="Crew interviews">Twelve calls done, and one clear pattern: handover is where things slip.</FloatCard> },
          { label: "Accent, no label", node: <FloatCard tone="accent">{project("harbour").done}% done</FloatCard> },
        ]}
      >
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", padding: "var(--rebar-space-md)" }}>
          <FloatCard label="Next up">{launch.title}, {launch.date}, {launch.time}</FloatCard>
          <FloatCard tone="accent" label={person("jonas").name}>{CHAT[1]!.text}</FloatCard>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Home screen" caption="Floating cards over the project screen" padding="none" widths={false}>
        <Stack direction="row" gap="lg" style={{ justifyContent: "center", flexWrap: "wrap", padding: 24 }}>
          <TidelinePhone title="Tideline" tabs={0} height={420}>
            <Stack gap="md">
              <FloatCard label="Next up">{launch.title}, {launch.time}</FloatCard>
              <FloatCard tone="accent" label="Review">{review.title}, {review.date}</FloatCard>
              <Stack direction="row" gap="sm" align="center">
                <Avatar {...avatarOf("maya")} />
                <Text size="sm">Maya is on the harbour homepage.</Text>
              </Stack>
            </Stack>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
