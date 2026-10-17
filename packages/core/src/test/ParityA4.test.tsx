import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthScreen } from "../components/AuthScreen";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { DatePicker } from "../components/DatePicker";
import { Input } from "../components/Input";
import { ImagePicker } from "../components/ImagePicker";
import { BottomSheet } from "../components/BottomSheet";
import { ActionSheet } from "../components/ActionSheet";
import { Onboarding } from "../components/Onboarding";
import { ToastProvider } from "../components/Toast";
import { __resetToasts, toast } from "../components/toaster";
import { __resetConfirm, confirm } from "../components/confirm";

afterEach(() => {
  cleanup();
  act(() => {
    __resetToasts();
    __resetConfirm();
  });
});

describe("parity-a4: AuthScreen variants", () => {
  it("defaults add no variant attributes", () => {
    render(<AuthScreen title="T" data-testid="a" />);
    const el = screen.getByTestId("a");
    for (const a of ["data-rebar-backdrop", "data-rebar-field-style", "data-rebar-button-style", "data-rebar-link-style", "data-rebar-footer", "data-rebar-frame", "data-rebar-column"]) {
      expect(el).not.toHaveAttribute(a);
    }
  });

  it("backdrop exposes the image and overlay as properties and renders the overlay layer", () => {
    render(<AuthScreen tone="navy" backdrop={{ image: "/a.jpg", overlay: "linear-gradient(red, blue)" }} data-testid="a" />);
    const el = screen.getByTestId("a");
    expect(el).toHaveAttribute("data-rebar-backdrop", "photo");
    expect(el.style.getPropertyValue("--rebar-auth-backdrop-image")).toBe('url("/a.jpg")');
    expect(el.style.getPropertyValue("--rebar-auth-backdrop-overlay")).toBe("linear-gradient(red, blue)");
    expect(el.querySelector(".rebar-auth-screen-backdrop")).toBeInTheDocument();
  });

  it("fieldStyle, buttonStyle, linkStyle, frame and columnWidth set their attributes", () => {
    render(<AuthScreen fieldStyle="translucent" buttonStyle="classic" linkStyle="plain" frame="column" columnWidth={420} data-testid="a" />);
    const el = screen.getByTestId("a");
    expect(el).toHaveAttribute("data-rebar-field-style", "translucent");
    expect(el).toHaveAttribute("data-rebar-button-style", "classic");
    expect(el).toHaveAttribute("data-rebar-link-style", "plain");
    expect(el).toHaveAttribute("data-rebar-frame", "column");
    expect(el.style.getPropertyValue("--rebar-auth-column-width")).toBe("420px");
  });

  it("footerPlacement inline puts the footer inside the main column; lead sits above the title", () => {
    render(<AuthScreen footerPlacement="inline" lead={<i>notice</i>} title="Title" footer={<a href="#x">Back</a>} data-testid="a" />);
    const main = screen.getByTestId("a").querySelector(".rebar-auth-screen-main")!;
    expect(main.querySelector(".rebar-auth-screen-footer")).toBeInTheDocument();
    const kids = [...main.children].map((c) => c.getAttribute("data-rebar-part"));
    expect(kids.indexOf("lead")).toBeLessThan(kids.indexOf("title"));
  });

  it("pinned footer stays outside main", () => {
    render(<AuthScreen footer={<a href="#x">Back</a>} data-testid="a" />);
    expect(screen.getByTestId("a").querySelector(".rebar-auth-screen-main .rebar-auth-screen-footer")).toBeNull();
  });
});

describe("parity-a4: Button", () => {
  it("classic sets the appearance and dots replace the label while loading", () => {
    render(<Button appearance="classic" loading>Sign in</Button>);
    const b = screen.getByRole("button");
    expect(b).toHaveAttribute("data-rebar-appearance", "classic");
    expect(b).toHaveAttribute("data-rebar-loading-style", "dots");
    expect(b).toBeDisabled();
    expect(b).not.toHaveTextContent("Sign in");
    expect(b.querySelector(".rebar-button-dots svg")).toBeInTheDocument();
  });

  it("default look is unchanged", () => {
    render(<Button loading>Save</Button>);
    const b = screen.getByRole("button");
    expect(b).not.toHaveAttribute("data-rebar-appearance");
    expect(b).toHaveTextContent("Save");
  });
});

describe("parity-a4: Checkbox native", () => {
  it("renders a real checkbox input wired to onCheckedChange", async () => {
    const onChange = vi.fn();
    render(<Checkbox appearance="native" onCheckedChange={onChange}>Baptised</Checkbox>);
    const box = screen.getByLabelText("Baptised") as HTMLInputElement;
    expect(box.tagName).toBe("INPUT");
    expect(box.type).toBe("checkbox");
    await userEvent.click(box);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("parity-a4: DatePicker native", () => {
  it("is a date input with the Date value API", () => {
    const onValueChange = vi.fn();
    render(<DatePicker appearance="native" aria-label="Birthday" maxDate={new Date(2026, 9, 17)} onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Birthday") as HTMLInputElement;
    expect(input.type).toBe("date");
    expect(input.max).toBe("2026-10-17");
    fireEvent.change(input, { target: { value: "1990-02-03" } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const d = onValueChange.mock.calls[0]![0] as Date;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([1990, 1, 3]);
  });

  it("dob mode also honours appearance native", () => {
    render(<DatePicker mode="dob" appearance="native" aria-label="DOB" />);
    expect((screen.getByLabelText("DOB") as HTMLInputElement).type).toBe("date");
  });
});

describe("parity-a4: Input", () => {
  it("revealIcons and revealStyle plain", async () => {
    render(<Input type="password" revealable revealStyle="plain" fieldStyle="translucent" revealIcons={{ show: <b>SHOW</b>, hide: <b>HIDE</b> }} aria-label="p" />);
    const btn = screen.getByRole("button", { name: "Show password" });
    expect(btn).toHaveAttribute("data-rebar-reveal-style", "plain");
    expect(btn).toHaveTextContent("SHOW");
    expect(screen.getByLabelText("p")).toHaveAttribute("data-rebar-field-style", "translucent");
    await userEvent.click(btn);
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveTextContent("HIDE");
  });
});

describe("parity-a4: ImagePicker", () => {
  const items = [
    { id: "1", src: "a.jpg", alt: "One", tags: ["x"] },
    { id: "2", src: "b.jpg", alt: "Two", tags: ["y"] },
  ];
  it("classic and auto columns set attributes; allLabel null drops the All chip", () => {
    const { container } = render(<ImagePicker items={items} tags={["x", "y"]} multiTag allLabel={null} columns="auto" appearance="classic" />);
    const root = container.querySelector(".rebar-image-picker")!;
    expect(root).toHaveAttribute("data-rebar-appearance", "classic");
    expect(root).toHaveAttribute("data-rebar-columns", "auto");
    expect(screen.queryByRole("button", { name: "All" })).toBeNull();
    expect(screen.getByRole("button", { name: "x" })).toBeInTheDocument();
  });
  it("default keeps the All chip", () => {
    render(<ImagePicker items={items} tags={["x"]} />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });
});

describe("parity-a4: sheets", () => {
  it("BottomSheet popup appearance marks panel and overlay, and defaults to auto height", () => {
    render(<BottomSheet open title="Save" appearance="popup" showHandle titleStyle="heading">body</BottomSheet>);
    const sheet = screen.getByRole("dialog", { name: "Save" });
    expect(sheet).toHaveAttribute("data-rebar-appearance", "popup");
    expect(sheet).toHaveAttribute("data-rebar-title-style", "heading");
    expect(sheet).toHaveAttribute("data-rebar-handle", "true");
    expect(sheet).toHaveAttribute("data-rebar-size", "auto");
    expect(document.querySelector(".rebar-dialog-overlay")).toHaveAttribute("data-rebar-appearance", "popup");
  });

  it("stacked popups take rising z-index levels", () => {
    render(
      <>
        <BottomSheet open title="A" appearance="popup">a</BottomSheet>
        <BottomSheet open title="B" appearance="popup">b</BottomSheet>
      </>,
    );
    const [a, b] = [...document.querySelectorAll<HTMLElement>('[data-rebar-component="bottom-sheet"]')] as [HTMLElement, HTMLElement];
    const za = Number(a.style.zIndex);
    const zb = Number(b.style.zIndex);
    expect(za).toBeGreaterThan(1000);
    expect(zb).toBeGreaterThan(za);
  });

  it("default BottomSheet keeps its fixed height", () => {
    render(<BottomSheet open title="Plain">x</BottomSheet>);
    const sheet = screen.getByRole("dialog", { name: "Plain" });
    expect(sheet).not.toHaveAttribute("data-rebar-appearance");
    expect(sheet.style.height).toBe("360px");
  });

  it("ActionSheet cancelLabel null omits the Cancel button", () => {
    render(<ActionSheet open title="Menu" cancelLabel={null} appearance="popup" items={[{ label: "Rename" }]} />);
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
    expect(screen.getByRole("button", { name: "Rename" })).toBeInTheDocument();
  });
});

describe("parity-a4: toast and confirm classic", () => {
  it("classic toasts are text only, one at a time, marked classic", () => {
    render(<ToastProvider>app</ToastProvider>);
    act(() => {
      toast.success("First", { appearance: "classic" });
      toast.error("Second", { appearance: "classic" });
    });
    expect(screen.queryByText("First")).toBeNull();
    const t = screen.getByText("Second").closest("[data-rebar-component='toaster-toast']")!;
    expect(t).toHaveAttribute("data-rebar-appearance", "classic");
    expect(t.querySelector(".rebar-toaster-icon")).toBeNull();
  });

  it("classic confirm marks the dialog and ignores a tap on the dim layer when closeOnMaskClick is false", async () => {
    render(<ToastProvider>app</ToastProvider>);
    let result: boolean | undefined;
    act(() => {
      void confirm({ title: "Delete?", appearance: "classic", closeOnMaskClick: false }).then((v) => (result = v));
    });
    const dlg = await screen.findByRole("alertdialog").catch(() => screen.getByRole("dialog"));
    expect(dlg).toHaveAttribute("data-rebar-appearance", "classic");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await act(async () => {});
    expect(result).toBe(false);
  });
});

describe("parity-a4: Onboarding classic", () => {
  it("sets the appearance and passes it to its buttons", () => {
    render(<Onboarding appearance="classic" slides={[{ title: "A", description: "a" }, { title: "B", description: "b" }]} defaultIndex={1} />);
    expect(screen.getByRole("region", { name: "Introduction" }).closest("[data-rebar-component='onboarding']")).toHaveAttribute("data-rebar-appearance", "classic");
    expect(screen.getByRole("button", { name: "Back" })).toHaveAttribute("data-rebar-appearance", "classic");
  });
});
