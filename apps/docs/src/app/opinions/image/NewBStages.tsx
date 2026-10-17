"use client";

import { useState } from "react";
import { Button, Heading, Image, Stack, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { athicArt } from "@/fixtures/athic-mobile";

const CODE = `<Image src={cover.src} thumbSrc={cover.thumb} alt="Cross at dusk" lazy lazyMargin={300}
  fallbackColor="var(--rebar-color-tint-1)" onStateChange={(s) => cache(cover.id, s)} />`;

const box = (w = 220, h = 140) => ({ width: w, height: h, borderRadius: 14 });

/** Progressive loading: thumbSrc blur-up, lazy via IntersectionObserver, fallback tint, error. */
export function NewBStages() {
  const [broken, setBroken] = useState(false);
  const [lazyShown, setLazyShown] = useState(false);
  return (
    <>
      <Heading level={2}>Progressive loading</Heading>
      <DemoStage
        title="thumbSrc, lazy, fallback"
        caption="The thumbnail shows blurred at once and fades out when src paints; lazy waits until near the viewport"
        code={CODE}
        widths={false}
        states={[
          { label: "Round avatar, no src", node: <Image alt="Maria" fallbackColor="var(--rebar-color-tint-2)" style={{ ...box(64, 64), borderRadius: "50%" }} /> },
          { label: "List thumb, loaded", node: <Image src={athicArt("dove")} alt="Dove" style={box(64, 64)} /> },
          { label: "Fallback tint, no src", node: <Image alt="Offline cover" fallbackColor="var(--rebar-color-tint-3)" style={box(64, 64)} /> },
        ]}
      >
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          <Stack gap="xs">
            <Image src={athicArt("cross")} thumbSrc={athicArt("cross", true)} alt="Cross at dusk, with a blurred thumbnail" style={box()} />
            <Text size="xs" color="secondary">thumbSrc, then src</Text>
          </Stack>
          <Stack gap="xs">
            {lazyShown ? (
              <Image src={athicArt("chalice")} thumbSrc={athicArt("chalice", true)} lazy alt="Chalice, loaded lazily" style={box()} />
            ) : (
              <Button variant="secondary" onClick={() => setLazyShown(true)} style={{ ...box(), height: 140 }}>Mount a lazy image</Button>
            )}
            <Text size="xs" color="secondary">lazy: no request until near the viewport</Text>
          </Stack>
          <Stack gap="xs">
            <Image src={broken ? "/missing-cover.jpg" : athicArt("book")} thumbSrc={athicArt("book", true)} alt="Cover" fallbackColor="var(--rebar-color-tint-1)" style={box()} />
            <Button size="sm" variant="secondary" onClick={() => setBroken((b) => !b)}>{broken ? "Restore the image" : "Break the image"}</Button>
          </Stack>
        </Stack>
      </DemoStage>
    </>
  );
}
