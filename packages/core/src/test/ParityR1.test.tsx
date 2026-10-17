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
    expect(chevrons[0].querySelector('[data-testid="own"]')).toBeInTheDocument();
    expect(chevrons[1].querySelector("path")).toBeInTheDocument();
  });

  it("keeps every default when no token is set", () => {
    expect(block).toContain("var(--rebar-list-grouped-radius, 22px)");
    expect(block).toContain("var(--rebar-list-grouped-padding, 0)");
    expect(block).toContain("var(--rebar-list-section-title-letter-spacing, 0.16em)");
    expect(block).toContain("var(--rebar-list-section-title-padding, 0 4px 10px)");
    expect(block).toContain("var(--rebar-list-section-footer-padding, 10px 4px 0)");
    expect(block).toContain("var(--rebar-list-item-chevron-size, 1.2em)");
    expect(block).toContain("var(--rebar-avatar-overflow, hidden)");
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
