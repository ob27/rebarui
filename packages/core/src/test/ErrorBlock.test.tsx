import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ErrorBlock } from "../components/ErrorBlock";

afterEach(cleanup);

describe("ErrorBlock", () => {
  it("renders the default status's default title/description", () => {
    render(<ErrorBlock />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An error occurred. Please try again.")).toBeInTheDocument();
  });

  it("renders each non-empty status's own default copy", () => {
    const { rerender } = render(<ErrorBlock status="disconnected" />);
    expect(screen.getByText("No connection")).toBeInTheDocument();

    rerender(<ErrorBlock status="busy" />);
    expect(screen.getByText("Servers are busy")).toBeInTheDocument();
  });

  it("status='empty' composes the real Empty component", () => {
    const { container } = render(<ErrorBlock status="empty" />);
    expect(container.querySelector("[data-rebar-component='empty']")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("overriding title/description replaces the default copy", () => {
    render(<ErrorBlock status="disconnected" title="Custom title" description="Custom description" />);
    expect(screen.getByText("Custom title")).toBeInTheDocument();
    expect(screen.getByText("Custom description")).toBeInTheDocument();
    expect(screen.queryByText("No connection")).not.toBeInTheDocument();
  });

  it("renders children as a real action area below the description", () => {
    render(
      <ErrorBlock status="default">
        <button type="button">Retry</button>
      </ErrorBlock>,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("carries the expected data-rebar-component/data-rebar-status attributes", () => {
    const { container } = render(<ErrorBlock status="busy" />);
    const root = container.querySelector("[data-rebar-component='error-block']");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-rebar-status", "busy");
  });

  it("fullPage widens the icon via a modifier class", () => {
    const { container } = render(<ErrorBlock fullPage />);
    expect(container.querySelector(".rebar-error-block-full-page")).toBeInTheDocument();
  });

  it("forwards arbitrary data-* props onto the root, for both the empty and non-empty render paths", () => {
    const { container, rerender } = render(<ErrorBlock data-testid="err" />);
    expect(container.querySelector('[data-rebar-component="error-block"]')).toHaveAttribute("data-testid", "err");

    rerender(<ErrorBlock status="empty" data-testid="err-empty" />);
    expect(container.querySelector('[data-rebar-component="error-block"]')).toHaveAttribute(
      "data-testid",
      "err-empty",
    );
  });
});

describe("ErrorBlock neutral statuses", () => {
  const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
  const themeCss = readFileSync(resolve(__dirname, "../../../theme-basilika/src/components.css"), "utf8");

  it("a bare empty renders no error icon and is marked neutral", () => {
    const { container } = render(<ErrorBlock status="empty" />);
    const root = container.querySelector('[data-rebar-component="error-block"]');
    expect(root).toHaveAttribute("data-rebar-tone", "neutral");
    expect(container.querySelector(".rebar-error-block-icon")).not.toBeInTheDocument();
  });

  it("empty with a title and description renders them with a neutral icon, not the error glyph", () => {
    const { container } = render(<ErrorBlock status="empty" title="No projects yet" description="Create one to start." />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
    expect(screen.getByText("Create one to start.")).toBeInTheDocument();
    const root = container.querySelector('[data-rebar-component="error-block"]');
    expect(root).toHaveAttribute("data-rebar-tone", "neutral");
    const errorIcon = render(<ErrorBlock />).container.querySelector(".rebar-error-block-icon")!.innerHTML;
    expect(container.querySelector(".rebar-error-block-icon")!.innerHTML).not.toBe(errorIcon);
  });

  it("info renders its own title, a neutral icon and tone", () => {
    const { container } = render(<ErrorBlock status="info" description="Your library syncs overnight." />);
    expect(screen.getByText("For your information")).toBeInTheDocument();
    expect(screen.getByText("Your library syncs overnight.")).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-status="info"]')).toHaveAttribute("data-rebar-tone", "neutral");
    expect(container.querySelector(".rebar-error-block-icon svg")).toBeInTheDocument();
  });

  it("error statuses are not marked neutral", () => {
    const { container, rerender } = render(<ErrorBlock />);
    const root = () => container.querySelector('[data-rebar-component="error-block"]')!;
    expect(root()).not.toHaveAttribute("data-rebar-tone");
    rerender(<ErrorBlock status="busy" />);
    expect(root()).not.toHaveAttribute("data-rebar-tone");
    rerender(<ErrorBlock status="disconnected" />);
    expect(root()).not.toHaveAttribute("data-rebar-tone");
  });

  it("styles neutral blocks with a secondary icon in core and a tint-3 panel in the basilika theme", () => {
    expect(css).toMatch(/\.rebar-error-block\[data-rebar-tone="neutral"\] \.rebar-error-block-icon \{[^}]*text-secondary/);
    expect(themeCss).toMatch(/\.rebar-error-block\[data-rebar-tone="neutral"\]:not\(\.rebar-error-block-full-page\) \{[^}]*tint-3/);
  });
});
