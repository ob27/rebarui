"use client";

import { Button, Heading, Stack, Text, TopBar } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<Button block>Subscribe</Button>
<Button iconOnly variant="secondary" aria-label="Add" startIcon={<AddIcon />} />
<Button startIcon={<BookmarkIcon />}>Save to Library</Button>
<Button shape="rounded">Save</Button>

// a link that looks like a button
<Button href="/mission" variant="tertiary" endIcon={<ChevronRightIcon />}>Read our mission</Button>
<Button asChild variant="secondary"><Link href="/library">Open the Library</Link></Button>`;

const ic = (d: string) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PLUS = ic("M12 5v14M5 12h14");
const BELL = ic("M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 19a2 2 0 0 0 4 0");
const INFO = ic("M12 8v.01M12 11v5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z");
const BACK = ic("M15 5l-7 7 7 7");
const SEND = ic("M5 12h14M13 6l6 6-6 6");
const SHARE = ic("M12 3v12M8 7l4-4 4 4M5 13v6h14v-6");
const MARK = ic("M7 4h10v16l-5-4-5 4z");
const EXT = ic("M14 4h6v6M20 4l-9 9M18 14v5H5V6h5");

export function ButtonMobile() {
  return (
    <>
      <Heading level={2}>Mobile additions</Heading>
      <DemoStage
        title="block, iconOnly, startIcon, href"
        caption="Full-width actions, round icon buttons, link as button, a rounded shape"
        code={CODE}
        widths={false}
        states={[
          { label: "Rounded", node: <Button shape="rounded">Save</Button> },
          { label: "Start icon", node: <Button startIcon={MARK}>Save to Library</Button> },
          { label: "Icon only sm / md / lg", node: <Stack direction="row" gap="sm" align="center"><Button iconOnly size="sm" variant="secondary" aria-label="Add small">{PLUS}</Button><Button iconOnly variant="secondary" aria-label="Add">{PLUS}</Button><Button iconOnly size="lg" variant="secondary" aria-label="Add large">{PLUS}</Button></Stack> },
          { label: "Block loading", node: <Button block loading>Signing in</Button> },
          { label: "Link style (tertiary + href)", node: <Button href="#mission" variant="tertiary">Read more</Button> },
          { label: "Disabled link", node: <Button href="#x" variant="secondary" disabled>Open</Button> },
        ]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24 }}>
          <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <Text variant="eyebrow" tone="muted">block</Text>
            <Button block>Subscribe</Button>
            <Button block variant="secondary" startIcon={SHARE}>Share</Button>
            <Button block variant="destructive">Delete your account</Button>
          </div>
          <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <Text variant="eyebrow" tone="muted">icon only</Text>
            <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
              <Button iconOnly variant="secondary" aria-label="Back">{BACK}</Button>
              <Button iconOnly variant="secondary" aria-label="Add">{PLUS}</Button>
              <Button iconOnly variant="secondary" aria-label="Info">{INFO}</Button>
              <Button iconOnly variant="secondary" aria-label="Notifications">{BELL}</Button>
              <Button iconOnly aria-label="Send">{SEND}</Button>
            </Stack>
            <Text variant="eyebrow" tone="muted">link as button</Text>
            <Stack direction="row" gap="sm" align="center" style={{ flexWrap: "wrap" }}>
              <Button href="#mission" variant="tertiary" endIcon={ic("M9 6l6 6-6 6")}>Read our mission</Button>
              <Button href="https://example.com" target="_blank" variant="secondary" endIcon={EXT}>Open in browser</Button>
            </Stack>
          </div>
        </div>
      </DemoStage>
      <DemoStage title="Account actions and sign in" caption="In context" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={560} tabBar={athicTabs("me")} bar={<PhoneBar><TopBar leading="back" title="Your Account" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <Heading level={3}>Your data</Heading>
                <Text size="sm" color="secondary" style={{ margin: "6px 0 12px" }}>Download everything tied to your account, exported still encrypted.</Text>
                <Button variant="secondary" startIcon={SHARE}>Download my data</Button>
              </div>
              <div style={{ borderTop: "1px solid var(--rebar-color-border)", paddingTop: 16 }}>
                <Heading level={3} style={{ color: "var(--rebar-color-danger)" }}>Danger zone</Heading>
                <Text size="sm" color="secondary" style={{ margin: "6px 0 12px" }}>Permanently delete your account and all its data.</Text>
                <Button variant="destructive">Delete your account</Button>
              </div>
              <Button href="#mission" variant="tertiary" endIcon={ic("M9 6l6 6-6 6")} style={{ justifySelf: "start" }}>Read our mission</Button>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={480} bar={<PhoneBar><TopBar logo="Athic" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Heading level={2}>Welcome back</Heading>
              <Button block size="lg">Sign in</Button>
              <Button block size="lg" variant="secondary">Continue with Google</Button>
              <Button href="#create" variant="tertiary" style={{ justifySelf: "center" }}>Create an account</Button>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </>
  );
}
