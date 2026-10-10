import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeviceFrame } from "../components/DeviceFrame";

describe("DeviceFrame", () => {
  it("renders a figure with data-rebar-component and defaults to the phone variant", () => {
    render(
      <DeviceFrame data-testid="frame">
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    const root = screen.getByTestId("frame");
    expect(root.tagName).toBe("FIGURE");
    expect(root).toHaveAttribute("data-rebar-component", "device-frame");
    expect(root).toHaveAttribute("data-rebar-variant", "phone");
  });

  it("has bezel, screen and notch parts for the phone, with a decorative bezel", () => {
    render(
      <DeviceFrame>
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="bezel"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[data-rebar-part="notch"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[data-rebar-part="screen"]')).not.toBeNull();
    expect(document.querySelector('[data-rebar-part="toolbar"]')).toBeNull();
  });

  it("keeps the screen content accessible", () => {
    render(
      <DeviceFrame>
        <img src="/x.png" alt="App home screen" />
      </DeviceFrame>,
    );
    expect(screen.getByRole("img", { name: "App home screen" })).toBeInTheDocument();
    expect(document.querySelector('[data-rebar-part="screen"]')?.closest("[aria-hidden]")).toBeNull();
  });

  it("tablet has no notch or toolbar", () => {
    render(
      <DeviceFrame variant="tablet">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(document.querySelector('[data-rebar-part="notch"]')).toBeNull();
    expect(document.querySelector('[data-rebar-part="toolbar"]')).toBeNull();
  });

  it("browser shows the title in a decorative toolbar", () => {
    render(
      <DeviceFrame variant="browser" title="athic.com">
        <img src="/x.png" alt="Dashboard" />
      </DeviceFrame>,
    );
    const toolbar = document.querySelector('[data-rebar-part="toolbar"]');
    expect(toolbar).toHaveAttribute("aria-hidden", "true");
    expect(toolbar).toHaveTextContent("athic.com");
    expect(document.querySelector('[data-rebar-part="notch"]')).toBeNull();
  });

  it("ignores title for non-browser variants", () => {
    render(
      <DeviceFrame variant="phone" title="athic.com">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(screen.queryByText("athic.com")).toBeNull();
  });

  it("renders a caption as a figcaption", () => {
    render(
      <DeviceFrame caption="Home screen">
        <img src="/x.png" alt="" />
      </DeviceFrame>,
    );
    expect(screen.getByText("Home screen").tagName).toBe("FIGCAPTION");
  });
});
