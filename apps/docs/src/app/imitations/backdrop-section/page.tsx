import { BackdropSection, Button, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { BACKDROP_ART } from "@/data/placeholderScreens";
import { project } from "@/fixtures/tideline";

const CODE = `<BackdropSection image={{ src: "/art/harbour-1600.jpg" }} scrim="start" rounded>
  <Heading level={2}>Harbour rebrand</Heading>
  <Text>Identity, site and launch kit for the harbour trust.</Text>
  <Button variant="secondary">View the plan</Button>
</BackdropSection>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BackdropSection"] ?? [] },
  {
    type: "doc-section",
    heading: "Scrims",
    body: [{ kind: "text", text: "`soft` darkens lightly top to bottom, `strong` more, `start` is darker on the text side, `none` leaves the art alone. Set the colour with `--rebar-backdrop-scrim-color`; `rounded` gives an inset panel (`--rebar-backdrop-section-radius`). Use art at least as wide as the section." }],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "The image is decorative by default (`alt=\"\"`, `aria-hidden`); pass `image.alt` only if it carries information. Check text contrast against the darkest scrim you can afford, not the average pixel." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="backdrop-section"`, `data-rebar-scrim` and `data-rebar-rounded` on the root; `data-rebar-part` values `image`, `scrim` and `content`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Ant Design has no equivalent; this is a bespoke section." }],
  },
  {
    type: "doc-section",
    heading: "inset",
    body: [
      {
        "kind": "text",
        "text": "`inset={false}` drops the section's own side margin (when `rounded`) and padding, so an app can lay it out full-bleed and pad it itself. Default `true` keeps the current spacing."
      },
      {
        "kind": "code",
        "code": "<BackdropSection image={{ src }} inset={false}>...</BackdropSection>"
      }
    ],
  },
];

export default function BackdropSectionPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>BackdropSection</Heading>
      <Text color="secondary">A section with art behind it and light text on top.</Text>

      <DemoStage
        title="Project hero"
        caption="Rounded panel with a start-side scrim"
        code={CODE}
        states={[
          { label: "Soft scrim", node: <BackdropSection image={{ src: BACKDROP_ART }} scrim="soft" rounded><Text>Soft</Text></BackdropSection> },
          { label: "Strong scrim", node: <BackdropSection image={{ src: BACKDROP_ART }} scrim="strong" rounded><Text>Strong</Text></BackdropSection> },
          { label: "No scrim", node: <BackdropSection image={{ src: BACKDROP_ART }} scrim="none" rounded><Text>None</Text></BackdropSection> },
          { label: "Art as the section background (imageMode=\"background\")", node: <BackdropSection image={{ src: BACKDROP_ART }} scrim="soft" rounded imageMode="background"><Text>Painted as a CSS background</Text></BackdropSection> },
          { label: "Full-bleed", node: <BackdropSection image={{ src: BACKDROP_ART }} scrim="soft"><Text>Square corners</Text></BackdropSection> },
        ]}
      >
        <BackdropSection image={{ src: BACKDROP_ART }} scrim="start" rounded>
          <Stack gap="sm" style={{ maxWidth: "32rem" }}>
            <Heading level={2}>{harbour.name}</Heading>
            <Text>{harbour.summary}</Text>
            <div>
              <Button variant="secondary">View the plan</Button>
            </div>
          </Stack>
        </BackdropSection>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Launch page" caption="A strong-scrim band between two plain sections" widths={false}>
        <Stack gap="md" style={{ maxWidth: 680, margin: "0 auto" }}>
          <Text color="secondary">Launch is {harbour.due}. Here is where it stands.</Text>
          <BackdropSection image={{ src: BACKDROP_ART }} scrim="strong">
            <Stack gap="xs">
              <Heading level={2}>{harbour.done}% done</Heading>
              <Text>Identity and site are in review; the launch kit ships next week.</Text>
            </Stack>
          </BackdropSection>
          <Text size="sm" color="secondary">Owner: Maya Chen.</Text>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
