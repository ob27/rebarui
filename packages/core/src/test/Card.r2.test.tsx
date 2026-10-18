import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { Card } from "../components/Card";

describe("Card orientation=feature", () => {
  it("marks the card, keeps the slots and links as one anchor", () => {
    render(
      <Card orientation="feature" href="/x" cover={<span data-testid="cv" />} eyebrow="Charism" title="A title">
        An excerpt
      </Card>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-rebar-orientation", "feature");
    expect(link.querySelector('[data-rebar-part="cover"]')).not.toBeNull();
    expect(screen.getByText("Charism")).toBeInTheDocument();
    expect(screen.getByText("A title")).toBeInTheDocument();
    expect(screen.getByText("An excerpt")).toBeInTheDocument();
  });

  it("does not mark the other orientations", () => {
    const { container } = render(<Card title="t">b</Card>);
    expect(container.querySelector("[data-rebar-orientation]")).toBeNull();
  });

  it("is styled from the --rebar-card-feature-* properties", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    for (const name of ["--rebar-card-feature-gap", "--rebar-card-feature-cover-radius", "--rebar-card-feature-chip-background", "--rebar-card-feature-title-line-height"]) {
      expect(css).toContain(name);
    }
  });

  it("styles the promo preset from --rebar-card-promo-* properties", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    for (const name of ["--rebar-card-promo-background", "--rebar-card-promo-radius", "--rebar-card-promo-cover-width", "--rebar-card-promo-title-size", "--rebar-card-promo-body-opacity"]) {
      expect(css).toContain(name);
    }
  });
});
