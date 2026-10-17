import { Button, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { ButtonMobile } from "./ButtonMobile";
import { project } from "@/fixtures/tideline";

const CODE = `<Button variant="primary">Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="tertiary">Skip</Button>
<Button variant="destructive" onClick={handleDelete}>Delete project</Button>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Button"] ?? [] },
  {
    type: "doc-section",
    heading: "Client-side routing",
    body: [
      {
        kind: "text",
        text: "`href` renders a plain `<a>` (a full page load). Wrap your app once in `<RebarLinkProvider renderLink={fn}>` with your router's link adapter and every link-capable component (`Button`, `Card`, `ListItem`, `ActionSheet` items, `Breadcrumb`, `NavBar`, `MobileTabBar`, `SidebarNav`, `NavIndex`, `Footer`, `ConstructSearch`) navigates client-side. A `renderLink` prop on a component still wins.",
      },
      {
        kind: "code",
        code: `<RebarLinkProvider renderLink={({ href, children, ...rest }) => <Link to={href} {...rest}>{children}</Link>}>\n  <Button href="/settings">Settings</Button>\n</RebarLinkProvider>`,
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A real `<button type="button">` by default (pass `type="submit"` for form submission): Tab to focus, Enter or Space to activate, a visible focus ring. `aria-busy` is set while `loading`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="button"`, `data-rebar-variant`, `data-rebar-size`, `data-rebar-state="idle" | "loading"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/migrate-antd` renames `variant` to AntD's `type`/`danger` vocabulary and `size=\"sm\"|\"md\"|\"lg\"` to `\"small\"|\"middle\"|\"large\"`. If the element already has a native `type` (e.g. `type=\"submit\"`), it is moved to AntD's `htmlType` prop first, since AntD's own `type` means visual variant, not HTML button type.",
      },
    ],
  },
];

export default function ButtonPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Button</Heading>
      <Text color="secondary">A button. Four variants, three sizes.</Text>

      <DemoStage
        title="Variants"
        caption="Primary, secondary, tertiary, destructive"
        code={CODE}
        states={[
          { label: "Loading", node: <Button loading>Saving</Button> },
          { label: "Disabled", node: <Button disabled>Save</Button> },
          { label: "Long label", node: <Button variant="secondary">Export every Tideline project</Button> },
          {
            label: "Sizes",
            node: (
              <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
                <Button size="sm">Small</Button>
                <Button>Medium</Button>
                <Button size="lg">Large</Button>
              </Stack>
            ),
          },
        ]}
      >
        <Stack direction="row" gap="md" align="center" style={{ flexWrap: "wrap" }}>
          <Button variant="primary">Save changes</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Skip</Button>
          <Button variant="destructive">Delete project</Button>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Confirm" caption="One primary action, the destructive one outlined" widths={false}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }} title={`Delete “${harbour.name}”?`} actions={[<Button key="keep" variant="secondary">Keep it</Button>, <Button key="delete" variant="destructive">Delete project</Button>]}>
          <Text size="sm" color="secondary">12 tasks and 3 files go with it. This can’t be undone.</Text>
        </Card>
      </DemoStage>

      <ButtonMobile />
            <Heading level={2}>Tonal</Heading>
      <DemoStage title="Tonal" caption="A soft filled chip for a secondary action; size sm is the chip. Pill padding, font and fill are --rebar-button-* tokens." widths={false}
        code={`<Button variant="tonal" size="sm">Share</Button>`}
        states={[
          { label: "Medium", node: <Button variant="tonal">Reflect on this reading</Button> },
          { label: "Disabled", node: <Button variant="tonal" size="sm" disabled>Share</Button> },
          { label: "Loading", node: <Button variant="tonal" size="sm" loading>Sharing</Button> },
        ]}>
        <Stack direction="row" gap="sm" align="center"><Button variant="tonal" size="sm">Share</Button><Button variant="tonal" size="sm">Discuss</Button></Stack>
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
