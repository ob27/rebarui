import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../components/Progress";

describe("Progress", () => {
  it("renders a real progressbar role reflecting the value", () => {
    render(<Progress value={40} aria-label="Upload progress" />);
    const progress = screen.getByRole("progressbar", { name: "Upload progress" });
    expect(progress).toHaveAttribute("aria-valuenow", "40");
    expect(progress).toHaveAttribute("data-rebar-component", "progress");
  });

  it("translates the indicator proportionally to value/max", () => {
    const { container } = render(<Progress value={25} max={50} />);
    const indicator = container.querySelector('[data-rebar-part="indicator"]') as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-50%)");
  });
});

describe("Progress status, size and indeterminate", () => {
  it("defaults to md with no status attribute", () => {
    render(<Progress value={30} aria-label="p" />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("data-rebar-size", "md");
    expect(el).not.toHaveAttribute("data-rebar-status");
  });

  it("sets status and size attributes", () => {
    render(<Progress value={30} status="error" size="lg" aria-label="p" />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("data-rebar-status", "error");
    expect(el).toHaveAttribute("data-rebar-size", "lg");
  });

  it("indeterminate drops the value and the inline transform", () => {
    const { container } = render(<Progress indeterminate aria-label="p" />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("data-rebar-indeterminate", "true");
    expect(el).not.toHaveAttribute("aria-valuenow");
    expect(el).toHaveAttribute("data-state", "indeterminate");
    expect((container.querySelector('[data-rebar-part="indicator"]') as HTMLElement).style.transform).toBe("");
  });
});
