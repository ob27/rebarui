import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EmailCapture } from "../components/EmailCapture";

function setup(onSubmit: (email: string) => Promise<void> | void = vi.fn()) {
  const utils = render(<EmailCapture onSubmit={onSubmit} data-testid="form" />);
  const input = screen.getByLabelText("Email address") as HTMLInputElement;
  const form = screen.getByTestId("form");
  return { ...utils, input, form, onSubmit };
}

function type(input: HTMLInputElement, value: string) {
  fireEvent.change(input, { target: { value } });
}

describe("EmailCapture", () => {
  it("renders a form with data-rebar-component and idle state", () => {
    const { form } = setup();
    expect(form.tagName).toBe("FORM");
    expect(form).toHaveAttribute("data-rebar-component", "email-capture");
    expect(form).toHaveAttribute("data-rebar-state", "idle");
  });

  it("has an accessible label, placeholder and submit label by default", () => {
    const { input } = setup();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
    expect(screen.getByRole("button", { name: "Notify me" })).toBeInTheDocument();
  });

  it("uses custom copy", () => {
    render(
      <EmailCapture onSubmit={vi.fn()} label="Work email" placeholder="a@b.co" submitLabel="Join" helperText="No spam." />,
    );
    expect(screen.getByLabelText("Work email")).toHaveAttribute("placeholder", "a@b.co");
    expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
    expect(screen.getByText("No spam.")).toBeInTheDocument();
  });

  it("links helper text to the input with aria-describedby", () => {
    render(<EmailCapture onSubmit={vi.fn()} helperText="No spam." />);
    const input = screen.getByLabelText("Email address");
    expect(input.getAttribute("aria-describedby")).toBe(screen.getByText("No spam.").id);
  });

  it("flags an empty submit inline and does not call onSubmit", () => {
    const { input, form, onSubmit } = setup();
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    const error = screen.getByText("Enter your email address.");
    expect(input.getAttribute("aria-describedby")).toContain(error.id);
    expect(input).toHaveFocus();
    expect(form).toHaveAttribute("data-rebar-state", "idle");
  });

  it("flags an invalid address, then clears the error when typing", () => {
    const { input, form, onSubmit } = setup();
    type(input, "not-an-email");
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    type(input, "not-an-email2");
    expect(screen.queryByText("Enter a valid email address.")).toBeNull();
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("submits a trimmed valid address, announces success and clears the input", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { input, form } = setup(onSubmit);
    type(input, "  ada@example.com ");
    fireEvent.submit(form);
    await waitFor(() => expect(form).toHaveAttribute("data-rebar-state", "success"));
    expect(onSubmit).toHaveBeenCalledWith("ada@example.com");
    expect(input.value).toBe("");
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Thanks, you're on the list.");
  });

  it("disables the button while submitting", async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const { input, form } = setup(onSubmit);
    type(input, "ada@example.com");
    fireEvent.submit(form);
    expect(form).toHaveAttribute("data-rebar-state", "submitting");
    expect(screen.getByRole("button", { name: "Notify me" })).toBeDisabled();
    fireEvent.submit(form); // a second submit while in flight is ignored
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => resolve());
    expect(form).toHaveAttribute("data-rebar-state", "success");
    expect(screen.getByRole("button", { name: "Notify me" })).toBeEnabled();
  });

  it("goes to the error state when onSubmit rejects and keeps the address", async () => {
    const { input, form } = setup(vi.fn().mockRejectedValue(new Error("nope")));
    type(input, "ada@example.com");
    fireEvent.submit(form);
    await waitFor(() => expect(form).toHaveAttribute("data-rebar-state", "error"));
    expect(screen.getByRole("status")).toHaveTextContent("Something went wrong. Please try again.");
    expect(input.value).toBe("ada@example.com");
  });

  it("treats a synchronous throw as an error", async () => {
    const { input, form } = setup(() => {
      throw new Error("boom");
    });
    type(input, "ada@example.com");
    fireEvent.submit(form);
    await waitFor(() => expect(form).toHaveAttribute("data-rebar-state", "error"));
  });

  it("returns to idle when the user edits after a result", async () => {
    const { input, form } = setup();
    type(input, "ada@example.com");
    fireEvent.submit(form);
    await waitFor(() => expect(form).toHaveAttribute("data-rebar-state", "success"));
    type(input, "b");
    expect(form).toHaveAttribute("data-rebar-state", "idle");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("honours custom success and error messages", async () => {
    render(
      <EmailCapture onSubmit={vi.fn()} successMessage="Done!" data-testid="form" />,
    );
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "a@b.co" } });
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Done!"));
  });

  it("submits via the real button click (keyboard-equivalent submit)", async () => {
    const onSubmit = vi.fn();
    const { input } = setup(onSubmit);
    type(input, "ada@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Notify me" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("ada@example.com"));
  });
});
