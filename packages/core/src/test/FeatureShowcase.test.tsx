import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { DeviceFrame } from "../components/DeviceFrame";

const media = (
  <DeviceFrame>
    <img src="/x.png" alt="Screenshot" />
  </DeviceFrame>
);

describe("FeatureShowcase", () => {
  it("renders a section with data-rebar-component and all parts", () => {
    render(
      <FeatureShowcase data-testid="fs" eyebrow="Plan" title="Plan your day" body="Drag tasks into place." media={media} />,
    );
    const root = screen.getByTestId("fs");
    expect(root.tagName).toBe("SECTION");
    expect(root).toHaveAttribute("data-rebar-component", "feature-showcase");
    expect(root).toHaveAttribute("data-rebar-tone", "default");
    for (const part of ["text", "media", "eyebrow", "title", "body"]) {
      expect(root.querySelector(`[data-rebar-part="${part}"]`)).not.toBeNull();
    }
  });

  it("renders the title as an h2 by default and h3 on request", () => {
    const { rerender } = render(<FeatureShowcase title="Hello" media={media} />);
    expect(screen.getByRole("heading", { level: 2, name: "Hello" })).toBeInTheDocument();
    rerender(<FeatureShowcase title="Hello" media={media} headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Hello" })).toBeInTheDocument();
  });

  it("omits eyebrow and body when not given", () => {
    render(<FeatureShowcase data-testid="fs" title="Hello" media={media} />);
    const root = screen.getByTestId("fs");
    expect(root.querySelector('[data-rebar-part="eyebrow"]')).toBeNull();
    expect(root.querySelector('[data-rebar-part="body"]')).toBeNull();
  });

  it("puts text before media in DOM order (text above media when stacked)", () => {
    render(<FeatureShowcase data-testid="fs" title="Hello" media={media} reverse />);
    const children = Array.from(screen.getByTestId("fs").children);
    expect(children[0]).toHaveAttribute("data-rebar-part", "text");
    expect(children[1]).toHaveAttribute("data-rebar-part", "media");
  });

  it("exposes reverse and tone as attributes", () => {
    render(<FeatureShowcase data-testid="fs" title="Hello" media={media} reverse tone="inverse" />);
    const root = screen.getByTestId("fs");
    expect(root).toHaveAttribute("data-rebar-reverse", "true");
    expect(root).toHaveAttribute("data-rebar-tone", "inverse");
  });

  it("accepts rich body content and the media stays accessible", () => {
    render(<FeatureShowcase title="Hello" body={<span>Rich <b>body</b></span>} media={media} />);
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Screenshot" })).toBeInTheDocument();
  });
});
