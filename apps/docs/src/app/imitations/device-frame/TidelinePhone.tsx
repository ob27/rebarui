"use client";

import type { CSSProperties, ReactNode } from "react";
import { ChevronRightIcon, DeviceFrame, MobileTabBar, Text } from "rebar-ui";
import type { DeviceFrameProps } from "rebar-ui";

/**
 * The Tideline app on a phone, for the in-context examples of the mobile constructs: a real `DeviceFrame`
 * around a navy app bar, a scrolling screen and (optionally) a real `MobileTabBar`. The screen is its own
 * containing block (`transform`), so the tab bar's `position: fixed` and any sheet laid over the screen
 * stay inside the bezel instead of escaping to the browser viewport.
 */

export const PHONE_TABS = ["Inbox", "Projects", "Calendar", "You"];

/** The dot icon the Tideline tab bar uses. */
export const DOT = <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />;

/** Puts the active tab in the action colour, as the Tideline mocks do (the construct's active colour is the primary ink). */
export const TAB_BAR_STYLE = { "--rebar-color-text-primary": "var(--rebar-color-primary)", fontSize: 11 } as CSSProperties;

/** The four Tideline tabs as `MobileTabBar` items. */
export const PHONE_TAB_ITEMS = PHONE_TABS.map((label) => ({ label, icon: DOT }));

export const APP_BAR: CSSProperties = {
  flex: "none",
  display: "flex",
  alignItems: "center",
  gap: 10,
  minHeight: 52,
  padding: "4px 18px 8px",
  background: "var(--rebar-color-bg-inverse)",
  color: "var(--rebar-color-text-inverse)",
  fontFamily: "var(--rebar-font-family-display)",
  fontVariationSettings: '"SOFT" 100',
  fontWeight: "var(--rebar-font-weight-semibold)" as CSSProperties["fontWeight"],
  fontSize: 19,
  lineHeight: 1.2,
};

export interface TidelinePhoneProps extends Omit<DeviceFrameProps, "children" | "title" | "variant"> {
  /** App bar title. */
  title?: ReactNode;
  /** Replaces the title with custom app bar content (a back link, a search field). */
  bar?: ReactNode;
  /** Show the Tideline tab bar; a number picks the active tab. */
  tabs?: boolean | number;
  /** Your own `<MobileTabBar>` in place of the Tideline one. */
  tabBar?: ReactNode;
  /** Screen height in px (the frame is as tall as its content). Default 520. */
  height?: number;
  /** Frame width in px. Default 250 (two fit side by side on a reference page). */
  width?: number;
  /** Padding around the screen content. Default 14. */
  padding?: number | string;
  /** Dims the screen, as under an open sheet. */
  dim?: boolean;
  /** Absolutely positioned content over the screen: a sheet, a toast, a floating button. */
  overlay?: ReactNode;
  children?: ReactNode;
}

export function TidelinePhone({ title, bar, tabs, tabBar, height = 520, width = 250, padding = 14, dim, overlay, children, style, ...props }: TidelinePhoneProps) {
  const showTabs = tabBar !== undefined || (tabs !== undefined && tabs !== false);
  const frameStyle = {
    width: "100%",
    "--rebar-device-frame-max-width": `${width}px`,
    "--rebar-device-frame-status-bg": "var(--rebar-color-bg-inverse)",
    ...style,
  } as CSSProperties;
  return (
    <DeviceFrame variant="phone" style={frameStyle} {...props}>
      <div
        style={{
          position: "relative",
          transform: "translateZ(0)",
          height,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--rebar-color-bg-primary)",
          color: "var(--rebar-color-text-primary)",
          fontFamily: "var(--rebar-font-family-sans)",
        }}
      >
        <div style={APP_BAR}>{bar ?? title}</div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding, paddingBottom: showTabs ? 70 : padding }}>{children}</div>
        {tabBar !== undefined ? tabBar : showTabs ? <MobileTabBar aria-label="Tideline" items={PHONE_TAB_ITEMS} activeIndex={typeof tabs === "number" ? tabs : 0} style={TAB_BAR_STYLE} /> : null}
        {dim ? (
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1001, background: "color-mix(in srgb, var(--rebar-color-bg-inverse) 45%, transparent)" }} />
        ) : null}
        {overlay}
      </div>
    </DeviceFrame>
  );
}

/** A bottom sheet drawn over a `TidelinePhone` screen (pass it as `overlay`), for showing a sheet open inside the bezel. */
export function PhoneSheet({ title, children, footer, label }: { title?: ReactNode; label?: ReactNode; children?: ReactNode; footer?: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1002,
        background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))",
        borderRadius: "22px 22px 0 0",
        padding: "10px 16px 18px",
        boxShadow: "var(--rebar-shadow-float)",
      }}
    >
      <div aria-hidden="true" style={{ width: 40, height: 4, borderRadius: 4, background: "var(--rebar-color-border-strong)", margin: "0 auto 12px" }} />
      {label ? (
        <Text size="xs" color="secondary" style={{ textAlign: "center", marginBottom: 8 }}>
          {label}
        </Text>
      ) : null}
      {title ? (
        <div style={{ fontFamily: "var(--rebar-font-family-display)", fontVariationSettings: '"SOFT" 100', fontWeight: 600, fontSize: 18, marginBottom: 10 }}>{title}</div>
      ) : null}
      {children}
      {footer ? <div style={{ marginTop: 12 }}>{footer}</div> : null}
    </div>
  );
}

/** A grouped list on a phone screen: hairline card, rows separated by hairlines. */
export function PhoneList({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        border: "1px solid var(--rebar-color-border)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--rebar-color-bg-raised, var(--rebar-color-bg-primary))",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** One list row: a tinted thumbnail, a title, a line of meta and a chevron (or any trailing node). */
export function PhoneRow({
  title,
  meta,
  tint = 1,
  trailing,
  thumb = true,
  selected,
}: {
  title: ReactNode;
  meta?: ReactNode;
  /** Which theme tint the thumbnail uses (1 to 4). */
  tint?: 1 | 2 | 3 | 4;
  trailing?: ReactNode;
  thumb?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 12px 12px 14px",
        minHeight: 44,
        background: selected ? "var(--rebar-color-tint-3)" : undefined,
        boxShadow: "0 1px 0 var(--rebar-color-border)",
      }}
    >
      {thumb ? <span aria-hidden="true" style={{ flex: "none", width: 42, height: 42, borderRadius: 12, background: `var(--rebar-color-tint-${tint})` }} /> : null}
      <span style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" style={{ display: "block", fontWeight: "var(--rebar-font-weight-semibold)" }}>
          {title}
        </Text>
        {meta ? (
          <Text size="xs" color="secondary" style={{ display: "block" }}>
            {meta}
          </Text>
        ) : null}
      </span>
      {trailing === undefined ? <ChevronRightIcon aria-hidden="true" style={{ width: 16, height: 16, color: "var(--rebar-color-text-secondary)", flex: "none" }} /> : trailing}
    </div>
  );
}

/** A small-caps label, as on the sheet mocks. */
export function Kicker({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="cs-kicker" style={style}>{children}</div>;
}
