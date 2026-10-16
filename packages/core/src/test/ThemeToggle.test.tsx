import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "../components/ThemeToggle";

// Two looks a host might offer; Rebar itself ships one (basilika), so the style control only exists when a host passes these.
const STYLES = [
  { value: "sketch", label: "Sketch" },
  { value: "clean", label: "Simple" },
];

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-rebar-theme");
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-rebar-bionic");
});

describe("ThemeToggle", () => {
  it("renders a data-rebar-component marker and a Theme trigger by default", () => {
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('[data-rebar-component="theme-toggle"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
  });

  it("accepts a custom trigger label", () => {
    render(<ThemeToggle label="Appearance" />);
    expect(screen.getByRole("button", { name: "Appearance" })).toBeInTheDocument();
  });

  it("defaults the trigger to size sm, and forwards an explicit size override", () => {
    const { container, rerender } = render(<ThemeToggle />);
    expect(container.querySelector('[data-rebar-size="sm"]')).toBeInTheDocument();

    rerender(<ThemeToggle size="md" />);
    expect(container.querySelector('[data-rebar-size="md"]')).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-size="sm"]')).not.toBeInTheDocument();
  });

  it("shows no style control at all unless the host offers at least two styles", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    expect(screen.queryByText("Style")).not.toBeInTheDocument();
    expect(screen.getByText("Mode")).toBeInTheDocument();
    cleanup();
    render(<ThemeToggle styles={[{ value: "basilika", label: "Basilika" }]} />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    expect(screen.queryByText("Style")).not.toBeInTheDocument();
  });

  it("renders nothing when the only named section is style and there is nothing to switch", () => {
    const { container } = render(<ThemeToggle sections={["style"]} />);
    expect(container.querySelector('[data-rebar-component="theme-toggle"]')).not.toBeInTheDocument();
  });

  it("toggles data-rebar-theme between the host's styles", async () => {
    const user = userEvent.setup();
    document.documentElement.removeAttribute("data-rebar-theme");
    render(<ThemeToggle styles={STYLES} />);
    await user.click(screen.getByRole("button", { name: "Theme" }));

    await user.click(screen.getByRole("radio", { name: "Simple" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "clean");

    await user.click(screen.getByRole("radio", { name: "Sketch" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "sketch");
  });

  it("toggles data-theme between dark and (absent) light", async () => {
    const user = userEvent.setup();
    document.documentElement.removeAttribute("data-theme");
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Theme" }));

    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(screen.getByRole("radio", { name: "Light" }));
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("toggles data-rebar-bionic via the Bionic reading switch", async () => {
    const user = userEvent.setup();
    document.documentElement.removeAttribute("data-rebar-bionic");
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Theme" }));

    expect(screen.getByRole("switch", { name: "Bionic reading" })).not.toBeChecked();

    await user.click(screen.getByRole("switch", { name: "Bionic reading" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-bionic", "true");
    expect(screen.getByRole("switch", { name: "Bionic reading" })).toBeChecked();

    await user.click(screen.getByRole("switch", { name: "Bionic reading" }));
    expect(document.documentElement).not.toHaveAttribute("data-rebar-bionic");
  });

  it("sections=['mode'] renders a direct icon-in-thumb switch with no popover trigger", async () => {
    const user = userEvent.setup();
    document.documentElement.removeAttribute("data-theme");
    const { container } = render(<ThemeToggle sections={["mode"]} />);
    expect(container.querySelector('[data-rebar-variant="mode-only"]')).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Theme" })).not.toBeInTheDocument();
    expect(screen.getByText("Light Mode")).toBeInTheDocument();

    await user.click(screen.getByRole("switch", { name: "Dark mode" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });

  it("sections=['style'] renders a direct SegmentedControl with no popover trigger", async () => {
    const user = userEvent.setup();
    document.documentElement.removeAttribute("data-rebar-theme");
    const { container } = render(<ThemeToggle sections={["style"]} styles={STYLES} />);
    expect(container.querySelector('[data-rebar-variant="style-only"]')).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Theme" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Simple" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "clean");
  });

  it("sections=['bionic'] renders a direct labeled switch with no popover trigger", async () => {
    const user = userEvent.setup();
    document.documentElement.removeAttribute("data-rebar-bionic");
    const { container } = render(<ThemeToggle sections={["bionic"]} />);
    expect(container.querySelector('[data-rebar-variant="bionic-only"]')).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Theme" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("switch", { name: "Bionic reading" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-bionic", "true");
  });

  it("sections=['style','bionic'] keeps the popover but hides Mode", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle sections={["style", "bionic"]} styles={STYLES} />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    expect(screen.getByText("Style")).toBeInTheDocument();
    expect(screen.getByText("Bionic reading")).toBeInTheDocument();
    expect(screen.queryByText("Mode")).not.toBeInTheDocument();
  });

  it("reflects whatever the host page already configured on mount, rather than assuming a default", () => {
    document.documentElement.setAttribute("data-rebar-theme", "clean");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.setAttribute("data-rebar-bionic", "true");
    render(<ThemeToggle />);
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "clean");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveAttribute("data-rebar-bionic", "true");
  });

  it("leaves a theme it does not offer alone on mount (a custom brand theme must not be overwritten)", () => {
    document.documentElement.setAttribute("data-rebar-theme", "con");
    render(<ThemeToggle styles={STYLES} />);
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "con");
  });

  it("still lets the visitor switch away from a custom theme with the style control", async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute("data-rebar-theme", "con");
    render(<ThemeToggle styles={STYLES} />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    await user.click(screen.getByRole("radio", { name: "Simple" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "clean");
  });

  it("never writes data-rebar-theme on a page that has none (the default look needs no attribute)", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement).not.toHaveAttribute("data-rebar-theme");
  });

  it("never touches the theme when the style control is not shown, and mode still works", async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute("data-rebar-theme", "con");
    render(<ThemeToggle sections={["mode", "bionic"]} styles={STYLES} />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "con");
  });
});
