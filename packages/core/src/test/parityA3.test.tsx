import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar } from "../components/TopBar";
import { MobileTabBar } from "../components/MobileTabBar";
import { List, ListItem } from "../components/List";
import { Card } from "../components/Card";
import { Empty } from "../components/Empty";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-a3"));

describe("parity-a3: TopBar", () => {
  it("backIcon and menuIcon replace the built-in glyphs and keep the labelled buttons", () => {
    render(<TopBar leading="back" backIcon={<span data-testid="mine">‹</span>} title="Ask" />);
    expect(screen.getByRole("button", { name: "Back" })).toContainElement(screen.getByTestId("mine"));
    expect(screen.getByRole("button", { name: "Back" }).querySelector("svg")).toBeNull();
  });

  it("menuIcon replaces the menu glyph", () => {
    render(<TopBar leading="menu" menuIcon={<span data-testid="burger">☰</span>} />);
    expect(screen.getByRole("button", { name: "Menu" })).toContainElement(screen.getByTestId("burger"));
  });

  it("without the icon props the built-in svg icons stay", () => {
    render(<TopBar leading="back" title="x" />);
    expect(screen.getByRole("button", { name: "Back" }).querySelector("svg")).not.toBeNull();
  });

  it("every metric is an opt-in property whose fallback is the previous value", () => {
    for (const re of [
      /padding: var\(--rebar-top-bar-padding, 0 6px\)/,
      /gap: var\(--rebar-top-bar-gap, 2px\)/,
      /width: var\(--rebar-top-bar-button-width, 44px\)/,
      /height: var\(--rebar-top-bar-button-height, 44px\)/,
      /font-size: var\(--rebar-top-bar-title-size, 1\.3rem\)/,
      /line-height: var\(--rebar-top-bar-title-line-height, 1\.15\)/,
      /height: var\(--rebar-top-bar-logo-height, 24px\)/,
      /min-height: var\(--rebar-top-bar-action-size, 44px\)/,
    ]) expect(block).toMatch(re);
  });
});

describe("parity-a3: MobileTabBar", () => {
  it("metrics are opt-in properties whose fallback is the previous value", () => {
    for (const re of [
      /min-height: var\(--rebar-tab-bar-min-height, 56px\)/,
      /min-height: var\(--rebar-tab-bar-item-min-height, 44px\)/,
      /width: var\(--rebar-tab-bar-icon-size, 20px\)/,
      /line-height: var\(--rebar-tab-bar-label-line-height, 1\.2\)/,
      /color: var\(--rebar-tab-bar-active-color, var\(--rebar-color-text-primary, #212121\)\)/,
    ]) expect(block).toMatch(re);
  });

  it("still renders icon, label and the active item", () => {
    render(<MobileTabBar position="static" activeIndex={1} items={[{ label: "Today", icon: <i /> }, { label: "Pray", icon: <i /> }]} />);
    expect(screen.getByRole("button", { name: "Pray" })).toHaveAttribute("aria-current", "page");
  });
});

describe("parity-a3: List and ListItem", () => {
  it("moreIcon replaces the built-in ••• icon and keeps the labelled button", () => {
    render(
      <List>
        <ListItem title="Row" trailing="more" moreLabel="Row actions" moreIcon={<span data-testid="dots">…</span>} />
      </List>,
    );
    const button = screen.getByRole("button", { name: "Row actions" });
    expect(button).toContainElement(screen.getByTestId("dots"));
    expect(button.querySelector("svg")).toBeNull();
  });

  it("without moreIcon the built-in icon stays", () => {
    render(
      <List>
        <ListItem title="Row" trailing="more" moreLabel="Row actions" />
      </List>,
    );
    expect(screen.getByRole("button", { name: "Row actions" }).querySelector("svg")).not.toBeNull();
  });

  it("row metrics are opt-in properties whose fallback is the previous value", () => {
    for (const re of [
      /gap: var\(--rebar-list-gap, 10px\)/,
      /min-height: var\(--rebar-list-item-min-height, 72px\)/,
      /border-radius: var\(--rebar-list-item-radius, 20px\)/,
      /padding-inline-start: var\(--rebar-list-item-padding-start, 16px\)/,
      /width: var\(--rebar-list-item-thumb-size, 56px\)/,
      /-webkit-line-clamp: var\(--rebar-list-item-title-lines, 3\)/,
      /padding: var\(--rebar-list-item-trailing-padding, 0 12px 0 0\)/,
      /width: var\(--rebar-list-item-more-size, 44px\)/,
    ]) expect(block).toMatch(re);
  });
});

describe("parity-a3: Card tile", () => {
  it("orientation tile marks the card and keeps title, subtitle and the icon cover", () => {
    render(<Card orientation="tile" tone={1} href="/x" cover={<i data-testid="ic" />} title="Reflections" subtitle="Your notes" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-rebar-orientation", "tile");
    expect(screen.getByTestId("ic")).toBeInTheDocument();
    expect(screen.getByText("Reflections")).toBeInTheDocument();
    expect(screen.getByText("Your notes")).toBeInTheDocument();
  });

  it("other orientations are unchanged", () => {
    const { rerender } = render(<Card orientation="row" title="a" href="/x" />);
    expect(screen.getByRole("link")).toHaveAttribute("data-rebar-orientation", "row");
    rerender(<Card title="a" href="/x" />);
    expect(screen.getByRole("link")).not.toHaveAttribute("data-rebar-orientation");
  });

  it("tile metrics are properties", () => {
    for (const re of [/min-height: var\(--rebar-card-tile-min-height, 132px\)/, /padding: var\(--rebar-card-tile-padding, 16px\)/, /border-radius: var\(--rebar-card-tile-radius, 26px\)/]) expect(block).toMatch(re);
  });
});

describe("parity-a3: Empty icon none", () => {
  it("renders only the description, marked plain", () => {
    const { container } = render(<Empty icon="none" description="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(container.querySelector("img, svg")).toBeNull();
    expect(container.querySelector("[data-rebar-component='empty']")).toHaveAttribute("data-rebar-icon", "none");
  });

  it("the default Empty still has its icons and is not marked plain", () => {
    const { container } = render(<Empty description="Nothing here" />);
    expect(container.querySelector("img")).not.toBeNull();
    expect(container.querySelector("[data-rebar-component='empty']")).not.toHaveAttribute("data-rebar-icon");
  });
});

describe("parity-a3: Progress", () => {
  it("track and fill colours are properties with the previous fallbacks", () => {
    expect(block).toMatch(/background: var\(--rebar-progress-track, var\(--rebar-color-border, #e0e0e0\)\)/);
    expect(block).toMatch(/background: var\(--rebar-progress-fill, var\(--rebar-color-primary, #0066cc\)\)/);
  });
});
