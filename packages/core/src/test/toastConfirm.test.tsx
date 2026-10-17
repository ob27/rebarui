import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "../components/Toast";
import { __resetToasts, toast, useToast } from "../components/toaster";
import { __resetConfirm, confirm, useConfirm } from "../components/confirm";

afterEach(() => {
  act(() => {
    __resetToasts();
    __resetConfirm();
  });
});

describe("toast()", () => {
  it("shows a toast from anywhere and returns an id", () => {
    render(<ToastProvider>app</ToastProvider>);
    let id = "";
    act(() => {
      id = toast("Added to Topic");
    });
    expect(id).toBeTruthy();
    expect(screen.getByRole("status")).toHaveTextContent("Added to Topic");
  });

  it("shortcuts set the type, and errors are alerts", () => {
    render(<ToastProvider max={4}>app</ToastProvider>);
    act(() => {
      toast.success("Saved");
      toast.error("Could not reach Athic");
      toast.info("FYI");
      toast.loading("Generating");
    });
    expect(screen.getByText("Saved").closest("[data-rebar-type]")).toHaveAttribute("data-rebar-type", "success");
    expect(screen.getByRole("alert")).toHaveTextContent("Could not reach Athic");
    expect(screen.getByText("FYI").closest("[data-rebar-type]")).toHaveAttribute("data-rebar-type", "info");
    expect(screen.getByText("Generating").closest("[data-rebar-type]")).toHaveAttribute("data-rebar-type", "loading");
  });

  it("the same id replaces instead of stacking", () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      toast("one", { id: "x" });
      toast("two", { id: "x" });
    });
    expect(screen.queryByText("one")).not.toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(document.querySelectorAll('[data-rebar-component="toaster-toast"]')).toHaveLength(1);
  });

  it("dismiss removes one or all", () => {
    render(<ToastProvider>app</ToastProvider>);
    let a = "";
    act(() => {
      a = toast("a");
      toast("b");
    });
    act(() => toast.dismiss(a));
    expect(screen.queryByText("a")).not.toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    act(() => toast.dismiss());
    expect(screen.queryByText("b")).not.toBeInTheDocument();
  });

  it("max limits the visible stack and older toasts are marked stacked", () => {
    render(<ToastProvider max={2}>app</ToastProvider>);
    act(() => {
      toast("one");
      toast("two");
      toast("three");
    });
    expect(screen.queryByText("one")).not.toBeInTheDocument();
    expect(screen.getByText("two").closest("[data-rebar-type]")).toHaveAttribute("data-rebar-stacked", "true");
    expect(screen.getByText("three").closest("[data-rebar-type]")).not.toHaveAttribute("data-rebar-stacked");
  });

  it("positions land in their own region", () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      toast("top one", { position: "top" });
      toast("centre one", { position: "center" });
    });
    const regions = screen.getAllByRole("region", { name: "Notifications" });
    expect(regions.map((r) => r.getAttribute("data-rebar-position")).sort()).toEqual(["center", "top"]);
  });

  it("an action runs its handler and dismisses the toast", async () => {
    const onClick = vi.fn();
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      toast.success("Discussion deleted", { action: { label: "Undo", onClick } });
    });
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.queryByText("Discussion deleted")).not.toBeInTheDocument();
  });

  it("promise swaps loading to success", async () => {
    render(<ToastProvider>app</ToastProvider>);
    let resolve: (v: string) => void = () => {};
    const p = new Promise<string>((r) => (resolve = r));
    act(() => {
      toast.promise(p, { loading: "Saving", success: (v) => `Saved ${v}`, error: "Failed" });
    });
    expect(screen.getByText("Saving")).toBeInTheDocument();
    await act(async () => {
      resolve("ok");
      await p;
    });
    expect(screen.getByText("Saved ok")).toBeInTheDocument();
    expect(screen.queryByText("Saving")).not.toBeInTheDocument();
  });

  it("promise swaps to error on rejection", async () => {
    render(<ToastProvider>app</ToastProvider>);
    const p = Promise.reject(new Error("no"));
    p.catch(() => {});
    act(() => {
      toast.promise(p, { loading: "Saving", success: "Saved", error: "Could not save" });
    });
    await waitFor(() => expect(screen.getByText("Could not save")).toBeInTheDocument());
  });

  it("useToast returns the same function", () => {
    function Probe() {
      const t = useToast();
      return <button onClick={() => t.success("from hook")}>go</button>;
    }
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    return userEvent.click(screen.getByRole("button", { name: "go" })).then(() => {
      expect(screen.getByText("from hook")).toBeInTheDocument();
    });
  });

  it("a nested provider does not double-host", () => {
    render(
      <ToastProvider>
        <ToastProvider>inner</ToastProvider>
      </ToastProvider>,
    );
    act(() => {
      toast("only once");
    });
    expect(screen.getAllByText("only once")).toHaveLength(1);
  });

  describe("timers", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("auto-dismisses after 2500ms, errors after 4000ms, loading never", () => {
      render(<ToastProvider>app</ToastProvider>);
      act(() => {
        toast("plain");
        toast.error("bad");
        toast.loading("busy");
      });
      act(() => {
        vi.advanceTimersByTime(2600);
      });
      expect(screen.queryByText("plain")).not.toBeInTheDocument();
      expect(screen.getByText("bad")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(screen.queryByText("bad")).not.toBeInTheDocument();
      expect(screen.getByText("busy")).toBeInTheDocument();
    });

    it("duration null persists", () => {
      render(<ToastProvider>app</ToastProvider>);
      act(() => {
        toast("stays", { duration: null });
      });
      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText("stays")).toBeInTheDocument();
    });
  });
});

describe("confirm()", () => {
  it("resolves true on confirm", async () => {
    render(<ToastProvider>app</ToastProvider>);
    let result: Promise<boolean> = Promise.resolve(false);
    act(() => {
      result = confirm({ title: "Delete this discussion?", content: "This can't be undone.", confirmText: "Delete" });
    });
    expect(await screen.findByRole("dialog", { name: "Delete this discussion?" })).toBeInTheDocument();
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await expect(result).resolves.toBe(true);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("resolves false on cancel and on Escape", async () => {
    render(<ToastProvider>app</ToastProvider>);
    let first: Promise<boolean> = Promise.resolve(true);
    act(() => {
      first = confirm({ title: "Sure?" });
    });
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    await expect(first).resolves.toBe(false);
    let second: Promise<boolean> = Promise.resolve(true);
    act(() => {
      second = confirm({ title: "Again?" });
    });
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await expect(second).resolves.toBe(false);
  });

  it("queues calls: one dialog at a time", async () => {
    render(<ToastProvider>app</ToastProvider>);
    let a: Promise<boolean> = Promise.resolve(false);
    let b: Promise<boolean> = Promise.resolve(false);
    act(() => {
      a = confirm({ title: "First?" });
      b = confirm({ title: "Second?" });
    });
    expect(await screen.findByRole("dialog", { name: "First?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await a;
    expect(await screen.findByRole("dialog", { name: "Second?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expect(b).resolves.toBe(false);
  });

  it("shows the description quote and the stacked layout", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Remove?", description: "Why do Catholics confess to a priest?", layout: "stacked" });
    });
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("data-rebar-layout", "stacked");
    expect(screen.getByText("Why do Catholics confess to a priest?")).toHaveAttribute("data-rebar-part", "description");
  });

  it("destructive focuses Cancel first and marks the confirm button", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Delete?", destructive: true, confirmText: "Delete" });
    });
    await screen.findByRole("dialog");
    await waitFor(() => expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus());
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute("data-rebar-variant", "destructive-solid");
  });

  it("uses confirmText and cancelText for the two buttons", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Leave the group?", confirmText: "Leave", cancelText: "Stay" });
    });
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Leave" })).toHaveAttribute("data-rebar-part", "confirm");
    expect(screen.getByRole("button", { name: "Stay" })).toHaveAttribute("data-rebar-part", "cancel");
  });

  it("defaults the labels to Confirm and Cancel", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Sure?" });
    });
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute("data-rebar-part", "confirm");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("destructive without confirmText labels the confirm button Delete", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Delete this?", destructive: true });
    });
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute("data-rebar-variant", "destructive-solid");
    expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument();
  });

  it("an explicit confirmText wins over the destructive default", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Remove?", destructive: true, confirmText: "Remove" });
    });
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("onConfirm keeps the dialog busy until it settles", async () => {
    render(<ToastProvider>app</ToastProvider>);
    let release: () => void = () => {};
    const work = new Promise<void>((r) => (release = r));
    let result: Promise<boolean> = Promise.resolve(false);
    act(() => {
      result = confirm({ title: "Delete?", confirmText: "Delete", onConfirm: () => work });
    });
    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-busy", "true");
    await act(async () => {
      release();
      await work;
    });
    await expect(result).resolves.toBe(true);
  });

  it("a rejected onConfirm shows an error toast and stays open", async () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      void confirm({ title: "Delete?", confirmText: "Delete", onConfirm: () => Promise.reject(new Error("x")) });
    });
    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
    await waitFor(() => expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent("Could not complete that"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).not.toBeDisabled();
  });

  it("useConfirm returns the same function", () => {
    function Probe() {
      return <span>{useConfirm() === confirm ? "same" : "different"}</span>;
    }
    render(<Probe />);
    expect(screen.getByText("same")).toBeInTheDocument();
  });
});
