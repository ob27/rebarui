import fs from "node:fs";
import path from "node:path";
import { Heading, Stack, Text } from "rebar-ui";
import { RobotMdViewer } from "./RobotMdViewer";

// Read directly from packages/core — the same file that ships inside the real rebar-ui npm
// tarball (see its package.json "files" list) — rather than a duplicated copy under apps/docs.
// One file, read here and by the /api/robot-md download route; the two can't drift apart.
function readRobotMd() {
  const filePath = path.join(process.cwd(), "..", "..", "packages", "core", "robot.md");
  return fs.readFileSync(filePath, "utf-8");
}

export default function RobotMdPage() {
  const content = readRobotMd();

  return (
    <Stack gap="lg">
      <Heading level={1}>robot.md</Heading>
      <Text color="secondary">
        A single, compressed context file for an AI agent working with Rebar UI — everything
        needed to design new components, build blocks out of those components, and use the Packer
        (<code>@rebar-ui/placement</code>) to compose a page from a plain <code>Block[]</code>{" "}
        document, plus the full design-heuristics checklist condensed to one line each. Paste it
        into an agent&apos;s system prompt or project context before asking it to build with (or
        extend) this framework — it trades the full sourced reasoning in{" "}
        <a href="/docs/heuristics" className="rebar-link">
          Design Heuristics
        </a>{" "}
        for density, so an agent can hold it in context every time rather than re-deriving the
        rules per task.
      </Text>

      <RobotMdViewer content={content} />
    </Stack>
  );
}
