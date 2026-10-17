"use client";

import type { CSSProperties, ReactNode } from "react";
import { Button, DeviceStage, Heading, Text } from "rebar-ui";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { APP_TODAY, HERO_CHIPS, perspectiveArt } from "@/fixtures/athic-marketing";
import type { Perspective } from "@/fixtures/athic-marketing";

/** Shared pieces of the Athic marketing demos: the app on a phone, and a linked Perspective card. */

const tile = (tint: number): CSSProperties => ({
  display: "grid",
  gap: 5,
  justifyItems: "start",
  padding: "10px 11px",
  borderRadius: 12,
  fontSize: 11,
  lineHeight: 1.4,
  background: `var(--rebar-color-tint-${tint})`,
  color: "var(--rebar-color-text-primary)",
});

/** The Athic app's Today screen inside a phone frame. */
export function AthicPhone({ height = 400 }: { height?: number }) {
  return (
    <TidelinePhone
      height={height}
      padding={10}
      bar={
        <span>
          Athic<span style={{ color: "var(--rebar-color-primary-bright, var(--rebar-color-primary))" }}>.</span>
        </span>
      }
    >
      <div style={{ display: "grid", gap: 9 }}>
        <Text as="div" size="sm" style={{ fontFamily: "var(--rebar-font-family-display)", fontWeight: 600, lineHeight: 1.2 }}>
          {APP_TODAY.heading}
        </Text>
        <div style={tile(1)}>
          <b>{APP_TODAY.readings.title}</b>
          <span>{APP_TODAY.readings.detail}</span>
          <Button size="sm" tabIndex={-1}>{APP_TODAY.readings.action}</Button>
        </div>
        <div style={{ ...tile(4) }}>
          <b>{APP_TODAY.checkIn.title}</b>
          <Button size="sm" variant="secondary" tabIndex={-1}>{APP_TODAY.checkIn.action}</Button>
        </div>
        <div style={{ ...tile(3) }}>
          <b>{APP_TODAY.ask.title}</b>
          <Button size="sm" variant="secondary" tabIndex={-1}>{APP_TODAY.ask.action}</Button>
        </div>
      </div>
    </TidelinePhone>
  );
}

/** The `media` of the hero: the phone on a stage with two floating chips. */
export function AthicHeroMedia({ chips = true, height = 400 }: { chips?: boolean; height?: number }) {
  return (
    <DeviceStage glow floats={chips ? HERO_CHIPS : []}>
      <AthicPhone height={height} />
    </DeviceStage>
  );
}

const CATEGORY_TINT: Record<Perspective["category"], number> = { Ethics: 1, Dialogues: 3, Grace: 4, Letters: 2 };

/** A linked Perspective card: art cover, category, title, excerpt, and a footer that stays on the bottom edge. */
export function PerspectiveCard({ p, coverHeight = 172, onOpen }: { p: Perspective; coverHeight?: number; onOpen?: () => void }) {
  return (
    <a
      href={`/perspectives/${p.id}`}
      onClick={(event) => {
        event.preventDefault();
        onOpen?.();
      }}
      data-athic-card=""
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        textDecoration: "none",
        color: "var(--rebar-color-text-primary)",
        background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))",
        border: "1px solid var(--rebar-color-border)",
        borderRadius: "var(--rebar-radius)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={perspectiveArt(p)} alt="" width={800} height={500} style={{ display: "block", width: "100%", height: coverHeight, objectFit: "cover" }} />
      <span style={{ display: "flex", flexDirection: "column", gap: 10, padding: "16px 18px 18px", flex: 1, alignItems: "flex-start" }}>
        <span
          style={{
            padding: "2px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            background: `var(--rebar-color-tint-${CATEGORY_TINT[p.category]})`,
          }}
        >
          {p.category}
        </span>
        <Heading level={3} style={{ fontSize: "1.15rem", lineHeight: 1.25, margin: 0 }}>
          {p.title}
        </Heading>
        <Text size="sm" color="secondary" style={{ margin: 0 }}>
          {p.excerpt}
        </Text>
        <span style={{ marginTop: "auto", display: "flex", width: "100%", fontSize: 13, color: "var(--rebar-color-text-secondary)" }}>
          <span>{p.readMinutes} min read</span>
          <span style={{ marginInlineStart: "auto" }}>{p.date}</span>
        </span>
      </span>
    </a>
  );
}

/** A grid of Perspective cards. */
export function PerspectiveGrid({ items, cols = 3, coverHeight = 150 }: { items: Perspective[]; cols?: number; coverHeight?: number }): ReactNode {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: `repeat(auto-fill, minmax(${cols === 3 ? 220 : 180}px, 1fr))` }}>
      {items.map((p) => (
        <PerspectiveCard key={p.id} p={p} coverHeight={coverHeight} />
      ))}
    </div>
  );
}
