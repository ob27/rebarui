import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Form, FormItem } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

type Status = "idle" | "submitting" | "success" | "error";

function Contact({ initial = "idle", onSubmit = vi.fn() }: { initial?: Status; onSubmit?: () => void }) {
  const [status, setStatus] = useState<Status>(initial);
  return (
    <Form
      status={status}
      onSubmit={() => {
        onSubmit();
        setStatus("success");
      }}
      successMessage={
        <>
          <h3>Thanks, we will reply.</h3>
          <Button type="button" onClick={() => setStatus("idle")}>Send another</Button>
        </>
      }
      errorMessage={<strong>We could not send that.</strong>}
    >
      <FormItem name="name" label="Name" required>
        {(field) => <Input {...field} />}
      </FormItem>
      <Button type="submit">Send</Button>
    </Form>
  );
}

describe("Form status", () => {
  it("without status the form renders as before (no fieldset, no state)", () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormItem name="a" label="A">{(f) => <Input {...f} />}</FormItem>
      </Form>,
    );
    const form = document.querySelector("form") as HTMLFormElement;
    expect(form.querySelector("fieldset")).toBeNull();
    expect(form).not.toHaveAttribute("data-rebar-status");
    expect(form).not.toHaveAttribute("aria-busy");
  });

  it("submitting disables the fields and marks the form busy", () => {
    render(<Contact initial="submitting" />);
    expect(document.querySelector("form")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText(/Name/)).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("error shows the message as an alert above the fields and keeps them editable", () => {
    render(<Contact initial="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("We could not send that.");
    expect(screen.getByLabelText(/Name/)).toBeEnabled();
  });

  it("success replaces the form with a status panel; Send another resets the fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Contact onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Name/), "Maria");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Thanks, we will reply.");
    expect(document.querySelector("form")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Send another" }));
    expect(screen.getByLabelText(/Name/)).toHaveValue("");
  });

  it("the honeypot recipe: a hidden field that the app code rejects", async () => {
    const user = userEvent.setup();
    const send = vi.fn();
    render(
      <Form<{ name: string; website: string }> onSubmit={(v) => { if (!v.website) send(v); }}>
        <FormItem name="name" label="Name">{(f) => <Input {...f} />}</FormItem>
        <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
          <FormItem name="website" label="Website">{(f) => <Input tabIndex={-1} autoComplete="off" {...f} />}</FormItem>
        </div>
        <Button type="submit">Send</Button>
      </Form>,
    );
    await user.type(screen.getByLabelText("Name"), "Maria");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(send).toHaveBeenCalledTimes(1);
    // a bot fills the hidden field: app code drops the submission
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "http://spam" } });
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(send).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Website")).toHaveAttribute("tabindex", "-1");
  });
});
