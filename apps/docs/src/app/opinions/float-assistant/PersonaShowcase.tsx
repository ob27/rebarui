"use client";

import { useState } from "react";
import { AssistantOrb, Button, Stack, Text, ORB_PERSONAS, ORB_PERSONA_IDS } from "rebar-ui";
import type { OrbInteractionState } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";

const PERSONA_BLURBS: Record<string, string> = {
  spark: "Energetic, flame-like hot core.",
  strato: "Calm, atmospheric, wide soft halo.",
  chorus: "Composed metal blobs, held and unified.",
};

/**
 * A small "use client" island (not the whole page) so the surrounding page can stay a server
 * component — matches how `FloatAssistant`/`AssistantOrb`/`LivePreview` are each their own client
 * module rather than forcing every page that touches them to be client-rendered end to end.
 *
 * Shows all three orb-personas (`packages/core/src/orb-personas/*.md`) side by side via
 * `AssistantOrb` directly (not full `FloatAssistant` instances — those are fixed-position
 * singletons, and three of them stacked would fight over the same corner) with a shared Idle/
 * Thinking toggle so the state-interpolation each persona doc defines is actually visible, not
 * just described in prose.
 */
export function PersonaShowcase() {
  const [state, setState] = useState<OrbInteractionState>("idle");

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm">
        <Button size="sm" variant={state === "idle" ? undefined : "secondary"} onClick={() => setState("idle")}>
          Idle
        </Button>
        <Button size="sm" variant={state === "thinking" ? undefined : "secondary"} onClick={() => setState("thinking")}>
          Thinking
        </Button>
      </Stack>
      <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
        {ORB_PERSONA_IDS.map((id) => (
          <Stack key={id} gap="xs" style={{ alignItems: "center", width: 160 }}>
            <LivePreview>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 12,
                  background: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AssistantOrb persona={id} state={state} size={64} />
              </div>
            </LivePreview>
            <Text style={{ fontWeight: 600 }}>{ORB_PERSONAS[id].label}</Text>
            <Text size="sm" color="secondary" style={{ textAlign: "center" }}>
              {PERSONA_BLURBS[id]}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
