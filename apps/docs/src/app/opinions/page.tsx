import { Heading, Image, Stack, Text } from "rebar-ui";

export default function OpinionsPage() {
  return (
    <Stack gap="lg">
      <Image src="/catalogue-heros/opinions.jpeg" alt="Opinions hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Opinions</Heading>
      <Text color="secondary">
        Real internal state — validation, morphing, multi-step flow, drag/reorder,
        search-and-filter, open/closed with focus management. Several components delegate their
        entire state machine to a wrapped Radix primitive (Select, Accordion, Tabs, Dialog,
        Popover, …) and show zero own useState in their own source — they&apos;re still Opinions;
        you can&apos;t determine tier by grepping for state alone. For blocks, Opinion is a
        mechanical, compiler-checked fact: a block is an Opinion iff its schema type declares a{" "}
        <code>source</code> or <code>onX</code> live-data-binding field (
        <code>packages/placement/src/opinions.ts</code>), not a judgment call — these are the only
        nine blocks that support the live <code>data</code>/<code>handlers</code> props on{" "}
        <code>BlockRenderer</code>. See{" "}
        <a href="/about/agent" className="rebar-link">
          the four tiers
        </a>{" "}
        for how this relates to Imitations, Synthetics, and Orders.
      </Text>
    </Stack>
  );
}
