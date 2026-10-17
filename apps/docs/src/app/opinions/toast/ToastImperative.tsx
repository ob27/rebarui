"use client";

import { Button, Heading, Stack, Text, TopBar, ToastView, useToast } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `toast.success("Saved to Library", { action: { label: "View", onClick: openLibrary } })
toast.error("Could not reach Athic. Check your connection.")
const id = toast.loading("Generating recording…")   // later
toast.dismiss(id)
toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Could not save" })

// in a component
const t = useToast()`;

const sleep = (ms: number, fail?: boolean) => new Promise<string>((res, rej) => setTimeout(() => (fail ? rej(new Error("x")) : res("ok")), ms));

function Controls() {
  const t = useToast();
  return (
    <Stack direction="row" gap="sm" style={{ flexWrap: "wrap", justifyContent: "center" }}>
      <Button variant="secondary" size="sm" onClick={() => t.success("Saved to Library", { action: { label: "View", onClick: () => {} } })}>success + action</Button>
      <Button variant="secondary" size="sm" onClick={() => t.error("Could not reach Athic. Check your connection.")}>error</Button>
      <Button variant="secondary" size="sm" onClick={() => t.info("Added to Topic: Confession")}>info</Button>
      <Button variant="secondary" size="sm" onClick={() => t.promise(sleep(1500), { loading: "Saving…", success: "Saved", error: "Could not save" })}>promise</Button>
      <Button variant="secondary" size="sm" onClick={() => t.promise(sleep(1500, true), { loading: "Saving…", success: "Saved", error: "Could not save" }).catch(() => {})}>promise (fails)</Button>
      <Button variant="secondary" size="sm" onClick={() => t.info("Added to the top", { position: "top" })}>top</Button>
      <Button variant="secondary" size="sm" onClick={() => t.loading("Generating", { position: "center", id: "gen", duration: 1800 })}>center loading</Button>
      <Button variant="secondary" size="sm" onClick={() => { t.success("One"); t.info("Two"); t.error("Three"); t.info("Four, so max 3 shows"); }}>stack of four</Button>
      <Button variant="secondary" size="sm" onClick={() => t.dismiss()}>dismiss all</Button>
    </Stack>
  );
}

const phoneScene = (node: React.ReactNode, title = "Your Profile") => (
  <TidelinePhone width={300} height={200} bar={<PhoneBar><TopBar title={title} /></PhoneBar>} overlay={<div style={{ position: "absolute", left: 14, right: 14, bottom: 14, zIndex: 5, display: "grid", gap: 8 }}>{node}</div>}>
    <Text color="secondary" size="sm">Static, as drawn by the provider.</Text>
  </TidelinePhone>
);

export function ToastImperative() {
  return (
    <>
      <Heading level={2}>Imperative toast()</Heading>
      <DemoStage
        title="toast()"
        caption="Call from anywhere; the provider above hosts the stack (max 3 per position)"
        code={CODE}
        widths={false}
        states={[
          { label: "success", node: <ToastView type="success" message="Saved to Library" /> },
          { label: "error", node: <ToastView type="error" message="Could not reach Athic. Check your connection." /> },
          { label: "loading", node: <ToastView type="loading" message="Generating recording…" /> },
          { label: "info", node: <ToastView message="Added to Topic: Confession" /> },
          { label: "with action", node: <ToastView type="success" message="Discussion deleted" action={{ label: "Undo", onClick: () => {} }} /> },
          { label: "quota (action)", node: <ToastView type="error" message="Daily limit reached." action={{ label: "See plans", onClick: () => {} }} /> },
          { label: "center (loading)", node: <ToastView type="loading" position="center" message="Generating" /> },
          { label: "stacked (older, smaller)", node: <div style={{ display: "grid" }}><ToastView stacked message="Added to Topic: Confession" /><ToastView type="success" message="Saved to Library" /></div> },
        ]}
      >
        <Controls />
      </DemoStage>
      <DemoStage title="Saved, offline, quota" caption="In context" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          {phoneScene(<ToastView type="success" message="Reminder set for 8:00 AM" />)}
          {phoneScene(<ToastView type="error" message="Could not reach Athic. Check your connection." />, "Ask")}
          {phoneScene(<ToastView type="error" message="Daily limit reached." action={{ label: "See plans", onClick: () => {} }} />, "Ask")}
        </Stack>
      </DemoStage>
    </>
  );
}
