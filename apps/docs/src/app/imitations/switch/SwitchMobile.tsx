"use client";

import { useState } from "react";
import { Heading, List, ListItem, ListSection, Stack, Switch, Text, ToastProvider, TopBar, toast } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `// a promise keeps the switch busy until it settles; a rejection puts the value back
<Switch aria-label="Remind me daily" onChange={async (on) => { await saveReminder(on); }} />

<Switch aria-label="Reminders" loading />`;

function RemindRow({ blocked }: { blocked?: boolean }) {
  const [on, setOn] = useState(false);
  const change = async (next: boolean) => {
    toast.loading("Setting your reminder", { id: "remind", position: "bottom" });
    await new Promise((r) => setTimeout(r, 900));
    if (blocked) {
      toast.error("Could not turn on reminders", { id: "remind" });
      throw new Error("blocked");
    }
    setOn(next);
    toast.success(next ? "Reminder set for 8:00 AM" : "Reminder off", { id: "remind" });
  };
  return <ListItem title="Remind me daily" description="Off by default. One notification a day; tapping it opens Today." trailing={<Switch aria-label="Remind me daily" checked={on} onChange={change} />} />;
}

export function SwitchMobile() {
  return (
    <ToastProvider>
      <Heading level={2}>Loading</Heading>
      <DemoStage
        title="Switch, loading"
        caption="Waits for an async change; a rejection reverts"
        code={CODE}
        widths={false}
        states={[
          { label: "Loading (turning on)", node: <Switch aria-label="Turning on" loading /> },
          { label: "Loading (turning off)", node: <Switch aria-label="Turning off" loading defaultChecked /> },
          { label: "Large", node: <Switch aria-label="Large" size="lg" defaultChecked /> },
          { label: "Medium (52 by 32)", node: <Switch aria-label="Medium" size="md" /> },
        ]}
      >
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <List variant="grouped" aria-label="Reminder">
            <RemindRow />
          </List>
          <Text size="sm" color="secondary" style={{ padding: "10px 4px 0" }}>The switch shows a spinner for a second, then settles.</Text>
        </div>
      </DemoStage>
      <DemoStage title="Pending change and a permission error" caption="In context: the second switch reverts when Android refuses" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={360} bar={<PhoneBar><TopBar leading="back" title="Your Profile" /></PhoneBar>}>
            <ListSection title="Daily readings reminder" footer="One notification a day; tapping it opens Today.">
              <List variant="grouped">
                <RemindRow />
                <ListItem title="Time" trailing={<span style={{ border: "1.5px solid var(--rebar-color-border)", borderRadius: 999, padding: "8px 18px" }}>8:00 AM</span>} />
              </List>
            </ListSection>
          </TidelinePhone>
          <TidelinePhone width={320} height={360} bar={<PhoneBar><TopBar leading="back" title="Your Profile" /></PhoneBar>}>
            <ListSection title="Daily readings reminder">
              <List variant="grouped">
                <RemindRow blocked />
              </List>
              <div style={{ background: "var(--rebar-color-tint-2)", borderRadius: 22, padding: "14px 16px", marginTop: 12 }}>
                <b>Notifications are blocked</b>
                <Text size="sm" color="secondary">Allow Athic in Android settings, then try again.</Text>
              </div>
            </ListSection>
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </ToastProvider>
  );
}
