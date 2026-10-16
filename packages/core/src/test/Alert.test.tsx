import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "../components/Alert";

describe("Alert", () => {
  it("uses an assertive role for errors so screen readers announce them immediately", () => {
    render(<Alert type="error" title="Email is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
  });

  it("uses a polite status role for non-urgent alert types", () => {
    render(<Alert type="success" title="Saved" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("marks title and description as distinct parts for styling/testing", () => {
    render(
      <Alert type="error" title="Email is required">
        Please enter your email address to continue.
      </Alert>,
    );
    expect(screen.getByText("Email is required")).toHaveAttribute(
      "data-rebar-part",
      "title",
    );
    expect(
      screen.getByText("Please enter your email address to continue."),
    ).toHaveAttribute("data-rebar-part", "description");
  });
});

describe("Alert icon and onClose", () => {
  it("has no icon or close button by default", () => {
    const { container } = render(<Alert title="T">Body</Alert>);
    expect(container.querySelector('[data-rebar-part="icon"]')).toBeNull();
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("icon={true} renders the default glyph for the type; a node is rendered as given", () => {
    const { container, rerender } = render(<Alert type="success" icon>Done</Alert>);
    expect(container.querySelector('[data-rebar-part="icon"]')).toHaveTextContent("✓");
    expect(container.firstElementChild).toHaveAttribute("data-rebar-has-icon", "true");
    rerender(<Alert icon={<b data-testid="custom">*</b>}>Done</Alert>);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("renders a close button that calls onClose", () => {
    let closed = 0;
    render(<Alert onClose={() => { closed++; }}>Body</Alert>);
    screen.getByRole("button", { name: "Close" }).click();
    expect(closed).toBe(1);
  });
});
