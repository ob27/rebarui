import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RebarDevTools } from "../RebarDevTools";

afterEach(() => {
  document.documentElement.removeAttribute("data-rebar-theme");
  document.documentElement.removeAttribute("data-theme");
});

describe("RebarDevTools", () => {
  it("renders nothing outside development, even with real components on the page", () => {
    document.body.innerHTML = `<div data-rebar-component="button"></div>`;
    const { container } = render(<RebarDevTools />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the toggle when forced on (simulating a development build)", () => {
    render(<RebarDevTools forceEnabled />);
    expect(screen.getByRole("button", { name: "Rebar DevTools" })).toBeInTheDocument();
  });

  it("opens the panel and shows real component counts from the page", async () => {
    document.body.innerHTML = `
      <div data-rebar-component="button"></div>
      <div data-rebar-component="button"></div>
    `;
    const user = userEvent.setup();
    render(<RebarDevTools forceEnabled />);

    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));

    const stat = await screen.findByText("Components on this page");
    expect(stat.closest(".rebar-devtools-stat")).toHaveTextContent("2");
    expect(screen.getByText("button")).toBeInTheDocument();
  });

  it("doesn't clobber the page's real theme on mount — reads it instead of hardcoding sketch", async () => {
    // Regression test: this used to hardcode its initial state to "sketch" and write that
    // straight to <html> on mount, silently overriding a consuming app's real configured theme
    // (e.g. a layout that sets data-rebar-theme="clean") the instant DevTools mounted, before
    // anyone touched the panel.
    document.documentElement.setAttribute("data-rebar-theme", "clean");
    const user = userEvent.setup();
    render(<RebarDevTools forceEnabled />);
    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));

    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "clean");
    expect(screen.getByRole("radio", { name: "Clean theme" })).toBeChecked();
  });

  it("writes data-rebar-theme and data-theme on the document root when toggled", async () => {
    const user = userEvent.setup();
    render(<RebarDevTools forceEnabled />);
    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));

    await user.click(screen.getByRole("radio", { name: "Sketch theme" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "sketch");

    await user.click(screen.getByRole("radio", { name: "Clean theme" }));
    expect(document.documentElement).toHaveAttribute("data-rebar-theme", "clean");

    await user.click(screen.getByRole("checkbox", { name: "Dark mode" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(screen.getByRole("checkbox", { name: "Dark mode" }));
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("shows the 8pt grid overlay only once toggled on", async () => {
    const user = userEvent.setup();
    render(<RebarDevTools forceEnabled />);
    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));

    expect(document.querySelector('[data-rebar-component="devtools-grid"]')).toBeNull();

    await user.click(screen.getByRole("checkbox", { name: "Show 8pt grid" }));
    expect(document.querySelector('[data-rebar-component="devtools-grid"]')).not.toBeNull();
  });

  it("exports a JSON report reflecting real counts and the effort estimate, not fake tokens/dollars", async () => {
    document.body.innerHTML = `<div data-rebar-component="button"></div>`;
    const user = userEvent.setup();

    const capturedParts: BlobPart[][] = [];
    class MockBlob {
      constructor(parts: BlobPart[]) {
        capturedParts.push(parts);
      }
    }
    vi.stubGlobal("Blob", MockBlob);
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:mock"), revokeObjectURL: vi.fn() });

    render(<RebarDevTools forceEnabled />);
    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));
    await screen.findByText("button");
    await user.click(screen.getByRole("button", { name: "Export report (JSON)" }));

    expect(capturedParts).toHaveLength(1);
    const report = JSON.parse(capturedParts[0]![0] as string);
    expect(report.componentsByType).toEqual({ button: 1 });
    expect(report.migrationEffort).not.toHaveProperty("dollars");
    expect(report.migrationEffort.note).toMatch(/not a measured cost/);
    expect(report.tokenEstimate).toHaveProperty("antdDirect");
    expect(report.tokenEstimate).toHaveProperty("rebarOnly");
    expect(report.tokenEstimate).toHaveProperty("rebarThenMigrate");
    expect(report.tokenEstimate.note).toMatch(/documented estimation model/);

    vi.unstubAllGlobals();
  });

  it("shows the three-way token estimate without an editable iterations control", async () => {
    document.body.innerHTML = `<div data-rebar-component="form"></div>`;
    const user = userEvent.setup();
    render(<RebarDevTools forceEnabled />);
    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));
    await screen.findByText("Rebar only");

    expect(screen.getByText("AntD, built directly")).toBeInTheDocument();
    expect(screen.getByText("Rebar, then migrate once")).toBeInTheDocument();
    expect(screen.queryByLabelText("Assumed logic iterations")).not.toBeInTheDocument();
  });

  it("shows a breakeven-iterations hint derived from the estimate, not a fixed claim", async () => {
    document.body.innerHTML = `<div data-rebar-component="form"></div>`;
    const user = userEvent.setup();
    render(<RebarDevTools forceEnabled />);
    await user.click(screen.getByRole("button", { name: "Rebar DevTools" }));
    await screen.findByText("Rebar only");

    expect(screen.getByText(/Pays for itself after ~\d+ revisions/)).toBeInTheDocument();
  });
});
