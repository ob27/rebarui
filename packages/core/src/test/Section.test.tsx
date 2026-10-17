import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "../components/Section";

describe("Section", () => {
  it("renders a labelled region with an h2, eyebrow and lede", () => {
    render(
      <Section eyebrow="Every day" title="Your daily practice" lede="One place.">
        <p>body</p>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Your daily practice" });
    expect(region).toHaveAttribute("data-rebar-component", "section");
    expect(screen.getByRole("heading", { level: 2, name: "Your daily practice" })).toBeInTheDocument();
    expect(screen.getByText("Every day")).toBeInTheDocument();
    expect(screen.getByText("One place.")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("defaults: tone default, width lg, spacing default, not rounded, start aligned heading", () => {
    const { container } = render(<Section title="T" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-tone", "default");
    expect(root).toHaveAttribute("data-rebar-width", "lg");
    expect(root).toHaveAttribute("data-rebar-spacing", "default");
    expect(root).toHaveAttribute("data-rebar-rounded", "false");
    expect(root.querySelector('[data-rebar-part="header"]')).toHaveAttribute("data-rebar-align", "start");
  });

  it("rounds and centres the dark and panel tones by default, and rounded can override", () => {
    const { container, rerender } = render(<Section tone="dark" title="T" />);
    let root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-rounded", "true");
    expect(root.querySelector('[data-rebar-part="header"]')).toHaveAttribute("data-rebar-align", "center");
    rerender(<Section tone="panel" rounded={false} title="T" />);
    root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-rounded", "false");
    rerender(<Section tone="tint" title="T" align="center" width="sm" spacing="loose" />);
    root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-tone", "tint");
    expect(root).toHaveAttribute("data-rebar-width", "sm");
    expect(root).toHaveAttribute("data-rebar-spacing", "loose");
    expect(root.querySelector('[data-rebar-part="header"]')).toHaveAttribute("data-rebar-align", "center");
  });

  it("renders as another element and respects an explicit aria-label", () => {
    render(
      <Section as="aside" title="Shown" aria-label="Custom name" data-testid="s">
        x
      </Section>,
    );
    const el = screen.getByTestId("s");
    expect(el.tagName).toBe("ASIDE");
    expect(el).toHaveAttribute("aria-label", "Custom name");
    expect(el).not.toHaveAttribute("aria-labelledby");
  });

  it("omits the header when there is no heading content", () => {
    const { container } = render(<Section>only</Section>);
    expect(container.querySelector('[data-rebar-part="header"]')).toBeNull();
  });
});
