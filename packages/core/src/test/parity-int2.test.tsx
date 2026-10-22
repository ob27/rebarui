import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { Card } from "../components/Card";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-int2"));

describe("parity-int2: Card promo slot rows", () => {
  it("places the header and body in grid rows set by tokens, auto by default", () => {
    expect(block).toContain("grid-row: var(--rebar-card-promo-header-row, auto)");
    expect(block).toContain("grid-row: var(--rebar-card-promo-body-row, auto)");
  });
});

describe("parity-int2: stacked block buttons", () => {
  it("take their gap from --rebar-button-block-gap, defaulting to the spacing token", () => {
    expect(css).toContain("margin-top: var(--rebar-button-block-gap, var(--rebar-space-md, 12px))");
  });
});

describe("parity-int2: reconciled token families keep every earlier name", () => {
  it("eyebrow and section-label tokens: --rebar-text-eyebrow-* with the --rebar-eyebrow-* and --rebar-section-label-* aliases", () => {
    for (const name of ["--rebar-text-eyebrow-size", "--rebar-eyebrow-size", "--rebar-section-label-size", "--rebar-section-label-tracking", "--rebar-eyebrow-color", "--rebar-text-eyebrow-color"]) {
      expect(css).toContain(name);
    }
  });
  it("list item title tokens: one rule with the -text-overflow and -overflow names and both wrap names", () => {
    expect(css).toContain("var(--rebar-list-item-title-text-overflow, var(--rebar-list-item-title-overflow, clip))");
    expect(css).toContain("var(--rebar-list-item-title-text-wrap, var(--rebar-list-item-title-wrap, pretty))");
  });
  it("tone cards take --rebar-card-tone-border-width, then --rebar-card-border-width", () => {
    expect(css).toContain("var(--rebar-card-tone-border-width, var(--rebar-card-border-width, var(--rebar-border-width, 1px)))");
  });
  it("the Avatar ring accepts --rebar-avatar-ring and --rebar-avatar-shadow", () => {
    const theme = readFileSync(resolve(__dirname, "../../../theme-basilika/src/components.css"), "utf8");
    expect(theme).toContain("var(--rebar-avatar-ring, var(--rebar-avatar-shadow,");
  });
});

describe("parity-int2: Card feature coverFrame", () => {
  it('"media" is marked and the default frame is not', () => {
    const { container, rerender } = render(<Card orientation="feature" coverFrame="media" cover={<img alt="" src="/a.jpg" />} title="T" />);
    expect(container.querySelector(".rebar-card")).toHaveAttribute("data-rebar-cover-frame", "media");
    rerender(<Card orientation="feature" cover={<img alt="" src="/a.jpg" />} title="T" />);
    expect(container.querySelector(".rebar-card")).not.toHaveAttribute("data-rebar-cover-frame");
  });
  it("moves the border and radius onto the image", () => {
    expect(block).toMatch(/\[data-rebar-cover-frame="media"\] > \.rebar-card-cover img \{\s*box-sizing: border-box;\s*border: var\(--rebar-card-feature-cover-border/);
  });
});

describe("parity-int2: popup heading colour", () => {
  it("takes --rebar-popup-heading-color, defaulting to the inherited popup text colour (the heading rule's own default)", () => {
    expect(css).toContain("color: var(--rebar-popup-heading-color, inherit)");
  });
});
