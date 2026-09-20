"use client";

import { useState } from "react";
import { AssistantOrb, Button, Stack, Text, ORB_PERSONAS, ORB_PERSONA_IDS } from "rebar-ui";
import type { OrbInteractionState } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";

const PERSONA_BLURBS: Record<string, string> = {
  spark: "Original canvas metaballs — organic, hand-crafted.",
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
        {ORB_PERSONA_IDS.map((id) => {
          // Spark uses the original canvas metaball design (no persona prop)
          // Spark and Chorus are 1/3 larger than Strato
          const orbSize = id === "strato" ? 120 : 160;
          const usePersona = id !== "spark";

          return (
            <Stack key={id} gap="xs" style={{ alignItems: "center", width: 160 }}>
              <LivePreview>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {/* Orb sits behind the glass */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 4,
                      borderRadius: "50%",
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      overflow: "hidden",
                    }}
                  >
                    {usePersona ? (
                      <AssistantOrb persona={id} state={state} size={orbSize} />
                    ) : (
                      <AssistantOrb isActive={state !== "idle"} size={orbSize} />
                    )}
                  </div>

                {/* Glass lens container - convex effect */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 40%, transparent 60%, rgba(0,0,0,0.1) 100%)",
                    boxShadow: `
                      0 8px 32px rgba(0,0,0,0.4),
                      0 2px 8px rgba(0,0,0,0.2),
                      inset 0 2px 4px rgba(255,255,255,0.3),
                      inset 0 -2px 4px rgba(0,0,0,0.2),
                      0 0 0 1px rgba(255,255,255,0.15)
                    `,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />

                {/* Top highlight - lens reflection */}
                <div
                  style={{
                    position: "absolute",
                    top: "8%",
                    left: "15%",
                    width: "45%",
                    height: "25%",
                    borderRadius: "50%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                    filter: "blur(2px)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />

                {/* Bottom rim light */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "5%",
                    left: "20%",
                    width: "60%",
                    height: "15%",
                    borderRadius: "50%",
                    background: "linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
                    filter: "blur(1px)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </LivePreview>
            <Text style={{ fontWeight: 600 }}>{ORB_PERSONAS[id].label}</Text>
            <Text size="sm" color="secondary" style={{ textAlign: "center" }}>
              {PERSONA_BLURBS[id]}
            </Text>
          </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
