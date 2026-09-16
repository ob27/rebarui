import { Heading, Image, Stack, Text, CodeBlock } from "rebar-ui";
import fs from "fs/promises";
import path from "path";

export default async function HeuristicsPage() {
  const heuristicsMd = await fs.readFile(
    path.join(process.cwd(), "HEURISTICS.md"),
    "utf-8"
  );

  return (
    <Stack gap="lg" style={{ maxWidth: 800, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Image src="/catalogue-heros/heuristics.jpeg" alt="Heuristics hero" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Design Heuristics</Heading>
      <Text color="secondary">
        A portable reference for sensible UI defaults — copy this file into any project so a
        developer or an AI coding agent has a concrete standard to build against, instead of
        re-deciding spacing, color, and interaction defaults on every screen.
      </Text>
      <CodeBlock code={heuristicsMd} />
    </Stack>
  );
}
