import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FloatCard } from "../components/FloatCard";

describe("FloatCard", () => {
  it("carries data-rebar attributes and forwards data-/aria- props", () => {
    render(
      <FloatCard label="Ask" data-testid="fc" aria-label="Citation">
        CCC 1374
      </FloatCard>,
    );
    const root = screen.getByTestId("fc");
    expect(root).toHaveAttribute("data-rebar-component", "float-card");
    expect(root).toHaveAttribute("data-rebar-tone", "default");
    expect(root).toHaveAttribute("aria-label", "Citation");
    expect(root.querySelector('[data-rebar-part="label"]')).toHaveTextContent("Ask");
    expect(root.querySelector('[data-rebar-part="body"]')).toHaveTextContent("CCC 1374");
  });

  it("omits the label element when no label is given and supports the accent tone", () => {
    render(
      <FloatCard tone="accent" data-testid="fc">
        Checked in
      </FloatCard>,
    );
    const root = screen.getByTestId("fc");
    expect(root.querySelector('[data-rebar-part="label"]')).toBeNull();
    expect(root).toHaveAttribute("data-rebar-tone", "accent");
  });

  it("keeps its text in the accessibility tree", () => {
    render(<FloatCard>Readable</FloatCard>);
    expect(screen.getByText("Readable")).toBeVisible();
  });
});
