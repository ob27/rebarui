import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../components/Avatar";

describe("Avatar", () => {
  it("shows the fallback initials (Radix defers the image until it loads, which jsdom never does)", () => {
    render(<Avatar src="https://example.com/avatar.png" alt="Ada Lovelace" fallback="AL" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("carries data-rebar-component on the root", () => {
    render(<Avatar fallback="AL" />);
    expect(screen.getByText("AL").closest('[data-rebar-component="avatar"]')).not.toBeNull();
  });
});
