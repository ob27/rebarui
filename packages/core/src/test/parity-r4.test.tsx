import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { Card } from "../components/Card";
import { Text } from "../components/Text";
import { Checkbox } from "../components/Checkbox";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-r4"));

describe("parity-r4: card tone tokens", () => {
  it("renders a toned card with its data attributes", () => {
    const { container } = render(<Card tone={2}>Body</Card>);
    const card = container.querySelector(".rebar-card") as HTMLElement;
    expect(card.getAttribute("data-rebar-tone")).toBe("2");
  });
  it("defaults to the previous tint and border when no token is set", () => {
    expect(block).toContain('.rebar-card[data-rebar-tone="2"] { background: var(--rebar-card-tone-bg, var(--rebar-color-tint-2, #f5f5f5)); }');
    expect(block).toContain("border-width: var(--rebar-card-tone-border-width, var(--rebar-border-width, 1px))");
  });
});

describe("parity-r4: eyebrow type tokens", () => {
  it("keeps the eyebrow variant markup", () => {
    const { container } = render(<Text variant="eyebrow">Label</Text>);
    expect(container.querySelector('[data-rebar-variant="eyebrow"]')).not.toBeNull();
  });
  it("falls back to the previous size, weight, line height and tracking", () => {
    expect(block).toContain("font-size: var(--rebar-text-eyebrow-size, var(--rebar-eyebrow-size, 12px))");
    expect(block).toContain("font-weight: var(--rebar-text-eyebrow-weight, var(--rebar-eyebrow-weight, 700))");
    expect(block).toContain("line-height: var(--rebar-text-eyebrow-line-height, var(--rebar-eyebrow-line-height, 1.2))");
    expect(block).toContain("letter-spacing: var(--rebar-text-eyebrow-letter-spacing, var(--rebar-eyebrow-letter-spacing, 0.16em))");
  });
});

describe("parity-r4: checkbox label colour token", () => {
  it("inherits the colour unless the token is set", () => {
    render(<Checkbox appearance="native">Option</Checkbox>);
    expect(block).toContain(".rebar-checkbox-label { color: var(--rebar-checkbox-label-color, inherit); }");
  });
});

describe("parity-r4: popup title scope", () => {
  it("styles only the sheet's own title, not data-rebar-part=title inside its content", () => {
    expect(css).toContain('[data-rebar-appearance="popup"] .rebar-dialog-header [data-rebar-part="title"] {');
    expect(css).not.toContain('[data-rebar-appearance="popup"] [data-rebar-part="title"] {');
    expect(css).not.toContain('[data-rebar-title-style="heading"] [data-rebar-part="title"] {');
  });
});

const themeCss = readFileSync(resolve(__dirname, "../../../theme-basilika/src/components.css"), "utf8");

describe("parity-r4: toast ring, popup divider, select disabled opacity", () => {
  it("settles the reduced-motion ring on a token (default 44)", () => {
    expect(block).toContain("--rebar-toaster-ring-still-offset, 44");
    expect(block).toContain("@media (prefers-reduced-motion: reduce)");
  });
  it("centres the loading toast label unless the token says otherwise", () => {
    expect(block).toContain('[data-rebar-type="loading"] { text-align: var(--rebar-toaster-loading-text-align, center); }');
  });
  it("gives the popup divider its own colour token that defaults to the hairline", () => {
    expect(block).toContain("var(--rebar-popup-divider, var(--rebar-popup-hairline, var(--rebar-color-border)))");
  });
  it("makes the list item border width a token (default 1px)", () => {
    expect(block).toContain("border-width: var(--rebar-list-item-border-width, 1px)");
  });
  it("makes the disabled select opacity a token in the theme (default 0.5)", () => {
    expect(themeCss).toContain(".rebar-select-trigger:disabled { opacity: var(--rebar-select-disabled-opacity, 0.5); }");
  });
});
