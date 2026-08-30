import { Avatar, Box, Card, Heading, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";
import { PropsTable } from "@/components/PropsTable";

export default function AvatarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Avatar</Heading>
      <Text color="secondary">
        A circular image with a text fallback (Radix underneath). Plain initials by default —
        Rebar stays low-fidelity until you supply a real <code>src</code>. Set{" "}
        <code>placeholder</code> to show one of Rebar&apos;s built-in illustrated portraits
        instead of bare initials while you don&apos;t have a real photo yet.
      </Text>

      <LivePreview>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", alignItems: "flex-end" }}>
          <Stack gap="xs" style={{ alignItems: "center" }}>
            <Avatar fallback="AL" />
            <Text size="xs" color="secondary">
              default
            </Text>
          </Stack>
          <Stack gap="xs" style={{ alignItems: "center" }}>
            <Avatar fallback="Ada Lovelace" placeholder />
            <Text size="xs" color="secondary">
              placeholder
            </Text>
          </Stack>
          <Stack gap="xs" style={{ alignItems: "center" }}>
            <Avatar fallback="Grace Hopper" placeholder />
            <Text size="xs" color="secondary">
              placeholder
            </Text>
          </Stack>
          <Stack gap="xs" style={{ alignItems: "center" }}>
            <Avatar fallback="Katherine Johnson" placeholder />
            <Text size="xs" color="secondary">
              placeholder
            </Text>
          </Stack>
          <Stack gap="xs" style={{ alignItems: "center" }}>
            <Avatar fallback="Margaret Hamilton" placeholder />
            <Text size="xs" color="secondary">
              placeholder
            </Text>
          </Stack>
        </Stack>
      </LivePreview>
      <Text size="xs" color="secondary">
        Each name above always gets the same portrait — <code>placeholder</code> picks
        deterministically from <code>fallback</code>, not randomly, so a given person&apos;s
        avatar doesn&apos;t change between renders.
      </Text>

      <Stack gap="xs">
        <Heading level={2}>Code</Heading>
        <Text
          as="pre"
          size="sm"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          {`<Avatar fallback="AL" />
<Avatar fallback="Ada Lovelace" src="/photos/ada.jpg" />
<Avatar fallback="Ada Lovelace" placeholder />
<Avatar fallback="Ada Lovelace" placeholder={2} />`}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Props</Heading>
        <PropsTable component="Avatar" />
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Composition: a profile card</Heading>
        <Text size="sm" color="secondary">
          Avatar composes with <code>Card</code> like anything else in Rebar — no special "media"
          component needed. This also demonstrates the other half of the placeholder art set: the
          same style, at wider aspect ratios, for whatever a card needs a real image for later.
        </Text>
        <LivePreview>
          <Card style={{ maxWidth: 360, margin: "0 auto" }}>
            <Stack gap="md">
              <Stack direction="row" gap="sm" align="center">
                <Avatar fallback="Grace Hopper" placeholder />
                <Stack gap="xs">
                  <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                    Grace Hopper
                  </Text>
                  <Text size="xs" color="secondary">
                    Rear Admiral, USN
                  </Text>
                </Stack>
              </Stack>
              <Box style={{ borderRadius: 4, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/placeholders/4-3-ratio-2.jpg"
                  alt=""
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
            </Stack>
          </Card>
        </LivePreview>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Accessibility</Heading>
        <Text size="sm">
          The fallback text (initials) is always in the DOM as real text, readable by screen
          readers even before/if the image never loads. Pass a meaningful <code>alt</code> when
          using a real <code>src</code>; when only <code>fallback</code> or{" "}
          <code>placeholder</code> is set, the image is decorative and <code>alt</code> is left
          empty automatically.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>data-rebar-* attributes</Heading>
        <Text size="sm">
          <code>data-rebar-component=&quot;avatar&quot;</code> on the root;{" "}
          <code>data-rebar-part=&quot;fallback&quot;</code> on the initials element.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Migrating to Ant Design</Heading>
        <Text size="sm">
          Not codemod-covered — AntD&apos;s <code>Avatar</code> takes its fallback content as{" "}
          <code>children</code>, while Rebar&apos;s is the <code>fallback</code> prop, a
          prop-to-children structural move a codemod won&apos;t attempt (see the antd adapter&apos;s
          README). <code>placeholder</code> has no AntD equivalent at all — AntD has no built-in
          illustrated-portrait fallback — so migrating a placeholder-using Avatar means supplying a
          real <code>src</code> (or dropping back to plain initials via <code>children</code>), not
          a mechanical rename.
        </Text>
      </Stack>
    </Stack>
  );
}
