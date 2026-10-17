import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { List, ListItem, ListSection } from "../components/List";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const theme = readFileSync(resolve(__dirname, "../../../theme-basilika/src/components.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-r1"));

describe("parity-r1: grouped list panel and ListSection type tokens", () => {
  it("ListItem chevronIcon replaces the built-in chevron glyph", () => {
    const { container } = render(
      <List variant="grouped">
        <ListItem title="Plan" trailing="chevron" chevronIcon={<svg data-testid="own" />} />
        <ListItem title="Other" trailing="chevron" />
      </List>,
    );
    const chevrons = container.querySelectorAll('[data-rebar-part="chevron"]');
    expect(chevrons[0]!.querySelector('[data-testid="own"]')).toBeInTheDocument();
    expect(chevrons[1]!.querySelector("path")).toBeInTheDocument();
  });

  it("keeps every default when no token is set", () => {
    expect(block).toContain("var(--rebar-list-grouped-radius, 22px)");
    expect(block).toContain("var(--rebar-list-grouped-padding, 0)");
    expect(block).toContain("var(--rebar-list-section-title-letter-spacing, 0.16em)");
    expect(block).toContain("var(--rebar-list-section-title-padding, 0 4px 10px)");
    expect(block).toContain("var(--rebar-list-section-footer-padding, 10px 4px 0)");
    expect(block).toContain("var(--rebar-list-item-chevron-size, 1.2em)");
    expect(block).toContain("var(--rebar-avatar-overflow, hidden)");
    expect(block).toContain("var(--rebar-popup-heading-size, 22px)");
    expect(block).toContain("var(--rebar-avatar-image-radius, 0)");
  });

  it("theme Avatar keeps its backing colour and ring unless tokens are set", () => {
    const t = theme.slice(theme.indexOf("/* ---- parity-r1"));
    expect(t).toContain("var(--rebar-avatar-background, var(--rebar-color-tint-3))");
    expect(t).toContain("var(--rebar-avatar-ring, 0 0 0 2px var(--rebar-color-bg-raised))");
  });

  it("ListSection still renders its title and footer parts", () => {
    const { container } = render(
      <ListSection title="Help" footer="Note">
        <List variant="grouped"><ListItem title="Row" /></List>
      </ListSection>,
    );
    expect(container.querySelector(".rebar-list-section-title")).toHaveTextContent("Help");
    expect(container.querySelector(".rebar-list-section-footer")).toHaveTextContent("Note");
  });
});

import { ImagePicker } from "../components/ImagePicker";

describe("parity-r1: ImagePicker appearance=ring", () => {
  const items = [
    { id: "a", src: "a.png", alt: "A" },
    { id: "b", src: "b.png", alt: "B" },
  ];
  it("marks the appearance and keeps the selected badge while busy", () => {
    const { container } = render(<ImagePicker appearance="ring" items={items} selectedId="a" busyId="a" checkIcon={<i data-testid="tick" />} />);
    expect(container.querySelector('[data-rebar-component="image-picker"]')).toHaveAttribute("data-rebar-appearance", "ring");
    const tile = container.querySelector('[data-rebar-part="tile"]')!;
    expect(tile).toHaveAttribute("data-rebar-state", "busy");
    expect(tile).toHaveAttribute("data-rebar-selected", "true");
    expect(tile.querySelector('[data-testid="tick"]')).toBeInTheDocument();
  });
  it("leaves the default appearance unchanged (no badge while busy)", () => {
    const { container } = render(<ImagePicker items={items} selectedId="a" busyId="a" />);
    expect(container.querySelector('[data-rebar-component="image-picker"]')).not.toHaveAttribute("data-rebar-appearance");
    expect(container.querySelector('[data-rebar-part="check"]')).toBeNull();
  });
  it("css keeps the ring defaults", () => {
    expect(block).toContain("var(--rebar-image-picker-tile-radius, 18px)");
    expect(block).toContain("var(--rebar-image-picker-gap, 14px)");
  });
});

import { Avatar } from "../components/Avatar";

describe("parity-r1: Avatar overlayStyle=full", () => {
  it("marks the style and swaps the label for the spinner while loading (no separate scrim)", () => {
    const { container, rerender } = render(<Avatar fallback="A" size={64} overlay="edit" overlayStyle="full" aria-label="Change" />);
    const root = container.querySelector('[data-rebar-component="avatar"]')!;
    expect(root).toHaveAttribute("data-rebar-overlay-style", "full");
    expect(container.querySelector('[data-rebar-part="overlay"]')).toHaveTextContent("Edit");
    rerender(<Avatar fallback="A" size={64} overlay="edit" overlayStyle="full" aria-label="Change" loading spinner={<i data-testid="spin" />} />);
    expect(container.querySelector('[data-rebar-part="overlay"] [data-testid="spin"]')).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-part="scrim"]')).toBeNull();
  });
  it("keeps the band overlay and scrim by default", () => {
    const { container } = render(<Avatar fallback="A" size={64} overlay="edit" loading aria-label="Change" />);
    expect(container.querySelector('[data-rebar-component="avatar"]')).not.toHaveAttribute("data-rebar-overlay-style");
    expect(container.querySelector('[data-rebar-part="scrim"]')).toBeInTheDocument();
  });
});
