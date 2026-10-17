import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthScreen } from "../components/AuthScreen";

afterEach(cleanup);

describe("AuthScreen", () => {
  it("renders title, description, form column and footer with data attributes", () => {
    render(
      <AuthScreen logo={<b>Athic.</b>} title="Welcome back" description="Sign in to continue" footer={<a href="#up">Sign up</a>} data-testid="a" aria-label="Sign in">
        <input aria-label="Email" />
      </AuthScreen>,
    );
    const root = screen.getByTestId("a");
    expect(root).toHaveAttribute("data-rebar-component", "auth-screen");
    expect(root).toHaveAttribute("data-rebar-tone", "cream");
    expect(root).toHaveAttribute("data-rebar-align", "center");
    expect(screen.getByRole("heading", { level: 1, name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  it("applies tone and align", () => {
    render(<AuthScreen tone="navy" align="start" title="T" data-testid="a" />);
    expect(screen.getByTestId("a")).toHaveAttribute("data-rebar-tone", "navy");
    expect(screen.getByTestId("a")).toHaveAttribute("data-rebar-align", "start");
  });

  it("renders the header slot before the main content", () => {
    render(<AuthScreen header={<div>Top bar</div>} title="Gate" data-testid="a" />);
    const root = screen.getByTestId("a");
    expect(root.firstElementChild).toHaveTextContent("Top bar");
  });

  it("shows step bars and a caption from progress", () => {
    render(<AuthScreen progress={{ label: "Set up", value: 2, total: 3 }} title="T" />);
    const bar = screen.getByRole("progressbar", { name: "Step 2 of 3" });
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar.querySelectorAll("[data-rebar-on]")).toHaveLength(2);
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("Set up")).toBeInTheDocument();
  });

  it("busy disables the form fieldset and blocks footer clicks", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <AuthScreen busy title="T" footer={<button onClick={onClick}>Back</button>} data-testid="a">
        <input aria-label="Email" />
      </AuthScreen>,
    );
    expect(screen.getByTestId("a")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("Email")).toBeDisabled();
    await user.click(screen.getByText("Back"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("not busy leaves the form and footer live", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <AuthScreen title="T" footer={<button onClick={onClick}>Back</button>}>
        <input aria-label="Email" />
      </AuthScreen>,
    );
    expect(screen.getByLabelText("Email")).toBeEnabled();
    await user.click(screen.getByText("Back"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
