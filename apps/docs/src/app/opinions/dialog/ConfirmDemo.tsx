"use client";

import { useState } from "react";
import { Button, Heading, Stack, Text, ToastProvider, confirm, toast } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { DISCUSSIONS } from "@/fixtures/athic";

const CODE = `const ok = await confirm({
  title: "Delete this discussion?",
  content: "This can’t be undone.",
  confirmText: "Delete",
  destructive: true,
})
if (ok) remove(id)

// stay open and busy while the request runs
await confirm({ title: "Delete?", destructive: true, onConfirm: () => api.remove(id) })`;

export function ConfirmDemo() {
  const [log, setLog] = useState("Nothing asked yet.");
  const ask = async (label: string, options: Parameters<typeof confirm>[0]) => {
    const ok = await confirm(options);
    setLog(`${label}: ${ok ? "confirmed" : "cancelled"}`);
    if (ok) toast.success("Discussion deleted", { action: { label: "Undo", onClick: () => {} } });
  };
  return (
    <ToastProvider>
      <Heading level={2}>Promise confirm()</Heading>
      <DemoStage title="confirm()" caption="Resolves true on confirm, false on cancel, mask tap or Escape" code={CODE} widths={false}>
        <Stack gap="md" align="center">
          <Stack direction="row" gap="sm" style={{ flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="secondary" onClick={() => ask("Simple", { title: "Leave without saving?", content: "Your reflection has not been saved yet.", confirmText: "Leave", cancelText: "Keep writing" })}>Simple</Button>
            <Button variant="secondary" onClick={() => ask("Destructive", { title: "Delete this discussion?", content: "This can’t be undone.", confirmText: "Delete", destructive: true })}>Destructive</Button>
            <Button variant="secondary" onClick={() => ask("With description", { title: "Remove from topic?", content: "The discussion stays in your list.", description: DISCUSSIONS[0].title, confirmText: "Remove" })}>With description</Button>
            <Button variant="secondary" onClick={() => ask("Stacked", { title: "Sign out of Athic?", content: "Your saved discussions stay on this device.", confirmText: "Sign out", layout: "stacked" })}>Stacked</Button>
            <Button variant="secondary" onClick={() => ask("Busy", { title: "Delete this discussion?", content: "This can’t be undone.", confirmText: "Delete", destructive: true, onConfirm: () => new Promise<void>((r) => setTimeout(r, 1500)) })}>Busy (onConfirm)</Button>
          </Stack>
          <Text size="sm" color="secondary" aria-live="polite">{log}</Text>
        </Stack>
      </DemoStage>
    </ToastProvider>
  );
}
