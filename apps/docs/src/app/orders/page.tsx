import { Heading, Image, Stack, Text } from "rebar-ui";

export default function OrdersPage() {
  return (
    <Stack gap="lg">
      <Image src="/catalogue-heros/orders.jpeg" alt="Orders hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Orders</Heading>
      <Text color="secondary">
        Macro/page-level structural governance — components and blocks that arrange other things
        at a page or app scale (nav bars, sidebars, tab strips that swap whole panels, page-level
        overlay/panel systems, page indexes) rather than carrying their own data-shaped state. Read
        literally, Order looks like a fourth rung of the same Imitation→Synthetic→Opinion
        complexity ladder; it isn&apos;t — it&apos;s a different axis (macro governance vs.
        behavioral complexity), which is why it covers only 8 of the 39 blocks rather than the
        whole placement layer. See{" "}
        <a href="/docs/tiers" className="rebar-link">
          the four tiers
        </a>{" "}
        for the full nuance.
      </Text>
    </Stack>
  );
}
