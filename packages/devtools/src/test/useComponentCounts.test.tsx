import { describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useComponentCounts } from "../useComponentCounts";

function Probe({ enabled }: { enabled: boolean }) {
  const counts = useComponentCounts(enabled);
  return <pre data-testid="counts">{JSON.stringify(counts)}</pre>;
}

describe("useComponentCounts", () => {
  it("counts real data-rebar-component elements already in the document", async () => {
    document.body.innerHTML = `
      <div data-rebar-component="button"></div>
      <div data-rebar-component="button"></div>
      <div data-rebar-component="card"></div>
    `;

    const { getByTestId } = render(<Probe enabled />);

    await waitFor(() => {
      const counts = JSON.parse(getByTestId("counts").textContent ?? "{}");
      expect(counts.total).toBe(3);
      expect(counts.byType).toEqual({ button: 2, card: 1 });
    });
  });

  it("excludes the devtools panel's own elements from the count", async () => {
    document.body.innerHTML = `
      <div data-rebar-component="button"></div>
      <div data-rebar-component="devtools"></div>
      <div data-rebar-component="devtools-grid"></div>
    `;

    const { getByTestId } = render(<Probe enabled />);

    await waitFor(() => {
      const counts = JSON.parse(getByTestId("counts").textContent ?? "{}");
      expect(counts.total).toBe(1);
      expect(counts.byType).toEqual({ button: 1 });
    });
  });

  it("does not scan while disabled", () => {
    document.body.innerHTML = `<div data-rebar-component="button"></div>`;
    const { getByTestId } = render(<Probe enabled={false} />);
    const counts = JSON.parse(getByTestId("counts").textContent ?? "{}");
    expect(counts.total).toBe(0);
  });
});
