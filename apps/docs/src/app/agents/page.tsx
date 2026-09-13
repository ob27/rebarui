import fs from "node:fs";
import path from "node:path";
import { Heading, Stack, Text } from "rebar-ui";
import { AgentMdViewer } from "./AgentMdViewer";

// Read directly from packages/core — the same file that ships inside the real rebar-ui npm
// tarball (see its package.json "files" list) — rather than a duplicated copy under apps/docs.
// One file, read here and by the /api/agent-md download route; the two can't drift apart.
function readAgentMd() {
  const filePath = path.join(process.cwd(), "..", "..", "packages", "core", "agent.md");
  return fs.readFileSync(filePath, "utf-8");
}

export default function AgentMdPage() {
  const content = readAgentMd();

  return (
    <Stack gap="lg">
      <Heading level={1}>Agent.md</Heading>
      <Text color="secondary">
        The full design-heuristics checklist and framework rules for building with Rebar UI —
        everything an AI agent needs to understand the Four-Tier Typology, the distinction between
        Framework Rules (fixed, mechanical constraints) and Heuristics (judgment-requiring design
        principles), and the 40-item checklist that governs component and construct design. Paste
        it into an agent&apos;s system prompt or project context before asking it to extend this
        framework or build new components — it&apos;s the compressed operating context that keeps
        every contribution aligned with the project&apos;s design philosophy.
      </Text>

      <AgentMdViewer content={content} />
    </Stack>
  );
}
