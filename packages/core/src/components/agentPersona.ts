import type { OrbPersonaId } from "../orb-personas/personas";
import type { AgentStatus } from "./AgentTile";

/** The persona rule: Strato for any failure (an active failure state), else Spark for a service, else Chorus for an LLM agent. */
export function agentPersona(kind: "agent" | "service" = "agent", status: AgentStatus = "idle"): OrbPersonaId {
  if (status === "failure") return "strato";
  return kind === "service" ? "spark" : "chorus";
}
